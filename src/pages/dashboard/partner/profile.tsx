import { useState, useEffect } from 'react';
import Head from 'next/head';
import PartnerLayout from '@/components/layouts/PartnerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui';
import { User, Building, MapPin, Globe, Loader2, Save, ExternalLink, BadgeCheck, Clock, XCircle } from 'lucide-react';

export default function PartnerProfilePage() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [profile, setProfile] = useState<any>(null);
    const [formData, setFormData] = useState({
        businessName: '',
        businessType: '',
        description: '',
        address: '',
        website: '',
    });

    useEffect(() => {
        if (!user) return;
        fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`/api/partner/profile?userId=${user?.id}`);
            const data = await res.json();
            if (data && data.id) {
                setProfile(data);
                setFormData({
                    businessName: data.businessName || '',
                    businessType: data.businessType || 'Tour Operator',
                    description: data.description || '',
                    address: data.address || '',
                    website: data.website || '',
                });
            }
        } catch (error) {
            console.error(error);
            addToast('Gagal memuat profil', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/partner/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    ...formData
                })
            });

            if (!res.ok) throw new Error('Gagal update profile');
            const updated = await res.json();
            setProfile(updated);
            addToast('Profil berhasil diperbarui', 'success');
        } catch (error: any) {
            addToast(error.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <PartnerLayout>
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="animate-spin w-8 h-8 text-emerald-600" />
                </div>
            </PartnerLayout>
        );
    }

    if (!profile) {
        return (
            <PartnerLayout>
                <div className="text-center py-20">
                    <h3 className="text-xl font-bold">Profil tidak ditemukan</h3>
                    <p className="text-gray-500">Silakan selesaikan onboarding terlebih dahulu.</p>
                </div>
            </PartnerLayout>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'verified':
                return <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full"><BadgeCheck className="w-4 h-4" /> Terverifikasi</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full"><XCircle className="w-4 h-4" /> Ditolak</span>;
            default:
                return <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full"><Clock className="w-4 h-4" /> Menunggu Verifikasi</span>;
        }
    };

    return (
        <PartnerLayout title="Profil Bisnis">
            <Head>
                <title>Profil Partner - BorneoTrip</title>
            </Head>

            <div className="max-w-4xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <img
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${formData.businessName || 'Partner'}&background=random`}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-4 border-indigo-50"
                        />
                        <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md">
                            {getStatusBadge(profile.status)}
                        </div>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-black text-gray-900 mb-1">{formData.businessName}</h1>
                        <p className="text-gray-500 font-medium mb-2">{formData.businessType}</p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-400">
                            <span className="flex items-center gap-1"><User className="w-4 h-4" /> Owner: {user?.name}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Joined: {new Date(profile.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Building className="w-5 h-5 text-indigo-600" /> Informasi Bisnis
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Bisnis</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.businessName}
                                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Usaha</label>
                                    <select
                                        value={formData.businessType}
                                        onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                    >
                                        <option value="Tour Operator">Tour Operator</option>
                                        <option value="Travel Agent">Travel Agent</option>
                                        <option value="Homestay Owner">Homestay Owner</option>
                                        <option value="Guide">Local Guide</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Singkat</label>
                                    <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Lengkap</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <textarea
                                            rows={2}
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition resize-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Website / Social Media URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                            placeholder="https://"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70"
                                    >
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Documents */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Dokumen Legalitas</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">KTP / Identitas</p>
                                    {profile.ktpUrl ? (
                                        <a href={profile.ktpUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">
                                            Lihat Dokumen <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : <span className="text-sm text-red-500 italic">Belum diupload</span>}
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Surat Izin Usaha</p>
                                    {profile.licenseUrl ? (
                                        <a href={profile.licenseUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">
                                            Lihat Dokumen <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : <span className="text-sm text-red-500 italic">Belum diupload</span>}
                                </div>

                                <div className="text-xs text-gray-400 mt-4">
                                    *Untuk mengubah dokumen, silakan hubungi tim support admin BorneoTrip.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PartnerLayout>
    );
}
