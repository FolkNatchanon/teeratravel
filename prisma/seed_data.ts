
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    const boat = await prisma.boat.upsert({
        where: { boat_id: 1 },
        update: {},
        create: {
            name: 'The Pearl of Andaman',
            capacity: 30,
            status: 'active',
        },
    })
    console.log('Created boat:', boat)

    const package1 = await prisma.package.upsert({
        where: { package_id: 1 },
        update: {},
        create: {
            name: 'Private Sunset Trip (4 Hours)',
            cover_image_url: '/hero.png',
            short_intro: 'Experience the most beautiful sunset in Phuket on a private yacht.',
            description: `
        Enjoy a private cruise along the coast of Phuket. 
        Witness the stunning sunset while sipping on champagne. 
        Perfect for couples or small groups looking for a romantic or exclusive experience.
        
        Itinerary:
        - 16:00 Depart from pier
        - 17:00 Arrive at Promthep Cape
        - 18:30 Watch sunset
        - 20:00 Return to pier
      `,
            duration_hours: 4,
            type: 'private',
            status: 'active',
            base_member_count: 2,
            base_price: 12000,
            extra_price_per_person: 1000,
            boat_id: boat.boat_id,
        },
    })

    const package2 = await prisma.package.upsert({
        where: { package_id: 2 },
        update: {},
        create: {
            name: 'Phi Phi Islands Day Trip',
            cover_image_url: '/hero.png',
            short_intro: 'Full day adventure to the famous Phi Phi Islands.',
            description: `
        Discover the beauty of Phi Phi Islands. 
        Visit Maya Bay, Pileh Lagoon, and Monkey Beach.
        Snorkeling equipment and lunch included.
        
        Itinerary:
        - 08:00 Pick up from hotel
        - 09:00 Depart from pier
        - 10:00 Phi Phi Lay
        - 12:00 Lunch at Phi Phi Don
        - 14:00 Khai Island
        - 16:00 Return to pier
      `,
            duration_hours: 8,
            type: 'join',
            status: 'active',
            base_member_count: 1,
            base_price: 3500,
            extra_price_per_person: 3500,
            boat_id: boat.boat_id,
        },
    })

    console.log({ package1, package2 })
    console.log('Seeding finished.')
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
