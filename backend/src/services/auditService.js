const prisma = require("../config/prisma");

const AUDIT_ACTIONS = Object.freeze({
    LOGIN: "LOGIN",
    NOTE_CREATED: "NOTE_CREATED",
    NOTE_UPDATED: "NOTE_UPDATED",
    NOTE_DELETED: "NOTE_DELETED"
});

const recordAuditLog = async (userId, action) => {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action
            }
        });
    } catch (error) {
        console.error("Unable to record security activity", error);
    }
};

module.exports = {
    AUDIT_ACTIONS,
    recordAuditLog
};
