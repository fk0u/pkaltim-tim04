import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    LayoutDashboard, Ticket, Package, Settings, LogOut,
    Search, Bell, Menu, X, Globe, MessageSquare, User, Building
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface PartnerLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function PartnerLayout({ children, title }: PartnerLayoutProps) {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const router = useRouter();
    const { toggleLanguage, locale, t } = useLanguage();

    // Protect Partner Route
    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (user.role !== 'mitra') {
            router.push(`/dashboard/${user.role === 'admin' ? 'admin' : 'client'}`);
        }
    }, [user, router]);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard/partner' },
        { icon: Ticket, label: 'My Events', href: '/dashboard/partner/events' },
        { icon: Package, label: 'My Packages', href: '/dashboard/partner/packages' },
        { icon: Building, label: 'Business Profile', href: '/dashboard/partner/profile' },
        { icon: MessageSquare, label: 'Support', href: '/dashboard/partner/support' },
        { icon: Settings, label: 'Settings', href: '/dashboard/partner/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            {/* SIDEBAR */}
            <aside
                className={`bg-indigo-900 text-white fixed h-full z-30 hidden md:flex flex-col shadow-2xl transition-all duration-300 ${isSidebarOpen ? 'w-[280px]' : 'w-[80px]'}`}
            >
                <div className="h-20 flex items-center px-8 border-b border-indigo-800">
                    <AnimatePresence mode='wait'>
                        {isSidebarOpen ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 font-black text-2xl tracking-tight"
                            >
                                Partner<span className="text-indigo-400">.</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="font-black text-2xl text-indigo-400"
                            >
                                P.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="flex-1 py-8 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = router.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive ? 'bg-indigo-600 shadow-lg shadow-indigo-900/50' : 'hover:bg-indigo-800/50 text-indigo-100/70 hover:text-white'}`}
                            >
                                <item.icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-indigo-400 group-hover:text-white'}`} />
                                {isSidebarOpen && (
                                    <span
                                        className="font-bold text-sm tracking-wide animate-in fade-in slide-in-from-left-2 duration-300"
                                    >
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-indigo-800">
                    <button
                        onClick={logout}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-300 hover:text-red-100 transition-all ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span className="font-bold text-sm">{t.admin?.sidebar?.logout || "Sign Out"}</span>}
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'md:ml-[280px]' : 'md:ml-[80px]'}`}>

                {/* TOP HEADER */}
                <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hidden md:block transition">
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 hidden sm:block">{title || 'Partner Dashboard'}</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <button onClick={toggleLanguage} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 font-bold text-xs flex items-center gap-1">
                                <Globe className="w-4 h-4" /> {locale.toUpperCase()}
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-gray-900 leading-none">{user?.name}</p>
                                    <p className="text-xs text-gray-500 font-medium uppercase mt-1">Partner</p>
                                </div>
                                <img src={user?.avatar || "https://ui-avatars.com/api/?name=Partner"} alt="Profile" className="w-10 h-10 rounded-full border-2 border-indigo-100" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* CONTENT */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
