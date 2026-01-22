import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useContent } from '@/contexts/ContentContext';
import { Calendar, MapPin, Clock, Share2, Ticket, ArrowLeft, User, Heart, Mic2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useToast } from '@/components/ui';
import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function EventDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { addToast } = useToast();
    const { events } = useContent();
    const { scrollY } = useScroll();
    const [pax, setPax] = useState(1);
    const { t, locale } = useLanguage();

    // Parallax & Fade effects
    const yHero = useTransform(scrollY, [0, 500], [0, 200]);
    const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);

    if (!router.isReady) return null;

    const event = events.find(e => e.id === id);

    if (!event) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">{t.events.card.notFoundTitle}</h1>
                        <Link href="/events" className="text-emerald-600 hover:underline">{t.events.detail.back}</Link>
                    </div>
                </div>
            </Layout>
        );
    }

    const parsePrice = (priceStr: string) => {
        if (priceStr === 'Free') return 0;
        return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
    };

    const parseDate = (dateStr: string) => {
        try {
            // Check if it's already ISO format (simple check)
            if (dateStr.includes('T') && dateStr.includes('Z')) return dateStr;

            // Simple mapping for Indonesian months
            const monthMap: { [key: string]: string } = {
                'Januari': 'January', 'Februari': 'February', 'Maret': 'March', 'April': 'April',
                'Mei': 'May', 'Juni': 'June', 'Juli': 'July', 'Agustus': 'August',
                'September': 'September', 'Oktober': 'October', 'November': 'November', 'Desember': 'December'
            };

            let englishDateStr = dateStr;
            const match = dateStr.match(/(\d+).*?([A-Za-z]+)\s+(\d{4})/);
            if (match) {
                const day = match[1];
                const monthIndo = match[2];
                const year = match[3];
                const monthEng = monthMap[monthIndo] || monthIndo;
                englishDateStr = `${day} ${monthEng} ${year}`;
            }
            const dateObj = new Date(englishDateStr);
            if (isNaN(dateObj.getTime())) return new Date().toISOString(); // Fallback
            return dateObj.toISOString();
        } catch (e) {
            return new Date().toISOString();
        }
    };

    const handleTicket = () => {
        const price = parsePrice(event.price || 'Free');
        const parsedDate = parseDate(event.date); // Use existing date if valid or parser

        router.push({
            pathname: '/checkout',
            query: {
                id: event.id,
                pkg: event.title[locale === 'en' ? 'en' : 'id'],
                price: price * pax,
                image: event.imageUrl,
                location: event.location,
                date: parsedDate,
                pax: pax,
                type: 'event' // Indicator for checkout page
            }
        });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        addToast(t.events.detail.toastLink, "success");
    };

    return (
        <Layout title={`${event.title} - BorneoTrip Events`}>
            {/* 1. IMMERSIVE HERO SECTION */}
            <div className="relative h-[85vh] w-full overflow-hidden bg-black">
                <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 w-full h-full">
                    <img
                        src={event.imageUrl}
                        alt={event.title[locale === 'en' ? 'en' : 'id']}
                        className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
                </motion.div>

                <div className="absolute top-0 left-0 p-6 z-20">
                    <Link href="/events" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" /> {t.events.detail.back}
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 z-10 flex flex-col justify-end h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-5xl"
                    >
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="px-4 py-1.5 rounded-full bg-emerald-600/90 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-emerald-900/40 border border-emerald-400/30 backdrop-blur-md">
                                {event.category}
                            </span>
                            {event.price === 'Free' && (
                                <span className="px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/20">
                                    {t.events.card.free}
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
                            {event.title[locale === 'en' ? 'en' : 'id']}
                        </h1>

                        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 text-lg text-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                                    <Calendar className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{t.events.detail.date}</p>
                                    <p className="font-semibold text-white">{event.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                                    <MapPin className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{t.events.detail.location}</p>
                                    <p className="font-semibold text-white">{event.location}</p>
                                </div>
                            </div>
                            {event.organizer && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                                        <User className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{t.events.detail.organizer}</p>
                                        <p className="font-semibold text-white">{event.organizer}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* LEFT CONTENT: Description & Schedule */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Description Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-panel bg-white/60 p-8 md:p-10 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.events.detail.aboutTitle}</h2>
                            <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                                {event.description[locale === 'en' ? 'en' : 'id']}
                                {"\n\n"}
                                Event ini merupakan kesempatan emas untuk merasakan atmosfer budaya yang kental, berinteraksi dengan komunitas lokal, dan menikmati hiburan berkualitas. Jangan lewatkan momen spesial ini bersama teman dan keluarga Anda.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-2">
                                {event.tags.map(tag => (
                                    <span key={tag} className="px-4 py-1.5 bg-gray-100/50 text-gray-600 rounded-full text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 transition cursor-default border border-gray-200">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Schedule Timeline */}
                        {event.schedule && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="glass-panel bg-white/60 p-8 md:p-10 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                                    <Clock className="w-6 h-6 text-emerald-600" /> {t.events.detail.rundownTitle}
                                </h2>
                                <div className="space-y-6 relative before:absolute before:inset-0 before:left-2.5 before:top-2 before:w-0.5 before:bg-gray-100">
                                    {event.schedule.map((item, idx) => (
                                        <div key={idx} className="relative pl-10">
                                            <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white bg-emerald-500 shadow-md"></div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-1">
                                                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-sm">{item.time}</span>
                                                <h4 className="font-bold text-gray-900 text-lg">{item.activity}</h4>
                                            </div>
                                            <p className="text-gray-500 text-sm">Main Stage Area</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Gallery Grid */}
                        {event.gallery && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Mic2 className="w-6 h-6 text-purple-600" /> {t.events.detail.highlightsTitle}
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {event.gallery.map((img, idx) => (
                                        <img key={idx} src={img} className="rounded-2xl object-cover w-full h-48 md:h-64 hover:scale-[1.02] transition duration-500 shadow-md" alt="Gallery" />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR: Action Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="glass-panel bg-white/80 p-8 rounded-3xl shadow-2xl shadow-emerald-900/10 border border-white/60 backdrop-blur-md"
                            >
                                <div className="mb-8 text-center">
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">{t.events.detail.startFrom}</p>
                                    <div className="text-4xl font-black text-gray-900">
                                        {event.price || 'Free'}
                                    </div>
                                    {event.ticketCount && (
                                        <p className="text-sm text-emerald-600 font-medium mt-2 bg-emerald-50 inline-block px-3 py-1 rounded-full">
                                            {event.ticketCount} {t.events.detail.ticketsAvailable}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2 mb-4 border border-gray-200">
                                    <span className="text-xs font-bold text-gray-500 uppercase px-2">{t.events.detail.quantity}</span>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setPax(Math.max(1, pax - 1))} className="w-8 h-8 bg-white rounded-lg shadow-sm font-bold text-gray-600 hover:bg-gray-100 flex items-center justify-center transition">-</button>
                                        <span className="font-bold text-gray-900 w-4 text-center">{pax}</span>
                                        <button onClick={() => setPax(pax + 1)} className="w-8 h-8 bg-emerald-500 rounded-lg shadow-emerald-200 shadow-sm font-bold text-white hover:bg-emerald-600 flex items-center justify-center transition">+</button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleTicket}
                                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-900/30 flex items-center justify-center gap-2 mb-4 group"
                                >
                                    <Ticket className="w-5 h-5 group-hover:-rotate-12 transition" />
                                    {event.price === 'Free' ? t.events.detail.registerFree : t.events.detail.buyTicket}
                                </button>

                                <button
                                    onClick={handleShare}
                                    className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
                                >
                                    <Share2 className="w-4 h-4" /> {t.events.detail.shareBtn}
                                </button>
                            </motion.div>

                            <div className="glass-dark bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
                                <div className="relative z-10">
                                    <Heart className="w-8 h-8 mb-4 text-emerald-300" />
                                    <h3 className="text-xl font-bold mb-2">{t.events.detail.sponsorTitle}</h3>
                                    <p className="text-emerald-100/80 text-sm mb-6">{t.events.detail.sponsorDesc}</p>
                                    <Link href="/contact" className="text-white font-bold underline decoration-emerald-400 underline-offset-4 hover:text-emerald-300">{t.events.detail.contactBtn} &rarr;</Link>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
}
