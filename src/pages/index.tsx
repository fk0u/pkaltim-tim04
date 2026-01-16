import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import SearchWidget from '@/components/SearchWidget';
import HorizontalScroll from '@/components/HorizontalScroll';
import Testimonials from '@/components/Testimonials';
import { EVENTS, PACKAGES } from '@/data/mockData';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
   return (
      <Layout>
         {/* 1. DYNAMIC HERO SECTION WITH VIDEO */}
         <section className="relative min-h-[95vh] flex flex-col justify-end bg-black overflow-visible z-10 rounded-b-[3.5rem] shadow-2xl mb-20 group">

            {/* Video Background */}
            <div className="absolute inset-0 z-0 rounded-b-[3.5rem] overflow-hidden">
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
                  <source src="https://videos.pexels.com/video-files/4553282/4553282-uhd_2560_1440_30fps.mp4" type="video/mp4" />
               </video>

               {/* Dark Overlay for Text Readability */}
               <div className="absolute inset-0 bg-black/40"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/20"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-36 md:pb-48">
               <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-center mb-0"
               >
                  <motion.span
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: 0.5, duration: 0.5 }}
                     className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-sm font-bold tracking-widest uppercase mb-8 shadow-lg"
                  >
                     🌱 Sustainable Tourism
                  </motion.span>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-tight mb-8 drop-shadow-lg">
                     The Heart of <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Borneo Island</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light mb-10">
                     Jelajahi keajaiban alam liar Kalimantan Timur. Dari hutan hujan purba Wehea hingga surga bawah laut Derawan.
                  </p>
               </motion.div>

               {/* 2. SMART SEARCH WIDGET - Positioned to overlap */}
               <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="md:absolute md:-bottom-24 md:left-4 md:right-4"
               >
                  <SearchWidget />
               </motion.div>
            </div>
         </section>


         {/* PARTNER LOGOS */}
         <div className="py-12 bg-white pt-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Didukung Oleh</p>
               <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                  {/* Placeholders for logos (Wonderful Indonesia, etc) */}
                  <div className="text-2xl font-black text-gray-800 flex items-center gap-2"><div className="w-8 h-8 bg-green-600 rounded-full"></div> WONDERFUL INDONESIA</div>
                  <div className="text-2xl font-black text-gray-800 flex items-center gap-2"><div className="w-8 h-8 bg-blue-600 rounded-full"></div> DISPAR KALTIM</div>
                  <div className="text-2xl font-black text-gray-800 flex items-center gap-2"><div className="w-8 h-8 bg-orange-600 rounded-full"></div> WWF INDONESIA</div>
                  <div className="text-2xl font-black text-gray-800 flex items-center gap-2"><div className="w-8 h-8 bg-emerald-600 rounded-full"></div> JEJAKIN</div>
               </div>
            </div>
         </div>

         {/* 3. EVENT HORIZONTAL SCROLL */}
         <HorizontalScroll
            title="Event Paling Ditunggu"
            subtitle="Festival budaya dan ekowisata yang hanya terjadi setahun sekali."
            items={EVENTS}
            linkHref="/events"
         />

         {/* 4. POPULAR PACKAGES (Custom Grid for visual variety) */}
         <section className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-end mb-12">
                  <div>
                     <h2 className="text-3xl font-bold text-gray-900">Rekomendasi Paket Wisata</h2>
                     <p className="text-gray-500 mt-2">Kurasi perjalanan terbaik dengan dampak lingkungan positif.</p>
                  </div>
                  <Link href="/packages" className="hidden md:flex text-green-600 font-semibold hover:underline items-center gap-1 group">
                     Lihat Semua Paket <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Featured Large Card */}
                  <Link href={`/packages/${PACKAGES[0].id}`} className="md:col-span-2 lg:col-span-2 row-span-2 group cursor-pointer">
                     <div className="relative h-full min-h-[400px] rounded-3xl overflow-hidden shadow-md">
                        <img src={PACKAGES[0].imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={PACKAGES[0].title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-green-800">
                           Top Rated
                        </div>
                        <div className="absolute bottom-0 p-8 text-white">
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

                  {/* Standard Cards */}
                  {PACKAGES.slice(1, 4).map((pkg) => (
                     <Link href={`/packages/${pkg.id}`} key={pkg.id} className="group cursor-pointer">
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 h-full flex flex-col">
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
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
            </div>
         </section>

         {/* 6. TESTIMONIALS */}
         <Testimonials />

      </Layout>
   );
}
