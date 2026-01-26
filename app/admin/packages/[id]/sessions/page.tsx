import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Calendar, Trash2 } from "lucide-react";
import CreateSessionForm from "@/components/CreateSessionForm";
import { deleteJoinSession } from "@/app/actions/join-session";

export default async function ManageSessionsPage({ params }: { params: { id: string } }) {
    const resolvedParams = await params;
    const packageId = Number(resolvedParams.id);

    if (isNaN(packageId)) notFound();

    const pkg = await prisma.package.findUnique({
        where: { package_id: packageId },
        include: {
            boat: true,
            sessions: {
                orderBy: { trip_date: 'asc' }
            }
        }
    });

    if (!pkg || pkg.type !== 'join') notFound();

    const timeSlotText = {
        morning: "Morning (09:00)",
        afternoon: "Afternoon (13:00)"
    };

    // Filter only future sessions for cleaner default view? Or all? Let's show all for now.
    const sessions = pkg.sessions;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href={`/admin/packages/${packageId}`}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Sessions</h1>
                    <p className="text-gray-500 text-sm">for {pkg.name} ({pkg.boat.name})</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Session Form */}
                <div className="lg:col-span-1">
                    <CreateSessionForm
                        packageId={packageId}
                        defaultCapacity={pkg.boat.capacity}
                        defaultPrice={Number(pkg.base_price)} // Use base price as default per person price for simplicity
                    />
                </div>

                {/* Sessions List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-900">Scheduled Sessions</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {sessions.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No sessions scheduled yet.
                                </div>
                            ) : (
                                sessions.map(session => (
                                    <div key={session.session_id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-blue-50 flex flex-col items-center justify-center text-blue-600 flex-shrink-0">
                                                <span className="text-xs font-bold uppercase">{new Date(session.trip_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                                <span className="text-lg font-bold leading-none">{new Date(session.trip_date).getDate()}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${session.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                        {session.status.toUpperCase()}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {timeSlotText[session.time_slot]}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center gap-3">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        {session.current_bookings} / {session.max_capacity} booked
                                                    </span>
                                                    <span>•</span>
                                                    <span>฿{Number(session.price_per_person || pkg.base_price).toLocaleString()} / person</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            {session.current_bookings === 0 && (
                                                <form action={deleteJoinSession.bind(null, session.session_id, packageId)}>
                                                    <button
                                                        type="submit"
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Session"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
