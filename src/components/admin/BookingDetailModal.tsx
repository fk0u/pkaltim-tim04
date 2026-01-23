import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Printer, Mail, CheckCircle, AlertCircle, Clock,
    CreditCard, Calendar, MapPin, User, Download, RefreshCw
} from 'lucide-react';
import { Booking, User as UserType } from '../../types';
import { StatusBadge } from '@/pages/dashboard/admin/bookings';
import { useReactToPrint } from 'react-to-print';

interface BookingDetailModalProps {
    booking: Booking | null;
    customer?: UserType;
    isOpen: boolean;
    onClose: () => void;
    onStatusUpdate: (id: string, status: Booking['status']) => void;
}

export default function BookingDetailModal({ booking, customer, isOpen, onClose, onStatusUpdate }: BookingDetailModalProps) {
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: booking ? `Invoice-${booking.id}` : 'Invoice',
    });

    if (!isOpen || !booking) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                                <StatusBadge status={booking.status} />
                            </div>
                            <p className="text-gray-500 text-sm mt-1">ID: #{booking.id.toUpperCase()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handlePrint()}
                                className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition"
                                title="Print Invoice"
                            >
                                <Printer className="w-5 h-5" />
                            </button>
                            <button
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                                title="Email Customer"
                            >
                                <Mail className="w-5 h-5" />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column: Invoice & Details - Printable Area */}
                            <div className="lg:col-span-2 space-y-8" ref={componentRef}>
                                {/* Invoice Header (Visible only in print usually, but here likely visible always for "Invoice View") */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <div className="flex justify-between mb-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-emerald-900">INVOICE</h3>
                                            <p className="text-gray-500 text-sm">BorneoTrip Inc.</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Date issued</p>
                                            <p className="font-semibold text-gray-900">{booking.date}</p>
                                        </div>
                                    </div>

                                    {/* Trip Info */}
                                    <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center text-gray-400">
                                            {/* Placeholder for missing image in Booking type */}
                                            <Calendar className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900">{booking.productName}</h4>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {booking.date}</span>
                                                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {booking.totalPax} Guests ({booking.adultCount} Adult, {booking.childCount} Child)</span>
                                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {booking.location || 'Kalimantan'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cost Breakdown */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Adults ({booking.adultCount}x)</span>
                                            <span className="font-medium text-gray-900 overflow-hidden">-</span>
                                        </div>
                                        {booking.childCount > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Children ({booking.childCount}x)</span>
                                                <span className="font-medium text-gray-900 overflow-hidden">-</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Service Fee</span>
                                            <span className="font-medium text-gray-900">0 IDR</span>
                                        </div>
                                        <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-100 mt-3">
                                            <span className="text-emerald-900">Total Paid</span>
                                            <span className="text-emerald-600 overflow-hidden">{booking.amount.toLocaleString('id-ID')} IDR</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Note (Mock) */}
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-emerald-600" />
                                        Special Requests
                                    </h4>
                                    <p className="text-gray-600 text-sm italic">
                                        "No spicy food please. Provide vegetarian options if possible."
                                    </p>
                                </div>
                            </div>

                            {/* Right Column: Actions & Timeline */}
                            <div className="space-y-6">
                                {/* Customer Profile */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Customer</h4>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl">
                                            {customer?.name.charAt(0) || booking.customerName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{customer?.name || booking.customerName}</p>
                                            <p className="text-xs text-gray-500">{customer?.email || 'email@example.com'}</p>
                                        </div>
                                    </div>
                                    <button className="w-full py-2 text-sm text-emerald-600 font-medium bg-emerald-50 rounded-lg hover:bg-emerald-100 transition">
                                        View Full Profile
                                    </button>
                                </div>

                                {/* Timeline */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Timeline</h4>
                                    <div className="space-y-6 relative pl-2">
                                        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                                        <div className="relative pl-6">
                                            <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white"></div>
                                            <p className="text-sm font-bold text-gray-900">Order Placed</p>
                                            <p className="text-xs text-gray-500">{booking.date} • 10:23 AM</p>
                                        </div>
                                        <div className="relative pl-6">
                                            <div className={`absolute left-[-5px] top-1 w-3 h-3 rounded-full ring-4 ring-white ${['Paid', 'Completed'].includes(booking.status) ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                            <p className={`text-sm font-bold ${['Paid', 'Completed'].includes(booking.status) ? 'text-gray-900' : 'text-gray-400'}`}>Payment Confirmed</p>
                                            {['Paid', 'Completed'].includes(booking.status) && <p className="text-xs text-gray-500">{booking.date} • 10:25 AM</p>}
                                        </div>
                                        <div className="relative pl-6">
                                            <div className={`absolute left-[-5px] top-1 w-3 h-3 rounded-full ring-4 ring-white ${booking.status === 'Completed' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                            <p className={`text-sm font-bold ${booking.status === 'Completed' ? 'text-gray-900' : 'text-gray-400'}`}>Trip Completed</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Actions</h4>

                                    {booking.status === 'Pending' && (
                                        <button
                                            onClick={() => onStatusUpdate(booking.id, 'Paid')}
                                            className="w-full py-3 flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Approve Payment
                                        </button>
                                    )}

                                    {booking.status === 'Paid' && (
                                        <button
                                            onClick={() => onStatusUpdate(booking.id, 'Completed')}
                                            className="w-full py-3 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Mark as Completed
                                        </button>
                                    )}

                                    {booking.status !== 'Cancelled' && (
                                        <button
                                            onClick={() => onStatusUpdate(booking.id, 'Cancelled')}
                                            className="w-full py-3 flex items-center justify-center gap-2 border border-red-100 text-red-600 bg-red-50 rounded-xl font-medium hover:bg-red-100 transition"
                                        >
                                            <X className="w-4 h-4" /> Cancel Booking
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
