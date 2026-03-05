const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
    console.log("Checking DB...");
    const b10 = await prisma.booking.findUnique({ where: { booking_id: 10 } });
    console.log('Booking 10 userId:', b10?.user_id);
    const b11 = await prisma.booking.findUnique({ where: { booking_id: 11 } });
    console.log('Booking 11 userId:', b11?.user_id);
    const u = await prisma.user.findFirst({ where: { username: 'user1' } });
    console.log('User1 ID:', u?.user_id);

    // Check pending bookings for user1
    const userBookings = await prisma.booking.findMany({
        where: { user_id: u?.user_id },
        select: { booking_id: true }
    });
    console.log('User1 Bookings:', userBookings.map(x => x.booking_id));
}
check()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
