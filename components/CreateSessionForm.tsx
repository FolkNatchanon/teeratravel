"use client";

import { useState, useTransition } from "react";
import { createJoinSession } from "@/app/actions/join-session";
import { Loader2 } from "lucide-react";

interface CreateSessionFormProps {
    packageId: number;
    defaultCapacity: number;
    defaultPrice: number;
}

export default function CreateSessionForm({ packageId, defaultCapacity, defaultPrice }: CreateSessionFormProps) {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            await createJoinSession(formData);
        });
    };

    return (
        <form action={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 border-b pb-2 mb-4">Open New Session</h3>

            <input type="hidden" name="packageId" value={packageId} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Trip Date</label>
                    <input
                        type="date"
                        name="tripDate"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Time Slot</label>
                    <select
                        name="timeSlot"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="morning">Morning (09:00 - 12:00)</option>
                        <option value="afternoon">Afternoon (13:00 - 17:00)</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Max Capacity</label>
                    <input
                        type="number"
                        name="maxCapacity"
                        required
                        defaultValue={defaultCapacity}
                        min={1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <p className="text-xs text-gray-500">Defaults to boat capacity ({defaultCapacity})</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Price Per Person (฿)</label>
                    <input
                        type="number"
                        name="pricePerPerson"
                        defaultValue={defaultPrice}
                        min={0}
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <p className="text-xs text-gray-500">Override base price (Default: ฿{defaultPrice})</p>
                </div>
            </div>

            <div className="pt-2 flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                >
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isPending ? "Creating..." : "Create Session"}
                </button>
            </div>
        </form>
    );
}
