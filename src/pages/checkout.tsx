import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useToast } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, ShieldCheck, User, Calendar, Users, MapPin, BadgeCheck, Banknote, Wallet, Building2, QrCode } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { user, login } = useAuth();
    const { addBooking } = useBooking();
    const { addToast } = useToast();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedBank, setSelectedBank] = useState('bca');

    const { pkg, date, pax, price, id, location, image } = router.query;

    const pkgName = pkg ? (pkg as string) : "Paket Wisata";
    const totalPrice = price ? parseInt(price as string) : 0;
    const pkgImage = image ? (image as string) : "https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80";
    const bookingId = `BK-${Math.floor(Math.random() * 1000000)}`;

    const handlePayment = () => {
        if (!user) {
            addToast("Silakan login terlebih dahulu", "error");
            router.push('/login');
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            addBooking({
                userId: user.id || 'guest',
                userName: user.name,
                packageId: (id as string) || 'PKG-CUSTOM',
                pkgTitle: pkgName,
                pkgImage: pkgImage,
                location: (location as string) || 'East Kalimantan',
                date: (date as string) || new Date().toISOString(),
                pax: Number(pax) || 1,
                totalPrice: totalPrice || 0,
            });

            setIsProcessing(false);
            setStep(3);
            addToast("Pembayaran Berhasil! Booking terkonfirmasi.", "success");
        }, 2000);
    };

    const steps = [
        { num: 1, label: "Data Pemesan" },
        { num: 2, label: "Pembayaran" },
        { num: 3, label: "Selesai" }
    ];

    return (
        <Layout title="Checkout - BorneoTrip">
            <div className="min-h-screen bg-gray-50 pt-32 pb-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Enhanced Stepper */}
                    <div className="mb-12">
                        <div className="flex justify-center items-center space-x-4 md:space-x-12 relative max-w-3xl mx-auto">
                            {/* Connector Line */}
                            <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-gray-200 -z-10 rounded-full"></div>
                            <div 
                                className="absolute top-5 left-[10%] h-1 bg-emerald-500 -z-10 rounded-full transition-all duration-700 ease-in-out" 
                                style={{ width: step === 1 ? '0%' : step === 2 ? '40%' : '80%' }}
                            ></div>

                            {steps.map((s) => (
                                <div key={s.num} className="flex flex-col items-center gap-2">
                                    <div 
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ring-4 z-10 
                                            ${step >= s.num 
                                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 ring-emerald-50' 
                                                : 'bg-white text-gray-400 ring-gray-50 border border-gray-200'}`}
                                    >
                                        {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                                    </div>
                                    <span className={`text-xs md:text-sm font-bold transition-colors duration-300 ${step >= s.num ? 'text-emerald-800' : 'text-gray-400'}`}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Interaction Area */}
                        <div className="lg:col-span-2 space-y-6">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100"
                                    >
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">Siapa yang berangkat?</h2>
                                                <p className="text-sm text-gray-500">Isi data diri untuk E-Ticket.</p>
                                            </div>
                                        </div>

                                        {!user ? (
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl mb-8 border border-blue-100">
                                                <div className="flex gap-4">
                                                    <div className="bg-white p-2 rounded-lg shadow-sm h-fit">
                                                        <User className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 mb-1">Anda belum login</h3>
                                                        <p className="text-sm text-gray-600 mb-4">Masuk untuk menyimpan riwayat pesanan dan mendapatkan poin.</p>
                                                        <button 
                                                            onClick={() => login('client')} 
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition shadow-lg shadow-blue-200"
                                                        >
                                                            Login Sekarang
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mb-8 flex items-center gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                                                <img src={user.avatar} className="w-12 h-12 rounded-full ring-2 ring-white" />
                                                <div>
                                                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Logged in as</p>
                                                    <p className="font-bold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                                <div className="ml-auto">
                                                    <BadgeCheck className="w-6 h-6 text-emerald-500" />
                                                </div>
                                            </div>
                                        )}

                                        <form className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Depan</label>
                                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition" defaultValue={user?.name.split(' ')[0]} placeholder="Contoh: Budi" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Belakang</label>
                                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition" defaultValue={user?.name.split(' ')[1]} placeholder="Contoh: Santoso" />
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email (E-Ticket)</label>
                                                    <input type="email" readOnly={!!user} className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3.5 font-medium text-gray-500 cursor-not-allowed" defaultValue={user?.email || ''} placeholder="email@contoh.com" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">No. WhatsApp</label>
                                                    <input type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition" placeholder="+62 812..." />
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Permintaan Khusus (Opsional)</label>
                                                <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition h-24 resize-none" placeholder="Contoh: Saya alergi seafood, tolong sediakan menu ayam." />
                                            </div>

                                            <div className="pt-6">
                                                <button type="button" onClick={() => setStep(2)} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition flex items-center justify-center gap-3 shadow-lg shadow-gray-200 hover:shadow-xl hover:scale-[1.01]">
                                                    Lanjut ke Pembayaran <ArrowLeft className="w-4 h-4 rotate-180" />
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100"
                                    >
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                <Wallet className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">Metode Pembayaran</h2>
                                                <p className="text-sm text-gray-500">Pilih metode yang paling nyaman untuk Anda.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6 mb-8">
                                            {/* Virtual Account Group */}
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pl-1">Virtual Account</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {[
                                                        { id: 'bca', label: 'BCA Virtual Account', icon: <Building2 className="w-5 h-5"/> },
                                                        { id: 'mandiri', label: 'Mandiri VA', icon: <Building2 className="w-5 h-5"/> },
                                                        { id: 'bni', label: 'BNI Virtual Account', icon: <Building2 className="w-5 h-5"/> }
                                                    ].map((bank) => (
                                                        <div 
                                                            key={bank.id}
                                                            onClick={() => setSelectedBank(bank.id)}
                                                            className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden group
                                                                ${selectedBank === bank.id 
                                                                    ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500' 
                                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                                        >
                                                            <div className={`p-2 rounded-lg mr-3 ${selectedBank === bank.id ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                                                {bank.icon}
                                                            </div>
                                                            <span className={`font-bold text-sm ${selectedBank === bank.id ? 'text-emerald-900' : 'text-gray-700'}`}>{bank.label}</span>
                                                            {selectedBank === bank.id && (
                                                                <div className="absolute top-0 right-0 p-1.5 bg-emerald-500 rounded-bl-xl">
                                                                    <CheckCircle className="w-3 h-3 text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* E-Wallet Group */}
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pl-1">E-Wallet</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {[
                                                        { id: 'gopay', label: 'GoPay', icon: <Wallet className="w-5 h-5"/> },
                                                        { id: 'qris', label: 'QRIS', icon: <QrCode className="w-5 h-5"/> }
                                                    ].map((wallet) => (
                                                        <div 
                                                            key={wallet.id}
                                                            onClick={() => setSelectedBank(wallet.id)}
                                                            className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden group
                                                                ${selectedBank === wallet.id 
                                                                    ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500' 
                                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                                        >
                                                            <div className={`p-2 rounded-lg mr-3 ${selectedBank === wallet.id ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                                                {wallet.icon}
                                                            </div>
                                                            <span className={`font-bold text-sm ${selectedBank === wallet.id ? 'text-emerald-900' : 'text-gray-700'}`}>{wallet.label}</span>
                                                            {selectedBank === wallet.id && (
                                                                <div className="absolute top-0 right-0 p-1.5 bg-emerald-500 rounded-bl-xl">
                                                                    <CheckCircle className="w-3 h-3 text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-4 rounded-xl mb-8 border border-gray-100">
                                            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                                            <p>Data Anda diamankan dengan enkripsi SSL 256-bit. Kami tidak menyimpan informasi kartu kredit Anda.</p>
                                        </div>

                                        <div className="flex gap-4">
                                            <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-gray-100 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-200 transition">
                                                Kembali
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={handlePayment} 
                                                disabled={isProcessing} 
                                                className="w-2/3 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isProcessing ? (
                                                    // Simple Loading Spinner
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        <Banknote className="w-5 h-5" />
                                                        Bayar IDR {totalPrice.toLocaleString('id-ID')}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white p-8 md:p-14 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden"
                                    >
                                        {/* Background decoration */}
                                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

                                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50">
                                            <CheckCircle className="w-12 h-12 text-emerald-600" />
                                        </div>
                                        
                                        <h2 className="text-3xl font-black text-gray-900 mb-2">Pembayaran Berhasil!</h2>
                                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Selamat! Perjalanan Anda ke <span className="font-bold text-gray-900">{location || 'Kalimantan Timur'}</span> telah terkonfirmasi. E-Ticket telah dikirim ke email Anda.</p>

                                        <div className="bg-gray-50 rounded-2xl p-6 mb-8 max-w-md mx-auto border border-dashed border-gray-300 relative">
                                            <div className="absolute -left-3 top-1/2 -mt-3 w-6 h-6 bg-white rounded-full border-r border-gray-300"></div>
                                            <div className="absolute -right-3 top-1/2 -mt-3 w-6 h-6 bg-white rounded-full border-l border-gray-300"></div>
                                            
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">BOOKING ID</p>
                                            <p className="text-2xl font-mono font-bold text-gray-900 tracking-wider">{bookingId}</p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                                            <Link href="/dashboard/client" className="px-8 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2">
                                                <User className="w-4 h-4" /> Ke Dashboard
                                            </Link>
                                            <Link href="/" className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
                                                Kembali ke Home <ArrowLeft className="w-4 h-4 rotate-180" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary Sidebar - Enhanced */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 space-y-6">
                                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-pink-500"></div>
                                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <BadgeCheck className="w-5 h-5 text-orange-500" />
                                        Ringkasan Pesanan
                                    </h3>

                                    {/* Package Card Tiny */}
                                    <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                                        <img src={pkgImage} className="w-20 h-20 rounded-xl object-cover shadow-sm bg-gray-200" />
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold mb-1">PAKET WISATA</p>
                                            <h4 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{pkgName}</h4>
                                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                                <MapPin className="w-3 h-3" /> {location || 'East Kalimantan'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <p className="text-sm text-gray-600">Tanggal</p>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">{date ? new Date(date as string).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <p className="text-sm text-gray-600">Peserta</p>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">{pax || 1} Orang</p>
                                        </div>
                                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500">Durasi</p>
                                            <p className="font-bold text-gray-900 text-xs text-right">3 Hari 2 Malam<br/><span className="text-emerald-600 font-normal">Termasuk Hotel</span></p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end pt-4 border-t-2 border-dashed border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Total Pembayaran</p>
                                            <p className="text-xs text-emerald-600 font-bold">Termasuk Pajak</p>
                                        </div>
                                        <span className="font-black text-gray-900 text-2xl">IDR {(totalPrice / 1000).toLocaleString('id-ID')}<span className="text-base text-gray-500 font-bold">.000</span></span>
                                    </div>
                                </div>
                                
                                {/* Trust Badges */}
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center gap-2 text-xs font-bold text-gray-500">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> Garansi Aman
                                     </div>
                                     <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center gap-2 text-xs font-bold text-gray-500">
                                        <Users className="w-4 h-4 text-blue-500" /> 24/7 Support
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
}
