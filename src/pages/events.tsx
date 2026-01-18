import Layout from '@/components/Layout';
import { useContent } from '@/contexts/ContentContext';
import { Calendar, MapPin, Search, Ticket, Share2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui';
import Link from 'next/link';
// import { useRouter } from 'next/router'; // Removed unused import
import Image from 'next/image';

export default function EventsPage() {
  const { events } = useContent();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();
  // const router = useRouter(); // Removed unused variable

  const categories = ['All', 'Culture', 'Nature', 'Sustainability', 'Culinary'];

  const filteredEvents = events.filter(event => {
    const matchCategory = activeCategory === 'All' || activeCategory === event.category;
    const matchSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featuredEvent = events.length > 0 ? events[0] : null;

  const handleRemindMe = (e: React.MouseEvent, eventTitle: string) => {
    e.stopPropagation();
    addToast(`Pengingat diset untuk ${eventTitle}! Kami akan mengirim notifikasi.`, 'success');
  };

  return (
    <Layout title="Event Tahunan - BorneoTrip">

      {/* 1. IMMERSIVE HERO WITH FEATURED EVENT */}
      {featuredEvent && (
      <div className="relative min-h-[70vh] flex items-center bg-black overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <Image 
            src={featuredEvent.imageUrl} 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-[2s]" 
            alt={featuredEvent.title} 
            width={1920}
            height={1080}
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-widest mb-4">
              🔥 Event Terpanas Bulan Ini
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight">
              {featuredEvent.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-lg mb-8 font-medium">
              <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-green-400" /> {featuredEvent.date}</span>
              <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-green-400" /> {featuredEvent.location}</span>
            </div>
            <p className="text-gray-300 text-xl max-w-2xl mb-10 leading-relaxed">
              {featuredEvent.description}
            </p>
            <div className="flex gap-4">
               <Link href={`/events/${featuredEvent.id}`} className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-lg shadow-green-900/50 flex items-center gap-2">
                <Ticket className="w-5 h-5" /> Lihat Detail & Tiket
              </Link>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-6 py-4 rounded-full font-bold text-lg transition border border-white/20 flex items-center gap-2">
                <Share2 className="w-5 h-5" /> Share
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-20">

        {/* 2. SEARCH & FILTER BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="sticky top-24 z-30 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-gray-200/50 mb-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto hide-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat
                    ? 'bg-green-900 text-white shadow-lg shadow-green-900/20'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari festival, konser, atau lokasi..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
          </div>
        </motion.div>

        {/* 3. EVENTS GRID */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-green-600" /> Agenda Mendatang
          </h2>
          {filteredEvents.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event, idx) => (
                  <motion.div
                    layout
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link href={`/events/${event.id}`} className="bg-white rounded-4xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group flex flex-col h-full cursor-pointer relative">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                          width={400}
                          height={300}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                        <div className="absolute top-4 right-4 bg-white/30 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                          {event.category}
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <div className="flex items-center gap-2 text-sm font-medium mb-1 text-green-300">
                            <Calendar className="w-4 h-4" /> {event.date}
                          </div>
                          <h3 className="text-xl font-bold leading-tight group-hover:text-green-300 transition">{event.title}</h3>
                        </div>
                      </div>

                      <div className="p-6 grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-start text-gray-500 text-sm mb-4 gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-3 mb-6 bg-gray-50 p-3 rounded-xl italic">
                            &quot;{event.description}&quot;
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="text-sm font-bold text-gray-900 border border-gray-200 px-3 py-1 rounded-lg">
                             {event.price || 'Free Event'}
                          </div>
                          <button
                            onClick={(e) => handleRemindMe(e, event.title)}
                            className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-md active:scale-90"
                            aria-label={`Ingatkan saya tentang ${event.title}`}
                            title={`Ingatkan saya tentang ${event.title}`}
                          >
                            <Ticket className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 text-gray-300 shadow-sm">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Event tidak ditemukan</h3>
              <p className="text-gray-500 max-w-sm mx-auto mt-2">Coba kata kunci lain atau reset filter kategori.</p>
              <button onClick={() => { setActiveCategory('All'); setSearchTerm(''); }} className="mt-6 text-green-600 font-bold hover:underline">Reset Filter</button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
