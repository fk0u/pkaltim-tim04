import { useState, useRef, useEffect } from 'react';
import { Users, Plus, Minus } from 'lucide-react';

interface TravelersInputProps {
    label: string;
    onChange?: (summary: string) => void;
}

export default function TravelersInput({ label, onChange }: TravelersInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

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
        const summary = `${adults} Dewasa${children > 0 ? `, ${children} Anak` : ''}`;
        if (onChange) onChange(summary);
    }, [adults, children, onChange]);

    const handleIncrement = (type: 'adult' | 'child') => {
        if (type === 'adult') setAdults(prev => prev + 1);
        if (type === 'child') setChildren(prev => prev + 1);
    };

    const handleDecrement = (type: 'adult' | 'child') => {
        if (type === 'adult' && adults > 1) setAdults(prev => prev - 1);
        if (type === 'child' && children > 0) setChildren(prev => prev - 1);
    };

    return (
        <div className="relative group" ref={containerRef}>
            <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1 md:mb-2 px-1">{label}</label>
            <div
                className="relative cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Users className={`absolute left-0 top-3 transition w-4 h-4 md:w-6 md:h-6 ${isOpen ? 'text-green-500' : 'text-gray-400'}`} style={{ top: '50%', transform: 'translateY(-50%)' }} />
                <div className="w-full pl-6 md:pl-8 pr-4 py-2 bg-transparent">
                    <span className="font-bold text-gray-900 text-sm md:text-lg">
                        {adults} Dewasa{children > 0 ? `, ${children} Anak` : ''}
                    </span>
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full min-w-[250px] bg-white mt-2 p-4 rounded-xl shadow-xl border border-gray-100 z-50 animate-fade-in-up">
                    {/* Adult Row */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="font-bold text-gray-800">Dewasa</div>
                            <div className="text-xs text-gray-500">Usia 12+</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleDecrement('adult')}
                                className={`w-8 h-8 rounded-full flex items-center justify-center border ${adults <= 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-green-500 text-green-500 hover:bg-green-50'}`}
                                disabled={adults <= 1}
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold w-4 text-center">{adults}</span>
                            <button
                                onClick={() => handleIncrement('adult')}
                                className="w-8 h-8 rounded-full flex items-center justify-center border border-green-500 text-green-500 hover:bg-green-50"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Child Row */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-bold text-gray-800">Anak</div>
                            <div className="text-xs text-gray-500">Usia 2-11</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleDecrement('child')}
                                className={`w-8 h-8 rounded-full flex items-center justify-center border ${children <= 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-green-500 text-green-500 hover:bg-green-50'}`}
                                disabled={children <= 0}
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold w-4 text-center">{children}</span>
                            <button
                                onClick={() => handleIncrement('child')}
                                className="w-8 h-8 rounded-full flex items-center justify-center border border-green-500 text-green-500 hover:bg-green-50"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
