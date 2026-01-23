import Link from "next/link";
import Image from "next/image";
import { Clock, Users } from "lucide-react";

interface TourCardProps {
    id: number;
    title: string;
    price: number;
    baseMemberCount: number; // For price calculation
    maxPeople: number;      // Boat capacity
    duration: number; // hours
    imageSrc: string;
}

export default function TourCard({ id, title, price, baseMemberCount, maxPeople, duration, imageSrc }: TourCardProps) {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
            {/* Image */}
            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <div className="text-right">
                        <span className="block text-xl font-bold text-blue-600">{price.toLocaleString()}฿</span>
                        <span className="text-sm text-gray-600 font-medium">/ {baseMemberCount}คน</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-gray-700 text-sm mb-8">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{duration} ชั่วโมง</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>สูงสุด {maxPeople} คน</span>
                    </div>
                </div>

                <div className="mt-auto">
                    <Link
                        href={`/packages/${id}`}
                        className="block w-full text-center bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        ดูรายละเอียด
                    </Link>
                </div>
            </div>
        </div>
    );
}
