import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

/**
 * ThemeToggle — Premium animated sun/moon toggle
 * 
 * Features:
 * - Sun morphs into moon with smooth SVG transition
 * - Sun rays radiate outward with staggered animation  
 * - Moon shows craters + orbiting stars
 * - Entire toggle has a satisfying spring bounce
 * - Ripple-glow effect on click
 * - Works on all screen sizes
 */

const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-9 h-9 rounded-full border transition-colors duration-500 cursor-pointer select-none group ${
        isDark
          ? "bg-slate-800/80 border-slate-600/50 hover:border-indigo-400/50"
          : "bg-amber-50/80 border-amber-200/60 hover:border-amber-300"
      } ${className}`}
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.08 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Ripple glow on toggle */}
      <AnimatePresence>
        <motion.div
          key={theme}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 2.5, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`absolute inset-0 rounded-full ${
            isDark ? "bg-indigo-400/20" : "bg-amber-300/30"
          }`}
        />
      </AnimatePresence>

      {/* Sun / Moon SVG */}
      <div className="relative w-5 h-5">
        <AnimatePresence mode="wait">
          {isDark ? (
            /* ── Moon ── */
            <motion.svg
              key="moon"
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5 absolute inset-0"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Moon body */}
              <motion.path
                d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
                fill="#c4b5fd"
                stroke="#a78bfa"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              />
              {/* Craters */}
              <motion.circle
                cx="10" cy="9" r="1.2"
                fill="#a78bfa"
                opacity="0.4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
              />
              <motion.circle
                cx="14" cy="14" r="0.8"
                fill="#a78bfa"
                opacity="0.3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
              />
              <motion.circle
                cx="8" cy="14" r="0.6"
                fill="#a78bfa"
                opacity="0.25"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 400 }}
              />
            </motion.svg>
          ) : (
            /* ── Sun ── */
            <motion.svg
              key="sun"
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5 absolute inset-0"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Sun core */}
              <motion.circle
                cx="12" cy="12" r="4.5"
                fill="#fbbf24"
                stroke="#f59e0b"
                strokeWidth="1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              />
              {/* Sun rays — 8 lines radiating outward */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const x1 = 12 + Math.cos(rad) * 6.5;
                const y1 = 12 + Math.sin(rad) * 6.5;
                const x2 = 12 + Math.cos(rad) * 9;
                const y2 = 12 + Math.sin(rad) * 9;
                return (
                  <motion.line
                    key={angle}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      delay: 0.15 + i * 0.04,
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  />
                );
              })}
            </motion.svg>
          )}
        </AnimatePresence>
      </div>

      {/* Orbiting stars around moon */}
      {isDark && (
        <>
          {[0, 120, 240].map((offset, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute w-1 h-1 rounded-full bg-indigo-300"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                rotate: 360,
              }}
              transition={{
                opacity: { duration: 2, repeat: Infinity, delay: i * 0.6 },
                rotate: { duration: 4, repeat: Infinity, ease: "linear", delay: i * 0.3 },
              }}
              style={{
                transformOrigin: "18px 18px",
                left: "50%",
                top: "50%",
                marginLeft: -2,
                marginTop: -2 - 16,
              }}
            />
          ))}
        </>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
