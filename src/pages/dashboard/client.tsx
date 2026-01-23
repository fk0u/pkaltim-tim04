import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useContent } from '@/contexts/ContentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, CheckCircle, ArrowRight, Wallet, Bell, Settings, Star, ChevronRight, Share2, Heart, Camera, Trophy, User, LogOut, FileText, CreditCard, LayoutDashboard, MessageSquare, History, Menu, X, Phone } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState, useEffect, FormEvent } from 'react';
import { useToast, Skeleton } from '@/components/ui';
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
                return <PaymentsView t={t} addToast={addToast} />;
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

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);



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
                            <button className="text-sm font-bold text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all">
                                {t.dashboard.openVoucher} <ArrowRight className="w-4 h-4" />
                            </button>
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
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">{t.dashboard.myBookings}</h2>
            {bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"><Calendar className="w-8 h-8" /></div>
                    <h3 className="font-bold text-gray-900 mb-2">{t.dashboard.noBookings}</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mb-6">{t.dashboard.bookingsDesc}</p>
                    <button onClick={() => router.push('/packages')} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold">{t.dashboard.findPackage}</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-32 h-32 rounded-2xl bg-gray-200 overflow-hidden shrink-0">
                                <img src={booking.productImage} className="w-full h-full object-cover" alt="img" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{booking.productName}</h3>
                                        <p className="text-sm text-slate-500">{new Date(booking.date).toLocaleDateString()} • {booking.totalPax} Pax</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{booking.status}</span>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="font-bold text-slate-900">IDR {booking.amount.toLocaleString('id-ID')}</p>
                                    <button className="text-sm font-bold text-emerald-600 border border-emerald-200 px-4 py-2 rounded-xl hover:bg-emerald-50 transition">Details</button>
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
                <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                    <p className="text-gray-400 font-medium">{t.dashboard.noBookings}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">{t.dashboard.transactionHistory}</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-5 font-bold text-gray-500">ID</th>
                            <th className="p-5 font-bold text-gray-500">Date</th>
                            <th className="p-5 font-bold text-gray-500">Item</th>
                            <th className="p-5 font-bold text-gray-500 text-right">Amount</th>
                            <th className="p-5 font-bold text-gray-500 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50 transition">
                                <td className="p-5 font-mono text-gray-600">{booking.id}</td>
                                <td className="p-5 text-gray-900">{new Date(booking.date).toLocaleDateString()}</td>
                                <td className="p-5 font-medium text-gray-900">{booking.productName}</td>
                                <td className="p-5 text-right font-bold text-gray-900">Rp {(booking.amount / 1000).toLocaleString('id-ID')}k</td>
                                <td className="p-5 text-center"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">{booking.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ProfileView({ user, t, addToast }: ProfileProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">{isEditing ? t.dashboard.editProfile : t.dashboard.myProfile}</h2>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition">
                        {t.dashboard.editProfile}
                    </button>
                )}
            </div>

            {isEditing ? (
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
            ) : (
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
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

                    <div className="mt-8 pt-8 border-t border-gray-100 relative z-10">
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Achievements</h4>
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="min-w-[100px] h-24 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center text-center p-2 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition cursor-help">
                                    <div className="text-2xl mb-1">🏔️</div>
                                    <p className="text-[10px] font-bold text-emerald-800 leading-tight">Borneo Explorer</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function PaymentsView({ t, addToast }: PaymentsProps) {
    return (
        <div className="space-y-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900">{t.dashboard.paymentMethods}</h2>
            <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><CreditCard className="w-32 h-32" /></div>
                <p className="font-mono opacity-60 mb-8">**** **** **** 4242</p>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs uppercase opacity-60 mb-1">{t.dashboard.cardHolder}</p>
                        <p className="font-bold">JOHN DOE</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase opacity-60 mb-1">{t.dashboard.expiryDate}</p>
                        <p className="font-bold">12/28</p>
                    </div>
                </div>
            </div>

            <button className="w-full border-2 border-dashed border-gray-200 rounded-3xl p-6 text-gray-400 font-bold hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition flex items-center justify-center gap-2" onClick={() => addToast('Add Card Mock', 'info')}>
                <div className="w-8 h-8 rounded-full bg-current flex items-center justify-center text-white">+</div>
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

    const handleSend = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages(prev => [...prev, { id: Date.now(), text: input, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setInput('');
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Terima kasih, tim kami akan segera membalas.", sender: 'agent', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }, 1000);
    };

    return (
        <div className="h-[calc(100vh-140px)] bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">BS</div>
                <div>
                    <h4 className="font-bold text-slate-900">{t.dashboard.supportAgent}</h4>
                    <p className="text-xs text-emerald-500 font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> {t.dashboard.online}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${m.sender === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'}`}>
                            <p>{m.text}</p>
                            <p className={`text-[10px] mt-1 text-right ${m.sender === 'user' ? 'text-emerald-200' : 'text-gray-400'}`}>{m.time}</p>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={t.dashboard.typeMessage}
                    className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500"
                />
                <button type="submit" className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition"><MessageSquare className="w-5 h-5" /></button>
            </form>
        </div>
    );
}
