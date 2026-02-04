import * as React from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl, FullscreenControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useContent } from '@/contexts/ContentContext';
import { MapPin, ArrowRight, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoia291c296byIsImEiOiJjbWRsOHk1anYxM29qMmpvbXg5Y3NrNDkwIn0.JgeP6F7f2UXRGOw303K7ew';

export default function InteractiveMap() {
    const [popupInfo, setPopupInfo] = React.useState<any>(null);
    const { destinations: REGIONS } = useContent();
    const mapRef = React.useRef<any>(null);

    // Initial view state centered on East Kalimantan
    const initialViewState = {
        latitude: 0.500,
        longitude: 116.500,
        zoom: 5.5,
        bearing: 0,
        pitch: 0
    };

    const flyToLocation = (lat: number, lng: number) => {
        if (mapRef.current) {
            mapRef.current.flyTo({ center: [lng, lat], zoom: 8, duration: 2000 });
        }
    };

    return (
        <div className="w-full h-[600px] md:h-[700px] rounded-[3rem] overflow-hidden shadow-2xl relative border-4 border-white/20 bg-gray-900 group">
            <Map
                ref={mapRef}
                initialViewState={initialViewState}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
                scrollZoom={false}
                attributionControl={false}
            >
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                    <NavigationControl showCompass={true} position="top-right" style={{ borderRadius: '1rem', overflow: 'hidden' }} />
                    <FullscreenControl position="top-right" style={{ borderRadius: '1rem', overflow: 'hidden' }} />
                </div>

                {REGIONS.map((region, index) => (
                    <Marker
                        key={`marker-${index}`}
                        longitude={region.coordinates.lng}
                        latitude={region.coordinates.lat}
                        anchor="bottom"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            setPopupInfo(region);
                            flyToLocation(region.coordinates.lat, region.coordinates.lng);
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="cursor-pointer group relative"
                        >
                            <span className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping group-hover:bg-emerald-400/50"></span>
                            <div className={`p-2 rounded-full shadow-xl border-2 border-white transition-all duration-300 ${popupInfo?.name === region.name ? 'bg-emerald-500 scale-125' : 'bg-white hover:bg-emerald-50'}`}>
                                <MapPin className={`w-6 h-6 ${popupInfo?.name === region.name ? 'text-white' : 'text-emerald-600'}`} />
                            </div>
                        </motion.div>
                    </Marker>
                ))}

                <AnimatePresence>
                    {popupInfo && (
                        <Popup
                            anchor="top"
                            longitude={popupInfo.coordinates.lng}
                            latitude={popupInfo.coordinates.lat}
                            onClose={() => setPopupInfo(null)}
                            closeButton={false}
                            className="custom-mapbox-popup z-50"
                            maxWidth="320px"
                            offset={20}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-black/5 p-1"
                            >
                                <div className="relative h-40 rounded-2xl overflow-hidden mb-3 group-hover:h-44 transition-all duration-500">
                                    <Image
                                        src={popupInfo.imageUrl}
                                        alt={popupInfo.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
                                    <button
                                        onClick={() => setPopupInfo(null)}
                                        className="absolute top-2 right-2 p-1.5 bg-black/30 hover:bg-black/50 rounded-full text-white backdrop-blur transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="absolute bottom-3 left-3 text-white">
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1 block">{popupInfo.type}</span>
                                        <h3 className="font-black text-xl leading-none">{popupInfo.name}</h3>
                                    </div>
                                </div>

                                <div className="px-3 pb-3">
                                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                                        <div className="bg-gray-50 rounded-xl p-2 text-center">
                                            <div className="text-gray-400 font-bold text-[10px] uppercase">Capital</div>
                                            <div className="font-bold text-gray-800 truncate">{popupInfo.capital === '-' ? popupInfo.name : popupInfo.capital}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-2 text-center">
                                            <div className="text-gray-400 font-bold text-[10px] uppercase">Population</div>
                                            <div className="font-bold text-gray-800">{popupInfo.population}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Key Destinations</h4>
                                        {popupInfo.destinations && popupInfo.destinations.slice(0, 3).map((dest: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2 p-2 rounded-xl hover:bg-emerald-50 transition cursor-pointer group/item">
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-[10px] group-hover/item:bg-emerald-500 group-hover/item:text-white transition">
                                                    {idx + 1}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 group-hover/item:text-emerald-700">{dest}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
                                    >
                                        Explore Region <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </Popup>
                    )}
                </AnimatePresence>
            </Map>

            {/* Overlay UI */}
            <div className="absolute top-6 left-6 z-10">
                <div className="bg-white/90 backdrop-blur-md pl-2 pr-6 py-2 rounded-full shadow-lg border border-white/50 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Live Monitoring</span>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black/80 to-transparent pointer-events-none rounded-b-[3rem]"></div>
            <div className="absolute bottom-8 left-8 z-10 text-white pointer-events-none">
                <h3 className="text-2xl font-black mb-1">East Kalimantan</h3>
                <p className="text-white/70 text-sm max-w-xs backdrop-blur-sm">Interact with markers to explore the 10 regencies and cities of the future capital region.</p>
            </div>
        </div>
    );
}
