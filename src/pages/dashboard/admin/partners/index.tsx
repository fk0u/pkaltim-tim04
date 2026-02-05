import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Search, CheckCircle, XCircle, Clock, Eye, MoreVertical, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui';

export default function AdminPartnersPage() {
    const { addToast } = useToast();
    const [partners, setPartners] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPartners();
    }, [filterStatus]);

    const fetchPartners = async () => {
        setIsLoading(true);
        try {
            const query = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
            const res = await fetch(`/api/admin/partners${query}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setPartners(data);
            } else {
                setPartners([]);
            }
        } catch (error) {
            console.error(error);
            addToast('Gagal memuat data mitra', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/partners', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (!res.ok) throw new Error('Failed to update');

            setPartners(prev => prev.map(p =>
                p.id === id ? { ...p, status: newStatus } : p
            ));
            addToast(`Status mitra berhasil diperbarui ke ${newStatus}`, 'success');
        } catch (error) {
            addToast('Gagal memperbarui status', 'error');
        }
    };

    const filteredPartners = partners.filter(p =>
        p.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'verified':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3" /> Verified</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3" /> Rejected</span>;
            case 'pending':
            default:
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3" /> Pending</span>;
        }
    };

    if (isLoading) {
        return (
            <AdminLayout title="Kelola Mitra">
                <div className="flex justify-center p-20">
                    <Loader2 className="animate-spin w-8 h-8 text-emerald-600" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Kelola Mitra (Partners)">
            <Head>
                <title>Mitra / Partner - Admin Dashboard</title>
            </Head>

            <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Mitra Terdaftar</h1>
                        <p className="text-gray-500">Verifikasi dan kelola akun mitra wisata.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari mitra..."
                                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">Menunggu Verifikasi</option>
                            <option value="verified">Terverifikasi</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Bisnis / Nama</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Website</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tanggal Gabung</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPartners.length > 0 ? (
                                filteredPartners.map((partner) => (
                                    <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                                                    {partner.businessName?.substring(0, 1) || 'P'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{partner.businessName}</p>
                                                    <p className="text-xs text-gray-500">{partner.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {partner.website || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(partner.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(partner.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {partner.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(partner.id, 'verified')}
                                                            className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(partner.id, 'rejected')}
                                                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button className="text-gray-400 hover:bg-gray-100 p-2 rounded-lg transition">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        Tidak ada data mitra ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
