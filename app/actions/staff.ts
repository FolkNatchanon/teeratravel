"use server";

import { prisma } from "@/lib/prisma";
import { StaffRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStaff(formData: FormData) {
    const fname = formData.get("fname") as string;
    const lname = formData.get("lname") as string;
    const role = formData.get("role") as StaffRole;

    if (!fname || !lname || !role) {
        throw new Error("Missing required fields");
    }

    await prisma.staff.create({
        data: {
            fname,
            lname,
            role,
        },
    });

    revalidatePath("/admin/staff");
    redirect("/admin/staff");
}

export async function deleteStaff(id: number) {
    try {
        await prisma.staff.delete({
            where: { staff_id: id },
        });
        revalidatePath("/admin/staff");
        return { message: "Staff deleted successfully" };
    } catch (e) {
        return { message: "Failed to delete staff. They might be assigned to a booking." };
    }
}

export async function assignStaffToSession(sessionId: number, staffIds: number[]) {
    // 1. Get Session Details
    const session = await prisma.joinSession.findUnique({
        where: { session_id: sessionId },
        select: { trip_date: true, time_slot: true }
    });

    if (!session) {
        throw new Error("Session not found");
    }

    // 2. Check for conflicts
    const conflictingBooking = await prisma.booking.findFirst({
        where: {
            trip_date: session.trip_date,
            time_slot: session.time_slot,
            status: { not: "cancel" },
            staff: {
                some: {
                    staff_id: { in: staffIds }
                }
            }
        },
        include: { staff: true }
    });

    if (conflictingBooking) {
        const conflictingStaff = conflictingBooking.staff.find(s => staffIds.includes(s.staff_id));
        return { success: false, message: `Staff ${conflictingStaff?.fname} is already assigned to Booking #${conflictingBooking.booking_id} at this time.` };
    }

    const conflictingSession = await prisma.joinSession.findFirst({
        where: {
            session_id: { not: sessionId },
            trip_date: session.trip_date,
            time_slot: session.time_slot,
            status: { not: "cancelled" },
            staff: {
                some: {
                    staff_id: { in: staffIds }
                }
            }
        },
        include: { staff: true }
    });

    if (conflictingSession) {
        const conflictingStaff = conflictingSession.staff.find(s => staffIds.includes(s.staff_id));
        return { success: false, message: `Staff ${conflictingStaff?.fname} is already assigned to Session #${conflictingSession.session_id} at this time.` };
    }

    // 3. Assign if no conflict
    await prisma.joinSession.update({
        where: { session_id: sessionId },
        data: {
            staff: {
                set: staffIds.map((id) => ({ staff_id: id })),
            },
        },
    });

    revalidatePath(`/admin/sessions/${sessionId}`);
    return { success: true };
}
