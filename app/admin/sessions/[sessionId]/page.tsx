import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Calendar, MapPin, Download, Phone, Mail, Clock } from "lucide-react";
import BookingStatusDropdown from "@/components/BookingStatusDropdown";
import ExportPDFButton from "@/components/ExportPDFButton";


export const dynamic = "force-dynamic";

export default async function SessionDetailsPage({ params }: { params: { sessionId: string } }) {
    const resolvedParams = await params;
    const sessionId = Number(resolvedParams.sessionId);

    if (isNaN(sessionId)) notFound();

    const [session, allBookings, allStaff] = await Promise.all([
        prisma.joinSession.findUnique({
            where: { session_id: sessionId },
            include: {
                package: {
                    include: { boat: true }
                },
                staff: true,
            }
        }),
        prisma.booking.findMany({
            where: { session_id: sessionId },
            include: {
                user: true,
                passengers: true
            }
        }),
        prisma.staff.findMany({
            orderBy: { fname: 'asc' }
        })
    ]);

    if (!session) notFound();

    // Calculate stats by status
    const confirmedBookings = allBookings.filter(b => b.status === 'complete' || b.status === 'finished');
    const pendingBookings = allBookings.filter(b => b.status === 'pending');
    const cancelledBookings = allBookings.filter(b => b.status === 'cancel');

    const confirmedPassengers = confirmedBookings.reduce((acc, b) => acc + b.passenger_count, 0);
    const pendingPassengers = pendingBookings.reduce((acc, b) => acc + b.passenger_count, 0);
    const totalActivePassengers = confirmedPassengers + pendingPassengers;
    const occupancy = totalActivePassengers / session.max_capacity;

    // Collect confirmed passengers into a flat list for the manifest (only complete/finished)
    const confirmedPassengersList = confirmedBookings.flatMap(booking =>
        booking.passengers.map(p => ({
            ...p,
            bookingId: booking.booking_id,
            bookingStatus: booking.status,
            contactName: `${booking.user.user_fname} ${booking.user.user_lname}`,
            contactPhone: booking.user.phone_number
        }))
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/schedule"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            Session Manifest
                            <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${session.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {session.status.toUpperCase()}
                            </span>
                        </h1>
                        <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                            <span className="font-medium text-gray-900">{session.package.name}</span>
                            <span>•</span>
                            <MapPin className="w-4 h-4" /> {session.package.boat.name}
                            <span>•</span>
                            <Calendar className="w-4 h-4" /> {new Date(session.trip_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            <span>•</span>
                            <Clock className="w-4 h-4" /> {session.time_slot}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <ExportPDFButton type="join" id={sessionId} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content: Stats + Manifest */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-xl border border-green-100 shadow-sm">
                            <div className="text-green-600 text-sm font-medium flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4" /> ยืนยันแล้ว
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                {confirmedPassengers} <span className="text-sm text-gray-400 font-normal">คน</span>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                                {confirmedBookings.length} booking(s)
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-yellow-100 shadow-sm">
                            <div className="text-yellow-600 text-sm font-medium flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4" /> รอชำระเงิน
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                {pendingPassengers} <span className="text-sm text-gray-400 font-normal">คน</span>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                                {pendingBookings.length} booking(s)
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm">
                            <div className="text-red-600 text-sm font-medium flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4" /> ยกเลิก
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                {cancelledBookings.length} <span className="text-sm text-gray-400 font-normal">booking(s)</span>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <div className="text-gray-500 text-sm font-medium flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4" /> ความจุ
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                {totalActivePassengers} <span className="text-sm text-gray-400 font-normal">/ {session.max_capacity}</span>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                                {Math.round(occupancy * 100)}% เต็ม
                            </div>
                        </div>
                    </div>

                    {/* Passenger Manifest Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-900">Passenger List</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">#</th>
                                        <th className="px-6 py-3 font-medium">Passenger Name</th>
                                        <th className="px-6 py-3 font-medium">Age/Gender</th>
                                        <th className="px-6 py-3 font-medium">Contact Person</th>
                                        <th className="px-6 py-3 font-medium">Booking ID</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {confirmedPassengersList.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                ยังไม่มีผู้โดยสารที่ยืนยันแล้ว
                                            </td>
                                        </tr>
                                    ) : (
                                        confirmedPassengersList.map((p, index) => (
                                            <tr key={index} className="hover:bg-gray-50/50">
                                                <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {p.fname} {p.lname}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {p.age} / {p.gender}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{p.contactName}</div>
                                                    <div className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                                                        <Phone className="w-3 h-3" /> {p.contactPhone}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link href={`/admin/bookings/${p.bookingId}`} className="text-blue-600 hover:underline">
                                                        #{p.bookingId}
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bookings Summary (Groups) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-900">Booking Groups</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Booking ID</th>
                                        <th className="px-6 py-3 font-medium">Contact</th>
                                        <th className="px-6 py-3 font-medium">Count</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {allBookings.map((booking) => (
                                        <tr key={booking.booking_id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 font-medium text-gray-900">#{booking.booking_id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{booking.user.user_fname} {booking.user.user_lname}</div>
                                                <div className="text-gray-500 text-xs">{booking.user.phone_number}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">{booking.passenger_count}</td>
                                            <td className="px-6 py-4">
                                                <BookingStatusDropdown
                                                    bookingId={booking.booking_id}
                                                    currentStatus={booking.status}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/admin/bookings/${booking.booking_id}`}
                                                    className="text-blue-600 hover:text-blue-900 font-medium"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Staff Assignment Card (Read-Only) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Boat Staff
                        </h2>
                        {session.staff.length > 0 ? (
                            <div className="space-y-3">
                                {session.staff.filter(s => s.role === 'captain').map(captain => (
                                    <div key={captain.staff_id} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                            C
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{captain.fname} {captain.lname}</p>
                                            <p className="text-xs text-gray-500">Captain</p>
                                        </div>
                                    </div>
                                ))}
                                {session.staff.filter(s => s.role === 'staff').map(crew => (
                                    <div key={crew.staff_id} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs">
                                            S
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{crew.fname} {crew.lname}</p>
                                            <p className="text-xs text-gray-500">Crew</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg">
                                No staff assigned yet.
                                <br />
                                <span className="text-xs">Go to Schedule to assign.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
