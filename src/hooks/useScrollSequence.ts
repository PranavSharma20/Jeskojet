"use client";

import { useEffect, useState, useCallback, useRef, type RefObject } from "react";
import { clamp, lerp } from "@/utils/math";

interface UseScrollSequenceResult {
    /** Scroll progress through the container, 0 → 1 */
    progress: number;
    /** Current frame index, 0 → frameCount-1 */
    frameIndex: number;
}

/**
 * Tracks scroll progress within a tall container and maps it
 * to a frame index for canvas-based scrollytelling.
 *
 * @param containerRef – ref to the outer scroll-runway element (e.g. h-[400vh])
 * @param frameCount   – total number of frames in the sequence
 */
export function useScrollSequence(
    containerRef: RefObject<HTMLElement>,
    frameCount: number
): UseScrollSequenceResult {
    const [progress, setProgress] = useState(0);
    const [frameIndex, setFrameIndex] = useState(0);
    const lastProgressRef = useRef(0);
    const lastFrameIndexRef = useRef(0);
    const rAFRef = useRef<number | null>(null);
    const targetProgressRef = useRef(0);
    const targetFrameIndexRef = useRef(0);

    // Easing function for smoother scroll progress (easeOutQuad)
    function easeOutQuad(t: number) {
        return 1 - (1 - t) * (1 - t);
    }

    // Smooth animation loop
    const animate = useCallback(() => {
        rAFRef.current = requestAnimationFrame(() => {
            // Smooth progress
            const lerpedProgress = lerp(lastProgressRef.current, targetProgressRef.current, 0.15);
            const easedProgress = easeOutQuad(lerpedProgress);
            if (Math.abs(lastProgressRef.current - targetProgressRef.current) > 0.001) {
                setProgress(easedProgress);
                lastProgressRef.current = lerpedProgress;
            }

            // Smooth frame index
            const lerpedFrame = lerp(lastFrameIndexRef.current, targetFrameIndexRef.current, 0.25);
            const roundedFrame = Math.round(lerpedFrame);
            if (lastFrameIndexRef.current !== roundedFrame) {
                setFrameIndex(roundedFrame);
                lastFrameIndexRef.current = lerpedFrame;
            }

            // Continue animating if not settled
            if (
                Math.abs(lastProgressRef.current - targetProgressRef.current) > 0.001 ||
                Math.abs(lastFrameIndexRef.current - targetFrameIndexRef.current) > 0.5
            ) {
                animate();
            } else {
                rAFRef.current = null;
            }
        });
    }, []);

    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrolled = -rect.top;
        const scrollableDistance = container.offsetHeight - windowHeight;
        const rawProgress = scrolled / scrollableDistance;
        const clampedProgress = clamp(rawProgress, 0, 1);
        const newFrameIndex = clamp(Math.floor(clampedProgress * (frameCount - 1)), 0, frameCount - 1);

        targetProgressRef.current = clampedProgress;
        targetFrameIndexRef.current = newFrameIndex;
        if (rAFRef.current === null) animate();
    }, [containerRef, frameCount, animate]);

    useEffect(() => {
        // Use passive scroll listener for best performance
        window.addEventListener("scroll", handleScroll, { passive: true });
        // Initial calculation
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    return { progress, frameIndex };
}
