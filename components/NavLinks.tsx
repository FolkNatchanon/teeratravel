"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname?.startsWith(path);
    };

    return (
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link
                href="/"
                className={`transition-colors ${isActive('/') ? 'text-blue-600 font-bold' : 'hover:text-black'}`}
            >
                หน้าแรก
                {isActive('/') && <div className="h-0.5 w-full bg-blue-600 mt-0.5 rounded-full" />}
            </Link>

            <Link
                href="/booking-history"
                className={`transition-colors relative group ${isActive('/booking-history') ? 'text-blue-600 font-bold' : 'hover:text-black'}`}
            >
                ประวัติการจองทริป
                {isActive('/booking-history') && <div className="h-0.5 w-full bg-blue-600 mt-0.5 rounded-full absolute -bottom-1" />}
            </Link>

            <Link
                href="/contact"
                className={`transition-colors relative group ${isActive('/contact') ? 'text-blue-600 font-bold' : 'hover:text-black'}`}
            >
                ติดต่อเรา-แผนที่
                {isActive('/contact') && <div className="h-0.5 w-full bg-blue-600 mt-0.5 rounded-full absolute -bottom-1" />}
            </Link>
        </div>
    );
}
