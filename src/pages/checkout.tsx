import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useContent } from '@/contexts/ContentContext';
import { useToast } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { TravelerDetail } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, ShieldCheck, User, Calendar, Users, MapPin, BadgeCheck, Banknote, Wallet, Building2, QrCode, AlertCircle, Baby, Ticket, Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CheckoutPage() {
    const { user } = useAuth();
    const { addBooking } = useBooking();
    const { packages, events } = useContent();
    const { addToast } = useToast();
    const { t } = useLanguage();
    const router = useRouter();

    const { pkg, date, pax, price, id, location, image, type } = router.query;

    // Derived State
    const isEvent = type === 'event';
    const pkgName = pkg ? (pkg as string) : (isEvent ? t.checkout.eventTicket : t.checkout.tourPackage);
    const basePrice = price ? parseInt(price as string) : 0;
    const pkgImage = image ? (image as string) : "https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80";

    // Find Product for Child Price & Quota
    const product = isEvent ? events.find(e => e.id === id) : packages.find(p => p.id === id);
    const childPrice = product?.priceChild || basePrice * 0.7; // Fallback logic if undefined
    const quota = product?.quota || 999;
    const bookedCount = product?.bookedCount || 0;

    // Component State
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStage, setProcessingStage] = useState('');
    const [selectedBank, setSelectedBank] = useState('bca');
    const [bookingId, setBookingId] = useState('');

    // Guest Configuration
    const [adultCount, setAdultCount] = useState(1);
    const [childCount, setChildCount] = useState(0);
    const [travelers, setTravelers] = useState<TravelerDetail[]>([]);

    const totalPax = adultCount + childCount;
    const totalPrice = (adultCount * basePrice) + (childCount * childPrice);

    // Quota Validation State
    const [quotaError, setQuotaError] = useState<string | null>(null);

    // Initialize Booking ID & Sync State with Pax Query
    useEffect(() => {
        setBookingId(`BK-${Math.floor(Math.random() * 1000000)}`);
        if (router.isReady && pax) {
            setAdultCount(Number(pax));
        }
    }, [router.isReady, pax]);

    // Validation & Traveler Array Sync
    useEffect(() => {
        if (!router.isReady) return;

        // 1. Quota Check
        const potentialTotal = bookedCount + totalPax;
        if (potentialTotal > quota) {
            setQuotaError(`${t.checkout.quotaExceeded} (${quota - bookedCount} ${t.packageDetail.quotaLeft})`);
            // Only show toast if error wasn't already set to avoid loops
            if (!quotaError) addToast(t.checkout.quotaExceeded, 'error');
        } else {
            setQuotaError(null);
        }

        // 2. Sync Travelers Array
        setTravelers(prev => {
            const currentCount = prev.length;
            const targetCount = totalPax;

            if (currentCount === targetCount) {
                // Just update types if counts shifted? 
                // A bit complex to detect "shift", so we reconstruct if types mismatch
                const needsUpdate = prev.filter(t => t.type === 'Adult').length !== adultCount;
                if (!needsUpdate) return prev;
            }

            const newTravelers: TravelerDetail[] = [];

            // Add Adults
            for (let i = 0; i < adultCount; i++) {
                const existingAdult = prev.find((t, idx) => t.type === 'Adult' && idx === i); // Simple heuristic
                newTravelers.push(existingAdult || {
                    type: 'Adult',
                    title: 'Mr',
                    fullName: (i === 0 && user) ? user.name : '',
                    idType: 'KTP',
                    idNumber: '',
                    nationality: 'Indonesia'
                });
            }

            // Add Children
            for (let i = 0; i < childCount; i++) {
                // Find existing child logic could be improved but simple push is okay for now
                newTravelers.push({
                    type: 'Child',
                    title: 'Ms', // Default for kids? Or Mr/Ms
                    fullName: '',
                    idType: 'Passport', // Often kids don't have KTP
                    idNumber: '', // NIA vs Passport
                    nationality: 'Indonesia',
                    age: 5
                });
            }

            // Re-assign lead traveler name if simple push lost it (edge case), handled above
            return newTravelers;
        });

    }, [adultCount, childCount, bookedCount, quota, router.isReady, user, isEvent, t, addToast]);


    const updateTraveler = (index: number, field: keyof TravelerDetail, value: string | number) => {
        const newTravelers = [...travelers];
        newTravelers[index] = { ...newTravelers[index], [field]: value };
        setTravelers(newTravelers);
    };

    const handleIncrement = (type: 'adult' | 'child') => {
        if (type === 'adult') {
            if (totalPax < (quota - bookedCount)) setAdultCount(prev => prev + 1);
            else addToast(t.checkout.quotaExceeded, 'error');
        } else {
            if (totalPax < (quota - bookedCount)) setChildCount(prev => prev + 1);
            else addToast(t.checkout.quotaExceeded, 'error');
        }
    };

    const handleDecrement = (type: 'adult' | 'child') => {
        if (type === 'adult') {
            if (adultCount > 1) setAdultCount(prev => prev - 1);
        } else {
            if (childCount > 0) setChildCount(prev => prev - 1);
        }
    };


    const handlePayment = async () => {
        if (!user) {
            addToast("Silakan login terlebih dahulu", "error");
            router.push('/login');
            return;
        }

        const isValid = travelers.every(t => t.fullName && (t.type === 'Child' ? true : t.idNumber)); // Relax ID for child? Maybe NIA
        if (!isValid) {
            addToast(t.checkout.fillAllDetails, "error");
            return;
        }

        setIsProcessing(true);

        // Simulation Stages
        const stages = [
            t.checkout.verifyingQuota,
            t.checkout.contactingGateway,
            t.checkout.processingPayment,
            t.checkout.generatingTicket
        ];

        for (const stage of stages) {
            setProcessingStage(stage);
            await new Promise(r => setTimeout(r, 800));
        }

        addBooking({
            userId: user.id || 'guest',
            customerName: user.name,
            productId: (id as string) || 'PKG-CUSTOM',
            productType: isEvent ? 'Event' : 'Package',
            productName: pkgName,
            productImage: pkgImage,
            location: (location as string) || 'East Kalimantan',
            date: (date as string) || new Date().toISOString(),
            amount: totalPrice,
            adultCount,
            childCount,
            totalPax,
            travelers: travelers,
            paymentMethod: selectedBank === 'gopay' || selectedBank === 'qris' ? 'E-Wallet' : 'Bank Transfer'
        });

        setIsProcessing(false);
        setStep(3);
        addToast(t.checkout.paymentSuccess, "success");
    };

    if (quotaError && step === 1 && !adultCount) { // Only show blocked error if count is stuck? 
        // Actually we show error inline now? Or separate page?
        // Separate page for hard fail
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
                        className="bg-white rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-xl border border-emerald-100 relative overflow-hidden"
                    >
                        {/* Confetti / Decor */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <CheckCircle className="w-12 h-12 text-emerald-600" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">{t.checkout.paymentSuccess}</h1>
                        <p className="text-slate-500 mb-8">
                            {t.checkout.successEmail} <b>{user?.email}</b>. {t.checkout.checkDashboard}
                        </p>

                        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100 relative">
                            {/* Tear lines */}
                            <div className="absolute -left-2 top-1/2 w-4 h-4 bg-white rounded-full border border-slate-100"></div>
                            <div className="absolute -right-2 top-1/2 w-4 h-4 bg-white rounded-full border border-slate-100"></div>

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
            {/* Processing Overlay */}
            <AnimatePresence>
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
                            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{processingStage}</h3>
                            <p className="text-sm text-gray-500">Mohon tunggu sebentar...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-gray-50 pt-32 pb-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Stepper */}
                    <div className="mb-12">
                        <div className="flex justify-center items-center space-x-4 md:space-x-12 relative max-w-3xl mx-auto">
                            <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-gray-200 -z-10 rounded-full"></div>
                            <div className={`absolute top-5 left-[10%] h-1 bg-emerald-500 -z-10 rounded-full transition-all duration-700 ease-in-out ${step === 1 ? 'w-0' : step === 2 ? 'w-[40%]' : 'w-[80%]'}`}></div>
                            {steps.map((s) => (
                                <div key={s.num} className="flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ring-4 z-10 ${step >= s.num ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 ring-emerald-50' : 'bg-white text-gray-400 ring-gray-50 border border-gray-200'}`}>
                                        {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                                    </div>
                                    <span className={`text-xs md:text-sm font-bold transition-colors duration-300 ${step >= s.num ? 'text-emerald-800' : 'text-gray-400'}`}>{s.label}</span>
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
                                                <p className="text-sm text-gray-500">{t.checkout.guestConfig}</p>
                                            </div>
                                        </div>

                                        {/* GUEST CONFIGURATION */}
                                        <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 last:mb-0 last:pb-0 last:border-0 h-14">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white rounded-lg text-gray-600 shadow-sm"><User className="w-5 h-5" /></div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{t.checkout.adults}</h4>
                                                        <p className="text-xs text-gray-500">{t.checkout.adultAgeInfo}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                                                    <button onClick={() => handleDecrement('adult')} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition disabled:opacity-50" disabled={adultCount <= 1}>-</button>
                                                    <span className="font-bold text-gray-900 w-4 text-center">{adultCount}</span>
                                                    <button onClick={() => handleIncrement('adult')} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-emerald-600 transition disabled:opacity-50" disabled={totalPax >= (quota - bookedCount)}>+</button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between h-14">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white rounded-lg text-gray-600 shadow-sm"><Baby className="w-5 h-5" /></div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{t.checkout.children}</h4>
                                                        <p className="text-xs text-gray-500">{t.checkout.childAgeInfo}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                                                    <button onClick={() => handleDecrement('child')} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition disabled:opacity-50" disabled={childCount <= 0}>-</button>
                                                    <span className="font-bold text-gray-900 w-4 text-center">{childCount}</span>
                                                    <button onClick={() => handleIncrement('child')} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-emerald-600 transition disabled:opacity-50" disabled={totalPax >= (quota - bookedCount)}>+</button>
                                                </div>
                                            </div>
                                        </div>

                                        <form className="space-y-8">
                                            {travelers.map((traveler, idx) => (
                                                <div key={idx} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${traveler.type === 'Child' ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-600'}`}>{idx + 1}</span>
                                                        {traveler.type === 'Child' ? 'Child Traveler' : 'Adult Traveler'}
                                                        {idx === 0 && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] ml-2">Lead</span>}
                                                    </h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                        <div className="md:col-span-1 space-y-2">
                                                            <label className="text-xs font-bold text-gray-500 uppercase">{t.checkout.formTitle}</label>
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
                                                            <label className="text-xs font-bold text-gray-500 uppercase">{t.checkout.formFullName}</label>
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
                                                        {traveler.type === 'Child' && (
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold text-gray-500 uppercase">{t.checkout.formAge}</label>
                                                                <input
                                                                    type="number"
                                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-medium focus:ring-2 focus:ring-emerald-500 transition"
                                                                    value={traveler.age || ''}
                                                                    onChange={(e) => updateTraveler(idx, 'age', parseInt(e.target.value))}
                                                                    placeholder="2-12"
                                                                    min={2}
                                                                    max={12}
                                                                />
                                                            </div>
                                                        )}
                                                        {traveler.type === 'Adult' && (
                                                            <>
                                                                <div className="space-y-2">
                                                                    <label className="text-xs font-bold text-gray-500 uppercase">{t.checkout.formIdNumber}</label>
                                                                    <input
                                                                        type="text"
                                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-medium focus:ring-2 focus:ring-emerald-500 transition"
                                                                        value={traveler.idNumber || ''}
                                                                        onChange={(e) => updateTraveler(idx, 'idNumber', e.target.value)}
                                                                        placeholder="e.g 6472xxxxxxx"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-xs font-bold text-gray-500 uppercase">{t.checkout.formPhoneNumber}</label>
                                                                    <input
                                                                        type="tel"
                                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-medium focus:ring-2 focus:ring-emerald-500 transition"
                                                                        value={traveler.phoneNumber || ''}
                                                                        onChange={(e) => updateTraveler(idx, 'phoneNumber', e.target.value)}
                                                                        placeholder="+62 811..."
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                        <div className="space-y-2 md:col-span-2">
                                                            <label className="text-xs font-bold text-gray-500 uppercase">{t.checkout.formNationality}</label>
                                                            <input
                                                                type="text"
                                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-medium focus:ring-2 focus:ring-emerald-500 transition"
                                                                value={traveler.nationality}
                                                                onChange={(e) => updateTraveler(idx, 'nationality', e.target.value)}
                                                                placeholder="e.g Indonesia"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="pt-4">
                                                <button type="button" onClick={() => {
                                                    const isValid = travelers.every(t => t.fullName && (t.type === 'Child' ? true : (t.idNumber && t.phoneNumber)));
                                                    if (!isValid) addToast(t.checkout.fillAllDetails, "error");
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
                                        className="space-y-6"
                                    >
                                        {/* Ticket Preview Card */}
                                        <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/40 border border-gray-100">
                                            <div className="bg-gray-900 text-white p-6 flex justify-between items-center relative overflow-hidden">
                                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                                <div className="relative z-10 flex items-center gap-3">
                                                    <Ticket className="w-6 h-6 text-emerald-400" />
                                                    <h2 className="font-bold text-lg tracking-wide">{t.checkout.ticketReview}</h2>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                                    <Image src={pkgImage} width={100} height={100} className="rounded-xl object-cover bg-gray-100" alt="Product" />
                                                    <div className="space-y-2 flex-1">
                                                        <h3 className="font-bold text-gray-900">{pkgName}</h3>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(date as string).toLocaleDateString()}</span>
                                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {location}</span>
                                                        </div>
                                                        <div className="flex gap-2 mt-2">
                                                            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-bold">{adultCount} Adults</span>
                                                            {childCount > 0 && <span className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded-md font-bold">{childCount} Children</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Method */}
                                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100">
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
                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t.checkout.virtualAccount}</h3>
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
                                                            {selectedBank === bank.id && (<div className="absolute top-0 right-0 p-1.5 bg-emerald-500 rounded-bl-xl"><CheckCircle className="w-3 h-3 text-white" /></div>)}
                                                        </div>
                                                    ))}
                                                </div>

                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">{t.checkout.ewallet}</h3>
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
                                                            {selectedBank === wallet.id && (<div className="absolute top-0 right-0 p-1.5 bg-emerald-500 rounded-bl-xl"><CheckCircle className="w-3 h-3 text-white" /></div>)}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-gray-100 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-200 transition">
                                                    {t.auth.back}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handlePayment}
                                                    className="w-2/3 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                                                >
                                                    <Banknote className="w-5 h-5" />
                                                    {t.checkout.pay} IDR {totalPrice.toLocaleString('id-ID')}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 space-y-6">
                                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-orange-400 to-pink-500"></div>
                                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <BadgeCheck className="w-5 h-5 text-orange-500" />
                                        {t.checkout.orderSummary}
                                    </h3>

                                    {/* Package Info */}
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
                                        </div>
                                    </div>

                                    {/* Cost Breakdown */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-600 font-medium">Adults (x{adultCount})</p>
                                            <p className="font-bold text-gray-900 text-sm">Rp {(adultCount * basePrice).toLocaleString('id-ID')}</p>
                                        </div>
                                        {childCount > 0 && (
                                            <div className="flex justify-between items-center text-pink-600">
                                                <p className="text-sm font-medium">Children (x{childCount})</p>
                                                <p className="font-bold text-sm">Rp {(childCount * childPrice).toLocaleString('id-ID')}</p>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-3">
                                            <p className="text-sm font-bold text-gray-500">Total Pax</p>
                                            <p className="font-bold text-gray-900 text-sm">{totalPax} {t.packageDetail.person}</p>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
