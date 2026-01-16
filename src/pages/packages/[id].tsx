import Layout from '@/components/Layout';
import { ITINERARY_DETAIL, PACKAGES } from '@/data/mockData';
import { useRouter } from 'next/router';
import { Clock, MapPin, ShieldCheck, CheckCircle2, Utensils, Bus, Camera, BedDouble, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { DatePicker, Counter, useToast } from '@/components/ui';

export default function PackageDetail() {
   const router = useRouter();
   const { id } = router.query;
   const { addToast } = useToast();

   const [date, setDate] = useState<Date | undefined>(undefined);
   const [pax, setPax] = useState(1);

   // In a real app, fetch data based on ID. 
   // For mock, we check if the ID matches our single itinerary detail source or fallback.
   // We'll just look up the package info from PACKAGES and use the single ITINERARY_DETAIL for the timeline.

   const pkg = PACKAGES.find(p => p.id === id);
   const itinerary = ITINERARY_DETAIL; // Using static detailed mock for demo

   if (!pkg && typeof window !== 'undefined') {
      return <Layout><div className="min-h-screen flex items-center justify-center">Loading...</div></Layout>;
   }

   if (!pkg) return null;

   const totalPrice = pkg.price * pax;

   const handleBooking = () => {
      if (!date) {
         addToast("Mohon pilih tanggal keberangkatan", "error");
         return;
      }

      const totalPrice = pkg.price * pax;
      router.push({
         pathname: '/checkout',
         query: {
            pkg: pkg.title,
            date: date.toLocaleDateString('id-ID'), // Format date for display
            pax: pax,
            price: totalPrice
         }
      });
   };

   return (
      <Layout title={`${pkg.title} - BorneoTrip`}>
         {/* HERO HEADER */}
         <div className="relative h-[60vh] overflow-hidden">
            <motion.img
               initial={{ scale: 1.1 }}
               animate={{ scale: 1 }}
               transition={{ duration: 1.5 }}
               src={pkg.imageUrl}
               alt={pkg.title}
               className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5, duration: 0.8 }}
               className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white max-w-7xl mx-auto"
            >
               <div className="flex flex-wrap gap-2 mb-4">
                  {itinerary.badges.map((badge, i) => (
                     <motion.span
                        key={badge}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + (i * 0.1) }}
                        className="px-3 py-1 bg-emerald-600/90 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 shadow-lg"
                     >
                        {badge}
                     </motion.span>
                  ))}
               </div>
               <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight drop-shadow-xl">{pkg.title}</h1>
               <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-gray-200">
                  <div className="flex items-center gap-2 font-medium bg-black/20 backdrop-blur px-3 py-1 rounded-full"><Clock className="w-5 h-5 text-emerald-400" /> {pkg.duration}</div>
                  <div className="flex items-center gap-2 font-medium bg-black/20 backdrop-blur px-3 py-1 rounded-full"><MapPin className="w-5 h-5 text-emerald-400" /> {pkg.location}</div>
                  <div className="flex items-center gap-2 font-medium bg-black/20 backdrop-blur px-3 py-1 rounded-full"><ShieldCheck className="w-5 h-5 text-emerald-400" /> Eco-Rating {pkg.ecoRating}/5</div>
               </div>
            </motion.div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12 relative z-10 -mt-8">

            {/* LEFT CONTENT: ITINERARY */}
            <div className="lg:w-2/3">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8 relative overflow-hidden"
               >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-cyan-500"></div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <Camera className="w-6 h-6 text-emerald-600" /> Sekilas Perjalanan
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                     {pkg.description} Rasakan pengalaman mendalam menyatu dengan alam dan budaya lokal tanpa merusak ekosistem.
                  </p>

                  <div className="bg-gray-50 rounded-2xl p-6">
                     <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest">Fasilitas Premium Termasuk</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pkg.facilities.map(f => (
                           <div key={f} className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                              <span className="font-medium">{f}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </motion.div>

               <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-10 flex items-center gap-2">
                     <Clock className="w-6 h-6 text-orange-500" /> Itinerary Detail
                  </h2>

                  <div className="space-y-12">
                     {itinerary.days.map((day, dayIdx) => (
                        <motion.div
                           key={day.day}
                           initial={{ opacity: 0, x: -20 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: 0.1 }}
                           className="relative pl-8 border-l-2 border-emerald-100/50"
                        >
                           <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-50 shadow-lg"></div>
                           <h3 className="text-xl font-bold text-gray-900 mb-6 bg-emerald-50/50 inline-block px-4 py-2 rounded-lg border border-emerald-100">
                              Hari {day.day}: <span className="text-emerald-800">{day.title}</span>
                           </h3>

                           <div className="space-y-8">
                              {day.activities.map((act, idx) => {
                                 let Icon = Camera;
                                 let colorClass = "bg-blue-100 text-blue-600 ring-blue-50";

                                 if (act.type === 'Meal') { Icon = Utensils; colorClass = "bg-orange-100 text-orange-600 ring-orange-50"; }
                                 if (act.type === 'Transport') { Icon = Bus; colorClass = "bg-gray-100 text-gray-600 ring-gray-50"; }
                                 if (act.type === 'Rest') { Icon = BedDouble; colorClass = "bg-purple-100 text-purple-600 ring-purple-50"; }
                                 if (act.type === 'Activity') { Icon = Camera; colorClass = "bg-emerald-100 text-emerald-600 ring-emerald-50"; }

                                 return (
                                    <motion.div
                                       key={idx}
                                       initial={{ opacity: 0, y: 20 }}
                                       whileInView={{ opacity: 1, y: 0 }}
                                       viewport={{ once: true, margin: "-50px" }}
                                       transition={{ delay: 0.1 + (idx * 0.1) }}
                                       className="flex gap-5 group relative"
                                    >
                                       {/* Connector Line (except last item) */}
                                       {idx !== day.activities.length - 1 && (
                                          <div className="absolute left-[22px] top-12 bottom-[-40px] w-[2px] bg-gray-100 dashed-line"></div>
                                       )}

                                       <div className={`relative z-10 w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center ${colorClass} ring-4 transition-transform group-hover:scale-110 shadow-sm`}>
                                          <Icon className="w-5 h-5" />
                                       </div>

                                       <div className="flex-1 pb-2">
                                          <div className="flex items-center gap-3 mb-2">
                                             <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-500 border border-gray-200">{act.time}</span>
                                             <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{act.type}</span>
                                          </div>
                                          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all group-hover:bg-gray-50/50">
                                             <div className="font-bold text-gray-800 text-lg mb-2 group-hover:text-emerald-700 transition">{act.title}</div>
                                             <div className="text-gray-600 leading-relaxed text-sm">{act.description}</div>
                                          </div>
                                       </div>
                                    </motion.div>
                                 );
                              })}
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </div>

            {/* RIGHT SIDEBAR: BOOKING CARD */}
            <div className="lg:w-1/3">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="sticky top-24"
               >
                  <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 overflow-hidden relative">
                     <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>

                     <div className="flex justify-between items-end mb-8">
                        <div>
                           <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Harga</div>
                           <div className="text-3xl font-black text-gray-900 tracking-tight">
                              Rp {totalPrice.toLocaleString('id-ID')}
                           </div>
                           {pax > 1 && (
                              <div className="text-xs text-green-600 font-medium mt-1">
                                 Rp {pkg.price.toLocaleString('id-ID')} x {pax} orang
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="space-y-6 mb-8">
                        <div>
                           <DatePicker
                              label="Tanggal Keberangkatan"
                              selected={date}
                              onChange={setDate}
                              placeholder="Pilih Tanggal Trip"
                           />
                        </div>

                        <div className="pt-2">
                           <Counter
                              label="Jumlah Peserta"
                              sublabel="Minimal 1 orang"
                              value={pax}
                              min={1}
                              max={20}
                              onChange={setPax}
                           />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <button
                           onClick={handleBooking}
                           className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-emerald-200 transform active:scale-95 flex items-center justify-center gap-2"
                        >
                           Pesan Sekarang <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">
                           Download Itinerary (PDF)
                        </button>
                     </div>

                     <p className="mt-6 text-center text-xs text-gray-400 leading-relaxed px-4">
                        <ShieldCheck className="w-3 h-3 inline mr-1 text-green-500" />
                        Tanpa biaya tersembunyi. Pembatalan gratis hingga 7 hari sebelum keberangkatan.
                     </p>
                  </div>
               </motion.div>
            </div>

         </div>
      </Layout>
   );
}
