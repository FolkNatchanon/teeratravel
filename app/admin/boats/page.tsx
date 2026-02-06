import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Anchor } from "lucide-react";
import DeleteBoatButton from "@/components/DeleteBoatButton";
import { formatId } from "@/lib/utils";

import SortableHeader from "@/components/admin/SortableHeader";

interface AdminBoatsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminBoatsPage(props: AdminBoatsPageProps) {
    const searchParams = await props.searchParams;
    const sort = (searchParams.sort as string) || "boat_id";
    const order = (searchParams.order as string) === "asc" ? "asc" : "desc";

    const boats = await prisma.boat.findMany({
        orderBy: sort === "boat_id"
            ? { boat_id: order }
            : { boat_id: "desc" }, // Default
        include: { _count: { select: { bookings: true, packages: true } } }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Manage Boats</h1>
                <Link
                    href="/admin/boats/new"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add New Boat
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-medium"><SortableHeader label="ID" column="boat_id" currentSort={sort} currentOrder={order} /></th>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Capacity</th>
                                <th className="px-6 py-4 font-medium">Usage</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {boats.map((boat) => (
                                <tr key={boat.boat_id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{formatId(boat.boat_id, 'boat')}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <Anchor className="w-4 h-4 text-gray-400" />
                                            {boat.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{boat.capacity}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {boat._count.packages} Packages, {boat._count.bookings} Bookings
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link
                                            href={`/admin/boats/${boat.boat_id}/edit`}
                                            className="inline-flex p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <DeleteBoatButton boatId={boat.boat_id} />
                                    </td>
                                </tr>
                            ))}
                            {boats.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No boats found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
