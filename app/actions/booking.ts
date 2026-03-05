"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

const BookingSchema = z.object({
    packageId: z.coerce.number(),
    tripDate: z.string().refine((date) => {
        const trip = new Date(date);
        trip.setHours(0, 0, 0, 0);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        return trip >= tomorrow;
    }, {
        message: "ต้องจองล่วงหน้าอย่างน้อย 1 วัน",
    }),
    timeSlot: z.enum(["morning", "afternoon"]),
    passengerCount: z.coerce.number().min(1, "จำนวนผู้โดยสารต้องอย่างน้อย 1 คน"),
    joinSessionId: z.coerce.number().optional(),
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
        joinSessionId: formData.get("joinSessionId"),
    });

    if (!validatedFields.success) {
        return {
            message: "ข้อมูลการจองไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { packageId, tripDate, timeSlot, passengerCount, joinSessionId } = validatedFields.data;

    try {
        const pkg = await prisma.package.findUnique({
            where: { package_id: packageId },
            include: { boat: true },
        });

        if (!pkg) {
            return { message: "ไม่พบแพ็คเกจที่เลือก" };
        }

        let totalPrice = 0;
        let finalTripDate = new Date(tripDate);
        let finalTimeSlot = timeSlot;

        // JOIN SESSION LOGIC
        if (joinSessionId) {
            const joinSession = await prisma.joinSession.findUnique({
                where: { session_id: joinSessionId },
            });

            if (!joinSession) {
                return { message: "ไม่พบรอบการจองที่เลือก" };
            }

            if (joinSession.status !== 'active') {
                return { message: "รอบการจองนี้ปิดแล้ว" };
            }

            if (joinSession.current_bookings + passengerCount > joinSession.max_capacity) {
                return { message: `ที่นั่งไม่พอ (เหลือ ${joinSession.max_capacity - joinSession.current_bookings} ที่นั่ง)` };
            }

            // Override date/time with session's date/time
            finalTripDate = new Date(joinSession.trip_date);
            finalTimeSlot = joinSession.time_slot;

            // Calculate price (use session price override if available, else package base price per person?)
            // Usually Join trips have a per-person price. 
            // Let's assume package.base_price is per person for 'join' type, or use session.price_per_person.
            const pricePerHead = joinSession.price_per_person
                ? Number(joinSession.price_per_person)
                : Number(pkg.base_price); // Fallback

            totalPrice = pricePerHead * passengerCount;

        } else {
            // PRIVATE TRIP LOGIC (Existing)
            if (pkg.type === 'join') {
                return { message: "แพ็คเกจนี้ต้องเลือกจองตามรอบตารางเวลาเท่านั้น" };
            }

            totalPrice = Number(pkg.base_price);
            if (passengerCount > pkg.base_member_count) {
                const extraPeople = passengerCount - pkg.base_member_count;
                totalPrice += extraPeople * Number(pkg.extra_price_per_person);
            }

            // Check boat capacity
            if (passengerCount > pkg.boat.capacity) {
                return {
                    message: `จำนวนผู้โดยสารเกินความจุของเรือ (สูงสุด ${pkg.boat.capacity} ท่าน)`,
                    errors: { passengerCount: [`เรือลำนี้รองรับได้สูงสุด ${pkg.boat.capacity} ท่าน`] }
                };
            }

            // Check availability (Private)
            const existingBooking = await prisma.booking.findFirst({
                where: {
                    boat_id: pkg.boat_id,
                    trip_date: finalTripDate,
                    time_slot: finalTimeSlot as any,
                    status: { not: 'cancel' }
                }
            });

            if (existingBooking) {
                return { message: "เรือไม่ว่างในช่วงเวลาที่เลือก" };
            }
        }

        // Parse passengers
        const passengers: {
            fname: string;
            lname: string;
            age: number;
            gender: "male" | "female" | "other";
        }[] = [];
        for (let i = 0; i < passengerCount; i++) {
            passengers.push({
                fname: formData.get(`passenger_fname_${i}`) as string,
                lname: formData.get(`passenger_lname_${i}`) as string,
                age: Number(formData.get(`passenger_age_${i}`)),
                gender: formData.get(`passenger_gender_${i}`) as "male" | "female" | "other",
            });
        }

        // Transaction for Join Session booking to ensure atomicity
        let createdBookingId: number | undefined;
        await prisma.$transaction(async (tx) => {
            // Create booking
            const newBooking = await tx.booking.create({
                data: {
                    user_id: session.userId,
                    package_id: packageId,
                    boat_id: pkg.boat_id,
                    trip_date: finalTripDate,
                    time_slot: finalTimeSlot as any,
                    passenger_count: passengerCount,
                    total_price: totalPrice,
                    status: "pending", // Default to pending payment
                    session_id: joinSessionId || null,
                    passengers: {
                        create: passengers
                    }
                },
            });
            createdBookingId = newBooking.booking_id;

            // Update session count if join
            if (joinSessionId) {
                await tx.joinSession.update({
                    where: { session_id: joinSessionId },
                    data: {
                        current_bookings: { increment: passengerCount }
                    }
                });
            }
        });

        if (createdBookingId) {
            revalidatePath("/booking-history");
            redirect(`/payment/${createdBookingId}`);
        } else {
            return { message: "ไม่สามารถสร้างการจองได้" };
        }

    } catch (error: any) {
        console.error("Booking error:", error);
        if (error.code === 'P2002') {
            return { message: "เรือไม่ว่างในช่วงเวลาที่เลือก (มีการจองแล้ว)" };
        }
        // Redirect can throw an error that needs to be re-thrown, but Next.js redirect is a special error type
        if (error.message && error.message.includes('NEXT_REDIRECT')) {
            throw error;
        }
        return { message: "เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง" };
    }
}

export async function assignStaffToBooking(bookingId: number, staffIds: number[]) {
    // 1. Get Booking Details
    const booking = await prisma.booking.findUnique({
        where: { booking_id: bookingId },
        select: { trip_date: true, time_slot: true }
    });

    if (!booking) {
        throw new Error("Booking not found");
    }

    // 2. Check for conflicts
    const conflictingBooking = await prisma.booking.findFirst({
        where: {
            booking_id: { not: bookingId },
            trip_date: booking.trip_date,
            time_slot: booking.time_slot,
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
            trip_date: booking.trip_date,
            time_slot: booking.time_slot,
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
    await prisma.booking.update({
        where: { booking_id: bookingId },
        data: {
            staff: {
                set: staffIds.map((id) => ({ staff_id: id })),
            },
        },
    });

    revalidatePath(`/admin/bookings/${bookingId}`);
    return { success: true };
}

export async function checkBookingAvailability({
    packageId,
    tripDate,
    timeSlot,
    passengerCount,
    joinSessionId
}: {
    packageId: number;
    tripDate: string;
    timeSlot: string;
    passengerCount: number;
    joinSessionId?: number;
}) {
    try {
        const pkg = await prisma.package.findUnique({
            where: { package_id: packageId },
            include: { boat: true },
        });

        if (!pkg) {
            return { success: false, message: "ไม่พบแพ็คเกจที่เลือก" };
        }

        let finalTripDate = new Date(tripDate);
        let finalTimeSlot = timeSlot;

        // Check 1 Day Advance
        const tripDateObj = new Date(finalTripDate);
        tripDateObj.setHours(0, 0, 0, 0);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        if (tripDateObj < tomorrow) {
            return { success: false, message: "ต้องจองล่วงหน้าอย่างน้อย 1 วัน" };
        }

        // JOIN SESSION LOGIC
        if (joinSessionId) {
            const joinSession = await prisma.joinSession.findUnique({
                where: { session_id: joinSessionId },
            });

            if (!joinSession) {
                return { success: false, message: "ไม่พบรอบการจองที่เลือก" };
            }

            if (joinSession.status !== 'active') {
                return { success: false, message: "รอบการจองนี้ปิดแล้ว" };
            }

            if (joinSession.current_bookings + passengerCount > joinSession.max_capacity) {
                return { success: false, message: `ที่นั่งไม่พอ (เหลือ ${joinSession.max_capacity - joinSession.current_bookings} ที่นั่ง)` };
            }
        } else {
            // PRIVATE TRIP LOGIC
            if (pkg.type === 'join') {
                return { success: false, message: "แพ็คเกจนี้ต้องเลือกจองตามรอบตารางเวลาเท่านั้น" };
            }

            // Check boat capacity
            if (passengerCount > pkg.boat.capacity) {
                return {
                    success: false,
                    message: `จำนวนผู้โดยสารเกินความจุของเรือ (สูงสุด ${pkg.boat.capacity} ท่าน)`,
                };
            }

            // Check availability (Private)
            const existingBooking = await prisma.booking.findFirst({
                where: {
                    boat_id: pkg.boat_id,
                    trip_date: finalTripDate,
                    time_slot: finalTimeSlot as any,
                    status: { not: 'cancel' }
                }
            });

            if (existingBooking) {
                return { success: false, message: "เรือไม่ว่างในช่วงเวลาที่เลือก (มีการจองแล้ว)" };
            }
        }

        return { success: true };
    } catch (error) {
        console.error("Check availability error:", error);
        return { success: false, message: "เกิดข้อผิดพลาดในการตรวจสอบข้อมูล กรุณาลองใหม่อีกครั้ง" };
    }
}
