import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, CheckCircle, ArrowRight, Wallet, Bell, Settings, Star, ChevronRight, Share2, Heart, Camera } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useToast } from '@/components/ui';

export default function ClientDashboard() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();

    useEffect(() => {
        if (!isAuthenticated) router.push('/login');
        if (user && user.role !== 'client') router.push(`/dashboard/${user.role}`);
    }, [isAuthenticated, user, router]);

    if (!user) return null;

    const handleAction = (action: string) => {
        addToast(action, "success");
    };

    return (
        <Layout title={`Dashboard ${user.name} - BorneoTrip`}>
            {/* Background Layer */}
            <div className="absolute top-0 left-0 w-full h-[550px] md:h-[600px] bg-[#022c22] z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-slate-50"></div>
            </div>

            <div className="min-h-screen pt-24 md:pt-32 pb-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* HER0 HEADER - Responsive Layout */}
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex-1"
                        >
                            {/* Badge Row */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-300 shadow-lg">
                                    Traveler Member
                                </span>
                                <div className="flex items-center gap-1 text-amber-400 bg-black/20 px-2.5 py-1 rounded-full backdrop-blur border border-white/5">
                                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                                    <span className="text-[10px] md:text-xs font-bold">4.9 Explorer</span>
                                </div>
                            </div>

                            {/* Greeting */}
                            <h1 className="text-4xl md:text-6xl font-black mb-3 leading-tight tracking-tight">
                                Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">{user.name.split(' ')[0]}</span>
                                <span className="inline-block ml-2 text-3xl md:text-5xl animate-bounce">👋</span>
                            </h1>
                            <p className="text-base md:text-lg text-emerald-100/90 max-w-xl font-medium leading-relaxed">
                                Hutan Kalimantan memanggilmu. Ada 3 destinasi konservasi baru yang menunggumu.
                            </p>
                        </motion.div>

                        {/* Right Side - Avatar & Stats (Stacked on mobile, Inline on desktop) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-4 md:gap-6 self-start md:self-end mt-4 md:mt-0"
                        >
                            <div className="text-left md:text-right">
                                <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider mb-0.5">Total Poin</div>
                                <div className="text-2xl md:text-3xl font-black font-mono tracking-tight">2,450 XP</div>
                            </div>

                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAction("Membuka Profil Pengguna")}
                                className="relative cursor-pointer"
                            >
                                <div className="absolute -inset-2 bg-emerald-500/30 rounded-full blur-lg animate-pulse"></div>
                                <img
                                    src={user.avatar}
                                    alt="Profile"
                                    className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-[3px] border-[#022c22] shadow-2xl object-cover ring-2 ring-emerald-500/50"
                                />
                                <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-[3px] border-[#022c22] rounded-full flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* MAIN CONTENT GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Active Trip Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mb-4">
                                    <Calendar className="w-5 h-5 text-emerald-400" /> Perjalanan Aktif
                                </h2>

                                <div
                                    className="bg-white rounded-[2rem] p-4 shadow-xl shadow-black/10 overflow-hidden relative group cursor-pointer"
                                    onClick={() => handleAction("Membuka Detail Perjalanan")}
                                >
                                    <div className="flex flex-col md:flex-row gap-5">
                                        {/* Image Section */}
                                        <div className="w-full md:w-1/3 h-52 md:h-auto relative rounded-2xl overflow-hidden shadow-sm">
                                            <img src="https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="Trip" />
                                            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-extrabold text-emerald-800 shadow-sm flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> 20 Feb - 4 Hari
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-emerald-700 transition">Eksplorasi Derawan</h3>
                                                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                                                        <MapPin className="w-4 h-4 text-emerald-500" /> Berau, Kalimantan Timur
                                                    </div>
                                                </div>
                                                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-emerald-100">Paid</span>
                                            </div>

                                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                                Paket 4H3M. Snorkeling Whale Shark, Konservasi Penyu, & Hidden Lagoon.
                                            </p>

                                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                                <button
                                                    className="col-span-1 bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-800 transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-900/20"
                                                    onClick={(e) => { e.stopPropagation(); handleAction("Download E-Voucher"); }}
                                                >
                                                    <Wallet className="w-4 h-4" /> E-Voucher
                                                </button>
                                                <button
                                                    className="col-span-1 bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-200 transition text-sm"
                                                    onClick={(e) => { e.stopPropagation(); handleAction("Share Itinerary"); }}
                                                >
                                                    <Share2 className="w-4 h-4" /> Share
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Discovery Carousel (Horizontal Scroll on Mobile) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 relative overflow-hidden"
                            >
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-pink-500 fill-pink-500" /> Rekomendasi 2026
                                </h3>

                                {/* Scroll Container */}
                                <div className="flex overflow-x-auto gap-4 pb-4 -mx-2 px-2 snap-x hide-scrollbar">
                                    {[1, 2, 3].map((i) => (
                                        <motion.div
                                            key={i}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleAction(`Buka Paket Rekomendasi ${i}`)}
                                            className="min-w-[280px] md:min-w-[300px] bg-white rounded-2xl p-3 snap-center cursor-pointer group shadow-lg"
                                        >
                                            <div className="h-40 rounded-xl bg-gray-200 mb-4 overflow-hidden relative">
                                                <img src={`https://source.unsplash.com/random/400x300?jungle,${i}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                                                    <Camera className="w-3 h-3" /> Popular
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-slate-900 text-lg mb-1 leading-tight">Orangutan Sanctuary</h4>
                                            <p className="text-xs text-slate-500 mb-3 flex items-center gap-1"><Clock className="w-3 h-3" /> 3 Hari 2 Malam</p>
                                            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                                                <span className="text-emerald-700 font-bold text-sm">IDR 3.500k</span>
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Gamification Stats */}
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-6 text-white text-center relative overflow-hidden shadow-xl" onClick={() => handleAction("Lihat Detail Progress")}>
                                <div className="relative z-10">
                                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Level Kamu</h4>
                                    <div className="text-4xl font-black mb-1">Explorer</div>
                                    <p className="text-sm opacity-90 mb-6">50 XP lagi menuju Elite!</p>
                                    <div className="w-full bg-black/20 rounded-full h-3 mb-2">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="bg-white h-3 rounded-full shadow-lg"></motion.div>
                                    </div>
                                    <p className="text-xs font-mono opacity-70">850 / 1000 XP</p>
                                </div>
                                <div className="absolute -right-10 -bottom-10 opacity-20"><Settings className="w-48 h-48 animate-spin-slow" /></div>
                            </div>

                            {/* Quick Menus */}
                            <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100">
                                <h3 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
                                    <span>Menu Cepat</span>
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: Wallet, label: 'Voucher', action: 'Buka Voucher' },
                                        { icon: Bell, label: 'Notifikasi', action: 'Buka Notifikasi' },
                                        { icon: Settings, label: 'Settings', action: 'Buka Pengaturan' },
                                        { icon: CheckCircle, label: 'Riwayat', action: 'Buka Riwayat' }
                                    ].map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleAction(item.action)}
                                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-700 transition cursor-pointer"
                                        >
                                            <item.icon className="w-6 h-6" />
                                            <span className="text-xs font-bold">{item.label}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </Layout>
    );
}
