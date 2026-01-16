import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, CheckCircle, ArrowRight, Wallet, Bell, Settings, Star, ChevronRight, Share2, Heart, Camera, Trophy, User, LogOut, FileText, CreditCard } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui';
import Modal from '@/components/ui/Modal';

export default function ClientDashboard() {
    const { user, logout, isAuthenticated } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();
    const [activeModal, setActiveModal] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) router.push('/login');
        if (user && user.role !== 'client') router.push(`/dashboard/${user.role}`);
    }, [isAuthenticated, user, router]);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        router.push('/login');
        addToast('Berhasil logout!', 'success');
    };

    return (
        <Layout title={`Dashboard ${user.name} - BorneoTrip`}>
            {/* Background Layer */}
            <div className="absolute top-0 left-0 w-full h-[550px] lg:h-[700px] bg-[#022c22] z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#022c22]/60 to-slate-50"></div>
            </div>

            <div className="min-h-screen pt-24 md:pt-36 pb-20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* HERO HEADER */}
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16 text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex-1"
                        >
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-xs font-bold uppercase tracking-widest text-emerald-300 shadow-lg">
                                    Traveler Member
                                </span>
                                <div className="flex items-center gap-2 text-amber-300 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur border border-white/10">
                                    <Trophy className="w-3.5 h-3.5 fill-amber-300" />
                                    <span className="text-xs font-bold">Top 5% Explorer</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 leading-tight tracking-tight drop-shadow-xl">
                                Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">{user.name.split(' ')[0]}</span>
                                <span className="inline-block ml-3 animate-wave origin-bottom-right">👋</span>
                            </h1>
                            <p className="text-lg md:text-xl text-emerald-100/90 max-w-2xl font-medium leading-relaxed drop-shadow-md">
                                Hutan Kalimantan memanggilmu kembali. <br className="hidden md:block" />Siap untuk petualangan konservasi berikutnya?
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-6 self-start md:self-end mt-4 md:mt-0"
                        >
                            <div className="text-left md:text-right hidden sm:block">
                                <div className="text-sm text-emerald-300 font-bold uppercase tracking-wider mb-1">Total XP</div>
                                <div className="text-3xl lg:text-4xl font-black font-mono tracking-tight text-white drop-shadow-lg">2,450</div>
                            </div>
                            <motion.div
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveModal('profile')}
                                className="relative cursor-pointer group"
                            >
                                <div className="absolute -inset-2 bg-emerald-500/30 rounded-full blur-xl group-hover:bg-emerald-400/50 transition duration-500"></div>
                                <img
                                    src={user.avatar}
                                    alt="Profile"
                                    className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full border-[4px] border-[#022c22] shadow-2xl object-cover ring-2 ring-emerald-500/50"
                                />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* LEFT COLUMN (8 cols) */}
                        <div className="lg:col-span-8 space-y-10">

                            {/* Active Trip Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <Calendar className="w-6 h-6 text-emerald-400" />
                                        <span className="drop-shadow-md">Perjalanan Aktif</span>
                                    </h2>
                                </div>

                                <div
                                    className="bg-white rounded-[2.5rem] p-4 lg:p-6 shadow-2xl shadow-black/20 relative group cursor-pointer hover:shadow-emerald-900/10 transition-all duration-500 border border-white/10"
                                    onClick={(e) => {
                                        // Prevent modal open if clicking buttons inside
                                        if ((e.target as HTMLElement).closest('button')) return;
                                        setActiveModal('trip_detail');
                                    }}
                                >
                                    <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
                                        <div className="w-full md:w-2/5 h-64 md:h-auto relative rounded-[2rem] overflow-hidden shadow-lg">
                                            <img src="https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" alt="Trip" />
                                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-extrabold text-emerald-800 shadow-lg flex items-center gap-1.5 ring-1 ring-emerald-500/10">
                                                <Clock className="w-3.5 h-3.5" /> 20 Feb • 4 Hari
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col justify-center py-2 md:py-4 pr-2">
                                            <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                                                <div>
                                                    <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2 leading-tight">Eksplorasi Derawan</h3>
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                                        <MapPin className="w-4 h-4 text-emerald-500" /> Berau, East Kalimantan
                                                    </div>
                                                </div>
                                                <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-emerald-100 shadow-sm">Confirmed</span>
                                            </div>

                                            <p className="text-slate-600 text-sm lg:text-base leading-relaxed mb-8 max-w-lg">
                                                Paket eksklusif 4 Hari 3 Malam. Termasuk snorkeling dengan Whale Shark dan konservasi penyu hijau.
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    className="bg-emerald-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-emerald-800 transition flex items-center justify-center gap-2 text-sm shadow-xl shadow-emerald-900/20"
                                                    onClick={() => setActiveModal('voucher')}
                                                >
                                                    <Wallet className="w-4 h-4" /> Buka E-Voucher
                                                </motion.button>
                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    className="bg-slate-50 text-slate-700 font-bold py-4 px-6 rounded-2xl hover:bg-slate-100 transition text-sm border border-slate-200 flex items-center justify-center gap-2"
                                                    onClick={() => setActiveModal('itinerary')}
                                                >
                                                    <Share2 className="w-4 h-4" /> Sharing
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Recommendations - Solid Background for Visibility */}
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <Heart className="w-6 h-6 text-pink-500 fill-pink-500" /> Rekomendasi 2026
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map((i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ y: -8 }}
                                            className="bg-slate-50 rounded-3xl p-4 cursor-pointer group hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100"
                                            onClick={() => router.push(`/packages/${i}`)}
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
                                                <span className="text-emerald-700 font-black text-lg">IDR 3.5jt</span>
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Gamification */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] p-8 text-white text-center relative overflow-hidden shadow-2xl shadow-emerald-500/20"
                            >
                                <div className="relative z-10">
                                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-3 text-emerald-100">Level Kamu</h4>
                                    <div className="text-5xl font-black mb-2 tracking-tight">Explorer</div>
                                    <p className="text-sm font-medium text-emerald-50 mb-8">Hanya 50 XP lagi untuk naik ke Elite Member!</p>
                                    <div className="w-full bg-black/20 rounded-full h-4 mb-3 p-1 backdrop-blur-sm">
                                        <div className="bg-gradient-to-r from-emerald-200 to-white h-2 rounded-full shadow-lg w-[85%]"></div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Menu Grid */}
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100/80">
                                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">Menu Cepat</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: Wallet, label: 'Voucher', id: 'voucher', color: 'text-blue-600 bg-blue-50' },
                                        { icon: Bell, label: 'Notifikasi', id: 'notification', color: 'text-orange-600 bg-orange-50' },
                                        { icon: Settings, label: 'Settings', id: 'profile', color: 'text-slate-600 bg-slate-50' },
                                        { icon: Share2, label: 'Support', id: 'support', color: 'text-purple-600 bg-purple-50' }
                                    ].map((item: any, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setActiveModal(item.id)}
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
                        </div>

                    </div>
                </div>
            </div>

            {/* MODALS */}
            {/* 1. Voucher Modal */}
            <Modal isOpen={activeModal === 'voucher'} onClose={() => setActiveModal(null)} title="E-Voucher Anda">
                <div className="text-center">
                    <div className="bg-slate-50 p-6 rounded-2xl mb-6 border border-slate-100">
                        <div className="w-48 h-48 bg-white mx-auto rounded-xl p-2 border border-slate-200">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BorneoTrip-Booking-123" className="w-full h-full" alt="QR Code" />
                        </div>
                        <p className="mt-4 font-mono text-lg font-bold text-slate-900 tracking-widest">BK-8829-DIAN</p>
                        <p className="text-sm text-slate-500">Tunjukkan QR ini kepada guide saat penjemputan.</p>
                    </div>
                    <button onClick={() => { addToast('Voucher diunduh', 'success'); setActiveModal(null); }} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl">Unduh PDF</button>
                </div>
            </Modal>

            {/* 2. Notification Modal */}
            <Modal isOpen={activeModal === 'notification'} onClose={() => setActiveModal(null)} title="Notifikasi">
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0"><Bell className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Pembayaran Berhasil</h4>
                                <p className="text-xs text-slate-500 mt-1">Pembayaran untuk trip Derawan telah dikonfirmasi. Selamat berlibur!</p>
                                <p className="text-[10px] text-slate-400 mt-2">2 Jam yang lalu</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>

            {/* 3. Profile/Settings Modal */}
            <Modal isOpen={activeModal === 'profile'} onClose={() => setActiveModal(null)} title="Pengaturan Profil">
                <div className="flex flex-col items-center mb-6">
                    <img src={user.avatar} className="w-24 h-24 rounded-full mb-4 border-4 border-slate-100" />
                    <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                    <p className="text-slate-500">{user.email}</p>
                </div>
                <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 font-bold text-slate-700 text-sm transition">
                        <User className="w-5 h-5" /> Edit Profil
                    </button>
                    <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 font-bold text-slate-700 text-sm transition">
                        <CreditCard className="w-5 h-5" /> Metode Pembayaran
                    </button>
                    <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 font-bold text-slate-700 text-sm transition">
                        <FileText className="w-5 h-5" /> Riwayat Transaksi
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 rounded-xl bg-red-50 hover:bg-red-100 font-bold text-red-600 text-sm transition mt-4">
                        <LogOut className="w-5 h-5" /> Keluar Akun
                    </button>
                </div>
            </Modal>

            {/* 4. Support Modal */}
            <Modal isOpen={activeModal === 'support'} onClose={() => setActiveModal(null)} title="Bantuan CS">
                <div className="text-center p-8">
                    <p className="mb-6 text-slate-600">Butuh bantuan mendesak untuk perjalananmu?</p>
                    <button className="w-full bg-green-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 mb-3">
                        Chat WhatsApp
                    </button>
                    <button className="w-full bg-slate-100 text-slate-900 font-bold py-4 rounded-xl">
                        Email Support
                    </button>
                </div>
            </Modal>

        </Layout>
    );
}
