const prisma = require("../config/prisma");

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.userId
            },
            select: {
                role: true
            }
        });

        if (!user || user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        return next();
    } catch (error) {
        return next(error);
    }
};

module.exports = adminMiddleware;
