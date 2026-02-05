import { prisma } from "@/lib/prisma";
import { Users, Calendar, Package, Anchor, TrendingUp, DollarSign } from "lucide-react";
import { formatId } from "@/lib/utils";

export default async function AdminDashboard() {
    const [
        bookingCount,
        packageCount,
        boatCount,
        recentBookings,
        totalRevenue
    ] = await Promise.all([
        prisma.booking.count(),
        prisma.package.count(),
        prisma.boat.count(),
        prisma.booking.findMany({
            take: 5,
            orderBy: { created_at: "desc" },
            include: { user: true, package: true }
        }),
        prisma.booking.aggregate({
            _sum: { total_price: true },
            where: { status: { not: 'cancel' } } // Exclude cancelled
        })
    ]);

    const stats = [
        { name: "Total Revenue", value: `฿${Number(totalRevenue._sum.total_price || 0).toLocaleString()}`, icon: DollarSign, color: "bg-green-500" },
        { name: "Total Bookings", value: bookingCount, icon: Calendar, color: "bg-blue-500" },
        { name: "Active Packages", value: packageCount, icon: Package, color: "bg-purple-500" },
        { name: "Fleet Size", value: boatCount, icon: Anchor, color: "bg-orange-500" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Overview of your travel business</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                            <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-medium">ID</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Package</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentBookings.map((booking) => (
                                <tr key={booking.booking_id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{formatId(booking.booking_id, 'booking')}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="font-medium text-gray-900">{booking.user.user_fname} {booking.user.user_lname}</div>
                                        <div className="text-gray-500 text-xs">{booking.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{booking.package.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(booking.trip_date).toLocaleDateString('th-TH')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                booking.status === 'complete' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        ฿{Number(booking.total_price).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {recentBookings.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No bookings found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
