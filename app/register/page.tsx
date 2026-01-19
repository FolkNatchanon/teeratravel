"use client";

import Link from "next/link";
import Image from "next/image";
import { useActionState } from "react";
import { registerUser } from "@/app/actions/auth";

export default function RegisterPage() {
    const [state, action, isPending] = useActionState(registerUser, null);

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left Side - Image */}
            <div className="hidden md:block relative h-full w-full">
                <Image
                    src="/hero.png" // Reusing hero image for consistency
                    alt="Register Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-12 left-12 text-white p-6 max-w-lg">
                    <h2 className="text-4xl font-bold mb-4">สมัครสมาชิกใหม่</h2>
                    <p className="text-lg text-white/90">
                        เข้าร่วมกับเราเพื่อรับประสบการณ์การท่องเที่ยวสุดพิเศษและข้อเสนอดีๆ
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-8 bg-white overflow-y-auto">
                <div className="w-full max-w-md space-y-8 my-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900">สร้างบัญชีผู้ใช้</h1>
                        <p className="mt-2 text-gray-600">
                            มีบัญชีผู้ใช้แล้ว?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                เข้าสู่ระบบ
                            </Link>
                        </p>
                    </div>

                    <form action={action} className="mt-8 space-y-6">
                        {state?.message && (
                            <div className={`p-4 rounded-lg text-sm ${state.errors ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                                }`}>
                                {state.message}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="firstName"
                                        className="block text-sm font-bold text-gray-900"
                                    >
                                        ชื่อจริง
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    />
                                    {state?.errors?.firstName && (
                                        <p className="mt-1 text-sm text-red-600">{state.errors.firstName[0]}</p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="lastName"
                                        className="block text-sm font-bold text-gray-900"
                                    >
                                        นามสกุล
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    />
                                    {state?.errors?.lastName && (
                                        <p className="mt-1 text-sm text-red-600">{state.errors.lastName[0]}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-bold text-gray-900"
                                >
                                    ชื่อผู้ใช้ (Username)
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                />
                                {state?.errors?.username && (
                                    <p className="mt-1 text-sm text-red-600">{state.errors.username[0]}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-bold text-gray-900"
                                >
                                    อีเมล
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                />
                                {state?.errors?.email && (
                                    <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-bold text-gray-900"
                                >
                                    เบอร์โทรศัพท์
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                />
                                {state?.errors?.phone && (
                                    <p className="mt-1 text-sm text-red-600">{state.errors.phone[0]}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-bold text-gray-900"
                                >
                                    รหัสผ่าน
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                />
                                {state?.errors?.password && (
                                    <p className="mt-1 text-sm text-red-600">{state.errors.password[0]}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-bold text-gray-900"
                                >
                                    ยืนยันรหัสผ่าน
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                />
                                {state?.errors?.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{state.errors.confirmPassword[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                ฉันยอมรับ{" "}
                                <a href="#" className="text-blue-600 hover:text-blue-500">
                                    เงื่อนไขการให้บริการ
                                </a>{" "}
                                และ{" "}
                                <a href="#" className="text-blue-600 hover:text-blue-500">
                                    นโยบายความเป็นส่วนตัว
                                </a>
                            </label>
                        </div> */}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
