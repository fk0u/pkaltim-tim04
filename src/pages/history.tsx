import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, MapPin, Search, Filter, Download, ChevronRight, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function HistoryPage() {
    const { user, isAuthenticated } = useAuth();
    const { getBookingsByUserId } = useBooking();
    const router = useRouter();
    const [filter, setFilter] = useState('All');
    const { t } = useLanguage();

    useEffect(() => {
        if (!isAuthenticated) router.push('/login');
    }, [isAuthenticated, router]);

    if (!user) return null;

    const bookings = getBookingsByUserId(user.id);

    const filteredBookings = filter === 'All'
        ? bookings
        : bookings.filter(b => b.status === filter);

    return (
        <Layout title={`${t.history.title} - BorneoTrip`}>
            <div className="bg-gray-50 min-h-screen pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/dashboard/client" className="p-2 rounded-full bg-white hover:bg-gray-100 transition shadow-sm">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{t.history.title}</h1>
                            <p className="text-gray-500 text-sm">{t.history.subtitle}</p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                        {['All', 'Paid', 'Pending', 'Completed', 'Cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filter === status
                                    ? 'glass-dark text-white shadow-lg shadow-emerald-200/50'
                                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {status === 'All' ? t.history.filter.all : status}
                            </button>
                        ))}
                    </div>

                    {/* Booking List */}
                    <div className="space-y-4">
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking, idx) => (
                                <motion.div
                                    key={booking.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="glass-panel rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group bg-white/60"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Image Thumbnail */}
                                        <div className="w-full md:w-32 h-32 rounded-xl bg-gray-100 overflow-hidden relative shrink-0">
                                            <img src={booking.productImage} alt={booking.productName} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                            <div className="absolute top-2 left-2 bg-black/50 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-white">
                                                {booking.productName.includes('Ticket') ? 'EVENT' : 'TRIP'}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{booking.productName}</h3>
                                                    <p className="text-xs text-gray-400 font-mono">{t.history.card.id}: {booking.id}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${booking.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
                                                    booking.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4 text-emerald-500" />
                                                    {new Date(booking.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4 text-emerald-500" />
                                                    {booking.location}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                <div className="text-sm">
                                                    <span className="text-gray-500">{t.history.card.totalScale}:</span>
                                                    <span className="font-bold text-gray-900 ml-2">Rp {booking.amount.toLocaleString('id-ID')}</span>
                                                </div>
                                                <Link
                                                    href={`/invoice/${booking.id}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold hover:bg-emerald-100 transition"
                                                >
                                                    <FileText className="w-4 h-4" /> {t.history.card.invoiceBtn}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{t.history.empty.title}</h3>
                                <p className="text-gray-500 mb-6">{t.history.empty.subtitle}</p>
                                <Link href="/" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition">
                                    {t.history.empty.btn}
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </Layout>
    );
}
