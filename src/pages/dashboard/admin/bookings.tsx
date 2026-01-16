import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle, Clock, Eye, Download, Calendar, MapPin, User, Mail, Phone, DollarSign } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui';

// Mock Data
const INITIAL_BOOKINGS = [
    { id: 'BK-8821', guest: 'Budi Santoso', email: 'budi@gmail.com', phone: '+62812345678', pkg: 'Derawan Paradise', date: '20 Feb 2026', duration: '4 Hari', status: 'Paid', amount: 5200000, paymentMethod: 'Bank Transfer' },
    { id: 'BK-8822', guest: 'Sarah Jenkins', email: 'sarah.j@uk.co', phone: '+447911123456', pkg: 'Orangutan Tour', date: '22 Feb 2026', duration: '3 Hari', status: 'Pending', amount: 8500000, paymentMethod: 'Credit Card' },
    { id: 'BK-8823', guest: 'Ahmad Dani', email: 'ahmad.dani@yahoo.com', phone: '+62811223344', pkg: 'Mahakam Safari', date: '25 Feb 2026', duration: '5 Hari', status: 'Confirmed', amount: 4100000, paymentMethod: 'E-Wallet' },
    { id: 'BK-8824', guest: 'Rina Nose', email: 'rina.nose@gmail.com', phone: '+62855667788', pkg: 'Kakaban Trip', date: '28 Feb 2026', duration: '2 Hari', status: 'Cancelled', amount: 3500000, paymentMethod: 'Bank Transfer' },
    { id: 'BK-8825', guest: 'John Doe', email: 'john.doe@gmail.com', phone: '+1234567890', pkg: 'Derawan Paradise', date: '01 Mar 2026', duration: '4 Hari', status: 'Pending', amount: 5200000, paymentMethod: 'Credit Card' },
    { id: 'BK-8826', guest: 'Jane Smith', email: 'jane.smith@gmail.com', phone: '+0987654321', pkg: 'Orangutan Tour', date: '05 Mar 2026', duration: '3 Hari', status: 'Paid', amount: 8500000, paymentMethod: 'Bank Transfer' },
];

export default function BookingsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();

    const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    useEffect(() => {
        if (!isAuthenticated) router.push('/login');
    }, [isAuthenticated, router]);

    if (!user) return null;

    const filteredBookings = bookings.filter(b => {
        const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
        const matchesSearch = b.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleUpdateStatus = (id: string, newStatus: string) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        addToast(`Booking ${id} status updated to ${newStatus}`, 'success');
        setSelectedBooking(null);
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            Paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
            Confirmed: 'bg-blue-50 text-blue-700 ring-blue-600/20',
            Pending: 'bg-orange-50 text-orange-700 ring-orange-600/20',
            Cancelled: 'bg-red-50 text-red-700 ring-red-600/20',
        };
        const icons = {
            Paid: <CheckCircle className="w-3 h-3" />,
            Confirmed: <CheckCircle className="w-3 h-3" />,
            Pending: <Clock className="w-3 h-3" />,
            Cancelled: <XCircle className="w-3 h-3" />,
        };
        // @ts-ignore
        const style = styles[status] || 'bg-gray-50 text-gray-700';

        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${style}`}>
                {/* @ts-ignore */}
                {icons[status]}
                {status}
            </span>
        );
    };

    return (
        <AdminLayout title="Manage Bookings">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search booking ID or guest name..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        {['All', 'Paid', 'Pending', 'Confirmed', 'Cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition ${filterStatus === status
                                        ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-900/20'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Booking ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Guest</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Package</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <AnimatePresence mode="popLayout">
                                    {filteredBookings.map((booking) => (
                                        <motion.tr
                                            key={booking.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50/80 transition group cursor-pointer"
                                            onClick={() => setSelectedBooking(booking)}
                                        >
                                            <td className="px-6 py-4 font-mono text-sm font-medium text-emerald-600">{booking.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{booking.guest}</div>
                                                <div className="text-xs text-gray-400">Verified</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{booking.pkg}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" /> {booking.date}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">Rp {booking.amount.toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={booking.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }}
                                                    className="p-2 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600 transition"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                    {filteredBookings.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            <Filter className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No bookings found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* DETAIL MODAL */}
            <Modal
                isOpen={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
                title={`Booking Detail ${selectedBooking?.id}`}
            >
                {selectedBooking && (
                    <div className="space-y-6">
                        {/* Status Header */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div>
                                <h3 className="text-sm text-gray-500 font-medium mb-1">Current Status</h3>
                                <StatusBadge status={selectedBooking.status} />
                            </div>
                            <div className="text-right">
                                <h3 className="text-sm text-gray-500 font-medium mb-1">Total Amount</h3>
                                <div className="text-xl font-black text-gray-900">Rp {selectedBooking.amount.toLocaleString('id-ID')}</div>
                            </div>
                        </div>

                        {/* Guest Info */}
                        <div>
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Guest Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-white border border-gray-100 rounded-xl">
                                    <label className="text-xs text-gray-400 block mb-1">Full Name</label>
                                    <div className="font-bold text-sm text-gray-900">{selectedBooking.guest}</div>
                                </div>
                                <div className="p-3 bg-white border border-gray-100 rounded-xl">
                                    <label className="text-xs text-gray-400 block mb-1">Phone</label>
                                    <div className="font-bold text-sm text-gray-900">{selectedBooking.phone}</div>
                                </div>
                                <div className="col-span-2 p-3 bg-white border border-gray-100 rounded-xl">
                                    <label className="text-xs text-gray-400 block mb-1">Email</label>
                                    <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                        <Mail className="w-3 h-3 text-gray-400" /> {selectedBooking.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trip Info */}
                        <div>
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" /> Trip Details</h4>
                            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-black text-emerald-900">{selectedBooking.pkg}</h5>
                                    <span className="text-xs font-bold bg-white px-2 py-1 rounded text-emerald-600">{selectedBooking.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-emerald-700/80 mb-3">
                                    <Calendar className="w-4 h-4" /> {selectedBooking.date}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-emerald-700/80">
                                    <DollarSign className="w-4 h-4" /> {selectedBooking.paymentMethod}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                            {selectedBooking.status === 'Pending' && (
                                <>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedBooking.id, 'Paid')}
                                        className="col-span-1 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                                    >
                                        Confirm Payment
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedBooking.id, 'Cancelled')}
                                        className="col-span-1 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition"
                                    >
                                        Reject / Cancel
                                    </button>
                                </>
                            )}
                            {selectedBooking.status === 'Paid' && (
                                <button
                                    onClick={() => handleUpdateStatus(selectedBooking.id, 'Confirmed')}
                                    className="col-span-2 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" /> Confirm & Send Voucher
                                </button>
                            )}
                            {selectedBooking.status === 'Confirmed' && (
                                <button className="col-span-2 py-3 rounded-xl bg-gray-100 text-gray-500 font-bold cursor-not-allowed flex items-center justify-center gap-2">
                                    <Download className="w-4 h-4" /> Download Invoice
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
