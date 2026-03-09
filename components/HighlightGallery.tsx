"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, X } from "lucide-react";

interface HighlightCard {
    image: string;
    title?: string;
    location?: string;
}

const highlights: HighlightCard[] = [
    { image: "/Koh_Talu.png", location: "เกาะทะลุ จังหวัดประจวบคีรีขันธ์" },
    { image: "/HighLight2.png" },
    { image: "/HighLight3.png" },
    { image: "/HighLight4.png" },
];

export default function HighlightGallery() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {highlights.map((card, i) => (
                    <div
                        key={i}
                        className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
                        onClick={() => setSelectedImage(card.image)}
                    >
                        <Image
                            src={card.image}
                            alt={card.title || `Highlight ${i + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white z-10">
                            {card.location && (
                                <div className="flex items-center gap-1 text-xs mb-1 opacity-90">
                                    <MapPin className="w-3 h-3" /> {card.location}
                                </div>
                            )}
                            {card.title && <h3 className="text-xl font-bold mb-1">{card.title}</h3>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Fullscreen Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <div className="relative w-full h-full max-w-5xl max-h-[85vh]">
                        <Image
                            src={selectedImage}
                            alt="Highlight full view"
                            fill
                            className="object-contain"
                            quality={100}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
