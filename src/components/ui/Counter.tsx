import { Minus, Plus } from 'lucide-react';

interface CounterProps {
    value: number;
    min?: number;
    max?: number;
    onChange: (value: number) => void;
    label?: string;
    sublabel?: string;
}

export default function Counter({ value, min = 0, max = 99, onChange, label, sublabel }: CounterProps) {
    const handleDecrement = () => {
        if (value > min) onChange(value - 1);
    };

    const handleIncrement = () => {
        if (value < max) onChange(value + 1);
    };

    return (
        <div className="flex items-center justify-between py-2">
            <div>
                {label && <div className="font-bold text-gray-900">{label}</div>}
                {sublabel && <div className="text-xs text-gray-500">{sublabel}</div>}
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1 border border-gray-100">
                <button
                    onClick={handleDecrement}
                    disabled={value <= min}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-gray-600 shadow-sm border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-gray-900 w-6 text-center tabular-nums">{value}</span>
                <button
                    onClick={handleIncrement}
                    disabled={value >= max}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-gray-600 shadow-sm border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
