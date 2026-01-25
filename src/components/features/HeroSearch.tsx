import { useState } from 'react';
import { Search, MapPin, Calendar, Users, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

export default function HeroSearch() {
    const router = useRouter();
    const [destination, setDestination] = useState('');
    const [guests, setGuests] = useState(1);
    const [showGuestPopup, setShowGuestPopup] = useState(false);
    const [dates, setDates] = useState('');

    const handleSearch = () => {
        router.push(`/packages?q=${destination}&guests=${guests}`);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-1 mb-2">
                <button className="px-6 py-2 rounded-t-2xl bg-white/10 backdrop-blur-md text-white font-bold text-sm hover:bg-white/20 transition border-t border-x border-white/20">
                    Stays & Trips
                </button>
                <button className="px-6 py-2 rounded-t-2xl bg-transparent text-white/70 font-bold text-sm hover:bg-white/10 transition">
                    Experiences
                </button>
            </div>

            {/* Glass Bar */}
            <div className="bg-white rounded-3xl p-3 shadow-2xl backdrop-blur-xl border border-white/40 flex flex-col md:flex-row gap-2 relative z-50">

                {/* Destination */}
                <div className="flex-1 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div className="pl-12 pr-4 py-3 hover:bg-gray-50 rounded-2xl transition cursor-text h-full flex flex-col justify-center">
                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Where to?</label>
                        <input
                            type="text"
                            placeholder="East Kalimantan..."
                            className="bg-transparent border-none p-0 text-gray-900 font-bold placeholder:text-gray-300 focus:ring-0 w-full"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </div>
                </div>

                <div className="w-[1px] bg-gray-100 my-2 hidden md:block"></div>

                {/* Dates */}
                <div className="flex-1 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div className="pl-12 pr-4 py-3 hover:bg-gray-50 rounded-2xl transition cursor-text h-full flex flex-col justify-center">
                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">When?</label>
                        <input
                            type="date"
                            className="bg-transparent border-none p-0 text-gray-900 font-bold focus:ring-0 w-full [&::-webkit-calendar-picker-indicator]:opacity-0 absolute inset-0 opacity-0 cursor-pointer z-10"
                            onChange={(e) => setDates(e.target.value)}
                        />
                        <div className="bg-transparent text-gray-900 font-bold truncate">
                            {dates || 'Add Dates'}
                        </div>
                    </div>
                </div>

                <div className="w-[1px] bg-gray-100 my-2 hidden md:block"></div>

                {/* Guests */}
                <div className="flex-1 relative group z-50">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition">
                        <Users className="w-5 h-5" />
                    </div>
                    <button
                        className="w-full text-left pl-12 pr-4 py-3 hover:bg-gray-50 rounded-2xl transition h-full flex flex-col justify-center relative"
                        onClick={() => setShowGuestPopup(!showGuestPopup)}
                    >
                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5 cursor-pointer">Who?</label>
                        <div className="bg-transparent text-gray-900 font-bold truncate">
                            {guests} Guest{guests > 1 ? 's' : ''}
                        </div>
                    </button>

                    <AnimatePresence>
                        {showGuestPopup && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full right-0 mt-4 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 w-72 cursor-default"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <div className="font-bold text-gray-900">Adults</div>
                                        <div className="text-xs text-gray-400">Ages 13 or above</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setGuests(Math.max(1, guests - 1))}
                                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 text-gray-500 transition disabled:opacity-50"
                                            disabled={guests <= 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold w-4 text-center">{guests}</span>
                                        <button
                                            onClick={() => setGuests(guests + 1)}
                                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 text-gray-500 transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8 py-3 font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                >
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                </button>
            </div>
        </div>
    );
}
