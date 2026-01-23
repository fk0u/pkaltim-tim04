import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useContent } from '@/contexts/ContentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, CheckCircle, ArrowRight, Wallet, Bell, Settings, Star, ChevronRight, Share2, Heart, Camera, Trophy, User, LogOut, FileText, CreditCard, LayoutDashboard, MessageSquare, History, Menu, X, Phone, Ticket, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState, useEffect, FormEvent } from 'react';
import { useToast, Skeleton, ShareModal } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import Link from 'next/link';
import { Booking, TourPackage, User as UserType } from '@/types';

export default function ClientDashboard() {
    const { user, logout, isAuthenticated } = useAuth();
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
        if (!isAuthenticated) router.push('/login');
        // Type assertion for role check if needed, or rely on AuthContext type
        if (user && (user.role as string) !== 'Customer' && (user.role as string) !== 'client') {
            // Fallback for case mismatch in mock data vs types
            router.push(`/dashboard/${user.role}`);
        }

        // Sync tab from URL
        if (router.query.tab) {
            setActiveTab(router.query.tab as string);
        }
    }, [isAuthenticated, user, router]);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewView
                    user={user as unknown as UserType}
                    t={t}
                    activeTrip={activeTrip}
                    setActiveModal={setActiveModal}
                    packages={packages}
                    locale={locale}
                    router={router}
                    stats={stats}
                />;
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
            default:
                // Fallback to overview w/ required props
                return <OverviewView
                    user={user as unknown as UserType}
                    t={t}
                    activeTrip={activeTrip}
                    setActiveModal={setActiveModal}
                    packages={packages}
                    locale={locale}
                    router={router}
                    stats={stats}
                />;
        }
    };





    return (
        <Layout
            title={`Dashboard - ${user.name}`}
            hideFooter={true}
        >
            <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row lg:pt-16">

                {/* SIDEBAR - DESKTOP ONLY */}
                <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-100 fixed h-[calc(100vh-64px)] top-16 left-0 z-30 shadow-xl shadow-gray-200/50 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-72'}`}>
                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 text-gray-500 hover:text-emerald-600 shadow-sm z-50"
                    >
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
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                title={isSidebarCollapsed ? item.label : ''}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 font-bold text-sm group relative overflow-hidden
                                    ${activeTab === item.id
                                        ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                                    ${isSidebarCollapsed ? 'justify-center' : ''}`}
                            >
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
                        <button
                            onClick={handleLogout}
                            title={isSidebarCollapsed ? t.dashboard.logout : ''}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-all font-bold text-sm bg-red-50/50 ${isSidebarCollapsed ? 'justify-center' : ''}`}
                        >
                            <LogOut className="w-5 h-5" />
                            {!isSidebarCollapsed && t.dashboard.logout}
                        </button>
                    </div>
                </aside>

                {/* MOBILE HEADER - FLUTTER STYLE */}
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


                {/* MAIN CONTENT AREA */}
                <main className={`flex-1 bg-gray-50 min-h-screen transition-all duration-300 pt-20 pb-24 lg:pt-0 lg:pb-12 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>



            </div>

            {/* MODALS REUSED */}
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

            {/* ADD CARD MODAL */}
            <Modal isOpen={activeModal === 'add_card'} onClose={() => setActiveModal(null)} title={t.dashboard.addNewCard}>
                <div className="space-y-6">
                    {/* Card Preview (Flippable) */}
                    <div className="group perspective-1000 h-48 w-full cursor-pointer" onClick={(e) => e.currentTarget.classList.toggle('rotate-y-180')}>
                        <div className="relative w-full h-full text-white transition-all duration-700 transform style-preserve-3d group-hover:rotate-y-6">
                            {/* Front */}
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

                    {/* Form */}
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); addToast('Card added successfully', 'success'); setActiveModal(null); }}>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.dashboard.cardHolder}</label>
                            <input type="text" placeholder="John Doe" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-emerald-500 font-mono" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.dashboard.expiryDate}</label>
                                <input type="text" placeholder="MM/YY" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-emerald-500" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVC</label>
                                <input type="text" placeholder="123" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-emerald-500" />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all hover:-translate-y-1">Add Card</button>
                    </form>
                </div>
            </Modal>

            {/* SHARE MODAL */}
            <ShareModal
                isOpen={activeModal === 'share_event'}
                onClose={() => setActiveModal(null)}
                title="Share this Trip"
                url="https://borneotrip.com/trips/123"
            />
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
    addToast: any;
}

interface ChatProps {
    user: UserType;
    t: any;
}


// --- SUB-COMPONENTS ---

function OverviewView({ user, t, activeTrip, setActiveModal, packages, locale, router, stats }: OverviewProps) {
    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">{t.dashboard.welcome} <span className="text-emerald-600">{user.name.split(' ')[0]}</span> 👋</h1>
                <p className="text-slate-500">{t.dashboard.ready}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="text-xs text-gray-400 font-bold uppercase mb-2">{t.dashboard.totalXp}</div>
                    <div className="text-2xl font-black text-slate-900">2,450</div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="text-xs text-gray-400 font-bold uppercase mb-2">Bookings</div>
                    <div className="text-2xl font-black text-slate-900">{stats.totalBookings}</div>
                </div>
                {/* More stats... */}
            </div>

            {/* Active Trip */}
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

            {/* Recommended */}
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
            <div className="flex justify-between items-end">
                <h2 className="text-2xl font-bold text-slate-900">{t.dashboard.myBookings}</h2>
            </div>

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
                                            <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                                                <Calendar className="w-4 h-4 text-emerald-500" /> {new Date(booking.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Location</p>
                                            <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                                                <MapPin className="w-4 h-4 text-emerald-500" /> {booking.location?.split(',')[0]}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Travelers</p>
                                            <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                                                <User className="w-4 h-4 text-emerald-500" /> {booking.totalPax} Pax
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                                    <button onClick={() => router.push(`/dashboard/vouchers/${booking.id}`)} className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
                                        <Ticket className="w-4 h-4" /> View Voucher
                                    </button>
                                    <button onClick={() => router.push(`/dashboard/vouchers/${booking.id}?tab=invoice`)} className="flex-1 bg-white border border-gray-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition flex items-center justify-center gap-2">
                                        <FileText className="w-4 h-4" /> Invoice
                                    </button>
                                    <button onClick={() => router.push(`/packages`)} className="px-4 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition border border-transparent hover:border-emerald-100">
                                        Book Again
                                    </button>
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
    if (bookings.length === 0) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">{t.dashboard.transactionHistory}</h2>
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"><History className="w-8 h-8" /></div>
                    <p className="text-gray-500 font-medium">{t.dashboard.noBookings}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">{t.dashboard.transactionHistory}</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider">ID & Date</th>
                                <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider">Item</th>
                                <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Amount</th>
                                <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider text-center">Status</th>
                                <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition group">
                                    <td className="p-5">
                                        <div className="font-mono font-bold text-slate-900 mb-0.5">#{booking.id}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(booking.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="font-bold text-slate-900 mb-0.5 line-clamp-1">{booking.productName}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                            <MapPin className="w-3 h-3" />
                                            {booking.location?.split(',')[0]}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right font-bold text-slate-900">
                                        Rp {(booking.amount / 1000).toLocaleString('id-ID')}k
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${booking.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                                            booking.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="p-5 text-center">
                                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/dashboard/vouchers/${booking.id}?tab=ticket`} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition" title="E-Ticket">
                                                <Ticket className="w-4 h-4" />
                                            </Link>
                                            <Link href={`/dashboard/vouchers/${booking.id}?tab=invoice`} className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition" title="Invoice">
                                                <FileText className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
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
                    <form className="space-y-6" onSubmit={(e: FormEvent) => { e.preventDefault(); addToast('Profile updated (Mock)', 'success'); setIsEditing(false); }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.dashboard.fullName}</label>
                                <input type="text" defaultValue={user.name} className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.dashboard.email}</label>
                                <input type="email" defaultValue={user.email} className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-500" disabled />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.dashboard.phone}</label>
                                <input type="tel" placeholder="+62..." className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.dashboard.idNumber}</label>
                                <input type="text" placeholder="16 digit NIK" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.dashboard.bio}</label>
                            <textarea className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-medium h-24" placeholder="Tell us about yourself..."></textarea>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={() => setIsEditing(false)} className="text-gray-500 font-bold hover:text-gray-900 transition">{t.dashboard.cancel}</button>
                            <button type="submit" className="bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-200">{t.dashboard.saveChanges}</button>
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
                <button onClick={() => setIsEditing(true)} className="text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition">
                    {t.dashboard.editProfile}
                </button>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none"><User className="w-64 h-64" /></div>

                <div className="flex flex-col items-center text-center mb-8 relative z-10">
                    <div className="p-1 bg-white/50 backdrop-blur-sm rounded-full mb-4">
                        <img src={user.avatar} className="w-28 h-28 rounded-full border-4 border-emerald-50 shadow-lg object-cover" alt="Profile" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">{user.name}</h3>
                    <p className="text-slate-500 font-medium mb-3">{user.email}</p>
                    <div className="flex gap-2">
                        <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Verified Traveler
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 mb-8">
                    <div className="p-5 bg-gray-50 rounded-2xl flex items-center gap-4 border border-gray-100">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm"><Phone className="w-6 h-6" /></div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.dashboard.phone}</p>
                            <p className="font-bold text-slate-900 text-lg">+62 812 3456 7890</p>
                        </div>
                    </div>
                    <div className="p-5 bg-gray-50 rounded-2xl flex items-center gap-4 border border-gray-100">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm"><CreditCard className="w-6 h-6" /></div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.dashboard.idNumber}</p>
                            <p className="font-bold text-slate-900 text-lg">6472012345678901</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 relative z-10">
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Account Security</h4>
                        <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                            <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition text-left">
                                <span className="text-sm font-bold text-slate-700">Change Password</span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition text-left">
                                <span className="text-sm font-bold text-slate-700">Two-Factor Authentication</span>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Enabled</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Settings className="w-4 h-4 text-emerald-500" /> Preferences</h4>
                        <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                            <div className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                                <span className="text-sm font-bold text-slate-700">Email Notifications</span>
                                <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div></div>
                            </div>
                            <div className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                                <span className="text-sm font-bold text-slate-700">Language</span>
                                <span className="text-xs font-bold text-gray-500">English (US)</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function PaymentsView({ t, setActiveModal }: { t: any, setActiveModal: (id: string) => void }) {
    return (
        <div className="space-y-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900">{t.dashboard.paymentMethods}</h2>

            <div className="grid gap-6">
                {/* Method 1: Credit Card */}
                <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group perspective-1000 transition-transform duration-500 hover:rotate-y-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><CreditCard className="w-32 h-32" /></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="w-12 h-auto" alt="Mastercard" />
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Primary</span>
                        </div>
                        <p className="font-mono opacity-80 mb-8 text-xl tracking-widest text-shadow">**** **** **** 4242</p>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] uppercase opacity-60 mb-1 tracking-wider">{t.dashboard.cardHolder}</p>
                                <p className="font-bold tracking-wide">JOHN DOE</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase opacity-60 mb-1 tracking-wider">{t.dashboard.expiryDate}</p>
                                <p className="font-bold tracking-wide">12/28</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Method 2: E-Wallet */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center p-3">
                            <Wallet className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">GoPay E-Wallet</h4>
                            <p className="text-sm text-gray-500 font-mono">0812 **** 7890</p>
                        </div>
                    </div>
                    <button className="text-sm font-bold text-red-500 hover:text-red-700 transition">Remove</button>
                </div>
            </div>

            <button
                onClick={() => setActiveModal('add_card')}
                className="w-full border-2 border-dashed border-gray-200 rounded-3xl p-6 text-gray-400 font-bold hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition flex items-center justify-center gap-2 group"
            >
                <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center text-gray-400 transition">+</div>
                {t.dashboard.addNewCard}
            </button>
        </div>
    );
}

