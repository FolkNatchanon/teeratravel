"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TimeSlot, SessionStatus } from "@prisma/client";

export async function createJoinSession(formData: FormData) {
    const packageId = Number(formData.get("packageId"));
    const tripDate = formData.get("tripDate") as string;
    const timeSlot = formData.get("timeSlot") as TimeSlot;
    const maxCapacity = Number(formData.get("maxCapacity"));
    const pricePerPerson = formData.get("pricePerPerson")
        ? Number(formData.get("pricePerPerson"))
        : undefined;

    if (!packageId || !tripDate || !timeSlot || !maxCapacity) {
        throw new Error("Missing required fields");
    }

    try {
        await prisma.joinSession.create({
            data: {
                package_id: packageId,
                trip_date: new Date(tripDate),
                time_slot: timeSlot,
                max_capacity: maxCapacity,
                price_per_person: pricePerPerson,
                status: "active",
            },
        });
    } catch (error) {
        console.error("Failed to create session:", error);
        // Handle unique constraint violation gracefully if needed
        return { message: "Failed to create session. Exact slot might already exist." };
    }

    revalidatePath(`/admin/packages/${packageId}/sessions`);
    redirect(`/admin/packages/${packageId}/sessions`);
}

export async function updateJoinSessionStatus(sessionId: number, status: SessionStatus, packageId: number) {
    await prisma.joinSession.update({
        where: { session_id: sessionId },
        data: { status },
    });
    revalidatePath(`/admin/packages/${packageId}/sessions`);
}

export async function deleteJoinSession(sessionId: number, packageId: number) {
    try {
        await prisma.joinSession.delete({
            where: { session_id: sessionId },
        });
        revalidatePath(`/admin/packages/${packageId}/sessions`);
    } catch (error) {
        console.error("Failed to delete session:", error);
    }
}
