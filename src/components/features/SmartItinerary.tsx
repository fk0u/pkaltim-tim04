import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Calendar, Wallet, Heart, Loader2, MapPin, Check, RefreshCw } from 'lucide-react';

interface ItineraryDay {
    day: number;
    title: string;
    activities: { time: string; title: string; type: string }[];
}

export default function SmartItinerary({ destination }: { destination: string }) {
    const [step, setStep] = useState<'input' | 'generating' | 'result'>('input');
    const [preferences, setPreferences] = useState({
        days: 3,
        budget: 'Comfort',
        interest: 'Nature'
    });
    const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);

    const generateItinerary = () => {
        setStep('generating');

        // Simulate AI thinking time
        setTimeout(() => {
            const mockItinerary: ItineraryDay[] = Array.from({ length: preferences.days }).map((_, i) => ({
                day: i + 1,
                title: `Day ${i + 1}: ${i === 0 ? 'Arrival & Exploration' : i === preferences.days - 1 ? 'Souvenirs & Departure' : 'Deep Dive Adventure'}`,
                activities: [
                    { time: '09:00', title: `Start exploring ${destination} ${preferences.interest} spots`, type: 'Activity' },
                    { time: '12:00', title: `Local ${preferences.budget === 'Luxury' ? 'Fine Dining' : 'Street Food'} Lunch`, type: 'Meal' },
                    { time: '14:00', title: `Visit hidden gems in ${destination}`, type: 'Activity' },
                    { time: '19:00', title: 'Sunset Dinner by the river', type: 'Meal' }
                ]
            }));
            setItinerary(mockItinerary);
            setStep('result');
        }, 2000);
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-50 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-0 translate-x-1/3 -translate-y-1/3 opacity-50"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Wand2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900">AI Smart Itinerary</h3>
                        <p className="text-gray-500 text-sm">Generate your perfect trip to {destination} in seconds.</p>
                    </div>
                </div>

                <AnimatePresence mode='wait'>
                    {step === 'input' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Duration
                                    </label>
                                    <div className="flex gap-2">
                                        {[3, 5, 7].map(d => (
                                            <button
                                                key={d}
                                                onClick={() => setPreferences({ ...preferences, days: d })}
                                                className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${preferences.days === d ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-100 hover:border-indigo-200 text-gray-500'}`}
                                            >
                                                {d} Days
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Wallet className="w-4 h-4" /> Budget
                                    </label>
                                    <div className="flex gap-2">
                                        {['Budget', 'Comfort', 'Luxury'].map(b => (
                                            <button
                                                key={b}
                                                onClick={() => setPreferences({ ...preferences, budget: b })}
                                                className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all text-sm ${preferences.budget === b ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-100 hover:border-indigo-200 text-gray-500'}`}
                                            >
                                                {b}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Heart className="w-4 h-4" /> Interest
                                    </label>
                                    <select
                                        value={preferences.interest}
                                        onChange={(e) => setPreferences({ ...preferences, interest: e.target.value })}
                                        className="w-full py-3 px-4 rounded-xl font-bold border-2 border-gray-100 bg-white focus:border-indigo-500 focus:outline-none text-gray-700 bg-[url('')]"
                                    >
                                        <option>Nature & Wildlife</option>
                                        <option>Culture & History</option>
                                        <option>Culinary & Food</option>
                                        <option>Relaxation & Spa</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={generateItinerary}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                            >
                                <Wand2 className="w-5 h-5" /> Generate My Plan
                            </button>
                        </motion.div>
                    )}

                    {step === 'generating' && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-12 text-center"
                        >
                            <motion.div
                                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-500 mb-6"
                            />
                            <h4 className="text-xl font-bold text-gray-900 mb-2">Crafting your detailed itinerary...</h4>
                            <p className="text-gray-500">Matching {preferences.budget} spots in {destination} for {preferences.days} days.</p>
                        </motion.div>
                    )}

                    {step === 'result' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">Your Custom Plan</h4>
                                    <p className="text-sm text-gray-500">{preferences.days} Days • {preferences.budget} • {preferences.interest}</p>
                                </div>
                                <button onClick={() => setStep('input')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition">
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-0 before:w-0.5 before:bg-indigo-100">
                                {itinerary.map((day, idx) => (
                                    <div key={idx} className="relative pl-10">
                                        <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-indigo-50 border-2 border-indigo-500 flex items-center justify-center font-bold text-indigo-700 text-sm z-10">
                                            {day.day}
                                        </div>
                                        <h5 className="font-bold text-gray-900 mb-4 pt-1">{day.title}</h5>
                                        <div className="space-y-4">
                                            {day.activities.map((act, i) => (
                                                <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex gap-4 hover:bg-white hover:shadow-md transition">
                                                    <span className="text-xs font-bold text-indigo-500 w-12 pt-1">{act.time}</span>
                                                    <div>
                                                        <h6 className="font-bold text-gray-800 text-sm">{act.title}</h6>
                                                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{act.type}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                                    <Check className="w-4 h-4" /> Save Itinerary
                                </button>
                                <button className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">
                                    Share
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
