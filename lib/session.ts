import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET || "default-secret-key-change-this-in-prod";
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
    userId: number;
    username: string;
    role: string;
    expiresAt: Date;
};

export async function createSession(userId: number, username: string, role: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const session = await encrypt({ userId, username, role, expiresAt });

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

type SessionData = {
    userId: number;
    username: string;
    role: string;
} | null;

export async function getSession(): Promise<SessionData> {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;

    try {
        const payload = await decrypt(session);
        return {
            userId: payload.userId as number,
            username: payload.username as string,
            role: payload.role as string,
        }
    } catch (error) {
        console.error("Failed to verify session", error);
        return null;
    }
}

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        // console.log("Failed to verify session"); // Silent failure is okay for session check
        throw error;
    }
}
