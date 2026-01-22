import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useLanguage } from '@/contexts/LanguageContext';
import { ReactNode } from 'react';

// Column component for staggered animation
const Column = ({ index, total }: { index: number; total: number }) => {
    return (
        <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 1 }}
            transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.05 // Stagger delay for exit (cover)
            }}
            className="h-full bg-emerald-950 origin-top border-r border-emerald-900/20 last:border-r-0"
            style={{ width: `${100 / total}%` }}
        />
    );
};

// Overlay for entrance (reveal)
const Overlay = () => {
    return (
        <motion.div
            className="fixed inset-0 z-[60] flex pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, transition: { delay: 0.5, duration: 0.1 } }}
        >
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ scaleY: 1 }}
                    animate={{ scaleY: 0 }}
                    exit={{ scaleY: 1 }}
                    transition={{
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                        delay: i * 0.05
                    }}
                    className="h-full bg-emerald-950 origin-bottom border-r border-emerald-900/20 last:border-r-0"
                    style={{ width: "20%" }}
                />
            ))}
        </motion.div>
    )
}

export default function PageTransition({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { locale } = useLanguage();
    const transitionKey = `${router.pathname}-${locale}`;

    return (
        <AnimatePresence mode="wait">
            <div key={transitionKey} className="min-h-screen">
                {/* Entrance Overlay (Reveals new page) */}
                <Overlay />

                {children}

                {/* Exit Overlay (Covers old page) */}
                <motion.div
                    className="fixed inset-0 z-[60] flex pointer-events-none"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 1 }} // Ensure it stays visible during exit
                    animate={{ opacity: 0, transition: { delay: 0.5 } }} // Optional cleanup
                >
                    {[...Array(5)].map((_, i) => (
                        <Column key={i} index={i} total={5} />
                    ))}
                </motion.div>

                {/* Logo Overlay - Optional, appears briefly in the middle if needed */}
                <motion.div
                    className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <div className="text-4xl md:text-6xl font-black text-white tracking-tighter mix-blend-difference">
                        BorneoTrip<span className="text-emerald-500">.</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
