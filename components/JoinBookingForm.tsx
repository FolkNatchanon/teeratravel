"use client";

import { useActionState, useState } from "react";
import { createBooking } from "@/app/actions/booking";
import { Users, CheckCircle, Calendar, Clock } from "lucide-react";
import AuthGuardModal from "./AuthGuardModal";
import { JoinSession } from "@prisma/client";

interface JoinBookingFormProps {
    packageId: number;
    sessions: JoinSession[];
    isLoggedIn: boolean;
}

const initialState = {
    message: "",
    errors: {} as Record<string, string[]> | undefined,
};

export default function JoinBookingForm({ packageId, sessions, isLoggedIn }: JoinBookingFormProps) {
    // @ts-ignore
    const [state, formAction] = useActionState(createBooking, initialState);

    // Form State
    const [step, setStep] = useState(1);
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const [selectedSession, setSelectedSession] = useState<JoinSession | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Passenger State
    // Default 1 passenger
    const [passengers, setPassengers] = useState([{ id: Date.now(), fname: "", lname: "", age: "", gender: "male" }]);
    const passengerCount = passengers.length;

    // Calculate price based on selected session
    const pricePerPerson = selectedSession?.price_per_person ? Number(selectedSession.price_per_person) : 0;
    const totalPrice = pricePerPerson * passengerCount;

    const handleSessionSelect = (session: JoinSession) => {
        setSelectedSessionId(session.session_id);
        setSelectedSession(session);
        // Reset passengers if count exceeds capacity
        const remaining = session.max_capacity - session.current_bookings;
        if (passengerCount > remaining) {
            setPassengers(passengers.slice(0, remaining));
        }
    };

    const handleNext = () => {
        if (!isLoggedIn) {
            setShowAuthModal(true);
            return;
        }

        if (selectedSessionId && passengerCount > 0) {
            setStep(2);
        } else {
            alert("กรุณาเลือกรอบเดินทาง");
        }
    };

    const updatePassenger = (index: number, field: string, value: string) => {
        const newPassengers = [...passengers];
        newPassengers[index] = { ...newPassengers[index], [field]: value };
        setPassengers(newPassengers);
    };

    const addPassenger = () => {
        if (!selectedSession) return;
        const remaining = selectedSession.max_capacity - selectedSession.current_bookings;

        if (passengerCount < remaining) {
            setPassengers([...passengers, { id: Date.now(), fname: "", lname: "", age: "", gender: "male" }]);
        }
    };

    const removePassenger = (index: number) => {
        if (passengers.length > 1) {
            const newPassengers = passengers.filter((_, i) => i !== index);
            setPassengers(newPassengers);
        }
    };

    return (
        <>
            <form action={formAction} className="space-y-4">
                <input type="hidden" name="packageId" value={packageId} />
                <input type="hidden" name="passengerCount" value={passengerCount} />
                {selectedSession && (
                    <>
                        <input type="hidden" name="tripDate" value={new Date(selectedSession.trip_date).toISOString()} />
                        <input type="hidden" name="timeSlot" value={selectedSession.time_slot} />
                        <input type="hidden" name="joinSessionId" value={selectedSession.session_id} />
                    </>
                )}

                {state?.message && (
                    <div className={`p-3 rounded-lg text-sm ${state.message.includes("สำเร็จ") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {state.message}
                    </div>
                )}

                {/* STEP 1: Select Session */}
                <div className={step === 1 ? "block space-y-4" : "hidden"}>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-2">เลือกรอบเดินทาง</h3>
                        {sessions.length === 0 ? (
                            <div className="p-4 bg-gray-50 text-gray-500 text-sm rounded-lg text-center">
                                ยังไม่มีรอบการเดินทางที่เปิดให้จองในขณะนี้
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                                {sessions.map(session => {
                                    const remaining = session.max_capacity - session.current_bookings;
                                    const isFull = remaining <= 0;

                                    return (
                                        <div
                                            key={session.session_id}
                                            onClick={() => !isFull && handleSessionSelect(session)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedSessionId === session.session_id
                                                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                                    : isFull ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-500" />
                                                    <span className="font-bold text-gray-900">
                                                        {new Date(session.trip_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                    <span className="text-xs text-gray-500">•</span>
                                                    <span className="text-sm text-gray-700">
                                                        {session.time_slot === 'morning' ? '09:00' : '13:00'}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-blue-600">฿{Number(session.price_per_person).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <div className={`flex items-center gap-1 ${isFull ? 'text-red-500' : 'text-green-600'}`}>
                                                    <Users className="w-3 h-3" />
                                                    {isFull ? 'เต็มแล้ว' : `ว่าง ${remaining} ที่นั่ง`}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {selectedSession && (
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                จำนวนผู้โดยสาร
                                <span className="text-gray-500 font-normal ml-1">(ว่าง {selectedSession.max_capacity - selectedSession.current_bookings} ที่)</span>
                            </label>

                            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => passengers.length > 1 && removePassenger(passengers.length - 1)}
                                    className="w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                                    disabled={passengers.length <= 1}
                                >
                                    -
                                </button>
                                <span className="text-xl font-bold w-8 text-center">{passengerCount}</span>
                                <button
                                    type="button"
                                    onClick={addPassenger}
                                    className="w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                                    disabled={passengerCount >= (selectedSession.max_capacity - selectedSession.current_bookings)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={!selectedSessionId || sessions.length === 0}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg active:scale-95 transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ถัดไป
                        </button>
                    </div>
                </div>

                {/* STEP 2: Passenger Details Modal (Reused Logic mainly) */}
                {step === 2 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">ระบุรายละเอียดผู้โดยสาร</h3>
                                    <p className="text-sm text-gray-500">
                                        {selectedSession && new Date(selectedSession.trip_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })} |
                                        {selectedSession?.time_slot === 'morning' ? ' รอบเช้า' : ' รอบบ่าย'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                                {/* Price Summary Card */}
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-700 font-medium">ผู้โดยสาร {passengerCount} ท่าน</span>
                                        <span className="text-gray-900 font-bold">฿{totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 flex justify-between">
                                        <span>ราคาต่อท่าน</span>
                                        <span>฿{pricePerPerson.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {passengers.map((passenger, index) => (
                                        <div key={passenger.id} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3 relative group">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900">ข้อมูลผู้โดยสารคนที่ {index + 1}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">ชื่อจริง</label>
                                                    <input
                                                        type="text"
                                                        name={`passenger_fname_${index}`}
                                                        value={passenger.fname}
                                                        onChange={(e) => updatePassenger(index, 'fname', e.target.value)}
                                                        required={step === 2}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900"
                                                        placeholder="ชื่อจริง (ภาษาอังกฤษ)"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">นามสกุล</label>
                                                    <input
                                                        type="text"
                                                        name={`passenger_lname_${index}`}
                                                        value={passenger.lname}
                                                        onChange={(e) => updatePassenger(index, 'lname', e.target.value)}
                                                        required={step === 2}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900"
                                                        placeholder="นามสกุล"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">อายุ</label>
                                                    <input
                                                        type="number"
                                                        name={`passenger_age_${index}`}
                                                        value={passenger.age}
                                                        onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                                                        required={step === 2}
                                                        min="0"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900"
                                                        placeholder="อายุ (ปี)"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">เพศ</label>
                                                    <select
                                                        name={`passenger_gender_${index}`}
                                                        value={passenger.gender}
                                                        onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                                                        required={step === 2}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 bg-white"
                                                    >
                                                        <option value="male">ชาย</option>
                                                        <option value="female">หญิง</option>
                                                        <option value="other">อื่นๆ</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-1/3 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                >
                                    ย้อนกลับ
                                </button>
                                <button
                                    type="submit"
                                    className="w-2/3 bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg active:scale-95 transform duration-200 flex items-center justify-center gap-2"
                                >
                                    <span>จองและชำระเงิน</span>
                                    <span className="bg-blue-500/30 px-2 py-0.5 rounded text-sm">฿{totalPrice.toLocaleString()}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <AuthGuardModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            </form>
        </>
    );
}
