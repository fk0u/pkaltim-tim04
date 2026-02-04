import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
<<<<<<< HEAD
import { Testimonial } from '@/types';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
=======
import { useLanguage } from '@/contexts/LanguageContext';
import { useContent } from '@/contexts/ContentContext';

export default function Testimonials() {
   const { t } = useLanguage();
   // Get testimonials from backend via ContentContext
   const { testimonials, loading } = useContent();

   // Use backend data if available, otherwise fall back to language context data
   const testimonialsData = testimonials.length > 0
      ? testimonials
      : (Array.isArray(t.testimonials) ? t.testimonials : []);

   if (loading && testimonialsData.length === 0) {
      return <div className="py-20 text-center text-gray-400">Loading testimonials...</div>;
   }
>>>>>>> 332fc3d2c0ba159299a2ec965f3ed464edf8bd18

  useEffect(() => {
      fetch('/api/testimonials')
          .then(res => res.json())
          .then(data => {
              if (Array.isArray(data)) {
                  setTestimonials(data);
              }
          })
          .catch(err => console.error(err));
  }, []);

  return (
    <section className="py-20 bg-emerald-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
          </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kata Mereka</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cerita asli dari para petualang yang telah menjadi bagian dari gerakan pariwisata berkelanjutan BorneoTrip.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white p-8 rounded-2xl shadow-lg border border-emerald-100 flex flex-col hover:-translate-y-2 transition duration-300">
               <div className="mb-6 text-emerald-300">
                  <Quote className="w-10 h-10" />
               </div>
               
               <p className="text-gray-700 leading-relaxed italic mb-8 flex-grow">
                 "{t.content}"
               </p>

<<<<<<< HEAD
               <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                  <img src={t.avatarUrl} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100" />
                  <div>
                     <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                     <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5 text-yellow-400">
                     {[...Array(Number(t.rating) || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                     ))}
=======
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {testimonialsData.map((item: any) => (
                  <div key={item.id} className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 group hover:-translate-y-2 transition duration-500 border border-transparent hover:border-emerald-100 flex flex-col h-full">
                     <div className="mb-8 text-emerald-500 bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition duration-500">
                        <Quote className="w-6 h-6 fill-emerald-500" />
                     </div>

                     <p className="text-xl text-gray-800 leading-relaxed font-medium mb-10 grow">
                        "{item.content}"
                     </p>

                     <div className="flex items-center gap-4 mt-auto">
                        <div className="relative">
                           <div className="absolute inset-0 bg-emerald-500 rounded-full blur opacity-20 group-hover:opacity-40 transition"></div>
                           <img src={item.avatarUrl} alt={item.name} className="relative w-14 h-14 rounded-full object-cover ring-4 ring-white" />
                        </div>
                        <div>
                           <h4 className="font-extrabold text-gray-900 text-lg">{item.name}</h4>
                           <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{item.role}</p>
                        </div>
                        <div className="ml-auto flex gap-0.5 text-yellow-400">
                           {[...Array(item.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                           ))}
                        </div>
                     </div>
>>>>>>> 332fc3d2c0ba159299a2ec965f3ed464edf8bd18
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Clients/Logos (Static Mock) */}
        <div className="mt-20 pt-10 border-t border-emerald-100/50">
           <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Didukung Oleh</p>
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
