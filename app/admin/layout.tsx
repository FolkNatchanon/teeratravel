import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminMobileToggle from "@/components/AdminMobileToggle";

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
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            <AdminMobileToggle>
                <AdminSidebar />
            </AdminMobileToggle>
            <main className="flex-1 p-4 md:p-8 md:ml-64 w-full overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
