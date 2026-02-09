import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContent } from '@/contexts/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Testimonials() {
   const { t } = useLanguage();
   // Get testimonials from backend via ContentContext
   const { testimonials, loading } = useContent();

   // Use backend data if available, otherwise fall back to language context data
   const testimonialsData = testimonials.length > 0
      ? testimonials
      : (Array.isArray(t.testimonials) ? t.testimonials : []);

   const [currentIndex, setCurrentIndex] = useState(0);
   const [itemsPerPage, setItemsPerPage] = useState(1);

   // Responsive Logic
   useEffect(() => {
      const handleResize = () => {
         setItemsPerPage(window.innerWidth >= 768 ? 3 : 1);
      };

      // Initial check
      handleResize();

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   // Auto-play Logic
   useEffect(() => {
      if (testimonialsData.length <= itemsPerPage) return;

      const interval = setInterval(() => {
         setCurrentIndex((prev) => {
            // If we reach the end (where showing the last 'itemsPerPage' items), reset to 0
            // Actually for a continuous feel, we can just loop. 
            // Logic: if prev + 1 > total - itemsPerPage, go to 0? 
            // Or simple loop: (prev + 1) % (total - itemsPerPage + 1).
            // Let's do simple loop: (prev + 1) % totalItems. 
            // But we don't want empty space at the end.
            // Better: (prev + 1) % testimonialsData.length
            return (prev + 1) % testimonialsData.length;
         });
      }, 5000);

      return () => clearInterval(interval);
   }, [testimonialsData.length, itemsPerPage]);

   const handleNext = () => {
      setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
   };

   const handlePrev = () => {
      setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
   };

   if (loading && testimonialsData.length === 0) {
      return <div className="py-20 text-center text-gray-400">Loading testimonials...</div>;
   }

   return (
      <section className="py-24 bg-emerald-50 relative overflow-hidden">
         {/* Background decoration */}
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
            </svg>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">{t.homepage?.testimonialsTitle || "Kata Mereka"}</h2>
               <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  {t.homepage?.testimonialsDesc || "Cerita asli dari para petualang yang telah menjadi bagian dari gerakan pariwisata berkelanjutan BorneoTrip."}
               </p>
            </div>

            <div className="relative group/carousel">
               {/* Slider Container */}
               <div className="overflow-hidden px-4 -mx-4 pb-20 pt-10"> {/* Added vertical padding for shadows/hover effects */}
                  <motion.div
                     animate={{
                        x: `-${currentIndex * (100 / itemsPerPage)}%`
                     }}
                     transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                     }}
                     className="flex gap-0" // Gap handled by padding inside items to ensure % calc is clean
                  >
                     {testimonialsData.map((item: any, idx: number) => (
                        <div
                           key={item.id || idx}
                           className="shrink-0 px-4 transition-all duration-500"
                           style={{ width: `${100 / itemsPerPage}%` }}
                        >
                           <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-2 transition duration-500 border border-transparent hover:border-emerald-100 flex flex-col h-full relative group/card">
                              <div className="mb-8 text-emerald-500 bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center group-hover/card:scale-110 transition duration-500">
                                 <Quote className="w-6 h-6 fill-emerald-500" />
                              </div>

                              <p className="text-lg text-gray-700 leading-relaxed font-medium mb-10 grow italic">
                                 "{item.content}"
                              </p>

                              <div className="flex items-center gap-4 mt-auto">
                                 <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur opacity-20 group-hover/card:opacity-40 transition"></div>
                                    <img src={item.avatarUrl || `https://ui-avatars.com/api/?name=${item.name}&background=random`} alt={item.name} className="relative w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-md" />
                                 </div>
                                 <div>
                                    <h4 className="font-extrabold text-gray-900 text-lg">{item.name}</h4>
                                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{item.role}</p>
                                 </div>
                              </div>

                              {/* Rating Absolute */}
                              <div className="absolute top-10 right-10 flex gap-0.5 text-yellow-400 opacity-80">
                                 {[...Array(item.rating || 5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                 ))}
                              </div>
                           </div>
                        </div>
                     ))}
                  </motion.div>
               </div>

               {/* Navigation Controls (Visible on Hover or Mobile) */}
               <div className="flex justify-center gap-4 md:absolute md:top-1/2 md:-translate-y-1/2 md:w-full md:justify-between md:pointer-events-none md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity duration-300 z-20">
                  {/* Prev Button */}
                  <button
                     onClick={handlePrev}
                     className="pointer-events-auto p-4 rounded-full bg-white text-emerald-900 shadow-lg hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-110 md:-ml-6"
                     aria-label="Previous Testimonial"
                  >
                     <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Next Button */}
                  <button
                     onClick={handleNext}
                     className="pointer-events-auto p-4 rounded-full bg-white text-emerald-900 shadow-lg hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-110 md:-mr-6"
                     aria-label="Next Testimonial"
                  >
                     <ChevronRight className="w-6 h-6" />
                  </button>
               </div>

               {/* Indicators */}
               <div className="flex justify-center gap-2 mt-4">
                  {testimonialsData.map((_, idx) => (
                     <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-emerald-500 w-8' : 'bg-emerald-200 hover:bg-emerald-300'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                     />
                  ))}
               </div>
            </div>

            {/* Clients/Logos (Static Mock) */}
            <div className="mt-20 pt-10 border-t border-emerald-100/50">
               <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">{t.homepage?.supportedBy || "Didukung Oleh"}</p>
               <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition duration-500">
                  {['Kemenparekraf', 'Pemprov Kaltim', 'WWF Indonesia', 'Bankaltimtara'].map((partner) => (
                     <span key={partner} className="text-xl font-bold text-gray-800">{partner}</span>
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
}
