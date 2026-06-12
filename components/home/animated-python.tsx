"use client";

import { motion } from "framer-motion";

/** Mascote Python animado — cobra estilizada com brilho pulsante. */
export function AnimatedPython() {
  return (
    <div className="relative flex h-28 w-28 items-center justify-center sm:h-36 sm:w-36">
      {/* halo pulsante */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
        animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* anel girando */}
      <motion.div
        className="absolute inset-2 rounded-full border-2 border-dashed border-primary/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      {/* cobra */}
      <motion.svg
        viewBox="0 0 48 48"
        className="relative h-16 w-16 text-primary-light sm:h-20 sm:w-20"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.path
          d="M14 9h11a6 6 0 0 1 6 6v2a6 6 0 0 1-6 6h-7a6 6 0 0 0-6 6v2a6 6 0 0 0 6 6h12"
          fill="none"
          stroke="url(#snakegrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
        <circle cx="13" cy="9" r="3" fill="#9956F6" />
        <circle cx="12" cy="8" r="0.9" fill="#fff" />
        <defs>
          <linearGradient id="snakegrad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#29E0A9" />
            <stop offset="50%" stopColor="#9956F6" />
            <stop offset="100%" stopColor="#E254FF" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
