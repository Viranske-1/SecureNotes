const dotenv = require("dotenv");

dotenv.config();

const getJwtSecret = () => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret || !jwtSecret.trim()) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwtSecret;
};

module.exports = {
    getJwtSecret
};
