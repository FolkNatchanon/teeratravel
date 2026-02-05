"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface ScheduleFilterTabsProps {
    currentFilter: string;
    upcomingCount: number;
    completedCount: number;
    totalCount: number;
}

export default function ScheduleFilterTabs({
    currentFilter,
    upcomingCount,
    completedCount,
    totalCount
}: ScheduleFilterTabsProps) {
    const tabs = [
        { key: 'upcoming', label: 'Upcoming', count: upcomingCount },
        { key: 'completed', label: 'Completed', count: completedCount },
        { key: 'all', label: 'All', count: totalCount },
    ];

    return (
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
            {tabs.map((tab) => (
                <Link
                    key={tab.key}
                    href={`/admin/schedule?filter=${tab.key}`}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
                        ${currentFilter === tab.key
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                        }`}
                >
                    {tab.label}
                    <span className={`px-1.5 py-0.5 rounded text-xs font-bold
                        ${currentFilter === tab.key
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                        {tab.count}
                    </span>
                </Link>
            ))}
        </div>
    );
}
