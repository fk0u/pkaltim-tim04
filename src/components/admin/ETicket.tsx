import React, { useEffect, useState } from 'react';
import { Booking } from '@/types';
import QRCode from 'qrcode';
import { MapPin, Calendar, Users, Phone, CreditCard, Mail } from 'lucide-react';
import Image from 'next/image';

interface ETicketProps {
    booking: Booking;
}

export const ETicket = React.forwardRef<HTMLDivElement, ETicketProps>(({ booking }, ref) => {
    const [qrSrc, setQrSrc] = useState('');

    useEffect(() => {
        if (booking?.id) {
            QRCode.toDataURL(booking.id)
                .then(url => setQrSrc(url))
                .catch(err => console.error(err));
        }
    }, [booking]);

    if (!booking) return null;

    return (
        <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto text-slate-900 print:p-0 print:max-w-none">
            {/* Header / Brand */}
            <div className="flex justify-between items-start border-b-2 border-emerald-500 pb-6 mb-8 mt-10 print:mt-0">
                <div>
                    <h1 className="text-3xl font-black text-emerald-800 tracking-tight uppercase">E-Ticket</h1>
                    <p className="text-sm font-semibold text-slate-500 mt-1">BorneoTrip Adventure</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Booking ID</p>
                    <p className="text-2xl font-mono font-bold text-slate-900">#{booking.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-8">
                {/* Main Product Info */}
                <div className="col-span-2 space-y-6">
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Product</p>
                        <h2 className="text-2xl font-bold text-slate-900 leading-tight">{booking.productName}</h2>
                        <div className="flex items-center gap-2 mt-2 text-emerald-700 font-medium">
                            <MapPin className="w-4 h-4" />
                            {booking.location || 'Kalimantan Timur'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-1 text-slate-500">
                                <Calendar className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold uppercase">Date</span>
                            </div>
                            <p className="font-bold text-lg">{new Date(booking.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-1 text-slate-500">
                                <Users className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold uppercase">Guests</span>
                            </div>
                            <p className="font-bold text-lg">{booking.totalPax} Pax</p>
                            <p className="text-xs text-slate-500">({booking.adultCount} Adult, {booking.childCount} Child)</p>
                        </div>
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="col-span-1 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl text-white text-center">
                    <div className="bg-white p-2 rounded-lg mb-4">
                        {qrSrc && <img src={qrSrc} alt="Booking QR" className="w-32 h-32 object-contain" />}
                    </div>
                    <p className="text-xs font-medium text-slate-400 mb-1">Scan to Check-in</p>
                    <p className="text-sm font-mono font-bold">{booking.status.toUpperCase()}</p>
                </div>
            </div>

            {/* Traveler Details */}
            <div className="mb-8">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Traveler Manifest</h3>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="p-3 w-12 text-center">No</th>
                                <th className="p-3">Full Name</th>
                                <th className="p-3">Identity</th>
                                <th className="p-3">Contact</th>
                                <th className="p-3">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {booking.travelers && booking.travelers.length > 0 ? (
                                booking.travelers.map((t, idx) => (
                                    <tr key={idx} className="bg-white">
                                        <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                                        <td className="p-3">
                                            <div className="font-bold text-slate-800 uppercase">{t.title} {t.fullName}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{t.type} {t.age ? `• ${t.age} Years` : ''}</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="text-xs font-bold text-slate-400 uppercase">NIK / Passport</div>
                                            <div className="font-mono text-slate-700">{t.idNumber || '-'}</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="text-xs font-bold text-slate-400 uppercase">Phone</div>
                                            <div className="font-mono text-slate-700">{t.phoneNumber || '-'}</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="text-xs font-bold text-slate-400 uppercase">Nationality</div>
                                            <div className="text-slate-700">{t.nationality || '-'}</div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-slate-400 italic">No detailed traveler data available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer / Important Info */}
            <div className="grid grid-cols-2 gap-8 text-xs text-slate-500 border-t border-slate-200 pt-6">
                <div>
                    <h4 className="font-bold text-slate-800 uppercase mb-2">Important Notes</h4>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Please show this e-ticket or QR code at the meeting point.</li>
                        <li>Arrive at least 30 minutes before departure time.</li>
                        <li>Valid ID card (KTP/Passport) matching the traveler manifest is required.</li>
                    </ul>
                </div>
                <div className="text-right">
                    <h4 className="font-bold text-slate-800 uppercase mb-2">Contact Support</h4>
                    <p className="flex items-center justify-end gap-2"><Phone className="w-3 h-3" /> +62 812 3456 7890</p>
                    <p className="flex items-center justify-end gap-2"><Mail className="w-3 h-3" /> support@borneotrip.com</p>
                    <p className="mt-4 font-bold text-emerald-600">www.borneotrip.com</p>
                </div>
            </div>

            <div className="mt-8 text-center text-[10px] text-slate-300 font-mono">
                Generated internally by BorneoTrip System • {new Date().toISOString()}
            </div>
        </div>
    );
});

ETicket.displayName = 'ETicket';
