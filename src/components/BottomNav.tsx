import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Search, Compass, User, LayoutDashboard, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function BottomNav() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();

    const navItems = [
        {
            label: 'Home',
            href: '/',
            icon: Home,
        },
        {
            label: 'Explore',
            href: '/packages',
            icon: Compass,
        },
        {
            label: 'Events',
            href: '/events',
            icon: Calendar,
        },
        {
            label: user ? 'Profile' : 'Login',
            href: user ? `/dashboard/${user.role === 'client' ? 'client' : 'admin'}` : '/login',
            icon: user ? LayoutDashboard : User,
        }
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] pb-safe-area-inset-bottom">
            {/* Glassmorphism Background */}
            <div className="glass-dark border-t border-white/10 backdrop-blur-xl bg-black/80">
                <div className="flex justify-around items-center h-16 sm:h-20 px-2 pb-1">
                    {navItems.map((item) => {
                        const isActive = router.pathname === item.href || (item.href !== '/' && router.pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex flex-col items-center justify-center w-full h-full group"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="bottomNavIndicator"
                                        className="absolute -top-[1px] w-12 h-1 bg-emerald-500 rounded-b-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                    />
                                )}

                                <div className={`p-1.5 rounded-xl transition duration-300 ${isActive ? 'text-emerald-400 transform -translate-y-1' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                    <item.icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={isActive ? 2.5 : 2} />
                                </div>

                                <span className={`text-[10px] sm:text-xs font-medium transition-all duration-300 ${isActive ? 'text-emerald-400 transform -translate-y-1' : 'text-gray-500 scale-0 opacity-0 h-0 w-0 group-hover:scale-100 group-hover:opacity-100 group-hover:h-auto group-hover:w-auto'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
