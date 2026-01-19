
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Creating example package...');

    // Ensure a boat exists
    let boat = await prisma.boat.findFirst();
    if (!boat) {
        boat = await prisma.boat.create({
            data: {
                name: "Speedboat 1",
                capacity: 25,
                status: "active"
            }
        });
        console.log("Created boat:", boat.name);
    }

    const pkg = await prisma.package.create({
        data: {
            name: "Teera Travel 1 (Short Trip)",
            short_intro: "ทริปดำน้ำสุดคุ้ม",
            description: "ฟรีน้ำเปล่า ฟรีน้ำหวาน ฟรีผลไม้ ราคารวมอาหาร ฟรีเสื่อชูชีพ ฟรีหน้ากากดำน้ำ",
            duration_hours: 3.0,
            type: "private",
            status: "active",
            boat_id: boat.boat_id,
            base_member_count: 10,
            base_price: 6900.00,
            extra_price_per_person: 450.00,
            cover_image_url: "https://images.unsplash.com/photo-1544551763-8dd40575c548?q=80&w=2670&auto=format&fit=crop" // Placeholder
        }
    });

    console.log('Created package:', pkg);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
