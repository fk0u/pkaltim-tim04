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
      <div className="flex justify-center mb-6 md:mb-10">
        <div className="bg-white/80 backdrop-blur-xl p-1.5 rounded-full flex gap-1 shadow-2xl shadow-emerald-900/10 ring-1 ring-white/50 relative z-40">
          <button
            onClick={() => setActiveTab('Event')}
            className={`px-6 md:px-8 py-2.5 md:py-3.5 rounded-full text-xs md:text-sm font-bold flex items-center gap-2.5 transition-all duration-300 ${activeTab === 'Event'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transform scale-100'
              : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
          >
            <Ticket className="w-4 h-4" /> {t.hero.searchEvent}
          </button>
          <button
            onClick={() => setActiveTab('Package')}
            className={`px-6 md:px-8 py-2.5 md:py-3.5 rounded-full text-xs md:text-sm font-bold flex items-center gap-2.5 transition-all duration-300 ${activeTab === 'Package'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transform scale-100'
              : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
          >
            <Palmtree className="w-4 h-4" /> {t.hero.searchPackage}
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] md:rounded-full p-2 md:p-3 relative z-30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-white mx-4 md:mx-0 transition-all duration-500 hover:shadow-[0_40px_70px_-15px_rgba(0,0,0,0.2)] hover:-translate-y-1 group">
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">

          {/* 1. Destination */}
          <div className="relative flex-grow min-w-[30%] px-4 md:px-8 py-3 md:py-3 transition-colors hover:bg-emerald-50/50 rounded-2xl md:rounded-l-full group/item">
            <DestinationSearch
              label={activeTab === 'Event' ? t.search.eventLocation : t.search.destination}
              placeholder={activeTab === 'Event' ? t.hero.searchPlaceholderEvent : t.hero.searchPlaceholderPackage}
            />
          </div>

          {/* 2. Date */}
          <div className="relative md:w-[28%] px-4 md:px-8 py-3 md:py-3 transition-colors hover:bg-emerald-50/50 rounded-2xl group/item">
            <DatePicker
              label={t.hero.dateLabel}
              selected={date}
              onChange={setDate}
              placeholder={t.search.selectDate}
            />
          </div>

          {/* 3. Travelers */}
          <div className="relative md:w-[28%] px-4 md:px-8 py-3 md:py-3 transition-colors hover:bg-emerald-50/50 rounded-2xl group/item">
            <TravelersInput label={t.hero.travelersLabel} onChange={setTravelers} />
          </div>

          {/* 4. Button */}
          <div className="p-2 md:pl-4 flex items-center">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full md:w-auto h-12 md:h-16 aspect-square rounded-xl md:rounded-full bg-linear-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-xl shadow-emerald-600/20 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group/btn"
            >
              {isSearching ? (
                <div className="animate-spin w-6 h-6 border-3 border-white/30 border-t-white rounded-full"></div>
              ) : (
                <Search className="w-6 h-6 md:w-7 md:h-7 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
