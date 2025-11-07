"use client";
import { motion } from "framer-motion";

export default function Particles() {
  const dots = Array.from({ length: 28 });
  // Use safe defaults for SSR, will use actual window size on client
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const height = typeof window !== 'undefined' ? window.innerHeight : 1080;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-secondary/40"
          initial={{
            x: Math.random() * width,
            y: Math.random() * height,
            opacity: 0.2 + Math.random() * 0.6,
            scale: 0.5 + Math.random(),
          }}
          animate={{
            y: ["0%", "100%"],
            x: `+=${Math.random() * 120 - 60}`,
          }}
          transition={{
            repeat: Infinity,
            duration: 18 + Math.random() * 12,
            ease: "linear",
          }}
          style={{ filter: "blur(1px)" }}
        />
      ))}
    </div>
  );
}
