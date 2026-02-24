"use client";

import { motion } from "framer-motion";

/**
 * Animated background in an "Apple Liquid Glass" style.
 * Three translucent blurred blobs that move slowly to create depth.
 */
export default function AnimatedBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
      aria-hidden
    >
      {/* Blob 1 - blue */}
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]"
        style={{ left: "10%", top: "20%" }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 50, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
      {/* Blob 2 - purple */}
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]"
        style={{ right: "15%", top: "40%" }}
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.9, 1.2, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
      {/* Blob 3 - emerald */}
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full bg-emerald-600/20 blur-[120px]"
        style={{ left: "35%", bottom: "15%" }}
        animate={{
          x: [0, 50, -80, 0],
          y: [0, -50, 60, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
    </div>
  );
}
