const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = require("../config/prisma");
const { getJwtSecret } = require("../config/env");
const { validatePassword } = require("../services/passwordValidator");
const {
    AUDIT_ACTIONS,
    createAuditLog
} = require("../services/auditService");


const registerUser = async (req, res, next) => {

    try {

        const { email, password } = req.body;

        const passwordValidationMessage = validatePassword(password);

        if (passwordValidationMessage) {
            return res.status(400).json({
                message: passwordValidationMessage
            });
        }


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

        await createAuditLog({
            userId: user.id,
            action: AUDIT_ACTIONS.USER_REGISTERED
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
            await createAuditLog({
                action: AUDIT_ACTIONS.LOGIN_FAILED,
                details: JSON.stringify({
                    email,
                    reason: "USER_NOT_FOUND"
                })
            });

            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
            return res.status(423).json({
                message: "Account temporarily locked"
            });
        }


        const passwordMatch = await bcrypt.compare(
            password,
            user.passwordHash
        );


        if (!passwordMatch) {
            const failedLoginState = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    failedLoginAttempts: {
                        increment: 1
                    }
                },
                select: {
                    failedLoginAttempts: true
                }
            });

            if (failedLoginState.failedLoginAttempts >= 5) {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        lockedUntil: new Date(Date.now() + 15 * 60 * 1000)
                    }
                });
            }

            await createAuditLog({
                userId: user.id,
                action: AUDIT_ACTIONS.LOGIN_FAILED,
                details: JSON.stringify({
                    email,
                    reason: "INCORRECT_PASSWORD"
                })
            });

            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                failedLoginAttempts: 0,
                lockedUntil: null
            }
        });


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

        await createAuditLog({
            userId: user.id,
            action: AUDIT_ACTIONS.LOGIN
        });

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
