import AdminLayout from '@/components/layouts/AdminLayout';
import { useContent } from '@/contexts/ContentContext';
import { useBooking } from '@/contexts/BookingContext';
import { useState } from 'react';
import {
    Search, Filter, MoreVertical, CheckCircle, XCircle, Clock, Trash2, Eye
} from 'lucide-react';
import { Booking } from '@/types';
import BookingDetailModal from '@/components/admin/BookingDetailModal';

export default function BookingsPage() {
    const { customers } = useContent();
    const { bookings, updateBookingStatus, deleteBooking } = useBooking();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'All' | Booking['status']>('All');

    // Modal State
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleViewDetail = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsDetailOpen(true);
    };

    const filteredBookings = bookings.filter(b => {
        const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.id.includes(searchTerm);
        const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout title="Bookings">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Actions Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Order ID, Customer, or Product..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-gray-50 border-none rounded-xl text-sm font-bold px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 text-left text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
                                    <th className="py-4 pl-6">Order ID</th>
                                    <th className="py-4">Customer</th>
                                    <th className="py-4">Product</th>
                                    <th className="py-4">Amount</th>
                                    <th className="py-4">Status</th>
                                    <th className="py-4">Date</th>
                                    <th className="py-4 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredBookings.length > 0 ? (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50/80 transition group">
                                            <td className="py-4 pl-6 font-mono text-xs font-medium text-gray-500">#{booking.id.toUpperCase()}</td>
                                            <td className="py-4 font-bold text-gray-900">{booking.customerName}</td>
                                            <td className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">{booking.productName}</span>
                                                    <span className="text-xs text-gray-400">{booking.productType} • {booking.totalPax} Pax</span>
                                                </div>
                                            </td>
                                            <td className="py-4 font-bold text-gray-900">Rp {booking.amount.toLocaleString()}</td>
                                            <td className="py-4">
                                                <StatusBadge status={booking.status} />
                                            </td>
                                            <td className="py-4 text-sm text-gray-500">{booking.date}</td>
                                            <td className="py-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                                                    <button
                                                        onClick={() => handleViewDetail(booking)}
                                                        className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 tooltip"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {/* Action Buttons */}
                                                    {booking.status === 'Pending' && (
                                                        <button
                                                            onClick={() => updateBookingStatus(booking.id, 'Paid')}
                                                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 tooltip"
                                                            title="Mark as Paid"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {booking.status === 'Paid' && (
                                                        <button
                                                            onClick={() => updateBookingStatus(booking.id, 'Completed')}
                                                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 tooltip"
                                                            title="Mark as Completed"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {(booking.status === 'Pending' || booking.status === 'Paid') && (
                                                        <button
                                                            onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                                                            className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 tooltip"
                                                            title="Cancel Order"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => deleteBooking(booking.id)}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                                            No bookings found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <BookingDetailModal
                booking={selectedBooking}
                customer={customers.find(c => c.name === selectedBooking?.customerName)}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onStatusUpdate={(id, status) => {
                    updateBookingStatus(id, status);
                    if (selectedBooking) {
                        setSelectedBooking({ ...selectedBooking, status });
                    }
                }}
            />
        </AdminLayout >
    );
}

export function StatusBadge({ status }: { status: string }) {
    const styles = {
        'Paid': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
        'Cancelled': 'bg-red-100 text-red-700 border-red-200',
        'Completed': 'bg-blue-100 text-blue-700 border-blue-200',
    };

    const icon = {
        'Paid': CheckCircle,
        'Pending': Clock,
        'Cancelled': XCircle,
        'Completed': CheckCircle
    };

    const IconComp = icon[status as keyof typeof icon] || Clock;

    return (
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-600'}`}>
            <IconComp className="w-3 h-3" />
            {status}
        </span>
    );
}
