import Image from "next/image";
import Link from "next/link";
import TourCard from "@/components/TourCard";
import { ArrowRight } from "lucide-react";

// Mock Data for Packages
const MOCK_PACKAGES = [
  {
    id: 1,
    title: "Teera Travel 1",
    price: 6900,
    maxPeople: 24,
    duration: 3,
    imageSrc: "/hero.png", // Using hero image as placeholder for package too
  },
  {
    id: 2,
    title: "Teera Travel 2",
    price: 8900,
    maxPeople: 24,
    duration: 3,
    imageSrc: "/hero.png",
  },
  {
    id: 3,
    title: "Teera Travel 3",
    price: 15900,
    maxPeople: 30,
    duration: 5,
    imageSrc: "/hero.png",
  },
];

export default function Home() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PACKAGES.map((pkg) => (
            <TourCard
              key={pkg.id}
              id={pkg.id}
              title={pkg.title}
              price={pkg.price}
              maxPeople={pkg.maxPeople}
              duration={pkg.duration}
              imageSrc={pkg.imageSrc}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
