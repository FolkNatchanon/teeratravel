"use client";

import Link from "next/link";
import Image from "next/image";
import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
    const [state, action, isPending] = useActionState(login, null);

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left Side - Image */}
            <div className="hidden md:block relative h-full w-full">
                <Image
                    src="/hero.png" // Using existing hero image
                    alt="Login Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-12 left-12 text-white p-6 max-w-lg">
                    <h2 className="text-4xl font-bold mb-4">ยินดีต้อนรับกลับมา</h2>
                    <p className="text-lg text-white/90">
                        เข้าสู่ระบบเพื่อจัดการทริปของคุณและดูประวัติการจองได้ง่ายๆ
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900">เข้าสู่ระบบ</h1>
                        <p className="mt-2 text-gray-600">
                            ยังไม่มีบัญชีผู้ใช้?{" "}
                            <Link
                                href="/register"
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                สมัครสมาชิก
                            </Link>
                        </p>
                    </div>

                    <form action={action} className="mt-8 space-y-6">
                        {state?.message && (
                            <div className="p-4 rounded-lg text-sm bg-red-50 text-red-700">
                                {state.message}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    อีเมล
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="example@email.com"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    รหัสผ่าน
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    จดจำฉันไว้
                                </label>
                            </div>

                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    ลืมรหัสผ่าน?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
