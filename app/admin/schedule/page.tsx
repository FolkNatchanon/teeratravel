import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Clock, MapPin, User, Users, ArrowRight, Anchor } from "lucide-react";
import StaffAssignmentModal from "@/components/StaffAssignmentModal";
import EndTripButton from "@/components/EndTripButton";
import ScheduleFilterTabs from "@/components/ScheduleFilterTabs";
import ExportPDFButton from "@/components/ExportPDFButton";
import { Staff } from "@prisma/client";

export const dynamic = "force-dynamic";

interface UnifiedTrip {
    id: string; // unique key for react
    type: 'private' | 'join';
    date: Date;
    timeSlot: string;
    boatName: string;
    packageName: string;
    status: string;
    passengerCount: number;
    // Private specific
    customerName?: string;
    customerPhone?: string;
    bookingId?: number; // for private
    sessionId?: number; // for join
    // Join specific
    maxCapacity?: number;
    link: string;
    currentStaff: Staff[];
}

export default async function SchedulePage({ searchParams }: { searchParams: { filter?: string } }) {
    const resolvedSearchParams = await searchParams;
    const filter = resolvedSearchParams.filter || 'upcoming';
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Fetch All Staff (for the assignment modal)
    const allStaff = await prisma.staff.findMany({
        orderBy: { fname: 'asc' }
    });

    // 2. Fetch Private Bookings
    const privateBookings = await prisma.booking.findMany({
        where: {
            package: { type: 'private' },
            status: { in: ['complete', 'finished'] }
        },
        include: {
            package: true,
            boat: true,
            user: true,
            staff: true,
        }
    });

    // 3. Fetch Join Sessions
    const joinSessions = await prisma.joinSession.findMany({
        where: {
            status: { in: ['active', 'closed', 'finished'] }
        },
        include: {
            package: { include: { boat: true } },
            staff: true,
        }
    });

    // 4. Normalize and Combine
    const allTrips: UnifiedTrip[] = [];

    // Process Private Bookings
    privateBookings.forEach(b => {
        allTrips.push({
            id: `private-${b.booking_id}`,
            type: 'private',
            date: new Date(b.trip_date),
            timeSlot: b.time_slot,
            boatName: b.boat.name,
            packageName: b.package.name,
            status: b.status,
            passengerCount: b.passenger_count,
            customerName: `${b.user.user_fname} ${b.user.user_lname}`,
            customerPhone: b.user.phone_number,
            bookingId: b.booking_id,
            link: `/admin/bookings/${b.booking_id}`,
            currentStaff: b.staff,
        });
    });

    // Process Join Sessions
    joinSessions.forEach(s => {
        allTrips.push({
            id: `join-${s.session_id}`,
            type: 'join',
            date: new Date(s.trip_date),
            timeSlot: s.time_slot,
            boatName: s.package.boat.name,
            packageName: s.package.name,
            status: s.status,
            passengerCount: s.current_bookings,
            maxCapacity: s.max_capacity,
            sessionId: s.session_id,
            link: `/admin/sessions/${s.session_id}`,
            currentStaff: s.staff,
        });
    });

    // 5. Sort by Date -> Time
    allTrips.sort((a, b) => {
        const dateDiff = a.date.getTime() - b.date.getTime();
        if (dateDiff !== 0) return dateDiff;
        const timeOrder = { morning: 1, afternoon: 2 };
        return (timeOrder[a.timeSlot as keyof typeof timeOrder] || 0) - (timeOrder[b.timeSlot as keyof typeof timeOrder] || 0);
    });

    // 6. Filter based on tab
    let trips: UnifiedTrip[] = [];
    if (filter === 'upcoming') {
        trips = allTrips.filter(t => t.status !== 'finished' && t.status !== 'cancelled');
    } else if (filter === 'completed') {
        trips = allTrips.filter(t => t.status === 'finished');
    } else {
        trips = allTrips;
    }

    // Counts for tabs
    const upcomingCount = allTrips.filter(t => t.status !== 'finished' && t.status !== 'cancelled').length;
    const completedCount = allTrips.filter(t => t.status === 'finished').length;

    // Helper for display
    const timeSlotLabels: Record<string, string> = {
        morning: "Morning (09:00)",
        afternoon: "Afternoon (13:00)"
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Trip Schedule</h1>
                    <p className="text-gray-500 text-sm">Manage all upcoming and completed trips</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <ScheduleFilterTabs
                currentFilter={filter}
                upcomingCount={upcomingCount}
                completedCount={completedCount}
                totalCount={allTrips.length}
            />

            <div className="space-y-4">
                {trips.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-gray-900 font-medium">
                            {filter === 'completed' ? 'No completed trips yet' : 'No scheduled trips found'}
                        </h3>
                    </div>
                ) : (
                    trips.map((trip) => {
                        const isToday = new Date().toDateString() === trip.date.toDateString();
                        const isFinished = trip.status === 'finished';
                        const captain = trip.currentStaff.find(s => s.role === 'captain');
                        const crewCount = trip.currentStaff.filter(s => s.role === 'staff').length;

                        return (
                            <div key={trip.id} className={`bg-white rounded-xl border p-5 transition-shadow hover:shadow-md 
                                ${isFinished ? 'border-gray-200 opacity-75' : isToday ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-100'}
                            `}>
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    {/* Date Column */}
                                    <div className="flex flex-col items-center justify-center min-w-[80px] text-center border-r border-gray-100 pr-6">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            {trip.date.toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                        <span className={`text-2xl font-bold leading-none mb-1 ${isFinished ? 'text-gray-400' : isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                                            {trip.date.getDate()}
                                        </span>
                                        <span className="text-xs font-medium text-gray-400">
                                            {trip.date.toLocaleDateString('en-US', { weekday: 'short' })}
                                        </span>
                                    </div>

                                    {/* Info Column */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${trip.type === 'private' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'
                                                    }`}>
                                                    {trip.type}
                                                </span>
                                                {isFinished && (
                                                    <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-gray-100 text-gray-600">
                                                        เสร็จสิ้น
                                                    </span>
                                                )}
                                                <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {timeSlotLabels[trip.timeSlot] || trip.timeSlot}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Anchor className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">{trip.boatName}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                                {trip.packageName}
                                            </h3>

                                            <div className="mt-1 flex flex-col gap-1">
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    {trip.type === 'private' ? (
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-4 h-4 text-gray-400" />
                                                            <span>{trip.customerName}</span>
                                                            <span className="text-gray-300">|</span>
                                                            <Users className="w-4 h-4 text-gray-400" />
                                                            <span>{trip.passengerCount} Guests</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-4 h-4 text-gray-400" />
                                                            <span className={trip.passengerCount >= (trip.maxCapacity || 0) ? "text-red-600 font-bold" : ""}>
                                                                {trip.passengerCount} / {trip.maxCapacity} Guests
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Staff Summary */}
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <span className="font-medium">Staff:</span>
                                                    {captain ? (
                                                        <span className="text-blue-600">{captain.fname} (C)</span>
                                                    ) : (
                                                        <span className="text-red-400 italic">No Captain</span>
                                                    )}
                                                    {crewCount > 0 && <span>+ {crewCount} Crew</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Column */}
                                    <div className="flex items-center justify-end pl-4 border-l border-gray-100 md:min-w-[180px] gap-2 flex-col md:flex-row">
                                        <ExportPDFButton
                                            type={trip.type}
                                            id={trip.type === 'private' ? trip.bookingId! : trip.sessionId!}
                                        />
                                        {!isFinished && (
                                            <>
                                                <EndTripButton
                                                    bookingId={trip.bookingId}
                                                    sessionId={trip.sessionId}
                                                    status={trip.status}
                                                    type={trip.type}
                                                />
                                                <StaffAssignmentModal
                                                    bookingId={trip.bookingId}
                                                    sessionId={trip.sessionId}
                                                    allStaff={allStaff}
                                                    initialAssignedStaff={trip.currentStaff}
                                                />
                                            </>
                                        )}

                                        <Link
                                            href={trip.link}
                                            className="group flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors px-3 py-1.5"
                                        >
                                            Details
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
