import { PrismaClient, PackageType, Status } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding mockup packages...')

    // 1. Ensure at least one mockup boat exists
    const boat = await prisma.boat.upsert({
        where: { boat_id: 1 },
        update: {},
        create: {
            name: 'Speedboat No.1 (mockup)',
            capacity: 25,
            status: Status.active,
        },
    })
    console.log('Using boat:', boat.name)

    // Clean up existing mockup packages to prevent duplicates
    await prisma.package.deleteMany({
        where: { name: { contains: '(mockup)' } }
    })
    console.log('Cleaned up old mockups.')

    // 2. Create 5 mockup packages
    const mockups = [
        {
            name: 'Sunset Private Cruise (mockup)',
            short_intro: 'Exclusive private sunset experience',
            description: 'Enjoy a beautiful sunset on a private boat with your loved ones.',
            duration_hours: 4.5,
            keywords: 'RELAX,ROMANTIC',
            type: PackageType.private,
            base_price: 15000,
            extra_price_per_person: 500,
            base_member_count: 10,
            cover_image_url: 'https://images.unsplash.com/photo-1544526226-d4568090ffb8?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Day Trip to Emerald Bay (mockup)',
            short_intro: 'Full day adventure to hidden gems',
            description: 'Explore the stunning emerald waters and limestone caves.',
            duration_hours: 8,
            keywords: 'ADVENTURE,FAMILY',
            type: PackageType.join,
            base_price: 1200,
            extra_price_per_person: 1200,
            base_member_count: 1,
            cover_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Luxury Dining on Waves (mockup)',
            short_intro: 'Fine dining experience at sea',
            description: 'A 5-course dinner served under the stars while cruising.',
            duration_hours: 3.5,
            keywords: 'ROMANTIC,CULTURE',
            type: PackageType.private,
            base_price: 25000,
            extra_price_per_person: 2000,
            base_member_count: 4,
            cover_image_url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Morning Fishing Trip (mockup)',
            short_intro: 'Catch your own lunch today',
            description: 'Join professional fishermen and learn the art of traditional fishing.',
            duration_hours: 6,
            keywords: 'ADVENTURE,RELAX',
            type: PackageType.join,
            base_price: 800,
            extra_price_per_person: 800,
            base_member_count: 1,
            cover_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Romantic Moonlight Tour (mockup)',
            short_intro: 'Quiet cruise under the moonlight',
            description: 'Perfect for couples looking for a serene night on the water.',
            duration_hours: 3,
            keywords: 'ROMANTIC',
            type: PackageType.private,
            base_price: 12000,
            extra_price_per_person: 0,
            base_member_count: 2,
            cover_image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800',
        }
    ]

    for (const data of mockups) {
        const pkg = await prisma.package.create({
            data: {
                ...data,
                boat_id: boat.boat_id,
                status: Status.active,
            },
        })
        console.log(`Created: ${pkg.name}`)
    }

    console.log('Mockup seeding completed!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
