import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@demo.com' },
        update: {},
        create: {
            username: 'admin',
            user_fname: 'Admin',
            user_lname: 'Teera',
            email: 'admin@demo.com',
            phone_number: '-',
            role: 'A',
            password: 'admin1234',
        },
    })
    console.log('Created admin:', admin.email)

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
