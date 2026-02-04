import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import PartnerLayout from '@/components/layouts/PartnerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, CheckCircle, XCircle, Plus, TrendingUp, Calendar, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PartnerDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/partner/profile?userId=${user.id}`);
                const data = await res.json();
                if (data && data.id) {
                    setProfile(data);
                } else {
                    // No profile found, redirect to onboarding
                    router.push('/dashboard/partner/onboarding');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user, router]);

    if (isLoading) {
        return (
            <PartnerLayout>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </PartnerLayout>
        );
    }

    if (!profile) return null;

    const renderStatusBanner = () => {
        if (profile.status === 'pending') {
            return (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
                    <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 shrink-0">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-yellow-800 mb-1">Menunggu Verifikasi</h3>
                        <p className="text-yellow-700">
                            Pengajuan kemitraan Anda sedang ditinjau oleh tim kami. Anda akan menerima notifikasi email setelah proses verifikasi selesai (estimasi 1x24 jam).
                            Sementara itu, Anda belum dapat mempublikasikan Event atau Paket baru.
                        </p>
                    </div>
                </div>
            );
        }
        if (profile.status === 'rejected') {
            return (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
                    <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-red-800 mb-1">Pengajuan Ditolak</h3>
                        <p className="text-red-700 mb-2">
                            Mohon maaf, pengajuan Anda belum dapat kami setujui saat ini.
                        </p>
                        {profile.rejectionReason && (
                            <div className="bg-white/50 p-3 rounded-lg text-sm text-red-800 font-medium mb-4">
                                Alasan: {profile.rejectionReason}
                            </div>
                        )}
                        <Link href="/dashboard/partner/onboarding" className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition-colors">
                            Ajukan Kembali
                        </Link>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <PartnerLayout title="Dashboard Overview">
            <Head>
                <title>Dashboard Partner - BorneoTrip</title>
            </Head>

            {renderStatusBanner()}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
                    </div>
                    <h3 className="text-gray-500 font-medium text-sm mb-1">Total Pendapatan</h3>
                    <p className="text-2xl font-black text-gray-900">Rp 0</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-pink-50 rounded-xl text-pink-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-gray-500 font-medium text-sm mb-1">Event Aktif</h3>
                    <p className="text-2xl font-black text-gray-900">0</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-gray-500 font-medium text-sm mb-1">Paket Wisata</h3>
                    <p className="text-2xl font-black text-gray-900">0</p>
                </div>
            </div>

            {profile.status === 'verified' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer"
                        onClick={() => router.push('/dashboard/partner/events/create')}
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Buat Event Baru</h3>
                            <p className="text-indigo-100 mb-6">Promosikan event lokal, festival, atau kegiatan menarik.</p>
                            <span className="font-bold text-white bg-white/20 px-4 py-2 rounded-lg backdrop-blur-md">Mulai Sekarang &rarr;</span>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Calendar className="w-48 h-48" />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer"
                        onClick={() => router.push('/dashboard/partner/packages/create')}
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Buat Paket Wisata</h3>
                            <p className="text-emerald-100 mb-6">Tawarkan pengalaman perjalanan lengkap untuk turis.</p>
                            <span className="font-bold text-white bg-white/20 px-4 py-2 rounded-lg backdrop-blur-md">Mulai Sekarang &rarr;</span>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Package className="w-48 h-48" />
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Quick Actions if Pending */}
            {profile.status === 'pending' && (
                <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Lengkapi Profil Anda</h3>
                    <p className="text-gray-500 mb-6">Anda dapat memperbarui informasi bisnis Anda selama menunggu verifikasi.</p>
                    <button className="text-indigo-600 font-bold hover:underline" onClick={() => router.push('/dashboard/partner/profile')}>
                        Edit Profil Bisnis
                    </button>
                </div>
            )}
        </PartnerLayout>
    );
}
