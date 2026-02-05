"use client";

import { useState, useTransition } from "react";
import { updateSessionStatus } from "@/app/actions/admin";

interface SessionStatusDropdownProps {
    sessionId: number;
    currentStatus: "active" | "closed" | "finished" | "cancelled";
}

const statusOptions = [
    { value: "active", label: "เปิดรับจอง", color: "bg-green-100 text-green-800" },
    { value: "closed", label: "ปิดรับจอง", color: "bg-yellow-100 text-yellow-800" },
    { value: "finished", label: "เสร็จสิ้น", color: "bg-gray-100 text-gray-600" },
    { value: "cancelled", label: "ยกเลิก", color: "bg-red-100 text-red-800" },
];

export default function SessionStatusDropdown({ sessionId, currentStatus }: SessionStatusDropdownProps) {
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
        formData.append("sessionId", sessionId.toString());
        formData.append("status", pendingStatus);

        startTransition(async () => {
            await updateSessionStatus(formData);
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

    const getStatusColor = (status: string) => {
        return statusOptions.find(s => s.value === status)?.color || "bg-gray-100 text-gray-800";
    };

    return (
        <>
            <select
                value={selectedStatus}
                onChange={handleChange}
                disabled={isPending}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 transition-colors
                    ${getStatusColor(selectedStatus)}
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
                            ยืนยันการเปลี่ยนสถานะ Session
                        </h3>
                        <p className="text-gray-600 mb-4">
                            คุณต้องการเปลี่ยนสถานะ Session #{sessionId} จาก{" "}
                            <span className="font-semibold">{getStatusLabel(currentStatus)}</span>
                            {" "}เป็น{" "}
                            <span className="font-semibold">{getStatusLabel(pendingStatus || "")}</span>
                            {" "}ใช่หรือไม่?
                        </p>

                        {pendingStatus === 'finished' && (
                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                                <strong>หมายเหตุ:</strong> การจบ Session จะอัพเดต Booking ทั้งหมดใน Session นี้เป็น "เสร็จสิ้น" ด้วยโดยอัตโนมัติ
                            </div>
                        )}

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
