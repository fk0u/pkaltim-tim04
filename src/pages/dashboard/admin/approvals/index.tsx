import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useToast } from '@/components/ui';
import { CheckCircle, XCircle, Clock, Eye, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminApprovalsPage() {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        fetchApprovals();
    }, []);

    const fetchApprovals = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/approvals');
            const data = await res.json();
            if (Array.isArray(data)) setItems(data);
        } catch (error) {
            console.error(error);
            addToast('Gagal memuat data approval', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/approvals', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (!res.ok) throw new Error('Gagal update status');

            setItems(prev => prev.map(item =>
                item.id === id ? { ...item, status: newStatus } : item
            ));
            addToast(`Konten ${newStatus === 'approved' ? 'disetujui' : 'ditolak'}`, 'success');
        } catch (error) {
            console.error(error);
            addToast('Gagal mengubah status', 'error');
        }
    };

    if (isLoading) {
        return (
            <AdminLayout title="Approvals">
                <div className="flex justify-center p-20">
                    <Loader2 className="animate-spin w-8 h-8 text-emerald-600" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Content Approvals">
            <Head>
                <title>Verifikasi Konten - Admin Dashboard</title>
            </Head>

            <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Persetujuan Konten</h1>
                        <p className="text-gray-500">Moderasi event dan paket wisata dari mitra.</p>
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                        <button className="px-4 py-2 bg-gray-100 rounded-md text-sm font-bold text-gray-900 shadow-xs">Semua</button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-md">Pending</button>
                    </div>
                </div>

                <div className="space-y-4">
                    {items.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500">
                            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="font-bold">Semua Bersih!</p>
                            <p className="text-sm">Tidak ada konten yang menunggu persetujuan.</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-48 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt="Content" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-md mb-2">
                                                Tour Package
                                            </span>
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                {typeof item.title === 'string' ? item.title : item.title?.id || item.title?.en}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                By <span className="font-bold text-gray-700">{item.organizer?.partnerProfile?.businessName || item.organizer?.user?.name}</span> • {new Date(item.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {item.status === 'verified' || item.status === 'approved' ? (
                                                <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-full"><CheckCircle className="w-4 h-4" /> Approved</span>
                                            ) : item.status === 'rejected' ? (
                                                <span className="flex items-center gap-1 text-red-600 text-sm font-bold bg-red-50 px-3 py-1 rounded-full"><XCircle className="w-4 h-4" /> Rejected</span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-yellow-600 text-sm font-bold bg-yellow-50 px-3 py-1 rounded-full"><Clock className="w-4 h-4" /> Pending</span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                                        {typeof item.description === 'string' ? item.description : item.description?.id || item.description?.en}
                                    </p>

                                    {item.status === 'pending' && (
                                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                            <button onClick={() => handleAction(item.id, 'approved')} className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-emerald-200 shadow-md">
                                                <CheckCircle className="w-4 h-4" /> Approve
                                            </button>
                                            <button onClick={() => handleAction(item.id, 'rejected')} className="bg-white border border-red-200 text-red-600 px-5 py-2 rounded-lg text-sm font-bold hover:bg-red-50 transition flex items-center gap-2">
                                                <XCircle className="w-4 h-4" /> Reject
                                            </button>
                                            <button className="bg-white border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition flex items-center gap-2 ml-auto">
                                                <Eye className="w-4 h-4" /> Review Details
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
