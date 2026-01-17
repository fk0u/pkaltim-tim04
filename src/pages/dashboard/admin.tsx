import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Users, DollarSign, Package, TrendingUp, MoreHorizontal, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { PACKAGES } from '@/data/mockData';

export default function AdminDashboard() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) router.push('/login');
        if (user && user.role !== 'admin' && user.role !== 'operator') router.push(`/dashboard/client`);
    }, [isAuthenticated, user, router]);

    if (!user) return null;

    const stats = [
        { label: 'Total Booking', val: '124', icon: Package, color: 'blue' },
        { label: 'Pendapatan', val: 'Rp 450M', icon: DollarSign, color: 'emerald' },
        { label: 'User Baru', val: '1,203', icon: Users, color: 'orange' },
        { label: 'Growth', val: '+12.5%', icon: TrendingUp, color: 'purple' },
    ];

    const recentBookings = [
        { id: '#BK-001', guest: 'Budi Santoso', pkg: PACKAGES[0]?.title || 'Derawan Paradise', date: '20 Feb', status: 'Paid', amount: 'Rp 5.200.000' },
        { id: '#BK-002', guest: 'Sarah Jenkins', pkg: PACKAGES[1]?.title || 'Orangutan Tour', date: '22 Feb', status: 'Pending', amount: 'Rp 8.500.000' },
        { id: '#BK-003', guest: 'Ahmad Dani', pkg: PACKAGES[2]?.title || 'Mahakam Safari', date: '25 Feb', status: 'Paid', amount: 'Rp 4.100.000' },
        { id: '#BK-004', guest: 'Rina Nose', pkg: PACKAGES[0]?.title || 'Kakaban Trip', date: '28 Feb', status: 'Pending', amount: 'Rp 3.500.000' },
    ];

    return (
        <AdminLayout title="Overview">
            <div className="max-w-7xl mx-auto">
                {/* Unique Welcome Banner */}
                <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 text-white mb-10 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10">
                        <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#FFFFFF" d="M47.7,-61.4C60.9,-51.1,69.9,-34.7,73.4,-17.8C76.9,-0.8,74.9,16.7,66.3,30.8C57.7,44.9,42.5,55.6,26.5,62.3C10.5,69,-6.4,71.7,-21.8,66.8C-37.2,61.9,-51.1,49.4,-60.8,34.4C-70.5,19.4,-75.9,1.9,-72.6,-13.7C-69.2,-29.3,-57.1,-43,-43.3,-53.1C-29.4,-63.3,-14.7,-69.9,1.3,-71.4C17.3,-73,34.5,-69.5,47.7,-61.4Z" transform="translate(100 100)" />
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-2">Selamat Datang, {user.name} 👋</h2>
                        <p className="text-emerald-100 max-w-xl">Laporan hari ini menunjukkan <span className="font-bold text-white">+12% kenaikan traffic</span>. Cek booking terbaru yang membutuhkan konfirmasi Anda.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center text-${stat.color}-600`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>+2.5%</span>
                            </div>
                            <div className="text-3xl font-black text-gray-900 mb-1">{stat.val}</div>
                            <div className="text-sm font-bold text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Bookings Table */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Booking Terbaru</h2>
                            <p className="text-sm text-gray-500 mt-1">5 Transaksi terakhir yang masuk ke sistem.</p>
                        </div>
                        <button className="text-sm font-bold text-white bg-gray-900 px-4 py-2 rounded-lg hover:bg-black transition">Export Data</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">ID Booking</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Tamu</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Paket</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentBookings.map((booking, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/80 transition group">
                                        <td className="px-8 py-5 font-mono text-sm font-medium text-emerald-600">{booking.id}</td>
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-gray-900">{booking.guest}</div>
                                            <div className="text-xs text-gray-400">Verified User</div>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-gray-600">
                                            <div className="font-medium text-gray-900">{booking.pkg}</div>
                                            <div className="text-xs text-gray-400">{booking.date}</div>
                                        </td>
                                        <td className="px-8 py-5 font-bold text-gray-900">{booking.amount}</td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${booking.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-orange-50 text-orange-700 ring-orange-600/20'}`}>
                                                {booking.status === 'Paid' ? <CheckCircle className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>}
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <button className="p-2 hover:bg-gray-200 rounded-lg transition text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
