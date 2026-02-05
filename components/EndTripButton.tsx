"use client";

import { useTransition } from "react";
import { updateBookingStatus, updateSessionStatus } from "@/app/actions/admin";
import { CheckCircle } from "lucide-react";

interface EndTripButtonProps {
    bookingId?: number;
    sessionId?: number;
    status: string;
    type: 'private' | 'join';
}

export default function EndTripButton({ bookingId, sessionId, status, type }: EndTripButtonProps) {
    const [isPending, startTransition] = useTransition();

    // For private: show only if booking status is 'complete'
    // For join: show only if session status is 'active' or 'closed'
    const canEndTrip = type === 'private'
        ? status === 'complete'
        : ['active', 'closed'].includes(status);

    if (!canEndTrip) return null;

    const handleEndTrip = () => {
        const message = type === 'private'
            ? "ยืนยันการจบทริป? การกระทำนี้หมายถึงลูกค้าใช้บริการเสร็จสิ้นแล้ว"
            : "ยืนยันการจบ Session? ระบบจะอัพเดต Booking ทั้งหมดใน Session นี้เป็น 'เสร็จสิ้น' ด้วย";

        if (!confirm(message)) return;

        const formData = new FormData();

        if (type === 'private' && bookingId) {
            formData.append("bookingId", bookingId.toString());
            formData.append("status", "finished");
            startTransition(async () => {
                await updateBookingStatus(formData);
            });
        } else if (type === 'join' && sessionId) {
            formData.append("sessionId", sessionId.toString());
            formData.append("status", "finished");
            startTransition(async () => {
                await updateSessionStatus(formData);
            });
        }
    };

    return (
        <button
            onClick={handleEndTrip}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            title={type === 'private' ? "กดเมื่อลูกค้าใช้บริการเสร็จสิ้น" : "กดเมื่อ Session ทั้งหมดเสร็จสิ้น"}
        >
            <CheckCircle className="w-3.5 h-3.5" />
            {isPending ? "Processing..." : "จบทริป"}
        </button>
    );
}
