import { Lucia } from 'lucia'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import { prisma } from './prisma'
import { cookies } from 'next/headers'

const adapter = new PrismaAdapter(prisma.session, prisma.user)

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        name: 'session',
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === 'production'
        }
    }
})

export const getUser = async () => {
    const cookieStore = await cookies() // ✅ await now
    const sessionId = cookieStore.get(lucia.sessionCookieName)?.value || null

    if (!sessionId) return null

    try {
        const { session, user } = await lucia.validateSession(sessionId)

        if (session && session.fresh) {
            const sessionCookie = await lucia.createSessionCookie(session.id)
            cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
        }

        if (!session) {
            const sessionCookie = await lucia.createBlankSessionCookie()
            cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
            return null
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user?.id }
        })

        if (!dbUser && session) {
            await lucia.invalidateSession(session.id) // cleanup if user deleted
            return null
        }

        return dbUser
    } catch (error) {
        console.error('Error validating session:', error)
        return null
    }
}