function ChatView({ user, t }: ChatProps) {
    const [messages, setMessages] = useState([
        { id: 1, text: "Halo! Ada yang bisa kami bantu hari ini?", sender: 'agent', time: '10:00' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages(prev => [...prev, { id: Date.now(), text: input, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setInput('');

        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Terima kasih, tim kami akan segera membalas.", sender: 'agent', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }, 2000);
    };

    return (
        <div className="h-[calc(100vh-140px)] bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-white shadow-sm z-10">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xl border-4 border-emerald-50">BS</div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900">BorneoTrip Support</h4>
                    <p className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">Online • Typically replies instantly</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                <div className="text-center text-xs font-bold text-gray-300 uppercase tracking-widest my-4">Today</div>

                {messages.map(m => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={m.id}
                        className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[75%] p-4 rounded-2xl text-sm shadow-sm ${m.sender === 'user' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm'}`}>
                            <p className="leading-relaxed">{m.text}</p>
                            <p className={`text-[10px] mt-2 text-right opacity-70`}>{m.time}</p>
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 items-center">
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></span>
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </motion.div>
                )}
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-3 items-end">
                <div className="flex-1 bg-gray-100 rounded-2xl flex items-center px-4 border border-transparent focus-within:border-emerald-200 focus-within:bg-white transition-all">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={t.dashboard.typeMessage}
                        className="flex-1 bg-transparent border-0 py-4 focus:ring-0 text-sm font-medium"
                    />
                    <button type="button" className="text-gray-400 hover:text-emerald-600 transition"><Camera className="w-5 h-5" /></button>
                </div>
                <button type="submit" disabled={!input.trim()} className="bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-2xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"><MessageSquare className="w-5 h-5" /></button>
            </form>
        </div>
    );
}
