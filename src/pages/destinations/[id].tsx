import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { MapPin, Users, Ruler, Building, ArrowRight, Grid, Trophy, Share2, Heart, Camera } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShareModal, useToast } from '@/components/ui';
import { useContent } from '@/contexts/ContentContext';
import { Destination } from '@/types';
import TripPlanner from '@/components/features/TripPlanner';
import SmartItinerary from '@/components/features/SmartItinerary';

export default function DestinationDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { scrollY } = useScroll();
    const { addToast } = useToast();
    const { destinations, packages } = useContent();

    // State for hydration safe rendering
    const [region, setRegion] = useState<Destination | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    // Load initial like state
    useEffect(() => {
        if (id) {
            const saved = localStorage.getItem(`wishlist_destination_${id}`);
            if (saved) setIsLiked(true);
        }
    }, [id]);

    const handleLike = () => {
        if (isLiked) {
            localStorage.removeItem(`wishlist_destination_${id}`);
            setIsLiked(false);
            addToast('Dihapus dari wishlist', 'info');
        } else {
            localStorage.setItem(`wishlist_destination_${id}`, 'true');
            setIsLiked(true);
            addToast('Disimpan ke wishlist', 'success');
        }
    };

    // Parallax Effect
    const yHero = useTransform(scrollY, [0, 500], [0, 150]);
    const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);

    // Initial Data Load
    useEffect(() => {
        if (router.isReady) {
            const found = destinations.find(r => r.id === Number(id));
            setRegion(found || null);
            setIsReady(true);
        }
    }, [router.isReady, id, destinations]);

    // Derived State: Related Packages based on Location matching Destination Name
    const relatedPackages = packages.filter(pkg =>
        region && pkg.location.toLowerCase().includes(region.name.toLowerCase())
    );

    // PREVENT HYDRATION MISMATCH: Render nothing until client is ready
    if (!isReady) return null;

    if (!region) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium bg-slate-50">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                        <p className="text-lg">Destinasi tidak ditemukan.</p>
                        <Link href="/" className="mt-6 inline-block text-emerald-600 hover:underline">Kembali ke Beranda</Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <>
            <Layout title={`${region.name} - BorneoTrip Destinasi`}>
                <div className="bg-slate-50 min-h-screen pb-20">

                    {/* 1. IMMERSIVE PARALLAX HERO SECTION - Increased Height */}
                    <div className="relative h-[95vh] w-full overflow-hidden bg-slate-900">
                        <motion.div style={{ y: yHero }} className="absolute inset-0 w-full h-full">
                            <Image
                                src={region.imageUrl}
                                alt={region.name}
                                fill
                                className="object-cover opacity-80"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                        </motion.div>


                        <motion.div
                            style={{ opacity: opacityHero }}
                            // Added significantly more bottom padding (pb-64) to clear the cards
                            className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-24 pb-48 md:pb-64 z-10 flex flex-col justify-end h-full"
                        >
                            <div className="max-w-7xl mx-auto w-full mb-10">
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                >
                                    <div className="flex flex-wrap items-center gap-3 mb-6">
                                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest backdrop-blur-md border border-white/20 text-white bg-white/10 shadow-lg`}>
                                            Explore {region.type}
                                        </span>
                                        <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/20">
                                            <Camera className="w-3 h-3" /> Top Rated
                                        </span>
                                    </div>

                                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 tracking-tighter leading-none drop-shadow-2xl">
                                        {region.name}
                                    </h1>

                                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-lg text-gray-200 font-light">
                                        <p className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-emerald-400" />
                                            Ibu Kota: <span className="text-white font-semibold">{region.capital}</span>
                                        </p>
                                        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        <p className="flex items-center gap-2">
                                            <Users className="w-5 h-5 text-emerald-400" />
                                            Populasi: <span className="text-white font-semibold">{region.population}</span>
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* 2. OVERLAPPING CONTENT CONTAINER */}
                    <div className="relative z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-16">

                        {/* Floating Glass Stats Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12"
                        >
                            {[
                                { label: 'Luas Area', value: `${region.area}`, unit: 'km²', icon: Ruler, color: 'text-blue-400', bg: 'from-blue-500/10 to-blue-500/5' },
                                { label: 'Kecamatan', value: region.districts, unit: 'Distrik', icon: Grid, color: 'text-purple-400', bg: 'from-purple-500/10 to-purple-500/5' },
                                { label: 'Kepadatan', value: region.density, unit: '/km²', icon: Users, color: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-500/5' },
                                { label: 'Desa/Kel', value: region.villages, unit: 'Total', icon: Building, color: 'text-orange-400', bg: 'from-orange-500/10 to-orange-500/5' },
                            ].map((stat, idx) => (
                                <div key={idx} className={`relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl flex flex-col justify-between group h-32 md:h-40 hover:-translate-y-2 transition duration-500`}>
                                    <div className={`absolute inset-0 bg-linear-to-br ${stat.bg} opacity-0 group-hover:opacity-100 transition duration-500`}></div>
                                    <div className="relative z-10 flex justify-between items-start">
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-black/20 px-2 py-1 rounded-lg">{stat.unit}</span>
                                    </div>
                                    <div className="relative z-10 mt-auto">
                                        <div className="text-2xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-md">{stat.value}</div>
                                        <div className="text-[10px] md:text-xs font-bold text-gray-300 uppercase tracking-widest bg-black/50 inline-block px-1 rounded mt-1">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 pb-20">

                            {/* LEFT: MAIN CONTENT (8 Cols) */}
                            <div className="lg:col-span-8 space-y-12">

                                {/* TABS */}
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {['Overview', 'Destinations', 'Packages'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => {
                                                const section = document.getElementById(tab.toLowerCase());
                                                section?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }}
                                            className="px-6 py-3 rounded-full bg-white border border-gray-100 text-gray-600 font-bold text-sm hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition shadow-sm whitespace-nowrap"
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Introduction (Overview) */}
                                <section id="overview" className="scroll-mt-32">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="prose prose-lg md:prose-xl prose-slate max-w-none bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                                    >
                                        <h3 className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-2">The Jewel of East Kalimantan</h3>
                                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                                            Menyingkap Pesona Tersembunyi {region.name}
                                        </h2>
                                        <p className="text-slate-600 leading-loose">
                                            <span className="text-6xl float-left mr-3 mt-[-10px] font-black text-emerald-500 font-serif">"{region.name.charAt(0)}</span>
                                            {region.name.slice(1)} bukan sekadar titik di peta, melainkan sebuah ekosistem kehidupan yang berdenyut.
                                            Sebagai salah satu koridor utama "Heart of Borneo", wilayah ini menyimpan jutaan cerita dari kanopi hutan hujan purba hingga
                                            kedalaman sungai Mahakam yang legendaris.
                                        </p>
                                        <p className="text-slate-600 leading-loose mt-6">
                                            Dipimpin oleh <strong>{region.leader}</strong>, {region.name} kini bertransformasi menjadi model pariwisata berkelanjutan kelas dunia.
                                            Wisatawan tidak hanya datang untuk melihat, tetapi untuk merasakan denyut nadi kehidupan lokal yang harmonis dengan alam.
                                        </p>
                                    </motion.div>
                                </section>

                                {/* Gallery / Attractions (Destinations) */}
                                <section id="destinations" className="scroll-mt-32">
                                    <div className="flex items-end justify-between mb-8">
                                        <div>
                                            <h3 className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-2">Must Visit Places</h3>
                                            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Destinasi Ikonik</h2>
                                        </div>
                                        <div className="hidden md:flex gap-2">
                                            <button className="p-3 rounded-full border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 transition"><ArrowRight className="w-5 h-5 rotate-180" /></button>
                                            <button className="p-3 rounded-full border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 transition"><ArrowRight className="w-5 h-5" /></button>
                                        </div>
                                    </div>


                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {relatedPackages.slice(0, 4).map((pkg, idx) => (
                                            <Link href={`/packages/${pkg.id}`} key={pkg.id} className={`group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ${idx === 0 ? 'md:col-span-2 aspect-2/1' : 'aspect-4/3'}`}>
                                                <Image
                                                    src={pkg.imageUrl}
                                                    className="object-cover group-hover:scale-110 transition duration-1000"
                                                    alt={typeof pkg.title === 'string' ? pkg.title : (pkg.title as any).en}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                />
                                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90"></div>

                                                <div className="absolute top-6 right-6">
                                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition transform translate-y-4 group-hover:translate-y-0">
                                                        <ArrowRight className="w-5 h-5 -rotate-45" />
                                                    </div>
                                                </div>

                                                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                                                    <span className="inline-block px-3 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider mb-3 shadow-lg">
                                                        Package
                                                    </span>
                                                    <h3 className={`font-black text-white leading-tight mb-2 ${idx === 0 ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
                                                        {typeof pkg.title === 'string' ? pkg.title : (pkg.title as any).en}
                                                    </h3>
                                                    <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-lg opacity-0 group-hover:opacity-100 transition duration-500 delay-100 transform translate-y-2 group-hover:translate-y-0">
                                                        {typeof pkg.description === 'string' ? pkg.description : (pkg.description as any).en}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                        {relatedPackages.length === 0 && (
                                            <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                                <p className="text-gray-500 font-medium mb-4">Belum ada paket wisata khusus untuk destinasi ini.</p>
                                                <Link href="/packages" className="text-emerald-600 font-bold hover:underline">Lihat semua paket lainnya</Link>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* AI Smart Itinerary Widget */}
                                <section className="mt-12">
                                    <SmartItinerary destination={region.name} />
                                </section>

                                {/* Packages Section */}
                                <section id="packages" className="scroll-mt-32">
                                    <h3 className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-2">Curated Trips</h3>
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8">Paket Wisata Terkait</h2>
                                    <div className="space-y-6">
                                        <div className="p-8 bg-gray-50 rounded-3xl text-center border border-dashed border-gray-300">
                                            <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                                <Trophy className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-2">Belum ada paket khusus</h4>
                                            <p className="text-sm text-gray-500 mb-6">Kami sedang mengurasi paket perjalanan terbaik untuk {region.name}.</p>
                                            <Link href="/packages" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition shadow-sm">
                                                Lihat Semua Paket Lainnya <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </section>

                            </div>



                            {/* RIGHT: STICKY BOOKING WIDGET (4 Cols) */}
                            <div className="lg:col-span-4 relative">
                                <div className="sticky top-28 space-y-6">

                                    {/* Booking Card */}
                                    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[4rem] -z-0"></div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">Mulai Petualangan</h3>
                                        <p className="text-sm text-gray-500 mb-8 relative z-10">Jelajahi paket wisata terbaik yang tersedia di {region.name}.</p>

                                        <div className="space-y-3 relative z-10">
                                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 transition hover:bg-white hover:shadow-md">
                                                <MapPin className="w-5 h-5 text-emerald-500" />
                                                <div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase">Tujuan</div>
                                                    <div className="font-bold text-gray-900">{region.name}</div>
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 transition hover:bg-white hover:shadow-md">
                                                <Trophy className="w-5 h-5 text-amber-500" />
                                                <div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase">Paket Tersedia</div>
                                                    <div className="font-bold text-gray-900">{relatedPackages.length} Paket Ekowisata</div>
                                                </div>
                                            </div>
                                        </div>

                                        <Link href="/packages" className="mt-8 w-full bg-gray-900 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-gray-900/20 group">
                                            Cari Paket Sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                                        </Link>
                                    </div>

                                    {/* Logistics Widget */}
                                    <TripPlanner destinationName={region.name} coordinates={region.coordinates} />

                                    {/* Share / Save */}
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setShowShareModal(true)}
                                            className="flex-1 py-4 rounded-2xl bg-white border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition flex items-center justify-center gap-2"
                                        >
                                            <Share2 className="w-4 h-4" /> Bagikan
                                        </button>
                                        <button
                                            onClick={handleLike}
                                            className={`flex-1 py-4 rounded-2xl border font-bold text-sm transition flex items-center justify-center gap-2 group ${isLiked ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-600 hover:text-red-500'}`}
                                        >
                                            <Heart className={`w-4 h-4 transition ${isLiked ? 'fill-red-600 text-red-600' : 'group-hover:fill-red-500'}`} />
                                            {isLiked ? 'Disimpan' : 'Simpan'}
                                        </button>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <ShareModal
                    isOpen={showShareModal}
                    onClose={() => setShowShareModal(false)}
                    title={`Bagikan ${region.name}`}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                />
            </Layout >
        </>
    );
}
