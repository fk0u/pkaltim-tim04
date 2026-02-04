import { useState, useRef, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Counter } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';

interface TravelersInputProps {
    label: string;
    onChange?: (summary: string) => void;
}

export default function TravelersInput({ label, onChange }: TravelersInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    // Close popover when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const summary = `${adults} ${t.search.adults}${children > 0 ? `, ${children} ${t.search.children}` : ''}`;
        if (onChange) onChange(summary);
    }, [adults, children, onChange, t]);

    return (
        <div className="relative group" ref={containerRef}>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">{label}</label>
            <div
                className="relative cursor-pointer flex items-center group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-emerald-100 text-emerald-600 scale-100' : 'bg-gray-100 text-gray-400 scale-90'}`}>
                    <Users className="w-4 h-4" />
                </div>
                <div className="w-full pl-10 pr-4 py-1 bg-transparent">
                    <span className={`font-black text-base md:text-lg tracking-tight ${isOpen ? 'text-gray-800' : 'text-gray-700'}`}>
                        {adults} {t.search.adults}{children > 0 ? `, ${children} ${t.search.children}` : ''}
                    </span>
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full min-w-[280px] bg-white mt-2 p-4 rounded-2xl shadow-xl border border-gray-100 z-50 animate-fade-in-up">
                    <div className="space-y-4">
                        <Counter
                            value={adults}
                            min={1}
                            max={10}
                            onChange={setAdults}
                            label={t.search.adults}
                            sublabel={t.search.adultsAge}
                        />
                        <div className="border-b border-gray-50"></div>
                        <Counter
                            value={children}
                            min={0}
                            max={5}
                            onChange={setChildren}
                            label={t.search.children}
                            sublabel={t.search.childrenAge}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

