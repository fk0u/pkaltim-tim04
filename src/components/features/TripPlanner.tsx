import { useState } from 'react';
import { Plane, Ship, Car, Map, Info, TrendingUp, Clock, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TripPlannerProps {
    destinationName: string;
    coordinates?: { lat: number; lng: number };
}

type TransportMode = 'plane' | 'ship' | 'car';

export default function TripPlanner({ destinationName }: TripPlannerProps) {
    const [origin, setOrigin] = useState('Jakarta');
    const [mode, setMode] = useState<TransportMode>('plane');
    const [isCalculating, setIsCalculating] = useState(false);

    // Mock Calculation Logic based on Research
    const getEstimates = (from: string, dest: string, transport: TransportMode) => {
        // Simple heuristic for demo purposes
        const baseFlight = 1400000;
        const baseShip = 500000;
        const baseCar = 800000; // Fuel + Rental mock

        if (transport === 'plane') {
            return {
                price: `Rp ${(baseFlight * (from === 'Jakarta' ? 1 : 1.5)).toLocaleString()}`,
                duration: '2h 15m',
                routes: ['CGK -> BPN', 'BPN -> Destination'],
                trend: 'Stable'
            };
        } else if (transport === 'ship') {
            return {
                price: `Rp ${(baseShip * (from === 'Surabaya' ? 1 : 1.2)).toLocaleString()}`,
                duration: '2 Days',
                routes: ['Tanjung Perak -> Semayang'],
                trend: 'Low Season'
            };
        } else {
            return {
                price: `Rp ${baseCar.toLocaleString()} (Fuel)`,
                duration: '12-18 Hours',
                routes: ['Trans Kalimantan'],
                trend: 'Traffic Heavy'
            };
        }
    };

    const estimate = getEstimates(origin, destinationName, mode);

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600"></div>

            <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                        <Map className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900">Trip Planner & Logistics</h3>
                        <p className="text-sm text-gray-500">Estimasi rute & biaya perjalanan cerdas ke {destinationName}.</p>
                    </div>
                </div>

                {/* Input Section */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Dari (Kota Asal)</label>
                        <select
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 font-bold text-gray-700 transition"
                        >
                            <option value="Jakarta">Jakarta (CGK)</option>
                            <option value="Surabaya">Surabaya (SUB)</option>
                            <option value="Makassar">Makassar (UPG)</option>
                            <option value="Banjarmasin">Banjarmasin (BDJ)</option>
                        </select>
                    </div>
                </div>

                {/* Transport Tabs */}
                <div className="flex bg-gray-100/50 p-1.5 rounded-2xl mb-8">
                    {(['plane', 'ship', 'car'] as TransportMode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${mode === m ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {m === 'plane' && <Plane className="w-4 h-4" />}
                            {m === 'ship' && <Ship className="w-4 h-4" />}
                            {m === 'car' && <Car className="w-4 h-4" />}
                            <span className="capitalize">{m}</span>
                        </button>
                    ))}
                </div>

                {/* Results Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-emerald-600 mb-2">
                            <Wallet className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Estimasi Biaya</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900">{estimate.price}</div>
                        <div className="text-xs text-emerald-600 font-medium">per orang / kendaraan</div>
                    </div>

                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Durasi Perjalanan</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900">{estimate.duration}</div>
                        <div className="text-xs text-blue-600 font-medium truncate">{estimate.routes[0]}</div>
                    </div>

                    <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100 flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-purple-600 mb-2">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Tren Harga</span>
                        </div>
                        <div className="text-xl font-bold text-slate-900">{estimate.trend}</div>
                        <div className="text-xs text-purple-600 font-medium">Update: Hari ini services</div>
                    </div>
                </div>

                {/* Map Embed */}
                <div className="rounded-2xl overflow-hidden shadow-inner border border-gray-200 relative h-64 w-full bg-slate-100 group">
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(destinationName)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        className="grayscale group-hover:grayscale-0 transition duration-700 opacity-90 group-hover:opacity-100"
                    ></iframe>
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold shadow-sm pointer-events-none">
                        📍 {destinationName} Location
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-center text-xs text-gray-400">
                    <p>* Harga adalah estimasi rata-rata tiket/fuel.</p>
                    <p>Powered by OpenLogistics Engine</p>
                </div>
            </div>
        </div>
    );
}
