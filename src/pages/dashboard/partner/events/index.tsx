import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PartnerLayout from '@/components/layouts/PartnerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Calendar, MapPin, Clock, Edit, Trash, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PartnerEventsPage() {
    const { user } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchEvents();
    }, [user]);

    const fetchEvents = async () => {
        try {
            const res = await fetch(`/api/partner/events?userId=${user?.id}`);
            const data = await res.json();
            // Handle array vs object response safely
            if (Array.isArray(data)) {
                setEvents(data);
            } else {
                setEvents([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    return (
        <PartnerLayout title="Event Saya">
            <Head>
                <title>Kelola Event - Partner Dashboard</title>
            </Head>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Daftar Event</h1>
                    <p className="text-gray-500">Kelola event yang Anda selenggarakan.</p>
                </div>
                <Link
                    href="/dashboard/partner/events/create"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Buat Event Baru
                </Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
                        >
                            <div className="relative h-48 bg-gray-200">
                                {event.imageUrl ? (
                                    <img src={event.imageUrl} alt={typeof event.title === 'string' ? event.title : event.title?.id} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(event.status)}`}>
                                        {event.status === 'pending' ? 'Menunggu Review' : event.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wide">
                                    <span>{event.category}</span>
                                </div>
                                <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-1">
                                    {typeof event.title === 'string' ? event.title : event.title?.id}
                                </h3>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {new Date(event.date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                    <span className="font-bold text-gray-900">
                                        {event.price === '0' || !event.price ? 'Gratis' : `Rp ${parseInt(event.price).toLocaleString('id-ID')}`}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-indigo-600 transition">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        {/* Only show delete if pending or rejected */}
                                        <button className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500 transition">
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada Event</h3>
                    <p className="text-gray-500 mb-6">Mulailah membuat event pertama Anda untuk menarik audiens.</p>
                    <Link
                        href="/dashboard/partner/events/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors"
                    >
                        Buat Event Sekarang
                    </Link>
                </div>
            )}
        </PartnerLayout>
    );
}
