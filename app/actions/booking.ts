"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

const BookingSchema = z.object({
    packageId: z.coerce.number(),
    tripDate: z.string().refine((date) => new Date(date) > new Date(), {
        message: "วันที่เดินทางต้องเป็นวันในอนาคต",
    }),
    timeSlot: z.enum(["morning", "afternoon"]),
    passengerCount: z.coerce.number().min(1, "จำนวนผู้โดยสารต้องอย่างน้อย 1 คน"),
});

export async function createBooking(prevState: any, formData: FormData) {
    const session = await getSession();

    if (!session || !session.userId) {
        return { message: "กรุณาเข้าสู่ระบบก่อนทำการจอง" };
    }

    const validatedFields = BookingSchema.safeParse({
        packageId: formData.get("packageId"),
        tripDate: formData.get("tripDate"),
        timeSlot: formData.get("timeSlot"),
        passengerCount: formData.get("passengerCount"),
    });

    if (!validatedFields.success) {
        return {
            message: "ข้อมูลการจองไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { packageId, tripDate, timeSlot, passengerCount } = validatedFields.data;

    try {
        // Check if package exists and get boat info
        const pkg = await prisma.package.findUnique({
            where: { package_id: packageId },
            include: { boat: true },
        });

        if (!pkg) {
            return { message: "ไม่พบแพ็คเกจที่เลือก" };
        }

        // Calculate total price
        // Base price is per package cost (up to base_member_count)
        // Extra price per person if exceeding base_member_count
        let totalPrice = Number(pkg.base_price);
        if (passengerCount > pkg.base_member_count) {
            const extraPeople = passengerCount - pkg.base_member_count;
            totalPrice += extraPeople * Number(pkg.extra_price_per_person);
        }

        // Check if passenger count exceeds boat capacity
        if (passengerCount > pkg.boat.capacity) {
            return {
                message: `จำนวนผู้โดยสารเกินความจุของเรือ (สูงสุด ${pkg.boat.capacity} ท่าน)`,
                errors: { passengerCount: [`เรือลำนี้รองรับได้สูงสุด ${pkg.boat.capacity} ท่าน`] }
            };
        }

        // Check availability (optional but recommended)
        // For now, assuming if boat is active, we can book. 
        // Ideally we should check if boat is already booked for that date/slot.
        // Schema has @@unique([boat_id, trip_date, time_slot]) in Booking model.
        // So we should handle the unique constraint violation.

        const existingBooking = await prisma.booking.findFirst({
            where: {
                boat_id: pkg.boat_id,
                trip_date: new Date(tripDate),
                time_slot: timeSlot as any, // Cast to match enum
                status: { not: 'cancel' } // If cancelled, maybe slot is free? 
                // Actually unique index handles it on DB level regardless of status usually, 
                // but status 'cancel' might effectively free it up logically.
                // However, the DB unique constraint doesn't care about 'status'.
                // If a cancelled booking exists, it still blocks the unique slot?
                // Let's assume we proceed and catch error if duplicate.
            }
        });

        if (existingBooking) {
            // If existing booking is cancelled, maybe we can delete it or ignore it?
            // But for now, let's just say "Full" if match found.
            if (existingBooking.status !== 'cancel') {
                return { message: "เรือไม่ว่างในช่วงเวลาที่เลือก" };
            }
            // If it was cancelled, ideally we should be able to re-book. 
            // But the unique constraint might block us. 
            // We'll leave this complexity for now and just try to create.
        }

        // Parse passengers
        const passengers = [];
        for (let i = 0; i < passengerCount; i++) {
            passengers.push({
                fname: formData.get(`passenger_fname_${i}`) as string,
                lname: formData.get(`passenger_lname_${i}`) as string,
                age: Number(formData.get(`passenger_age_${i}`)),
                gender: formData.get(`passenger_gender_${i}`) as "male" | "female" | "other",
            });
        }

        await prisma.booking.create({
            data: {
                user_id: session.userId,
                package_id: packageId,
                boat_id: pkg.boat_id,
                trip_date: new Date(tripDate),
                time_slot: timeSlot as any,
                passenger_count: passengerCount,
                total_price: totalPrice,
                status: "pending",
                passengers: {
                    create: passengers
                }
            },
        });

    } catch (error: any) {
        console.error("Booking error:", error);
        if (error.code === 'P2002') { // Prisma unique constraint violation
            return { message: "เรือไม่ว่างในช่วงเวลาที่เลือก (มีการจองแล้ว)" };
        }
        return { message: "เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง" };
    }

    revalidatePath("/booking-history"); // Revalidate user's booking history
    redirect("/booking-history?success=true");
}
