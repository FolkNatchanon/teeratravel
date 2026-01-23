import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, Users, Anchor, MapPin, CheckCircle } from "lucide-react";
import BookingForm from "@/components/BookingForm";

import { getSession } from "@/lib/session";

export default async function PackageDetailPage({ params }: { params: { id: string } }) {
    // Await params in case it's a promise (Next.js 15+ change, safe to await)
    const resolvedParams = await params;
    const packageId = Number(resolvedParams.id);

    if (isNaN(packageId)) {
        notFound();
    }

    const session = await getSession();

    const pkg = await prisma.package.findUnique({
        where: { package_id: packageId },
        include: { boat: true },
    });

    if (!pkg) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="relative h-[50vh] w-full">
                <Image
                    src={pkg.cover_image_url}
                    alt={pkg.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white bg-gradient-to-t from-black/80 to-transparent">
                    <div className="max-w-7xl mx-auto">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                            {pkg.type === 'private' ? 'Private Tour' : 'Join Tour'}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{pkg.name}</h1>
                        <p className="text-xl opacity-90">{pkg.short_intro}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex flex-col items-center justify-center text-center p-2">
                            <Clock className="w-6 h-6 text-blue-600 mb-2" />
                            <span className="text-sm text-gray-600">Duration</span>
                            <span className="font-semibold text-gray-600">{Number(pkg.duration_hours)} Hours</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center p-2">
                            <Users className="w-6 h-6 text-blue-600 mb-2" />
                            <span className="text-sm text-gray-600">Capacity</span>
                            <span className="font-semibold text-gray-600">Max {pkg.boat.capacity}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center p-2">
                            <Anchor className="w-6 h-6 text-blue-600 mb-2" />
                            <span className="text-sm text-gray-600">Boat</span>
                            <span className="font-semibold text-gray-600">{pkg.boat.name}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center p-2">
                            <MapPin className="w-6 h-6 text-blue-600 mb-2" />
                            <span className="text-sm text-gray-600">Location</span>
                            <span className="font-semibold text-gray-600">Koh Talu</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">รายละเอียดแพ็คเกจ</h2>
                        <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                            {pkg.description}
                        </div>
                    </div>
                </div>

                {/* Booking Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                        <div className="mb-6">
                            <span className="text-gray-500 text-sm">ราคาเริ่มต้น</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-blue-600">฿{Number(pkg.base_price).toLocaleString()}</span>
                                <span className="text-gray-400">/ ทริป</span>
                            </div>
                        </div>

                        <BookingForm
                            packageId={pkg.package_id}
                            baseMemberCount={pkg.base_member_count}
                            extraPricePerPerson={Number(pkg.extra_price_per_person)}
                            maxCapacity={pkg.boat.capacity}
                            basePrice={Number(pkg.base_price)}
                            isLoggedIn={!!session}
                        />

                        <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>ยืนยันการจองทันที</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>ยกเลิกฟรี 24 ชม. ก่อนเดินทาง</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
