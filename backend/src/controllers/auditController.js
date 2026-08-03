const prisma = require("../config/prisma");

const getAuditLogs = async (req, res, next) => {
    try {
        const auditLogs = await prisma.auditLog.findMany({
            select: {
                id: true,
                action: true,
                details: true,
                userId: true,
                createdAt: true
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 50
        });

        return res.json(auditLogs);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getAuditLogs
};
