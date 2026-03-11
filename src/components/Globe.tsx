"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Globe() {
    const sectionRef = useRef<HTMLElement>(null!);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end end"],
    });

    // Fade in the content as user scrolls into view
    const contentOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [0, 0, 1]);
    const contentY = useTransform(scrollYProgress, [0, 0.4, 0.7], [60, 60, 0]);
    const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1]);

    return (
        <section
            ref={sectionRef}
            id="global"
            className="relative h-screen overflow-hidden"
        >
            {/* Background video */}
            <motion.div
                className="absolute inset-0"
                style={{ scale: videoScale }}
            >
                <video
                    src="/globe-loop.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </motion.div>

            {/* Gradient overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-jet-black via-jet-black/50 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-jet-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-jet-black/30 pointer-events-none" />

            {/* Content */}
            <motion.div
                className="relative z-10 flex flex-col items-center justify-end h-full pb-16 md:pb-24 section-padding"
                style={{ opacity: contentOpacity, y: contentY }}
            >
                <p className="text-[10px] md:text-xs tracking-widest-luxury text-jet-silver uppercase mb-4">
                    Global Connectivity
                </p>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-luxury text-jet-white text-center leading-tight max-w-3xl mb-6 text-balance">
                    Connecting continents
                    <br />
                    <span className="text-gradient">at the speed of luxury</span>
                </h2>
                <p className="text-sm md:text-base font-light text-jet-silver text-center max-w-lg mb-12 leading-relaxed">
                    From London to Tokyo, New York to Dubai — our fleet bridges the world&apos;s
                    most iconic destinations with unmatched grace and precision.
                </p>

                {/* Footer */}
                <footer className="w-full border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] tracking-wider-luxury text-jet-silver/60 uppercase">
                        © 2026 Jesko Jets. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        {["Privacy", "Terms", "Contact"].map((link) => (
                            <a
                                key={link}
                                href="#"
                                className="text-[10px] tracking-wider-luxury text-jet-silver/60 uppercase hover:text-jet-white transition-colors duration-300"
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </footer>
            </motion.div>
        </section>
    );
}
