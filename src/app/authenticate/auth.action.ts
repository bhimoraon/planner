"use server"

import { z } from "zod"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken"
import { signUpSchema } from "./SignUpForm";
import { signInSchema } from "./SignInForm";

export async function createSession(tokenData: { username: string, id: string }) {
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {});
    const cookieStore = await cookies();
    cookieStore.set("userInfo", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    const session = await lucia.createSession(tokenData.id, {});
    // console.log("Session created:", session);
    const sessionCookie = await lucia.createSessionCookie(session.id);
    // console.log("Session cookie created:", sessionCookie);

    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return { message: "Login successfull", success: true }
}

export async function signUp(values: z.infer<typeof signUpSchema>) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: values.email }
        });

        if (existingUser) {
            return { message: "User already exists", success: false }
        }

        const hashedPassword = await bcrypt.hash(values.password, 10);

        let generatedUsername = values.email.split("@")[0];
        while (await prisma.user.findUnique({ where: { username: generatedUsername } })) {
            generatedUsername = generatedUsername + Math.floor(Math.random() * 1000)
        }

        const user = await prisma.user.create({
            data: {
                email: values.email,
                username: generatedUsername,
                hashedPassword
            }
        });

        return await createSession({
            username: generatedUsername,
            id: user.id
        });

    } catch (error) {
        return { message: "something went wrong", success: false, status: 500 }
    }
}

export async function signIn(values: z.infer<typeof signInSchema>) {
    try {
        const user = await prisma.user.findUnique({
            where: { email: values.email }
        });

        if (!user || !user.hashedPassword) {
            return { message: "Invalid Credentials!", success: false }
        }

        const passwordMatch = await bcrypt.compare(values.password, user.hashedPassword);
        if (!passwordMatch) {
            return { message: "Invalid Credentials!", success: false };
        }

        return await createSession({
            id: user.id,
            username: user.username,
        });

    } catch (error: unknown) {
        return { message: "Something went wrong", success: false, status: 500 }
    }
}

export async function logout() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;
    if (!sessionId) return redirect("/authenticate");

    await prisma.session.delete({ where: { id: sessionId } });

    const sessionCookie = await lucia.createBlankSessionCookie();
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return redirect("/authenticate");
}
