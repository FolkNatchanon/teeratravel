
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Users, Anchor, ArrowLeft, User, Phone, Mail, FileText } from "lucide-react";
import BookingStatusDropdown from "@/components/BookingStatusDropdown";



// Helper to validate image URL
function getValidImageUrl(url: string | null) {
    if (!url) return "/placeholder.png";
    try {
        new URL(url);
        return url;
    } catch {
        return "/placeholder.png";
    }
}

export default async function AdminBookingDetailPage({ params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session || session.role !== "A") {
        redirect("/login");
    }

    const resolvedParams = await params;
    const bookingId = Number(resolvedParams.id);

    if (isNaN(bookingId)) {
        notFound();
    }

    const [booking, allStaff] = await Promise.all([
        prisma.booking.findUnique({
            where: { booking_id: bookingId },
            include: {
                package: {
                    include: { boat: true }
                },
                passengers: true,
                boat: true,
                user: true,
                staff: true,
            }
        }),
        prisma.staff.findMany({
            orderBy: { fname: 'asc' }
        })
    ]);

    if (!booking) {
        notFound();
    }

    const statusColors = {
        pending: "bg-blue-100 text-blue-800",
        complete: "bg-green-100 text-green-800",
        cancel: "bg-red-100 text-red-800",
        finished: "bg-gray-100 text-gray-600",
    };

    const statusText = {
        pending: "รอดำเนินการ",
        complete: "สำเร็จ",
        cancel: "ยกเลิก",
        finished: "เสร็จสิ้น",
    };

    const timeSlotText = {
        morning: "เช้า (09:00 - 12:00)",
        afternoon: "บ่าย (13:00 - 17:00)",
    };

    const genderText = {
        male: "ชาย",
        female: "หญิง",
        other: "อื่นๆ",
    };

    const formattedDate = new Date(booking.trip_date).toLocaleDateString('th-TH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/bookings"
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">รายละเอียดการจอง #{booking.booking_id}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Package Info Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="relative h-48 w-full">
                            <Image
                                src={getValidImageUrl(booking.package.cover_image_url)}
                                alt={booking.package.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h1 className="text-2xl font-bold">{booking.package.name}</h1>
                                <p className="text-white/80 text-sm mt-1">{booking.package.short_intro}</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-gray-500 font-medium">วันที่เดินทาง</span>
                                    <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                        {formattedDate}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-gray-500 font-medium">ช่วงเวลา</span>
                                    <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        {timeSlotText[booking.time_slot as keyof typeof timeSlotText]}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-gray-500 font-medium">ผู้โดยสาร</span>
                                    <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                                        <Users className="w-4 h-4 text-blue-600" />
                                        {booking.passenger_count} ท่าน
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-gray-500 font-medium">เรือ</span>
                                    <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                                        <Anchor className="w-4 h-4 text-blue-600" />
                                        {booking.boat.name}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Check-in / Passengers List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Users className="w-5 h-5 text-gray-500" />
                                รายชื่อผู้โดยสาร
                            </h2>
                            <span className="text-sm text-gray-500">ทั้งหมด {booking.passengers.length} ท่าน</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {booking.passengers.map((passenger: any, index: number) => (
                                <div key={passenger.passenger_id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{passenger.fname} {passenger.lname}</p>
                                        <p className="text-xs text-gray-500">
                                            อายุ {passenger.age} ปี • {genderText[passenger.gender as keyof typeof genderText]}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Management Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">จัดการสถานะ</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <span className="text-sm text-gray-500">สถานะปัจจุบัน</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[booking.status as keyof typeof statusColors]}`}>
                                    {statusText[booking.status as keyof typeof statusText]}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">เปลี่ยนสถานะ</label>
                                <BookingStatusDropdown
                                    bookingId={booking.booking_id}
                                    currentStatus={booking.status}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Staff Assignment Card (Read-Only) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            พนักงานประจำเรือ
                        </h2>
                        {booking.staff.length > 0 ? (
                            <div className="space-y-3">
                                {booking.staff.filter(s => s.role === 'captain').map(captain => (
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
                                {booking.staff.filter(s => s.role === 'staff').map(crew => (
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

                    {/* Customer Info Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            ข้อมูลลูกค้า
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{booking.user.user_fname} {booking.user.user_lname}</p>
                                    <p className="text-xs text-gray-500">@{booking.user.username}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {booking.user.email}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {booking.user.phone_number}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            ข้อมูลการชำระเงิน
                        </h2>
                        <div className="flex justify-between items-end">
                            <span className="text-sm text-gray-500">ราคารวมสุทธิ</span>
                            <span className="text-2xl font-bold text-blue-600">฿{Number(booking.total_price).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
