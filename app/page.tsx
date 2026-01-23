import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Koh_Talu.png"
            alt="Koh Talu Beach"
            fill
            className="object-cover brightness-75"
            priority
            quality={100}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-white space-y-10 animate-in fade-in zoom-in duration-1000">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-2xl leading-tight tracking-tight">
              เปิดประสบการณ์ใหม่ <br />
              <span className="text-cyan-400">แห่งท้องทะเลไทย</span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl font-light drop-shadow-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
            สัมผัสความงามของธรรมชาติ ดำน้ำดูปะการัง และพักผ่อนกับทริปสุดพิเศษ
            <br />ที่คัดสรรมาเพื่อคุณโดยเฉพาะ
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/packages"
              className="group inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-cyan-500/30"
            >
              ดูแพ็คเกจทัวร์
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/50 px-8 py-4 rounded-full font-bold text-lg transition-all hover:border-white"
            >
              ติดต่อเรา
              <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature/Teaser Section (Optional visual filler) */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
              ทำไมต้องเลือกเดินทางกับเรา?
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              เราให้บริการนำเที่ยวด้วยเรือสปีดโบ๊ทคุณภาพสูง พร้อมกัปตันและลูกเรือผู้เชี่ยวชาญ
              ที่จะพาคุณไปสัมผัสจุดชมวิวและจุดดำน้ำที่สวยที่สุด พร้อมการบริการที่ใส่ใจในทุกรายละเอียด
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

