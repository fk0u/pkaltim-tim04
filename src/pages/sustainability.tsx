import Layout from '@/components/Layout';
import { TreePine, Sprout, Heart, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Sustainability() {
    const { t } = useLanguage();

    return (
        <Layout title={`${t.nav.sustainability} - BorneoTrip`}>
            <div className="bg-gray-50 min-h-screen pb-20">

                {/* Hero Section */}
                <section className="relative h-screen flex items-center justify-center bg-emerald-950 text-white rounded-b-[4rem] overflow-hidden mb-24 shadow-2xl">
                    <div className="absolute inset-0 z-0">
                        <img src="https://images.unsplash.com/photo-1542385317-0d367c3b95a8?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-40 select-none scale-105" alt="Borneo Rainforest" />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent"></div>
                    </div>

                    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block py-2 px-6 rounded-full glass border border-emerald-400/30 text-emerald-300 font-bold mb-8 tracking-[0.2em] uppercase text-sm shadow-xl"
                        >
                            {t.sustainability.missionBadge}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-6xl md:text-9xl font-black mb-8 leading-none tracking-tight"
                        >
                            {t.sustainability.heroTitle} <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{t.sustainability.heroTitleHighlight}</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-2xl text-emerald-100/80 max-w-3xl mx-auto font-light leading-relaxed"
                        >
                            {t.sustainability.heroSubtitle}
                        </motion.p>
                    </div>
                </section>

                {/* Impact Metrics */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20 mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div whileHover={{ y: -10 }} className="glass-panel p-8 rounded-3xl shadow-xl border border-gray-100 text-center bg-white/95">
                            <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                                <TreePine className="w-8 h-8" />
                            </div>
                            <div className="text-5xl font-black text-gray-900 mb-2">1,542</div>
                            <div className="text-gray-500 uppercase tracking-widest font-bold text-sm">{t.sustainability.metrics.trees}</div>
                        </motion.div>

                        <motion.div whileHover={{ y: -10 }} className="glass-panel p-8 rounded-3xl shadow-xl border border-gray-100 text-center bg-white/95">
                            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                                <Heart className="w-8 h-8" />
                            </div>
                            <div className="text-5xl font-black text-gray-900 mb-2">2.1 M</div>
                            <div className="text-gray-500 uppercase tracking-widest font-bold text-sm">{t.sustainability.metrics.donation}</div>
                        </motion.div>

                        <motion.div whileHover={{ y: -10 }} className="glass-panel p-8 rounded-3xl shadow-xl border border-gray-100 text-center bg-white/95">
                            <div className="w-16 h-16 mx-auto bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                                <Users className="w-8 h-8" />
                            </div>
                            <div className="text-5xl font-black text-gray-900 mb-2">350+</div>
                            <div className="text-gray-500 uppercase tracking-widest font-bold text-sm">{t.sustainability.metrics.people}</div>
                        </motion.div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                                <img src="https://images.unsplash.com/photo-1590486803833-1c5dc8ce69f7?auto=format&fit=crop&q=80" className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" alt="Orangutan" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                        </div>
                        <div className="md:w-1/2 space-y-6">
                            <div className="inline-flex items-center gap-2 text-orange-600 font-bold uppercase tracking-wider text-sm">
                                <Sprout className="w-5 h-5" /> {t.sustainability.section1.badge}
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900">{t.sustainability.section1.title}</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {t.sustainability.section1.desc}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                        <div className="md:w-1/2">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                                <img src="https://images.unsplash.com/photo-1540327310574-04d33a6b5791?auto=format&fit=crop&q=80" className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" alt="Dayak Culture" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                        </div>
                        <div className="md:w-1/2 space-y-6">
                            <div className="inline-flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider text-sm">
                                <Users className="w-5 h-5" /> {t.sustainability.section2.badge}
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900">{t.sustainability.section2.title}</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {t.sustainability.section2.desc}
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </Layout>
    );
}
