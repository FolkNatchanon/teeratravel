"use client";

import { usePathname } from "next/navigation";

interface LayoutWrapperProps {
    navbar: React.ReactNode;
    footer: React.ReactNode;
    children: React.ReactNode;
}

export default function LayoutWrapper({ navbar, footer, children }: LayoutWrapperProps) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    return (
        <div className="flex flex-col min-h-screen">
            {!isAdmin && navbar}
            <main className="flex-grow">
                {children}
            </main>
            {!isAdmin && footer}
        </div>
    );
}
