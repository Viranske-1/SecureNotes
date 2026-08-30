const crypto = require("crypto");

const OTP_EXPIRY_MINUTES = 5;

const generateOtp = () => {
    return crypto.randomInt(100_000, 1_000_000).toString();
};

const hashOtp = (otp) => {
    const normalizedOtp = String(otp);

    if (!/^\d{6}$/.test(normalizedOtp)) {
        throw new Error("OTP must be a 6-digit numeric code");
    }

    return crypto.createHash("sha256").update(normalizedOtp).digest("hex");
};

const createOtpExpiry = () => {
    return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
};

module.exports = {
    createOtpExpiry,
    generateOtp,
    hashOtp
};
