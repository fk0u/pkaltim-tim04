'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface PlatformBadgesProps {
    packageName: string;
    destination?: string;
    className?: string;
    showLabel?: boolean;
}

// Generate deep links for each platform
const generateDeepLinks = (packageName: string, destination?: string) => {
    const searchQuery = encodeURIComponent(`${packageName} ${destination || 'kalimantan'} indonesia`);
    const simpleQuery = encodeURIComponent(packageName);

    return {
        tripAdvisor: `https://www.tripadvisor.com/Search?q=${searchQuery}`,
        traveloka: `https://www.traveloka.com/en-id/activities/search?keyword=${simpleQuery}`,
        tiketcom: `https://www.tiket.com/to-do/search?q=${simpleQuery}`,
    };
};

const platforms = [
    {
        name: 'TripAdvisor',
        key: 'tripAdvisor' as const,
        logo: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="#34E0A1" />
                <circle cx="8" cy="11" r="2.5" fill="white" />
                <circle cx="16" cy="11" r="2.5" fill="white" />
                <circle cx="8" cy="11" r="1" fill="#222" />
                <circle cx="16" cy="11" r="1" fill="#222" />
                <path d="M7 15.5c0 0 2.5 2 5 2s5-2 5-2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
        ),
        color: 'bg-[#34E0A1] hover:bg-[#2BC78C]',
        textColor: 'text-black',
    },
    {
        name: 'Traveloka',
        key: 'traveloka' as const,
        logo: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <rect width="24" height="24" rx="4" fill="#0194F3" />
                <path d="M6 12h12M12 6v12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="4" fill="white" />
                <circle cx="12" cy="12" r="2" fill="#0194F3" />
            </svg>
        ),
        color: 'bg-[#0194F3] hover:bg-[#0180D6]',
        textColor: 'text-white',
    },
    {
        name: 'Tiket.com',
        key: 'tiketcom' as const,
        logo: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <rect width="24" height="24" rx="4" fill="#0064D2" />
                <path d="M5 9h14v6H5z" fill="white" />
                <circle cx="5" cy="12" r="2" fill="#0064D2" />
                <circle cx="19" cy="12" r="2" fill="#0064D2" />
                <path d="M9 9v6M15 9v6" stroke="#0064D2" strokeWidth="0.5" strokeDasharray="1 1" />
            </svg>
        ),
        color: 'bg-[#0064D2] hover:bg-[#0052AB]',
        textColor: 'text-white',
    },
];

export function PlatformBadges({ packageName, destination, className = '', showLabel = true }: PlatformBadgesProps) {
    const links = generateDeepLinks(packageName, destination);

    return (
        <div className={`${className}`}>
            {showLabel && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                    Juga tersedia di:
                </p>
            )}
            <div className="flex flex-wrap gap-2">
                {platforms.map((platform, idx) => (
                    <motion.a
                        key={platform.key}
                        href={links[platform.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`
                            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                            ${platform.color} ${platform.textColor}
                            text-xs font-medium shadow-sm
                            transition-all duration-200 hover:shadow-md hover:scale-105
                        `}
                    >
                        {platform.logo}
                        <span>{platform.name}</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                    </motion.a>
                ))}
            </div>
        </div>
    );
}

export default PlatformBadges;
