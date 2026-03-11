"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useScrollSequence } from "@/hooks/useScrollSequence";
import { drawCover } from "@/utils/math";

const FRAME_COUNT = 120;

export default function HeroScroll() {
    const sectionRef = useRef<HTMLElement>(null!);
    const canvasRef = useRef<HTMLCanvasElement>(null!);
    const lastFrameRef = useRef<number>(-1);

    const { images, isLoaded, progress: loadProgress } = useImagePreloader(
        "/sequence-1",
        FRAME_COUNT
    );
    const { frameIndex } = useScrollSequence(sectionRef, FRAME_COUNT);

    // --- Framer Motion scroll-linked opacity for text overlays ---
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    // Headline: visible 0% – 30% of scroll
    const headlineOpacity = useTransform(scrollYProgress, [0, 0.08, 0.25, 0.35], [0, 1, 1, 0]);
    const headlineY = useTransform(scrollYProgress, [0, 0.08, 0.25, 0.35], [40, 0, 0, -30]);

    // Tagline: visible 15% – 45%
    const taglineOpacity = useTransform(scrollYProgress, [0.1, 0.18, 0.38, 0.48], [0, 1, 1, 0]);
    const taglineY = useTransform(scrollYProgress, [0.1, 0.18, 0.38, 0.48], [30, 0, 0, -20]);

    // Second block: visible 50% – 80%
    const block2Opacity = useTransform(scrollYProgress, [0.48, 0.55, 0.72, 0.82], [0, 1, 1, 0]);
    const block2Y = useTransform(scrollYProgress, [0.48, 0.55, 0.72, 0.82], [40, 0, 0, -30]);

    // --- Canvas sizing ---
    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
    }, []);

    useEffect(() => {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, [resizeCanvas]);

    // --- Draw frame to canvas ---
    useEffect(() => {
        if (!isLoaded) return;
        if (frameIndex === lastFrameRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const img = images[frameIndex];

        if (!ctx || !img || !img.complete) return;

        lastFrameRef.current = frameIndex;
        drawCover(ctx, img, canvas.width, canvas.height);
    }, [frameIndex, images, isLoaded]);

    // Draw first frame once loaded
    useEffect(() => {
        if (!isLoaded || images.length === 0) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const img = images[0];
        if (!ctx || !img || !img.complete) return;
        drawCover(ctx, img, canvas.width, canvas.height);
    }, [isLoaded, images]);

    return (
        <section ref={sectionRef} id="hero" className="relative h-[400vh]">
            {/* Sticky viewport */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* Canvas */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ willChange: "transform" }}
                />

                {/* Dark vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-jet-black/40 via-transparent to-jet-black/70 pointer-events-none" />

                {/* Loading indicator */}
                {!isLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-jet-black z-20">
                        <div className="w-48 h-[2px] bg-jet-grey rounded-full overflow-hidden">
                            <div
                                className="h-full bg-jet-white/80 transition-all duration-300 ease-out"
                                style={{ width: `${loadProgress * 100}%` }}
                            />
                        </div>
                        <p className="mt-4 text-[11px] tracking-wider-luxury text-jet-silver uppercase">
                            Loading experience
                        </p>
                    </div>
                )}

                {/* --- Typography Overlays --- */}

                {/* Block 1: Hero headline */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
                    style={{ opacity: headlineOpacity, y: headlineY }}
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-luxury text-jet-white text-center leading-tight">
                        JESKO JETS
                    </h1>
                </motion.div>

                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none pt-28 md:pt-36"
                    style={{ opacity: taglineOpacity, y: taglineY }}
                >
                    <p className="text-sm md:text-base font-light tracking-wider-luxury text-jet-silver uppercase text-center max-w-lg">
                        Redefining the skies with uncompromising luxury
                    </p>
                </motion.div>

                {/* Block 2: Mid-scroll statement */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none section-padding"
                    style={{ opacity: block2Opacity, y: block2Y }}
                >
                    <p className="text-xs tracking-wider-luxury text-jet-silver uppercase mb-4">
                        First Class Redefined
                    </p>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-luxury text-jet-white text-center leading-tight max-w-3xl text-balance">
                        Where every window reveals a world of possibility
                    </h2>
                </motion.div>
            </div>
        </section>
    );
}
