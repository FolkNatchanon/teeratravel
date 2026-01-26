"use client";

import { useActionState, useState } from "react";
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

    // State for toggling form fields
    const [type, setType] = useState<"private" | "join">(packageData?.type || "private");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        const driveRegex = /drive\.google\.com\/file\/d\/([-_\w]+)/;
        const match = url.match(driveRegex);

        if (match && match[1]) {
            const fileId = match[1];
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
                        <label className="block text-sm font-bold text-gray-800 mb-1">Package Name</label>
                        <input type="text" name="name" defaultValue={packageData?.name} required className="w-full px-4 py-2 border border-gray-100 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-medium text-[14px] text-gray-700 placeholder-gray-300" placeholder="กรุณากรอกชื่อแพ็คเกจ" />
                        {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-800 mb-1">Short Intro</label>
                        <input type="text" name="short_intro" defaultValue={packageData?.short_intro} required className="w-full px-4 py-2 border border-gray-100 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-medium text-[14px] text-gray-700 placeholder-gray-300" placeholder="Brief tagline..." />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-800 mb-1">Description</label>
                        <textarea name="description" rows={5} defaultValue={packageData?.description} required className="w-full px-4 py-2 border border-gray-100 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-medium text-[14px] text-gray-700 placeholder-gray-300" placeholder="Detailed description (e.g. Free water, itinerary...)" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-800 mb-1">Cover Image URL (Supports Google Drive Links)</label>
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                name="cover_image_url"
                                defaultValue={packageData?.cover_image_url}
                                required
                                onChange={handleImageChange}
                                className="w-full px-4 py-2 border border-gray-100 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-medium text-[14px] text-gray-700 placeholder-gray-300"
                                placeholder="Paste URL here (e.g. https://drive.google.com/...)"
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1">Duration (Hours)</label>
                        <input type="number" name="duration_hours" step="0.5" defaultValue={Number(packageData?.duration_hours) || ""} required className="w-full px-4 py-2 border border-gray-100 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-medium text-[14px] text-gray-700 placeholder-gray-300" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1">Type</label>
                        <select
                            name="type"
                            value={type}
                            onChange={(e) => setType(e.target.value as "private" | "join")}
                            className="w-full px-4 py-2 border border-gray-100 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-medium text-[14px] text-gray-700 bg-white"
                        >
                            <option value="private">Private (เหมาลำ)</option>
                            <option value="join">Join (จอยกรุ๊ป)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1">Status</label>
                        <select name="status" defaultValue={packageData?.status || "active"} className="w-full px-4 py-2 border border-gray-100 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-medium text-[14px] text-gray-700 bg-white">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Pricing & Boat */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Pricing & Boat</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-800 mb-1">Select Boat (Determines Max Capacity)</label>
                            <select name="boat_id" defaultValue={packageData?.boat_id || ""} required className="w-full px-4 py-2 border border-gray-100 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-medium text-[14px] text-gray-700 bg-white">
                                <option value="">Select a boat</option>
                                {boats.map(boat => (
                                    <option key={boat.boat_id} value={boat.boat_id}>
                                        {boat.name} (Max {boat.capacity} Pax)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {type === 'private' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-800 mb-1">Base Price (THB) / ราคาเหมา</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">฿</span>
                                        <input type="number" name="base_price" min={0} defaultValue={Number(packageData?.base_price) || ""} required className="w-full pl-8 pr-4 py-2 border border-gray-100 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-medium text-[14px] text-gray-700 placeholder-gray-300" placeholder="6900" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-800 mb-1">For (Members) / สำหรับ (ท่าน)</label>
                                    <div className="flex items-center gap-2">
                                        <input type="number" name="base_member_count" defaultValue={packageData?.base_member_count || 10} min={1} required className="w-full px-4 py-2 border border-gray-100 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-medium text-[14px] text-gray-700 placeholder-gray-300" />
                                        <span className="text-gray-500 whitespace-nowrap">Persons</span>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-800 mb-1">Extra Price Per Person (THB) / ราคาเพิ่มต่อท่าน</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+฿</span>
                                        <input type="number" name="extra_price_per_person" min={0} defaultValue={Number(packageData?.extra_price_per_person) || ""} required className="w-full pl-10 pr-4 py-2 border border-gray-100 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-medium text-[14px] text-gray-700 placeholder-gray-300" placeholder="450" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-800 mb-1">Price Per Person (THB) / ราคาต่อท่าน</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">฿</span>
                                        <input type="number" name="base_price" min={0} defaultValue={Number(packageData?.base_price) || ""} required className="w-full pl-8 pr-4 py-2 border border-gray-100 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-medium text-[14px] text-gray-700 placeholder-gray-300" placeholder="1200" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">This will be the default price per person for new sessions.</p>
                                </div>
                                <input type="hidden" name="base_member_count" value="1" />
                                <input type="hidden" name="extra_price_per_person" value="0" />
                            </>
                        )}

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
