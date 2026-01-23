"use client";

import { useActionState, useState } from "react";
import { createBooking } from "@/app/actions/booking";
import { Calendar, Users, CheckCircle } from "lucide-react";
import AuthGuardModal from "./AuthGuardModal";

interface BookingFormProps {
    packageId: number;
    baseMemberCount: number;
    extraPricePerPerson: number;
    maxCapacity: number;
    basePrice: number;
    isLoggedIn: boolean;
}

const initialState = {
    message: "",
    errors: {} as Record<string, string[]> | undefined,
};

export default function BookingForm({ packageId, baseMemberCount, extraPricePerPerson, maxCapacity, basePrice, isLoggedIn }: BookingFormProps) {
    // @ts-ignore - useActionState types can be tricky with server actions
    const [state, formAction] = useActionState(createBooking, initialState);

    // Form State
    const [step, setStep] = useState(1);
    const [tripDate, setTripDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Controlled Passenger State
    const [passengers, setPassengers] = useState([{ id: Date.now(), fname: "", lname: "", age: "", gender: "male" }]);

    // Sync passenger count for calculation
    const passengerCount = passengers.length;
    const extraPax = Math.max(0, passengerCount - baseMemberCount);
    const totalPrice = basePrice + (extraPax * extraPricePerPerson);

    // Validation for Step 1
    const isStep1Valid = tripDate && timeSlot && passengerCount > 0;

    const handleNext = () => {
        if (!isLoggedIn) {
            setShowAuthModal(true);
            return;
        }

        if (isStep1Valid) {
            setStep(2);
        } else {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        }
    };

    const updatePassenger = (index: number, field: string, value: string) => {
        const newPassengers = [...passengers];
        newPassengers[index] = { ...newPassengers[index], [field]: value };
        setPassengers(newPassengers);
    };

    const addPassenger = () => {
        if (passengerCount < maxCapacity) {
            setPassengers([...passengers, { id: Date.now(), fname: "", lname: "", age: "", gender: "male" }]);
        }
    };

    const removePassenger = (index: number) => {
        if (passengers.length > 1) {
            const newPassengers = passengers.filter((_, i) => i !== index);
            setPassengers(newPassengers);
        }
    };

    const handleCountChange = (newCount: number) => {
        const count = Math.max(1, Math.min(maxCapacity, newCount));
        if (count > passengers.length) {
            // Add
            const toAdd = count - passengers.length;
            const newPax = Array.from({ length: toAdd }).map((_, i) => ({ id: Date.now() + i, fname: "", lname: "", age: "", gender: "male" }));
            setPassengers([...passengers, ...newPax]);
        } else if (count < passengers.length) {
            // Remove from end
            setPassengers(passengers.slice(0, count));
        }
    };

    return (
        <>
            <form action={formAction} className="space-y-4">
                <input type="hidden" name="packageId" value={packageId} />
                {/* Hidden input for passenger count to ensure server receives it correct if needed, though server actions usually parse generated inputs. 
                    Wait, backend expects 'passengerCount' field in FormData! 
                    We must include this hidden input. */}
                <input type="hidden" name="passengerCount" value={passengerCount} />

                {state?.message && (
                    <div className={`p-3 rounded-lg text-sm ${state.message.includes("สำเร็จ") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {state.message}
                    </div>
                )}

                {/* STEP 1: Selection */}
                <div className={step === 1 ? "block space-y-4" : "hidden"}>
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">วันที่เดินทาง</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="date"
                                name="tripDate"
                                required
                                value={tripDate}
                                onChange={(e) => setTripDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">รอบเวลา</label>
                        <select
                            name="timeSlot"
                            value={timeSlot}
                            onChange={(e) => setTimeSlot(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                            required
                        >
                            <option value="">เลือกรอบเวลา</option>
                            <option value="morning">เช้า (Morning)</option>
                            <option value="afternoon">บ่าย (Afternoon)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">จำนวนผู้โดยสาร (สูงสุด {maxCapacity} ท่าน)</label>
                        <div className="relative mb-2">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="number"
                                min="1"
                                max={maxCapacity}
                                value={passengerCount}
                                onChange={(e) => handleCountChange(Number(e.target.value))}
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                            />
                        </div>
                        <p className="text-xs text-gray-500">
                            *ราคาพื้นฐานรวม {baseMemberCount} ท่าน (เพิ่มท่านละ {extraPricePerPerson.toLocaleString()} บาท)
                        </p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="button"
                            onClick={handleNext}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg active:scale-95 transform duration-200"
                        >
                            ถัดไป
                        </button>
                    </div>
                </div>

                {/* STEP 2: Passenger Details Modal */}
                {step === 2 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">ระบุรายละเอียดผู้โดยสาร</h3>
                                    <p className="text-sm text-gray-500">
                                        วันที่ {new Date(tripDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })} |
                                        รอบ {timeSlot === 'morning' ? 'เช้า' : 'บ่าย'}
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
                                        <span>ราคาเหมา ({baseMemberCount} ท่านแรก)</span>
                                        <span>฿{basePrice.toLocaleString()}</span>
                                    </div>
                                    {extraPax > 0 && (
                                        <div className="text-xs text-gray-500 flex justify-between mt-1">
                                            <span>ส่วนเกิน ({extraPax} ท่าน x ฿{extraPricePerPerson.toLocaleString()})</span>
                                            <span>฿{(extraPax * extraPricePerPerson).toLocaleString()}</span>
                                        </div>
                                    )}
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
                                                {passengers.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removePassenger(index)}
                                                        className="text-red-400 hover:text-red-600 text-xs font-semibold p-1 hover:bg-red-50 rounded"
                                                    >
                                                        ลบ
                                                    </button>
                                                )}
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

                                    {passengerCount < maxCapacity && (
                                        <button
                                            type="button"
                                            onClick={addPassenger}
                                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Users className="w-5 h-5" />
                                            <span>เพิ่มผู้โดยสาร</span>
                                        </button>
                                    )}
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
