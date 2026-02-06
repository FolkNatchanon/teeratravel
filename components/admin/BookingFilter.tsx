"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Search } from "lucide-react";
import { useState, useEffect } from "react";


const statusOptions = [
    { value: "all", label: "ทั้งหมด" },
    { value: "pending", label: "รอชำระเงิน" },
    { value: "complete", label: "ยืนยันการจอง" },
    { value: "finished", label: "เสร็จสิ้น" },
    { value: "cancel", label: "ยกเลิก" },
];

const typeOptions = [
    { value: "all", label: "ทุกประเภท" },
    { value: "private", label: "Private" },
    { value: "join", label: "Join" },
];

export default function BookingFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentStatus = searchParams.get("status") || "all";
    const currentType = searchParams.get("type") || "all";
    const currentSearch = searchParams.get("search") || "";
    const [searchTerm, setSearchTerm] = useState(currentSearch);

    // Debounce search update
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm === currentSearch) return;

            const params = new URLSearchParams(searchParams.toString());
            if (searchTerm) {
                params.set("search", searchTerm);
            } else {
                params.delete("search");
            }
            router.push(`?${params.toString()}`);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, router, searchParams, currentSearch]);


    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value;
        const params = new URLSearchParams(searchParams.toString());

        if (status === "all") {
            params.delete("status");
        } else {
            params.set("status", status);
        }

        router.push(`?${params.toString()}`);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value;
        const params = new URLSearchParams(searchParams.toString());

        if (type === "all") {
            params.delete("type");
        } else {
            params.set("type", type);
        }

        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                    type="text"
                    placeholder="Search Booking ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 transition-all"
                />
            </div>
            <select
                value={currentType}
                onChange={handleTypeChange}
                className="pl-3 pr-8 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-gray-50 transition-colors"
                aria-label="Filter bookings by type"
            >
                {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <select
                value={currentStatus}
                onChange={handleStatusChange}
                className="pl-3 pr-8 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-gray-50 transition-colors"
                aria-label="Filter bookings by status"
            >
                {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
