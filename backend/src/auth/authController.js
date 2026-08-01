const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = require("../config/prisma");
const { getJwtSecret } = require("../config/env");
const {
    AUDIT_ACTIONS,
    recordAuditLog
} = require("../services/auditService");


const registerUser = async (req, res, next) => {

    try {

        const { email, password } = req.body;


        // Check existing user
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });


        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);


        // Create user
        const user = await prisma.user.create({
            data: {
                email: email,
                passwordHash: passwordHash
            }
        });


        res.status(201).json({
            message: "User registered successfully",
            userId: user.id
        });


    } catch (error) {

        next(error);

    }

};


const loginUser = async (req, res, next) => {

    try {

        const { email, password } = req.body;


        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });


        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


        const passwordMatch = await bcrypt.compare(
            password,
            user.passwordHash
        );


        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            getJwtSecret(),
            {
                algorithm: "HS256",
                expiresIn: "1h"
            }
        );

        await recordAuditLog(user.id, AUDIT_ACTIONS.LOGIN);

        res.json({
            message: "Login successful",
            token: token
        });


    } catch (error) {

        next(error);

    }

};

module.exports = {
    registerUser,
    loginUser
};
