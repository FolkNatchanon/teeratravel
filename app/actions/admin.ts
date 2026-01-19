"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

async function checkAdmin() {
    const session = await getSession();
    if (!session || session.role !== "A") {
        throw new Error("Unauthorized");
    }
}

const PackageSchema = z.object({
    name: z.string().min(1, "Name is required"),
    cover_image_url: z.string().min(1, "Image URL is required"), // For now text input, later upload
    short_intro: z.string().min(1, "Short intro is required"),
    description: z.string().min(1, "Description is required"),
    duration_hours: z.coerce.number().min(0.5, "Duration must be at least 0.5 hours"),
    type: z.enum(["private", "join"]),
    status: z.enum(["active", "inactive"]),
    boat_id: z.coerce.number().min(1, "Boat is required"),
    base_member_count: z.coerce.number().min(1).default(1),
    base_price: z.coerce.number().min(0),
    extra_price_per_person: z.coerce.number().min(0).default(0),
});

export async function createPackage(prevState: any, formData: FormData) {
    await checkAdmin();

    const validatedFields = PackageSchema.safeParse({
        name: formData.get("name"),
        cover_image_url: formData.get("cover_image_url"),
        short_intro: formData.get("short_intro"),
        description: formData.get("description"),
        duration_hours: formData.get("duration_hours"),
        type: formData.get("type"),
        status: formData.get("status"),
        boat_id: formData.get("boat_id"),
        base_member_count: formData.get("base_member_count"),
        base_price: formData.get("base_price"),
        extra_price_per_person: formData.get("extra_price_per_person"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed"
        };
    }

    try {
        await prisma.package.create({
            data: validatedFields.data
        });
    } catch (e) {
        console.error(e);
        return { message: "Failed to create package. Check if Boat ID exists." };
    }

    revalidatePath("/admin/packages");
    return { message: "Package created successfully" };
}

export async function createPackageAction(prevState: any, formData: FormData) {
    const result = await createPackage(prevState, formData);
    if (result?.message === "Package created successfully") {
        redirect("/admin/packages");
    }
    return result;
}

export async function updatePackageAction(prevState: any, formData: FormData) {
    await checkAdmin();
    const packageId = Number(formData.get("package_id"));
    if (!packageId) return { message: "Package ID missing" };

    const validatedFields = PackageSchema.safeParse({
        name: formData.get("name"),
        cover_image_url: formData.get("cover_image_url"),
        short_intro: formData.get("short_intro"),
        description: formData.get("description"),
        duration_hours: formData.get("duration_hours"),
        type: formData.get("type"),
        status: formData.get("status"),
        boat_id: formData.get("boat_id"),
        base_member_count: formData.get("base_member_count"),
        base_price: formData.get("base_price"),
        extra_price_per_person: formData.get("extra_price_per_person"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed"
        };
    }

    try {
        await prisma.package.update({
            where: { package_id: packageId },
            data: validatedFields.data
        });
    } catch (e) {
        console.error(e);
        return { message: "Failed to update package" };
    }

    revalidatePath("/admin/packages");
    revalidatePath(`/admin/packages/${packageId}`);
    return { message: "Package updated successfully" };
}

export async function updateBookingStatus(formData: FormData) {
    await checkAdmin();
    const bookingId = Number(formData.get("bookingId"));
    const status = formData.get("status") as string;

    if (!bookingId || !status) return;

    if (!['pending', 'complete', 'cancel'].includes(status)) return;

    try {
        await prisma.booking.update({
            where: { booking_id: bookingId },
            data: { status: status as any }
        });
    } catch (e) {
        console.error("Failed to update booking", e);
    }

    revalidatePath("/admin/bookings");
}

const BoatSchema = z.object({
    name: z.string().min(1, "Name is required"),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
    status: z.enum(["active", "inactive"]),
});

export async function createBoat(prevState: any, formData: FormData) {
    await checkAdmin();

    const validatedFields = BoatSchema.safeParse({
        name: formData.get("name"),
        capacity: formData.get("capacity"),
        status: formData.get("status"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed"
        };
    }

    try {
        await prisma.boat.create({
            data: validatedFields.data
        });
    } catch (e) {
        console.error(e);
        return { message: "Failed to create boat" };
    }

    revalidatePath("/admin/boats");
    return { message: "Boat created successfully" };
}

export async function createBoatAction(prevState: any, formData: FormData) {
    const result = await createBoat(prevState, formData);
    if (result?.message === "Boat created successfully") {
        redirect("/admin/boats");
    }
    return result;
}
