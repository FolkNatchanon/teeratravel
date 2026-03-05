import Link from "next/link";
import { LayoutDashboard, Package, Calendar, Anchor, LogOut, Users } from "lucide-react";
import { logout } from "@/app/actions/auth";

export default function AdminSidebar() {
    const links = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Packages", href: "/admin/packages", icon: Package },
        { name: "Schedule", href: "/admin/schedule", icon: Calendar }, // Added Schedule link
        { name: "Bookings", href: "/admin/bookings", icon: Calendar }, // Keeping Bookings as simple table
        { name: "Boats", href: "/admin/boats", icon: Anchor },
        { name: "Staff", href: "/admin/staff", icon: Users },
    ];

    return (
        <aside className="w-full h-full bg-slate-900 text-white flex flex-col">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Teera Admin
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                    >
                        <link.icon className="w-5 h-5" />
                        <span>{link.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
                    <span>Back to Website</span>
                </Link>
                <form action={logout}>
                    <button
                        type="submit"
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}
