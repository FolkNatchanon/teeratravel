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
    await prisma.staff.delete({
        where: { staff_id: id },
    });
    revalidatePath("/admin/staff");
}
