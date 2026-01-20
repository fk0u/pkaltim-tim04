import { useRouter } from 'next/router';
import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { useContent } from '@/contexts/ContentContext';
import { Search, MapPin, Filter, Calendar, Clock, DollarSign, Star, Ticket, Package as PackageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function SearchPage() {
    const router = useRouter();
    const { type = 'event', location = '', date, travelers } = router.query;
    const { packages, events } = useContent();

    // Tab State (mirrors query param or defaults)
    const activeTab = (type as string)?.toLowerCase() === 'package' ? 'Package' : 'Event';

    // Filter States
    const [priceRange, setPriceRange] = useState<number>(10000000);
    const [ratingFilter, setRatingFilter] = useState<number>(0);

    // Filter Logic
    const filteredResults = useMemo(() => {
        const queryLocation = (location as string || '').toLowerCase();

        if (activeTab === 'Package') {
            return packages.filter(pkg => {
                const matchLocation = pkg.location.toLowerCase().includes(queryLocation) || pkg.title.toLowerCase().includes(queryLocation);
                const matchPrice = pkg.price <= priceRange;
                const matchRating = (pkg.rating || 0) >= ratingFilter;
                return matchLocation && matchPrice && matchRating;
            });
        } else {
            return events.filter(evt => {
                const matchLocation = evt.location.toLowerCase().includes(queryLocation) || evt.title.toLowerCase().includes(queryLocation);
                // Events usually free or low cost, but let's assume we filter if price is numeric. 
                // Currently event price is string 'Free' or 'Rp ...'
                return matchLocation;
            });
        }
    }, [activeTab, location, packages, events, priceRange, ratingFilter]);

    return (
        <Layout title={`Pencarian ${activeTab} - BorneoTrip`}>
            <div className="bg-slate-50 min-h-screen pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hasil Pencarian</h1>
                        <div className="flex items-center gap-2 text-gray-500">
                            <Search className="w-4 h-4" />
                            <span>
                                Menampilkan hasil untuk <strong>{activeTab}</strong>
                                {location && <span> di <strong>"{location}"</strong></span>}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar Filters */}
                        <div className="lg:w-1/4 space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                                <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold">
                                    <Filter className="w-5 h-5" /> Filter
                                </div>

                                {/* Type Toggle */}
                                <div className="mb-6">
                                    <label className="text-sm font-semibold text-gray-700 block mb-3">Tipe Pencarian</label>
                                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                                        <button
                                            onClick={() => router.push({ query: { ...router.query, type: 'event' } })}
                                            className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === 'Event' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:bg-slate-200'}`}
                                        >
                                            <Ticket className="w-4 h-4" /> Event
                                        </button>
                                        <button
                                            onClick={() => router.push({ query: { ...router.query, type: 'package' } })}
                                            className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === 'Package' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:bg-slate-200'}`}
                                        >
                                            <PackageIcon className="w-4 h-4" /> Paket
                                        </button>
                                    </div>
                                </div>

                                {/* Price Range (Only for Packages mostly) */}
                                {activeTab === 'Package' && (
                                    <div className="mb-6">
                                        <label className="text-sm font-semibold text-gray-700 block mb-3">
                                            Maksimal Harga: <span className="text-emerald-600">Rp {(priceRange / 1000000).toFixed(1)}jt</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="500000"
                                            max="10000000"
                                            step="500000"
                                            value={priceRange}
                                            onChange={(e) => setPriceRange(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                        />
                                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                                            <span>Rp 500rb</span>
                                            <span>Rp 10jt+</span>
                                        </div>
                                    </div>
                                )}

                                {/* Rating Filter */}
                                {activeTab === 'Package' && (
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 block mb-3">Rating Minimal</label>
                                        <div className="flex gap-2">
                                            {[4, 3, 2].map(star => (
                                                <button
                                                    key={star}
                                                    onClick={() => setRatingFilter(ratingFilter === star ? 0 : star)}
                                                    className={`px-3 py-1 rounded-lg border text-sm font-bold flex items-center gap-1 transition ${ratingFilter === star ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                    {star}+ <Star className="w-3 h-3 fill-current" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Results Grid */}
                        <div className="lg:w-3/4">
                            {filteredResults.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Tidak ditemukan hasil</h3>
                                    <p className="text-slate-500">Coba ubah kata kunci lokasi atau filter Anda.</p>
                                    <button onClick={() => { setPriceRange(10000000); setRatingFilter(0); router.push({ query: { ...router.query, location: '' } }) }} className="mt-6 text-emerald-600 font-bold hover:underline">
                                        Reset Filter
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {activeTab === 'Package' ? (
                                        (filteredResults as any[]).map((pkg) => (
                                            <Link href={`/packages/${pkg.id}`} key={pkg.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 flex flex-col">
                                                <div className="relative h-48 overflow-hidden">
                                                    <Image src={pkg.imageUrl} alt={pkg.title} fill className="object-cover group-hover:scale-110 transition duration-700" />
                                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {pkg.rating}
                                                    </div>
                                                </div>
                                                <div className="p-6 flex-1 flex flex-col">
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 uppercase tracking-wider font-semibold">
                                                        <MapPin className="w-3 h-3" /> {pkg.location}
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-emerald-600 transition">{pkg.title}</h3>
                                                    <div className="mt-auto pt-4 flex items-end justify-between border-t border-slate-50">
                                                        <div>
                                                            <div className="text-xs text-slate-400 font-medium">Mulai dari</div>
                                                            <div className="text-lg font-black text-emerald-600">Rp {pkg.price.toLocaleString('id-ID')}</div>
                                                        </div>
                                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-bold">{pkg.duration}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        (filteredResults as any[]).map((evt) => (
                                            <Link href={`/events/${evt.id}`} key={evt.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 flex flex-col">
                                                <div className="relative h-48 overflow-hidden">
                                                    <Image src={evt.imageUrl} alt={evt.title} fill className="object-cover group-hover:scale-110 transition duration-700" />
                                                    <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                        {evt.category}
                                                    </div>
                                                </div>
                                                <div className="p-6 flex-1 flex flex-col">
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-medium">
                                                        <Calendar className="w-3 h-3" /> {evt.date}
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-emerald-600 transition">{evt.title}</h3>
                                                    <div className="flex items-center gap-1 text-sm text-slate-500 mb-4">
                                                        <MapPin className="w-4 h-4 text-slate-400" /> {evt.location}
                                                    </div>
                                                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                                        <span className="text-emerald-600 font-bold">{evt.price}</span>
                                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition">
                                                            <Search className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}
