import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useContent } from '@/contexts/ContentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, CheckCircle, ArrowRight, Wallet, Bell, Settings, Star, ChevronRight, Share2, Heart, Camera, Trophy, User, LogOut, FileText, CreditCard, LayoutDashboard, MessageSquare, History, Menu, X, Phone, Ticket, ShieldCheck, Search, CheckCheck, Paperclip, Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState, useEffect, FormEvent } from 'react';
import { useToast, Skeleton, ShareModal } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import Link from 'next/link';
import { Booking, TourPackage, User as UserType } from '@/types';
import { useRef } from 'react';

export default function ClientDashboard() {
    const { user, logout, isAuthenticated, isLoading } = useAuth();
    const { bookings, stats, getBookingsByUserId } = useBooking();
    const { packages } = useContent();
    const { t, locale } = useLanguage();
    const router = useRouter();
    const { addToast } = useToast();

    const [activeTab, setActiveTab] = useState('overview');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Modal State
    const [activeModal, setActiveModal] = useState<string | null>(null);

    // Data - Typed
    const userBookings = user ? getBookingsByUserId(user.id) : [];
    const activeTrip = userBookings.length > 0 ? userBookings[0] : null;

    useEffect(() => {
        if (isLoading) return; // Wait for session check

        if (!isAuthenticated) {
            router.push('/login');
            // addToast(t.common.loading, 'success'); // Remove toast to avoid spam on generic redirect
            return;
        }

        if (user && (user.role as string) !== 'Customer' && (user.role as string) !== 'client') {
            router.push(`/dashboard/${user.role}`);
        }
        if (router.query.tab) {
            setActiveTab(router.query.tab as string);
        }
    }, [isAuthenticated, user, router, isLoading]);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;
    }

    if (!user) return null;

    const handleLogout = () => {
        logout();
        router.push('/login');
        addToast(t.common.loading, 'success');
    };

    const sidebarItems = [
        { id: 'overview', label: t.dashboard.overview, icon: LayoutDashboard },
        { id: 'bookings', label: t.dashboard.myBookings, icon: Calendar },
        { id: 'history', label: t.dashboard.transactionHistory, icon: History },
        { id: 'profile', label: t.dashboard.myProfile, icon: User },
        { id: 'payments', label: t.dashboard.paymentMethods, icon: CreditCard },
        { id: 'chat', label: t.dashboard.chatSupport, icon: MessageSquare },
        { id: 'addresses', label: "Address Book", icon: MapPin },
        { id: 'settings', label: "Settings", icon: Settings },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewView user={user as unknown as UserType} t={t} activeTrip={activeTrip} setActiveModal={setActiveModal} packages={packages} locale={locale} router={router} stats={stats} />;
            case 'bookings':
                return <BookingsView bookings={userBookings} t={t} router={router} />;
            case 'history':
                return <HistoryView bookings={userBookings} t={t} />;
            case 'profile':
                return <ProfileView user={user as unknown as UserType} t={t} addToast={addToast} />;
            case 'payments':
                return <PaymentsView t={t} setActiveModal={setActiveModal} />;
            case 'chat':
                return <ChatView user={user as unknown as UserType} t={t} />;
            case 'addresses':
                return <AddressBookView t={t} addToast={addToast} />;
            case 'settings':
                return <SettingsView user={user as unknown as UserType} t={t} addToast={addToast} />;
            default:
                return <OverviewView user={user as unknown as UserType} t={t} activeTrip={activeTrip} setActiveModal={setActiveModal} packages={packages} locale={locale} router={router} stats={stats} />;
        }
    };

    return (
        <Layout title={`Dashboard - ${user.name}`} hideFooter={true}>
            <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row lg:pt-16">
                {/* SIDEBAR */}
                <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-100 fixed h-[calc(100vh-64px)] top-16 left-0 z-30 shadow-xl shadow-gray-200/50 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-72'}`}>
                    <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 text-gray-500 hover:text-emerald-600 shadow-sm z-50">
                        {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 rotate-180" />}
                    </button>
                    <div className="p-4">
                        <div className={`bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white shadow-lg shadow-emerald-200 relative overflow-hidden group transition-all duration-300 ${isSidebarCollapsed ? 'p-2' : 'p-6'}`}>
                            {!isSidebarCollapsed && (
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110"><User className="w-24 h-24" /></div>
                            )}
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className={`bg-white/20 rounded-full backdrop-blur-sm transition-all duration-300 ${isSidebarCollapsed ? 'p-1 mb-0' : 'p-1 mb-3'}`}>
                                    <img src={user.avatar} className={`rounded-full border-2 border-white object-cover shadow-sm transition-all duration-300 ${isSidebarCollapsed ? 'w-8 h-8' : 'w-16 h-16'}`} alt={user.name} />
                                </div>
                                {!isSidebarCollapsed && (
                                    <>
                                        <h3 className="font-bold text-lg leading-tight mb-1">{user.name}</h3>
                                        <p className="text-[10px] font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">{t.dashboard.travelerMember}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                        {!isSidebarCollapsed && <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Menu</p>}
                        {sidebarItems.map((item) => (
                            <button key={item.id} onClick={() => setActiveTab(item.id)} title={isSidebarCollapsed ? item.label : ''} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 font-bold text-sm group relative overflow-hidden ${activeTab === item.id ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'} ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                                {activeTab === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full"></div>}
                                <item.icon className={`w-5 h-5 transition-colors ${activeTab === item.id ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                {!isSidebarCollapsed && (
                                    <>
                                        {item.label}
                                        {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto text-emerald-400" />}
                                    </>
                                )}
                            </button>
                        ))}
                    </nav>
                    <div className="p-4 border-t border-gray-100">
                        <button onClick={handleLogout} title={isSidebarCollapsed ? t.dashboard.logout : ''} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-all font-bold text-sm bg-red-50/50 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                            <LogOut className="w-5 h-5" />
                            {!isSidebarCollapsed && t.dashboard.logout}
                        </button>
                    </div>
                </aside>

                {/* MOBILE HEADER */}
                <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img src={user.avatar} className="w-10 h-10 rounded-full border border-gray-100 object-cover" alt={user.name} />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hello,</p>
                            <p className="text-sm font-black text-slate-900 leading-none">{user.name.split(' ')[0]}</p>
                        </div>
                    </div>
                    <button className="relative p-2 rounded-full hover:bg-gray-50 transition text-gray-600">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                </div>

                {/* MAIN CONTENT */}
                <main className={`flex-1 bg-gray-50 min-h-screen transition-all duration-300 pt-20 pb-24 lg:pt-0 lg:pb-12 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-12">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}>
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* MODALS */}
            <Modal isOpen={activeModal === 'voucher'} onClose={() => setActiveModal(null)} title={t.dashboard.voucher}>
                <div className="text-center">
                    <div className="bg-slate-50 p-6 rounded-2xl mb-6 border border-slate-100">
                        <div className="w-48 h-48 bg-white mx-auto rounded-xl p-2 border border-slate-200">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BorneoTrip-Booking-123" className="w-full h-full" alt="QR Code" />
                        </div>
                        <p className="mt-4 font-mono text-lg font-bold text-slate-900 tracking-widest">BK-8829-DIAN</p>
                        <p className="text-sm text-slate-500">{t.dashboard.showQr}</p>
                    </div>
                    <button onClick={() => { addToast('Voucher diunduh', 'success'); setActiveModal(null); }} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl">{t.dashboard.downloadPdf}</button>
                </div>
            </Modal>

            <Modal isOpen={activeModal === 'add_card'} onClose={() => setActiveModal(null)} title={t.dashboard.addNewCard}>
                <div className="space-y-6">
                    <div className="group perspective-1000 h-48 w-full cursor-pointer" onClick={(e) => e.currentTarget.classList.toggle('rotate-y-180')}>
                        <div className="relative w-full h-full text-white transition-all duration-700 transform style-preserve-3d group-hover:rotate-y-6">
                            <div className="absolute inset-0 bg-linear-to-br from-slate-900 to-slate-800 rounded-2xl p-6 backface-hidden shadow-xl flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-8 bg-yellow-500/20 rounded flex items-center justify-center"><div className="w-8 h-5 border border-yellow-500/50 rounded-sm"></div></div>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="w-10" alt="Mastercard" />
                                </div>
                                <div className="space-y-4">
                                    <div className="font-mono text-xl tracking-widest text-shadow">0000 0000 0000 0000</div>
                                    <div className="flex justify-between">
                                        <div><p className="text-[9px] uppercase opacity-70">Card Holder</p><p className="font-bold text-sm">YOUR NAME</p></div>
                                        <div><p className="text-[9px] uppercase opacity-70">Expires</p><p className="font-bold text-sm">MM/YY</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form className="space-y-4" onSubmit={async (e) => {
                        e.preventDefault();
                        // @ts-ignore
                        const holder = e.target.holder.value;
                        // @ts-ignore
                        const number = e.target.number.value;
                        // @ts-ignore
                        const expiry = e.target.expiry.value;

                        try {
                            const res = await fetch('/api/user/payment-methods', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    provider: 'card',
                                    holder,
                                    last4: number.slice(-4),
                                    brand: 'Mastercard', // Simulate detection
                                    expiry
                                })
                            });

                            if (res.ok) {
                                addToast('Card added successfully', 'success');
                                setActiveModal(null);
                                // Ideally trigger refresh in child, but for now simple close. 
                                // In real app, lift state or use context.
                                window.location.reload(); // Brute force refresh for simplicity
                            } else {
                                addToast('Failed to add card', 'error');
                            }
                        } catch (err) {
                            addToast('Error adding card', 'error');
                        }
                    }}>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.dashboard.cardHolder}</label>
                            <input type="text" name="holder" placeholder="John Doe" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-emerald-500" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                            <input type="text" name="number" placeholder="0000 0000 0000 0000" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-emerald-500 font-mono" required />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.dashboard.expiryDate}</label>
                                <input type="text" name="expiry" placeholder="MM/YY" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-emerald-500" required />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVC</label>
                                <input type="text" placeholder="123" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-emerald-500" required />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all hover:-translate-y-1">Add Card</button>
                    </form>
                </div>
            </Modal>
            <ShareModal isOpen={activeModal === 'share_event'} onClose={() => setActiveModal(null)} title="Share this Trip" url="https://borneotrip.com/trips/123" />
        </Layout>
    );
}

// --- SUB-COMPONENTS PROPS ---
interface OverviewProps {
    user: UserType;
    t: any;
    activeTrip: Booking | null;
    setActiveModal: (id: string | null) => void;
    packages: TourPackage[];
    locale: string;
    router: any;
    stats: any;
}

interface BookingsProps {
    bookings: Booking[];
    t: any;
    router: any;
}

interface HistoryProps {
    bookings: Booking[];
    t: any;
}

interface ProfileProps {
    user: UserType;
    t: any;
    addToast: any;
}

interface PaymentsProps {
    t: any;
    setActiveModal: (id: string) => void;
}

interface ChatProps {
    user: UserType;
    t: any;
}


// --- ANIMATED COUNTER COMPONENT ---
function AnimatedCounter({ value, label, icon: Icon, color }: { value: number, label: string, icon: any, color: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-all duration-300"
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color.replace('bg-', 'text-')}`}>
                <Icon className="w-16 h-16" />
            </div>
            <div className="relative z-10">
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">{label}</div>
                <div className="flex items-baseline gap-1">
                    <motion.span
                        className="text-3xl font-black text-slate-900"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {value.toLocaleString('id-ID')}
                    </motion.span>
                </div>
            </div>
        </motion.div>
    );
}

// --- SUB-COMPONENTS ---
function OverviewView({ user, t, activeTrip, setActiveModal, packages, locale, router, stats }: OverviewProps) {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">{t.dashboard.welcome} <span className="text-emerald-600">{user.name.split(' ')[0]}</span> 👋</h1>
                <p className="text-slate-500">{t.dashboard.ready}</p>
            </div>

            {/* Immersive Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AnimatedCounter value={stats.totalXP} label={t.dashboard.totalXp} icon={Star} color="bg-yellow-500" />
                <AnimatedCounter value={stats.totalBookings} label="Total Bookings" icon={Calendar} color="bg-blue-500" />
                <AnimatedCounter value={stats.activeTripsCount} label="Active Trips" icon={MapPin} color="bg-emerald-500" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-600 p-6 rounded-3xl shadow-lg shadow-emerald-200 relative overflow-hidden group cursor-pointer hover:bg-emerald-700 transition"
                    onClick={() => router.push('/packages')}
                >
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="relative z-10 text-white h-full flex flex-col justify-between">
                        <div className="font-bold uppercase text-[10px] tracking-widest opacity-80">Next Adventure</div>
                        <div className="flex items-center gap-2 font-bold">Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" /></div>
                    </div>
                </motion.div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-emerald-500" /> {t.dashboard.activeTrip}</h2>
                {activeTrip ? (
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-6 hover:translate-y-[-4px] transition duration-300 cursor-pointer" onClick={() => setActiveModal('voucher')} >
                        <div className="w-full md:w-48 h-32 md:h-auto relative rounded-2xl overflow-hidden shrink-0">
                            <img src={activeTrip.productImage || packages[0]?.imageUrl} className="w-full h-full object-cover" alt="Trip" />
                        </div>
                        <div className="flex-1 py-2">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900 line-clamp-1">{activeTrip.productName}</h3>
                                    <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {activeTrip.location}</p>
                                </div>
                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">{activeTrip.status}</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-4">{t.dashboard.bookingId} #{activeTrip.id}</p>
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => router.push(`/dashboard/vouchers/${activeTrip.id}`)} className="flex-1 text-sm font-bold text-emerald-600 border border-emerald-200 py-2.5 rounded-xl hover:bg-emerald-50 transition flex items-center justify-center gap-2">
                                    {t.dashboard.openVoucher} <ArrowRight className="w-4 h-4" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setActiveModal('share_event'); }} className="w-12 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-gray-300">
                        <p className="text-gray-400 mb-4">{t.dashboard.noActiveTrip}</p>
                        <button onClick={() => router.push('/packages')} className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 transition">{t.dashboard.findPackage}</button>
                    </div>
                )}
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Heart className="w-5 h-5 text-pink-500" /> {t.dashboard.recommendations}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.slice(0, 3).map((pkg) => (
                        <div key={pkg.id} onClick={() => router.push(`/packages/${pkg.id}`)} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition cursor-pointer group">
                            <div className="h-32 bg-gray-200 rounded-2xl mb-4 overflow-hidden"><img src={pkg.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="pkg" /></div>
                            <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{typeof pkg.title === 'string' ? pkg.title : pkg.title[locale === 'en' ? 'en' : 'id'] as string}</h4>
                            <p className="text-emerald-600 font-bold text-xs">Rp {(pkg.price / 1000).toLocaleString('id-ID')}k</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function BookingsView({ bookings, t, router }: BookingsProps) {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">{t.dashboard.myBookings}</h2>
            {bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"><Calendar className="w-8 h-8" /></div>
                    <h3 className="font-bold text-gray-900 mb-2">{t.dashboard.noBookings}</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mb-6">{t.dashboard.bookingsDesc}</p>
                    <button onClick={() => router.push('/packages')} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-1 transition-all">{t.dashboard.findPackage}</button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 group hover:shadow-md transition-all">
                            <div className="w-full md:w-48 h-48 md:h-auto rounded-2xl bg-gray-200 overflow-hidden shrink-0 relative">
                                <img src={booking.productImage} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="img" />
                                <div className="absolute top-3 left-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md shadow-sm ${booking.status === 'Paid' ? 'bg-emerald-500/90 text-white' : 'bg-orange-500/90 text-white'}`}>{booking.status}</span>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-xl text-slate-900 mb-1">{booking.productName}</h3>
                                            <p className="text-sm text-slate-500 font-medium">#{booking.id}</p>
                                        </div>
                                        <p className="font-black text-xl text-emerald-600">IDR {booking.amount.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                        <div className="bg-gray-50 p-3 rounded-xl">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Date</p>
                                            <div className="flex items-center gap-2 font-bold text-slate-700 text-sm"><Calendar className="w-4 h-4 text-emerald-500" /> {new Date(booking.date).toLocaleDateString()}</div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Location</p>
                                            <div className="flex items-center gap-2 font-bold text-slate-700 text-sm"><MapPin className="w-4 h-4 text-emerald-500" /> {booking.location?.split(',')[0]}</div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Travelers</p>
                                            <div className="flex items-center gap-2 font-bold text-slate-700 text-sm"><User className="w-4 h-4 text-emerald-500" /> {booking.totalPax} Pax</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                                    <button onClick={() => router.push(`/dashboard/vouchers/${booking.id}`)} className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"><Ticket className="w-4 h-4" /> View Voucher</button>
                                    <button onClick={() => router.push(`/dashboard/vouchers/${booking.id}?tab=invoice`)} className="flex-1 bg-white border border-gray-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition flex items-center justify-center gap-2"><FileText className="w-4 h-4" /> Invoice</button>
                                    <button onClick={() => router.push(`/packages`)} className="px-4 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition border border-transparent hover:border-emerald-100">Book Again</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function HistoryView({ bookings, t }: HistoryProps) {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    const filteredBookings = bookings.filter(b => {
        const matchesFilter = filter === 'All' || b.status === filter;
        const matchesSearch = b.productName.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">{t.dashboard.transactionHistory}</h2>
                <button onClick={() => alert("Simulating Report Download...")} className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition">
                    <FileText className="w-4 h-4" /> Download Report
                </button>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                    <input type="text" placeholder="Search by ID or Name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition" />
                </div>
                <div className="flex bg-gray-50 p-1 rounded-xl">
                    {['All', 'Paid', 'Pending', 'Canceled'].map((status) => (
                        <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${filter === status ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}> {status} </button>
                    ))}
                </div>
            </div>
            {filteredBookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"><History className="w-8 h-8" /></div>
                    <p className="text-gray-500 font-medium">{t.dashboard.noBookings}</p>
                    {search && <button onClick={() => { setSearch(''); setFilter('All'); }} className="mt-4 text-emerald-600 font-bold text-sm">Clear Filters</button>}
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider">Order Info</th>
                                    <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider">Item Details</th>
                                    <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Amount</th>
                                    <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider text-center">Status</th>
                                    <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition group">
                                        <td className="p-5">
                                            <div className="font-mono font-bold text-slate-900 mb-0.5">#{booking.id}</div>
                                            <div className="text-xs text-gray-500 mb-1">{new Date(booking.date).toLocaleDateString()}</div>
                                            <div className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded inline-block">INV-{booking.id.slice(-4)}</div>
                                        </td>
                                        <td className="p-5">
                                            <div className="font-bold text-slate-900 mb-0.5 line-clamp-1">{booking.productName}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1"><MapPin className="w-3 h-3" /> {booking.location?.split(',')[0]}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1.5"><User className="w-3 h-3" /> {booking.totalPax} Travelers</div>
                                        </td>
                                        <td className="p-5 text-right font-bold text-slate-900">Rp {(booking.amount / 1000).toLocaleString('id-ID')}k</td>
                                        <td className="p-5 text-center">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${booking.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : booking.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>{booking.status}</span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link href={`/dashboard/vouchers/${booking.id}?tab=ticket`} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition" title="E-Ticket"><Ticket className="w-4 h-4" /></Link>
                                                <Link href={`/dashboard/vouchers/${booking.id}?tab=invoice`} className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition" title="Invoice"><FileText className="w-4 h-4" /></Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function ProfileView({ user, t, addToast }: ProfileProps) {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <div className="space-y-6 max-w-2xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">{t.dashboard.editProfile}</h2>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-6 mb-8">
                        <img src={user.avatar} className="w-20 h-20 rounded-full border-4 border-gray-50" alt="Avatar" />
                        <button className="text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl">Change Photo</button>
                    </div>
                    <form className="space-y-6" onSubmit={async (e: FormEvent) => {
                        e.preventDefault();
                        try {
                            // @ts-ignore
                            const name = e.target.name.value;
                            // @ts-ignore
                            const phone = e.target.phone.value;
                            // @ts-ignore
                            const idNumber = e.target.idNumber.value;
                            // @ts-ignore
                            const bio = e.target.bio.value;

                            const res = await fetch('/api/user/profile', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ name, phone, idNumber, bio })
                            });

                            if (res.ok) {
                                addToast('Profile updated successfully', 'success');
                                setIsEditing(false);
                                // Reload to update context
                                window.location.reload();
                            } else {
                                addToast('Failed to update profile', 'error');
                            }
                        } catch (err) {
                            addToast('An error occurred', 'error');
                        }
                    }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.dashboard.fullName}</label><input type="text" name="name" defaultValue={user.name} className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.dashboard.email}</label><input type="email" name="email" defaultValue={user.email} className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-500" disabled /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.dashboard.phone}</label><input type="tel" name="phone" defaultValue={(user as any).phone || ''} placeholder="+62..." className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.dashboard.idNumber}</label><input type="text" name="idNumber" defaultValue={(user as any).idNumber || ''} placeholder="16 digit NIK" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                        </div>
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.dashboard.bio}</label><textarea name="bio" defaultValue={(user as any).bio || ''} className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium h-24 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Tell us about yourself..."></textarea></div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={() => setIsEditing(false)} className="text-gray-500 font-bold hover:text-gray-900 transition">{t.dashboard.cancel}</button>
                            <button type="submit" className="bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition">{t.dashboard.saveChanges}</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">{t.dashboard.myProfile}</h2>
                <button onClick={() => setIsEditing(true)} className="text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition">{t.dashboard.editProfile}</button>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none"><User className="w-64 h-64" /></div>
                <div className="flex flex-col items-center text-center mb-8 relative z-10">
                    <div className="p-1 bg-white/50 backdrop-blur-sm rounded-full mb-4"><img src={user.avatar} className="w-28 h-28 rounded-full border-4 border-emerald-50 shadow-lg object-cover" alt="Profile" /></div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">{user.name}</h3>
                    <p className="text-slate-500 font-medium mb-3">{user.email}</p>
                    <div className="flex gap-2"><span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified Traveler</span></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 mb-8">
                        <div className="p-5 bg-gray-50 rounded-2xl flex items-center gap-4 border border-gray-100"><div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm"><Phone className="w-6 h-6" /></div><div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.dashboard.phone}</p><p className="font-bold text-slate-900 text-lg">{(user as any).phone || '-'}</p></div></div>
                        <div className="p-5 bg-gray-50 rounded-2xl flex items-center gap-4 border border-gray-100"><div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm"><CreditCard className="w-6 h-6" /></div><div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.dashboard.idNumber}</p><p className="font-bold text-slate-900 text-lg">{(user as any).idNumber || '-'}</p></div></div>
                    </div>
                </div>
                <div className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Account Security</h4>
                            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                                <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition text-left"><span className="text-sm font-bold text-slate-700">Change Password</span><ChevronRight className="w-4 h-4 text-gray-400" /></button>
                                <div className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100"><span className="text-sm font-bold text-slate-700">Two-Factor Authentication</span><span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Enabled</span></div>
                                <div className="p-3 bg-white rounded-xl border border-gray-100"><p className="text-xs font-bold text-gray-400 uppercase mb-2">Recent Login</p><div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center"><User className="w-4 h-4 text-gray-500" /></div><div><p className="text-xs font-bold text-slate-900">Windows PC • Jakarta, ID</p><p className="text-[10px] text-emerald-600 font-bold">Active now</p></div></div></div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Settings className="w-4 h-4 text-emerald-500" /> Preferences</h4>
                            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                                <div className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100"><span className="text-sm font-bold text-slate-700">Email Notifications</span><div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div></div></div>
                                <div className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100"><span className="text-sm font-bold text-slate-700">Language</span><span className="text-xs font-bold text-gray-500">English (US)</span></div>
                            </div>
                            <h4 className="font-bold text-slate-900 mt-6 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><MapPin className="w-4 h-4 text-emerald-500" /> Address Book</h4>
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <div className="p-3 bg-white rounded-xl border border-gray-100 flex justify-between items-start">
                                    <div><p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-block mb-1">Home</p><p className="text-xs text-slate-600 leading-relaxed font-medium">Jl. Jend. Sudirman No. 12<br />Jakarta Selatan, 12190</p></div>
                                    <button className="text-gray-400 hover:text-emerald-600"><Settings className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PaymentsView({ t, setActiveModal }: { t: any, setActiveModal: (id: string | null) => void }) {
    const [methods, setMethods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    // Fetch methods
    const fetchMethods = async () => {
        try {
            const res = await fetch('/api/user/payment-methods');
            if (res.ok) {
                const data = await res.json();
                setMethods(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMethods();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch(`/api/user/payment-methods?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                addToast('Payment method removed', 'success');
                fetchMethods();
            } else {
                addToast('Failed to remove', 'error');
            }
        } catch (error) {
            addToast('Error removing method', 'error');
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900">{t.dashboard.paymentMethods}</h2>

            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-3xl" />
                    <Skeleton className="h-24 w-full rounded-3xl" />
                </div>
            ) : (
                <div className="grid gap-6">
                    {methods.length === 0 && (
                        <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">{t.dashboard.noPaymentMethods || "No saved payment methods"}</p>
                        </div>
                    )}

                    {methods.map((method) => (
                        <div key={method.id} className={`rounded-3xl p-6 shadow-md relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 ${method.provider === 'card' ? 'bg-linear-to-r from-slate-900 to-slate-800 text-white' : 'bg-white border border-gray-200'}`}>
                            {method.provider === 'card' ? (
                                <>
                                    <div className="absolute top-0 right-0 p-8 opacity-10"><CreditCard className="w-32 h-32" /></div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-8">
                                            {/* Brand Logo Placeholder */}
                                            <div className="text-xl font-bold font-serif italic">{method.brand}</div>
                                            <button onClick={() => handleDelete(method.id)} className="bg-white/20 hover:bg-red-500 hover:text-white backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition">Remove</button>
                                        </div>
                                        <p className="font-mono opacity-80 mb-8 text-xl tracking-widest text-shadow">**** **** **** {method.last4}</p>
                                        <div className="flex justify-between items-end">
                                            <div><p className="text-[10px] uppercase opacity-60 mb-1 tracking-wider">{t.dashboard.cardHolder}</p><p className="font-bold tracking-wide">{method.holder}</p></div>
                                            <div><p className="text-[10px] uppercase opacity-60 mb-1 tracking-wider">{t.dashboard.expiryDate}</p><p className="font-bold tracking-wide">{method.expiry}</p></div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center p-3"><Wallet className="w-8 h-8 text-blue-600" /></div>
                                        <div><h4 className="font-bold text-slate-900 capitalize">{method.brand} E-Wallet</h4><p className="text-sm text-gray-500 font-mono">{method.holder}</p></div>
                                    </div>
                                    <button onClick={() => handleDelete(method.id)} className="text-sm font-bold text-red-500 hover:text-red-700 transition">Remove</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <button onClick={() => setActiveModal('add_card')} className="w-full border-2 border-dashed border-gray-200 rounded-3xl p-6 text-gray-400 font-bold hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition flex items-center justify-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center text-gray-400 transition">+</div>{t.dashboard.addNewCard}
            </button>
        </div>
    );
}

function ChatView({ user, t }: ChatProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Poll for messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch('/api/chat');
                if (res.ok) {
                    const data = await res.json();
                    // Only update if different? For now just set
                    // Ideally compare length or last ID to avoid re-renders or scroll jumps
                    // But for simple polling this is okay-ish
                    setMessages(data.messages || []);
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text: string = input) => {
        if (!text.trim()) return;
        setIsSending(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: text })
            });
            if (res.ok) {
                const newMsg = await res.json();
                setMessages(prev => [...prev, newMsg]);
                setInput('');
            }
        } catch (error) {
            console.error('Failed to send', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-white shadow-sm z-10">
                <div className="relative"><div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xl border-4 border-emerald-50">BS</div><span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span></div>
                <div><h4 className="font-bold text-slate-900">BorneoTrip Support</h4><p className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">Online • Typically replies instantly</p></div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 my-10">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                )}

                {messages.map(m => (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={m.id} className={`flex ${m.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-4 rounded-2xl text-sm shadow-sm ${m.senderId === user.id ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm'}`}>
                            <p className="leading-relaxed">{m.content}</p>
                            <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
                                <span className="text-[10px]">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {m.senderId === user.id && (m.read ? <CheckCheck className="w-3 h-3 text-white" /> : <CheckCircle className="w-3 h-3 text-white/50" />)}
                            </div>
                        </div>
                    </motion.div>
                ))}

                <div ref={messagesEndRef} />
            </div>
            {/* Quick Replies */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
                {["Where is my voucher?", "Refund Policy", "Reschedule Trip", "Payment Issue"].map(q => (
                    <button key={q} onClick={() => handleSend(q)} className="whitespace-nowrap px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition">{q}</button>
                ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 bg-white border-t border-gray-100 flex gap-3 items-end">
                <div className="flex-1 bg-gray-100 rounded-2xl flex items-center px-4 border border-transparent focus-within:border-emerald-200 focus-within:bg-white transition-all">
                    <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder={t.dashboard.typeMessage} className="flex-1 bg-transparent border-0 py-4 focus:ring-0 text-sm font-medium" />
                    <button type="button" className="text-gray-400 hover:text-emerald-600 transition"><Paperclip className="w-5 h-5" /></button>
                </div>
                <button type="submit" disabled={!input.trim() || isSending} className="bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-2xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageSquare className="w-5 h-5" />}
                </button>
            </form>
        </div>
    );
}

// --- NEW COMPONENTS ---

interface AddressBookProps {
    t: any;
    addToast: any;
}

interface SettingsProps {
    user: UserType;
    t: any;
    addToast: any;
}

function AddressBookView({ t, addToast }: AddressBookProps) {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const fetchAddresses = async () => {
        try {
            const res = await fetch('/api/user/addresses');
            if (res.ok) {
                const data = await res.json();
                setAddresses(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete address?')) return;
        try {
            const res = await fetch(`/api/user/addresses?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                addToast('Address deleted', 'success');
                fetchAddresses();
            }
        } catch (error) {
            addToast('Error deleting address', 'error');
        }
    };

    const handleAdd = async (e: FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.isDefault = data.isDefault === 'on';

        try {
            const res = await fetch('/api/user/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                addToast('Address added', 'success');
                setIsAdding(false);
                fetchAddresses();
            }
        } catch (error) {
            addToast('Error adding address', 'error');
        }
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900">Address Book</h2>

            {isAdding ? (
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-lg mb-4">Add New Address</h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold uppercase text-gray-400">Label</label><input name="label" placeholder="Home, Office" className="w-full border p-2 rounded-lg" required /></div>
                            <div><label className="text-xs font-bold uppercase text-gray-400">Recipient</label><input name="recipientName" placeholder="Full Name" className="w-full border p-2 rounded-lg" required /></div>
                        </div>
                        <div><label className="text-xs font-bold uppercase text-gray-400">Phone</label><input name="phone" className="w-full border p-2 rounded-lg" required /></div>
                        <div><label className="text-xs font-bold uppercase text-gray-400">Address</label><textarea name="address" className="w-full border p-2 rounded-lg" required></textarea></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold uppercase text-gray-400">City</label><input name="city" className="w-full border p-2 rounded-lg" required /></div>
                            <div><label className="text-xs font-bold uppercase text-gray-400">Postal Code</label><input name="postalCode" className="w-full border p-2 rounded-lg" required /></div>
                        </div>
                        <div className="flex items-center gap-2"><input type="checkbox" name="isDefault" id="def" /><label htmlFor="def" className="text-sm font-bold">Set as Default</label></div>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                            <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold">Save</button>
                        </div>
                    </form>
                </div>
            ) : (
                <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-3 rounded-xl hover:bg-emerald-100 transition">+ Add New Address</button>
            )}

            <div className="grid gap-4">
                {addresses.map((addr) => (
                    <div key={addr.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-slate-900">{addr.label}</span>
                                {addr.isDefault && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">DEFAULT</span>}
                            </div>
                            <p className="font-bold text-sm text-gray-700">{addr.recipientName} ({addr.phone})</p>
                            <p className="text-sm text-gray-500">{addr.address}, {addr.city} {addr.postalCode}</p>
                        </div>
                        <button onClick={() => handleDelete(addr.id)} className="text-red-500 text-xs font-bold hover:underline">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SettingsView({ user, t, addToast }: SettingsProps) {
    const [prefs, setPrefs] = useState({
        notifications: { email: true, push: true },
        currency: 'IDR',
        language: 'en'
    });

    // 2FA State
    const [is2FAEnabled, setIs2FAEnabled] = useState(false); // In real app, load from user prop/api 
    const [setupStep, setSetupStep] = useState(0); // 0: none, 1: qr, 2: verify
    const [qrData, setQrData] = useState<any>(null);
    const [token, setToken] = useState('');

    useEffect(() => {
        // Load initial settings if in user preferences
        if (user.preferences) {
            // @ts-ignore
            setPrefs({ ...prefs, ...user.preferences });
        }
        if ((user as any).isTwoFactorEnabled) {
            setIs2FAEnabled(true);
        }
    }, [user]);

    const handleSavePrefs = async () => {
        try {
            const res = await fetch('/api/user/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prefs)
            });
            if (res.ok) {
                addToast('Preferences saved', 'success');
            }
        } catch (e) {
            addToast('Error saving preferences', 'error');
        }
    };

    const start2FASetup = async () => {
        try {
            const res = await fetch('/api/auth/2fa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'setup' })
            });
            if (res.ok) {
                const data = await res.json();
                setQrData(data); // { secret, otpauth }
                setSetupStep(1);
            }
        } catch (e) {
            addToast('Error starting setup', 'error');
        }
    };

    const verify2FA = async () => {
        try {
            const res = await fetch('/api/auth/2fa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'verify', token })
            });
            if (res.ok) {
                addToast('2FA Enabled Successfully', 'success');
                setIs2FAEnabled(true);
                setSetupStep(0);
                setQrData(null);
            } else {
                addToast('Invalid Token', 'error');
            }
        } catch (e) {
            addToast('Verification failed', 'error');
        }
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900">Settings</h2>

            {/* PREFERENCES */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Preferences</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">Email Notifications</span>
                        <div
                            className={`w-12 h-6 rounded-full relative cursor-pointer px-1 transition-colors ${prefs.notifications.email ? 'bg-emerald-500' : 'bg-gray-200'}`}
                            onClick={() => setPrefs({ ...prefs, notifications: { ...prefs.notifications, email: !prefs.notifications.email } })}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${prefs.notifications.email ? 'left-7' : 'left-1'}`}></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">Push Notifications</span>
                        <div
                            className={`w-12 h-6 rounded-full relative cursor-pointer px-1 transition-colors ${prefs.notifications.push ? 'bg-emerald-500' : 'bg-gray-200'}`}
                            onClick={() => setPrefs({ ...prefs, notifications: { ...prefs.notifications, push: !prefs.notifications.push } })}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${prefs.notifications.push ? 'left-7' : 'left-1'}`}></div>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Currency</label>
                        <select
                            value={prefs.currency}
                            onChange={(e) => setPrefs({ ...prefs, currency: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2"
                        >
                            <option value="IDR">IDR (Indonesian Rupiah)</option>
                            <option value="USD">USD (US Dollar)</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6">
                    <button onClick={handleSavePrefs} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition">Save Preferences</button>
                </div>
            </div>

            {/* 2FA SECURITY */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    <div>
                        <h3 className="font-bold text-lg">Two-Factor Authentication</h3>
                        <p className="text-xs text-gray-500">Secure your account with TOTP</p>
                    </div>
                </div>

                {!setupStep && !is2FAEnabled && (
                    <button onClick={start2FASetup} className="bg-emerald-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-emerald-700 transition">Enable 2FA</button>
                )}

                {setupStep === 1 && qrData && (
                    <div className="bg-gray-50 p-6 rounded-xl text-center space-y-4">
                        <p className="text-sm font-bold text-gray-700">Scan this QR Code with Google Authenticator</p>
                        <div className="w-48 h-48 bg-white mx-auto flex items-center justify-center border">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData.otpauth)}`} alt="QR" />
                        </div>
                        <p className="text-xs font-mono bg-white p-2 border rounded select-all break-all">{qrData.secret}</p>

                        <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            className="text-center text-xl tracking-widest font-mono w-48 mx-auto border-2 border-emerald-500 rounded-lg p-2"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                        <button onClick={verify2FA} className="bg-emerald-600 text-white font-bold px-8 py-2 rounded-xl">Verify & Enable</button>
                    </div>
                )}

                {is2FAEnabled && (
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center">
                        <span className="font-bold text-emerald-700 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> 2FA is Enabled</span>
                        <button className="text-red-500 text-xs font-bold hover:underline">Disable</button>
                    </div>
                )}
            </div>
        </div>
    );
}
