"use client";

import { useState, useTransition } from "react";
import { updateBookingStatus } from "@/app/actions/admin";

interface BookingStatusDropdownProps {
    bookingId: number;
    currentStatus: "pending" | "complete" | "cancel";
}

const statusOptions = [
    { value: "pending", label: "รอดำเนินการ", color: "bg-yellow-100 text-yellow-800" },
    { value: "complete", label: "ยืนยันการจอง", color: "bg-green-100 text-green-800" },
    { value: "cancel", label: "ยกเลิก", color: "bg-red-100 text-red-800" },
];

export default function BookingStatusDropdown({ bookingId, currentStatus }: BookingStatusDropdownProps) {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (newStatus !== currentStatus) {
            setPendingStatus(newStatus);
            setShowConfirm(true);
        }
    };

    const handleConfirm = () => {
        if (!pendingStatus) return;

        const formData = new FormData();
        formData.append("bookingId", bookingId.toString());
        formData.append("status", pendingStatus);

        startTransition(async () => {
            await updateBookingStatus(formData);
            setSelectedStatus(pendingStatus as any);
            setShowConfirm(false);
            setPendingStatus(null);
        });
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setPendingStatus(null);
        setSelectedStatus(currentStatus);
    };

    const getStatusLabel = (status: string) => {
        return statusOptions.find(s => s.value === status)?.label || status;
    };

    return (
        <>
            <select
                value={selectedStatus}
                onChange={handleChange}
                disabled={isPending}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 transition-colors
                    ${selectedStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedStatus === 'complete' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'}
                    ${isPending ? 'opacity-50 cursor-wait' : ''}`}
            >
                {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleCancel}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            ยืนยันการเปลี่ยนสถานะ
                        </h3>
                        <p className="text-gray-600 mb-6">
                            คุณต้องการเปลี่ยนสถานะการจอง #{bookingId} จาก{" "}
                            <span className="font-semibold">{getStatusLabel(currentStatus)}</span>
                            {" "}เป็น{" "}
                            <span className="font-semibold">{getStatusLabel(pendingStatus || "")}</span>
                            {" "}ใช่หรือไม่?
                        </p>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isPending}
                                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {isPending ? "กำลังดำเนินการ..." : "ยืนยัน"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
