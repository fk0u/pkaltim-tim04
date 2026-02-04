import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

interface LocationInputProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

export default function LocationInput({
    value,
    onChange,
    label = "Location",
    placeholder = "Search location...",
    className = ""
}: LocationInputProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { destinations } = useContent();

    // Aggregate all unique locations from context data
    const allLocations = useRef<string[]>([]);

    useEffect(() => {
        const locations = new Set<string>();

        // Add regions and their nested destinations
        destinations.forEach((r: any) => {
            locations.add(r.name);
            if (r.destinations) {
                r.destinations.forEach((d: string) => locations.add(`${d}, ${r.name}`));
            }
        });

        allLocations.current = Array.from(locations).sort();
    }, [destinations]);

    useEffect(() => {
        // Close suggestions when clicking outside
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInput = (input: string) => {
        onChange(input);

        if (input.length > 0) {
            const filtered = allLocations.current.filter(loc =>
                loc.toLowerCase().includes(input.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (suggestion: string) => {
        onChange(suggestion);
        setShowSuggestions(false);
    };

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            {label && <label className="text-xs font-bold text-gray-500 uppercase block mb-1">{label}</label>}
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => handleInput(e.target.value)}
                    onFocus={() => value && handleInput(value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                    placeholder={placeholder}
                />
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {suggestions.map((loc, idx) => (
                        <li
                            key={idx}
                            onClick={() => selectSuggestion(loc)}
                            className="px-4 py-3 hover:bg-emerald-50 cursor-pointer text-sm font-medium text-gray-700 flex items-center gap-2 transition"
                        >
                            <MapPin className="w-3 h-3 text-emerald-500" />
                            {loc}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
