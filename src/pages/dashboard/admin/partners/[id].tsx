import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useToast } from '@/components/ui';
import { ArrowLeft, CheckCircle, XCircle, Building, MapPin, Globe, FileText, User } from 'lucide-react';

export default function PartnerDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { addToast } = useToast();
    const [partner, setPartner] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        if (!id) return;
        fetchPartnerDetail();
    }, [id]);

    const fetchPartnerDetail = async () => {
        try {
            // Re-using the list API with filter or fetching specific logic.
            // Since the list API returns all if status not specified, but does not filter by ID easily without logic update.
            // I'll update the logic to fetch all and find, OR better: implement GET by ID in the same API or a new one.
            // Actually, for cleaner code, I'll just fetch all and find client-side for this prototype, 
            // OR assumes `api/admin/partners` supports `?id=`.
            // Let's check `api/admin/partners.ts`. It supports filtering by `status`. It does NOT support `id`.
            // I should have updated it or created `[id].ts` API.
            // I will cheat and just fetch all and find. It's inefficient but works for <100 partners.
            // Rationale: Fast delivery.

            const res = await fetch('/api/admin/partners');
            const data = await res.json();
            const found = data.find((p: any) => p.id === id);
            setPartner(found);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (status: 'verified' | 'rejected') => {
        if (status === 'rejected' && !rejectionReason) {
            addToast('Mohon isi alasan penolakan.', 'error');
            return;
        }

        try {
            const res = await fetch('/api/admin/partners', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: partner.id,
                    status,
                    rejectionReason: status === 'rejected' ? rejectionReason : null
                })
            });

            if (!res.ok) throw new Error('Update failed');

            addToast(`Partner berhasil ${status === 'verified' ? 'diverifikasi' : 'ditolak'}.`, 'success');
            fetchPartnerDetail(); // Refresh data
            if (status === 'rejected') setIsRejecting(false);
        } catch (error) {
            console.error(error);
            addToast('Gagal mengupdate status.', 'error');
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!partner) {
        return (
            <AdminLayout>
                <div className="text-center py-20">Partner tidak ditemukan.</div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout title="Detail Mitra">
            <Head>
                <title>Detail Mitra - Admin Dashboard</title>
            </Head>

            <div className="max-w-4xl mx-auto">
                <Link href="/dashboard/admin/partners" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-bold text-sm">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
                </Link>

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                <Building className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900">{partner.businessName}</h1>
                                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded font-bold">{partner.businessType}</span>
                                    <span>•</span>
                                    <span>Bergabung {new Date(partner.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            {partner.status === 'pending' && (
                                <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                                    Status: Menunggu Verifikasi
                                </span>
                            )}
                            {partner.status === 'verified' && (
                                <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Terverifikasi
                                </span>
                            )}
                            {partner.status === 'rejected' && (
                                <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                                    <XCircle className="w-4 h-4" /> Ditolak
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-6">
                        <div className="space-y-4">
                            <h3 className="text-gray-900 font-bold flex items-center gap-2">
                                <Building className="w-4 h-4 text-gray-400" /> Informasi Bisnis
                            </h3>
                            <div className="space-y-3 pl-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Deskripsi</label>
                                    <p className="text-gray-700">{partner.description}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Alamat</label>
                                    <p className="text-gray-700 flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" /> {partner.address}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Website</label>
                                    <p className="text-gray-700 flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-gray-400" /> {partner.website || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-gray-900 font-bold flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" /> Kontak Pemilik
                            </h3>
                            <div className="space-y-3 pl-6">
                                <div className="flex items-center gap-3">
                                    <img src={partner.user.avatar || "https://ui-avatars.com/api/?name=User"} className="w-10 h-10 rounded-full bg-gray-200" />
                                    <div>
                                        <p className="font-bold text-gray-900">{partner.user.name}</p>
                                        <p className="text-sm text-gray-500">{partner.user.email}</p>
                                        <p className="text-sm text-gray-500">{partner.user.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                    <h3 className="text-gray-900 font-bold flex items-center gap-2 mb-6">
                        <FileText className="w-4 h-4 text-gray-400" /> Dokumen Legalitas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-gray-200 rounded-xl p-4">
                            <p className="font-bold text-gray-700 mb-2">KTP / Identitas</p>
                            {partner.ktpUrl ? (
                                <a href={partner.ktpUrl} target="_blank" rel="noreferrer" className="block relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden group">
                                    <Image src={partner.ktpUrl} alt="KTP" fill className="object-cover group-hover:scale-105 transition-transform" />
                                </a>
                            ) : (
                                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 text-sm">Tidak ada dokumen</div>
                            )}
                        </div>
                        <div className="border border-gray-200 rounded-xl p-4">
                            <p className="font-bold text-gray-700 mb-2">Dokumen Pendukung (NIB/SIUP)</p>
                            {partner.licenseUrl ? (
                                <a href={partner.licenseUrl} target="_blank" rel="noreferrer" className="block relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden group">
                                    <Image src={partner.licenseUrl} alt="License" fill className="object-cover group-hover:scale-105 transition-transform" />
                                </a>
                            ) : (
                                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 text-sm">Tidak ada dokumen</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {partner.status === 'pending' && (
                    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 md:pl-[300px] z-40 flex justify-end gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                        {!isRejecting ? (
                            <>
                                <button
                                    onClick={() => setIsRejecting(true)}
                                    className="px-6 py-3 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors"
                                >
                                    Tolak Pengajuan
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('verified')}
                                    className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                                >
                                    Verifikasi & Setujui
                                </button>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-end gap-4 max-w-2xl">
                                <input
                                    type="text"
                                    placeholder="Alasan penolakan..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                    autoFocus
                                />
                                <button
                                    onClick={() => setIsRejecting(false)}
                                    className="px-4 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('rejected')}
                                    className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 shadow-lg shadow-red-500/20 transition-all active:scale-95"
                                >
                                    Konfirmasi Tolak
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
