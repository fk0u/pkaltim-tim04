'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface TripAdvisorRatingProps {
    rating?: number; // 1-5 scale
    reviewCount?: number;
    packageName: string;
    destination?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function TripAdvisorRating({
    rating = 4.5,
    reviewCount = 128,
    packageName,
    destination,
    size = 'md',
    className = ''
}: TripAdvisorRatingProps) {
    const searchQuery = encodeURIComponent(`${packageName} ${destination || 'kalimantan'} indonesia`);
    const tripAdvisorUrl = `https://www.tripadvisor.com/Search?q=${searchQuery}`;

    const sizeClasses = {
        sm: { bubble: 'w-3 h-3', text: 'text-xs', gap: 'gap-0.5' },
        md: { bubble: 'w-4 h-4', text: 'text-sm', gap: 'gap-1' },
        lg: { bubble: 'w-5 h-5', text: 'text-base', gap: 'gap-1.5' },
    };

    const sizes = sizeClasses[size];

    // Generate bubble colors based on rating
    const getBubbleColor = (index: number) => {
        const filled = rating >= index + 1;
        const half = rating > index && rating < index + 1;

        if (filled) return 'bg-[#34E0A1]';
        if (half) return 'bg-gradient-to-r from-[#34E0A1] to-gray-300';
        return 'bg-gray-300 dark:bg-gray-600';
    };

    return (
        <motion.a
            href={tripAdvisorUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                inline-flex items-center ${sizes.gap} p-2 rounded-lg
                bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                hover:shadow-md transition-all duration-200 hover:border-[#34E0A1]
                group cursor-pointer
                ${className}
            `}
        >
            {/* TripAdvisor Logo */}
            <div className="flex-shrink-0">
                <svg viewBox="0 0 24 24" className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'}`} fill="currentColor">
                    <circle cx="12" cy="12" r="10" fill="#34E0A1" />
                    <circle cx="8" cy="11" r="2" fill="white" />
                    <circle cx="16" cy="11" r="2" fill="white" />
                    <circle cx="8" cy="11" r="0.8" fill="#222" />
                    <circle cx="16" cy="11" r="0.8" fill="#222" />
                    <path d="M7 15c0 0 2.5 1.5 5 1.5s5-1.5 5-1.5" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" />
                </svg>
            </div>

            {/* Rating Bubbles */}
            <div className={`flex items-center ${sizes.gap}`}>
                {[0, 1, 2, 3, 4].map((index) => (
                    <div
                        key={index}
                        className={`${sizes.bubble} rounded-full ${getBubbleColor(index)}`}
                    />
                ))}
            </div>

            {/* Rating Text */}
            <span className={`${sizes.text} font-semibold text-gray-900 dark:text-white`}>
                {rating.toFixed(1)}
            </span>

            {/* Review Count */}
            <span className={`${sizes.text} text-gray-500 dark:text-gray-400`}>
                ({reviewCount.toLocaleString()} ulasan)
            </span>

            {/* External Link Icon */}
            <ExternalLink className={`w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity`} />
        </motion.a>
    );
}

export default TripAdvisorRating;
