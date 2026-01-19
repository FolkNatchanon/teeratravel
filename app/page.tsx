import Link from "next/link";
import Image from "next/image";
import TourCard from "@/components/TourCard";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const packages = await prisma.package.findMany({
    where: { status: "active" },
    orderBy: { package_id: 'asc' },
    take: 6,
  });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full flex items-center justify-center text-center px-4">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Beautiful Beach"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-white space-y-8 mt-16">
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg leading-tight">
            ลองค้นหาทริปในฝันของคุณไปกับเราสิ!
          </h1>
          <p className="text-xl md:text-2xl font-medium drop-shadow-md text-white/90">
            สัมผัสประสบการณ์มหัศจรรย์ของการดำน้ำ <br className="hidden md:block" />
            ด้วยทัวร์นำเที่ยวผู้เชี่ยวชาญและอุปกรณ์ระดับพรีเมียมของเรา
          </p>

          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            เริ่มทำแบบทดสอบ
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            เลือกแพ็คเกจของคุณ
          </h2>
        </div>

        {packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <TourCard
                key={pkg.package_id}
                id={pkg.package_id}
                title={pkg.name}
                price={Number(pkg.base_price)}
                maxPeople={pkg.base_member_count}
                duration={Number(pkg.duration_hours)}
                imageSrc={pkg.cover_image_url}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p className="text-xl">ยังไม่มีแพ็คเกจทัวร์ในขณะนี้</p>
          </div>
        )}
      </section>
    </main>
  );
}
