import TourCard from "@/components/TourCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // Revalidate every hour

export default async function PackagesPage() {
    const packages = await prisma.package.findMany({
        where: { status: "active" },
        orderBy: { package_id: 'asc' },
        include: { boat: true }
    });

    const privatePackages = packages.filter(p => p.type === 'private');
    const joinPackages = packages.filter(p => p.type === 'join');

    return (
        <main className="min-h-screen py-20 px-6 max-w-7xl mx-auto space-y-20">
            <div className="text-center mb-16">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    แพ็คเกจทัวร์ทั้งหมด
                </h1>
                <p className="mt-4 text-gray-600">
                    เลือกแพ็คเกจที่คุณสนใจและจองการเดินทางของคุณได้เลย
                </p>
            </div>

            {/* Private Tours Section */}
            {privatePackages.length > 0 && (
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Private Tours (เหมาลำ)</h2>
                        <div className="h-px flex-1 bg-gray-200"></div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8">
                        {privatePackages.map((pkg) => (
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
                </section>
            )}

            {/* Join Group Tours Section */}
            {joinPackages.length > 0 && (
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Join Group Tours (จอยกรุ๊ป)</h2>
                        <div className="h-px flex-1 bg-gray-200"></div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8">
                        {joinPackages.map((pkg) => (
                            <div key={pkg.package_id} className="w-full max-w-sm">
                                <TourCard
                                    id={pkg.package_id}
                                    title={pkg.name}
                                    price={Number(pkg.base_price)}
                                    // For Join tours, we show price per person logic in the card if needed, 
                                    // but TourCard might expect baseMemberCount. 
                                    // Passing 1 for Join types to indicate per person context conceptually if Card supports it, 
                                    // or logic inside TourCard needs adjustment. 
                                    // For now, assume baseMemberCount 1 is "per person"
                                    baseMemberCount={pkg.base_member_count}
                                    maxPeople={pkg.boat.capacity}
                                    duration={Number(pkg.duration_hours)}
                                    imageSrc={pkg.cover_image_url}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {packages.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    <p className="text-xl">ยังไม่มีแพ็คเกจทัวร์ในขณะนี้</p>
                </div>
            )}
        </main>
    );
}
