
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        const userId = 1; // Assuming user 1 exists, or just a dummy query
        console.log("Testing Prisma Query...");
        const bookings = await prisma.booking.findMany({
            where: { user_id: userId },
            include: {
                package: true
            },
            orderBy: { created_at: 'desc' }
        });
        console.log("Query Success!", bookings);
    } catch (e) {
        console.error("Query Failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
