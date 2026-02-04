import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import gsap from 'gsap';

export default function InteractiveCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    // Mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring physics for trail
    const springConfig = { damping: 25, stiffness: 400 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX - 16); // Center the 32px cursor
            mouseY.set(e.clientY - 16);

            // Helper logic for hover states
            const target = e.target as HTMLElement;
            const isClickable = target.closest('a, button, input, textarea, .cursor-pointer') !== null;
            setIsHovering(isClickable);
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [mouseX, mouseY]);

    return (
        <>
            {/* Main Cursor (Dot) */}
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 bg-emerald-500 rounded-full pointer-events-none z-9999 mix-blend-difference"
                style={{
                    x: mouseX, // No spring for the dot, instant movement
                    y: mouseY,
                    translateX: 8, // Offset adjustment
                    translateY: 8
                }}
            />

            {/* Trailing Ring */}
            <motion.div
                ref={cursorRef}
                className="fixed top-0 left-0 w-8 h-8 border border-emerald-400 rounded-full pointer-events-none z-9998 mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                }}
                animate={{
                    scale: isHovering ? 1.5 : 1,
                    opacity: isHovering ? 1 : 0.5,
                    backgroundColor: isHovering ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0)'
                }}
                transition={{ duration: 0.2 }}
            />
        </>
    );
}
