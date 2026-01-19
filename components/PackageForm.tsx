"use client";

import { useActionState } from "react";
import { createPackageAction, updatePackageAction } from "@/app/actions/admin";
import Link from "next/link";

interface Boat {
    boat_id: number;
    name: string;
    capacity: number;
}

// Minimal matching of Package type from Prisma
interface PackageData {
    package_id?: number;
    name: string;
    cover_image_url: string;
    short_intro: string;
    description: string;
    duration_hours: number | any; // prisma decimal
    type: "private" | "join";
    status: "active" | "inactive";
    boat_id: number;
    base_member_count: number;
    base_price: number | any;
    extra_price_per_person: number | any;
}

interface PackageFormProps {
    boats: Boat[];
    packageData?: PackageData; // Optional, strict for Edit mode
}

const initialState = {
    message: "",
    errors: {} as Record<string, string[]> | undefined,
};

export default function PackageForm({ boats, packageData }: PackageFormProps) {
    // Choose action based on whether packageData exists
    const action = packageData ? updatePackageAction : createPackageAction;
    // @ts-ignore
    const [state, formAction] = useActionState(action, initialState);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        // Check for Google Drive "open" or "file/d/" links
        // Convert https://drive.google.com/file/d/ID/view -> https://lh3.googleusercontent.com/d/ID
        const driveRegex = /drive\.google\.com\/file\/d\/([-_\w]+)/;
        const match = url.match(driveRegex);

        if (match && match[1]) {
            const fileId = match[1];
            // lh3.googleusercontent.com/d/ID is a reliable way to get a direct image link
            e.target.value = `https://lh3.googleusercontent.com/d/${fileId}`;
        }
    };

    return (
        <form action={formAction} className="space-y-6">
            {packageData && <input type="hidden" name="package_id" value={packageData.package_id} />}

            {state?.message && (
                <div className={`p-4 rounded-lg text-sm ${state.message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {state.message}
                </div>
            )}

            <div className="space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-900 mb-1">Package Name</label>
                        <input type="text" name="name" defaultValue={packageData?.name} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-lg text-gray-900 placeholder-gray-500" placeholder="e.g. Teera Travel 1" />
                        {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-900 mb-1">Short Intro</label>
                        <input type="text" name="short_intro" defaultValue={packageData?.short_intro} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-500" placeholder="Brief tagline..." />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-900 mb-1">Details / Description</label>
                        <textarea name="description" rows={5} defaultValue={packageData?.description} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-500" placeholder="Detailed description (e.g. Free water, itinerary...)" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-900 mb-1">Cover Image URL (Supports Google Drive Links)</label>
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                name="cover_image_url"
                                defaultValue={packageData?.cover_image_url}
                                required
                                onChange={handleImageChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-500"
                                placeholder="Paste URL here (e.g. https://drive.google.com/...)"
                            />
                            <p className="text-xs text-gray-600">Paste a Google Drive link, and it will be transparently converted to a direct link.</p>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Duration (Hours)</label>
                        <input type="number" name="duration_hours" step="0.5" defaultValue={Number(packageData?.duration_hours) || ""} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Type</label>
                        <select name="type" defaultValue={packageData?.type || "private"} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white">
                            <option value="private">Private</option>
                            <option value="join">Join</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Status</label>
                        <select name="status" defaultValue={packageData?.status || "active"} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Pricing & Boat */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Pricing & Boat</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-900 mb-1">Select Boat (Determines Max Capacity)</label>
                            <select name="boat_id" defaultValue={packageData?.boat_id || ""} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900">
                                <option value="">Select a boat</option>
                                {boats.map(boat => (
                                    <option key={boat.boat_id} value={boat.boat_id}>
                                        {boat.name} (Max {boat.capacity} Pax)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (THB)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">฿</span>
                                <input type="number" name="base_price" min={0} defaultValue={Number(packageData?.base_price) || ""} required className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="6900" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">For (Members)</label>
                            <div className="flex items-center gap-2">
                                <input type="number" name="base_member_count" defaultValue={packageData?.base_member_count || 10} min={1} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                <span className="text-gray-500 whitespace-nowrap">Persons</span>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Extra Price Per Person (THB)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+฿</span>
                                <input type="number" name="extra_price_per_person" min={0} defaultValue={Number(packageData?.extra_price_per_person) || ""} required className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="450" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Applied when passenger count exceeds base members.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                <Link
                    href="/admin/packages"
                    className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md"
                >
                    {packageData ? "Update Package" : "Create Package"}
                </button>
            </div>
        </form>
    );
}
