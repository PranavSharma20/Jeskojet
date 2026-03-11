"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useScrollSequence } from "@/hooks/useScrollSequence";
import { drawCover } from "@/utils/math";

const FRAME_COUNT = 120;

export default function PlaneMorph() {
    const sectionRef = useRef<HTMLElement>(null!);
    const canvasRef = useRef<HTMLCanvasElement>(null!);
    const lastFrameRef = useRef<number>(-1);

    const { images, isLoaded, progress: loadProgress } = useImagePreloader(
        "/sequence-2",
        FRAME_COUNT
    );
    const { frameIndex } = useScrollSequence(sectionRef, FRAME_COUNT);

    // --- Framer Motion scroll-linked transforms ---
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    // Intro label + headline: 0% – 35%
    const introOpacity = useTransform(scrollYProgress, [0, 0.06, 0.28, 0.38], [0, 1, 1, 0]);
    const introY = useTransform(scrollYProgress, [0, 0.06, 0.28, 0.38], [50, 0, 0, -30]);

    // Stat cards: 35% – 65%
    const statsOpacity = useTransform(scrollYProgress, [0.33, 0.42, 0.58, 0.68], [0, 1, 1, 0]);
    const statsY = useTransform(scrollYProgress, [0.33, 0.42, 0.58, 0.68], [40, 0, 0, -25]);

    // Closing statement: 65% – 90%
    const closingOpacity = useTransform(scrollYProgress, [0.65, 0.72, 0.85, 0.95], [0, 1, 1, 0]);
    const closingY = useTransform(scrollYProgress, [0.65, 0.72, 0.85, 0.95], [40, 0, 0, -30]);

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

    // --- Draw frame ---
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
        <section ref={sectionRef} id="fleet" className="relative h-[400vh]">
            {/* Sticky viewport */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* Canvas */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ willChange: "transform" }}
                />

                {/* Vignette overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-jet-black/60 via-transparent to-jet-black/80 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-jet-black/40 via-transparent to-jet-black/40 pointer-events-none" />

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
                            Preparing fleet
                        </p>
                    </div>
                )}

                {/* --- Typography Overlays --- */}

                {/* Block 1: Intro headline — left-aligned */}
                <motion.div
                    className="absolute inset-0 flex flex-col justify-end pb-32 md:pb-40 z-10 pointer-events-none section-padding"
                    style={{ opacity: introOpacity, y: introY }}
                >
                    <p className="text-[10px] md:text-xs tracking-widest-luxury text-jet-silver uppercase mb-3">
                        Engineered Perfection
                    </p>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-luxury text-jet-white leading-tight max-w-2xl">
                        Born from obsession.
                        <br />
                        <span className="text-gradient">Built without compromise.</span>
                    </h2>
                </motion.div>

                {/* Block 2: Performance stats */}
                <motion.div
                    className="absolute inset-0 flex items-center z-10 pointer-events-none section-padding"
                    style={{ opacity: statsOpacity, y: statsY }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 w-full max-w-5xl mx-auto">
                        {[
                            { value: "Mach 0.925", label: "Maximum cruise speed" },
                            { value: "7,700 nm", label: "Intercontinental range" },
                            { value: "51,000 ft", label: "Service ceiling" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center md:text-left">
                                <p className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-luxury text-jet-white mb-2">
                                    {stat.value}
                                </p>
                                <p className="text-[10px] md:text-xs tracking-wider-luxury text-jet-silver uppercase">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Block 3: Closing statement */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none section-padding"
                    style={{ opacity: closingOpacity, y: closingY }}
                >
                    <p className="text-[10px] md:text-xs tracking-widest-luxury text-jet-silver uppercase mb-4">
                        Aerodynamic Mastery
                    </p>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-extralight tracking-luxury text-jet-white text-center leading-relaxed max-w-3xl text-balance">
                        Every curve calculated. Every surface sculpted.
                        The art of flight, perfected.
                    </h2>
                </motion.div>
            </div>
        </section>
    );
}
