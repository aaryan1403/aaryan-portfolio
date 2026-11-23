import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* Scroll offsets read as "[target edge] [viewport edge]", so motion is a pure
   function of scroll position: it plays going down and rewinds going up. */
type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

/* ── Pill button: magnetic pull, a fill that spreads from the cursor, a looping arrow ── */

type ArrowDirection = "right" | "down" | "diagonal";

const arrowOut: Record<ArrowDirection, string> = {
  right: "group-hover/pill:translate-x-[160%] group-focus-visible/pill:translate-x-[160%]",
  down: "group-hover/pill:translate-y-[160%] group-focus-visible/pill:translate-y-[160%]",
  diagonal: "group-hover/pill:translate-x-[160%] group-hover/pill:-translate-y-[160%] group-focus-visible/pill:translate-x-[160%] group-focus-visible/pill:-translate-y-[160%]",
};
const arrowIn: Record<ArrowDirection, string> = {
  right: "-translate-x-[160%] group-hover/pill:translate-x-0 group-focus-visible/pill:translate-x-0",
  down: "-translate-y-[160%] group-hover/pill:translate-y-0 group-focus-visible/pill:translate-y-0",
  diagonal: "-translate-x-[160%] translate-y-[160%] group-hover/pill:translate-x-0 group-hover/pill:translate-y-0 group-focus-visible/pill:translate-x-0 group-focus-visible/pill:translate-y-0",
};

type PillButtonProps = {
  isDark: boolean;
  variant: "solid" | "outline";
  size?: "md" | "lg";
  icon?: LucideIcon;
  arrow?: ArrowDirection;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
};

export function PillButton({
  isDark,
  variant,
  size = "md",
  icon: Icon,
  arrow = "right",
  href,
  external,
  onClick,
  ariaLabel,
  className,
  children,
}: PillButtonProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });

  // The fill grows from wherever the cursor came in and shrinks back toward where it left.
  function placeOrigin(event: PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--pill-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--pill-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }

  function handleMove(event: PointerEvent<HTMLElement>) {
    if (reduceMotion || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 14);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * 10);
  }

  function handleLeave(event: PointerEvent<HTMLElement>) {
    placeOrigin(event);
    x.set(0);
    y.set(0);
  }

  const palette = {
    solid: isDark
      ? { base: "bg-white text-[#1a1a2e] focus-visible:ring-white/60", fill: "#ff8a4c", hoverText: "" }
      : { base: "bg-slate-950 text-white focus-visible:ring-slate-900/40", fill: "#ff8a4c", hoverText: "group-hover/pill:text-slate-950 group-focus-visible/pill:text-slate-950" },
    outline: isDark
      ? { base: "border border-white/20 text-white focus-visible:ring-white/50", fill: "#ffffff", hoverText: "group-hover/pill:text-[#1a1a2e] group-focus-visible/pill:text-[#1a1a2e]" }
      : { base: "border border-slate-900/15 text-slate-900 focus-visible:ring-slate-900/30", fill: "#0f172a", hoverText: "group-hover/pill:text-white group-focus-visible/pill:text-white" },
  }[variant];

  const classes = cn(
    "group/pill relative isolate inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full font-medium focus-visible:outline-none focus-visible:ring-2 [--pill-x:50%] [--pill-y:50%]",
    size === "lg" ? "min-h-12 px-6 text-[15px]" : "min-h-11 px-5 text-[15px]",
    palette.base,
    className,
  );

  const content = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[var(--pill-x)] top-[var(--pill-y)] -z-10 aspect-square w-[calc(100%*2.4)] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/pill:scale-100 group-focus-visible/pill:scale-100"
        style={{ background: palette.fill }}
      />
      <span className={cn("transition-colors duration-300", palette.hoverText)}>{children}</span>
      {Icon && (
        <span aria-hidden="true" className={cn("relative inline-flex h-4 w-4 overflow-hidden transition-colors duration-300", palette.hoverText)}>
          <Icon className={cn("absolute inset-0 h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]", arrowOut[arrow])} />
          <Icon className={cn("absolute inset-0 h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/pill:delay-75", arrowIn[arrow])} />
        </span>
      )}
    </>
  );

  const shared = {
    className: classes,
    style: { x, y } as unknown as CSSProperties,
    onPointerEnter: placeOrigin,
    onPointerMove: handleMove,
    onPointerLeave: handleLeave,
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <motion.a
        ref={(node) => { ref.current = node; }}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={onClick}
        {...shared}
      >
        {content}
      </motion.a>
    );
  }
  return (
    <motion.button ref={(node) => { ref.current = node; }} type="button" onClick={onClick} {...shared}>
      {content}
    </motion.button>
  );
}

/* ── Scroll-scrubbed reveals ── */

/** Rises into place as it scrolls on screen, and sinks back when scrolled away upward. */
export function ScrubIn({
  children,
  className,
  offset = ["start 98%", "start 62%"],
  distance = 56,
}: {
  children: ReactNode;
  className?: string;
  offset?: ScrollOffset;
  distance?: number;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const y = useTransform(scrollYProgress, [0, 1], [distance, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div ref={ref} className={className} style={reduceMotion ? undefined : { y, opacity }}>
      {children}
    </motion.div>
  );
}

function ScrubWord({
  progress,
  range,
  from,
  lift,
  className,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  from: number;
  lift: boolean;
  className?: string;
  children: string;
}) {
  const opacity = useTransform(progress, range, [from, 1]);
  const y = useTransform(progress, range, lift ? ["0.45em", "0em"] : ["0em", "0em"]);
  const rotate = useTransform(progress, range, lift ? [4, 0] : [0, 0]);
  return (
    // Joined by hand: class merging would read font-['Caveat'] and font-semibold as rivals and drop the face.
    <motion.span className={["inline-block will-change-transform", className].filter(Boolean).join(" ")} style={{ opacity, y, rotate }}>
      {children}
    </motion.span>
  );
}

/** Lights the words up one by one as the text scrolls through the reading zone. */
export function ScrubWords({
  text,
  className,
  offset = ["start 88%", "start 52%"],
  from = 0.16,
  lift = false,
  accent,
}: {
  text: string;
  className?: string;
  offset?: ScrollOffset;
  from?: number;
  lift?: boolean;
  /** One word drawn in a different face, e.g. the orange Caveat accent. */
  accent?: { word: string; className: string };
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const words = text.split(" ");

  if (reduceMotion) {
    return (
      <span className={className}>
        {words.map((word, index) => (
          <span key={`${word}-${index}`}>
            {word === accent?.word ? <span className={`inline-block ${accent.className}`}>{word}</span> : word}
            {index < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {words.map((word, index) => {
        const start = (index / words.length) * 0.85;
        return (
          <span key={`${word}-${index}`}>
            <ScrubWord progress={scrollYProgress} range={[start, start + 0.15 + 0.85 / words.length]} from={from} lift={lift} className={word === accent?.word ? accent.className : undefined}>
              {word}
            </ScrubWord>
            {index < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </span>
  );
}
