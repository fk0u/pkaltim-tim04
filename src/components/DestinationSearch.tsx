import { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface DestinationSearchProps {
    label: string;
    placeholder?: string;
    onSelect?: (value: string) => void;
    onChange?: (value: string) => void;
    value?: string;
}

export default function DestinationSearch({ label, placeholder, onSelect, onChange, value: propValue }: DestinationSearchProps) {
    const [internalQuery, setInternalQuery] = useState('');
    const query = propValue !== undefined ? propValue : internalQuery;
    const { t } = useLanguage();

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { packages } = useContent();

    // Extract unique locations from packages + Default ones
    // This makes the search dynamic based on what's available
    const packageLocations = packages.map(p => p.location);
    const defaultDestinations = [
        "Derawan, Berau",
        "Maratua, Berau",
        "Tenggarong, Kutai Kartanegara",
        "Samarinda, Kalimantan Timur",
        "Balikpapan, Kalimantan Timur",
        "Bukit Bangkirai, Samboja",
        "Kayan Mentarang, Malinau"
    ];

    // Merge and Deduplicate
    const allDestinations = Array.from(new Set([...defaultDestinations, ...packageLocations]));

    const filteredDestinations = allDestinations.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (value: string) => {
        if (onChange) onChange(value);
        else setInternalQuery(value);

        setIsOpen(false);
        if (onSelect) onSelect(value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (onChange) onChange(val);
        else setInternalQuery(val);
        setIsOpen(true);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">{label}</label>
            <div className="relative group flex items-center">
                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen || query.length > 0 ? 'bg-emerald-100 text-emerald-600 scale-100' : 'bg-gray-100 text-gray-400 scale-90'}`}>
                    <MapPin className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-1 bg-transparent border-none focus:ring-0 font-black text-gray-800 placeholder-gray-300 text-base md:text-lg p-0 tracking-tight"
                />
            </div>

            {isOpen && filteredDestinations.length > 0 && query.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white mt-2 py-2 rounded-xl shadow-xl border border-gray-100 z-50 max-h-60 overflow-y-auto animate-fade-in-up">
                    {filteredDestinations.map((dest, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleSelect(dest)}
                            className="px-4 py-3 hover:bg-green-50 cursor-pointer flex items-center gap-3 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="font-bold text-gray-800 text-sm">{dest.split(',')[0]}</div>
                                <div className="text-xs text-gray-500">{dest.split(',')[1] || 'Kalimantan Timur'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isOpen && query.length > 0 && filteredDestinations.length === 0 && (
                <div className="absolute top-full left-0 w-full bg-white mt-2 py-4 rounded-xl shadow-xl border border-gray-100 z-50 text-center text-gray-500 text-sm animate-fade-in-up">
                    {t.search.noDestination} "{query}"
                </div>
            )}
        </div>
    );
}

