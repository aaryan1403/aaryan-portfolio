import { useEffect, useRef, useState } from "react";

const ENABLED_QUERY = "(pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)";

// ── Config ────────────────────────────────────────────────────────────────────
const TRAIL_MS    = 520;
const SPARKLE_MS  = 300;
const DARK_COLOR  = "255, 255, 100";   // warm neon yellow (dark theme)
const LIGHT_COLOR = "140, 120, 255";   // electric blue-purple (light theme)
const BANDS       = 14;  // more steps = smoother opacity fade
const SPAWN_EVERY = 2;

function getColor() {
  return document.documentElement.classList.contains("dark") ? DARK_COLOR : LIGHT_COLOR;
}

type Point   = { x: number; y: number; t: number };
type Sparkle = { x: number; y: number; t: number; r: number; angle: number; dist: number; armLen: number };

// ── Draw one smooth continuous bezier path through all pts ───────────────────
// Single beginPath → single stroke = zero visible segment joints.
function smoothStroke(
  ctx: CanvasRenderingContext2D,
  pts: Point[],
  width: number,
  alpha: number,
  color: string,
) {
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.lineWidth  = width;
  ctx.lineCap    = "round";
  ctx.lineJoin   = "round";
  ctx.strokeStyle = `rgba(${color}, ${alpha})`;
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length - 1; i++) {
    // quadratic bezier through midpoints → smooth curve, no kinks
    ctx.quadraticCurveTo(
      pts[i].x, pts[i].y,
      (pts[i].x + pts[i + 1].x) / 2,
      (pts[i].y + pts[i + 1].y) / 2,
    );
  }
  ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
  ctx.stroke();
}

// ── Component ─────────────────────────────────────────────────────────────────
export function CursorTrail() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(ENABLED_QUERY);
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return enabled ? <CursorTrailCanvas /> : null;
}

function CursorTrailCanvas() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const points     = useRef<Point[]>([]);
  const sparkles   = useRef<Sparkle[]>([]);
  const rafRef     = useRef<number>(0);
  const spawnTick  = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      points.current.push({ x: e.clientX, y: e.clientY, t: now });

      spawnTick.current++;
      if (spawnTick.current % SPAWN_EVERY === 0) {
        const count = Math.random() < 0.35 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          sparkles.current.push({
            x: e.clientX + (Math.random() - 0.5) * 6,
            y: e.clientY + (Math.random() - 0.5) * 6,
            t: now,
            r: 3 + Math.random() * 4.5,
            angle: Math.random() * Math.PI * 2,
            dist: 6 + Math.random() * 13,
            armLen: 2.5 + Math.random() * 4,
          });
        }
      }
    };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      const now = performance.now();
      points.current   = points.current.filter(p => now - p.t < TRAIL_MS);
      sparkles.current = sparkles.current.filter(s => now - s.t < SPARKLE_MS);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pts = points.current;

      // ── Neon stroke — three width layers, each drawn via BANDS sub-paths ──
      // Each sub-path is a smooth continuous bezier from a slice of points.
      // Slices overlap: tail slice = 1 band worth of alpha, head slice = BANDS worth.
      // Result: the newest part of the trail is fully opaque; the oldest fades out.
      // Every sub-path is a single stroke call → no visible joints anywhere.
      if (pts.length >= 2) {
        const color  = getColor();
        const layers = [
          { width: 14,  maxAlpha: 0.07 },  // outer bloom
          { width: 5.5, maxAlpha: 0.24 },  // mid glow
          { width: 1.4, maxAlpha: 0.92 },  // bright neon core
        ] as const;

        const n = pts.length;

        for (const { width, maxAlpha } of layers) {
          for (let b = 0; b < BANDS; b++) {
            // Each band draws from a progressively later start index → tail fades
            const startIdx = Math.floor((b / BANDS) * n);
            const alpha    = ((b + 1) / BANDS) * maxAlpha;
            smoothStroke(ctx, pts.slice(startIdx), width, alpha, color);
          }
        }
      }

      // ── Sparkles ──────────────────────────────────────────────────────────
      const sparkColor = getColor();
      for (const s of sparkles.current) {
        const age  = now - s.t;
        const life = 1 - age / SPARKLE_MS;
        const a    = life * life;
        const prog = age / SPARKLE_MS;
        const cx   = s.x + Math.cos(s.angle) * s.dist * prog;
        const cy   = s.y + Math.sin(s.angle) * s.dist * prog;

        // Radial glow halo
        const r    = s.r * (1 + prog * 0.6);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0,    `rgba(255, 255, 255, ${a * 0.95})`);
        grad.addColorStop(0.35, `rgba(${sparkColor}, ${a * 0.55})`);
        grad.addColorStop(1,    `rgba(${sparkColor}, 0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // 4-point cross arms
        ctx.lineCap     = "round";
        ctx.lineWidth   = 0.8;
        ctx.strokeStyle = `rgba(255, 255, 255, ${a * 0.88})`;
        const len = s.armLen * (1 - prog * 0.35);
        for (let i = 0; i < 4; i++) {
          const ang = (i / 4) * Math.PI;
          ctx.beginPath();
          ctx.moveTo(cx - Math.cos(ang) * len, cy - Math.sin(ang) * len);
          ctx.lineTo(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len);
          ctx.stroke();
        }

        // Bright centre dot
        ctx.beginPath();
        ctx.arc(cx, cy, 0.85, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[100]"
    />
  );
}
