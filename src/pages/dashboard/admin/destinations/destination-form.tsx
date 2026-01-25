import AdminLayout from '@/components/layouts/AdminLayout';
import { useContent } from '@/contexts/ContentContext';
import { Destination } from '@/types';
import { ArrowLeft, Save, Upload, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui';

export default function DestinationForm() {
    const router = useRouter();
    const { id } = router.query;
    const { destinations, addDestination, updateDestination } = useContent();
    const { addToast } = useToast();

    const [formData, setFormData] = useState<Destination>({
        id: Date.now(),
        name: '',
        type: 'Kabupaten',
        capital: '',
        leader: '',
        area: '',
        population: '',
        density: '',
        districts: 0,
        villages: '',
        coordinates: { lat: 0, lng: 0 },
        destinations: [], // We might want to remove this or make it editable if we want to manually curate spots
        imageUrl: 'https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80'
    });

    useEffect(() => {
        if (id && destinations.length > 0) {
            const found = destinations.find(d => d.id === Number(id));
            if (found) setFormData(found);
        }
    }, [id, destinations]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'districts' ? Number(value) : value
        }));
    };

    const handleCoordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            coordinates: {
                ...prev.coordinates,
                [name]: Number(value)
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (id) {
            updateDestination(formData);
            addToast('Destination updated successfully', 'success');
        } else {
            addDestination({ ...formData, id: Date.now() });
            addToast('Destination created successfully', 'success');
        }
        router.push('/dashboard/admin/destinations');
    };

    return (
        <AdminLayout title={id ? `Edit ${formData.name}` : 'New Destination'}>
            <div className="max-w-4xl mx-auto pb-20">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard/admin/destinations" className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-emerald-600 transition">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{id ? 'Edit Destination' : 'Create New Destination'}</h1>
                        <p className="text-gray-500 text-sm">Fill in the details for the tourism region.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg text-slate-900 mb-4 border-b border-gray-100 pb-2">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Region Name</label>
                                <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition font-bold text-slate-900" placeholder="e.g. Samarinda" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition">
                                    <option value="Kabupaten">Kabupaten</option>
                                    <option value="Kota">Kota</option>
                                    <option value="Provinsi">Provinsi</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Capital City</label>
                                <input name="capital" value={formData.capital} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition" placeholder="e.g. Tanjung Redeb" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Head of Region (Leader)</label>
                                <input name="leader" value={formData.leader} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition" placeholder="e.g. Bupati X" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                                <div className="flex gap-2">
                                    <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition text-sm" placeholder="https://..." />
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 relative overflow-hidden shrink-0 border border-gray-200">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg text-slate-900 mb-4 border-b border-gray-100 pb-2">Demographics & Geography</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Area (km²)</label>
                                <input name="area" value={formData.area} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Population</label>
                                <input name="population" value={formData.population} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Density (/km²)</label>
                                <input name="density" value={formData.density} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Districts Count</label>
                                <input type="number" name="districts" value={formData.districts} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Villages (Desa/Kel)</label>
                                <input name="villages" value={formData.villages} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition" placeholder="e.g. 15/0" />
                            </div>
                        </div>
                    </div>

                    {/* Coordinates */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg text-slate-900 mb-4 border-b border-gray-100 pb-2">Location Coordinates</h3>
                        <div className="flex gap-6">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Latitude</label>
                                <input type="number" step="any" name="lat" value={formData.coordinates.lat} onChange={handleCoordChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition font-mono" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Longitude</label>
                                <input type="number" step="any" name="lng" value={formData.coordinates.lng} onChange={handleCoordChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition font-mono" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <Link href="/dashboard/admin/destinations">
                            <button type="button" className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition">Cancel</button>
                        </Link>
                        <button type="submit" className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-1 transition flex items-center gap-2">
                            <Save className="w-4 h-4" /> Save Destination
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
