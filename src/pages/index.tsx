import { motion, MotionProps, useScroll, useTransform } from 'framer-motion';
import Layout from '@/components/Layout';
import SearchWidget from '@/components/SearchWidget';
import Testimonials from '@/components/Testimonials';
import { useContent } from '@/contexts/ContentContext';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import Head from 'next/head';

export default function Home() {
   const { t, locale } = useLanguage();
   const { packages, destinations, events } = useContent();
   const { scrollY } = useScroll();

   // Animation variants
   const fadeInUp: MotionProps = {
      initial: { opacity: 0, y: 40 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-100px" },
      transition: { duration: 0.8, ease: "easeOut" }
   };

   // Data slices
   const popularDestinations = destinations.slice(0, 4);

   const categories = [
      { name: 'Islands', icon: '🏝️' },
      { name: 'Jungle', icon: '🌳' },
      { name: 'Culture', icon: '👺' },
      { name: 'Culinary', icon: '🍜' },
      { name: 'Diving', icon: '🤿' },
      { name: 'Luxury', icon: '💎' },
   ];

   return (
      <Layout
         transparentNavbar={true}
         description={t.hero.subtitle}
         title={t.hero.title1 + ' ' + t.hero.title2}
         ogImage="/images/hero-bg.jpg"
         type="website"
      >
         <Head>
            <title>BorneoTrip - Discover East Kalimantan</title>
            <meta name="description" content="Premium travel experiences in Borneo" />
         </Head>

         {/* 1. DYNAMIC HERO SECTION WITH VIDEO */}
         <section className="relative min-h-[95vh] flex flex-col justify-end bg-black overflow-visible z-10 rounded-b-5xl md:rounded-b-7xl shadow-2xl mb-12 md:mb-20 group">
            {/* Video Background */}
            <div className="absolute inset-0 z-0 rounded-b-4xl md:rounded-b-7xl overflow-hidden">
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
               {/* Dark Overlay */}
               <div className="absolute inset-0 bg-black/30 z-20"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/40 z-20"></div>
            </div>

            {/* Content Container */}
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

                  <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 drop-shadow-xl">
                     Discover the <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Hidden Gems</span> of Borneo
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200 font-medium max-w-2xl mx-auto mb-10 text-shadow-sm">
                     Experience the untouched beauty of East Kalimantan. From the depths of the rainforest to the pristine Derawan islands.
                  </p>

                  <motion.div
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: 0.3, duration: 0.5 }}
                  >
                     <SearchWidget />
                  </motion.div>
               </motion.div>

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
                           className="object-cover group-hover:scale-110 transition duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                           <h3 className="text-2xl font-black text-white mb-1">{dest.name}</h3>
                           <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <MapPin className="w-4 h-4 text-emerald-400" />
                              {dest.type}
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            </div>
         </section>

         {/* 6. TESTIMONIALS */}
         <motion.div {...fadeInUp}>
            <Testimonials />
         </motion.div>

      </Layout>
   );
}
