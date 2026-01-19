
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const count = await prisma.package.count()
    console.log(`There are ${count} packages in the database.`)

    if (count > 0) {
        const pkgs = await prisma.package.findMany({ take: 3 })
        console.log(JSON.stringify(pkgs, null, 2))
    }
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
