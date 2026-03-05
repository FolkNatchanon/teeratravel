import Link from "next/link";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand */}
                <div className="space-y-4">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold tracking-tight text-white">Teera Travel</span>
                    </Link>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        เปิดประสบการณ์ใหม่แห่งการท่องเที่ยว ดำน้ำ ดูปะการัง กับทีมงานมืออาชีพ
                        ใส่ใจทุกรายละเอียดเพื่อความประทับใจของคุณ
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-bold mb-6 text-orange-400">เมนู</h3>
                    <ul className="space-y-3">
                        <li><Link href="/" className="text-slate-300 hover:text-white transition-colors">หน้าแรก</Link></li>
                        <li><Link href="/packages" className="text-slate-300 hover:text-white transition-colors">แพ็คเกจทัวร์</Link></li>
                        <li><Link href="/about" className="text-slate-300 hover:text-white transition-colors">เกี่ยวกับเรา</Link></li>
                        <li><Link href="/contact" className="text-slate-300 hover:text-white transition-colors">ติดต่อเรา</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-lg font-bold mb-6 text-orange-400">ติดต่อเรา</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-slate-300">
                            <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                            <span>16/15 หมู่ที่ 5 ตำบลบางสะพาน อำเภอบางสะพานน้อย จ.ประจวบคีรีขันธ์ 77170</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-300">
                            <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                            <span>094 715 9333</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-300">
                            <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                            <span>sales.teearatravel@gmail.com</span>
                        </li>
                    </ul>
                </div>

                {/* Social & Newsletter */}
                <div>
                    <h3 className="text-lg font-bold mb-6 text-orange-400">ติดตามเรา</h3>
                    <div className="flex gap-4">
                        <a href="https://www.facebook.com/TeeraTravel?locale=th_TH" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="https://www.instagram.com/teeratravel/" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="https://line.me/R/ti/p/@teeratravel" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-500 transition-colors">
                            <span className="font-bold text-xs">LINE</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Teera Travel. All rights reserved.</p>
            </div>
        </footer>
    );
}
