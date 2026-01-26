"use client";

import { useState, useTransition } from "react";
import { assignStaffToBooking } from "@/app/actions/booking";
import { Staff } from "@prisma/client";
import { Users, Loader2, Save } from "lucide-react";

interface AssignStaffFormProps {
    bookingId: number;
    allStaff: Staff[];
    initialAssignedStaff: Staff[];
}

export default function AssignStaffForm({ bookingId, allStaff, initialAssignedStaff }: AssignStaffFormProps) {
    const [selectedCaptainId, setSelectedCaptainId] = useState<number | "">(
        initialAssignedStaff.find(s => s.role === 'captain')?.staff_id || ""
    );
    const [selectedCrewIds, setSelectedCrewIds] = useState<number[]>(
        initialAssignedStaff.filter(s => s.role === 'staff').map(s => s.staff_id)
    );
    const [isPending, startTransition] = useTransition();

    const captains = allStaff.filter(s => s.role === 'captain');
    const crewMembers = allStaff.filter(s => s.role === 'staff');

    const handleCrewChange = (staffId: number) => {
        setSelectedCrewIds(prev =>
            prev.includes(staffId)
                ? prev.filter(id => id !== staffId)
                : [...prev, staffId]
        );
    };

    const handleSave = () => {
        if (!selectedCaptainId) return; // Captain is mandatory? Let's say yes for now or just optional

        const staffIds = [
            Number(selectedCaptainId),
            ...selectedCrewIds
        ].filter(id => id > 0);

        startTransition(() => {
            assignStaffToBooking(bookingId, staffIds);
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" />
                พนักงานประจำเรือ
            </h2>

            <div className="space-y-4">
                {/* Captain Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Captain</label>
                    <select
                        value={selectedCaptainId}
                        onChange={(e) => setSelectedCaptainId(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                        <option value="">-- Select Captain --</option>
                        {captains.map(captain => (
                            <option key={captain.staff_id} value={captain.staff_id}>
                                {captain.fname} {captain.lname}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Crew Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Crew (Staff)</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                        {crewMembers.map(crew => (
                            <label key={crew.staff_id} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedCrewIds.includes(crew.staff_id)}
                                    onChange={() => handleCrewChange(crew.staff_id)}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{crew.fname} {crew.lname}</span>
                            </label>
                        ))}
                        {crewMembers.length === 0 && (
                            <div className="text-xs text-gray-500 p-1">No crew members available.</div>
                        )}
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={handleSave}
                        disabled={isPending || !selectedCaptainId}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isPending ? "Saving..." : "Save Assignment"}
                    </button>
                    {!selectedCaptainId && (
                        <p className="text-xs text-red-500 mt-1 text-center">Please select a captain.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
