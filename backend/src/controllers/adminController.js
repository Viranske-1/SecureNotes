const prisma = require("../config/prisma");

const getAdminStats = async (req, res, next) => {
    try {
        const [totalUsers, totalNotes, totalAuditLogs, recentActivity] = await Promise.all([
            prisma.user.count(),
            prisma.note.count(),
            prisma.auditLog.count(),
            prisma.auditLog.findMany({
                select: {
                    action: true,
                    createdAt: true,
                    userId: true
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 10
            })
        ]);

        return res.json({
            totalUsers,
            totalNotes,
            totalAuditLogs,
            recentActivity
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getAdminStats
};
