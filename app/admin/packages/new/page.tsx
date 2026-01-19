import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PackageForm from "@/components/PackageForm";

export default async function NewPackagePage() {
    const boats = await prisma.boat.findMany({
        where: { status: "active" }
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/packages"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Add New Package</h1>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <PackageForm boats={boats} />
            </div>
        </div>
    );
}
