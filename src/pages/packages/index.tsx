import Layout from '@/components/Layout';
import { useContent } from '@/contexts/ContentContext';
import { Search, MapPin, Filter, Star, Clock, ArrowUpRight, Leaf } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PackagesPage() {
    const { packages } = useContent();
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useLanguage();

    const filters = ['All', 'Popular', 'Eco-Friendly', 'Short Trip', 'Long Exploration'];

    // Helper to translate filter keys to display text
    const getFilterLabel = (filterKey: string) => {
        const keyMap: { [key: string]: string } = {
            'All': t.packages.filters.all,
            'Popular': t.packages.filters.popular,
            'Eco-Friendly': t.packages.filters.eco,
            'Short Trip': t.packages.filters.short,
            'Long Exploration': t.packages.filters.long
        };
        return keyMap[filterKey] || filterKey;
    };

    const getEcoColor = (rating: number) => {
        if (rating >= 4.5) return 'text-emerald-500 bg-emerald-50 border-emerald-100';
        if (rating >= 4) return 'text-green-500 bg-green-50 border-green-100';
        return 'text-lime-500 bg-lime-50 border-lime-100';
    };

    const filteredPackages = packages.filter(pkg => {
        // Search Logic
        const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pkg.location.toLowerCase().includes(searchTerm.toLowerCase());

        // Filter Logic
        let matchesFilter = true;
        if (activeFilter === 'Eco-Friendly') matchesFilter = (pkg.rating || 0) >= 4.5;

        // Parse "3D2N" or "1 Hari" to number
        const durationNum = parseInt(pkg.duration) || 1;

        if (activeFilter === 'Short Trip') matchesFilter = durationNum <= 3;
        if (activeFilter === 'Long Exploration') matchesFilter = durationNum > 3;

        return matchesSearch && matchesFilter;
    });

    return (
        <Layout title={`${t.packages.title} - BorneoTrip`}>

            {/* HEADER HERO */}
            <div className="bg-emerald-950 text-white relative overflow-hidden pt-48 pb-32 rounded-b-[3rem] shadow-2xl mb-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/90"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
                    >
                        {t.packages.heroTitle} <span className="text-emerald-400">{t.packages.heroTitleHighlight}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-emerald-100/80 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        {t.packages.heroSubtitle}
                    </motion.p>

                    {/* SEARCH BAR IN HERO */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="max-w-2xl mx-auto bg-white rounded-full p-2 pl-6 shadow-xl shadow-emerald-900/40 flex items-center gap-3 transform transition-all hover:scale-105"
                    >
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t.packages.searchPlaceholder}
                            className="flex-grow bg-transparent text-gray-800 placeholder-gray-400 font-medium focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-bold transition">
                            {t.packages.searchBtn}
                        </button>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                {/* FILTERS */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all ${activeFilter === filter
                                ? 'glass-dark text-white shadow-lg shadow-emerald-900/20'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'
                                }`}
                        >
                            {getFilterLabel(filter)}
                        </button>
                    ))}
                </div>

                {/* GRID */}
                {filteredPackages.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {filteredPackages.map((pkg, idx) => (
                                <motion.div
                                    layout
                                    key={pkg.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link href={`/packages/${pkg.id}`} className="group block h-full">
                                        <article className="glass-panel bg-white/40 rounded-[2rem] overflow-hidden shadow-lg border border-white/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col backdrop-blur-md">
                                            <div className="relative h-64 overflow-hidden">
                                                <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                                <div className="absolute top-4 left-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 shadow-sm ${getEcoColor(pkg.rating)}`}>
                                                        <Leaf className="w-3 h-3" /> {t.packages.card.eco} {pkg.rating}/5
                                                    </span>
                                                </div>
                                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 flex items-center gap-1 shadow-md">
                                                    <Clock className="w-3 h-3 text-emerald-600" /> {pkg.duration}
                                                </div>
                                            </div>

                                            <div className="p-6 flex-grow flex flex-col">
                                                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> {pkg.location}
                                                </div>
                                                <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-emerald-700 transition">
                                                    {pkg.title}
                                                </h2>
                                                <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
                                                    {pkg.description}
                                                </p>

                                                <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                                                    <div>
                                                        <span className="text-xs text-gray-400 block mb-1">{t.packages.card.startFrom}</span>
                                                        <span className="text-lg font-black text-orange-600">Rp {pkg.price.toLocaleString('id-ID')}</span>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-600 group-hover:text-white transition">
                                                        <ArrowUpRight className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">{t.packages.card.notFoundTitle}</h3>
                        <p className="text-gray-500">{t.packages.card.notFoundDesc}</p>
                    </div>
                )}

            </div>
        </Layout>
    );
}
