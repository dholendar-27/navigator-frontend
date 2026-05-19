import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ThemeTransitionOverlayProps {
    isTransitioning: boolean;
    origin: { x: number; y: number };
    newTheme: "light" | "dark";
    onComplete: () => void;
}

// Compute max radius to cover viewport from a given point (synchronous)
function getRadius(x: number, y: number): number {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return (
        Math.ceil(
            Math.max(
                Math.hypot(x, y),
                Math.hypot(w - x, y),
                Math.hypot(x, h - y),
                Math.hypot(w - x, h - y)
            )
        ) + 20
    );
}

export function ThemeTransitionOverlay({
    isTransitioning,
    origin,
    newTheme,
    onComplete,
}: ThemeTransitionOverlayProps) {
    // Guard so onComplete is called exactly once per transition
    const doneRef = useRef(false);

    useEffect(() => {
        if (isTransitioning) doneRef.current = false;
    }, [isTransitioning]);

    const handleComplete = () => {
        if (!doneRef.current) {
            doneRef.current = true;
            onComplete();
        }
    };

    const radius = getRadius(origin.x, origin.y);
    const bgColor = newTheme === "dark" ? "hsl(222,47%,8%)" : "hsl(0,0%,100%)";

    return (
        <AnimatePresence>
            {isTransitioning && (
                <motion.div
                    key="theme-overlay"
                    initial={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
                    animate={{ clipPath: `circle(${radius}px at ${origin.x}px ${origin.y}px)` }}
                    exit={{ opacity: 0 }}
                    transition={{
                        clipPath: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.18, ease: "easeOut" },
                    }}
                    onAnimationComplete={handleComplete}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999,
                        pointerEvents: "none",
                        backgroundColor: bgColor,
                    }}
                />
            )}
        </AnimatePresence>
    );
}
