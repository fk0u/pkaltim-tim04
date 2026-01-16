import Layout from '@/components/Layout';
import { EVENTS } from '@/data/mockData';
import { Calendar, MapPin, Search, Filter, Ticket } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = ['All', 'Culture', 'Nature', 'Sustainability', 'Culinary'];

  const filteredEvents = EVENTS.filter(event => {
    const matchCategory = activeCategory === 'All' || event.category === activeCategory;
    const matchSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <Layout title="Event Tahunan - BorneoTrip">
      {/* HEADER */}
      <div className="bg-green-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Kalender Event</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
             Temukan festival budaya magis dan perayaan alam yang hanya ada setahun sekali di Kalimantan Timur.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-20">
        
        {/* FILTERS CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-12">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Categories */}
              <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto hide-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition transform hover:scale-105 ${
                      activeCategory === cat 
                        ? 'bg-green-600 text-white shadow-lg shadow-green-200' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              {/* Search */}
              <div className="relative w-full md:w-80">
                 <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="Cari event atau lokasi..." 
                   className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                 />
              </div>
           </div>
        </div>

        {/* EVENTS GRID */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group flex flex-col h-full">
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-800 shadow-sm border border-green-100">
                    {event.category}
                  </div>
                  <div className="absolute bottom-4 left-4 text-white font-medium flex items-center text-sm">
                     <Calendar className="w-4 h-4 mr-2" /> {event.date}
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    {event.location}
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
                    {event.description}
                  </p>
                  
                  <div className="pt-5 border-t border-gray-100 flex justify-between items-center group/btn">
                    <div className="flex gap-1.5 flex-wrap">
                      {event.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{tag}</span>
                      ))}
                    </div>
                    <button className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover/btn:bg-green-600 group-hover/btn:text-white transition-colors">
                      <Ticket className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
             <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
             </div>
             <h3 className="text-xl font-bold text-gray-900">Event tidak ditemukan</h3>
             <p className="text-gray-500">Coba ubah kata kunci atau kategori pencarian Anda.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
