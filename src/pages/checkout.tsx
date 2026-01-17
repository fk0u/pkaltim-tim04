import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useToast } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { user, login } = useAuth();
    const { addBooking } = useBooking();
    const { addToast } = useToast();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const { pkg, date, pax, price, id, location, image } = router.query;

    // Mock Package Data Retrieval (in real app, use ID to fetch)
    const pkgName = pkg ? (pkg as string) : "Paket Wisata"; // Use raw string as title
    const totalPrice = price ? parseInt(price as string) : 0;
    const pkgImage = image ? (image as string) : "https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80";

    const handlePayment = () => {
        if (!user) {
            addToast("Silakan login terlebih dahulu", "error");
            router.push('/login');
            return;
        }

        setIsProcessing(true);
        // Simulate API call
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

    return (
        <Layout title="Checkout - BorneoTrip">
            <div className="min-h-screen bg-gray-50 pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Step Indicator */}
                    <div className="flex justify-between max-w-lg mx-auto mb-12 relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                        <div className={`absolute top-1/2 left-0 h-1 bg-emerald-500 -z-10 rounded-full transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>

                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-gray-200 text-gray-500'}`}>
                                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Main Form Area */}
                        <div className="col-span-2">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
                                    >
                                        <h2 className="text-2xl font-black text-gray-900 mb-6">Detail Pemesan</h2>

                                        {!user ? (
                                            <div className="bg-blue-50 p-6 rounded-2xl mb-6">
                                                <h3 className="font-bold text-blue-800 mb-2">Anda belum login</h3>
                                                <p className="text-sm text-blue-600 mb-4">Masuk untuk menyimpan riwayat booking Anda.</p>
                                                <button onClick={() => login('client')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">Login Sekarang</button>
                                            </div>
                                        ) : (
                                            <div className="mb-6 flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                                                <img src={user.avatar} className="w-12 h-12 rounded-full" />
                                                <div>
                                                    <p className="text-sm text-emerald-800 font-bold">Logged in as</p>
                                                    <p className="font-bold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        )}

                                        <form className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Nama Depan</label>
                                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none" defaultValue={user?.name.split(' ')[0]} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Nama Belakang</label>
                                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none" defaultValue={user?.name.split(' ')[1]} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">No. WhatsApp</label>
                                                <input type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="+62 812..." />
                                            </div>
                                            <div className="pt-4">
                                                <button type="button" onClick={() => setStep(2)} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition flex items-center justify-center gap-2">
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
                                        className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
                                    >
                                        <h2 className="text-2xl font-black text-gray-900 mb-6">Pembayaran</h2>

                                        <div className="space-y-4 mb-8">
                                            {['Credit Card', 'Bank Transfer (VA)', 'E-Wallet (GoPay/OVO)'].map((method, idx) => (
                                                <label key={idx} className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition group">
                                                    <input type="radio" name="payment" className="w-5 h-5 text-emerald-600 border-gray-300 focus:ring-emerald-500" defaultChecked={idx === 0} />
                                                    <span className="ml-3 font-bold text-gray-700 group-hover:text-emerald-900">{method}</span>
                                                    <CreditCard className="ml-auto text-gray-400 group-hover:text-emerald-600 w-5 h-5" />
                                                </label>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg mb-6">
                                            <ShieldCheck className="w-5 h-5 text-green-600" />
                                            Pembayaran Anda dienkripsi dan aman.
                                        </div>

                                        <div className="flex gap-4">
                                            <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-gray-100 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-200 transition">
                                                Kembali
                                            </button>
                                            <button type="button" onClick={handlePayment} disabled={isProcessing} className="w-2/3 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
                                                {isProcessing ? 'Processing...' : `Bayar IDR ${totalPrice.toLocaleString('id-ID')}`}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white p-12 rounded-3xl shadow-2xl text-center"
                                    >
                                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="w-12 h-12 text-green-600" />
                                        </div>
                                        <h2 className="text-3xl font-black text-gray-900 mb-4">Booking Berhasil!</h2>
                                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Terima kasih telah mempercayakan perjalanan Anda pada BorneoTrip. E-Ticket telah dikirim ke email Anda.</p>

                                        <div className="flex justify-center gap-4">
                                            <Link href="/dashboard/client" className="px-8 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition">
                                                Ke Dashboard
                                            </Link>
                                            <Link href="/" className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition">
                                                Kembali ke Home
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="col-span-1">
                            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-32">
                                <h3 className="font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Ringkasan Pesanan</h3>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Paket Wisata</p>
                                        <p className="font-bold text-gray-900 capitalize">{pkgName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Tanggal</p>
                                        <p className="font-bold text-gray-900">{date || 'Belum dipilih'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Jumlah Peserta</p>
                                        <p className="font-bold text-gray-900">{pax || 1} Orang</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                                    <span className="font-bold text-gray-900 text-lg">Total</span>
                                    <span className="font-black text-emerald-600 text-xl">IDR {totalPrice.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
}
