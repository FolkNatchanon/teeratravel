import BookingCard from "@/components/BookingCard";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function BookingHistoryPage() {
    const session = await getSession();
    if (!session || !session.userId) {
        redirect("/login");
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
