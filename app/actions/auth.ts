"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";

const RegisterSchema = z.object({
    firstName: z.string().min(1, "กรุณาระบุชื่อจริง"),
    lastName: z.string().min(1, "กรุณาระบุนามสกุล"),
    username: z.string().min(3, "ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร"),
    email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
    phone: z.string().min(9, "เบอร์โทรศัพท์ไม่ถูกต้อง"), // Simple check
    password: z.string().min(6, "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
});

export type RegisterState = {
    errors?: {
        firstName?: string[];
        lastName?: string[];
        username?: string[];
        email?: string[];
        phone?: string[];
        password?: string[];
        confirmPassword?: string[];
        _form?: string[];
    };
    message?: string;
} | null;

export async function registerUser(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
    const validatedFields = RegisterSchema.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        username: formData.get("username"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง",
        };
    }

    const { firstName, lastName, username, email, phone, password } = validatedFields.data;

    try {
        // Check if email or username already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username },
                ],
            },
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return {
                    errors: {
                        email: ["อีเมลนี้ถูกใช้งานแล้ว"]
                    },
                    message: "การลงทะเบียนล้มเหลว"
                }
            }
            if (existingUser.username === username) {
                return {
                    errors: {
                        username: ["ชื่อผู้ใช้นี้ถูกใช้งานแล้ว"]
                    },
                    message: "การลงทะเบียนล้มเหลว"
                }
            }
        }

        // const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        // Note: 'role' has a default in schema so we don't strictly need to pass it, but can if needed. 
        // In schema: role String @db.Char(1) // "A" | "U"
        // Wait, the schema comment says "A" | "U", but no default @default on the field itself in the schema snippet I saw earlier?
        // Let me double check schema snippet in my memory. 
        // Line 42: role String @db.Char(1) // "A" | "U"
        // It did NOT have @default("U"). I should check if I should provide it.
        // I will assume "U" for User.

        await prisma.user.create({
            data: {
                user_fname: firstName,
                user_lname: lastName,
                username: username,
                email: email,
                phone_number: phone,
                password: password, // Store plain text password as requested
                role: "U", // Default to User
            },
        });

    } catch (error) {
        console.error("Registration error:", error);
        return {
            message: "เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง",
        };
    }

    // Redirect on success
    redirect("/login?registered=true");
}

export async function login(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const remember = formData.get("remember-me");

    if (!email || !password) {
        return { message: "กรุณากรอกอีเมลและรหัสผ่าน" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
        }

        // Verify password (plain text as requested)
        if (user.password !== password) {
            return { message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
        }

        // Create session
        await createSession(user.user_id, user.username, user.role);

        // Redirect happens after this function returns if we don't throw redirect()
        // but in server actions we usually redirect.
    } catch (error) {
        console.error("Login error:", error);
        return { message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" };
    }

    redirect("/");
}

export async function logout() {
    await deleteSession();
    redirect("/login");
}
