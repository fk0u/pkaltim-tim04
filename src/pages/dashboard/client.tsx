import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, CheckCircle, ArrowRight, Wallet, Bell, Settings, Star } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ClientDashboard() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) router.push('/login');
        if (user && user.role !== 'client') router.push(`/dashboard/${user.role}`);
    }, [isAuthenticated, user, router]);

    if (!user) return null;

    return (
        <Layout title={`Dashboard ${user.name} - BorneoTrip`}>
            {/* 
         FIX: Background Layer 
         We use 'fixed' to ensure it stays put and covers the top area.
         z-0 puts it behind the content (which is z-10).
      */}
            <div className="fixed top-0 left-0 w-full h-[50vh] bg-[#022c22] z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#022c22]/90"></div>
            </div>

            <div className="min-h-screen pt-32 pb-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* HER0 HEADER */}
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12 text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-emerald-300">
                                    Traveler Member
                                </span>
                                <div className="flex items-center gap-1 text-amber-400">
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    <span className="text-xs font-bold">4.9 Explorer</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
                                Halo, <span className="text-emerald-400">{user.name.split(' ')[0]}</span>
                                <span className="text-4xl ml-2">👋</span>
                            </h1>
                            <p className="text-lg text-emerald-100/80 max-w-xl font-medium leading-relaxed">
                                Hutan Kalimantan memanggilmu kembali. Ada 3 destinasi konservasi baru yang menunggumu.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-6"
                        >
                            <div className="text-right hidden md:block">
                                <div className="text-sm text-emerald-300 font-bold uppercase tracking-wider mb-1">Total Poin</div>
                                <div className="text-3xl font-black">2,450 XP</div>
                            </div>
                            <div className="relative group cursor-pointer">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                                <img
                                    src={user.avatar}
                                    alt="Profile"
                                    className="relative w-20 h-20 rounded-full border-4 border-[#022c22] shadow-2xl object-cover"
                                />
                                <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-4 border-[#022c22] rounded-full"></div>
                            </div>
                        </motion.div>
                    </div>

                    {/* MAIN CONTENT GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN (Active Trip & Discovery) */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Active Trip Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-emerald-400" /> Perjalanan Aktif
                                    </h2>
                                </div>

                                <div className="bg-white rounded-[2rem] p-2 shadow-2xl shadow-black/20 overflow-hidden relative group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="w-full md:w-48 h-48 relative rounded-[1.5rem] overflow-hidden m-2">
                                            <img src="https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="Trip" />
                                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-emerald-800">20 Feb 2026</div>
                                        </div>

                                        <div className="flex-1 py-4 pr-6 flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-2xl font-black text-gray-900 mb-1">Eksplorasi Derawan</h3>
                                                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                                                        <MapPin className="w-4 h-4" /> Berau, Kalimantan Timur
                                                    </div>
                                                </div>
                                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Confirmed</span>
                                            </div>

                                            <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                                                Paket 4 Hari 3 Malam. Termasuk snorkeling, konservasi penyu, dan homestay lokal.
                                            </p>

                                            <div className="flex gap-3">
                                                <button className="flex-1 bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-800 transition shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 text-sm">
                                                    <Wallet className="w-4 h-4" /> Lihat E-Voucher
                                                </button>
                                                <button className="flex-1 bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-100 transition border border-gray-200 text-sm">
                                                    Itinerary Detail
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Discovery / Recommendation */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-8"
                            >
                                <h3 className="text-xl font-bold text-white mb-6">Rekomendasi Spesial Untukmu</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="bg-white rounded-2xl p-4 hover:scale-[1.02] transition duration-300 cursor-pointer group">
                                            <div className="h-32 rounded-xl bg-gray-200 mb-4 overflow-hidden relative">
                                                <img src={`https://source.unsplash.com/random/400x300?nature,${i}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-1">Orangutan Sanctuary</h4>
                                            <p className="text-xs text-gray-500 mb-3">Tanjung Puting, Kalteng</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-emerald-600 font-bold text-sm">IDR 3.5jt</span>
                                                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 transition" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                        </div>

                        {/* RIGHT COLUMN (History & Stats) */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Quick Actions */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-emerald-500 rounded-2xl p-4 text-white hover:bg-emerald-400 transition cursor-pointer text-center">
                                    <Wallet className="w-6 h-6 mx-auto mb-2" />
                                    <div className="font-bold text-sm">Vouchers</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 text-white hover:bg-white/20 transition cursor-pointer text-center">
                                    <Settings className="w-6 h-6 mx-auto mb-2" />
                                    <div className="font-bold text-sm">Settings</div>
                                </div>
                            </div>

                            {/* History Card */}
                            <div className="bg-white rounded-3xl p-6 shadow-xl">
                                <h3 className="font-bold text-gray-900 mb-6 flex items-center justify-between">
                                    <span>Riwayat</span>
                                    <span className="text-xs text-emerald-600 font-bold cursor-pointer hover:underline">Lihat Semua</span>
                                </h3>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">Mahakam Safari</h4>
                                                <p className="text-xs text-gray-400 mt-0.5">12 Jan 2025</p>
                                                <div className="mt-1 text-xs font-bold text-emerald-600">Selesai</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notification Card */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <Bell className="w-5 h-5" />
                                        <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">Promo Exclusive!</h4>
                                    <p className="text-indigo-100 text-sm mb-4">Dapatkan diskon 15% untuk trip ke IKN minggu depan.</p>
                                    <button className="w-full bg-white text-indigo-700 font-bold py-2 rounded-xl text-sm hover:bg-indigo-50 transition">Cek Promo</button>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </Layout>
    );
}
