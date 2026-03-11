"use client";

import { motion } from "framer-motion";

const navLinks = [
    { label: "Fleet", href: "#fleet" },
    { label: "Experience", href: "#experience" },
    { label: "Global", href: "#global" },
];

export default function Navbar() {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 py-5 backdrop-blur-md bg-jet-black/60 border-b border-white/[0.06]"
        >
            {/* Logo */}
            <a
                href="#"
                className="text-sm md:text-base font-light tracking-widest-luxury text-jet-white uppercase"
            >
                Jesko Jets
            </a>

            {/* Navigation Links */}
            <ul className="hidden md:flex items-center gap-10">
                {navLinks.map((link) => (
                    <li key={link.label}>
                        <motion.a
                            href={link.href}
                            className="text-xs font-light tracking-wider-luxury text-jet-silver uppercase transition-colors hover:text-jet-white"
                            whileHover={{ y: -1 }}
                            transition={{ duration: 0.2 }}
                        >
                            {link.label}
                        </motion.a>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <motion.a
                href="#"
                className="text-[11px] font-light tracking-wider-luxury text-jet-black bg-jet-white uppercase px-5 py-2.5 rounded-full"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
            >
                Inquire
            </motion.a>
        </motion.nav>
    );
}
