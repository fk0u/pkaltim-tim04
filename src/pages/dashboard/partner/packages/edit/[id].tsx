import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import PartnerLayout from '@/components/layouts/PartnerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui';
import ImageUpload from '@/components/ui/ImageUpload';
import { ArrowLeft, MapPin, DollarSign, Users, Clock, Plus, Trash, List, CheckSquare, Loader2, Sparkles, Save } from 'lucide-react';

export default function EditPackagePage() {
    const { user } = useAuth();
    const router = useRouter();
    const { id } = router.query;
    const { addToast } = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        duration: '',
        price: '',
        quota: '',
        description: '',
        imageUrl: '',
        facilitiesString: '',
    });

    const [itineraryDays, setItineraryDays] = useState<{ day: number, title: string, activity: string }[]>([]);

    useEffect(() => {
        if (!user || !id) return;
        fetchPackageDetails();
    }, [user, id]);

    const fetchPackageDetails = async () => {
        try {
            const res = await fetch(`/api/partner/packages/${id}`);
            if (!res.ok) throw new Error('Paket tidak ditemukan');
            const data = await res.json();

            setFormData({
                title: typeof data.title === 'string' ? data.title : data.title.id,
                location: data.location,
                duration: data.duration,
                price: data.price.toString(),
                quota: data.quota.toString(),
                description: typeof data.description === 'string' ? data.description : data.description.id,
                imageUrl: data.imageUrl,
                facilitiesString: Array.isArray(data.facilities) ? data.facilities.join(', ') : '',
            });

            if (data.itinerary?.days) {
                setItineraryDays(data.itinerary.days);
            } else if (data.itinerary) {
                // Fallback if structure is different
                setItineraryDays(data.itinerary);
            }

        } catch (error) {
            console.error(error);
            addToast('Gagal mengambil data paket', 'error');
            router.push('/dashboard/partner/packages');
        } finally {
            setIsFetching(false);
        }
    };

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

    const handleAIAutofill = async () => {
        if (!formData.title || !formData.location) {
            addToast('Mohon isi Nama Paket dan Lokasi terlebih dahulu.', 'error');
            return;
        }

        setIsGenerating(true);
        try {
            const res = await fetch('/api/ai/generate-package', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: formData.title, location: formData.location })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Gagal generate konten');

            setFormData(prev => ({
                ...prev,
                description: data.description,
                facilitiesString: data.facilities?.join(', ') || prev.facilitiesString,
                // price: data.priceEstimate?.toString() || prev.price, // Keep existing price generally
                duration: data.duration || prev.duration,
            }));

            if (data.itinerary) setItineraryDays(data.itinerary);

            addToast('Konten diperbarui oleh AI!', 'success');
        } catch (error: any) {
            addToast(error.message, 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const facilities = formData.facilitiesString.split(',').map(s => s.trim()).filter(Boolean);

            const res = await fetch(`/api/partner/packages/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    facilities,
                    itineraryDays
                })
            });

            if (!res.ok) throw new Error('Gagal update paket');

            addToast('Perubahan berhasil disimpan!', 'success');
            router.push('/dashboard/partner/packages');
        } catch (error: any) {
            console.error(error);
            addToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <PartnerLayout>
                <div className="flex justify-center h-96 items-center">
                    <Loader2 className="animate-spin w-8 h-8 text-emerald-600" />
                </div>
            </PartnerLayout>
        );
    }

    return (
        <PartnerLayout title="Edit Paket Wisata">
            <Head>
                <title>Edit Paket - Partner Dashboard</title>
            </Head>

            <div className="max-w-4xl mx-auto">
                <Link href="/dashboard/partner/packages" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-bold text-sm">
                    <ArrowLeft className="w-4 h-4" /> Batal & Kembali
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-black text-gray-900">Edit Paket Wisata</h1>
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                            Editing Mode
                        </span>
                    </div>

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
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-gray-700">Nama Paket</label>
                                    <button
                                        type="button"
                                        onClick={handleAIAutofill}
                                        disabled={isGenerating}
                                        className="text-xs bg-linear-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-full font-bold flex items-center gap-1 hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50"
                                    >
                                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                        {isGenerating ? 'Refining...' : 'Refine with AI'}
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
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
                                <label className="block text-sm font-bold text-gray-700 mb-2">Fasilitas</label>
                                <div className="relative">
                                    <CheckSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <textarea
                                        rows={2}
                                        value={formData.facilitiesString}
                                        onChange={e => setFormData({ ...formData, facilitiesString: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition resize-none"
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
                                />
                            </div>
                        </div>

                        {/* Itinerary Builder */}
                        <div className="border-t border-gray-100 pt-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                    <List className="w-5 h-5 text-emerald-600" /> Rencana Perjalanan
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
                                                value={day.title}
                                                onChange={(e) => updateDay(index, 'title', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none text-sm font-bold"
                                            />
                                            <textarea
                                                rows={2}
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
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                <span>Simpan Perubahan</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </PartnerLayout>
    );
}
