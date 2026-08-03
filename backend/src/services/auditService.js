const prisma = require("../config/prisma");

const AUDIT_ACTIONS = Object.freeze({
    USER_REGISTERED: "USER_REGISTERED",
    LOGIN: "LOGIN",
    LOGIN_FAILED: "LOGIN_FAILED",
    NOTE_CREATED: "NOTE_CREATED",
    NOTE_UPDATED: "NOTE_UPDATED",
    NOTE_DELETED: "NOTE_DELETED"
});

const createAuditLog = async ({ userId, action, details }) => {
    try {
        return await prisma.auditLog.create({
            data: {
                userId: userId ?? null,
                action,
                details
            }
        });
    } catch (error) {
        console.error("Unable to record security activity", error);
        return null;
    }
};

module.exports = {
    AUDIT_ACTIONS,
    createAuditLog
};
