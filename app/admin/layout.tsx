import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    // Check if logged in and checks for "A" role
    if (!session || session.role !== "A") {
        redirect("/"); // Or to /login with error
    }

    return (
        <div className="min-h-screen bg-gray-100 pl-64">
            <AdminSidebar />
            <main className="p-8">
                {children}
            </main>
        </div>
    );
}
