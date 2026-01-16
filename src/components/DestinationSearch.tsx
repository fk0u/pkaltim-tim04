import { useState, useRef, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { DESTINATIONS } from '@/data/mockData';

interface DestinationSearchProps {
    label: string;
    placeholder?: string;
    onSelect?: (value: string) => void;
}

export default function DestinationSearch({ label, placeholder, onSelect }: DestinationSearchProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredDestinations = DESTINATIONS.filter(item =>
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
        setQuery(value);
        setIsOpen(false);
        if (onSelect) onSelect(value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsOpen(true);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1 md:mb-2 px-1">{label}</label>
            <div className="relative group">
                <MapPin className={`absolute left-0 top-3 transition w-4 h-4 md:w-6 md:h-6 ${isOpen ? 'text-green-500' : 'text-gray-400'}`} style={{ top: '50%', transform: 'translateY(-50%)' }} />
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full pl-6 md:pl-8 pr-4 py-2 bg-transparent border-none focus:ring-0 font-bold text-gray-900 placeholder-gray-300 text-sm md:text-lg p-0"
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
                    Tidak ditemukan destinasi "{query}"
                </div>
            )}
        </div>
    );
}
