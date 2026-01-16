import Layout from '@/components/Layout';
import { ITINERARY_DETAIL, PACKAGES } from '@/data/mockData';
import { useRouter } from 'next/router';
import { Clock, MapPin, Users, ShieldCheck, CheckCircle2, Calendar, Utensils, Bus, Camera, BedDouble } from 'lucide-react';

export default function PackageDetail() {
   const router = useRouter();
   const { id } = router.query;

   // In a real app, fetch data based on ID. 
   // For mock, we check if the ID matches our single itinerary detail source or fallback.
   // We'll just look up the package info from PACKAGES and use the single ITINERARY_DETAIL for the timeline.

   const pkg = PACKAGES.find(p => p.id === id);
   const itinerary = ITINERARY_DETAIL; // Using static detailed mock for demo

   if (!pkg && typeof window !== 'undefined') {
      // rudimentary loading/not found state
      return <Layout><div className="min-h-screen flex items-center justify-center">Loading...</div></Layout>;
   }

   // Safe guard for SSR initial render
   if (!pkg) return null;

   return (
      <Layout title={`${pkg.title} - BorneoTrip`}>
         {/* HERO HEADER */}
         <div className="relative h-[60vh]">
            <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white max-w-7xl mx-auto">
               <div className="flex flex-wrap gap-2 mb-4">
                  {itinerary.badges.map(badge => (
                     <span key={badge} className="px-3 py-1 bg-emerald-600/90 backdrop-blur rounded-full text-xs font-bold uppercase tracking-wider">
                        {badge}
                     </span>
                  ))}
               </div>
               <h1 className="text-3xl md:text-5xl font-bold mb-4">{pkg.title}</h1>
               <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-gray-200">
                  <div className="flex items-center gap-2"><Clock className="w-5 h-5" /> {pkg.duration}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {pkg.location}</div>
                  <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Eco-Rating {pkg.ecoRating}/5</div>
               </div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">

            {/* LEFT CONTENT: ITINERARY */}
            <div className="lg:w-2/3">
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Sekilas Perjalanan</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                     {pkg.description} Rasakan pengalaman mendalam menyatu dengan alam dan budaya lokal tanpa merusak ekosistem.
                  </p>
                  <h3 className="font-bold text-lg mb-4">Fasilitas Termasuk</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                     {pkg.facilities.map(f => (
                        <div key={f} className="flex items-center gap-2">
                           <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {f}
                        </div>
                     ))}
                  </div>
               </div>

               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Itinerary Detail</h2>

                  <div className="space-y-12">
                     {itinerary.days.map((day) => (
                        <div key={day.day} className="relative pl-8 border-l-2 border-emerald-100">
                           <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></div>
                           <h3 className="text-xl font-bold text-gray-900 mb-4">Hari {day.day}: {day.title}</h3>

                           <div className="space-y-6">
                              {day.activities.map((act, idx) => {
                                 let Icon = Camera;
                                 let colorClass = "bg-blue-100 text-blue-600";

                                 if (act.type === 'Meal') { Icon = Utensils; colorClass = "bg-orange-100 text-orange-600"; }
                                 if (act.type === 'Transport') { Icon = Bus; colorClass = "bg-gray-100 text-gray-600"; }
                                 if (act.type === 'Rest') { Icon = BedDouble; colorClass = "bg-purple-100 text-purple-600"; }
                                 if (act.type === 'Activity') { Icon = Camera; colorClass = "bg-emerald-100 text-emerald-600"; }

                                 return (
                                    <div key={idx} className="flex gap-4 group relative">
                                       {/* Connector Line (except last item) */}
                                       {idx !== day.activities.length - 1 && (
                                          <div className="absolute left-[19px] top-10 bottom-[-24px] w-[2px] bg-gray-100 group-hover:bg-emerald-50 transition"></div>
                                       )}

                                       <div className={`relative z-10 w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${colorClass} transition-transform group-hover:scale-110`}>
                                          <Icon className="w-5 h-5" />
                                       </div>

                                       <div className="flex-1 pb-6">
                                          <div className="flex items-center gap-2 mb-1">
                                             <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500">{act.time}</span>
                                             <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{act.type}</span>
                                          </div>
                                          <div className="bg-gray-50 rounded-xl p-4 hover:bg-white hover:shadow-md transition border border-transparent hover:border-emerald-100">
                                             <div className="font-bold text-gray-800 text-lg mb-1 group-hover:text-emerald-700 transition">{act.title}</div>
                                             <div className="text-gray-600 leading-relaxed text-sm">{act.description}</div>
                                          </div>
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* RIGHT SIDEBAR: BOOKING CARD */}
            <div className="lg:w-1/3">
               <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                     <div className="text-gray-500 text-sm">Mulai dari</div>
                     <div className="text-2xl font-bold text-orange-600">
                        Rp {pkg.price.toLocaleString('id-ID')}
                        <span className="text-sm font-normal text-gray-400">/pax</span>
                     </div>
                  </div>

                  <div className="space-y-4 mb-8">
                     <div className="p-3 border rounded-xl flex items-center justify-between hover:border-emerald-500 cursor-pointer transition">
                        <span className="text-sm text-gray-600">Pilih Tanggal</span>
                        <Calendar className="w-4 h-4 text-gray-400" />
                     </div>
                     <div className="p-3 border rounded-xl flex items-center justify-between hover:border-emerald-500 cursor-pointer transition">
                        <span className="text-sm text-gray-600">Jumlah Peserta</span>
                        <Users className="w-4 h-4 text-gray-400" />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-200">
                        Pesan Sekarang
                     </button>
                     <button className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-3.5 rounded-xl transition">
                        Download Itinerary (PDF)
                     </button>
                  </div>

                  <p className="mt-4 text-center text-xs text-gray-400">
                     Tanpa biaya tersembunyi. Pembatalan gratis hingga 7 hari sebelum keberangkatan.
                  </p>
               </div>
            </div>

         </div>
      </Layout>
   );
}
