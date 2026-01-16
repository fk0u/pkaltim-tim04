import { useState } from 'react';
import { Search, Ticket, Palmtree } from 'lucide-react';
import DestinationSearch from './DestinationSearch';
import TravelersInput from './TravelersInput';
import { DatePicker, useToast } from '@/components/ui';

export default function SearchWidget() {
  const [activeTab, setActiveTab] = useState<'Event' | 'Package'>('Event');
  const [isSearching, setIsSearching] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [travelers, setTravelers] = useState("1 Dewasa");
  const { addToast } = useToast();

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      addToast(`Mencari ${activeTab}: ${activeTab === 'Event' ? 'Tenggarong' : 'Derawan'}...`, 'success');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto transform translate-y-4 md:translate-y-12 relative z-30">

      {/* Floating Tabs */}
      <div className="flex justify-center mb-3 md:mb-6">
        <div className="bg-white/20 backdrop-blur-md p-1 md:p-1.5 rounded-full flex gap-1 border border-white/30 shadow-lg inline-flex">
          <button
            onClick={() => setActiveTab('Event')}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'Event'
              ? 'bg-white text-green-800 shadow-md transform scale-105'
              : 'text-white hover:bg-white/10'
              }`}
          >
            <Ticket className="w-3 h-3 md:w-4 md:h-4" /> Cari Event
          </button>
          <button
            onClick={() => setActiveTab('Package')}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'Package'
              ? 'bg-white text-green-800 shadow-md transform scale-105'
              : 'text-white hover:bg-white/10'
              }`}
          >
            <Palmtree className="w-3 h-3 md:w-4 md:h-4" /> Cari Paket
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl p-3 md:p-3 relative z-20 mx-3 md:mx-0 ring-1 ring-black/5">
        <div className="flex flex-col md:flex-row gap-2 md:gap-0 md:items-center">

          {/* 1. Destination */}
          <div className="flex-grow relative border-b md:border-b-0 md:border-r border-gray-100 pb-3 md:pb-0 md:pr-4 px-2">
            <DestinationSearch
              label={activeTab === 'Event' ? "Lokasi Event" : "Destinasi Tujuan"}
              placeholder={activeTab === 'Event' ? "Tenggarong, Samarinda..." : "Pulau Derawan..."}
            />
          </div>

          {/* 2. Date */}
          <div className="flex-initial md:w-[240px] relative border-b md:border-b-0 md:border-r border-gray-100 pb-3 md:pb-0 md:px-4 px-2 z-20">
            <DatePicker
              label="Tanggal"
              selected={date}
              onChange={setDate}
              placeholder="Pilih Tanggal"
            />
          </div>

          {/* 3. Travelers */}
          <div className="flex-initial md:w-[260px] relative pb-3 md:pb-0 md:px-4 px-2 border-b md:border-b-0 border-gray-100 md:border-none z-10">
            <TravelersInput label="Peserta" onChange={setTravelers} />
          </div>

          {/* 4. Button */}
          <div className="flex-initial md:w-auto p-1">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full md:w-auto h-11 md:h-16 px-8 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl md:rounded-[1.5rem] shadow-lg shadow-green-200 transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-base md:text-lg"
            >
              {isSearching ? <div className="animate-spin w-4 h-4 md:w-5 md:h-5 border-2 border-white rounded-full border-t-transparent"></div> : <Search className="w-5 h-5 md:w-6 md:h-6" />}
              <span className="md:hidden">Cari Sekarang</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

