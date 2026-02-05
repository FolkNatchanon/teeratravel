import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Calendar, MapPin, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SessionsDashboard() {
    // Fetch all active sessions, ordered by date
    const sessions = await prisma.joinSession.findMany({
        orderBy: {
            trip_date: 'asc'
        },
        include: {
            package: {
                include: {
                    boat: true
                }
            }
        }
    });

    const timeSlotLabels = {
        morning: "Morning (09:00)",
        afternoon: "Afternoon (13:00)"
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Global Sessions</h1>
                    <p className="text-gray-500 text-sm">Manage all scheduled group trips in one place</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No sessions scheduled</h3>
                        <p className="text-gray-500">Create sessions via the Packages menu.</p>
                    </div>
                ) : (
                    sessions.map((session) => {
                        const occupancy = session.current_bookings / session.max_capacity;
                        const isFull = occupancy >= 1;
                        const isAlmostFull = occupancy >= 0.8;
                        const tripDate = new Date(session.trip_date);

                        return (
                            <div key={session.session_id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
                                <div className="p-5 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex flex-col items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-lg min-w-[60px]">
                                            <span className="text-xs font-bold uppercase">{tripDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                                            <span className="text-xl font-bold leading-none">{tripDate.getDate()}</span>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${session.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {session.status.toUpperCase()}
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                        {session.package.name}
                                    </h3>

                                    <div className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {session.package.boat.name}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {timeSlotLabels[session.time_slot]}
                                            </span>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 font-medium flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    Occupancy
                                                </span>
                                                <span className={isFull ? "text-red-600 font-bold" : isAlmostFull ? "text-amber-600 font-bold" : "text-gray-900"}>
                                                    {session.current_bookings}/{session.max_capacity}
                                                </span>
                                            </div>
                                            {/* Progress Bar */}
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${isFull ? "bg-red-500" : isAlmostFull ? "bg-amber-500" : "bg-blue-500"}`}
                                                    style={{ width: `${Math.min(occupancy * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 border-t border-gray-100">
                                    <Link
                                        href={`/admin/sessions/${session.session_id}`}
                                        className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-sm shadow-sm"
                                    >
                                        Manage Manifest
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
