import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useContent } from '@/contexts/ContentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, MapPin, Users, ArrowLeft, CheckCircle,
    CreditCard, Building2, Wallet, Banknote, ShieldCheck,
    Lock, ChevronRight, Ticket, QrCode
} from 'lucide-react';
import { useToast } from '@/components/ui';
import { TravelerDetail } from '@/types';

// Mock Card Detection
const getCardType = (number: string) => {
    const re = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
    };
    if (re.visa.test(number)) return 'visa';
    if (re.mastercard.test(number)) return 'mastercard';
    return null;
};

export default function CheckoutPage() {
    const router = useRouter();
    const { id, type } = router.query;
    const { user, isAuthenticated } = useAuth();
    const { addBooking } = useBooking();
    const { packages, events } = useContent();
    const { t } = useLanguage();
    const { addToast } = useToast();

    // Product Data
    const isEvent = type === 'event';
    const product = isEvent
        ? events.find(e => e.id === id)
        : packages.find(p => p.id === id);

    // Form State
    const [step, setStep] = useState(1);
    const [auditStep, setAuditStep] = useState(0); // For processing animation
    const [adultCount, setAdultCount] = useState(1);
    const [childCount, setChildCount] = useState(0);
    const [travelers, setTravelers] = useState<TravelerDetail[]>([{ type: 'Adult', title: 'Mr', fullName: '' }]);

    // Payment State
    const [paymentTab, setPaymentTab] = useState<'bank' | 'wallet' | 'card'>('bank');
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
    const cardType = getCardType(cardDetails.number);

    // Derived State
    const quota = product?.quota || 20;
    const bookedCount = product?.bookedCount || 0;
    const totalPax = adultCount + childCount;
    const basePrice = product?.price || 0;
    const childPrice = product?.priceChild || basePrice * 0.8;
    const totalPrice = (adultCount * basePrice) + (childCount * childPrice);

    const pkgName = product ? (typeof product.title === 'string' ? product.title : product.title['en']) : 'Loading...';
    const pkgImage = product?.imageUrl || '/images/placeholder.jpg';
    const location = product?.location || 'East Kalimantan';
    const date = isEvent ? (product as any)?.date : new Date().toISOString();

    useEffect(() => {
        if (!isAuthenticated) router.push('/login');
    }, [isAuthenticated, router]);

    // Pax & Traveler Logic
    useEffect(() => {
        const newTravelers: TravelerDetail[] = [];
        for (let i = 0; i < adultCount; i++) {
            newTravelers.push(travelers[i] || { type: 'Adult', title: 'Mr', fullName: '' });
        }
        for (let i = 0; i < childCount; i++) {
            newTravelers.push(travelers[adultCount + i] || { type: 'Child', title: 'Mr', fullName: '', age: 5 });
        }
        setTravelers(newTravelers);
    }, [adultCount, childCount]);

    const handleIncrement = (type: 'adult' | 'child') => {
        if (totalPax >= (quota - bookedCount)) {
            addToast(t.checkout.quotaExceeded || "Quota Limit Reached", "error");
            return;
        }
        if (type === 'adult') setAdultCount(p => p + 1);
        else setChildCount(p => p + 1);
    };

    const handleDecrement = (type: 'adult' | 'child') => {
        if (type === 'adult' && adultCount > 1) setAdultCount(p => p - 1);
        if (type === 'child' && childCount > 0) setChildCount(p => p - 1);
    };

    const updateTraveler = (index: number, field: keyof TravelerDetail, value: any) => {
        const updated = [...travelers];
        updated[index] = { ...updated[index], [field]: value };
        setTravelers(updated);
    };

    const handlePayment = async () => {
        if (!selectedMethod && (paymentTab !== 'card' || !cardDetails.number)) {
            addToast("Please select a payment method", "error");
            return;
        }

        setStep(3); // Processing
        const stages = [1, 2, 3];
        for (const s of stages) {
            setAuditStep(s);
            await new Promise(r => setTimeout(r, 800));
        }

        addBooking({
            userId: user?.id || 'guest',
            customerName: user?.name || 'Guest',
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
            travelers,
            paymentMethod: paymentTab === 'card' ? 'Credit Card' : 'Bank Transfer',
            // Removed status: 'Paid' to fix type error
        });

        router.push('/dashboard/client?tab=bookings');
        addToast(t.checkout.paymentSuccess, 'success');
    };

    if (!product) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div></div>;

    const steps = [
        { num: 1, label: t.checkout.guestConfig },
        { num: 2, label: t.checkout.payment },
        { num: 3, label: t.checkout.processing }
    ];

    return (
        <Layout title={`Checkout - ${pkgName}`}>
            <AnimatePresence>
                {step === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center">
                        <div className="w-24 h-24 mb-6 relative">
                            <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                            {auditStep === 3 && <CheckCircle className="absolute inset-0 m-auto w-10 h-10 text-emerald-600 animate-bounce" />}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.checkout.processingPayment}</h2>
                        <div className="space-y-1 text-center text-sm text-gray-500">
                            <p className={auditStep >= 1 ? "text-emerald-600 font-bold" : ""}>✓ Verifying Availability</p>
                            <p className={auditStep >= 2 ? "text-emerald-600 font-bold" : ""}>✓ Secure Transaction</p>
                            <p className={auditStep >= 3 ? "text-emerald-600 font-bold" : ""}>✓ Generating Ticket</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-gray-50 pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT COLUMN - MAIN FORM */}
                        <div className="lg:col-span-8 space-y-6">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">

                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Users className="w-6 h-6" /></div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">{t.checkout.whoIsGoing}</h2>
                                                <p className="text-sm text-gray-500">{t.checkout.guestConfig}</p>
                                            </div>
                                        </div>

                                        {/* PAX COUNTER */}
                                        <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{t.checkout.adults}</h4>
                                                    <p className="text-xs text-gray-500">{t.checkout.adultAgeInfo}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => handleDecrement('adult')} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 font-bold" disabled={adultCount <= 1}>-</button>
                                                    <span className="font-bold w-4 text-center">{adultCount}</span>
                                                    <button onClick={() => handleIncrement('adult')} className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center justify-center disabled:opacity-50 font-bold" disabled={totalPax >= (quota - bookedCount)}>+</button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{t.checkout.children}</h4>
                                                    <p className="text-xs text-gray-500">{t.checkout.childAgeInfo}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => handleDecrement('child')} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 font-bold" disabled={childCount <= 0}>-</button>
                                                    <span className="font-bold w-4 text-center">{childCount}</span>
                                                    <button onClick={() => handleIncrement('child')} className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center justify-center disabled:opacity-50 font-bold" disabled={totalPax >= (quota - bookedCount)}>+</button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* TRAVELER DETAILS FORM */}
                                        <form className="space-y-8">
                                            {travelers.map((traveler, idx) => (
                                                <div key={idx} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${traveler.type === 'Child' ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-600'}`}>{idx + 1}</span>
                                                        {traveler.type === 'Child' ? 'Child Traveler' : 'Adult Traveler'}
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                        <div className="md:col-span-1">
                                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title</label>
                                                            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-emerald-500 outline-none" value={traveler.title} onChange={(e) => updateTraveler(idx, 'title', e.target.value)}>
                                                                <option value="Mr">Mr</option><option value="Mrs">Mrs</option><option value="Ms">Ms</option>
                                                            </select>
                                                        </div>
                                                        <div className="md:col-span-3">
                                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Full Name</label>
                                                            <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="As on ID Card" value={traveler.fullName} onChange={(e) => updateTraveler(idx, 'fullName', e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => {
                                                const isValid = travelers.every(t => t.fullName);
                                                if (!isValid) addToast("Please fill all names", "error");
                                                else setStep(2);
                                            }} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition flex items-center justify-center gap-3 shadow-lg shadow-gray-200 hover:shadow-xl hover:scale-[1.01]">
                                                {t.checkout.continuePayment} <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </form>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">

                                        {/* TICKET REVIEW CARD */}
                                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                                            <div className="bg-gray-900 text-white p-6 flex justify-between items-center relative overflow-hidden">
                                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                                                <div className="relative z-10 flex items-center gap-3"><Ticket className="w-6 h-6 text-emerald-400" /><h2 className="font-bold text-lg tracking-wide">{t.checkout.ticketReview}</h2></div>
                                            </div>
                                            <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
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

                                        {/* PAYMENT METHOD TABS */}
                                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><ShieldCheck className="w-32 h-32" /></div>
                                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Wallet className="w-6 h-6 text-emerald-500" /> {t.checkout.paymentMethod}</h2>

                                            <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
                                                {['bank', 'wallet', 'card'].map(tab => (
                                                    <button key={tab} onClick={() => { setPaymentTab(tab as any); setSelectedMethod(''); }} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${paymentTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                                        {tab === 'bank' && 'Bank Transfer'}
                                                        {tab === 'wallet' && 'E-Wallet'}
                                                        {tab === 'card' && 'Credit/Debit'}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* BANK TRANSFER TAB */}
                                            {paymentTab === 'bank' && (
                                                <div className="grid grid-cols-1 gap-4 animate-fadeIn">
                                                    {[
                                                        { id: 'bca', label: 'BCA Virtual Account', icon: <Building2 className="w-5 h-5" /> },
                                                        { id: 'mandiri', label: 'Mandiri VA', icon: <Building2 className="w-5 h-5" /> },
                                                        { id: 'bni', label: 'BNI VA', icon: <Building2 className="w-5 h-5" /> }
                                                    ].map(bank => (
                                                        <div key={bank.id} onClick={() => setSelectedMethod(bank.id)} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all hover:bg-gray-50 ${selectedMethod === bank.id ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-gray-200'}`}>
                                                            <div className="w-10 h-10 bg-blue-900/10 rounded-lg flex items-center justify-center text-blue-900 mr-4 font-bold text-xs">{bank.label.substring(0, 3)}</div>
                                                            <span className="font-bold text-gray-700 flex-1">{bank.label}</span>
                                                            {selectedMethod === bank.id && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* WALLET TAB */}
                                            {paymentTab === 'wallet' && (
                                                <div className="grid grid-cols-1 gap-4 animate-fadeIn">
                                                    {[
                                                        { id: 'gopay', label: 'GoPay', icon: <Wallet className="w-5 h-5 text-blue-500" />, color: 'text-blue-500' },
                                                        { id: 'ovo', label: 'OVO', icon: <Wallet className="w-5 h-5 text-purple-500" />, color: 'text-purple-500' },
                                                        { id: 'qris', label: 'QRIS', icon: <QrCode className="w-5 h-5 text-gray-900" />, color: 'text-gray-900' }
                                                    ].map(wallet => (
                                                        <div key={wallet.id} onClick={() => setSelectedMethod(wallet.id)} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all hover:bg-gray-50 ${selectedMethod === wallet.id ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-gray-200'}`}>
                                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">{wallet.icon}</div>
                                                            <span className="font-bold text-gray-700 flex-1">{wallet.label}</span>
                                                            {selectedMethod === wallet.id && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* CARD TAB */}
                                            {paymentTab === 'card' && (
                                                <div className="animate-fadeIn space-y-4">
                                                    <div className="relative">
                                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Card Number</label>
                                                        <div className="relative">
                                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                className="w-full bg-white border border-gray-300 rounded-xl pl-12 pr-12 py-3.5 font-mono font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                                                                placeholder="0000 0000 0000 0000"
                                                                maxLength={16}
                                                                value={cardDetails.number}
                                                                onChange={e => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, '') })}
                                                            />
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                                {cardType === 'visa' && <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" />}
                                                                {cardType === 'mastercard' && <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Expiry</label>
                                                            <input type="text" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 font-medium focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="MM/YY" />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">CVV</label>
                                                            <div className="relative">
                                                                <input type="text" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 font-medium focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="123" maxLength={3} />
                                                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                                        <ShieldCheck className="w-4 h-4" />
                                                        Your transaction is secured with 256-bit encryption.
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-4 mt-8">
                                                <button onClick={() => setStep(1)} className="w-1/3 bg-gray-100 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-200 transition">{t.auth.back}</button>
                                                <button onClick={handlePayment} className="w-2/3 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.01]">
                                                    <Banknote className="w-5 h-5" />
                                                    Pay IDR {totalPrice.toLocaleString('id-ID')}
                                                </button>
                                            </div>

                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* RIGHT COLUMN - SUMMARY */}
                        <div className="lg:col-span-4 relative order-first lg:order-last">
                            <div className="sticky top-28">
                                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-emerald-400 to-cyan-500"></div>
                                    <h3 className="font-black text-gray-900 mb-6 text-lg">{t.checkout.orderSummary}</h3>

                                    <div className="flex gap-4 mb-6">
                                        <Image src={pkgImage} width={70} height={70} className="rounded-xl object-cover shadow-sm bg-gray-200 aspect-square" alt="pkg" />
                                        <div>
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">{isEvent ? 'Event Ticket' : 'Tour Package'}</p>
                                            <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{pkgName}</h4>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-dashed border-gray-200">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 font-medium">Adults (x{adultCount})</span>
                                            <span className="font-bold text-gray-900">Rp {(adultCount * basePrice).toLocaleString('id-ID')}</span>
                                        </div>
                                        {childCount > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-pink-600 font-medium">Children (x{childCount})</span>
                                                <span className="font-bold text-pink-700">Rp {(childCount * childPrice).toLocaleString('id-ID')}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center text-sm pt-2">
                                            <span className="text-gray-500 font-medium">Total Travelers</span>
                                            <span className="font-bold text-gray-900">{totalPax} Pax</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-100">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1 font-bold">Total Payment</p>
                                                <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">Tax Included</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-bold text-gray-400 mr-1">IDR</span>
                                                <span className="text-2xl font-black text-slate-900">
                                                    {(totalPrice / 1000).toLocaleString('id-ID')}<span className="text-lg text-gray-400">.000</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 bg-blue-50 p-3 rounded-xl flex gap-3 items-start">
                                        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                        <p className="text-xs text-blue-800 leading-relaxed font-medium">
                                            <strong>Free Cancellation</strong> up to 24 hours before the trip. Secure checkout powered by Midtrans.
                                        </p>
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
