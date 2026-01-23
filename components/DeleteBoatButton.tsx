"use client";

import { Trash2 } from "lucide-react";
import { deleteBoat } from "@/app/actions/admin";

interface DeleteBoatButtonProps {
    boatId: number;
}

export default function DeleteBoatButton({ boatId }: DeleteBoatButtonProps) {
    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this boat? This will checking if it's connected to valid packages or bookings.")) {
            try {
                const result = await deleteBoat(boatId);
                if (result.message !== "Boat deleted successfully") {
                    alert(result.message);
                }
            } catch (error) {
                console.error("Failed to delete boat:", error);
                alert("An error occurred while deleting the boat.");
            }
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="inline-flex p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Boat"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
