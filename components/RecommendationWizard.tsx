"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";

// Types
interface Package {
    package_id: number;
    name: string;
    cover_image_url: string;
    description: string;
    keywords: string; // Comma separated
    type: string;
    base_price: number;
}

interface Question {
    id: number;
    text: string;
    options: {
        label: string;
        keywords: string[];
    }[];
}

// Hardcoded Questions
const QUESTIONS: Question[] = [
    {
        id: 1,
        text: "คุณชอบการท่องเที่ยวสไตล์ไหน?",
        options: [
            { label: "พักผ่อนชิลๆ ริมทะเล", keywords: ["RELAX", "ROMANTIC"] },
            { label: "ผจญภัยและกิจกรรม (ดำน้ำ/กีฬา)", keywords: ["ADVENTURE"] },
            { label: "ปาร์ตี้และสีสันยามค่ำคืน", keywords: ["PARTY"] },
            { label: "ซึมซับวัฒนธรรมและประวัติศาสตร์", keywords: ["CULTURE"] },
        ]
    },
    {
        id: 2,
        text: "คุณเดินทางมากับใคร?",
        options: [
            { label: "มาคนเดียว (Solo)", keywords: ["RELAX", "ADVENTURE"] },
            { label: "มาเป็นคู่ / ฮันนีมูน", keywords: ["ROMANTIC"] },
            { label: "มากับครอบครัวและเด็กๆ", keywords: ["FAMILY"] },
            { label: "มากับกลุ่มเพื่อน", keywords: ["PARTY", "ADVENTURE"] },
        ]
    },
    {
        id: 3,
        text: "งบประมาณของคุณเป็นอย่างไร?",
        options: [
            { label: "เน้นประหยัด / คุ้มค่า", keywords: [] },
            { label: "ปานกลาง สมเหตุสมผล", keywords: [] },
            { label: "จัดเต็มระดับ Luxury / ไม่จำกัดงบ", keywords: ["ROMANTIC"] },
        ]
    },
    {
        id: 4,
        text: "คุณต้องการความเป็นส่วนตัวแค่ไหน?",
        options: [
            { label: "ต้องการเหมาลำส่วนตัว (Private)", keywords: ["ROMANTIC", "FAMILY"] },
            { label: "จอยกับคนอื่นได้ เน้นเพื่อนใหม่ (Join)", keywords: ["PARTY"] },
        ]
    },
    {
        id: 5,
        text: "คุณอยากใช้เวลาบนเรือนานแค่ไหน?",
        options: [
            { label: "ครึ่งวัน (3-4 ชั่วโมง)", keywords: [] },
            { label: "เต็มวัน (6-8 ชั่วโมง)", keywords: [] },
            { label: "ช่วงเย็น / ดูพระอาทิตย์ตก", keywords: ["ROMANTIC", "PARTY"] },
        ]
    },
    {
        id: 6,
        text: "คุณสนใจดำน้ำหรือว่ายน้ำไหม?",
        options: [
            { label: "ชอบมาก! อยากดำน้ำดูปะการัง", keywords: ["ADVENTURE", "RELAX"] },
            { label: "ไม่เน้น แค่นั่งเรือชมวิวถ่ายรูปก็พอ", keywords: ["CULTURE", "RELAX"] },
        ]
    },
    {
        id: 7,
        text: "คุณชอบถ่ายรูปไหม?",
        options: [
            { label: "สายคอนเทนต์ ต้องได้รูปสวยๆ", keywords: ["RELAX", "CULTURE"] },
            { label: "ไม่ค่อยเน้น เน้นบรรยากาศจริง", keywords: [] },
        ]
    },
    {
        id: 8,
        text: "ระดับความลุยของคุณ?",
        options: [
            { label: "ลุยได้เต็มที่ (เดินป่า/ปีนเขา)", keywords: ["ADVENTURE"] },
            { label: "กลางๆ พอประมาณ", keywords: ["RELAX"] },
            { label: "ขอแบบสบายๆ ไม่เหนื่อย", keywords: ["RELAX"] },
        ]
    },
    {
        id: 9,
        text: "คุณชอบสถานที่แบบไหน?",
        options: [
            { label: "จุดฮิตยอดนิยม (Must-see)", keywords: ["CULTURE", "PARTY"] },
            { label: "ที่ลับๆ คนน้อย (Hidden Gems)", keywords: ["RELAX", "ROMANTIC"] },
        ]
    },
    {
        id: 10,
        text: "คุณสนใจตกหมึก/ตกปลาไหม?",
        options: [
            { label: "สนใจ อยากตกปลาสดๆ", keywords: ["ADVENTURE"] },
            { label: "ไม่สนใจ", keywords: [] },
        ]
    }
];

