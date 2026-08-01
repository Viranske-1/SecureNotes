const prisma = require("../config/prisma");

const getAuditLogs = async (req, res, next) => {
    try {
        const auditLogs = await prisma.auditLog.findMany({
            where: {
                userId: req.user.userId
            },
            select: {
                id: true,
                action: true,
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
