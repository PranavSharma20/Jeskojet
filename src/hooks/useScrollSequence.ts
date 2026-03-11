"use client";

import { useEffect, useState, useCallback, type RefObject } from "react";
import { clamp } from "@/utils/math";

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

    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // How far the container has scrolled past the viewport top
        // rect.top starts positive (below viewport), goes negative (above)
        const scrolled = -rect.top;
        const scrollableDistance = container.offsetHeight - windowHeight;

        const rawProgress = scrolled / scrollableDistance;
        const clampedProgress = clamp(rawProgress, 0, 1);

        setProgress(clampedProgress);
        setFrameIndex(
            clamp(Math.floor(clampedProgress * (frameCount - 1)), 0, frameCount - 1)
        );
    }, [containerRef, frameCount]);

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
