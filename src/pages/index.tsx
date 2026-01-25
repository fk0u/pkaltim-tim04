import { motion, MotionProps } from 'framer-motion';
import Layout from '@/components/Layout';
import SearchWidget from '@/components/SearchWidget';
import HorizontalScroll from '@/components/HorizontalScroll';
import Testimonials from '@/components/Testimonials';
import { useContent } from '@/contexts/ContentContext';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import RegionExplorer from '@/components/RegionExplorer';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

export default function Home() {
   const { t, locale } = useLanguage();
   const { packages, events } = useContent();

   const displayEvents = events;
   const displayPackages = packages;

   const fadeInUp: MotionProps = {
      initial: { opacity: 0, y: 40 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-100px" },
      transition: { duration: 0.8, ease: "easeOut" }
   };

   return (
      <Layout
         transparentNavbar={true}
         description={t.hero.subtitle}
         title={t.hero.title1 + ' ' + t.hero.title2}
         ogImage="/images/hero-bg.jpg" // Using local path which Next.js will resolve basically
         type="website"
      >
         {/* 1. DYNAMIC HERO SECTION WITH VIDEO */}
         <section className="relative min-h-[95vh] flex flex-col justify-end bg-black overflow-visible z-10 rounded-b-5xl md:rounded-b-7xl shadow-2xl mb-12 md:mb-20 group">

            {/* Video Background */}
            <div className="absolute inset-0 z-0 rounded-b-4xl md:rounded-b-7xl overflow-hidden">
               {/* Video Layer */}
               <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-10"
               >
                  <source src="/video/bumper.webm" type="video/webm" />
                  <source src="/video/bumper.mp4" type="video/mp4" />
               </video>

               {/* Dark Overlay for Text Readability */}
               <div className="absolute inset-0 bg-black/30 z-20"></div>
               <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-black/40 z-20"></div>
            </div>

            {/* Content Container - Added pt-32 to prevent overlap with Navbar on small screens */}
            <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20 pt-32 md:pb-32 md:pt-32 flex flex-col justify-end h-full">
               <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  className="text-center mb-16 mt-20 md:mt-0"
               >
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: 1, duration: 0.5 }}
                     className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-[10px] md:text-sm font-bold tracking-widest uppercase mb-6 md:mb-8 shadow-lg hover:bg-white/20 transition-colors cursor-default"
                  >
                     <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                     {t.hero.badge}
                  </motion.div>
                  const {packages, destinations} = useContent();
                  const {scrollY} = useScroll();
                  const yHero = useTransform(scrollY, [0, 500], [0, 200]);

                  // Featured Content Logic
                  const featuredPackages = packages.slice(0, 3);
                  const popularDestinations = destinations.slice(0, 4);

                  const categories = [
                  {name: 'Islands', icon: '🏝️' },
                  {name: 'Jungle', icon: '🌳' },
                  {name: 'Culture', icon: '👺' },
                  {name: 'Culinary', icon: '🍜' },
                  {name: 'Diving', icon: '🤿' },
                  {name: 'Luxury', icon: '💎' },
                  ];

                  return (
                  <Layout>
                     <Head>
                        <title>BorneoTrip - Discover East Kalimantan</title>
                        <meta name="description" content="Premium travel experiences in Borneo" />
                     </Head>

                     {/* HERO SECTION */}
                     <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                        {/* Parallax Background */}
                        <motion.div style={{ y: yHero }} className="absolute inset-0 z-0">
                           <Image
                              src="https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80"
                              alt="Borneo Landscape"
                              fill
                              className="object-cover"
                              priority
                           />
                           <div className="absolute inset-0 bg-black/40"></div>
                           <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-white"></div>
                        </motion.div>

                        {/* Content */}
                        <div className="relative z-10 w-full px-4 pt-20">
                           <div className="text-center mb-12">
                              <motion.div
                                 initial={{ opacity: 0, y: 30 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 transition={{ duration: 0.8, ease: "easeOut" }}
                              >
                                 <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 drop-shadow-xl">
                                    Discover the <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Hidden Gems</span> of Borneo
                                 </h1>
                                 <p className="text-lg md:text-xl text-gray-200 font-medium max-w-2xl mx-auto mb-10 text-shadow-sm">
                                    Experience the untouched beauty of East Kalimantan. From the depths of the rainforest to the pristine Derawan islands.
                                 </p>
                              </motion.div>

                              <motion.div
                                 initial={{ opacity: 0, scale: 0.9 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 transition={{ delay: 0.3, duration: 0.5 }}
                              >
                                 <HeroSearch />
                              </motion.div>
                           </div>

                           {/* Trust Indicators */}
                           <div className="flex flex-wrap justify-center gap-8 opacity-70">
                              {['10k+ Happy Travelers', '4.9/5 Rating', '24/7 Support'].map((text, i) => (
                                 <div key={i} className="flex items-center gap-2 text-white font-bold text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                    {text}
                                 </div>
                              ))}
                           </div>
                        </div>
                     </section>

                     {/* CATEGORIES RAIL */}
                     <section className="py-12 bg-white border-b border-gray-100">
                        <div className="max-w-7xl mx-auto px-4">
                           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Explore by Category</h3>
                           <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                              {categories.map((cat, i) => (
                                 <button key={i} className="flex flex-col items-center gap-3 min-w-[100px] group cursor-pointer">
                                    <div className="w-20 h-20 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all duration-300 shadow-sm group-hover:shadow-md">
                                       {cat.icon}
                                    </div>
                                    <span className="font-bold text-gray-600 group-hover:text-emerald-600 transition">{cat.name}</span>
                                 </button>
                              ))}
                           </div>
                        </div>
                     </section>

                     {/* POPULAR DESTINATIONS */}
                     <section className="py-24 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4">
                           <div className="flex justify-between items-end mb-12">
                              <div>
                                 <h2 className="text-4xl font-black text-gray-900 mb-4">Popular Destinations</h2>
                                 <p className="text-gray-500 max-w-md">Orangutan sanctuaries, floating markets, and crystal clear waters waiting for you.</p>
                              </div>
                              <Link href="/packages" className="hidden md:flex items-center gap-2 font-bold text-emerald-600 hover:text-emerald-700 transition">
                                 See All Locations <ArrowRight className="w-4 h-4" />
                              </Link>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              {popularDestinations.map((dest, i) => (
                                 <Link href={`/destinations/${dest.id}`} key={dest.id} className="group relative aspect-4/5 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                    <Image
                                       src={dest.imageUrl}
                                       alt={dest.name}
                                       fill
                     <div className="text-center px-6 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur">
                                       <div className="text-3xl font-bold text-emerald-400 mb-1">Rp 2M</div>
                                       <div className="text-xs text-emerald-200">{t.homepage.donationDistributed}</div>
                                    </div>
                                 </div>
               </div>
                           <div className="md:w-1/2 flex justify-center">
                              <Link href="/about" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-emerald-900 transition-all duration-200 bg-white font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 hover:bg-emerald-50">
                                 {t.homepage.learnImpact}
                                 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
                              </Link>
                           </div>
                        </motion.div>
                     </section>

                     {/* 6. TESTIMONIALS */}
                     <motion.div {...fadeInUp}>
                        <Testimonials />
                     </motion.div>

                  </Layout>
                  );
}
