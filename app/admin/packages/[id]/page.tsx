import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import PackageForm from "@/components/PackageForm";

export default async function EditPackagePage({ params }: { params: { id: string } }) {
    const resolvedParams = await params;
    const packageId = Number(resolvedParams.id);

    if (isNaN(packageId)) notFound();

    const [pkg, boats] = await Promise.all([
        prisma.package.findUnique({ where: { package_id: packageId } }),
        prisma.boat.findMany({ where: { status: "active" } })
    ]);

    if (!pkg) notFound();

    // Map prisma decimal types to number for form
    const packageData = {
        ...pkg,
        duration_hours: Number(pkg.duration_hours),
        base_price: Number(pkg.base_price),
        extra_price_per_person: Number(pkg.extra_price_per_person),
        // Ensure enum types match string literals if needed
        type: pkg.type as "private" | "join",
        status: pkg.status as "active" | "inactive"
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/packages"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Package: {pkg.name}</h1>
                </div>
                {pkg.type === 'join' && (
                    <Link
                        href={`/admin/packages/${pkg.package_id}/sessions`}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                    >
                        <Calendar className="w-4 h-4" />
                        Manage Sessions
                    </Link>
                )}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <PackageForm boats={boats} packageData={packageData} />
            </div>
        </div>
    );
}
