import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Search, Filter, MoreVertical, Eye, CheckCircle, XCircle, Clock, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPartnersPage() {
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
                console.error('API returned non-array:', data);
                setPartners([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPartners = partners.filter(p =>
        p.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    return (
        <AdminLayout title="Manajemen Mitra">
            <Head>
                <title>Mitra / Partner - Admin Dashboard</title>
            </Head>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Controls */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari mitra..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none w-64 transition"
                            />
                        </div>
                        <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                            {['all', 'pending', 'verified', 'rejected'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${filterStatus === status ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Bisnis / Usaha</th>
                                <th className="px-6 py-4">Pemilik</th>
                                <th className="px-6 py-4">Tipe</th>
                                <th className="px-6 py-4">Tanggal Daftar</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <AnimatePresence>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center">
                                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                                        </td>
                                    </tr>
                                ) : filteredPartners.length > 0 ? (
                                    filteredPartners.map((partner) => (
                                        <motion.tr
                                            key={partner.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                                        <Building className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{partner.businessName}</p>
                                                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{partner.website || '-'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <img src={partner.user.avatar || `https://ui-avatars.com/api/?name=${partner.user.name}`} className="w-6 h-6 rounded-full" />
                                                    <span className="font-medium text-gray-900">{partner.user.name}</span>
                                                </div>
                                                <p className="text-xs mt-0.5">{partner.user.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{partner.businessType}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(partner.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(partner.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/dashboard/admin/partners/${partner.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors">
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            Tidak ada data mitra ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
