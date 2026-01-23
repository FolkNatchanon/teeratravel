import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Users, Anchor, ArrowLeft, User } from "lucide-react";

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

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session || !session.userId) {
        redirect("/login");
    }

    const resolvedParams = await params;
    const bookingId = Number(resolvedParams.id);

    if (isNaN(bookingId)) {
        notFound();
    }

    const booking = await prisma.booking.findUnique({
        where: { booking_id: bookingId },
        include: {
            package: {
                include: { boat: true }
            },
            passengers: true,
            boat: true
        }
    });

    // Check if booking exists and belongs to user
    if (!booking || booking.user_id !== session.userId) {
        notFound();
    }

    const statusColors = {
        pending: "bg-blue-100 text-blue-800",
        complete: "bg-green-100 text-green-800",
        cancel: "bg-red-100 text-red-800",
    };

    const statusText = {
        pending: "รอดำเนินการ",
        complete: "ยืนยันการจอง",
        cancel: "ยกเลิก",
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
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/booking-history"
                    className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    กลับไปหน้าประวัติการจอง
                </Link>

                {/* Header Card */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-6">
                    {/* Cover Image */}
                    <div className="relative h-64 w-full">
                        <Image
                            src={getValidImageUrl(booking.package.cover_image_url)}
                            alt={booking.package.name}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[booking.status]}`}>
                                {statusText[booking.status]}
                            </span>
                            <h1 className="text-3xl font-bold mt-2">{booking.package.name}</h1>
                            <p className="text-white/80 mt-1">{booking.package.short_intro}</p>
                        </div>
                    </div>

                    {/* Booking Info Grid */}
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-gray-100">
                        <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                            <Calendar className="w-5 h-5 text-blue-600 mb-2" />
                            <span className="text-xs text-gray-500">วันที่เดินทาง</span>
                            <span className="text-sm font-semibold text-gray-900">{formattedDate}</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                            <Clock className="w-5 h-5 text-blue-600 mb-2" />
                            <span className="text-xs text-gray-500">ช่วงเวลา</span>
                            <span className="text-sm font-semibold text-gray-900">{timeSlotText[booking.time_slot]}</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                            <Users className="w-5 h-5 text-blue-600 mb-2" />
                            <span className="text-xs text-gray-500">จำนวนผู้โดยสาร</span>
                            <span className="text-sm font-semibold text-gray-900">{booking.passenger_count} ท่าน</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                            <Anchor className="w-5 h-5 text-blue-600 mb-2" />
                            <span className="text-xs text-gray-500">เรือ</span>
                            <span className="text-sm font-semibold text-gray-900">{booking.boat.name}</span>
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="p-6 flex justify-between items-center bg-blue-50">
                        <div>
                            <span className="text-sm text-gray-600">ราคารวมทั้งหมด</span>
                            <p className="text-sm text-gray-500">รวมภาษีและค่าบริการแล้ว</p>
                        </div>
                        <span className="text-3xl font-bold text-blue-600">฿{Number(booking.total_price).toLocaleString()}</span>
                    </div>
                </div>

                {/* Passenger List */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        รายชื่อผู้โดยสาร
                    </h2>

                    {booking.passengers.length > 0 ? (
                        <div className="space-y-3">
                            {booking.passengers.map((passenger, index) => (
                                <div
                                    key={passenger.passenger_id}
                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">
                                            {index + 1}. {passenger.fname} {passenger.lname}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            อายุ {passenger.age} ปี • {genderText[passenger.gender]}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">ไม่มีข้อมูลผู้โดยสาร</p>
                    )}
                </div>

                {/* Booking ID Footer */}
                <div className="mt-6 text-center text-sm text-gray-400">
                    รหัสการจอง: #{booking.booking_id}
                </div>
            </div>
        </div>
    );
}
