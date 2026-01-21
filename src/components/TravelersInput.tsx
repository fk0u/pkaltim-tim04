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
            <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1 md:mb-2 px-1">{label}</label>
            <div
                className="relative cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Users className={`absolute left-0 top-3 transition w-4 h-4 md:w-5 md:h-5 ${isOpen ? 'text-green-500' : 'text-gray-400'}`} style={{ top: '50%', transform: 'translateY(-50%)' }} />
                <div className="w-full pl-6 md:pl-8 pr-4 py-2 bg-transparent">
                    <span className={`font-bold text-sm md:text-base ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
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

