"use client";

import { Mail, MapPin, Phone, Facebook, Instagram, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Form submitted:", formData);
        alert("ขอบคุณสำหรับข้อความ เราจะติดต่อกลับโดยเร็วที่สุด");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                        ติดต่อเรา
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        มีคำถามหรือต้องการสอบถามข้อมูลเพิ่มเติม?
                        สามารถติดต่อเราได้ทุกช่องทางด้านล่างนี้
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Contact Info */}
                    <div className="space-y-8">
                        {/* Contact Details Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-all hover:-translate-y-1 group">
                                <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
                                    <Phone className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg mb-2">เบอร์โทรศัพท์</h3>
                                <p className="text-slate-600 font-medium">094 715 9333</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-all hover:-translate-y-1 group">
                                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                                    <Mail className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg mb-2">อีเมล</h3>
                                <p className="text-slate-600 font-medium break-all">
                                    sales.teearatravel@gmail.com
                                </p>
                            </div>
                        </div>

                        {/* Social Media Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="w-1 h-8 bg-orange-500 rounded-full block"></span>
                                ช่องทางโซเชียลมีเดีย
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <a
                                    href="https://www.facebook.com/TeeraTravel?locale=th_TH"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center gap-3 p-4 bg-[#1877F2]/5 text-[#1877F2] rounded-xl hover:bg-[#1877F2] hover:text-white transition-all group"
                                >
                                    <Facebook className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold">Facebook</span>
                                </a>

                                <a
                                    href="https://www.facebook.com/messages/t/TeeraTravel/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center gap-3 p-4 bg-[#0084FF]/5 text-[#0084FF] rounded-xl hover:bg-[#0084FF] hover:text-white transition-all group"
                                >
                                    <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold">Messenger</span>
                                </a>

                                <a
                                    href="https://www.instagram.com/teeratravel/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center gap-3 p-4 bg-[#833AB4]/5 text-[#E1306C] rounded-xl hover:bg-gradient-to-tr hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white transition-all group"
                                >
                                    <Instagram className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold">Instagram</span>
                                </a>

                                <a
                                    href="https://line.me/R/ti/p/@teeratravel"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center gap-3 p-4 bg-[#06C755]/5 text-[#06C755] rounded-xl hover:bg-[#06C755] hover:text-white transition-all group"
                                >
                                    {/* Line Icon (Text for now or use closest icon) */}
                                    <span className="w-8 h-8 flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">L</span>
                                    <span className="font-bold">LINE</span>
                                </a>
                            </div>
                        </div>

                        {/* Address Card (Moved to left side for better flow) */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg mb-2">
                                    ที่อยู่สำนักงาน
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Teera Travel Pakklong
                                    <br />
                                    16/15 หมู่ที่ 5 ตำบลบางสะพาน อำเภอบางสะพานน้อย
                                    <br />
                                    จังหวัดประจวบคีรีขันธ์ 77170
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Map */}
                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 lg:sticky lg:top-24 h-[600px]">
                        <div className="w-full h-full bg-slate-100 rounded-xl overflow-hidden relative">
                            <iframe
                                src="https://maps.google.com/maps?q=Teera+Travel+Pakklong&hl=th&z=15&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0"
                            ></iframe>
                        </div>
                        <div className="p-4 text-center">
                            <a
                                href="https://www.google.com/maps/dir//%E0%B8%98%E0%B8%B5%E0%B8%A3%E0%B8%B0%E0%B9%81%E0%B8%97%E0%B8%A3%E0%B9%80%E0%B8%A7%E0%B8%B4%E0%B8%A5+%E0%B8%94%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B9%80%E0%B8%81%E0%B8%B2%E0%B8%B0%E0%B8%97%E0%B8%B0%E0%B8%A5%E0%B8%B8+Teera+Travel+Pakklong,+%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5+%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B8%AA%E0%B8%B0%E0%B8%9E%E0%B8%B2%E0%B8%99+%E0%B8%AD%E0%B8%B3%E0%B9%80%E0%B8%A0%E0%B8%AD%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B8%AA%E0%B8%B0%E0%B8%9E%E0%B8%B2%E0%B8%99%E0%B8%99%E0%B9%89%E0%B8%AD%E0%B8%A2+%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%88%E0%B8%A7%E0%B8%9A%E0%B8%84%E0%B8%B5%E0%B8%A3%E0%B8%B5%E0%B8%82%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B9%8C+77170/@13.9116046,100.4059463,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x30ff23cf904d4c7b:0xbbdbab0abfda3212!2m2!1d99.4903262!2d11.089173?entry=ttu&g_ep=EgoyMDI2MDExOS4wIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 hover:underline transition-colors"
                            >
                                <MapPin className="w-4 h-4" />
                                นำทางด้วย Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
