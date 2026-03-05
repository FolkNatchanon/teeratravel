import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Users, Calendar, Instagram, Twitter, Facebook, Star } from "lucide-react";

export const revalidate = 3600;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F7FA]">

      {/* 1. Hero / Search Banner Section */}
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
              href="/recommendation"
              className="group inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-cyan-500/30"
            >
              แนะนำแพ็คเกจ
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

        {/* 2. Highlights Section */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Highlights</h2>
              <p className="text-slate-500">สถานที่ท่องเที่ยวแนะนำ ที่เราอยากให้คุณได้สัมผัส</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="relative h-80 rounded-2xl overflow-hidden group">
              <Image src="/Koh_Talu.png" alt="Snorkeling" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex items-center gap-1 text-xs mb-1 opacity-90"><MapPin className="w-3 h-3" /> เกาะทะลุ จังหวัดประจวบคีรีขันธ์</div>
                <h3 className="text-xl font-bold mb-1">Snorkeling</h3>
                <div className="flex items-center gap-1 text-xs text-yellow-400"><Star className="w-3 h-3 fill-current" /> <span className="text-white">4.9 <span className="opacity-70">(8.2k)</span></span></div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="relative h-80 rounded-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-200" /> {/* Placeholder color */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white z-10">
                <div className="flex items-center gap-1 text-xs mb-1 opacity-90"><MapPin className="w-3 h-3" /> เกาะทะลุ จังหวัดประจวบคีรีขันธ์</div>
                <h3 className="text-xl font-bold mb-1">Island Hopping</h3>
                <div className="flex items-center gap-1 text-xs text-yellow-400"><Star className="w-3 h-3 fill-current" /> <span className="text-white">4.8 <span className="opacity-70">(850)</span></span></div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="relative h-80 rounded-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-blue-200" /> {/* Placeholder color */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white z-10">
                <div className="flex items-center gap-1 text-xs mb-1 opacity-90"><MapPin className="w-3 h-3" /> เกาะทะลุ จังหวัดประจวบคีรีขันธ์</div>
                <h3 className="text-xl font-bold mb-1">Iconic Photo Spot</h3>
                <div className="flex items-center gap-1 text-xs text-yellow-400"><Star className="w-3 h-3 fill-current" /> <span className="text-white">4.9 <span className="opacity-70">(400)</span></span></div>
              </div>
            </div>
            {/* Card 4 */}
            <div className="relative h-80 rounded-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-pink-200" /> {/* Placeholder color */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white z-10">
                <div className="flex items-center gap-1 text-xs mb-1 opacity-90"><MapPin className="w-3 h-3" /> เกาะทะลุ จังหวัดประจวบคีรีขันธ์</div>
                <h3 className="text-xl font-bold mb-1">SUP Board</h3>
                <div className="flex items-center gap-1 text-xs text-yellow-400"><Star className="w-3 h-3 fill-current" /> <span className="text-white">4.7 <span className="opacity-70">(2.5k)</span></span></div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Tour Packages Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Title Card */}
          <div className="bg-[#F1F4F8] rounded-3xl p-10 flex flex-col justify-center items-start">
            <span className="text-slate-500 font-bold tracking-wider text-xs mb-6 uppercase">Curated for you</span>
            <h2 className="text-5xl font-extrabold text-[#1E293B] leading-tight mb-8">
              Tour<br />Packages
            </h2>
            <Link href="/packages" className="bg-[#1E293B] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-slate-800 transition-colors">
              Browse all packages
            </Link>
          </div>

          {/* Package 1 */}
          <div className="h-[450px] bg-slate-200 rounded-3xl overflow-hidden relative">
            {/* Replace with actual package promo image later */}
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-300">
              <span className="font-bold text-xl">Package 1 Image</span>
            </div>
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30">BEST SELLER</div>
          </div>

          {/* Package 2 */}
          <div className="h-[450px] bg-slate-200 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-blue-300">
              <span className="font-bold text-xl text-white">Package 2 Image</span>
            </div>
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30">BEST SELLER</div>
          </div>
        </section>

        {/* 4. Why choose Teera Section */}
        <section className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left: Text */}
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-extrabold text-[#1E293B] leading-tight text-center lg:text-left">
              ทำไมต้องเลือก Teera Travel?
            </h2>
            <p className="text-slate-500 leading-relaxed text-center lg:text-left max-w-lg">
              Teera Travel คัดสรรทริปคุณภาพหลากหลายรูปแบบ เพื่อตอบโจทย์ทุกไลฟ์สไตล์การเดินทาง
              ตั้งแต่ทริปพักผ่อนแบบส่วนตัว ไปจนถึงทริปดำน้ำและสัมผัสธรรมชาติอย่างใกล้ชิด
              ทุกการเดินทางถูกออกแบบอย่างใส่ใจ เพื่อประสบการณ์ที่พรีเมียมและน่าจดจำ
            </p>
          </div>

          {/* Right: Features */}
          <div className="flex-1 space-y-4 w-full">
            {/* Feature 1 */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 flex gap-4 items-start">
              <div className="mt-1"><MapPin className="text-[#334155] w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-[#1E293B] text-lg mb-1">Local Expertise</h3>
                <p className="text-slate-500 text-sm">ทริปที่ออกแบบโดยคนพื้นที่ รู้ลึกทุกมุมสวยและสถานที่พิเศษ</p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 flex gap-4 items-start">
              <div className="mt-1"><Calendar className="text-[#334155] w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-[#1E293B] text-lg mb-1">All-in-One Booking</h3>
                <p className="text-slate-500 text-sm">จองทริปได้ง่าย ครบทุกบริการในที่เดียว</p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 flex gap-4 items-start">
              <div className="mt-1">
                <svg className="text-[#334155] w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-[#1E293B] text-lg mb-1">24/7 Support</h3>
                <p className="text-slate-500 text-sm">ทีมงานพร้อมดูแลและให้คำแนะนำตลอดการเดินทาง เพื่อความอุ่นใจในทุกช่วงเวลา</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

