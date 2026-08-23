const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const prisma = require("../config/prisma");

const OTP_EXPIRY_MINUTES = 5;
const OTP_HASH_ROUNDS = 10;

const generateOtp = () => {
    return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
};

const hashOtp = async (otp) => {
    if (typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
        throw new Error("OTP must be a 6-digit numeric string");
    }

    return bcrypt.hash(otp, OTP_HASH_ROUNDS);
};

const getSmtpConfig = () => {
    const requiredVariables = [
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_PASS",
        "SMTP_FROM"
    ];
    const missingVariables = requiredVariables.filter(
        (name) => !process.env[name] || !process.env[name].trim()
    );

    if (missingVariables.length > 0) {
        const error = new Error(
            `Email service is not configured: missing ${missingVariables.join(", ")}`
        );
        error.code = "EMAIL_CONFIGURATION_ERROR";
        throw error;
    }

    const port = Number(process.env.SMTP_PORT);

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        const error = new Error("Email service is not configured: invalid SMTP_PORT");
        error.code = "EMAIL_CONFIGURATION_ERROR";
        throw error;
    }

    return {
        host: process.env.SMTP_HOST,
        port,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        from: process.env.SMTP_FROM
    };
};

const sendOtpEmail = async ({ email, otp }) => {
    if (typeof email !== "string" || !email.trim()) {
        throw new Error("A recipient email address is required");
    }

    if (typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
        throw new Error("OTP must be a 6-digit numeric string");
    }

    const { from, ...transportConfig } = getSmtpConfig();
    const transporter = nodemailer.createTransport(transportConfig);

    return transporter.sendMail({
        from,
        to: email,
        subject: "Your SecureNotes verification code",
        text: `Your SecureNotes verification code is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
        html: `<p>Your SecureNotes verification code is <strong>${otp}</strong>.</p><p>It expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`
    });
};

const issueEmailOtp = async ({ userId, email }) => {
    if (!Number.isInteger(userId) || userId < 1) {
        throw new Error("A valid user ID is required");
    }

    const otp = generateOtp();
    const otpHash = await hashOtp(otp);
    const otpExpiresAt = new Date(
        Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    await prisma.user.update({
        where: { id: userId },
        data: {
            otpHash,
            otpExpiresAt
        }
    });

    await sendOtpEmail({ email, otp });

    return { otpExpiresAt };
};

module.exports = {
    generateOtp,
    hashOtp,
    issueEmailOtp,
    sendOtpEmail
};
