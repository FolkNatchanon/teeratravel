'use client';

import { FileText } from 'lucide-react';

interface ExportPDFButtonProps {
    type: 'private' | 'join';
    id: number;
}

export default function ExportPDFButton({ type, id }: ExportPDFButtonProps) {
    const handleExport = () => {
        window.open(`/api/trip-manifest?type=${type}&id=${id}`, '_blank');
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
            title="Export PDF"
        >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
        </button>
    );
}
