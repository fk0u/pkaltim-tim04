import { motion, MotionProps } from 'framer-motion';
import Layout from '@/components/Layout';
import SearchWidget from '@/components/SearchWidget';
import HorizontalScroll from '@/components/HorizontalScroll';
import Testimonials from '@/components/Testimonials';
import { EVENTS, PACKAGES } from '@/data/mockData';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import RegionExplorer from '@/components/RegionExplorer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
   const { t } = useLanguage();

   const fadeInUp: MotionProps = {
      initial: { opacity: 0, y: 40 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-100px" },
      transition: { duration: 0.8, ease: "easeOut" }
   };

   return (
      <Layout>
         {/* 1. DYNAMIC HERO SECTION WITH VIDEO */}
         <section className="relative min-h-[95vh] flex flex-col justify-end bg-black overflow-visible z-10 rounded-b-[2.5rem] md:rounded-b-[3.5rem] shadow-2xl mb-12 md:mb-20 group">

            {/* Video Background */}
            <div className="absolute inset-0 z-0 rounded-b-[2rem] md:rounded-b-[3.5rem] overflow-hidden">
               {/* Fallback Image */}
               <img
                  src="https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Hutan Kalimantan"
               />
               {/* Video Layer */}
               <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
               >
                  <source src="/video/bumper.mp4" type="video/mp4" />
               </video>

               {/* Dark Overlay for Text Readability */}
               <div className="absolute inset-0 bg-black/40"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/20"></div>
            </div>

            {/* Content Container - Added pt-32 to prevent overlap with Navbar on small screens */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 pt-32 md:pb-48 md:pt-0 flex flex-col justify-end h-full">
               <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3, duration: 1, ease: "easeOut" }}
                  className="text-center mb-4"
               >
                  <motion.span
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: 3.5, duration: 0.5 }}
                     className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-[10px] md:text-sm font-bold tracking-widest uppercase mb-3 md:mb-8 shadow-lg"
                  >
                     {t.hero.badge}
                  </motion.span>
                  <h1 className="text-3xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-tight mb-3 md:mb-8 drop-shadow-lg">
                     {t.hero.title1} <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">{t.hero.title2}</span>
                  </h1>
                  <p className="text-xs md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light mb-4 md:mb-10 px-4">
                     {t.hero.subtitle}
                  </p>
               </motion.div>

               {/* 2. SMART SEARCH WIDGET - Positioned to overlap */}
               <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.8, duration: 0.8 }}
                  className="w-full md:absolute md:-bottom-24 md:left-4 md:right-4 pb-8 md:pb-0"
               >
                  <SearchWidget />
               </motion.div>
            </div>
         </section>


         {/* PARTNER LOGOS MARQUEE */}
         <div className="py-12 bg-white pt-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Didukung Oleh</p>
            </div>

            <div className="relative w-full flex overflow-hidden">
               <motion.div
                  className="flex items-center whitespace-nowrap"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
               >
                  {/* Seamless loop: Original List + Duplicate List */}
                  {[...Array(2)].map((_, i) => (
                     <div key={i} className="flex gap-12 md:gap-24 items-center pr-12 md:pr-24 flex-shrink-0">
                        <img src="/logo/bankaltimtara.png" alt="Bankaltimtara" className="h-10 md:h-14 w-auto object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition duration-500" />
                        <img src="/logo/pemprov-kaltim.png" alt="Pemprov Kaltim" className="h-10 md:h-14 w-auto object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition duration-500" />
                        <img src="/logo/dispar-kaltim.png" alt="Dispar Kaltim" className="h-10 md:h-14 w-auto object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition duration-500" />
                        <img src="/logo/kemenparekraf.png" alt="Kemenparekraf" className="h-10 md:h-14 w-auto object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition duration-500" />
                        <img src="/logo/wonderful-indonesia.png" alt="Wonderful Indonesia" className="h-10 md:h-14 w-auto object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition duration-500" />
                        <img src="/logo/wwf.png" alt="WWF" className="h-10 md:h-14 w-auto object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition duration-500" />
                        <img src="/logo/jejakin.png" alt="Jejakin" className="h-10 md:h-14 w-auto object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition duration-500" />
                     </div>
                  ))}
               </motion.div>
            </div>
         </div>

         {/* 3. EVENT HORIZONTAL SCROLL */}
         <motion.div {...fadeInUp}>
            <HorizontalScroll
               title="Event Paling Ditunggu"
               subtitle="Festival budaya dan ekowisata yang hanya terjadi setahun sekali."
               items={EVENTS}
               linkHref="/events"
            />
         </motion.div>

         {/* 4. CITY EXPLORATION SECTION */}
         <motion.div {...fadeInUp}>
            <RegionExplorer />
         </motion.div>

         {/* 4. POPULAR PACKAGES (Custom Grid for visual variety) */}
         <section className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <motion.div {...fadeInUp} className="flex justify-between items-end mb-12">
                  <div>
                     <h2 className="text-3xl font-bold text-gray-900">Rekomendasi Paket Wisata</h2>
                     <p className="text-gray-500 mt-2">Kurasi perjalanan terbaik dengan dampak lingkungan positif.</p>
                  </div>
                  <Link href="/packages" className="hidden md:flex text-green-600 font-semibold hover:underline items-center gap-1 group">
                     Lihat Semua Paket <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>
               </motion.div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Featured Large Card */}
                  <motion.div {...fadeInUp} className="md:col-span-2 lg:col-span-2 row-span-2">
                     <Link href={`/packages/${PACKAGES[0].id}`} className="block h-full group cursor-pointer relative">
                        <div className="h-full min-h-[400px] rounded-3xl overflow-hidden shadow-md transform transition duration-500 hover:-translate-y-1 hover:shadow-2xl">
                           <img src={PACKAGES[0].imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={PACKAGES[0].title} />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                           <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-green-800">
                              Top Rated
                           </div>
                           <div className="absolute bottom-0 p-8 text-white w-full">
                              <div className="flex items-center gap-2 mb-2 text-green-300 font-bold text-sm">
                                 <span>{PACKAGES[0].duration}</span> • <span>{PACKAGES[0].location}</span>
                              </div>
                              <h3 className="text-3xl font-bold mb-4 leading-tight">{PACKAGES[0].title}</h3>
                              <p className="text-gray-200 line-clamp-2 mb-6">{PACKAGES[0].description}</p>
                              <div className="flex items-center justify-between">
                                 <div className="text-lg font-bold text-orange-400">Rp {PACKAGES[0].price.toLocaleString('id-ID')}</div>
                                 <span className="bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold transition">Lihat Detail</span>
                              </div>
                           </div>
                        </div>
                     </Link>
                  </motion.div>

                  {/* Standard Cards */}
                  {PACKAGES.slice(1, 4).map((pkg, idx) => (
                     <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.8 }}
                     >
                        <Link href={`/packages/${pkg.id}`} className="group cursor-pointer h-full block">
                           <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 h-full flex flex-col transform hover:-translate-y-2">
                              <div className="relative h-48 overflow-hidden">
                                 <img src={pkg.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={pkg.title} />
                                 <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {pkg.duration}
                                 </div>
                              </div>
                              <div className="p-5 flex flex-col flex-grow">
                                 <div className="text-xs text-gray-400 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {pkg.location}</div>
                                 <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition">{pkg.title}</h3>
                                 <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded font-bold">🌱 Eco {pkg.ecoRating}/5</span>
                                    <span className="font-bold text-orange-600 text-sm">Rp {pkg.price.toLocaleString('id-ID')}</span>
                                 </div>
                              </div>
                           </div>
                        </Link>
                     </motion.div>
                  ))}
               </div>

               <div className="mt-8 text-center md:hidden">
                  <Link href="/packages" className="inline-flex items-center gap-2 text-green-700 font-bold border border-green-200 px-6 py-3 rounded-full hover:bg-green-50 transition">
                     Lihat Semua Paket <ArrowRight className="w-4 h-4" />
                  </Link>
               </div>
            </div>
         </section>

         {/* 5. SUSTAINABILITY BANNER (Redesigned) */}
         <section className="py-20 bg-emerald-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5d2294c?auto=format&fit=crop&q=80')] bg-cover bg-fixed opacity-10 mix-blend-overlay"></div>
            <motion.div {...fadeInUp} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
               <div className="md:w-1/2">
                  <h2 className="text-4xl font-bold mb-6 leading-tight">Berwisata Sambil <span className="text-emerald-400">Menjaga Bumi</span></h2>
                  <p className="text-emerald-100/80 text-lg mb-8 leading-relaxed">
                     Setiap pemesanan di BorneoTrip menyisihkan 5% profit untuk konservasi Orangutan dan pemberdayaan masyarakat adat Dayak.
                  </p>
                  <div className="flex gap-4">
                     <div className="text-center px-6 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur">
                        <div className="text-3xl font-bold text-emerald-400 mb-1">1.5k+</div>
                        <div className="text-xs text-emerald-200">Pohon Ditanam</div>
                     </div>
                     <div className="text-center px-6 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur">
                        <div className="text-3xl font-bold text-emerald-400 mb-1">Rp 2M</div>
                        <div className="text-xs text-emerald-200">Donasi Tersalur</div>
                     </div>
                  </div>
               </div>
               <div className="md:w-1/2 flex justify-center">
                  <Link href="/about" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-emerald-900 transition-all duration-200 bg-white font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 hover:bg-emerald-50">
                     Pelajari Impact Kami
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
