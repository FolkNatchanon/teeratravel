
import { prisma } from "@/lib/prisma";
import { updateBookingStatus } from "@/app/actions/admin";
import { CheckCircle, XCircle, Clock } from "lucide-react";

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
                                    <td className="px-6 py-4 text-sm text-gray-900">#{booking.booking_id}</td>
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
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                booking.status === 'complete' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {booking.status === 'pending' && (
                                                <form action={updateBookingStatus}>
                                                    <input type="hidden" name="bookingId" value={booking.booking_id} />
                                                    <input type="hidden" name="status" value="complete" />
                                                    <button title="Confirm Payment" className="p-1 text-green-600 hover:bg-green-50 rounded">
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                </form>
                                            )}
                                            {(booking.status === 'pending' || booking.status === 'complete') && (
                                                <form action={updateBookingStatus}>
                                                    <input type="hidden" name="bookingId" value={booking.booking_id} />
                                                    <input type="hidden" name="status" value="cancel" />
                                                    <button title="Cancel Booking" className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </form>
                                            )}
                                            {booking.status === 'cancel' && (
                                                <span className="text-gray-400 text-xs">Cancelled</span>
                                            )}
                                        </div>
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
