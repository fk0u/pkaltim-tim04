import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    LayoutDashboard, Users, ShoppingBag, Settings, LogOut,
    Search, Bell, Menu, X, ChevronRight, Globe, Package, MapPin, MessageSquare
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const router = useRouter();
    const { toggleLanguage, locale } = useLanguage();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard/admin' },
        { icon: Package, label: 'Products', href: '/dashboard/admin/products' },
        { icon: MapPin, label: 'Destinations', href: '/dashboard/admin/destinations' },
        { icon: ShoppingBag, label: 'Bookings', href: '/dashboard/admin/bookings' },
        { icon: Users, label: 'Customers', href: '/dashboard/admin/customers' },
        { icon: MessageSquare, label: 'Helpdesk', href: '/dashboard/admin/support' },
        { icon: Settings, label: 'Settings', href: '/dashboard/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            {/* SIDEBAR */}
            <aside
                className={`bg-emerald-900 text-white fixed h-full z-30 hidden md:flex flex-col shadow-2xl transition-all duration-300 ${isSidebarOpen ? 'w-[280px]' : 'w-[80px]'}`}
            >
                <div className="h-20 flex items-center px-8 border-b border-emerald-800">
                    <AnimatePresence mode='wait'>
                        {isSidebarOpen ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 font-black text-2xl tracking-tight"
                            >
                                Borneo<span className="text-emerald-400">.</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="font-black text-2xl text-emerald-400"
                            >
                                B.
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
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive ? 'bg-emerald-600 shadow-lg shadow-emerald-900/50' : 'hover:bg-emerald-800/50 text-emerald-100/70 hover:text-white'}`}
                            >
                                <item.icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-emerald-400 group-hover:text-white'}`} />
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

                <div className="p-4 border-t border-emerald-800">
                    <button
                        onClick={logout}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-300 hover:text-red-100 transition-all ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span className="font-bold text-sm">Sign Out</span>}
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
                        {/* Mobile Menu Toggle would go here for small screens */}
                        <h1 className="text-xl font-bold text-gray-800 hidden sm:block">{title || 'Dashboard'}</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden lg:block w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search data..." className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition" />
                        </div>

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
                                    <p className="text-xs text-gray-500 font-medium uppercase mt-1">{user?.role}</p>
                                </div>
                                <img src={user?.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-emerald-100" />
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
