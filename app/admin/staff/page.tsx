import { prisma } from "@/lib/prisma";
import { deleteStaff } from "@/app/actions/staff";
import Link from "next/link";
import { Plus, Trash2, User, UserCheck, Pencil } from "lucide-react";
import DeleteStaffButton from "@/components/DeleteStaffButton";
import { formatId } from "@/lib/utils";

export default async function AdminStaffPage() {
    const staffs = await prisma.staff.findMany({
        orderBy: { created_at: "desc" },
        include: {
            bookings: {
                select: { booking_id: true }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Manage Staff</h1>
                <Link
                    href="/admin/staff/new"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Staff
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-medium">ID</th>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Active Bookings</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {staffs.map((staff) => (
                                <tr key={staff.staff_id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 text-gray-900">{formatId(staff.staff_id, 'staff')}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{staff.fname} {staff.lname}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold
                                            ${staff.role === 'captain'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {staff.role === 'captain' ? <UserCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                            {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {staff.bookings.length}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link
                                            href={`/admin/staff/${staff.staff_id}/edit`}
                                            className="inline-flex p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <DeleteStaffButton staffId={staff.staff_id} />
                                    </td>
                                </tr>
                            ))}
                            {staffs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No staff members found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
