"use client";

import { useTransition } from "react";
import { createStaff } from "@/app/actions/staff";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function NewStaffPage() {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(() => {
            createStaff(formData);
        });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/staff"
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Add New Staff</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form action={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="fname" className="text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="fname"
                                id="fname"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="lname" className="text-sm font-medium text-gray-700">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lname"
                                id="lname"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="role" className="text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <select
                            name="role"
                            id="role"
                            required
                            defaultValue="staff"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                        >
                            <option value="staff">Staff (Crew)</option>
                            <option value="captain">Captain</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Link
                            href="/admin/staff"
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isPending ? "Adding..." : "Add Staff"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
