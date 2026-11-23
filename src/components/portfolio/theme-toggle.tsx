import { useRef, type MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring", stiffness: 210, damping: 20, mass: 0.9 } as const;
const RAYS = Array.from({ length: 8 }, (_, i) => i * 45);

type ThemeToggleProps = {
  isDark: boolean;
  /** Receives the toggle's centre so the page can reveal the new theme from that point. */
  onToggle: (origin: { x: number; y: number }) => void;
};

/**
 * The icon is the state: a crescent moon with two stars at night, a full sun with rays by day.
 * Switching slides the moon's shadow off the disc, shrinks it into the sun's core and fans the rays out.
 */
export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const transition = reduceMotion ? { duration: 0 } : SPRING;
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const rect = ref.current?.getBoundingClientRect();
    // Keyboard clicks report 0,0, so fall back to the button's centre.
    const fromPointer = event.clientX !== 0 || event.clientY !== 0;
    onToggle({
      x: fromPointer ? event.clientX : rect ? rect.left + rect.width / 2 : 0,
      y: fromPointer ? event.clientY : rect ? rect.top + rect.height / 2 : 0,
    });
  }

  return (
    <div className="group relative flex items-center justify-center">
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#ff6a3d] px-3 py-1.5 text-[10px] font-extralight tracking-[0.04em] text-slate-950 opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
        {label}
      </div>
      <motion.button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Dark mode"
        onClick={handleClick}
        whileTap={reduceMotion ? undefined : { scale: 0.86 }}
        className={cn(
          "relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2",
          isDark
            ? "bg-[#a99cff]/[0.14] hover:bg-[#a99cff]/[0.24] focus-visible:ring-white/35"
            : "bg-[#ff9a62]/[0.16] hover:bg-[#ff9a62]/[0.28] focus-visible:ring-slate-900/18",
        )}
      >
        {/* A soft halo in the body's colour: cool moonlight at night, warm sunlight by day. */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          initial={false}
          animate={{
            opacity: isDark ? 0.55 : 0.75,
            background: isDark
              ? "radial-gradient(circle at 50% 50%, rgba(201,192,255,0.45), transparent 62%)"
              : "radial-gradient(circle at 50% 50%, rgba(255,170,100,0.55), transparent 62%)",
          }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
        />

        <motion.svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="relative h-[22px] w-[22px] overflow-visible"
          initial={false}
          animate={{ rotate: isDark ? -25 : 90 }}
          transition={transition}
        >
          <defs>
            <mask id="theme-toggle-moon-mask">
              <rect x="-4" y="-4" width="32" height="32" fill="white" />
              {/* The shadow that carves the crescent. It slides off the disc by day. */}
              <motion.circle
                initial={false}
                animate={isDark ? { cx: 17, cy: 7, r: 7 } : { cx: 30, cy: -2, r: 7 }}
                transition={transition}
                fill="black"
              />
            </mask>
          </defs>

          <motion.circle
            cx="12"
            cy="12"
            initial={false}
            animate={{ r: isDark ? 8.5 : 5, fill: isDark ? "#e8e3ff" : "#ff9a62" }}
            transition={transition}
            mask="url(#theme-toggle-moon-mask)"
          />

          {RAYS.map((angle, index) => (
            // The group fixes each ray's angle around the sun's centre; the ray itself only grows outward.
            <g key={angle} transform={`rotate(${angle} 12 12)`}>
              <motion.line
                x1="12"
                x2="12"
                stroke="#ff9a62"
                strokeWidth="2"
                strokeLinecap="round"
                initial={false}
                animate={isDark ? { y1: 6.5, y2: 6.5, opacity: 0 } : { y1: 2.2, y2: 4.6, opacity: 1 }}
                transition={reduceMotion ? { duration: 0 } : { ...SPRING, delay: isDark ? 0 : 0.08 + index * 0.025 }}
              />
            </g>
          ))}
        </motion.svg>

        {/* Two stars that only come out at night. */}
        {[
          { left: "27%", top: "26%", size: 3, delay: 0.12 },
          { left: "70%", top: "70%", size: 2, delay: 0.2 },
        ].map((star) => (
          <motion.span
            key={star.left}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full bg-white"
            style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
            initial={false}
            animate={
              isDark
                ? reduceMotion
                  ? { opacity: 0.9, scale: 1 }
                  : { opacity: [0, 1, 0.55, 1], scale: [0, 1.3, 1, 1] }
                : { opacity: 0, scale: 0 }
            }
            transition={reduceMotion ? { duration: 0 } : { duration: 0.9, delay: isDark ? star.delay + 0.15 : 0 }}
          />
        ))}
      </motion.button>
    </div>
  );
}
