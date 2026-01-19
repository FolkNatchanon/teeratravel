
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BoatForm from "@/components/BoatForm";

export default function NewBoatPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/boats"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Add New Boat</h1>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <BoatForm />
            </div>
        </div>
    );
}
