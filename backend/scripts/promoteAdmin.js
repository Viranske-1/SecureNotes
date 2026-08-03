require("../src/config/env");

const prisma = require("../src/config/prisma");

const promoteAdmin = async () => {
    const email = process.argv[2]?.trim();

    if (!email || !email.includes("@")) {
        throw new Error(
            "Usage: npm run admin:promote -- user@example.com"
        );
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        },
        select: {
            id: true,
            email: true,
            role: true
        }
    });

    if (!user) {
        throw new Error(`No existing user found for ${email}`);
    }

    if (user.role === "ADMIN") {
        console.log(`${user.email} is already an ADMIN.`);
        return;
    }

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            role: "ADMIN"
        }
    });

    console.log(`Promoted ${user.email} to ADMIN.`);
};

promoteAdmin()
    .catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
