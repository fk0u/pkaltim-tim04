import Layout from '@/components/Layout';
import { TreePine, Sprout, Heart, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sustainability() {
    return (
        <Layout title="Sustainability - BorneoTrip">
            <div className="bg-gray-50 min-h-screen pb-20">

                {/* Hero Section */}
                <section className="relative min-h-[60vh] flex items-center justify-center bg-emerald-900 text-white rounded-b-[3.5rem] overflow-hidden mb-20">
                    <div className="absolute inset-0 z-0">
                        <img src="https://images.unsplash.com/photo-1542385317-0d367c3b95a8?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-30 select-none" alt="Borneo Rainforest" />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-transparent to-transparent"></div>
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                        <span className="inline-block py-1 px-4 rounded-full bg-emerald-500/20 backdrop-blur border border-emerald-400/30 text-emerald-300 font-bold mb-6 tracking-widest uppercase">Our Mission</span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Preserving <br /><span className="text-emerald-400">Paradise</span></h1>
                        <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto">
                            Kami percaya bahwa pariwisata harus menjadi kekuatan untuk kebaikan. Setiap perjalanan Anda membantu melestarikan paru-paru dunia.
                        </p>
                    </div>
                </section>

                {/* Impact Metrics */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20 mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div whileHover={{ y: -10 }} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
                            <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                                <TreePine className="w-8 h-8" />
                            </div>
                            <div className="text-5xl font-black text-gray-900 mb-2">1,542</div>
                            <div className="text-gray-500 uppercase tracking-widest font-bold text-sm">Pohon Ditanam</div>
                        </motion.div>

                        <motion.div whileHover={{ y: -10 }} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
                            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                                <Heart className="w-8 h-8" />
                            </div>
                            <div className="text-5xl font-black text-gray-900 mb-2">2.1 M</div>
                            <div className="text-gray-500 uppercase tracking-widest font-bold text-sm">Rupiah Donasi</div>
                        </motion.div>

                        <motion.div whileHover={{ y: -10 }} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
                            <div className="w-16 h-16 mx-auto bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                                <Users className="w-8 h-8" />
                            </div>
                            <div className="text-5xl font-black text-gray-900 mb-2">350+</div>
                            <div className="text-gray-500 uppercase tracking-widest font-bold text-sm">Warga Diberdayakan</div>
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
                                <Sprout className="w-5 h-5" /> Konservasi Orangutan
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900">Habitat yang Terlindungi</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                BorneoTrip bekerja sama langsung dengan pusat rehabilitasi Orangutan di Samboja Lestari. 5% dari setiap pemesanan tiket Anda didonasikan langsung untuk program reforestasi dan perlindungan habitat asli mereka.
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
                                <Users className="w-5 h-5" /> Pemberdayaan Lokal
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900">Mendukung Ekonomi Desa</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Kami memprioritaskan homestay lokal, pemandu wisata asli daerah, dan kuliner tradisional. Ini memastikan bahwa uang yang Anda habiskan berputar di dalam komunitas lokal, bukan hanya di perusahaan besar.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </Layout>
    );
}
