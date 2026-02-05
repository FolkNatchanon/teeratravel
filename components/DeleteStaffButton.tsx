"use client";

import { Trash2 } from "lucide-react";
import { deleteStaff } from "@/app/actions/staff";

interface DeleteStaffButtonProps {
    staffId: number;
}

export default function DeleteStaffButton({ staffId }: DeleteStaffButtonProps) {
    const handleDelete = async () => {
        if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบพนักงานคนนี้?")) {
            try {
                const result = await deleteStaff(staffId);
                if (result.message !== "Staff deleted successfully") {
                    alert(result.message);
                }
            } catch (error) {
                console.error("Failed to delete staff:", error);
                alert("เกิดข้อผิดพลาดในการลบพนักงาน");
            }
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="inline-flex p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="ลบพนักงาน"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
