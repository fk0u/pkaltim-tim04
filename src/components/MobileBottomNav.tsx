import { LayoutDashboard, Calendar, Camera, History, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function MobileBottomNav() {
    const router = useRouter();
    const isActive = (path: string) => router.pathname === path || (path !== '/' && router.pathname.startsWith(path));

    // Special handling for dashboard tabs if we are on dashboard
    const isDashboard = router.pathname.startsWith('/dashboard/client');
    const toggleDashboardTab = (tab: string) => {
        // If we want detailed deep linking, we'd use query params ?tab=x
        // For now, let's just route to basic pages
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-6 py-2 lg:hidden z-50 flex justify-between items-end pb-5 pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <Link href="/" className={`flex flex-col items-center gap-1 transition-all duration-300 w-16 ${router.pathname === '/' ? 'text-emerald-600 -translate-y-2' : 'text-gray-400'}`}>
                <div className={`p-2 rounded-2xl transition-all ${router.pathname === '/' ? 'bg-emerald-50' : 'bg-transparent'}`}>
                    <LayoutDashboard className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold">Home</span>
            </Link>

            <Link href="/packages" className={`flex flex-col items-center gap-1 transition-all duration-300 w-16 ${router.pathname.startsWith('/packages') ? 'text-emerald-600 -translate-y-2' : 'text-gray-400'}`}>
                <div className={`p-2 rounded-2xl transition-all ${router.pathname.startsWith('/packages') ? 'bg-emerald-50' : 'bg-transparent'}`}>
                    <Calendar className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold">Explore</span>
            </Link>

            {/* Center FAB */}
            <div className="relative -top-6">
                <Link href="/scan">
                    <button className={`w-14 h-14 rounded-full text-white shadow-xl shadow-emerald-300 flex items-center justify-center hover:scale-105 active:scale-95 transition-all border-4 border-white ring-1 ring-gray-100 ${router.pathname === '/scan' ? 'bg-emerald-700' : 'bg-emerald-600'}`}>
                        <Camera className="w-6 h-6" />
                    </button>
                </Link>
            </div>

            <Link href="/history" className={`flex flex-col items-center gap-1 transition-all duration-300 w-16 ${router.pathname === '/history' ? 'text-emerald-600 -translate-y-2' : 'text-gray-400'}`}>
                <div className={`p-2 rounded-2xl transition-all ${router.pathname === '/history' ? 'bg-emerald-50' : 'bg-transparent'}`}>
                    <History className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold">History</span>
            </Link>

            <Link href="/dashboard/client" className={`flex flex-col items-center gap-1 transition-all duration-300 w-16 ${router.pathname.startsWith('/dashboard') ? 'text-emerald-600 -translate-y-2' : 'text-gray-400'}`}>
                <div className={`p-2 rounded-2xl transition-all ${router.pathname.startsWith('/dashboard') ? 'bg-emerald-50' : 'bg-transparent'}`}>
                    <User className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold">Me</span>
            </Link>
        </div>
    );
}
