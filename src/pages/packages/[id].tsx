import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useContent } from '@/contexts/ContentContext';
import { DatePicker } from '@/components/ui';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, CheckCircle, Calendar, Users, ArrowRight, ShieldCheck, Share2, Heart } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TourPackage, ItineraryDetail } from '@/types';
import { ITINERARY_DETAILS } from '@/data/mockData';

export default function PackageDetail() {
   const router = useRouter();
   const { id } = router.query;
   const { packages } = useContent();
   const [pkg, setPkg] = useState<TourPackage | null>(null);
   const [itinerary, setItinerary] = useState<ItineraryDetail | null>(null);
   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
   const [pax, setPax] = useState(1);

   useEffect(() => {
      if (id && packages.length > 0) {
         const foundPkg = packages.find(p => p.id === id);
         setPkg(foundPkg || null);

         const foundItinerary = ITINERARY_DETAILS.find(i => i.packageId === id);
         setItinerary(foundItinerary || null);
      }
   }, [id, packages]);

   if (!pkg) return null;

   const handleBook = () => {
      router.push({
         pathname: '/checkout',
         query: {
            id: pkg.id,
            pkg: pkg.title,
            price: pkg.price * pax,
            image: pkg.imageUrl,
            location: pkg.location,
            date: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
            pax: pax
         }
      });
   };

   return (
      <Layout title={`${pkg.title} - BorneoTrip`}>
         <div className="bg-white pb-24">
            {/* Hero */}
            <div className="relative h-[60vh] lg:h-[70vh] w-full">
               <Image
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  fill
                  className="object-cover"
                  priority
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
               <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 lg:p-12">
                  <div className="max-w-7xl mx-auto">
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                     >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest mb-4 shadow-lg">
                           Premium Package
                        </span>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight max-w-4xl drop-shadow-xl">{pkg.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 md:gap-8 text-white/90 text-sm md:text-lg font-medium">
                           <div className="flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-emerald-400" /> {pkg.location}
                           </div>
                           <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-emerald-400" /> {pkg.duration}
                           </div>
                           <div className="flex items-center gap-2">
                              <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> {pkg.rating} ({pkg.ecoRating}/5 Eco-Rating)
                           </div>
                        </div>
                     </motion.div>
                  </div>
               </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-8">

                     {/* Overview */}
                     <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang Paket Ini</h2>
                        <p className="text-gray-600 leading-relaxed text-lg mb-6">{pkg.description}</p>

                        <div className="grid grid-cols-2 gap-4">
                           {pkg.facilities.map((fac, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                 <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                 <span className="font-bold text-gray-700 text-sm">{fac}</span>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Itinerary */}
                     {itinerary && (
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                           <h2 className="text-2xl font-bold text-gray-900 mb-8">Rencana Perjalanan</h2>
                           <div className="space-y-8 relative">
                              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>
                              {itinerary.days.map((day, idx) => (
                                 <div key={idx} className="relative pl-12 group">
                                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-100 border-4 border-white flex items-center justify-center font-bold text-emerald-600 z-10 group-hover:bg-emerald-500 group-hover:text-white transition shadow-sm">
                                       {day.day}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">{day.title}</h3>
                                    <div className="space-y-4">
                                       {day.activities.map((act, actIdx) => (
                                          <div key={actIdx} className="bg-slate-50 p-4 rounded-2xl hover:bg-slate-100 transition border border-slate-100/50">
                                             <div className="flex items-center gap-3 mb-1">
                                                <span className="px-2 py-1 bg-white rounded-lg text-xs font-bold text-emerald-600 border border-emerald-100">{act.time}</span>
                                                <span className={`text-xs font-bold uppercase tracking-wider ${act.type === 'Meal' ? 'text-orange-500' : 'text-blue-500'}`}>{act.type}</span>
                                             </div>
                                             <p className="font-bold text-gray-800">{act.title}</p>
                                             <p className="text-sm text-gray-500">{act.description}</p>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                  </div>

                  {/* Booking Sidebar */}
                  <div className="lg:col-span-1 relative">
                     <div className="sticky top-28 space-y-6">
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8 overflow-hidden relative">
                           <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-bl-full -z-0 opacity-50"></div>

                           <div className="relative z-10">
                              <div className="flex items-end gap-2 mb-6">
                                 <div className="flex flex-col">
                                    <span className="text-sm text-gray-500 font-bold line-through">Rp {(pkg.price * 1.2).toLocaleString('id-ID')}</span>
                                    <span className="text-3xl font-black text-gray-900">Rp {pkg.price.toLocaleString('id-ID')}</span>
                                 </div>
                                 <span className="text-sm text-gray-500 font-medium mb-1.5">/ orang</span>
                              </div>

                              <div className="space-y-4 mb-8">
                                 <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Pilih Tanggal</label>
                                    <DatePicker
                                       label="Tanggal Keberangkatan"
                                       placeholder="Pilih tanggal"
                                       selected={selectedDate}
                                       onChange={setSelectedDate}
                                    />
                                 </div>

                                 <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Jumlah Peserta</label>
                                    <div className="flex items-center bg-gray-50 rounded-xl p-2 border border-gray-200">
                                       <button onClick={() => setPax(Math.max(1, pax - 1))} className="w-10 h-10 bg-white rounded-lg shadow-sm font-bold text-gray-600 hover:bg-gray-100 flex items-center justify-center transition">-</button>
                                       <div className="flex-1 text-center font-bold text-gray-900">{pax} Orang</div>
                                       <button onClick={() => setPax(pax + 1)} className="w-10 h-10 bg-emerald-500 rounded-lg shadow-emerald-200 shadow-sm font-bold text-white hover:bg-emerald-600 flex items-center justify-center transition">+</button>
                                    </div>
                                 </div>

                                 <div className="pt-4 border-t border-dashed border-gray-200">
                                    <div className="flex justify-between items-center mb-1">
                                       <span className="text-sm text-gray-500">Total Harga</span>
                                       <span className="font-bold text-2xl text-emerald-600">Rp {(pkg.price * pax).toLocaleString('id-ID')}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 text-right">Termasuk pajak & biaya layanan</p>
                                 </div>
                              </div>

                              <button
                                 onClick={handleBook}
                                 className="w-full py-4 bg-gray-900 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-xl shadow-gray-200 hover:shadow-emerald-200 transition-all duration-300 flex items-center justify-center gap-2 group"
                              >
                                 Book Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                              </button>

                              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                                 <ShieldCheck className="w-4 h-4 text-emerald-500" /> Jaminan Harga Terbaik
                              </div>
                           </div>
                        </div>

                        <div className="flex gap-4">
                           <button className="flex-1 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 font-bold text-sm text-gray-600 flex items-center justify-center gap-2 transition">
                              <Share2 className="w-4 h-4" /> Share
                           </button>
                           <button className="flex-1 py-3 rounded-xl bg-white border border-gray-200 hover:border-red-200 hover:text-red-500 font-bold text-sm text-gray-600 flex items-center justify-center gap-2 transition group">
                              <Heart className="w-4 h-4 group-hover:fill-red-500" /> Wishlist
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </Layout>
   );
}
