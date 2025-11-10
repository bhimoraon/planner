"use server"

import type { z } from "zod"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"
import { lucia } from "@/lib/lucia"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { signUpSchema } from "./SignUpForm"
import type { signInSchema } from "./SignInForm"

export async function createSession(userId: string) {
  const cookieStore = await cookies()
  const session = await lucia.createSession(userId, {})
  // console.log("Session created:", session) // Debug log
  //   Session created: {
  //   id: 'ipppfadad7oprhzeu4ybjcqn263zdeswzfxu4jcg',
  //   userId: '68d8fefb7959ce53b8c1c3a8',
  //   fresh: true,
  //   expiresAt: 2025-10-28T14:18:57.963Z
  // }
  const sessionCookie = await lucia.createSessionCookie(session.id)
  // console.log("Session cookie created:", sessionCookie) // Debug log
  //   Session cookie created: Cookie {
  //   name: 'session',
  //   value: 'ipppfadad7oprhzeu4ybjcqn263zdeswzfxu4jcg',
  //   attributes: {
  //     httpOnly: true,
  //     secure: false,
  //     sameSite: 'lax',
  //     path: '/',
  //     maxAge: 34560000
  //   }
  // }
  cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  return { message: "Login successful", success: true }
}

export async function signUp(values: z.infer<typeof signUpSchema>) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: values.email },
    })

    if (existingUser) {
      return { message: "User already exists", success: false }
    }
  
    const hashedPassword = await bcrypt.hash(values.password, 10)

    const user = await prisma.user.create({
      data: {
        email: values.email,
        hashedPassword,
      },
    })

    return await createSession(user.id)
  } catch (error) {
    return { message: "Something went wrong", success: false, status: 500 }
  }
}

export async function signIn(values: z.infer<typeof signInSchema>) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: values.email },
    })

    if (!user || !user.hashedPassword) {
      return { message: "Invalid credentials", success: false }
    }


    const passwordMatch = await bcrypt.compare(values.password, user.hashedPassword)

    if (!passwordMatch) {
      return { message: "Invalid credentials", success: false }
    }

    return await createSession(user.id)
  } catch (error) {
    return { message: "Something went wrong", success: false, status: 500 }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value
  if (!sessionId) return redirect("/authenticate")

  await prisma.session.delete({ where: { id: sessionId } })

  const sessionCookie = await lucia.createBlankSessionCookie()
  cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

  return redirect("/authenticate")
}
