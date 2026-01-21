import { useRef } from 'react';
import { motion } from 'framer-motion';
import { REGIONS } from '@/data/mockData';
import { MapPin, Users, Ruler, Building, ArrowRight, Grid, TreePine } from 'lucide-react';
import Link from 'next/link';
import InteractiveMap from './InteractiveMap';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RegionExplorer() {
    const { t } = useLanguage();

    return (
        <section className="py-20 md:py-24 bg-gray-50 overflow-hidden" id="region-explorer">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-emerald-100/50 border border-emerald-200 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-6"
                    >
                        <MapPin className="w-4 h-4" /> {t.region.badge}
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-gray-900 mb-6"
                    >
                        {t.region.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{t.region.titleHighlight}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed"
                    >
                        {t.region.subtitle}
                    </motion.p>
                </div>

                {/* MAPBOX SECTION */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <InteractiveMap />
                    <p className="text-center text-gray-400 text-xs mt-4 flex items-center justify-center gap-1">
                        <MapPin className="w-3 h-3" /> {t.region.mapHint}
                    </p>
                </motion.div>

                {/* Grid Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                    {REGIONS.map((region, index) => (
                        <motion.div
                            key={region.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col h-full"
                        >
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={region.imageUrl}
                                    alt={region.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>

                                {/* Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${region.type === 'Kota'
                                        ? 'bg-blue-500/20 border-blue-400 text-blue-100'
                                        : 'bg-emerald-500/20 border-emerald-400 text-emerald-100'
                                        }`}>
                                        {region.type}
                                    </span>
                                </div>

                                {/* Title & Basics */}
                                <div className="absolute bottom-0 p-6 w-full text-white">
                                    <div className="flex justify-between items-end mb-1">
                                        <h3 className="text-2xl font-bold leading-tight">{region.name}</h3>
                                        <div className="text-right">
                                            <div className="text-[10px] uppercase font-bold text-gray-400">{t.region.density}</div>
                                            <div className="font-bold text-emerald-300">{region.density} <span className="text-[10px] text-gray-400">/km²</span></div>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm flex items-center gap-1 font-medium">
                                        <Building className="w-3 h-3" /> {t.region.capital}: {region.capital}
                                    </p>
                                </div>
                            </div>

                            {/* Detailed Info */}
                            <div className="p-6 flex flex-col flex-grow bg-white">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-dashed border-gray-100">
                                    <div>
                                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                                            <Ruler className="w-3 h-3" /> {t.region.area}
                                        </span>
                                        <span className="text-gray-900 font-bold text-sm">{region.area} km²</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                                            <Users className="w-3 h-3" /> {t.region.population}
                                        </span>
                                        <span className="text-gray-900 font-bold text-sm">{region.population}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                                            <Grid className="w-3 h-3" /> {t.region.districts}
                                        </span>
                                        <span className="text-gray-900 font-bold text-sm">{region.districts}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                                            <Building className="w-3 h-3" /> {t.region.villages}
                                        </span>
                                        <span className="text-gray-900 font-bold text-sm">{region.villages}</span>
                                    </div>
                                </div>

                                {/* Leader */}
                                <div className="mb-6">
                                    <span className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">{t.region.leader}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <span className="text-gray-900 font-semibold text-sm line-clamp-1">{region.leader}</span>
                                    </div>
                                </div>

                                {/* Top Destinations */}
                                <div className="mb-6">
                                    <span className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <TreePine className="w-3 h-3" /> {t.region.topDestinations}
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {region.destinations?.slice(0, 3).map((dest, i) => (
                                            <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold border border-emerald-100">
                                                {dest}
                                            </span>
                                        ))}
                                        {region.destinations && region.destinations.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-[10px] font-bold border border-gray-100">
                                                +{region.destinations.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <Link href={`/destinations/${region.id}`} className="mt-auto w-full py-3 rounded-xl bg-gray-900 hover:bg-emerald-600 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-gray-200">
                                    {t.region.viewProfile}
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
