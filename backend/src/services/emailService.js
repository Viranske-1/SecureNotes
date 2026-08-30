const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendOtpEmail = async (email, otp) => {
    if (typeof email !== "string" || !email.trim()) {
        throw new Error("A recipient email address is required");
    }

    const normalizedOtp = String(otp);

    if (!/^\d{6}$/.test(normalizedOtp)) {
        throw new Error("OTP must be a 6-digit numeric code");
    }

    return transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "SecureNotes Verification Code",
        text: `Your SecureNotes verification code is ${normalizedOtp}. It expires in 5 minutes.`,
        html: [
            "<p>Your SecureNotes verification code is:</p>",
            `<p><strong>${normalizedOtp}</strong></p>`,
            "<p>This code expires in 5 minutes.</p>"
        ].join("")
    });
};

module.exports = {
    sendOtpEmail
};
