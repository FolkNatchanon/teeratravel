import BookingCard from "@/components/BookingCard";

const MOCK_BOOKINGS = [
    {
        id: 101,
        title: "ทริปดำน้ำเกาะเต่า",
        location: "เกาะเต่า, สุราษฎร์ธานี",
        date: "15 เม.ย. 2024",
        status: "upcoming" as const,
        price: 4500,
        people: 2,
        imageSrc: "/hero.png",
    },
    {
        id: 102,
        title: "ทัวร์หมู่เกาะสิมิลัน",
        location: "พังงา",
        date: "10 ธ.ค. 2023",
        status: "completed" as const,
        price: 8900,
        people: 4,
        imageSrc: "/hero.png",
    },
    {
        id: 103,
        title: "ล่องเรือแม่น้ำเจ้าพระยา",
        location: "กรุงเทพมหานคร",
        date: "25 พ.ย. 2023",
        status: "cancelled" as const,
        price: 2200,
        people: 2,
        imageSrc: "/hero.png",
    },
];

export default function BookingHistoryPage() {
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
                    {MOCK_BOOKINGS.map((booking) => (
                        <BookingCard key={booking.id} {...booking} />
                    ))}
                </div>

                {MOCK_BOOKINGS.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                        <p className="text-gray-500 text-lg">คุณยังไม่มีประวัติการจอง</p>
                    </div>
                )}
            </div>
        </div>
    );
}
