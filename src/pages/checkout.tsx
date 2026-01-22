import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useContent } from '@/contexts/ContentContext';
import { useToast } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { TravelerDetail } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, ShieldCheck, User, Calendar, Users, MapPin, BadgeCheck, Banknote, Wallet, Building2, QrCode, AlertCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
    const { user, login } = useAuth();
    const { addBooking } = useBooking();
    const { packages, events } = useContent();
    const { addToast } = useToast();
    const { t } = useLanguage();
    const router = useRouter();

    const { pkg, date, pax, price, id, location, image, type } = router.query;

    // Derived State
    const isEvent = type === 'event';
    const pkgName = pkg ? (pkg as string) : (isEvent ? t.checkout.eventTicket : t.checkout.tourPackage);
    const totalPrice = price ? parseInt(price as string) : 0;
    const pkgImage = image ? (image as string) : "https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80";
    const paxCount = Number(pax) || 1;

    // Component State
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedBank, setSelectedBank] = useState('bca');
    const [bookingId, setBookingId] = useState('');
    const [travelers, setTravelers] = useState<TravelerDetail[]>([]);
    const [quotaError, setQuotaError] = useState<string | null>(null);

    // Initialize Booking ID
    useEffect(() => {
        setBookingId(`BK-${Math.floor(Math.random() * 1000000)}`);
    }, []);

    // Initialize Travelers & Quota Check
    useEffect(() => {
        if (!router.isReady) return;

        // 1. Quota Check
        const product = isEvent ? events.find(e => e.id === id) : packages.find(p => p.id === id);
        if (product && product.quota && product.bookedCount !== undefined) {
            const potentialTotal = product.bookedCount + paxCount;
            if (potentialTotal > product.quota) {
                setQuotaError(`${t.checkout.quotaExceeded} (${product.quota - product.bookedCount} ${t.packageDetail.quotaLeft})`);
                addToast(t.checkout.quotaExceeded, 'error');
            } else {
                setQuotaError(null);
            }
        }

        // 2. Initialize Travelers Form
        setTravelers(prev => {
            if (prev.length === paxCount) return prev; // Avoid reset if already set matching pax

            const newTravelers: TravelerDetail[] = Array(paxCount).fill({
                title: 'Mr',
                fullName: '',
                idType: 'KTP',
                idNumber: '',
                nationality: 'Indonesia'
            });

            // Auto-fill lead traveler if user is logged in
            if (user && newTravelers.length > 0) {
                newTravelers[0] = {
                    ...newTravelers[0],
                    fullName: user.name,
                    title: 'Mr' // Default, user can change
                };
            }
            return newTravelers;
        });

    }, [router.isReady, paxCount, id, type, user, packages, events, isEvent, t, addToast]);


    const updateTraveler = (index: number, field: keyof TravelerDetail, value: string) => {
        const newTravelers = [...travelers];
        newTravelers[index] = { ...newTravelers[index], [field]: value };
        setTravelers(newTravelers);
    };

    const handlePayment = () => {
        if (!user) {
            addToast("Silakan login terlebih dahulu", "error");
            router.push('/login');
            return;
        }

        // Validate all travelers
        const isValid = travelers.every(t => t.fullName && t.idNumber);
        if (!isValid) {
            addToast(t.checkout.fillAllDetails, "error");
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            addBooking({
                userId: user.id || 'guest',
                customerName: user.name,
                productId: (id as string) || 'PKG-CUSTOM',
                productType: isEvent ? 'Event' : 'Package',
                productName: pkgName,
                productImage: pkgImage,
                location: (location as string) || 'East Kalimantan',
                date: (date as string) || new Date().toISOString(),
                pax: paxCount,
                amount: totalPrice || 0,
                travelers: travelers,
                paymentMethod: 'Credit Card', // Mocked based on selectedBank
            });

            setIsProcessing(false);
            setStep(3);
            addToast(t.checkout.paymentSuccess, "success");
        }, 2000);
    };

    if (quotaError) {
        return (
            <Layout title={`Error - BorneoTrip`}>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.checkout.oops}</h2>
                        <p className="text-gray-600 mb-6">{quotaError}</p>
                        <button onClick={() => router.back()} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold">
                            {t.common.back}
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (step === 3) {
        return (
            <Layout title={`${t.checkout.title} - BorneoTrip`}>
                <div className="min-h-screen bg-emerald-50 flex items-center justify-center pt-20 pb-20 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-xl border border-emerald-100"
                    >
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-emerald-600" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">{t.checkout.paymentSuccess}</h1>
                        <p className="text-slate-500 mb-8">
                            {t.checkout.successEmail} <b>{user?.email}</b>. {t.checkout.checkDashboard}
                        </p>

                        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-slate-500">{t.checkout.bookingNo}</span>
                                <span className="font-mono font-bold text-slate-900">{bookingId}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-slate-500">{t.checkout.package}</span>
                                <span className="font-bold text-slate-900 truncate max-w-[200px]">{pkgName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">{t.checkout.totalPaid}</span>
                                <span className="font-bold text-emerald-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => router.push('/dashboard/client')}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-emerald-200"
                            >
                                {t.checkout.viewOrder}
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="w-full bg-white border-2 border-slate-100 hover:border-slate-300 text-slate-600 font-bold py-3.5 rounded-xl transition"
                            >
                                {t.checkout.backHome}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </Layout>
        );
    }

    const steps = [
        { num: 1, label: t.checkout.step1 },
        { num: 2, label: t.checkout.step2 },
        { num: 3, label: t.checkout.step3 }
    ];

    return (
        <Layout title={`${t.checkout.title} - BorneoTrip`}>
            <div className="min-h-screen bg-gray-50 pt-32 pb-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Enhanced Stepper */}
                    <div className="mb-12">
                        <div className="flex justify-center items-center space-x-4 md:space-x-12 relative max-w-3xl mx-auto">
                            {/* Connector Line */}
                            <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-gray-200 -z-10 rounded-full"></div>
                            <div
                                className={`absolute top-5 left-[10%] h-1 bg-emerald-500 -z-10 rounded-full transition-all duration-700 ease-in-out ${step === 1 ? 'w-0' : step === 2 ? 'w-[40%]' : 'w-[80%]'}`}
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
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">{t.checkout.whoIsGoing}</h2>
                                                <p className="text-sm text-gray-500">{t.checkout.fillDetails} ({paxCount} Travelers)</p>
                                            </div>
                                        </div>

                                        {!user && (
                                            <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl mb-8 border border-blue-100">
                                                <div className="flex gap-4">
                                                    <div className="bg-white p-2 rounded-lg shadow-sm h-fit">
                                                        <User className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 mb-1">{t.checkout.notLoggedIn}</h3>
                                                        <p className="text-sm text-gray-600 mb-4">{t.checkout.loginDesc}</p>
                                                        <button
                                                            onClick={() => router.push('/login')}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition shadow-lg shadow-blue-200"
                                                        >
                                                            {t.checkout.loginNow}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <form className="space-y-8">
                                            {travelers.map((traveler, idx) => (
                                                <div key={idx} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px]">{idx + 1}</span>
                                                        Traveler {idx + 1} {idx === 0 && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] ml-2">Lead</span>}
                                                    </h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                        <div className="md:col-span-1 space-y-2">
                                                            <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                                                            <select
                                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-medium focus:ring-2 focus:ring-emerald-500 transition"
                                                                value={traveler.title}
                                                                onChange={(e) => updateTraveler(idx, 'title', e.target.value)}
                                                            >
                                                                <option value="Mr">Mr</option>
                                                                <option value="Mrs">Mrs</option>
                                                                <option value="Ms">Ms</option>
                                                                <option value="Dr">Dr</option>
                                                            </select>
                                                        </div>
                                                        <div className="md:col-span-3 space-y-2">
                                                            <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                                                            <input
                                                                type="text"
                                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-medium focus:ring-2 focus:ring-emerald-500 transition"
                                                                value={traveler.fullName}
                                                                onChange={(e) => updateTraveler(idx, 'fullName', e.target.value)}
                                                                placeholder="As on ID Card"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-gray-500 uppercase">Nationality</label>
                                                            <input
                                                                type="text"
                                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-medium focus:ring-2 focus:ring-emerald-500 transition"
                                                                value={traveler.nationality}
                                                                onChange={(e) => updateTraveler(idx, 'nationality', e.target.value)}
                                                                placeholder="e.g Indonesia"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-gray-500 uppercase">ID Number (KTP/Passport)</label>
                                                            <input
                                                                type="text"
                                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-medium focus:ring-2 focus:ring-emerald-500 transition"
                                                                value={traveler.idNumber}
                                                                onChange={(e) => updateTraveler(idx, 'idNumber', e.target.value)}
                                                                placeholder="e.g 6472xxxxxxx"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="pt-4">
                                                <button type="button" onClick={() => {
                                                    const isValid = travelers.every(t => t.fullName && t.idNumber);
                                                    if (!isValid) addToast("Please fill all traveler details", "error");
                                                    else setStep(2);
                                                }} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition flex items-center justify-center gap-3 shadow-lg shadow-gray-200 hover:shadow-xl hover:scale-[1.01]">
                                                    {t.checkout.continuePayment} <ArrowLeft className="w-4 h-4 rotate-180" />
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
                                                <h2 className="text-xl font-bold text-gray-900">{t.checkout.paymentMethod}</h2>
                                                <p className="text-sm text-gray-500">{t.checkout.chooseMathod}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6 mb-8">
                                            {/* Virtual Account Group */}
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pl-1">{t.checkout.virtualAccount}</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {[
                                                        { id: 'bca', label: 'BCA Virtual Account', icon: <Building2 className="w-5 h-5" /> },
                                                        { id: 'mandiri', label: 'Mandiri VA', icon: <Building2 className="w-5 h-5" /> },
                                                        { id: 'bni', label: 'BNI Virtual Account', icon: <Building2 className="w-5 h-5" /> }
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
                                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pl-1">{t.checkout.ewallet}</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {[
                                                        { id: 'gopay', label: 'GoPay', icon: <Wallet className="w-5 h-5" /> },
                                                        { id: 'qris', label: 'QRIS', icon: <QrCode className="w-5 h-5" /> }
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
                                            <p>{t.checkout.secureText}</p>
                                        </div>

                                        <div className="flex gap-4">
                                            <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-gray-100 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-200 transition">
                                                {t.auth.back}
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
                                                        {t.checkout.pay} IDR {totalPrice.toLocaleString('id-ID')}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary Sidebar - Enhanced */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 space-y-6">
                                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-orange-400 to-pink-500"></div>
                                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <BadgeCheck className="w-5 h-5 text-orange-500" />
                                        {t.checkout.orderSummary}
                                    </h3>

                                    {/* Package Card Tiny */}
                                    <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                                        <Image
                                            src={pkgImage}
                                            width={80}
                                            height={80}
                                            className="rounded-xl object-cover shadow-sm bg-gray-200"
                                            alt={pkgName}
                                        />
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold mb-1">{isEvent ? t.checkout.eventTicket : t.checkout.tourPackage}</p>
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
                                                <p className="text-sm text-gray-600">{t.hero.dateLabel}</p>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">{date ? new Date(date as string).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <p className="text-sm text-gray-600">{t.hero.travelersLabel}</p>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">{paxCount} {t.packageDetail.person}</p>
                                        </div>
                                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500">{t.checkout.duration}</p>
                                            <p className="font-bold text-gray-900 text-xs text-right">{t.checkout.durationDesc}<br /><span className="text-emerald-600 font-normal">{t.checkout.hotelIncluded}</span></p>
                                        </div>

                                        {/* Travelers Preview */}
                                        <div className="pt-2">
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Travelers</p>
                                            <div className="flex -space-x-2 overflow-hidden">
                                                {travelers.slice(0, 5).map((_, i) => (
                                                    <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                        {i + 1}
                                                    </div>
                                                ))}
                                                {travelers.length > 5 && (
                                                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
                                                        +{travelers.length - 5}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end pt-4 border-t-2 border-dashed border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">{t.checkout.totalPayment}</p>
                                            <p className="text-xs text-emerald-600 font-bold">{t.checkout.taxIncludedShort}</p>
                                        </div>
                                        <span className="font-black text-gray-900 text-2xl">IDR {(totalPrice / 1000).toLocaleString('id-ID')}<span className="text-base text-gray-500 font-bold">.000</span></span>
                                    </div>
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center gap-2 text-xs font-bold text-gray-500">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> {t.checkout.safeGuarantee}
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center gap-2 text-xs font-bold text-gray-500">
                                        <Users className="w-4 h-4 text-blue-500" /> {t.checkout.support247}
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
