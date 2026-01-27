import { useRef } from 'react';
import { Event } from '@/types';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getLocalized } from '@/utils/localization';

interface HorizontalScrollProps {
   title: string;
   subtitle?: string;
   items: Event[];
   linkHref: string;
}

import { useLanguage } from '@/contexts/LanguageContext';

export default function HorizontalScroll({ title, subtitle, items, linkHref }: HorizontalScrollProps) {
   const scrollRef = useRef<HTMLDivElement>(null);
   // const { locale } = useLanguage(); // getLocalized handles fallback, but we could pass locale if needed. For now fallback to ID/EN in helper.

   return (
      <section className="py-16 bg-white overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8 px-1">
               <div>
                  <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                  {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
               </div>
               <Link href={linkHref} className="text-green-600 font-semibold hover:underline flex items-center gap-1 group">
                  Lihat Semua <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
               </Link>
            </div>

            <div className="relative -mx-4 sm:mx-0">
               <div
                  ref={scrollRef}
                  className="flex overflow-x-auto gap-4 md:gap-6 pb-8 px-4 sm:px-1 snap-x snap-mandatory scroll-smooth hide-scrollbar"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
               >
                  {items.map((event) => (
                     <div key={event.id} className="min-w-[280px] md:min-w-[360px] snap-center first:pl-2">
                        <Link href={`/events/${event.id}`}>
                           <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer h-full flex flex-col transform hover:-translate-y-1">
                              <div className="relative h-56 overflow-hidden">
                                 <img
                                    src={event.imageUrl}
                                    alt={getLocalized(event.title)}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                 />
                                 <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-800 shadow-sm border border-green-100">
                                    {event.category}
                                 </div>
                              </div>

                              <div className="p-6 flex flex-col flex-grow">
                                 <div className="flex items-center text-green-600 font-medium text-xs mb-3 bg-green-50 w-fit px-2 py-1 rounded">
                                    <Calendar className="w-3 h-3 mr-1.5" /> {event.date}
                                 </div>
                                 <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-green-700 transition">
                                    {getLocalized(event.title)}
                                 </h3>
                                 <div className="flex items-center text-gray-500 text-sm mb-4">
                                    <MapPin className="w-4 h-4 mr-1 text-gray-400" /> {event.location}
                                 </div>
                                 <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                                    {event.tags.slice(0, 2).map(tag => (
                                       <span key={tag} className="text-[10px] uppercase font-bold tracking-wider text-gray-500 border border-gray-200 px-2 py-1 rounded-md">
                                          {tag}
                                       </span>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </Link>
                     </div>
                  ))}
               </div>

               {/* Fade overlay for scroll indication on right side */}
               <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden"></div>
            </div>
         </div>
      </section>
   );
}
