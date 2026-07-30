const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

const getEncryptionKey = () => {
    const encryptionKey = process.env.ENCRYPTION_KEY;

    if (
        typeof encryptionKey !== "string"
        || !/^[0-9a-fA-F]{64}$/.test(encryptionKey)
    ) {
        const error = new Error("Encryption service is not configured");
        error.code = "ENCRYPTION_CONFIGURATION_ERROR";
        throw error;
    }

    return Buffer.from(encryptionKey, "hex");
};

const encrypt = (text) => {
    if (typeof text !== "string") {
        const error = new Error("Invalid plaintext");
        error.code = "ENCRYPTION_INPUT_ERROR";
        throw error;
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
    const ciphertext = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final()
    ]);
    const authenticationTag = cipher.getAuthTag();

    return JSON.stringify({
        version: 1,
        iv: iv.toString("base64"),
        ciphertext: ciphertext.toString("base64"),
        authenticationTag: authenticationTag.toString("base64")
    });
};

const decrypt = (encryptedPayload) => {
    try {
        const payload = JSON.parse(encryptedPayload);

        if (
            payload.version !== 1
            || typeof payload.iv !== "string"
            || typeof payload.ciphertext !== "string"
            || typeof payload.authenticationTag !== "string"
        ) {
            throw new Error("Invalid encrypted payload");
        }

        const iv = Buffer.from(payload.iv, "base64");
        const ciphertext = Buffer.from(payload.ciphertext, "base64");
        const authenticationTag = Buffer.from(
            payload.authenticationTag,
            "base64"
        );

        if (iv.length !== IV_LENGTH || authenticationTag.length !== AUTH_TAG_LENGTH) {
            throw new Error("Invalid encrypted payload");
        }

        const decipher = crypto.createDecipheriv(
            ALGORITHM,
            getEncryptionKey(),
            iv
        );
        decipher.setAuthTag(authenticationTag);

        return Buffer.concat([
            decipher.update(ciphertext),
            decipher.final()
        ]).toString("utf8");
    } catch (error) {
        if (error.code === "ENCRYPTION_CONFIGURATION_ERROR") {
            throw error;
        }

        const controlledError = new Error("Unable to decrypt note");
        controlledError.code = "DECRYPTION_ERROR";
        throw controlledError;
    }
};

module.exports = {
    encrypt,
    decrypt
};
