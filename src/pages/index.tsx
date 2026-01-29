import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Layout from '@/components/Layout';
import SearchWidget from '@/components/SearchWidget';
import Testimonials from '@/components/Testimonials';
import { useContent } from '@/contexts/ContentContext';
import { ArrowRight, MapPin, Star, Leaf, Heart, Globe, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRef } from 'react';

export default function Home() {
   const { t } = useLanguage();
   const { packages, events, destinations } = useContent();

   // Parallax & Scroll Logic
   const targetRef = useRef(null);
   const { scrollYProgress } = useScroll({ target: targetRef });

   const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
   const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.6]);
   const textY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

   const featuredPackages = packages.slice(0, 3);
   const popularDestinations = destinations.slice(0, 5); // 5 items for bento grid

   const categories = [
      { name: 'Island Hopping', icon: '🏝️', image: 'https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80' },
      { name: 'Deep Jungle', icon: '🌳', image: 'https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?auto=format&fit=crop&q=80' },
      { name: 'Cultural Heritage', icon: '👺', image: 'https://images.unsplash.com/photo-1542385151-efd9000d8def?auto=format&fit=crop&q=80' },
      { name: 'Wildlife Safari', icon: '🦧', image: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?auto=format&fit=crop&q=80' },
      { name: 'Luxury Diving', icon: '🤿', image: 'https://images.unsplash.com/photo-1582967788606-a171f1080cae?auto=format&fit=crop&q=80' },
   ];

   return (
      <Layout
         transparentNavbar={true}
         description={t.hero.subtitle}
         title={t.hero.title1 + ' ' + t.hero.title2}
         ogImage="/images/hero-bg.jpg"
         type="website"
      >
         <div ref={targetRef}>

            {/* --- HERO SECTION --- */}
            <section className="relative h-[110vh] flex items-center justify-center overflow-hidden bg-black -mt-[20vh] pt-[20vh]">
               {/* Video Background with Parallax */}
               <motion.div
                  style={{ scale: heroScale, opacity: heroOpacity }}
                  className="absolute inset-0 z-0"
               >
                  <div className="absolute inset-0 bg-black/40 z-10 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black z-20" />
                  <video
                     autoPlay
                     loop
                     muted
                     playsInline
                     poster="https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80"
                     className="absolute inset-0 w-full h-full object-cover"
                  >
                     <source src="/video/bumper.webm" type="video/webm" />
                     <source src="/video/bumper.mp4" type="video/mp4" />
                  </video>
               </motion.div>

               {/* Hero Content */}
               <div className="relative z-30 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center mt-20">
                  <motion.div
                     style={{ y: textY }}
                     className="space-y-8 max-w-5xl mx-auto"
                  >
                     <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-emerald-300 text-xs font-bold uppercase tracking-widest"
                     >
                        <span className="relative flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        {t.hero.badge}
                     </motion.div>

                     <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl"
                     >
                        Wait for the <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-200 to-cyan-400 animate-pulse-slow">Magic.</span>
                     </motion.h1>

                     <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="text-lg md:text-2xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed mix-blend-overlay"
                     >
                        {t.hero.subtitle}
                     </motion.p>
                  </motion.div>

                  {/* Search Widget Container - Floats above bottom */}
                  <motion.div
                     initial={{ opacity: 0, y: 100 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                     className="w-full max-w-5xl mt-12 md:mt-20"
                  >
                     <SearchWidget />
                  </motion.div>
               </div>

               {/* Scroll Indicator */}
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 z-30"
               >
                  <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
                  <div className="w-[1px] h-12 bg-linear-to-b from-white to-transparent opacity-50"></div>
               </motion.div>
            </section>

            {/* --- CATEGORIES SLIDER --- */}
            <section className="py-20 bg-white relative z-20 rounded-t-[3rem] -mt-10 overflow-hidden">
               <div className="container mx-auto px-4 mb-12 flex justify-between items-end">
                  <div>
                     <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Curated Experiences</h3>
                     <h2 className="text-4xl font-bold text-gray-900">Find Your Element</h2>
                  </div>
                  <div className="hidden md:flex gap-2">
                     <button className="p-3 rounded-full border hover:bg-black hover:text-white transition"><ArrowRight className="rotate-180 w-5 h-5" /></button>
                     <button className="p-3 rounded-full border hover:bg-black hover:text-white transition"><ArrowRight className="w-5 h-5" /></button>
                  </div>
               </div>

               <div className="flex gap-6 overflow-x-auto pb-8 container mx-auto px-4 scrollbar-hide snap-x">
                  {categories.map((cat, i) => (
                     <motion.div
                        whileHover={{ scale: 0.98 }}
                        key={i}
                        className="min-w-[280px] md:min-w-[320px] h-[400px] relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg snap-center"
                     >
                        <Image
                           src={cat.image}
                           alt={cat.name}
                           fill
                           className="object-cover group-hover:scale-110 transition duration-700"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition duration-300">
                           <div className="text-4xl mb-4 transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-500 delay-100">{cat.icon}</div>
                           <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                           <div className="h-[1px] w-0 bg-emerald-500 group-hover:w-full transition-all duration-500 delay-200"></div>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </section>

            {/* --- BENTO GRID DESTINATIONS --- */}
            <section className="py-24 bg-gray-50">
               <div className="container mx-auto px-4">
                  <div className="text-center max-w-3xl mx-auto mb-20">
                     <span className="text-emerald-600 font-bold tracking-widest text-sm uppercase block mb-4">Trending Now</span>
                     <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">Explore the Unseen.</h2>
                     <p className="text-xl text-gray-500 font-light">From the depths of the Kayan Mentarang to the pristine reefs of Maratua.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 md:h-[800px]">
                     {popularDestinations.map((dest, i) => (
                        <Link
                           href={`/destinations/${dest.id}`}
                           key={dest.id}
                           className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg ${i === 0 ? 'md:col-span-2 md:row-span-2' :
                                 i === 1 ? 'md:col-span-1 md:row-span-1' :
                                    i === 2 ? 'md:col-span-1 md:row-span-2' : ''
                              }`}
                        >
                           <Image
                              src={dest.imageUrl}
                              alt={dest.name}
                              fill
                              className="object-cover transition duration-1000 group-hover:scale-110"
                           />
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-500"></div>

                           {/* Content Overlay */}
                           <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-10 transition-transform duration-500 group-hover:-translate-y-2">
                              <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest mb-3">
                                 {dest.type}
                              </span>
                              <h3 className={`${i === 0 ? 'text-4xl' : 'text-2xl'} font-bold text-white leading-tight`}>{dest.name}</h3>
                              <div className="flex items-center gap-2 text-emerald-300 mt-2 opacity-0 group-hover:opacity-100 transition duration-300 translate-y-4 group-hover:translate-y-0">
                                 <span className="text-sm font-bold">Discover</span> <ArrowRight className="w-4 h-4" />
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>

                  <div className="mt-12 text-center">
                     <Link href="/packages" className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition-all duration-300 group">
                        View All Destinations <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                     </Link>
                  </div>
               </div>
            </section>

            {/* --- IMMERSIVE IMPACT SECTION --- */}
            <section className="py-32 bg-emerald-900 text-white relative overflow-hidden">
               {/* Background Pattern */}
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
               <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500 rounded-full blur-[100px] opacity-30 animate-pulse-slow"></div>

               <div className="container mx-auto px-4 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                     <div>
                        <Leaf className="w-16 h-16 text-emerald-400 mb-8" />
                        <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                           Travel that <br />
                           <span className="text-emerald-400">Heals Nature.</span>
                        </h2>
                        <div className="space-y-8 text-lg text-emerald-100 font-light leading-relaxed">
                           <p>
                              Every journey you take is a seed planted for the future. We don't just explore; we restore.
                           </p>
                           <ul className="space-y-4">
                              {[
                                 'Zero-Plastic Policy on all trips',
                                 '5% of profits go to Orangutan Conservation',
                                 'Empowering Local Dayak Communities'
                              ].map((item, i) => (
                                 <li key={i} className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                    {item}
                                 </li>
                              ))}
                           </ul>
                           <div className="pt-8">
                              <Link href="/about" className="inline-flex items-center gap-2 text-white font-bold border-b border-emerald-400 pb-1 hover:text-emerald-400 transition">
                                 Read our Impact Report <ArrowRight className="w-4 h-4" />
                              </Link>
                           </div>
                        </div>
                     </div>

                     {/* Stats Grid */}
                     <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 hover:bg-white/15 transition duration-500 group">
                           <div className="text-5xl font-black text-white mb-2 group-hover:scale-110 origin-left transition">500+</div>
                           <div className="text-emerald-300 font-bold uppercase tracking-widest text-sm">Trees Planted</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 hover:bg-white/15 transition duration-500 translate-y-12">
                           <div className="text-5xl font-black text-white mb-2">Rp 2M</div>
                           <div className="text-emerald-300 font-bold uppercase tracking-widest text-sm">Donated</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 hover:bg-white/15 transition duration-500">
                           <div className="text-5xl font-black text-white mb-2">15</div>
                           <div className="text-emerald-300 font-bold uppercase tracking-widest text-sm">Communities</div>
                        </div>
                        <div className="bg-emerald-500 p-8 rounded-[2rem] shadow-2xl shadow-emerald-900/50 flex items-center justify-center translate-y-12 cursor-pointer hover:scale-105 transition">
                           <div className="text-center">
                              <Heart className="w-10 h-10 text-white mx-auto mb-2 animate-bounce" />
                              <div className="font-bold">Join the Movement</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* --- TESTIMONIALS --- */}
            <Testimonials />

         </div>
      </Layout>
   );
}
