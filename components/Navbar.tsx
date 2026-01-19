import Link from "next/link";
import { User } from "lucide-react";
import { getSession } from "@/lib/session";
import { logout } from "@/app/actions/auth";

export default async function Navbar() {
    const session = await getSession();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🐯</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">Teera Travel</span>
                </Link>

                {/* Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <Link href="/" className="text-black underline underline-offset-4 decoration-2 decoration-orange-500">หน้าแรก</Link>
                    <Link href="/booking-history" className="hover:text-black transition-colors">ประวัติการจองทริป</Link>
                    <Link href="/contact" className="hover:text-black transition-colors">ติดต่อเรา-แผนที่</Link>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-4">
                    {session ? (
                        <>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <User className="w-5 h-5" />
                                <span>{session.username}</span>
                            </div>
                            <form action={logout}>
                                <button type="submit" className="px-4 py-1.5 text-sm font-medium text-cyan-500 border border-cyan-500 rounded-full hover:bg-cyan-50 transition-colors">
                                    Logout
                                </button>
                            </form>
                        </>
                    ) : (
                        <Link href="/login" className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition-colors shadow-md">
                            เข้าสู่ระบบ
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
