import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { Clock, MapPin, ShieldCheck, CheckCircle2, Utensils, Bus, Camera, BedDouble, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { DatePicker, Counter, useToast } from '@/components/ui';
import { TourPackage, ItineraryDetail } from '@/types';

// Extended type for detail view (includes itinerary)
interface PackageDetail extends TourPackage {
   itinerary?: ItineraryDetail;
}

export default function PackageDetail() {
   const router = useRouter();
   const { id } = router.query;
   const { addToast } = useToast();

   // Helper for localized content
   const getLocalized = (content: any) => {
      if (typeof content === 'string') return content;
      if (content?.id) return content.id;
      return ''; // Fallback
   };

   const [pkg, setPkg] = useState<PackageDetail | null>(null);
   const [loading, setLoading] = useState(true);

   const [date, setDate] = useState<Date | undefined>(undefined);
   const [pax, setPax] = useState(1);

   useEffect(() => {
      if (id) {
         fetch(`/api/packages/${id}`)
            .then(res => res.json())
            .then(data => {
               if (data.success) {
                  setPkg(data.data);
               }
               setLoading(false);
            })
            .catch(() => setLoading(false));
      }
   }, [id]);

   if (loading || !pkg) {
      return (
         <Layout>
            <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium bg-slate-50">
               <div className="animate-pulse flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm tracking-wide text-emerald-800">MEMUAT PAKET...</span>
               </div>
            </div>
         </Layout>
      );
   }

   // Safe access to itinerary
   const itinerary = pkg.itinerary || {
      days: [],
      badges: []
   };

   // Fallback for badges if API structure differs or empty
   const badges = itinerary.badges || [];

   const handleBooking = () => {
      if (!date) {
         addToast("Mohon pilih tanggal keberangkatan", "error");
         return;
      }

      const totalPrice = (pkg.price || 0) * pax;
      router.push({
         pathname: '/checkout',
         query: {
            id: pkg.id,
            pkg: getLocalized(pkg.title),
            date: date.toLocaleDateString('id-ID'),
            pax: pax,
            price: totalPrice,
            location: pkg.location,
            image: pkg.imageUrl
         }
      });
   };

   // Safe total price
   const currentTotalPrice = (pkg.price || 0) * pax;



   return (
      <Layout title={`${getLocalized(pkg.title)} - BorneoTrip`}>
         {/* HERO HEADER */}
         <div className="relative h-[60vh] overflow-hidden">
            <motion.img
               initial={{ scale: 1.1 }}
               animate={{ scale: 1 }}
               transition={{ duration: 1.5 }}
               src={pkg.imageUrl}
               alt={getLocalized(pkg.title)}
               className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5, duration: 0.8 }}
               className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white max-w-7xl mx-auto"
            >
               <div className="flex flex-wrap gap-2 mb-4">
                  {badges.map((badge, i) => (
                     <motion.span
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + (i * 0.1) }}
                        className="px-3 py-1 bg-emerald-600/90 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 shadow-lg"
                     >
                        {badge}
                     </motion.span>
                  ))}
               </div>
               <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight drop-shadow-xl">{getLocalized(pkg.title)}</h1>
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
                  <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-emerald-400 to-cyan-500"></div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <Camera className="w-6 h-6 text-emerald-600" /> Sekilas Perjalanan
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                     {getLocalized(pkg.description)} Rasakan pengalaman mendalam menyatu dengan alam dan budaya lokal tanpa merusak ekosistem.
                  </p>

                  <div className="bg-gray-50 rounded-2xl p-6">
                     <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest">Fasilitas Premium Termasuk</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pkg.facilities?.map(f => (
                           <div key={f} className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
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
                     {itinerary.days?.map((day: any) => (
                        <motion.div
                           key={day.day}
                           initial={{ opacity: 0, x: -20 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: 0.1 }}
                           className="relative pl-8 border-l-2 border-emerald-100/50"
                        >
                           <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-emerald-50 ring-4 ring-emerald-50 shadow-lg"></div>
                           <h3 className="text-xl font-bold text-gray-900 mb-6 bg-emerald-50/50 inline-block px-4 py-2 rounded-lg border border-emerald-100">
                              Hari {day.day}: <span className="text-emerald-800">{day.title}</span>
                           </h3>

                           <div className="space-y-8">
                              {day.activities.map((act: any, idx: number) => {
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
                                          <div className="absolute left-5.5 top-12 -bottom-10 w-0.5 bg-gray-100 dashed-line"></div>
                                       )}

                                       <div className={`relative z-10 w-11 h-11 rounded-full shrink-0 flex items-center justify-center ${colorClass} ring-4 transition-transform group-hover:scale-110 shadow-sm`}>
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

            {/* RIGHT SIDEBAR: BOOKING CARD (Desktop Sticky) */}
            <div className="lg:w-1/3 hidden lg:block">
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
                              Rp {currentTotalPrice.toLocaleString('id-ID')}
                           </div>
                           {pax > 1 && (
                              <div className="text-xs text-green-600 font-medium mt-1">
                                 Rp {(pkg.price || 0).toLocaleString('id-ID')} x {pax} orang
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

         {/* MOBILE STICKY BOTTOM BAR */}
         <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-200 lg:hidden z-50 flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
            <div>
               <div className="text-xs text-gray-500 font-bold uppercase">Total Harga</div>
               <div className="text-xl font-black text-emerald-700">Rp {currentTotalPrice.toLocaleString('id-ID')}</div>
               <div className="text-[10px] text-gray-400">/{pax} pax</div>
            </div>
            <button
               onClick={() => {
                  if (!date) {
                     window.scrollTo({ top: 0, behavior: 'smooth' });
                     addToast("Mohon pilih tanggal di atas", "error");
                  } else {
                     handleBooking();
                  }
               }}
               className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 active:scale-95 transition"
            >
               Pesan <ArrowRight className="w-4 h-4" />
            </button>
         </div>

      </Layout>
   );
}
