"use client";
import { motion } from "framer-motion";
export default function Loader() {
  return (
    <motion.div
      className="h-5 w-5 rounded-full border-2 border-text/30 border-t-primary"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    />
  );
}
