import AdminLayout from '@/components/layouts/AdminLayout';
import { useContent } from '@/contexts/ContentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Plus, Trash2, Image as ImageIcon, CheckCircle, List, Clock, MapPin, DollarSign, Star, Globe, XCircle, Sparkles, Loader2 } from 'lucide-react';
import { TourPackage, ItineraryDetail } from '@/types';
import ImageUpload from '@/components/ui/ImageUpload';
import LocationInput from '@/components/ui/LocationInput';
import { useToast } from '@/components/ui';

export default function PackageForm() {
    const router = useRouter();
    const { id } = router.query;
    const { packages, addPackage, updatePackage } = useContent();
    const { t } = useLanguage();
    const isEditMode = !!id;

    const emptyPackage: TourPackage = {
        id: '',
        title: { id: '', en: '' },
        description: { id: '', en: '' },
        price: 0,
        duration: '',
        location: '',
        imageUrl: '',
        rating: 5.0,
        ecoRating: 5,
        facilities: []
    };

    const emptyItinerary: ItineraryDetail = {
        id: '',
        packageId: '',
        title: '',
        badges: [],
        days: []
    };

    const [formData, setFormData] = useState<TourPackage>(emptyPackage);
    const [itineraryData, setItineraryData] = useState<ItineraryDetail>(emptyItinerary);
    const [activeLang, setActiveLang] = useState<'id' | 'en'>('id');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isEditMode && id && packages.length > 0) {
            const pkg = packages.find(p => p.id === id) as any;
            if (pkg) {
                setFormData(pkg);
                // Load itinerary from package data (from API)
                if (pkg.itinerary) {
                    setItineraryData(pkg.itinerary);
                }
            }
        } else {
            // Generate ID for new package
            setFormData(prev => ({ ...prev, id: `pkg_${Date.now()}` }));
        }
    }, [id, packages, isEditMode]);

    const handleInputChange = (field: keyof TourPackage, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLocalizedChange = (field: 'title' | 'description', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: { ...prev[field], [activeLang]: value }
        }));
    };

    const addFacility = () => {
        const facility = prompt("Enter facility name:");
        if (facility) {
            setFormData(prev => ({ ...prev, facilities: [...prev.facilities, facility] }));
        }
    };

    const removeFacility = (index: number) => {
        setFormData(prev => ({
            ...prev,
            facilities: prev.facilities.filter((_, i) => i !== index)
        }));
    };

    const [isGenerating, setIsGenerating] = useState(false);
    const { addToast } = useToast();

    const handleAIAutofill = async () => {
        if (!formData.title[activeLang] || !formData.location) {
            addToast('Please enter Title and Location first.', 'error');
            return;
        }

        setIsGenerating(true);
        try {
            const res = await fetch('/api/ai/generate-package', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title[activeLang],
                    location: formData.location,
                    type: 'package'
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to generate');

            setFormData(prev => ({
                ...prev,
                description: { ...prev.description, [activeLang]: data.description },
                facilities: [...prev.facilities, ...(data.facilities || [])],
                price: data.priceEstimate || prev.price,
                duration: data.duration || prev.duration
            }));

            // Map AI itinerary to structure
            if (data.itinerary && Array.isArray(data.itinerary)) {
                const mappedDays = data.itinerary.map((item: any, idx: number) => ({
                    day: idx + 1,
                    title: item.title,
                    description: item.activity,
                    meals: [],
                    accommodation: '',
                    image: ''
                }));
                setItineraryData(prev => ({ ...prev, days: mappedDays }));
            }

            addToast('Package content generated!', 'success');
        } catch (error: any) {
            addToast(error.message, 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simple validation
        if (!formData.title.id || !formData.title.en) {
            alert("Title is required in both languages");
            setIsLoading(false);
            return;
        }

        let success = false;
        if (isEditMode) {
            success = await updatePackage(formData);
        } else {
            // Remove temp ID
            const { id: _, ...dataToSend } = formData;
            // @ts-ignore
            success = await addPackage(dataToSend);
        }

        setIsLoading(false);

        if (success) {
            router.push('/dashboard/admin/products');
        } else {
            alert("Failed to save package. Please try again.");
        }
    };

    return (
        <AdminLayout title={isEditMode ? "Edit Package" : "Add New Package"}>
            <div className="max-w-5xl mx-auto pb-20">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Package' : 'Create Package'}</h2>
                        <p className="text-gray-500">Fill in the details below to {isEditMode ? 'update' : 'publish'} a tour package.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Language Toggler */}
                        <div className="bg-white p-2 rounded-xl border border-gray-100 flex items-center gap-2 w-fit shadow-sm">
                            <button
                                type="button"
                                onClick={() => setActiveLang('id')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${activeLang === 'id' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                🇮🇩 Indonesia
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveLang('en')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${activeLang === 'en' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                🇬🇧 English
                            </button>
                        </div>

                        {/* Basic Info */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Package Title ({activeLang.toUpperCase()}) <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.title[activeLang]}
                                        onChange={(e) => handleLocalizedChange('title', e.target.value)}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg"
                                        placeholder={activeLang === 'id' ? "Contoh: Pesona Derawan 3H2M" : "Ex: Derawan Charm 3D2N"}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAIAutofill}
                                    disabled={isGenerating || !formData.title[activeLang]}
                                    className="ml-4 mt-8 bg-linear-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-xl shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                                    title="Auto-fill with AI"
                                >
                                    {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description ({activeLang.toUpperCase()})</label>
                                <textarea
                                    value={formData.description[activeLang]}
                                    onChange={(e) => handleLocalizedChange('description', e.target.value)}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none h-40 resize-none"
                                    placeholder="Describe the highlights and experience..."
                                />
                            </div>
                        </div>

                        {/* Media */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-emerald-500" /> Media</h3>
                            <div>
                                <ImageUpload
                                    value={formData.imageUrl}
                                    onChange={(url) => handleInputChange('imageUrl', url)}
                                    label="Package Cover Image"
                                />
                            </div>
                        </div>

                        {/* Facilities */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><List className="w-5 h-5 text-emerald-500" /> Facilities</h3>
                                <button type="button" onClick={addFacility} className="text-sm font-bold text-emerald-600 hover:text-emerald-700">+ Add</button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {formData.facilities.map((fac, idx) => (
                                    <div key={idx} className="bg-gray-50 px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium">
                                        <span>{fac}</span>
                                        <button type="button" onClick={() => removeFacility(idx)} className="text-red-400 hover:text-red-500"><XCircle className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                {formData.facilities.length === 0 && <p className="text-gray-400 text-sm italic">No facilities added.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Package Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Price (IDR)</label>
                                    <div className="relative mt-1">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <LocationInput
                                        value={formData.location}
                                        onChange={(val) => handleInputChange('location', val)}
                                        label="Location"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Duration</label>
                                    <div className="relative mt-1">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.duration}
                                            onChange={(e) => handleInputChange('duration', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                            placeholder="3 Days 2 Nights"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Rating</label>
                                        <div className="relative mt-1">
                                            <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 fill-amber-400" />
                                            <input
                                                type="number" step="0.1" max="5"
                                                value={formData.rating}
                                                onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Eco Rating</label>
                                        <div className="relative mt-1">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                            <input
                                                type="number" max="5"
                                                value={formData.ecoRating}
                                                onChange={(e) => handleInputChange('ecoRating', parseInt(e.target.value))}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-6 border-gray-100" />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" /> Save Package
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
