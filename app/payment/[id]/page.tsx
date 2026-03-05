import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || !session.userId) {
        redirect("/login");
    }

    const { id } = await params;
    const bookingId = parseInt(id);
    if (isNaN(bookingId)) {
        notFound();
    }

    const booking = await prisma.booking.findUnique({
        where: { booking_id: bookingId },
        include: { package: true }
    });

    if (!booking) {
        notFound();
    }

    // Only allow access if user is the booking owner OR user is an admin
    if (Number(booking.user_id) !== Number(session.userId) && session.role !== 'a') {
        notFound();
    }

    // Generate Booking Reference
    const bookingRef = `TRV-${booking.booking_id.toString().padStart(5, '0')}`;

    // Format Date
    const formattedDate = new Date(booking.trip_date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Determine Time
    const timeText = booking.time_slot === 'morning' ? 'รอบเช้า (08:00 - 12:00)' : 'รอบบ่าย (13:00 - 17:00)';

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">ชำระเงิน</h1>
                    <p className="mt-2 text-gray-600">กรุณาชำระเงินเพื่อยืนยันการจองทริปของคุณ</p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Booking Details Summary */}
                    <div className="bg-blue-50/50 p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <p className="text-sm font-semibold text-blue-600 mb-1">รหัสอ้างอิง: {bookingRef}</p>
                            <h2 className="text-xl font-bold text-gray-900">{booking.package.name}</h2>
                            <p className="text-gray-600 mt-1">{formattedDate} • {timeText}</p>
                            <p className="text-gray-500 text-sm mt-1">ผู้โดยสาร {booking.passenger_count} ท่าน</p>
                        </div>
                        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 text-center w-full md:w-auto">
                            <p className="text-sm text-gray-500 mb-1">ยอดชำระทั้งหมด</p>
                            <p className="text-3xl font-extrabold text-blue-600">
                                ฿{Number(booking.total_price).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
                        {/* QR Code Section */}
                        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                            <p className="font-medium text-gray-800 mb-4">สแกนเพื่อชำระเงิน (PromptPay)</p>
                            <div className="w-48 h-48 bg-white p-2 rounded-xl shadow-sm border border-gray-200 relative">
                                {/* Placeholder QR */}
                                <Image
                                    src="/qrcode.jpg"
                                    alt="PromptPay QR Code"
                                    fill
                                    className="object-contain p-2"
                                />
                                <div className="absolute inset-0 border-2 border-blue-500 rounded-xl opacity-20"></div>
                            </div>
                        </div>

                        {/* Instructions Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</div>
                                โอนเงินตามยอดที่ระบุ
                            </h3>
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">2</div>
                                ส่งสลิปยืนยันทาง LINE
                            </h3>
                            <p className="text-gray-600 ml-10">
                                หลังจากโอนเงินเรียบร้อยแล้ว กรุณาส่งสลิปโอนเงินมาที่ LINE Official Account ของเรา
                                พร้อมแจ้ง <span className="font-bold text-blue-600">รหัสอ้างอิง ({bookingRef})</span> เพื่อให้เจ้าหน้าที่ตรวจสอบ
                            </p>

                            <div className="ml-10 pt-4">
                                <a
                                    href="https://line.me/R/ti/p/@teeratravel"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex w-full items-center justify-center gap-2 bg-[#00B900] hover:bg-[#00A000] text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-200 transform hover:scale-105"
                                >
                                    {/* LINE Icon SVG */}
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-3.843 2.572-5.992z" />
                                    </svg>
                                    แจ้งสลิปผ่านทาง LINE
                                </a>
                                <p className="text-xs text-center text-gray-400 mt-3 flex flex-col">
                                    <span>หากคลิกไม่ได้ กรุณาแอด LINE ID:</span>
                                    <span className="font-bold">@teeratravel</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
