import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, CheckCircle, ArrowRight, Wallet, Bell, Settings, Star, ChevronRight, Share2, Heart, Camera, Trophy } from 'lucide-react';
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
            {/* 
        Background Layer 
        Extended height for desktop to ensure deep immersive field.
      */}
            <div className="absolute top-0 left-0 w-full h-[650px] lg:h-[750px] bg-[#022c22] z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#022c22]/50 to-slate-50"></div>
            </div>

            <div className="min-h-screen pt-28 md:pt-36 pb-20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* HERO HEADER - Desktop Optimized */}
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16 text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="w-full flex-1"
                        >
                            {/* Badge Row */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-xs font-bold uppercase tracking-widest text-emerald-300 shadow-lg">
                                    Traveler Member
                                </span>
                                <div className="flex items-center gap-2 text-amber-300 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur border border-white/10">
                                    <Trophy className="w-3.5 h-3.5 fill-amber-300" />
                                    <span className="text-xs font-bold">Top 5% Explorer</span>
                                </div>
                            </div>

                            {/* Greeting */}
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 leading-tight tracking-tight drop-shadow-xl">
                                Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">{user.name.split(' ')[0]}</span>
                                <span className="inline-block ml-3 animate-wave origin-bottom-right">👋</span>
                            </h1>
                            <p className="text-lg md:text-xl text-emerald-100/90 max-w-2xl font-medium leading-relaxed drop-shadow-md">
                                Hutan Kalimantan memanggilmu kembali. <br className="hidden md:block" />Siap untuk petualangan konservasi berikutnya?
                            </p>
                        </motion.div>

                        {/* Right Side - Avatar & Stats */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex items-center gap-6 self-start md:self-end mt-4 md:mt-0"
                        >
                            <div className="text-left md:text-right hidden sm:block">
                                <div className="text-sm text-emerald-300 font-bold uppercase tracking-wider mb-1">Total XP</div>
                                <div className="text-3xl lg:text-4xl font-black font-mono tracking-tight text-white drop-shadow-lg">2,450</div>
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAction("Membuka Profil Pengguna")}
                                className="relative cursor-pointer group"
                            >
                                <div className="absolute -inset-2 bg-emerald-500/30 rounded-full blur-xl group-hover:bg-emerald-400/50 transition duration-500"></div>
                                <img
                                    src={user.avatar}
                                    alt="Profile"
                                    className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full border-[4px] border-[#022c22] shadow-2xl object-cover ring-2 ring-emerald-500/50"
                                />
                                <div className="absolute bottom-1 right-1 w-6 h-6 lg:w-7 lg:h-7 bg-emerald-500 border-[4px] border-[#022c22] rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* MAIN CONTENT GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* LEFT COLUMN (8 cols) */}
                        <div className="lg:col-span-8 space-y-10">

                            {/* Active Trip Card - Widescreen Optimized */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <Calendar className="w-6 h-6 text-emerald-400" />
                                        <span className="drop-shadow-md">Perjalanan Aktif</span>
                                    </h2>
                                    <button className="text-emerald-300 text-sm font-bold hover:text-white transition flex items-center gap-1">
                                        Semua Jadwal <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div
                                    className="bg-white rounded-[2.5rem] p-4 lg:p-6 shadow-2xl shadow-black/20 relative group cursor-pointer hover:shadow-emerald-900/10 transition-all duration-500 border border-white/10"
                                    onClick={() => handleAction("Membuka Detail Perjalanan")}
                                >
                                    <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
                                        {/* Image Section */}
                                        <div className="w-full md:w-2/5 h-64 md:h-auto relative rounded-[2rem] overflow-hidden shadow-lg">
                                            <img src="https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" alt="Trip" />
                                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-extrabold text-emerald-800 shadow-lg flex items-center gap-1.5 ring-1 ring-emerald-500/10">
                                                <Clock className="w-3.5 h-3.5" /> 20 Feb • 4 Hari
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 flex flex-col justify-center py-2 md:py-4 pr-2">
                                            <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                                                <div>
                                                    <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2 group-hover:text-emerald-800 transition leading-tight">Eksplorasi Derawan</h3>
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                                        <MapPin className="w-4 h-4 text-emerald-500" /> Berau, East Kalimantan
                                                    </div>
                                                </div>
                                                <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-emerald-100 shadow-sm">Confirmed</span>
                                            </div>

                                            <p className="text-slate-600 text-sm lg:text-base leading-relaxed mb-8 max-w-lg">
                                                Paket eksklusif 4 Hari 3 Malam. Termasuk snorkeling dengan Whale Shark, konservasi penyu hijau, dan private boat.
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="col-span-1 bg-emerald-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-emerald-800 transition flex items-center justify-center gap-2 text-sm shadow-xl shadow-emerald-900/20"
                                                    onClick={(e) => { e.stopPropagation(); handleAction("Download E-Voucher"); }}
                                                >
                                                    <Wallet className="w-4 h-4" /> Buka E-Voucher
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="col-span-1 bg-slate-50 text-slate-700 font-bold py-4 px-6 rounded-2xl hover:bg-slate-100 transition text-sm border border-slate-200 flex items-center justify-center gap-2"
                                                    onClick={(e) => { e.stopPropagation(); handleAction("Lihat Itinerary Lengkap"); }}
                                                >
                                                    <Share2 className="w-4 h-4" /> Itinerary
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Discovery / Recommendation */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden ring-1 ring-white/20"
                            >
                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <Heart className="w-6 h-6 text-pink-500 fill-pink-500" /> Rekomendasi 2026
                                    </h3>
                                    <div className="flex gap-2">
                                        <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                                        <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"><ChevronRight className="w-5 h-5" /></button>
                                    </div>
                                </div>

                                {/* Desktop Grid / Mobile Scroll */}
                                <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-2 -mx-2 px-2 md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-3">
                                    {[1, 2, 3].map((i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ y: -8 }}
                                            className="min-w-[280px] bg-white rounded-3xl p-4 cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300"
                                            onClick={() => handleAction(`Buka Paket Rekomendasi #${i}`)}
                                        >
                                            <div className="h-44 rounded-2xl bg-gray-200 mb-4 overflow-hidden relative">
                                                <img src={`https://source.unsplash.com/random/400x300?forest,river,${i}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> 4.9
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-slate-900 text-lg mb-1 leading-tight group-hover:text-emerald-700 transition">Orangutan River Cruise</h4>
                                            <p className="text-xs text-slate-500 mb-4 flex items-center gap-1 font-medium"><MapPin className="w-3 h-3" /> Tanjung Puting</p>
                                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                                <div>
                                                    <span className="text-slate-400 text-xs line-through block">IDR 4.5jt</span>
                                                    <span className="text-emerald-700 font-black text-lg">IDR 3.5jt</span>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition shadow-sm">
                                                    <ArrowRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                        </div>

                        {/* RIGHT COLUMN (4 cols) */}
                        <div className="lg:col-span-4 space-y-8">

                            {/* Gamification Stats */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] p-8 text-white text-center relative overflow-hidden shadow-2xl shadow-emerald-500/20 cursor-pointer"
                                onClick={() => handleAction("Lihat Detail Progress")}
                            >
                                <div className="relative z-10">
                                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-3 text-emerald-100">Level Kamu</h4>
                                    <div className="text-5xl font-black mb-2 tracking-tight">Explorer</div>
                                    <p className="text-sm font-medium text-emerald-50 mb-8">Hanya 50 XP lagi untuk naik ke Elite Member!</p>

                                    <div className="w-full bg-black/20 rounded-full h-4 mb-3 p-1 backdrop-blur-sm">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1.5, ease: "easeOut" }} className="bg-gradient-to-r from-emerald-200 to-white h-2 rounded-full shadow-lg relative">
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"></div>
                                        </motion.div>
                                    </div>
                                    <div className="flex justify-between text-xs font-mono font-bold opacity-80">
                                        <span>850 XP</span>
                                        <span>1000 XP</span>
                                    </div>
                                </div>
                                <div className="absolute -right-12 -bottom-12 opacity-10 rotate-12"><Trophy className="w-64 h-64" /></div>
                            </motion.div>

                            {/* Quick Menus */}
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100/80">
                                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    Menu Cepat
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: Wallet, label: 'Voucher', action: 'Buka Voucher', color: 'text-blue-600 bg-blue-50' },
                                        { icon: Bell, label: 'Notifikasi', action: 'Buka Notifikasi', color: 'text-orange-600 bg-orange-50' },
                                        { icon: Settings, label: 'Settings', action: 'Buka Pengaturan', color: 'text-slate-600 bg-slate-50' },
                                        { icon: History, label: 'Riwayat', action: 'Buka Riwayat', color: 'text-purple-600 bg-purple-50' }
                                    ].map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleAction(item.action)}
                                            className="flex flex-col items-center justify-center gap-3 p-5 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                        >
                                            <div className={`p-3 rounded-2xl ${item.color} group-hover:scale-110 transition duration-300`}>
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{item.label}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* History List */}
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100/80">
                                <h3 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
                                    <span>Riwayat Terakhir</span>
                                </h3>
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ x: 5 }}
                                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition cursor-pointer"
                                            onClick={() => handleAction("Detail Riwayat")}
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                                <CheckCircle className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900 text-sm">Mahakam Safari</h4>
                                                <p className="text-xs text-slate-400 mt-1">12 Jan 2025</p>
                                            </div>
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

// Helper icon for map
const History = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
    </svg>
)
