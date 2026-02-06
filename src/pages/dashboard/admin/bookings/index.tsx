import AdminLayout from '@/components/layouts/AdminLayout';
import { useContent } from '@/contexts/ContentContext';
import { useState } from 'react';
import { Search, Calendar, User, MapPin } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import BookingDetailModal from '@/components/admin/BookingDetailModal';
import { Booking } from '@/types';

export default function BookingsPage() {
    const { bookings, updateBookingStatus } = useContent();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const filteredBookings = bookings.filter(b =>
        b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewDetail = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsDetailOpen(true);
    };

    return (
        <AdminLayout title="Bookings">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="relative flex-1 max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Booking List - Desktop Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hidden md:block">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase">Order ID</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase">Product</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase">Customer</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase">Date</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase">Amount</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase">Status</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredBookings.map(booking => (
                                <tr key={booking.id} className="hover:bg-gray-50/50 transition bg-white">
                                    <td className="p-6 font-mono text-xs text-gray-500">#{booking.id}</td>
                                    <td className="p-6">
                                        <div className="font-bold text-gray-900">{booking.productName}</div>
                                        <div className="text-xs text-gray-400">{booking.productType}</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                                                {booking.customerName.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{booking.customerName}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" /> {booking.date}
                                        </div>
                                    </td>
                                    <td className="p-6 font-bold text-gray-900">Rp {booking.amount.toLocaleString()}</td>
                                    <td className="p-6">
                                        <StatusBadge status={booking.status} />
                                    </td>
                                    <td className="p-6 text-right">
                                        <button
                                            onClick={() => handleViewDetail(booking)}
                                            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <BookingDetailModal
                booking={selectedBooking}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onStatusUpdate={async (id, status) => {
                    console.log('Status update:', id, status);
                    await updateBookingStatus(id, status);
                    setIsDetailOpen(false);
                }}
            />
        </AdminLayout>
    );
}
