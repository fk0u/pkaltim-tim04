import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PartnerLayout from '@/components/layouts/PartnerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Package, MapPin, Clock, Edit, Trash } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PartnerPackagesPage() {
    const { user } = useAuth();
    const [packages, setPackages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchPackages();
    }, [user]);

    const fetchPackages = async () => {
        try {
            const res = await fetch(`/api/partner/packages?userId=${user?.id}`);
            const data = await res.json();
            if (Array.isArray(data)) setPackages(data);
            else setPackages([]);
        } catch (error) { console.error(error); }
        finally { setIsLoading(false); }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    return (
        <PartnerLayout title="Paket Wisata Saya">
            <Head>
                <title>Kelola Paket - Partner Dashboard</title>
            </Head>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Daftar Paket Wisata</h1>
                    <p className="text-gray-500">Kelola paket trip yang Anda tawarkan.</p>
                </div>
                <Link
                    href="/dashboard/partner/packages/create"
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Buat Paket Baru
                </Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            ) : packages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
                        >
                            <div className="relative h-48 bg-gray-200">
                                {pkg.imageUrl ? (
                                    <img src={pkg.imageUrl} alt={typeof pkg.title === 'string' ? pkg.title : pkg.title?.id} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(pkg.status)}`}>
                                        {pkg.status === 'pending' ? 'Menunggu Review' : pkg.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-1">
                                    {typeof pkg.title === 'string' ? pkg.title : pkg.title?.id}
                                </h3>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        {pkg.duration}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="truncate">{pkg.location}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                    <span className="font-bold text-gray-900">
                                        Rp {pkg.price.toLocaleString('id-ID')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-emerald-600 transition">
                                            <Edit className="w-4 h-4" />
                                        </button>
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
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada Paket</h3>
                    <p className="text-gray-500 mb-6">Tawarkan paket perjalanan menarik untuk turis.</p>
                    <Link
                        href="/dashboard/partner/packages/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors"
                    >
                        Buat Paket Sekarang
                    </Link>
                </div>
            )}
        </PartnerLayout>
    );
}
