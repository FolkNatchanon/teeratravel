import TourCard from "@/components/TourCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // Revalidate every hour

export default async function PackagesPage() {
    const packages = await prisma.package.findMany({
        where: { status: "active" },
        orderBy: { package_id: 'asc' },
        include: { boat: true }
    });

    return (
        <main className="min-h-screen py-20 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    แพ็คเกจทัวร์ทั้งหมด
                </h1>
                <p className="mt-4 text-gray-600">
                    เลือกแพ็คเกจที่คุณสนใจและจองการเดินทางของคุณได้เลย
                </p>
            </div>

            {packages.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-8">
                    {packages.map((pkg) => (
                        <div key={pkg.package_id} className="w-full max-w-sm">
                            <TourCard
                                id={pkg.package_id}
                                title={pkg.name}
                                price={Number(pkg.base_price)}
                                baseMemberCount={pkg.base_member_count}
                                maxPeople={pkg.boat.capacity}
                                duration={Number(pkg.duration_hours)}
                                imageSrc={pkg.cover_image_url}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-10">
                    <p className="text-xl">ยังไม่มีแพ็คเกจทัวร์ในขณะนี้</p>
                </div>
            )}
        </main>
    );
}
