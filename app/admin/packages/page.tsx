import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Filter, Eye, Calendar, Package } from "lucide-react";
import Image from "next/image";
import DeletePackageButton from "@/components/DeletePackageButton";
import { formatId } from "@/lib/utils";
import AdminPageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";

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
            <AdminPageHeader
                title="Manage Packages"
                description="Create and manage travel packages"
                action={
                    <Link
                        href="/admin/packages/new"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Package
                    </Link>
                }
            />

            <div className="space-y-4">
                {packages.map((pkg) => (
                    <div key={pkg.package_id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                        {/* Image */}
                        <div className="relative w-full md:w-64 h-48 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
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
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm text-gray-500">{formatId(pkg.package_id, 'package')}</span>
                                        <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                                    </div>
                                    <StatusBadge status={pkg.status} />
                                </div>
                                <div className="mt-2 text-sm text-gray-500 space-y-1">
                                    <p className="flex items-center gap-2">
                                        <span className="font-medium">Duration:</span> {Number(pkg.duration_hours)} hours
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="font-medium">Boat:</span> {pkg.boat.name} (Max {pkg.boat.capacity} pax)
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="font-medium">Type:</span> <span className="capitalize">{pkg.type}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-end">
                                <div>
                                    <div className="text-xl font-bold text-blue-600">
                                        ฿{Number(pkg.base_price).toLocaleString()}
                                        <span className="text-sm font-normal text-gray-500 ml-1">/ {pkg.base_member_count} Members</span>
                                    </div>
                                    {Number(pkg.extra_price_per_person) > 0 && (
                                        <div className="text-xs text-gray-400 mt-1">
                                            + ฿{Number(pkg.extra_price_per_person).toLocaleString()} / extra person
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4">
                            <Link
                                href={`/packages/${pkg.package_id}`}
                                target="_blank"
                                className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View User Page"
                            >
                                <Eye className="w-5 h-5" />
                            </Link>

                            {/* Session Management for Join Trips */}
                            {pkg.type === 'join' && (
                                <Link
                                    href={`/admin/packages/${pkg.package_id}/sessions`}
                                    className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                    title="Manage Sessions"
                                >
                                    <Calendar className="w-5 h-5" />
                                </Link>
                            )}

                            <Link
                                href={`/admin/packages/${pkg.package_id}`}
                                className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Edit Package"
                            >
                                <Pencil className="w-5 h-5" />
                            </Link>
                            <DeletePackageButton packageId={pkg.package_id} />
                        </div>
                    </div>
                ))}

                {packages.length === 0 && (
                    <EmptyState
                        icon={Package}
                        title="No packages found"
                        description="Get started by creating your first travel package."
                        actionLabel="Create Package"
                        actionHref="/admin/packages/new"
                    />
                )}
            </div>
        </div>
    );
}
