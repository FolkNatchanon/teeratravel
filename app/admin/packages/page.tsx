import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
import Image from "next/image";
import DeletePackageButton from "@/components/DeletePackageButton";

// Helper to validate image URL
function getValidImageUrl(url: string | null) {
    if (!url) return "/placeholder.png";
    try {
        new URL(url); // Will throw if invalid
        return url;
    } catch {
        return "/placeholder.png";
    }
}

export default async function AdminPackagesPage() {
    const packages = await prisma.package.findMany({
        orderBy: { package_id: "desc" },
        include: { boat: true }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Manage Packages</h1>
                <Link
                    href="/admin/packages/new"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add New Package
                </Link>
            </div>

            <div className="space-y-4">
                {packages.map((pkg) => (
                    <div key={pkg.package_id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                        {/* Image */}
                        <div className="relative w-full md:w-64 h-48 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                                src={getValidImageUrl(pkg.cover_image_url)}
                                alt={pkg.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${pkg.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {pkg.status}
                                    </span>
                                </div>
                                <div className="mt-2 text-sm text-gray-500 space-y-1">
                                    <p>Duration: {Number(pkg.duration_hours)} hours</p>
                                    <p>Boat: {pkg.boat.name} (Max {pkg.boat.capacity} pax)</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="text-lg font-bold text-gray-900">
                                    ฿{Number(pkg.base_price).toLocaleString()} <span className="text-sm font-normal text-gray-500">/ {pkg.base_member_count} Members</span>
                                </div>
                                {Number(pkg.extra_price_per_person) > 0 && (
                                    <div className="text-sm text-gray-500">
                                        + ฿{Number(pkg.extra_price_per_person).toLocaleString()} / extra person
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4">
                            <Link
                                href={`/packages/${pkg.package_id}`}
                                target="_blank"
                                className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Eye className="w-5 h-5" />
                            </Link>
                            <Link
                                href={`/admin/packages/${pkg.package_id}`}
                                className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                                <Pencil className="w-5 h-5" />
                            </Link>
                            <DeletePackageButton packageId={pkg.package_id} />
                        </div>
                    </div>
                ))}

                {packages.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100 flex flex-col items-center gap-4">
                        <p className="text-lg">No packages found</p>
                        <Link
                            href="/admin/packages/new"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Create your first package
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
