"use client";

import { motion, AnimatePresence } from "framer-motion";

interface StreamingTypographyProps {
  text: string;
  isListening: boolean;
}

export function StreamingTypography({
  text,
  isListening,
}: StreamingTypographyProps) {
  return (
    <div className="w-full max-w-4xl mx-auto min-h-[60px] flex items-end justify-center pb-4 pointer-events-none">
      <AnimatePresence mode="wait">
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.95, filter: "blur(5px)" }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p
              className="font-handwriting text-2xl md:text-3xl leading-relaxed font-bold drop-shadow-sm"
              style={{
                color: "var(--foreground)",
                textShadow: "0 0 10px var(--glass-border)",
              }}
            >
              {text || (
                <span className="opacity-50 italic text-xl">Listening...</span>
              )}
              {/* Typewriter Cursor */}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-6 md:h-8 ml-1 align-baseline bg-current opacity-70 rounded-full"
              />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
