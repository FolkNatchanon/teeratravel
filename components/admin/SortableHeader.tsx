"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface SortableHeaderProps {
    label: string;
    column: string;
    currentSort?: string;
    currentOrder?: string;
    className?: string;
}

export default function SortableHeader({ label, column, currentSort, currentOrder, className = "" }: SortableHeaderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const isCurrent = currentSort === column;
    const nextOrder = isCurrent && currentOrder === "asc" ? "desc" : "asc";

    const handleClick = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", column);
        params.set("order", nextOrder);
        router.push(`?${params.toString()}`);
    };

    return (
        <button
            onClick={handleClick}
            className={`flex items-center gap-1 hover:text-gray-700 transition-colors font-medium w-full ${className}`}
        >
            {label}
            <span className="text-gray-400">
                {isCurrent ? (
                    currentOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                ) : (
                    <ArrowUpDown className="w-3 h-3" />
                )}
            </span>
        </button>
    );
}
