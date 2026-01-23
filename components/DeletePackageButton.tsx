"use client";

import { Trash2 } from "lucide-react";
import { deletePackage } from "@/app/actions/admin";

interface DeletePackageButtonProps {
    packageId: number;
}

export default function DeletePackageButton({ packageId }: DeletePackageButtonProps) {
    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this package? This action cannot be undone.")) {
            try {
                const result = await deletePackage(packageId);
                if (result.message !== "Package deleted successfully") {
                    alert(result.message);
                }
            } catch (error) {
                console.error("Failed to delete package:", error);
                alert("An error occurred while deleting the package.");
            }
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Package"
        >
            <Trash2 className="w-5 h-5" />
        </button>
    );
}
