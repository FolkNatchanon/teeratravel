import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'private' or 'join'
    const id = searchParams.get('id');

    if (!type || !id) {
        return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
    }

    try {
        let tripData;

        if (type === 'private') {
            // Fetch Private Booking
            const booking = await prisma.booking.findUnique({
                where: { booking_id: Number(id) },
                include: {
                    package: true,
                    boat: true,
                    passengers: true,
                    staff: true,
                    user: true,
                }
            });

            if (!booking) {
                return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
            }

            tripData = {
                packageName: booking.package.name,
                date: new Date(booking.trip_date).toLocaleDateString('th-TH', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                }),
                timeSlot: booking.time_slot === 'morning' ? 'เช้า (09:00)' : 'บ่าย (13:00)',
                boatName: booking.boat.name,
                passengers: booking.passengers.map(p => ({
                    name: `${p.fname} ${p.lname}`,
                    age: p.age,
                    gender: p.gender === 'male' ? 'ชาย' : p.gender === 'female' ? 'หญิง' : 'อื่นๆ'
                })),
                staff: booking.staff.map(s => ({
                    name: `${s.fname} ${s.lname}`,
                    role: s.role === 'captain' ? 'กัปตัน' : 'ลูกเรือ'
                })),
                customerName: `${booking.user.user_fname} ${booking.user.user_lname}`,
                customerPhone: booking.user.phone_number,
                type: 'private'
            };

        } else if (type === 'join') {
            // Fetch Join Session
            const session = await prisma.joinSession.findUnique({
                where: { session_id: Number(id) },
                include: {
                    package: { include: { boat: true } },
                    staff: true,
                    bookings: {
                        where: { status: { in: ['complete', 'finished'] } },
                        include: {
                            passengers: true,
                            user: true
                        }
                    }
                }
            });

            if (!session) {
                return NextResponse.json({ error: 'Session not found' }, { status: 404 });
            }

            // Flatten all passengers from confirmed bookings
            const allPassengers = session.bookings.flatMap(b =>
                b.passengers.map(p => ({
                    name: `${p.fname} ${p.lname}`,
                    age: p.age,
                    gender: p.gender === 'male' ? 'ชาย' : p.gender === 'female' ? 'หญิง' : 'อื่นๆ',
                    contactName: `${b.user.user_fname} ${b.user.user_lname}`,
                    contactPhone: b.user.phone_number
                }))
            );

            tripData = {
                packageName: session.package.name,
                date: new Date(session.trip_date).toLocaleDateString('th-TH', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                }),
                timeSlot: session.time_slot === 'morning' ? 'เช้า (09:00)' : 'บ่าย (13:00)',
                boatName: session.package.boat.name,
                passengers: allPassengers,
                staff: session.staff.map(s => ({
                    name: `${s.fname} ${s.lname}`,
                    role: s.role === 'captain' ? 'กัปตัน' : 'ลูกเรือ'
                })),
                totalBookings: session.bookings.length,
                type: 'join'
            };
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        // Generate print-friendly HTML
        const html = generatePrintHTML(tripData);

        return new NextResponse(html, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });

    } catch (error) {
        console.error('Error generating manifest:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

function generatePrintHTML(data: any): string {
    const captain = data.staff.find((s: any) => s.role === 'กัปตัน');
    const crew = data.staff.filter((s: any) => s.role === 'ลูกเรือ');

    return `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trip Manifest - ${data.packageName}</title>
    <style>
        @page {
            size: A4;
            margin: 15mm;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Sarabun', 'Segoe UI', Tahoma, sans-serif; 
            background: white;
            font-size: 12pt;
            line-height: 1.4;
            color: #000;
        }
        .header { 
            text-align: center; 
            border-bottom: 2px solid #000; 
            padding-bottom: 10px; 
            margin-bottom: 20px; 
        }
        .header h1 { font-size: 18pt; margin-bottom: 5px; text-transform: uppercase; }
        .header .subtitle { font-size: 12pt; }
        
        .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 5px 20px; 
            margin-bottom: 20px;
            border: 1px solid #000;
            padding: 10px;
        }
        .info-item { }
        .info-label { font-weight: bold; }
        
        .section { margin-bottom: 20px; }
        .section-title { 
            font-size: 14pt; 
            font-weight: bold; 
            margin-bottom: 8px; 
            border-bottom: 1px solid #000;
        }
        
        table { width: 100%; border-collapse: collapse; }
        thead { display: table-header-group; }
        tr { page-break-inside: avoid; }
        th, td { 
            border: 1px solid #000; 
            padding: 6px 8px; 
            text-align: left; 
            font-size: 11pt;
            vertical-align: top;
        }
        th { background: #eee; font-weight: bold; }
        
        .staff-list { margin-bottom: 5px; }
        .staff-role { font-weight: bold; }
        
        .footer { 
            position: running(footer);
            margin-top: 20px; 
            text-align: right; 
            font-size: 10pt; 
            border-top: 1px solid #000;
            padding-top: 5px;
        }
        
        .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #333;
            color: white;
            border: none;
            cursor: pointer;
            font-weight: bold;
        }
        @media print {
            .print-btn { display: none; }
        }
    </style>
</head>
<body>
    <button class="print-btn" onclick="window.print()">PRINT / SAVE PDF</button>

    <div class="header">
        <h1>Trip Manifest</h1>
        <div class="subtitle">Teera Travel - Passenger List</div>
    </div>

    <div class="info-grid">
        <div class="info-item">
            <span class="info-label">Package:</span> ${data.packageName}
        </div>
        <div class="info-item">
            <span class="info-label">Type:</span> ${data.type === 'private' ? 'Private Trip' : 'Join Trip'}
        </div>
        <div class="info-item">
            <span class="info-label">Date:</span> ${data.date}
        </div>
        <div class="info-item">
            <span class="info-label">Time:</span> ${data.timeSlot}
        </div>
        <div class="info-item">
            <span class="info-label">Boat:</span> ${data.boatName}
        </div>
        <div class="info-item">
            <span class="info-label">Passengers:</span> ${data.passengers.length}
        </div>
        ${data.customerName ? `
        <div class="info-item">
            <span class="info-label">Customer:</span> ${data.customerName}
        </div>
        <div class="info-item">
            <span class="info-label">Tel:</span> ${data.customerPhone}
        </div>
        ` : ''}
    </div>

    <div class="section">
        <div class="section-title">สตาฟ</div>
        ${data.staff.length > 0 ? `
        <div class="staff-list">
            ${captain ? `<div><span class="staff-role">กัปตัน:</span> ${captain.name}</div>` : ''}
            ${crew.length > 0 ? `<div><span class="staff-role">สตาฟ:</span> ${crew.map((c: any) => c.name).join(', ')}</div>` : ''}
        </div>
        ` : '<div>No staff assigned</div>'}
    </div>

    <div class="section">
        <div class="section-title">รายชื่อผู้โดยสาร</div>
        <table>
            <thead>
                <tr>
                    <th style="width:5%">No.</th>
                    <th style="width:35%">ชื่อ</th>
                    <th style="width:10%">อายุ</th>
                    <th style="width:10%">เพศ</th>
                    ${data.type === 'join' ? '<th style="width:25%">ติดต่อ</th>' : ''}
                    <th style="width:15%; text-align:center">Check-in</th>
                </tr>
            </thead>
            <tbody>
                ${data.passengers.map((p: any, i: number) => `
                <tr>
                    <td>${i + 1}</td>
                    <td>${p.name}</td>
                    <td>${p.age}</td>
                    <td>${p.gender}</td>
                    ${data.type === 'join' ? `<td>${p.contactName}<br/>${p.contactPhone}</td>` : ''}
                    <td style="text-align:center"></td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="footer">
        Printed: ${new Date().toLocaleString('th-TH')}
    </div>
</body>
</html>
    `;
}
