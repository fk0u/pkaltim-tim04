import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerProps {
    label?: string;
    selected?: Date;
    onChange: (date: Date) => void;
    minDate?: Date;
    placeholder?: string;
}

export default function DatePicker({ label, selected, onChange, minDate = new Date(), placeholder = "Select Date" }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(selected || new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    // Close click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        onChange(newDate);
        setIsOpen(false);
        // Also update view date if needed, but keeping it stable is usually better
    };

    const renderCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const days = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
        const fillerDays = Array.from({ length: startDay }, (_, i) => i);
        const actualDays = Array.from({ length: days }, (_, i) => i + 1);

        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

        return (
            <div className="p-4 w-[320px]">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full transition"><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
                    <span className="font-bold text-gray-900">{monthNames[month]} {year}</span>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition"><ChevronRight className="w-5 h-5 text-gray-500" /></button>
                </div>

                {/* Weekdays */}
                <div className="grid grid-cols-7 mb-2">
                    {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map((day, i) => (
                        <div key={i} className="text-center text-xs font-bold text-gray-400 py-1">{day}</div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                    {fillerDays.map((i) => <div key={`empty-${i}`} />)}
                    {actualDays.map((day) => {
                        const current = new Date(year, month, day);
                        const isSelected = selected && current.toDateString() === selected.toDateString();
                        const isToday = current.toDateString() === new Date().toDateString();
                        const isDisabled = current < new Date(minDate.setHours(0, 0, 0, 0));

                        return (
                            <button
                                key={day}
                                disabled={isDisabled}
                                onClick={() => handleDateClick(day)}
                                className={`
                                    h-9 w-9 rounded-full text-sm font-medium flex items-center justify-center transition relative
                                    ${isSelected ? 'bg-green-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}
                                    ${isDisabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''}
                                    ${!isSelected && isToday ? 'text-green-600 font-bold border border-green-200' : ''}
                                `}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="relative group w-full" ref={containerRef}>
            {label && <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">{label}</label>}

            <div
                onClick={() => setIsOpen(!isOpen)}
                className="relative cursor-pointer flex items-center group"
            >
                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen || selected ? 'bg-emerald-100 text-emerald-600 scale-100' : 'bg-gray-100 text-gray-400 scale-90'}`}>
                    <CalendarIcon className="w-4 h-4" />
                </div>
                <div className={`w-full pl-10 pr-4 py-1 bg-transparent border-none text-base md:text-lg tracking-tight ${!selected ? 'text-gray-300 font-bold' : 'text-gray-800 font-black'}`}>
                    {selected ? selected.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : placeholder}
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                    >
                        {renderCalendar()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
