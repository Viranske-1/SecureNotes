const dotenv = require("dotenv");

dotenv.config({ quiet: true });

const getJwtSecret = () => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret || !jwtSecret.trim()) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwtSecret;
};

const getFrontendUrl = () => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    return frontendUrl.replace(/\/+$/, "");
};

module.exports = {
    getFrontendUrl,
    getJwtSecret
};
