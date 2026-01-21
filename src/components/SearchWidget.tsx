import { useState } from 'react';
import { useRouter } from 'next/router';
import { Search, Ticket, Palmtree } from 'lucide-react';
import DestinationSearch from './DestinationSearch';
import TravelersInput from './TravelersInput';
import { DatePicker, useToast } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SearchWidget() {
  const [activeTab, setActiveTab] = useState<'Event' | 'Package'>('Event');
  const [isSearching, setIsSearching] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [travelers, setTravelers] = useState("1 Dewasa");
  const { addToast } = useToast();
  const { t } = useLanguage();

  const router = useRouter();

  const handleSearch = () => {
    setIsSearching(true);

    // Construct query parameters
    const query: any = {
      type: activeTab.toLowerCase(),
    };

    router.push({
      pathname: '/search',
      query: {
        type: activeTab,
        date: date ? date.toISOString() : undefined,
        travelers
      }
    });

    setTimeout(() => setIsSearching(false), 1000);
  };

  return (
    <div className="max-w-5xl mx-auto relative z-30">

      {/* Floating Tabs */}
      <div className="flex justify-center mb-4 md:mb-8">
        <div className="glass p-1.5 md:p-2 rounded-full flex gap-1 shadow-2xl shadow-green-900/10 inline-flex ring-1 ring-white/40">
          <button
            onClick={() => setActiveTab('Event')}
            className={`px-5 md:px-7 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 transition-all duration-300 ${activeTab === 'Event'
              ? 'bg-white text-green-800 shadow-lg shadow-black/5 transform scale-100'
              : 'text-gray-600 hover:bg-white/40 hover:text-green-700'
              }`}
          >
            <Ticket className="w-3.5 h-3.5 md:w-4 md:h-4" /> {t.hero.searchEvent}
          </button>
          <button
            onClick={() => setActiveTab('Package')}
            className={`px-5 md:px-7 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 transition-all duration-300 ${activeTab === 'Package'
              ? 'bg-white text-green-800 shadow-lg shadow-black/5 transform scale-100'
              : 'text-gray-600 hover:bg-white/40 hover:text-green-700'
              }`}
          >
            <Palmtree className="w-3.5 h-3.5 md:w-4 md:h-4" /> {t.hero.searchPackage}
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="glass-panel rounded-[2rem] md:rounded-[3rem] p-3 md:p-4 relative z-20 mx-3 md:mx-0 transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 group">
        <div className="flex flex-col md:flex-row gap-2 md:gap-0 md:items-center">

          {/* 1. Destination */}
          <div className="flex-grow relative border-b md:border-b-0 md:border-r border-gray-100 pb-2 md:pb-0 md:pr-4 px-2 group transition-colors hover:bg-gray-50/50 rounded-2xl md:rounded-none md:rounded-l-2xl">
            <DestinationSearch
              label={activeTab === 'Event' ? t.search.eventLocation : t.search.destination}
              placeholder={activeTab === 'Event' ? t.hero.searchPlaceholderEvent : t.hero.searchPlaceholderPackage}
            />
          </div>

          {/* 2. Date */}
          <div className="flex-initial md:w-[240px] relative border-b md:border-b-0 md:border-r border-gray-100 pb-2 md:pb-0 md:px-4 px-2 z-20 group transition-colors hover:bg-gray-50/50 rounded-2xl md:rounded-none">
            <DatePicker
              label={t.hero.dateLabel}
              selected={date}
              onChange={setDate}
              placeholder={t.search.selectDate}
            />
          </div>

          {/* 3. Travelers */}
          <div className="flex-initial md:w-[260px] relative pb-3 md:pb-0 md:px-4 px-2 border-b md:border-b-0 border-gray-100 md:border-none z-10">
            <TravelersInput label={t.hero.travelersLabel} onChange={setTravelers} />
          </div>

          {/* 4. Button */}
          <div className="flex-initial md:w-auto p-1">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full md:w-auto h-11 md:h-16 px-8 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl md:rounded-[1.5rem] shadow-lg shadow-green-200 transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-base md:text-lg"
            >
              {isSearching ? <div className="animate-spin w-4 h-4 md:w-5 md:h-5 border-2 border-white rounded-full border-t-transparent"></div> : <Search className="w-5 h-5 md:w-6 md:h-6" />}
              <span className="md:hidden">{t.hero.searchBtn}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
