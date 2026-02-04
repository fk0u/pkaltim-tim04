import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import PartnerLayout from '@/components/layouts/PartnerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui';
import ImageUpload from '@/components/ui/ImageUpload';
import { ArrowLeft, MapPin, DollarSign, Users, Clock, Plus, Trash, List, CheckSquare, Loader2 } from 'lucide-react';

export default function CreatePackagePage() {
    const { user } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Check verification (Simplified copy from events)
    const [isVerified, setIsVerified] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        if (!user) return;
        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/partner/profile?userId=${user.id}`);
                const data = await res.json();
                if (data?.status === 'verified') setIsVerified(true);
                else router.push('/dashboard/partner');
            } catch (error) { console.error(error); }
            finally { setCheckingStatus(false); }
        };
        checkStatus();
    }, [user, router]);

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        duration: '', // e.g. "3 Hari 2 Malam"
        price: '',
        quota: '',
        description: '',
        imageUrl: '',
        facilitiesString: '', // Comma separated for UI
    });

    const [itineraryDays, setItineraryDays] = useState<{ day: number, title: string, activity: string }[]>([
        { day: 1, title: '', activity: '' }
    ]);

    const addDay = () => {
        setItineraryDays([...itineraryDays, { day: itineraryDays.length + 1, title: '', activity: '' }]);
    };

    const removeDay = (index: number) => {
        const newDays = itineraryDays.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }));
        setItineraryDays(newDays);
    };

    const updateDay = (index: number, field: 'title' | 'activity', value: string) => {
        const newDays = [...itineraryDays];
        newDays[index] = { ...newDays[index], [field]: value };
        setItineraryDays(newDays);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.imageUrl) { addToast('Mohon upload gambar paket.', 'error'); return; }

        setIsLoading(true);
        try {
            const facilities = formData.facilitiesString.split(',').map(s => s.trim()).filter(Boolean);

            const res = await fetch('/api/partner/packages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    facilities,
                    itineraryDays,
                    organizerId: user?.id
                })
            });

            if (!res.ok) throw new Error('Gagal membuat paket');

            addToast('Paket Wisata berhasil dibuat! Menunggu persetujuan admin.', 'success');
            router.push('/dashboard/partner/packages');
        } catch (error: any) {
            console.error(error);
            addToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (checkingStatus) return <PartnerLayout><div className="flex justify-center h-96 items-center"><Loader2 className="animate-spin" /></div></PartnerLayout>;
    if (!isVerified) return null;

    return (
        <PartnerLayout title="Buat Paket Wisata">
            <Head>
                <title>Buat Paket - Partner Dashboard</title>
            </Head>

            <div className="max-w-4xl mx-auto">
                <Link href="/dashboard/partner/packages" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-bold text-sm">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Paket
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h1 className="text-2xl font-black text-gray-900 mb-6">Detail Paket Wisata</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Banner Utama</label>
                            <div className="h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-400 transition-colors">
                                <ImageUpload
                                    value={formData.imageUrl}
                                    onChange={(url: string) => setFormData({ ...formData, imageUrl: url })}
                                />
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-full">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Paket</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                                    placeholder="Contoh: 3D2N Derawan Paradise Trip"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi Utama</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Durasi</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                                        placeholder="Contoh: 3 Hari 2 Malam"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Harga per Orang (IDR)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">Rp</span>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Kuota / Stok</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.quota}
                                        onChange={e => setFormData({ ...formData, quota: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Fasilitas (Pisahkan dengan koma)</label>
                                <div className="relative">
                                    <CheckSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <textarea
                                        rows={2}
                                        value={formData.facilitiesString}
                                        onChange={e => setFormData({ ...formData, facilitiesString: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition resize-none"
                                        placeholder="Hotel Bintang 3, Transportasi AC, Makan 7x, Dokumentasi..."
                                    />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Lengkap</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition resize-none"
                                    placeholder="Jelaskan highlight perjalanan..."
                                />
                            </div>
                        </div>

                        {/* Itinerary Builder */}
                        <div className="border-t border-gray-100 pt-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                    <List className="w-5 h-5 text-emerald-600" /> Rencana Perjalanan (Itinerary)
                                </h2>
                                <button type="button" onClick={addDay} className="text-sm font-bold text-emerald-600 hover:text-emerald-500 flex items-center gap-1">
                                    <Plus className="w-4 h-4" /> Tambah Hari
                                </button>
                            </div>

                            <div className="space-y-4">
                                {itineraryDays.map((day, index) => (
                                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4 relative group">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">Hari ke-{day.day}</span>
                                            {index > 0 && (
                                                <button type="button" onClick={() => removeDay(index)} className="text-gray-400 hover:text-red-500 transition">
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Judul (e.g., Kedatangan di Berau)"
                                                value={day.title}
                                                onChange={(e) => updateDay(index, 'title', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none text-sm font-bold"
                                            />
                                            <textarea
                                                rows={2}
                                                placeholder="Detail aktivitas hari ini..."
                                                value={day.activity}
                                                onChange={(e) => updateDay(index, 'activity', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none text-sm resize-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buat Paket Wisata'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </PartnerLayout>
    );
}
