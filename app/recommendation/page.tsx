import { prisma } from "@/lib/prisma";
import RecommendationWizard from "@/components/RecommendationWizard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "แนะนำแพ็คเกจทัวร์ | Teera Travel",
    description: "ค้นหาทริปเรือที่ใช่สำหรับคุณในภูเก็ต",
};

export default async function RecommendationPage() {
    const packages = await prisma.package.findMany({
        where: {
            status: "active",
        },
        select: {
            package_id: true,
            name: true,
            cover_image_url: true,
            description: true,
            keywords: true,
            type: true,
            base_price: true,
        }
    });

    const formattedPackages = packages.map(pkg => ({
        ...pkg,
        base_price: Number(pkg.base_price),
        keywords: pkg.keywords || ""
    }));

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-blue-600 py-12 px-4 mb-8">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">ค้นหาทริปที่ใช่สำหรับคุณ</h1>
                    <p className="text-xl text-blue-100">ตอบคำถามสั้นๆ 10 ข้อ แล้วเราจะแนะนำแพ็คเกจเรือที่เหมาะกับสไตล์ของคุณ</p>
                </div>
            </div>

            <RecommendationWizard packages={formattedPackages} />
        </div>
    );
}
