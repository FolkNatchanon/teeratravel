"use client";

import { useState } from "react";
import { Users, X } from "lucide-react";
import AssignStaffForm from "./AssignStaffForm";
import { Staff } from "@prisma/client";

// Since I haven't confirmed shadcn exists, I'll build a custom simple modal to be safe and dependency-free for now.
// If the user has a UI library, I'd usually use it, but "teeratravel" sounds like a custom build.
// I'll create a self-contained Modal component.

interface StaffAssignmentModalProps {
    bookingId?: number;
    sessionId?: number;
    allStaff: Staff[];
    initialAssignedStaff: Staff[];
}

export default function StaffAssignmentModal({ bookingId, sessionId, allStaff, initialAssignedStaff }: StaffAssignmentModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
            >
                <Users className="w-4 h-4" />
                จัดการพนักงาน
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                จัดการพนักงานประจำเรือ
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 bg-gray-50/50">
                            <AssignStaffForm
                                bookingId={bookingId}
                                sessionId={sessionId}
                                allStaff={allStaff}
                                initialAssignedStaff={initialAssignedStaff}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
