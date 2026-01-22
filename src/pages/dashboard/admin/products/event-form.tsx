import AdminLayout from '@/components/layouts/AdminLayout';
import { useContent } from '@/contexts/ContentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Save, ArrowLeft, Image as ImageIcon, Calendar, MapPin, Tag, List, AlertTriangle } from 'lucide-react';
import { Event } from '@/types';
import { DatePicker } from '@/components/ui';
import ImageUpload from '@/components/ui/ImageUpload';
import LocationInput from '@/components/ui/LocationInput';

export default function EventForm() {
    const router = useRouter();
    const { id } = router.query;
    const { events, addEvent, updateEvent } = useContent();
    const { t } = useLanguage();
    const isEditMode = !!id;

    const emptyEvent: Event = {
        id: '',
        title: { id: '', en: '' },
        description: { id: '', en: '' },
        location: '',
        date: new Date().toISOString().split('T')[0],
        imageUrl: '',
        category: 'Culture',
        tags: [],
        organizer: '',
        ticketCount: 100,
        schedule: [],
        gallery: []
    };

    const [formData, setFormData] = useState<Event>(emptyEvent);
    const [activeLang, setActiveLang] = useState<'id' | 'en'>('id');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const [initialDate, setInitialDate] = useState<string | null>(null);

    useEffect(() => {
        if (isEditMode && id && events.length > 0) {
            const evt = events.find(e => e.id === id);
            if (evt) {
                setFormData(evt);
                setSelectedDate(new Date(evt.date));
                setInitialDate(evt.date); // Capture initial date
            }
        } else {
            setFormData(prev => ({ ...prev, id: `evt_${Date.now()}` }));
        }
    }, [id, events, isEditMode]);

    useEffect(() => {
        if (selectedDate && !isNaN(selectedDate.getTime())) {
            setFormData(prev => ({ ...prev, date: selectedDate.toISOString().split('T')[0] }));
        }
    }, [selectedDate]);

    const handleInputChange = (field: keyof Event, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLocalizedChange = (field: 'title' | 'description', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: { ...prev[field], [activeLang]: value }
        }));
    };

    const addTag = () => {
        const tag = prompt("Enter tag:");
        if (tag) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Date Change Confirmation
        if (isEditMode && initialDate && formData.date !== initialDate) {
            const confirmed = window.confirm(
                "⚠️ Warning: You are changing the event date.\n\nThis may affect existing bookings or schedules. Are you sure you want to proceed?"
            );
            if (!confirmed) return;
        }

        setIsLoading(true);

        if (!formData.title.id || !formData.title.en) {
            alert("Title is required in both languages");
            setIsLoading(false);
            return;
        }

        if (isEditMode) {
            updateEvent(formData);
        } else {
            addEvent(formData);
        }

        setTimeout(() => {
            setIsLoading(false);
            router.push('/dashboard/admin/products?tab=events');
        }, 800);
    };

    return (
        <AdminLayout title={isEditMode ? "Edit Event" : "Add New Event"}>
            <div className="max-w-5xl mx-auto pb-20">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Event' : 'Create Event'}</h2>
                        <p className="text-gray-500">Manage event details and schedule.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
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
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Event Title ({activeLang.toUpperCase()}) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.title[activeLang]}
                                    onChange={(e) => handleLocalizedChange('title', e.target.value)}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description ({activeLang.toUpperCase()})</label>
                                <textarea
                                    value={formData.description[activeLang]}
                                    onChange={(e) => handleLocalizedChange('description', e.target.value)}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none h-40 resize-none"
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
                                    label="Event Cover Image"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Event Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        className="w-full p-3 mt-1 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                    >
                                        <option value="Culture">Culture</option>
                                        <option value="Nature">Nature</option>
                                        <option value="Sport">Sport</option>
                                        <option value="Music">Music</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                                    <div className="mt-1">
                                        <DatePicker
                                            label=""
                                            selected={selectedDate}
                                            onChange={setSelectedDate}
                                        />
                                        {isEditMode && initialDate && formData.date !== initialDate && (
                                            <div className="flex items-start gap-2 mt-2 p-2 bg-amber-50 rounded-lg text-amber-700 text-xs font-medium border border-amber-100 animate-in fade-in slide-in-from-top-1">
                                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                                <p>Changing the date will trigger a notification to all registered attendees.</p>
                                            </div>
                                        )}
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
                                    <label className="text-xs font-bold text-gray-500 uppercase">Tags</label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.tags.map((tag, idx) => (
                                            <span key={idx} className="bg-gray-100 px-2 py-1 rounded-lg text-xs font-bold text-gray-600">{tag}</span>
                                        ))}
                                        <button type="button" onClick={addTag} className="text-xs font-bold text-emerald-600 border border-emerald-200 px-2 py-1 rounded-lg">+ Add</button>
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
                                        <Save className="w-5 h-5" /> Save Event
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
