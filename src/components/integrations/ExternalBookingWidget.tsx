'use client';

import { motion } from 'framer-motion';
import { ExternalLink, ShoppingCart, Sparkles } from 'lucide-react';

interface ExternalBookingWidgetProps {
    packageName: string;
    destination?: string;
    price?: number;
    className?: string;
}

// Generate deep links for each platform
const generateDeepLinks = (packageName: string, destination?: string) => {
    const searchQuery = encodeURIComponent(`${packageName} ${destination || 'kalimantan'}`);
    const simpleQuery = encodeURIComponent(packageName);

    return {
        traveloka: `https://www.traveloka.com/en-id/activities/search?keyword=${simpleQuery}`,
        tiketcom: `https://www.tiket.com/to-do/search?q=${simpleQuery}`,
        tripAdvisor: `https://www.tripadvisor.com/Search?q=${searchQuery}+indonesia`,
    };
};

export function ExternalBookingWidget({ packageName, destination, price, className = '' }: ExternalBookingWidgetProps) {
    const links = generateDeepLinks(packageName, destination);

    const bookingOptions = [
        {
            name: 'Traveloka',
            description: 'Xperience & Activities',
            url: links.traveloka,
            bgGradient: 'from-[#0194F3] to-[#0180D6]',
            icon: <Sparkles className="w-4 h-4" />,
        },
        {
            name: 'Tiket.com',
            description: 'To-Do Activities',
            url: links.tiketcom,
            bgGradient: 'from-[#0064D2] to-[#0052AB]',
            icon: <ShoppingCart className="w-4 h-4" />,
        },
    ];

    return (
        <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Booking Alternatif
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Bandingkan harga di platform lain
                    </p>
                </div>
            </div>

            {/* Booking Buttons */}
            <div className="space-y-2">
                {bookingOptions.map((option, idx) => (
                    <motion.a
                        key={option.name}
                        href={option.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`
                            flex items-center justify-between w-full p-3 rounded-xl
                            bg-gradient-to-r ${option.bgGradient}
                            text-white shadow-md hover:shadow-lg
                            transition-all duration-200 hover:scale-[1.02]
                            group
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                {option.icon}
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-semibold">{option.name}</p>
                                <p className="text-xs opacity-80">{option.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium">
                            <span>Cari</span>
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.a>
                ))}
            </div>

            {/* TripAdvisor Link */}
            <motion.a
                href={links.tripAdvisor}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-3 flex items-center justify-center gap-2 w-full py-2 rounded-xl border-2 border-[#34E0A1] text-[#34E0A1] hover:bg-[#34E0A1] hover:text-black transition-all duration-200 text-sm font-medium"
            >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <circle cx="12" cy="12" r="10" fill="currentColor" />
                    <circle cx="8" cy="11" r="2" fill="white" />
                    <circle cx="16" cy="11" r="2" fill="white" />
                    <circle cx="8" cy="11" r="0.8" fill="currentColor" />
                    <circle cx="16" cy="11" r="0.8" fill="currentColor" />
                </svg>
                Lihat di TripAdvisor
                <ExternalLink className="w-3.5 h-3.5" />
            </motion.a>

            {/* Disclaimer */}
            <p className="mt-3 text-[10px] text-gray-400 dark:text-gray-500 text-center">
                Harga & ketersediaan mungkin berbeda di platform eksternal
            </p>
        </div>
    );
}

export default ExternalBookingWidget;
