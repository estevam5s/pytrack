"use client";

import { motion } from "framer-motion";

// Transição de entrada aplicada a TODA rota do site (App Router re-monta o template
// a cada navegação). Fade + leve subida, respeitando "prefers-reduced-motion".
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
