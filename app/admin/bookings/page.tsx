import { prisma } from "@/lib/prisma";
import { BookingStatus, PackageType } from "@prisma/client";
import BookingStatusDropdown from "@/components/BookingStatusDropdown";
import BookingFilter from "@/components/admin/BookingFilter";
import { formatId } from "@/lib/utils";
import AdminPageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import { Inbox } from "lucide-react";

import SortableHeader from "@/components/admin/SortableHeader";

interface AdminBookingsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminBookingsPage(props: AdminBookingsPageProps) {
    const searchParams = await props.searchParams;
    const statusParam = searchParams.status as string | undefined;
    const typeParam = searchParams.type as string | undefined;
    const searchParam = searchParams.search as string | undefined;

    // Sorting
    const sort = (searchParams.sort as string) || "created_at";
    const order = (searchParams.order as string) === "asc" ? "asc" : "desc";

    // Validate status parameter against enum values
    const isValidStatus = statusParam && Object.values(BookingStatus).includes(statusParam as BookingStatus);
    const isValidType = typeParam && Object.values(PackageType).includes(typeParam as PackageType);

    const whereCondition: any = {};

    if (isValidStatus) {
        whereCondition.status = statusParam as BookingStatus;
    }

    if (isValidType) {
        whereCondition.package = {
            type: typeParam as PackageType
        };
    }

    if (searchParam) {
        const searchId = parseInt(searchParam.replace(/^#/, '').trim());
        if (!isNaN(searchId)) {
            whereCondition.booking_id = searchId;
        }
    }

    const bookings = await prisma.booking.findMany({
        where: whereCondition,
        orderBy: sort === "booking_id"
            ? { booking_id: order }
            : { created_at: "desc" }, // Default
        include: {
            user: true,
            package: true,
            boat: true
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <AdminPageHeader
                    title="Manage Bookings"
                    description="View and manage all customer bookings"
                />
                <BookingFilter />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ">
                {bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-sm">
                                <tr>
                                    <th className="px-6 py-4 font-medium"><SortableHeader label="ID" column="booking_id" currentSort={sort} currentOrder={order} /></th>
                                    <th className="px-6 py-4 font-medium">Customer</th>
                                    <th className="px-6 py-4 font-medium">Trip Details</th>
                                    <th className="px-6 py-4 font-medium">Passengers</th>
                                    <th className="px-6 py-4 font-medium">Total</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bookings.map((booking) => (
                                    <tr key={booking.booking_id} className="hover:bg-gray-50/50 ">
                                        <td className="px-6 py-4 text-sm text-gray-900 font-mono">{formatId(booking.booking_id, 'booking')}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-medium text-gray-900">{booking.user.user_fname} {booking.user.user_lname}</div>
                                            <div className="text-gray-500 text-xs">{booking.user.email}</div>
                                            <div className="text-gray-500 text-xs">{booking.user.phone_number}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-medium text-gray-900">{booking.package.name}</div>
                                            <div className="text-gray-500 text-xs"> Boat: {booking.boat.name}</div>
                                            <div className="text-gray-500 text-xs">
                                                {new Date(booking.trip_date).toLocaleDateString()} ({booking.time_slot})
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{booking.passenger_count}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            ฿{Number(booking.total_price).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-2 ">
                                            <BookingStatusDropdown
                                                bookingId={booking.booking_id}
                                                currentStatus={booking.status}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a
                                                href={`/admin/bookings/${booking.booking_id}`}
                                                className="text-blue-600 hover:text-blue-900 text-xs font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                                            >
                                                View Details
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState
                        icon={Inbox}
                        title="No bookings found"
                        description={searchParam || statusParam ? "No bookings match your current filters." : "There are currently no bookings in the system."}
                    />
                )}
            </div>
        </div >
    );
}

