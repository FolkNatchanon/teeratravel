
import { prisma } from "@/lib/prisma";
import BookingStatusDropdown from "@/components/BookingStatusDropdown";
import { formatId } from "@/lib/utils";
import EndTripButton from "@/components/EndTripButton";

export default async function AdminBookingsPage() {
    const bookings = await prisma.booking.findMany({
        orderBy: { created_at: "desc" },
        include: {
            user: true,
            package: true,
            boat: true
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-medium">ID</th>
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
                                <tr key={booking.booking_id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{formatId(booking.booking_id, 'booking')}</td>
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
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <BookingStatusDropdown
                                            bookingId={booking.booking_id}
                                            currentStatus={booking.status}
                                        />
                                        <EndTripButton bookingId={booking.booking_id} status={booking.status} />
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
            </div>
        </div>
    );
}

