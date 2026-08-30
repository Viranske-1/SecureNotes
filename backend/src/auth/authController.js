const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = require("../config/prisma");
const { getJwtSecret } = require("../config/env");
const { validatePassword } = require("../services/passwordValidator");
const { sendOtpEmail } = require("../services/emailService");
const {
    createOtpExpiry,
    generateOtp,
    hashOtp
} = require("../services/otpService");
const {
    AUDIT_ACTIONS,
    createAuditLog
} = require("../services/auditService");

const MFA_CHALLENGE_PURPOSE = "EMAIL_OTP_LOGIN";

const signAccessToken = (user) => jwt.sign(
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

const signMfaChallenge = ({ userId, otpExpiresAt }) => jwt.sign(
    {
        userId,
        purpose: MFA_CHALLENGE_PURPOSE,
        otpExpiresAt: otpExpiresAt.getTime()
    },
    getJwtSecret(),
    {
        algorithm: "HS256",
        expiresIn: "5m"
    }
);


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


        const otp = generateOtp();
        const otpHash = hashOtp(otp);
        const otpExpiresAt = createOtpExpiry();

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                otpHash,
                otpExpiresAt
            }
        });

        try {
            await sendOtpEmail(user.email, otp);
        } catch (error) {
            await prisma.user.updateMany({
                where: {
                    id: user.id,
                    otpHash
                },
                data: {
                    otpHash: null,
                    otpExpiresAt: null
                }
            });

            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }

        const challengeToken = signMfaChallenge({
            userId: user.id,
            otpExpiresAt
        });

        res.json({
            message: "OTP verification required",
            mfaRequired: true,
            challengeToken
        });


    } catch (error) {

        next(error);

    }

};

const verifyOtp = async (req, res, next) => {

    try {

        const { challengeToken, otp } = req.body || {};

        if (
            typeof challengeToken !== "string"
            || !challengeToken.trim()
            || typeof otp !== "string"
            || !/^\d{6}$/.test(otp)
        ) {
            return res.status(401).json({
                message: "Invalid or expired verification code"
            });
        }

        let challenge;

        try {
            challenge = jwt.verify(challengeToken, getJwtSecret(), {
                algorithms: ["HS256"]
            });
        } catch (error) {
            return res.status(401).json({
                message: "Invalid or expired verification code"
            });
        }

        if (
            typeof challenge !== "object"
            || challenge === null
            || !Number.isInteger(challenge.userId)
            || challenge.purpose !== MFA_CHALLENGE_PURPOSE
            || !Number.isInteger(challenge.otpExpiresAt)
        ) {
            return res.status(401).json({
                message: "Invalid or expired verification code"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: challenge.userId
            }
        });

        const now = new Date();

        if (
            !user
            || !user.otpHash
            || !user.otpExpiresAt
            || user.otpExpiresAt <= now
            || user.otpExpiresAt.getTime() !== challenge.otpExpiresAt
        ) {
            return res.status(401).json({
                message: "Invalid or expired verification code"
            });
        }

        const submittedOtpHash = hashOtp(otp);
        const submittedHashBuffer = Buffer.from(submittedOtpHash, "hex");
        const storedHashBuffer = Buffer.from(user.otpHash, "hex");
        const otpMatch = submittedHashBuffer.length === storedHashBuffer.length
            && crypto.timingSafeEqual(submittedHashBuffer, storedHashBuffer);

        if (!otpMatch) {
            return res.status(401).json({
                message: "Invalid or expired verification code"
            });
        }

        const clearedOtp = await prisma.user.updateMany({
            where: {
                id: user.id,
                otpHash: user.otpHash,
                otpExpiresAt: {
                    gt: now
                }
            },
            data: {
                otpHash: null,
                otpExpiresAt: null
            }
        });

        if (clearedOtp.count !== 1) {
            return res.status(401).json({
                message: "Invalid or expired verification code"
            });
        }

        const token = signAccessToken(user);

        await createAuditLog({
            userId: user.id,
            action: AUDIT_ACTIONS.LOGIN
        });

        return res.json({
            message: "Login successful",
            token
        });

    } catch (error) {

        next(error);

    }

};

module.exports = {
    registerUser,
    loginUser,
    verifyOtp
};
