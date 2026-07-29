const prisma = require("../config/prisma");

const testDatabase = async (req, res) => {

    try {

        const users = await prisma.user.findMany();


        res.json({
            message: "Database connection successful",
            users: users
        });


    } catch (error) {

        res.status(500).json({
            message: "Database connection failed",
            error: error.message
        });

    }

};


module.exports = {
    testDatabase
};
