"use client";

import { useEffect, useRef, useState } from "react";

interface UseImagePreloaderResult {
    images: HTMLImageElement[];
    progress: number;
    isLoaded: boolean;
}

/**
 * Preloads a numbered JPEG sequence into an array of HTMLImageElements.
 *
 * @param basePath  – public folder path, e.g. "/sequence-1"
 * @param frameCount – total frames (e.g. 120)
 * @param prefix    – filename prefix before the number (default "ezgif-frame-")
 * @param padLength – zero-pad length for the frame number (default 3)
 * @param extension – file extension (default "jpg")
 */
export function useImagePreloader(
    basePath: string,
    frameCount: number,
    prefix: string = "ezgif-frame-",
    padLength: number = 3,
    extension: string = "jpg"
): UseImagePreloaderResult {
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const imagesRef = useRef<HTMLImageElement[]>([]);

    useEffect(() => {
        let loadedCount = 0;
        const imgs: HTMLImageElement[] = new Array(frameCount);

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            const frameNum = String(i + 1).padStart(padLength, "0");
            img.src = `${basePath}/${prefix}${frameNum}.${extension}`;

            img.onload = () => {
                loadedCount++;
                const p = loadedCount / frameCount;
                setProgress(p);
                if (loadedCount === frameCount) {
                    setIsLoaded(true);
                }
            };

            img.onerror = () => {
                // Count errors as loaded to avoid hanging
                loadedCount++;
                const p = loadedCount / frameCount;
                setProgress(p);
                if (loadedCount === frameCount) {
                    setIsLoaded(true);
                }
            };

            imgs[i] = img;
        }

        imagesRef.current = imgs;
    }, [basePath, frameCount, prefix, padLength, extension]);

    return { images: imagesRef.current, progress, isLoaded };
}
