import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useToast } from '@/components/ui';
import { CheckCircle, XCircle, Calendar, MapPin, DollarSign, User, Package, Clock } from 'lucide-react';

export default function ContentApprovalsPage() {
    const { addToast } = useToast();
    const [events, setEvents] = useState<any[]>([]);
    const [packages, setPackages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'events' | 'packages'>('events');

    useEffect(() => {
        fetchPendingContent();
    }, []);

    const fetchPendingContent = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/approvals?type=all');
            const data = await res.json();
            setEvents(data.events || []);
            setPackages(data.packages || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id: string, type: 'event' | 'package', status: 'approved' | 'rejected') => {
        let note = '';
        if (status === 'rejected') {
            note = prompt('Masukkan alasan penolakan:') || '';
            if (!note) return; // Cancelled
        }

        setProcessingId(id);
        try {
            const res = await fetch('/api/admin/approvals', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, type, status, adminNote: note })
            });

            if (!res.ok) throw new Error('Action failed');

            addToast(`Konten berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`, 'success');
            fetchPendingContent(); // Refresh
        } catch (error) {
            console.error(error);
            addToast('Gagal memproses permintaan.', 'error');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <AdminLayout title="Persetujuan Konten">
            <Head>
                <title>Verifikasi Konten - Admin Dashboard</title>
            </Head>

            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900">Permintaan Publikasi</h1>
                <p className="text-gray-500">Tinjau dan setujui event atau paket wisata dari mitra.</p>
            </div>

            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('events')}
                    className={`pb-3 px-2 font-bold text-sm transition-colors border-b-2 ${activeTab === 'events' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Event ({events.length})
                </button>
                <button
                    onClick={() => setActiveTab('packages')}
                    className={`pb-3 px-2 font-bold text-sm transition-colors border-b-2 ${activeTab === 'packages' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Paket Wisata ({packages.length})
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            ) : (activeTab === 'events' && events.length === 0) || (activeTab === 'packages' && packages.length === 0) ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-emerald-100 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Semua Bersih!</h3>
                    <p className="text-gray-500">Tidak ada permintaan {activeTab === 'events' ? 'event' : 'paket'} yang menunggu persetujuan.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {(activeTab === 'events' ? events : packages).map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row">
                            <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-gray-200 shrink-0">
                                {item.imageUrl && (
                                    <Image src={item.imageUrl} alt="Content" fill className="object-cover" />
                                )}
                                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-bold uppercase">
                                    {activeTab === 'events' ? 'Event' : 'Package'}
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 line-clamp-1">{typeof item.title === 'string' ? item.title : item.title?.id}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <User className="w-4 h-4" />
                                            <span className="font-medium text-emerald-600">{item.organizerUser?.name}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.organizerUser?.partnerProfile?.businessName}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6 flex-1">
                                    {activeTab === 'events' ? (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {new Date(item.date).toLocaleDateString()}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            {item.duration}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {item.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        IDR {parseInt(item.price).toLocaleString()}
                                    </div>
                                    <p className="text-gray-500 text-sm line-clamp-2 mt-2">
                                        {typeof item.description === 'string' ? item.description : item.description?.id}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => handleAction(item.id, activeTab === 'events' ? 'event' : 'package', 'rejected')}
                                        disabled={processingId === item.id}
                                        className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 hover:text-red-600 transition disabled:opacity-50"
                                    >
                                        Tolak
                                    </button>
                                    <button
                                        onClick={() => handleAction(item.id, activeTab === 'events' ? 'event' : 'package', 'approved')}
                                        disabled={processingId === item.id}
                                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
                                    >
                                        {processingId === item.id ? 'Memproses...' : 'Setujui'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