export default function RecommendationWizard({ packages }: { packages: Package[] }) {
    const [step, setStep] = useState(0);
    const [userKeywords, setUserKeywords] = useState<string[]>([]);
    const [showResults, setShowResults] = useState(false);

    const checkOverlap = (packageKeywords: string[], userKeywords: string[]) => {
        let score = 0;
        const normalizedPkgKeywords = packageKeywords.map(k => k.trim().toLowerCase());
        const normalizedUserKeywords = userKeywords.map(k => k.trim().toLowerCase());

        for (const uK of normalizedUserKeywords) {
            if (normalizedPkgKeywords.some(pK => pK.includes(uK) || uK.includes(pK))) {
                score++;
            }
        }
        return score;
    };

    const getRecommendedPackages = () => {
        const scoredPackages = packages.map(pkg => {
            const pkgKeywords = (pkg.keywords || "").split(",");
            const score = checkOverlap(pkgKeywords, userKeywords);
            return { ...pkg, score };
        });

        // Filter out packages with 0 score if we have keywords, unless we want to show fallbacks
        // Sort by score desc, then random or name
        return scoredPackages
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    };

    const handleAnswer = (keywords: string[]) => {
        setUserKeywords(prev => [...prev, ...keywords]);
        if (step < QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            setShowResults(true);
        }
    };

    const reset = () => {
        setStep(0);
        setUserKeywords([]);
        setShowResults(false);
    };

    if (showResults) {
        const recommended = getRecommendedPackages();

        return (
            <div className="max-w-4xl mx-auto py-12 px-4">
                <h2 className="text-3xl font-bold text-center mb-8">เราพบทริปที่เหมาะกับคุณ!</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommended.map(pkg => (
                        <Link href={`/packages/${pkg.package_id}`} key={pkg.package_id} className="block group">
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow h-full flex flex-col">
                                <div className="h-48 relative bg-gray-200">
                                    {/* Handle potential invalid image URLs */}
                                    {pkg.cover_image_url && (
                                        <Image
                                            src={pkg.cover_image_url}
                                            alt={pkg.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2 gap-2">
                                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{pkg.name}</h3>
                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full uppercase shrink-0">
                                            {pkg.score > 0 ? `ตรงใจ ${pkg.score} ข้อ` : 'แนะนำ'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">{pkg.description}</p>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                        <span className="text-lg font-bold text-blue-600">฿{pkg.base_price?.toLocaleString()}</span>
                                        <span className="text-sm text-gray-500 group-hover:text-blue-500 flex items-center gap-1 font-medium">
                                            ดูรายละเอียด <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button onClick={reset} className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">
                        <RefreshCw className="w-5 h-5" />
                        เริ่มใหม่
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = QUESTIONS[step];

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Question {step + 1} of {QUESTIONS.length}</span>
                    <span>{Math.round(((step + 1) / QUESTIONS.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300 ease-out"
                        style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 min-h-[400px] flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">{currentQuestion.text}</h3>

                <div className="grid grid-cols-1 gap-4">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(option.keywords)}
                            className="w-full text-left px-6 py-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                        >
                            <span className="text-lg font-medium text-gray-700 group-hover:text-blue-700 pointer-events-none">
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

