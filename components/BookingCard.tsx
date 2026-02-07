import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

interface BookingCardProps {
    id: number;
    title: string;
    location: string;
    date: string;
    status: "upcoming" | "completed" | "cancelled" | "finished";
    price: number;
    imageSrc: string;
    people: number;
}

// Helper to validate image URL (reused logic)
function getValidImageUrl(url: string | null) {
    if (!url) return "/placeholder.png";
    try {
        new URL(url); // Will throw if invalid
        return url;
    } catch {
        return "/placeholder.png";
    }
}

export default function BookingCard({
    id,
    title,
    location,
    date,
    status,
    price,
    imageSrc,
    people,
}: BookingCardProps) {
    const statusColors = {
        upcoming: "bg-blue-100 text-blue-800",
        completed: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
        finished: "bg-gray-100 text-gray-800",
    };

    const statusText = {
        upcoming: "รอดำเนินการ",
        completed: "ยืนยันการจอง",
        cancelled: "ยกเลิก",
        finished: "เสร็จสิ้น",
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0">
                    <Image
                        src={getValidImageUrl(imageSrc)}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}
                            >
                                {statusText[status]}
                            </span>
                        </div>

                        <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm line-clamp-1">{location}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center text-gray-700">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span className="text-sm">{date}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Users className="w-4 h-4 mr-2" />
                                <span className="text-sm">{people} ท่าน</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100">
                        <div>
                            <span className="text-xs text-gray-600">ราคารวม</span>
                            <p className="text-lg font-bold text-blue-600">฿{price.toLocaleString()}</p>
                        </div>

                        <Link
                            href={`/booking-history/${id}`}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            ดูรายละเอียด
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
