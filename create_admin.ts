
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@teeratravel.com'
    const password = 'password123' // Plain text as requested

    const user = await prisma.user.upsert({
        where: { email },
        update: { role: 'A' },
        create: {
            username: 'admin',
            user_fname: 'Admin',
            user_lname: 'User',
            email,
            password,
            phone_number: '0812345678',
            role: 'A',
        },
    })

    console.log('Admin user created/updated:', user)
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
