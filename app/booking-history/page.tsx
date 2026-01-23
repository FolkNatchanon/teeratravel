import BookingCard from "@/components/BookingCard";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";


export default async function BookingHistoryPage() {
    const session = await getSession();
    if (!session || !session.userId) {
        return (
            <div className="min-h-[calc(100vh-100px)] bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center space-y-6 max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-500"
                        >
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">กรุณาเข้าสู่ระบบ</h2>
                        <p className="text-gray-500">
                            คุณจำเป็นต้องเข้าสู่ระบบสมาชิกก่อนเพื่อดูประวัติการจองทริปของคุณ
                        </p>
                    </div>
                    <div className="pt-2">
                        <a
                            href="/login?from=/booking-history"
                            className="block w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            เข้าสู่ระบบ
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const bookings = await prisma.booking.findMany({
        where: { user_id: session.userId },
        include: {
            package: true
        },
        orderBy: { created_at: 'desc' }
    });

    const mappedBookings = bookings.map(b => ({
        id: b.booking_id,
        title: b.package.name,
        location: b.package.short_intro, // Using short intro as location/desc context for now
        date: new Date(b.trip_date).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        status: (b.status === 'pending' ? 'upcoming' :
            b.status === 'complete' ? 'completed' :
                'cancelled') as "upcoming" | "completed" | "cancelled",
        price: Number(b.total_price),
        people: b.passenger_count,
        imageSrc: b.package.cover_image_url || "/placeholder.png",
    }));

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">ประวัติการจองของฉัน</h1>
                    <p className="mt-2 text-gray-600">
                        ดูรายการทริปที่กำลังจะมาถึงและประวัติการเดินทางที่ผ่านมา
                    </p>
                </div>

                <div className="space-y-4">
                    {mappedBookings.map((booking) => (
                        <BookingCard key={booking.id} {...booking} />
                    ))}
                </div>

                {mappedBookings.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                        <p className="text-gray-500 text-lg">คุณยังไม่มีประวัติการจอง</p>
                    </div>
                )}
            </div>
        </div>
    );
}
