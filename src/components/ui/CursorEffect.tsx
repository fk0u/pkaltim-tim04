import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorEffect() {
    const [isVisible, setIsVisible] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [cursorX, cursorY, isVisible]);

    // Don't render on touch devices or if not ready
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

    return (
        <>
            {/* Main Dot */}
            <motion.div
                className="fixed top-0 left-0 w-3 h-3 bg-emerald-500 rounded-full pointer-events-none mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 1 : 0,
                    zIndex: 9999
                }}
            />
            {/* Trailing Glow */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-emerald-400/50 pointer-events-none backdrop-blur-[1px]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 1 : 0,
                    zIndex: 9998
                }}
            />
        </>
    );
}
