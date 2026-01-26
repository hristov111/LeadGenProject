import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const prismaClientSingleton = () => {
    const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL
    const authToken = process.env.TURSO_AUTH_TOKEN

    // If using Turso (LibSQL), use the driver adapter
    if (url?.includes('libsql') || url?.includes('turso') || authToken) {
        const adapter = new PrismaLibSql({
            url: url!,
            authToken: authToken,
        })
        return new PrismaClient({ adapter })
    }

    // Fallback to standard client (e.g. for local file:./dev.db)
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
