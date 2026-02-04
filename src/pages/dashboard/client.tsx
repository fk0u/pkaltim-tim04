import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useContent } from '@/contexts/ContentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, CheckCircle, ArrowRight, Wallet, Bell, Settings, Star, ChevronRight, Share2, Heart, Camera, Trophy, User, LogOut, FileText, CreditCard, LayoutDashboard, MessageSquare, History, Menu, X, Phone, Ticket, ShieldCheck, Search, CheckCheck, Paperclip, Loader2, Check, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState, useEffect, FormEvent } from 'react';
import { useToast, Skeleton, ShareModal, ImageUpload } from '@/components/ui';
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
                return <PaymentsView t={t} setActiveModal={setActiveModal} activeModal={activeModal} />;
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

            <AddPaymentMethodModal isOpen={activeModal === 'add_card'} onClose={() => setActiveModal(null)} addToast={addToast} />
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
                                {activeTrip.status === 'Paid' || activeTrip.status === 'Completed' ? (
                                    <button onClick={() => router.push(`/dashboard/vouchers/${activeTrip.id}`)} className="flex-1 text-sm font-bold text-emerald-600 border border-emerald-200 py-2.5 rounded-xl hover:bg-emerald-50 transition flex items-center justify-center gap-2">
                                        {t.dashboard.openVoucher} <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button disabled className="flex-1 text-sm font-bold text-gray-400 border border-gray-200 py-2.5 rounded-xl bg-gray-50 flex items-center justify-center gap-2 cursor-not-allowed">
                                        <Clock className="w-4 h-4" /> Verifying Payment...
                                    </button>
                                )}
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
                                    {booking.status === 'Paid' || booking.status === 'Completed' ? (
                                        <button onClick={() => router.push(`/dashboard/vouchers/${booking.id}`)} className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"><Ticket className="w-4 h-4" /> View Voucher</button>
                                    ) : (
                                        <button disabled className="flex-1 bg-gray-100 text-gray-400 px-4 py-2.5 rounded-xl font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2" title="Waiting for Payment Verification"><Clock className="w-4 h-4" /> Verifying...</button>
                                    )}
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
                                                {booking.status === 'Paid' || booking.status === 'Completed' ? (
                                                    <Link href={`/dashboard/vouchers/${booking.id}?tab=ticket`} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition" title="E-Ticket"><Ticket className="w-4 h-4" /></Link>
                                                ) : (
                                                    <span className="p-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed" title="Verification in Progress"><Clock className="w-4 h-4" /></span>
                                                )}
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
    const [avatarUrl, setAvatarUrl] = useState(user.avatar || '');

    if (isEditing) {
        return (
            <div className="space-y-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsEditing(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-black text-slate-900">{t.dashboard.editProfile}</h2>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                    <form className="space-y-8" onSubmit={async (e: FormEvent) => {
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
                                body: JSON.stringify({ name, phone, idNumber, bio, avatar: avatarUrl })
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
                        <div className="flex flex-col md:flex-row gap-10">
                            {/* Left Column: Avatar */}
                            <div className="w-full md:w-1/3 flex flex-col items-center">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Profile Picture</p>
                                <div className="w-full">
                                    <ImageUpload
                                        value={avatarUrl}
                                        onChange={setAvatarUrl}
                                        label=""
                                        className="w-full"
                                    />
                                </div>
                                <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
                                    Upload a high-quality image.<br />Recommended size: 500x500px.
                                </p>
                            </div>

                            {/* Right Column: Details */}
                            <div className="flex-1 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">{t.dashboard.fullName}</label>
                                        <input type="text" name="name" defaultValue={user.name} className="w-full bg-gray-50 border-gray-200 rounded-2xl px-5 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">{t.dashboard.email}</label>
                                        <input type="email" name="email" defaultValue={user.email} className="w-full bg-gray-100 border-transparent rounded-2xl px-5 py-4 font-bold text-gray-400 cursor-not-allowed" disabled />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">{t.dashboard.phone}</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input type="tel" name="phone" defaultValue={user.phone || ''} placeholder="+62..." className="w-full bg-gray-50 border-gray-200 rounded-2xl pl-12 pr-5 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">{t.dashboard.idNumber}</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input type="text" name="idNumber" defaultValue={user.idNumber || ''} placeholder="16 digit NIK" className="w-full bg-gray-50 border-gray-200 rounded-2xl pl-12 pr-5 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">{t.dashboard.bio}</label>
                                    <textarea name="bio" defaultValue={user.bio || ''} className="w-full bg-gray-50 border-gray-200 rounded-2xl px-5 py-4 font-medium text-slate-700 h-32 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition resize-none" placeholder="Tell us about your travel preferences..."></textarea>
                                </div>
                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition">{t.dashboard.cancel}</button>
                                    <button type="submit" className="bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 transform hover:-translate-y-1 transition-all">{t.dashboard.saveChanges}</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.dashboard.myProfile}</h2>
                    <p className="text-slate-500 mt-1">Manage your account settings and preferences.</p>
                </div>
                <button onClick={() => setIsEditing(true)} className="group flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                    <Settings className="w-4 h-4 group-hover:rotate-45 transition duration-300" />
                    {t.dashboard.editProfile}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: ID Card Style */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-2 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition duration-500 transform group-hover:scale-110"><User className="w-40 h-40" /></div>
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-20"></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-full mb-6 relative">
                                    <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-sm">
                                        <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                                        <Check className="w-3 h-3" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black mb-1">{user.name}</h3>
                                <p className="text-emerald-100 font-medium text-sm mb-6">{user.email}</p>

                                <div className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 flex justify-between items-center mb-2">
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase tracking-wider opacity-70 font-bold">Role</p>
                                        <p className="font-bold text-sm">Traveler</p>
                                    </div>
                                    <div className="h-8 w-px bg-white/20"></div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase tracking-wider opacity-70 font-bold">Status</p>
                                        <p className="font-bold text-sm text-emerald-300">Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Travel Stats</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600"><Star className="w-5 h-5 fill-current" /></div>
                                    <span className="font-bold text-slate-700">Total XP</span>
                                </div>
                                <span className="font-black text-slate-900">1,250</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><MapPin className="w-5 h-5" /></div>
                                    <span className="font-bold text-slate-700">Trips</span>
                                </div>
                                <span className="font-black text-slate-900">12</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Info & Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Bio Section */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-lg">
                            <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600"><User className="w-5 h-5" /></span>
                            About Me
                        </h4>
                        <p className="text-slate-600 leading-relaxed">
                            {user.bio || "No bio added yet. Tell us about your dream destinations and travel style to get personalized recommendations!"}
                        </p>
                    </div>

                    {/* Personal Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600 mb-4"><Phone className="w-6 h-6" /></div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t.dashboard.phone}</p>
                            <p className="text-xl font-bold text-slate-900">{user.phone || 'Not set'}</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 mb-4"><CreditCard className="w-6 h-6" /></div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t.dashboard.idNumber}</p>
                            <p className="text-xl font-bold text-slate-900">{user.idNumber || 'Not set'}</p>
                        </div>
                    </div>

                    {/* Settings Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Security
                            </h4>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition group">
                                    <span className="font-bold text-slate-700 group-hover:text-emerald-700 transition">Change Password</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
                                </button>
                                <div className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                    <span className="font-bold text-slate-700">2FA Status</span>
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-lg">Enabled</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-emerald-500" /> Preferences
                            </h4>
                            <div className="space-y-3">
                                <div className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                    <span className="font-bold text-slate-700">Notifications</span>
                                    <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                                </div>
                                <div className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                    <span className="font-bold text-slate-700">Language</span>
                                    <span className="text-xs font-bold text-slate-500">English (US)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PaymentsView({ t, setActiveModal, activeModal }: { t: any, setActiveModal: (id: string | null) => void, activeModal: string | null }) {
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

    const ewallets = [
        { id: 'gopay', name: 'GoPay', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg' },
        { id: 'dana', name: 'DANA', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg' },
        { id: 'ovo', name: 'OVO', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg' },
        { id: 'shopeepay', name: 'ShopeePay', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg' },
        { id: 'linkaja', name: 'LinkAja', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/85/LinkAja.svg' }
    ];


    // Force rebuild
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

                    {methods.map((method) => {
                        const wallet = ewallets.find(w => w.id === method.brand);

                        return (
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
                                            <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center p-2.5 shadow-sm">
                                                {wallet ? <img src={wallet.logo} className="w-full h-full object-contain" alt={wallet.name} /> : <Wallet className="w-8 h-8 text-blue-600" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 capitalize">{wallet ? wallet.name : method.brand}</h4>
                                                <p className="text-sm text-gray-500 font-mono">{method.holder}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(method.id)} className="text-sm font-bold text-red-500 hover:text-red-700 transition">Remove</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <button onClick={() => setActiveModal('add_card')} className="w-full border-2 border-dashed border-gray-200 rounded-3xl p-6 text-gray-400 font-bold hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition flex items-center justify-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center text-gray-400 transition">+</div>{t.dashboard.addNewCard}
            </button>
            <AddPaymentMethodModal isOpen={activeModal === 'add_card'} onClose={() => setActiveModal(null)} addToast={addToast} />
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

function AddPaymentMethodModal({ isOpen, onClose, addToast }: { isOpen: boolean, onClose: () => void, addToast: any }) {
    const [methodType, setMethodType] = useState<'card' | 'ewallet'>('card');
    const [selectedEwallet, setSelectedEwallet] = useState<string | null>(null);
    const [cardNum, setCardNum] = useState('');
    const [cardExp, setCardExp] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardBrand, setCardBrand] = useState<string>('card');
    const [ewalletPhone, setEwalletPhone] = useState('');

    useEffect(() => {
        const num = cardNum.replace(/\D/g, '');
        if (num.match(/^4/)) setCardBrand('visa');
        else if (num.match(/^5[1-5]/)) setCardBrand('mastercard');
        else if (num.match(/^3[47]/)) setCardBrand('amex');
        else if (num.match(/^35/)) setCardBrand('jcb');
        else setCardBrand('card');
    }, [cardNum]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const body = methodType === 'card' ? {
                provider: 'card',
                holder: cardName,
                last4: cardNum.slice(-4),
                brand: cardBrand !== 'card' ? cardBrand : 'Mastercard', // Fallback
                expiry: cardExp
            } : {
                provider: 'ewallet',
                holder: ewalletPhone, // Use phone as identifier
                brand: selectedEwallet,
                last4: ewalletPhone.slice(-4)
            };

            const res = await fetch('/api/user/payment-methods', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                addToast('Payment method added', 'success');
                onClose();
                window.location.reload();
            } else {
                addToast('Failed to add method', 'error');
            }
        } catch (error) {
            addToast('Error processing request', 'error');
        }
    };

    const ewallets = [
        { id: 'gopay', name: 'GoPay', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg' },
        { id: 'dana', name: 'DANA', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg' },
        { id: 'ovo', name: 'OVO', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg' },
        { id: 'shopeepay', name: 'ShopeePay', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg' },
        { id: 'linkaja', name: 'LinkAja', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/85/LinkAja.svg' }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Payment Method">
            <div className="space-y-6">
                {/* Type Selector */}
                <div className="flex p-1 bg-gray-100 rounded-xl">
                    <button onClick={() => setMethodType('card')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${methodType === 'card' ? 'bg-white shadow-sm text-slate-900' : 'text-gray-500 hover:text-gray-700'}`}>Credit Card</button>
                    <button onClick={() => setMethodType('ewallet')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${methodType === 'ewallet' ? 'bg-white shadow-sm text-slate-900' : 'text-gray-500 hover:text-gray-700'}`}>E-Wallet</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {methodType === 'card' ? (
                        <div className="space-y-4">
                            {/* Card Preview */}
                            <div className={`h-48 w-full rounded-2xl p-6 text-white shadow-lg transition-all duration-500 relative overflow-hidden ${cardBrand === 'visa' ? 'bg-[#1A1F71]' : cardBrand === 'mastercard' ? 'bg-[#EB001B]' : cardBrand === 'amex' ? 'bg-[#2E77BC]' : 'bg-slate-800'}`}>
                                <div className="absolute top-0 right-0 p-6 opacity-20"><CreditCard className="w-32 h-32" /></div>
                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <div className="flex justify-between items-center">
                                        <div className="w-12 h-8 bg-yellow-400/20 rounded flex items-center justify-center border border-white/20"></div>
                                        {cardBrand !== 'card' && <span className="font-bold font-mono text-xl uppercase">{cardBrand}</span>}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="font-mono text-xl tracking-widest text-shadow">{cardNum || '0000 0000 0000 0000'}</div>
                                        <div className="flex justify-between">
                                            <div><p className="text-[9px] uppercase opacity-70">Holder</p><p className="font-bold text-sm truncate max-w-[150px]">{cardName || 'YOUR NAME'}</p></div>
                                            <div><p className="text-[9px] uppercase opacity-70">Expires</p><p className="font-bold text-sm">{cardExp || 'MM/YY'}</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Card Number</label>
                                    <div className="relative">
                                        <input value={cardNum} onChange={e => setCardNum(e.target.value)} maxLength={19} placeholder="0000 0000 0000 0000" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition" required />
                                        <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Card Holder Name</label>
                                    <input value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} placeholder="JOHN DOE" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Expiry</label>
                                    <input value={cardExp} onChange={e => setCardExp(e.target.value)} placeholder="MM/YY" maxLength={5} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">CVC</label>
                                    <input value={cardCvc} onChange={e => setCardCvc(e.target.value)} placeholder="123" maxLength={4} type="password" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition" required />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-3">
                                {ewallets.map(ew => (
                                    <div key={ew.id} onClick={() => setSelectedEwallet(ew.id)} className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center gap-2 transition-all ${selectedEwallet === ew.id ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                                        <div className="h-8 flex items-center justify-center overflow-hidden"><img src={ew.logo} alt={ew.name} className="h-full object-contain" /></div>
                                        <p className="text-xs font-bold text-center text-slate-700">{ew.name}</p>
                                    </div>
                                ))}
                            </div>
                            {selectedEwallet && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">E-Wallet Phone Number</label>
                                    <div className="relative">
                                        <input value={ewalletPhone} onChange={e => setEwalletPhone(e.target.value)} placeholder="0812..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition" required />
                                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">We will send a verification request to this number.</p>
                                </motion.div>
                            )}
                        </div>
                    )}

                    <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 transform hover:-translate-y-1 transition-all">
                        {methodType === 'card' ? 'Add Credit Card' : 'Connect E-Wallet'}
                    </button>
                </form>
            </div>
        </Modal>
    );
}


