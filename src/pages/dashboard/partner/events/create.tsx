import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import PartnerLayout from '@/components/layouts/PartnerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui';
import ImageUpload from '@/components/ui/ImageUpload'; // Assuming default export
import { ArrowLeft, Calendar, MapPin, Tag, DollarSign, Users, Loader2 } from 'lucide-react';

export default function CreateEventPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Check verification status
    const [isVerified, setIsVerified] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        if (!user) return;
        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/partner/profile?userId=${user.id}`);
                const data = await res.json();
                if (data?.status === 'verified') {
                    setIsVerified(true);
                } else {
                    addToast('Akun Anda belum terverifikasi. Tidak dapat membuat event.', 'error');
                    router.push('/dashboard/partner');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setCheckingStatus(false);
            }
        };
        checkStatus();
    }, [user, router]);

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        date: '',
        description: '',
        category: 'Nature',
        price: '',
        quota: '',
        imageUrl: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.imageUrl) {
            addToast('Mohon upload gambar event.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/partner/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    organizerId: user?.id
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Gagal membuat event');
            }

            addToast('Event berhasil dibuat! Menunggu persetujuan admin.', 'success');
            router.push('/dashboard/partner/events');
        } catch (error: any) {
            console.error(error);
            addToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (checkingStatus) {
        return (
            <PartnerLayout>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </PartnerLayout>
        );
    }

    if (!isVerified) return null;

    return (
        <PartnerLayout title="Buat Event Baru">
            <Head>
                <title>Buat Event - Partner Dashboard</title>
            </Head>

            <div className="max-w-3xl mx-auto">
                <Link href="/dashboard/partner/events" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-bold text-sm">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Event
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h1 className="text-2xl font-black text-gray-900 mb-6">Detail Event</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Banner Event</label>
                            <div className="h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-400 transition-colors">
                                <ImageUpload
                                    value={formData.imageUrl}
                                    onChange={(url: string) => setFormData({ ...formData, imageUrl: url })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-full">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Event</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                    placeholder="Contoh: Borneo Music Festival"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                >
                                    <option value="Nature">Alam & Outdoor</option>
                                    <option value="Culture">Budaya & Seni</option>
                                    <option value="Music">Musik & Konser</option>
                                    <option value="Workshop">Workshop & Edukasi</option>
                                    <option value="Culinary">Kuliner</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Pelaksanaan</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                        placeholder="Alamat lengkap lokasi event"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Harga Tiket (IDR)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">Rp</span>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                        placeholder="0"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Isi 0 jika gratis</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Kuota Peserta</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.quota}
                                        onChange={e => setFormData({ ...formData, quota: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                        placeholder="100"
                                    />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Lengkap</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition resize-none"
                                    placeholder="Jelaskan detail acara, rundown, fasilitas, dll..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buat Event'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </PartnerLayout>
    );
}
