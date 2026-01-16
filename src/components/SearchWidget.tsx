import { useState } from 'react';
import { Search, Calendar, Ticket, Palmtree } from 'lucide-react';
import DestinationSearch from './DestinationSearch';
import TravelersInput from './TravelersInput';

export default function SearchWidget() {
  const [activeTab, setActiveTab] = useState<'Event' | 'Package'>('Event');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      // In real app: router.push('/search-results?Query=...')
      alert("Mencari perjalanan impian Anda...");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto transform translate-y-12 relative z-30">

      {/* Floating Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-full flex gap-1 border border-white/30 shadow-lg inline-flex">
          <button
            onClick={() => setActiveTab('Event')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'Event'
              ? 'bg-white text-green-800 shadow-md'
              : 'text-white hover:bg-white/10'
              }`}
          >
            <Ticket className="w-4 h-4" /> Cari Event
          </button>
          <button
            onClick={() => setActiveTab('Package')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'Package'
              ? 'bg-white text-green-800 shadow-md'
              : 'text-white hover:bg-white/10'
              }`}
          >
            <Palmtree className="w-4 h-4" /> Cari Paket
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="bg-white rounded-[2rem] shadow-2xl p-4 md:p-3 relative z-20 mx-4 md:mx-0">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:items-center">

          {/* 1. Destination */}
          <div className="flex-grow relative border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4 px-2">
            <DestinationSearch
              label={activeTab === 'Event' ? "Lokasi Event" : "Destinasi Tujuan"}
              placeholder={activeTab === 'Event' ? "Tenggarong, Samarinda..." : "Pulau Derawan..."}
            />
          </div>

          {/* 2. Date */}
          <div className="flex-initial md:w-[220px] relative border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:px-4 px-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 px-1">Tanggal</label>
            <div className="relative group">
              <Calendar className="absolute left-0 top-3 text-gray-400 group-focus-within:text-green-500 transition" />
              <input
                type="date"
                className="w-full pl-8 pr-2 py-2 bg-transparent border-none focus:ring-0 font-bold text-gray-800 text-sm md:text-base p-0 cursor-pointer"
              />
            </div>
          </div>

          {/* 3. Travelers */}
          <div className="flex-initial md:w-[260px] relative pb-4 md:pb-0 md:px-4 px-2 border-b md:border-b-0 border-gray-100 md:border-none">
            <TravelersInput label="Peserta" />
          </div>

          {/* 4. Button */}
          <div className="flex-initial md:w-auto p-1">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full md:w-auto h-12 md:h-16 px-8 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl md:rounded-[1.5rem] shadow-lg shadow-green-200 transition transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              {isSearching ? <div className="animate-spin w-5 h-5 border-2 border-white rounded-full border-t-transparent"></div> : <Search className="w-6 h-6" />}
              <span className="md:hidden">Cari Sekarang</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

