"use client";

import { useActionState } from "react";
import { createBoatAction } from "@/app/actions/admin";
import Link from "next/link";

const initialState = {
    message: "",
    errors: {} as Record<string, string[]> | undefined,
};

export default function BoatForm() {
    // @ts-ignore
    const [state, formAction] = useActionState(createBoatAction, initialState);

    return (
        <form action={formAction} className="space-y-6">
            {state?.message && (
                <div className={`p-4 rounded-lg text-sm ${state.message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {state.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-900 mb-1">Boat Name</label>
                    <input type="text" name="name" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-500" placeholder="e.g. The Pearl" />
                    {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Capacity</label>
                    <input type="number" name="capacity" min={1} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" />
                    {state?.errors?.capacity && <p className="text-red-500 text-xs mt-1">{state.errors.capacity[0]}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Status</label>
                    <select name="status" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                <Link
                    href="/admin/boats"
                    className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md"
                >
                    Create Boat
                </button>
            </div>
        </form>
    );
}
