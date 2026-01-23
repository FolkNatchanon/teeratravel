import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BoatForm from "@/components/BoatForm";

export default async function EditBoatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const boat = await prisma.boat.findUnique({
        where: {
            boat_id: Number(id),
        },
    });

    if (!boat) {
        notFound();
    }

    // Cast status to "active" | "inactive" to satisfy TypeScript if needed, 
    // though Prisma enum usually maps correctly. 
    // If strict typing issue arises, we can validate or cast.
    const boatData = {
        ...boat,
        status: boat.status as "active" | "inactive"
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Edit Boat</h1>
            <BoatForm boat={boatData} />
        </div>
    );
}
