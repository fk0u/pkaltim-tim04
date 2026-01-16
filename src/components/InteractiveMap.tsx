import * as React from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { REGIONS } from '@/data/mockData';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoia291c296byIsImEiOiJjbWRsOHk1anYxM29qMmpvbXg5Y3NrNDkwIn0.JgeP6F7f2UXRGOw303K7ew';

export default function InteractiveMap() {
    const [popupInfo, setPopupInfo] = React.useState<any>(null);

    // Initial view state centered on East Kalimantan
    const initialViewState = {
        latitude: 0.500,
        longitude: 116.500,
        zoom: 5.5,
        bearing: 0,
        pitch: 0
    };

    return (
        <div className="w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white">
            <Map
                initialViewState={initialViewState}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/outdoors-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
                scrollZoom={false}
            >
                <NavigationControl position="top-right" />

                {REGIONS.map((region, index) => (
                    <Marker
                        key={`marker-${index}`}
                        longitude={region.coordinates.lng}
                        latitude={region.coordinates.lat}
                        anchor="bottom"
                        onClick={(e: import('react-map-gl').MapLayerMouseEvent) => {
                            // If we let the click propagate, we might close the popup
                            e.originalEvent.stopPropagation();
                            setPopupInfo(region);
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="cursor-pointer group"
                        >
                            <MapPin className={`w-8 h-8 ${region.type === 'Kota' ? 'text-blue-600 fill-blue-100' : 'text-emerald-600 fill-emerald-100'} drop-shadow-lg`} />
                        </motion.div>
                    </Marker>
                ))}

                {popupInfo && (
                    <Popup
                        anchor="top"
                        longitude={popupInfo.coordinates.lng}
                        latitude={popupInfo.coordinates.lat}
                        onClose={() => setPopupInfo(null)}
                        maxWidth="300px"
                        className="rounded-xl overflow-hidden"
                    >
                        <div className="p-1 min-w-[200px]">
                            <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                                <img src={popupInfo.imageUrl} className="w-full h-full object-cover" alt={popupInfo.name} />
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[10px] font-bold rounded backdrop-blur">{popupInfo.type}</div>
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{popupInfo.name}</h3>
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">Ibu Kota: {popupInfo.capital === '-' ? popupInfo.name : popupInfo.capital}</p>

                            <div className="space-y-1 mb-3">
                                {popupInfo.destinations && popupInfo.destinations.slice(0, 2).map((dest: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500"></div> {dest}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                <div className="text-[10px] text-gray-400">
                                    Pop: {popupInfo.population}
                                </div>
                                <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                                    Detail <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </Popup>
                )}
            </Map>

            {/* Overlay Title */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg z-10 border border-white/50">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Peta Interaktif
                </h3>
            </div>
        </div>
    );
}
