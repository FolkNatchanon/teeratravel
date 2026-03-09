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
    keywords: z.string().optional(),
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
        keywords: formData.get("keywords"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed"
        };
    }

    try {
        const pkg = await prisma.package.create({
            data: {
                ...validatedFields.data,
                keywords: (validatedFields.data.keywords || "").split(",").filter(Boolean).join(","),
            }
        });
        revalidatePath("/admin/packages");
        return { message: "Package created successfully", package: pkg };
    } catch (e) {
        console.error(e);
        return { message: "Failed to create package. Check if Boat ID exists." };
    }
}

export async function createPackageAction(prevState: any, formData: FormData) {
    const result = await createPackage(prevState, formData);
    if (result?.message === "Package created successfully" && result.package) {
        if (result.package.type === 'join') {
            redirect(`/admin/packages/${result.package.package_id}/sessions`);
        }
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
        keywords: formData.get("keywords"),
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
            data: {
                ...validatedFields.data,
                keywords: (validatedFields.data.keywords || "").split(",").filter(Boolean).join(","),
            }
        });
    } catch (e) {
        console.error(e);
        return { message: "Failed to update package" };
    }

    revalidatePath("/admin/packages");
    revalidatePath(`/admin/packages/${packageId}`);
    redirect("/admin/packages");
}

export async function updateBookingStatus(formData: FormData) {
    await checkAdmin();
    const bookingId = Number(formData.get("bookingId"));
    const status = formData.get("status") as string;

    if (!bookingId || !status) return;

    if (!['pending', 'complete', 'cancel', 'finished'].includes(status)) return;

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

export async function updateSessionStatus(formData: FormData) {
    await checkAdmin();
    const sessionId = Number(formData.get("sessionId"));
    const status = formData.get("status") as string;

    if (!sessionId || !status) return;

    if (!['active', 'closed', 'finished', 'cancelled'].includes(status)) return;

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Update Session status
            await tx.joinSession.update({
                where: { session_id: sessionId },
                data: { status: status as any }
            });

            // 2. If finishing the session:
            // - pending bookings = no-show, auto-cancel them
            // - complete bookings = finished successfully
            if (status === 'finished') {
                // Cancel pending bookings (no-show)
                await tx.booking.updateMany({
                    where: {
                        session_id: sessionId,
                        status: 'pending'
                    },
                    data: { status: 'cancel' }
                });

                // Mark complete bookings as finished
                await tx.booking.updateMany({
                    where: {
                        session_id: sessionId,
                        status: 'complete'
                    },
                    data: { status: 'finished' }
                });
            }
        });
    } catch (e) {
        console.error("Failed to update session status", e);
    }

    revalidatePath("/admin/schedule");
    revalidatePath("/admin/sessions");
    revalidatePath(`/admin/sessions/${sessionId}`);
}

const BoatSchema = z.object({
    name: z.string().min(1, "Name is required"),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
    // Status is removed from UI, defaults to 'active'
});

export async function createBoat(prevState: any, formData: FormData) {
    await checkAdmin();

    const validatedFields = BoatSchema.safeParse({
        name: formData.get("name"),
        capacity: formData.get("capacity"),
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

export async function updateBoat(prevState: any, formData: FormData) {
    await checkAdmin();
    const boatId = Number(formData.get("boat_id"));

    if (!boatId) {
        return { message: "Boat ID is required" };
    }

    const validatedFields = BoatSchema.safeParse({
        name: formData.get("name"),
        capacity: formData.get("capacity"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed"
        };
    }

    try {
        await prisma.boat.update({
            where: { boat_id: boatId },
            data: validatedFields.data
        });
    } catch (e) {
        console.error(e);
        return { message: "Failed to update boat" };
    }

    revalidatePath("/admin/boats");
    // Revalidate the specific edit page as well just in case
    revalidatePath(`/admin/boats/${boatId}/edit`);
    return { message: "Boat updated successfully" };
}

export async function updateBoatAction(prevState: any, formData: FormData) {
    const result = await updateBoat(prevState, formData);
    if (result?.message === "Boat updated successfully") {
        redirect("/admin/boats");
    }
    return result;
}

export async function deletePackage(packageId: number) {
    await checkAdmin();

    if (!packageId) return { message: "Package ID missing" };

    try {
        await prisma.package.delete({
            where: { package_id: packageId },
        });
    } catch (e) {
        console.error("Failed to delete package", e);
        return { message: "Failed to delete package" };
    }

    revalidatePath("/admin/packages");
    return { message: "Package deleted successfully" };
}

export async function deleteBoat(boatId: number) {
    await checkAdmin();

    if (!boatId) return { message: "Boat ID missing" };

    try {
        await prisma.boat.delete({
            where: { boat_id: boatId },
        });
    } catch (e) {
        console.error("Failed to delete boat", e);
        // Boat might be used in packages or bookings
        return { message: "Failed to delete boat. It might be in use." };
    }

    revalidatePath("/admin/boats");
    return { message: "Boat deleted successfully" };
}
