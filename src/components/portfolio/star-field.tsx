import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// ── Config ────────────────────────────────────────────────────────────────────
const ANIM_DURATION = 6.5;   // seconds per star
const GAP_MIN       = 2000;  // min gap between batches (ms)
const GAP_MAX       = 3000;  // max gap between batches (ms)

// Travel: top-left → down-right
// dx=+300, dy=+220 → angle ≈ 36° → rotate 36° so right/head points down-right
const DX = 300;
const DY = 220;

const T  = [0, 0.08, 0.28, 0.56, 0.82, 1] as const;
const XK = [DX * 0, DX * 0.02, DX * 0.16, DX * 0.52, DX * 0.88, DX * 0.96] as const;
const YK = [DY * 0, DY * 0.02, DY * 0.16, DY * 0.52, DY * 0.88, DY * 0.96] as const;

// ── Single shooting star ──────────────────────────────────────────────────────
type StarProps = { id: number; left: number; top: number; delay: number; isDark: boolean };

function ShootingStar({ left, top, delay, isDark }: StarProps) {
  const c = isDark ? "255,255,255" : "51,65,85";
  const shared = {
    duration: ANIM_DURATION,
    delay,
    times: [...T],
    ease: "linear" as const,
  };

  return (
    <motion.div
      className="absolute"
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{
        x:       [...XK],
        y:       [...YK],
        opacity: [0, 1, 0.88, 0.60, 0.10, 0],
      }}
      transition={{ x: shared, y: shared, opacity: shared }}
      style={{
        top:      `${top}%`,
        left:     `${left}%`,
        width:    "120px",
        height:   "3px",
        // path(): tapered tail on left, slightly rounded cap on right
        clipPath: "path('M 0 1.5 L 110 0 Q 120 0 120 1.5 Q 120 3 110 3 Z')",
        rotate:   36,
        background: `linear-gradient(90deg,
          transparent    0%,
          rgba(${c},0.04) 20%,
          rgba(${c},0.20) 54%,
          rgba(${c},0.78) 80%,
          rgba(${c},1)    100%)`,
        boxShadow: isDark
          ? "0 0 5px 1px rgba(255,255,255,0.6), 0 0 14px 3px rgba(210,225,255,0.15)"
          : "0 0 5px 1px rgba(80,100,160,0.5),  0 0 12px 3px rgba(80,100,160,0.12)",
      }}
    />
  );
}

// ── Batch controller ──────────────────────────────────────────────────────────
function ShootingStarController({ isDark }: { isDark: boolean }) {
  const [stars, setStars] = useState<StarProps[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    function spawnBatch() {
      const count = Math.floor(Math.random() * 4) + 8; // 8–11

      // Spread stars evenly across the spawn band to avoid clustering
      const spanWidth = 45; // % of screen width (-5% to 40%)
      const batch: StarProps[] = Array.from({ length: count }, (_, i) => ({
        id:    Date.now() + i,
        // Divide band into equal slots, randomise within each slot
        left:  -5 + (i / count) * spanWidth + Math.random() * (spanWidth / count),
        top:   Math.random() * 12 - 8,      // -8% to 4%
        delay: i * (0.15 + Math.random() * 0.30),
        isDark,
      }));

      setStars(batch);

      // Wait for all stars in the batch to finish, then add gap before next batch
      const maxDelay  = Math.max(...batch.map((s) => s.delay));
      const gap       = GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN);
      const waitMs    = (ANIM_DURATION + maxDelay + 0.5) * 1000 + gap;

      timer.current = setTimeout(spawnBatch, waitMs);
    }

    spawnBatch();
    return () => clearTimeout(timer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{stars.map((s) => <ShootingStar key={s.id} {...s} isDark={isDark} />)}</>;
}

// ── Static background stars ───────────────────────────────────────────────────
// 120 stars in the top half (0–50%), 50 in the bottom half (50–100%)
const bgStars = [
  ...Array.from({ length: 120 }, (_, i) => ({
    id:       i,
    size:     Math.random() * 2 + 1,
    x:        Math.random() * 100,
    y:        Math.random() * 50,          // top half
    opacity:  Math.random() * 0.7 + 0.3,
    duration: Math.random() * 3 + 2,
  })),
  ...Array.from({ length: 50 }, (_, i) => ({
    id:       120 + i,
    size:     Math.random() * 2 + 1,
    x:        Math.random() * 100,
    y:        50 + Math.random() * 50,     // bottom half
    opacity:  Math.random() * 0.7 + 0.3,
    duration: Math.random() * 3 + 2,
  })),
];

// ── StarField ─────────────────────────────────────────────────────────────────
type StarFieldProps = { isDark: boolean };

export function StarField({ isDark }: StarFieldProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {bgStars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            width:      s.size,
            height:     s.size,
            left:       `${s.x}%`,
            top:        `${s.y}%`,
            opacity:    s.opacity,
            background: isDark ? "white" : "rgba(51,65,85,0.75)",
          }}
          animate={{ opacity: [s.opacity, s.opacity * 0.3, s.opacity] }}
          transition={{ duration: s.duration, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      ))}
      <ShootingStarController isDark={isDark} />
    </div>
  );
}
