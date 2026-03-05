"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import AuthGuardModal from "./AuthGuardModal";

interface SessionData {
    userId: number;
    username: string;
    role: string;
}

interface MobileMenuProps {
    session: SessionData | null;
}

export default function MobileMenu({ session }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const pathname = usePathname();

    const isLoggedIn = !!session;

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname?.startsWith(path);
    };

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, requiresAuth: boolean = false) => {
        if (requiresAuth && !isLoggedIn) {
            e.preventDefault();
            setShowAuthModal(true);
        } else {
            closeMenu();
        }
    };

    return (
        <div className="md:hidden">
            <button
                onClick={toggleMenu}
                className="p-2 text-gray-700 hover:text-blue-600 focus:outline-none transition-colors"
                aria-label="Toggle Menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg px-4 pt-2 pb-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    {/* Links */}
                    <div className="flex flex-col gap-3 font-medium text-gray-700">
                        <Link
                            href="/"
                            onClick={(e) => handleLinkClick(e)}
                            className={`px-4 py-3 rounded-xl transition-colors ${isActive('/') ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-50'}`}
                        >
                            หน้าแรก
                        </Link>
                        <Link
                            href="/packages"
                            onClick={(e) => handleLinkClick(e)}
                            className={`px-4 py-3 rounded-xl transition-colors ${isActive('/packages') ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-50'}`}
                        >
                            แพ็คเกจทัวร์
                        </Link>
                        <Link
                            href="/booking-history"
                            onClick={(e) => handleLinkClick(e, true)}
                            className={`px-4 py-3 rounded-xl transition-colors ${isActive('/booking-history') ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-50'}`}
                        >
                            ประวัติการจองทริป
                        </Link>
                        <Link
                            href="/contact"
                            onClick={(e) => handleLinkClick(e)}
                            className={`px-4 py-3 rounded-xl transition-colors ${isActive('/contact') ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-50'}`}
                        >
                            ติดต่อเรา-แผนที่
                        </Link>
                    </div>

                    <hr className="border-gray-100 my-2" />

                    {/* User Actions */}
                    <div className="flex flex-col gap-3 px-4">
                        {session ? (
                            <>
                                <div className="flex items-center gap-3 py-2 text-gray-900 font-bold">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <span>{session.username}</span>
                                </div>

                                {session.role === 'A' && (
                                    <Link
                                        href="/admin"
                                        onClick={closeMenu}
                                        className="w-full text-center px-4 py-3 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors"
                                    >
                                        Admin Console
                                    </Link>
                                )}

                                <form action="/api/logout" method="POST" className="w-full mt-2">
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-3 text-sm font-bold text-cyan-500 border-2 border-cyan-500 rounded-xl hover:bg-cyan-50 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </form>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                onClick={closeMenu}
                                className="w-full text-center px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                เข้าสู่ระบบ
                            </Link>
                        )}
                    </div>
                </div>
            )}

            <AuthGuardModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </div>
    );
}
