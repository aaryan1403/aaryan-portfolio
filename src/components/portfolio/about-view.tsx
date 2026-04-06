import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Palette, Gamepad2, UtensilsCrossed, BookOpen, Database, FileDown, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import aaryanPhoto from "@/assets/aaryan-photo.jpg";
import { GridBackground } from "@/components/portfolio/grid-background";
import { StarField } from "@/components/portfolio/star-field";
import { LiquidGlassCard } from "@/components/ui/liquid-weather-glass";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

// ── Types ─────────────────────────────────────────────────────────────────────

type AboutViewProps = { isDark: boolean };
type ExpType = "Work" | "Education";

// ── Light-mode card gradients ─────────────────────────────────────────────────

const LIGHT_GRAD = {
  purple:
    "radial-gradient(circle at 18% 12%, rgba(154,126,214,0.18), transparent 34%), linear-gradient(180deg,#f3efff 0%,#ebe3ff 50%,#f8f4ff 100%)",
  blue:
    "radial-gradient(circle at 82% 14%, rgba(55,132,255,0.22), transparent 36%), linear-gradient(180deg,#eaf5ff 0%,#d1e5ff 48%,#e6eeff 100%)",
  orange:
    "radial-gradient(circle at 82% 14%, rgba(255,118,72,0.16), transparent 32%), linear-gradient(180deg,#fff2ea 0%,#ffe4d9 48%,#fff6f0 100%)",
  peach:
    "radial-gradient(circle at 80% 18%, rgba(255,188,150,0.16), transparent 34%), linear-gradient(180deg,#fff7f1 0%,#f7e7dd 50%,#fff9f5 100%)",
};

// ── Data ─────────────────────────────────────────────────────────────────────

const photos = [aaryanPhoto];

// Inline SVG data-URIs for icons whose simpleicons CDN slugs are unreliable.
// The Illustrator icon splits the background rect (fill=none) from the "Ai"
// glyphs (fill=white) so the orange container colour shows through correctly.
function svgUri(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const CHATGPT_ICON = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">` +
  `<path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387 2.02-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.412-.663zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>` +
  `</svg>`,
);

const ILLUSTRATOR_ICON = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">` +
  // background rounded-rect — transparent so the orange container shows through
  `<path fill="none" d="M7.5 0C3.36 0 0 3.36 0 7.5v9C0 20.64 3.36 24 7.5 24h9c4.14 0 7.5-3.36 7.5-7.5v-9C24 3.36 20.64 0 16.5 0h-9z"/>` +
  // "A" glyph + crossbar hole
  `<path fill="white" d="M10 4.2L6.495 15.8H8.41l.865-3.045h3.465l.9 3.045h1.965L11.91 4.2H10zm.96 2.025l1.38 4.995h-2.79l1.41-4.995z` +
  // "i" dot
  `M16.575 15.435c-.435 0-.765-.33-.765-.765 0-.42.33-.765.765-.765.45 0 .765.345.765.765 0 .435-.315.765-.765.765z` +
  // "i" stem
  `M16.545 12.945h-1.44V8.43h1.44v4.515z"/>` +
  `</svg>`,
);

const tools = [
  { name: "Figma",       iconUrl: "https://cdn.simpleicons.org/figma/FFFFFF",     bg: "#F24E1E" },
  { name: "Framer",      iconUrl: "https://cdn.simpleicons.org/framer/FFFFFF",    bg: "#0055FF" },
  { name: "Claude",      iconUrl: "https://cdn.simpleicons.org/anthropic/FFFFFF", bg: "#D97757" },
  { name: "ChatGPT",     iconUrl: CHATGPT_ICON,                                   bg: "#10A37F" },
  { name: "Illustrator", iconUrl: ILLUSTRATOR_ICON,                               bg: "#FF9A00" },
  { name: "Supabase",    iconUrl: "https://cdn.simpleicons.org/supabase/FFFFFF",  bg: "#3ECF8E" },
];

const workItems: { role: string; company: string; period: string; location: string; type: ExpType }[] = [
  { role: "Founding Product Designer", company: "XARISS Luxury",          period: "Jan 2025 – Present",   location: "Dublin", type: "Work" },
  { role: "UI Designer",               company: "Cozmotec",               period: "Aug – Dec 2024",        location: "Dublin", type: "Work" },
  { role: "UX Designer",               company: "Chronic Pain Ireland",   period: "May – Aug 2024",        location: "Dublin", type: "Work" },
  { role: "UX/UI Designer",            company: "Youth India Foundation", period: "Mar – Jul 2022",        location: "Mumbai", type: "Work" },
];

const educationItems: { role: string; company: string; period: string; location: string; type: ExpType }[] = [
  { role: "MSc Human-Computer Interaction", company: "University College Dublin", period: "Sept 2023 – Aug 2024", location: "Dublin", type: "Education" },
  { role: "BE Computer Engineering",        company: "Mumbai University",         period: "Aug 2019 – May 2023",  location: "Mumbai", type: "Education" },
];

const aiItems = [
  "Design Variants", "Prototyping",
  "Research Synthesis", "Finding Dessert Recipes",
];

const brainItems = [
  "Leveraging AI", "User Empathy",
  "Creativity", "Problem Solving",
  "Design Systems", "Making Dessert Recipes",
];

// ── Inline SVGs for icons not in this lucide-react version ───────────────────
function LinkedinIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function BehanceIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
      <path d="M22.5 4.5h-6v1.5h6V4.5zM19.5 10.5c-1.657 0-2.25.75-2.25 2.25h4.5c0-1.5-.75-2.25-2.25-2.25zm2.55 3.75H17.25c0 1.5.75 2.25 2.25 2.25.75 0 1.5-.375 1.875-1.125H23.1c-.525 1.5-1.8 2.25-3.6 2.25-2.25 0-3.75-1.5-3.75-3.75s1.5-3.75 3.75-3.75 3.75 1.5 3.75 3.75v.375zM0 3h9c1.5 0 3.75.75 3.75 3 0 1.125-.75 2.25-1.875 2.625v.075C12.375 9.075 13.5 10.2 13.5 12c0 2.625-2.25 3.75-4.5 3.75H0V3zm3 5.25h5.25c.75 0 1.5-.375 1.5-1.5 0-.975-.75-1.5-1.5-1.5H3v3zm0 5.25h5.625c.975 0 1.875-.525 1.875-1.875 0-1.275-.9-1.875-1.875-1.875H3v3.75z"/>
    </svg>
  );
}

type SocialLink = {
  label: string;
  href: string;
  accent: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
};

const socialLinks: SocialLink[] = [
  { label: "LinkedIn",  href: "#", accent: "#0A66C2", icon: LinkedinIcon  },
  { label: "Resume",    href: "#", accent: "#8B5CF6", icon: FileDown     },
  { label: "Behance",   href: "#", accent: "#1769FF", icon: BehanceIcon  },
  { label: "Calendly",  href: "#", accent: "#006BFF", icon: CalendarDays },
];

const whoIAmTexts = ["A Product Designer", "A Gamer", "A Tiramisu Expert"];

const whoIAmIcons = [
  { icon: Palette,         color: "#a78bfa" },
  { icon: Gamepad2,        color: "#60a5fa" },
  { icon: UtensilsCrossed, color: "#fb923c" },
];

const currentlyItems = [
  {
    category: "Playing",
    value: "Crimson Desert",
    hover: "An open-world action RPG. Just started.",
    icon: Gamepad2,
    accent: "#60a5fa",
    bg: "radial-gradient(circle at 20% 20%, rgba(96,165,250,0.18), transparent 55%), linear-gradient(145deg,#eaf1ff 0%,#dce8ff 100%)",
    bgDark: "rgba(96,165,250,0.07)",
  },
  {
    category: "Reading",
    value: "Sophie's World",
    hover: "A novel that is also a history of philosophy.",
    icon: BookOpen,
    accent: "#34d399",
    bg: "radial-gradient(circle at 20% 20%, rgba(52,211,153,0.16), transparent 55%), linear-gradient(145deg,#eafff6 0%,#d1fae5 100%)",
    bgDark: "rgba(52,211,153,0.07)",
  },
  {
    category: "Learning",
    value: "Backend\nMySQL · MongoDB",
    hover: "Building things end-to-end, finally.",
    icon: Database,
    accent: "#f472b6",
    bg: "radial-gradient(circle at 20% 20%, rgba(244,114,182,0.16), transparent 55%), linear-gradient(145deg,#fff0f9 0%,#fce7f3 100%)",
    bgDark: "rgba(244,114,182,0.07)",
  },
];

// ── Entrance animation variants ───────────────────────────────────────────────

const SPRING = { type: "spring" as const, stiffness: 260, damping: 28 };

const colAVariants = {
  hidden:  { opacity: 0, scale: 0.84, x: -28, y: 28 },
  visible: { opacity: 1, scale: 1,    x: 0,   y: 0, transition: { ...SPRING, delay: 0.12 } },
};
const colBVariants = {
  hidden:  { opacity: 0, scale: 0.84, y: 36 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { ...SPRING, delay: 0.21 } },
};
const colCVariants = {
  hidden:  { opacity: 0, scale: 0.84, x: 28, y: 28 },
  visible: { opacity: 1, scale: 1,    x: 0,  y: 0,  transition: { ...SPRING, delay: 0.30 } },
};

// Experience timeline stagger
const expContainerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.085, delayChildren: 0.55 } },
};
const expEntryVariants = {
  hidden:  { opacity: 0, y: -14 },
  visible: { opacity: 1, y: 0,   transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
};

// ── GlassCard helper ──────────────────────────────────────────────────────────

function GlassCard({
  isDark,
  className,
  innerClassName,
  lightGradient,
  children,
}: {
  isDark: boolean;
  className?: string;
  innerClassName?: string;
  lightGradient?: string;
  children: React.ReactNode;
}) {
  return (
    <LiquidGlassCard
      draggable={false}
      blurIntensity="xl"
      shadowIntensity="sm"
      glowIntensity={isDark ? "sm" : "xs"}
      borderRadius="14px"
      className={cn(
        "overflow-hidden p-[1.5px] shadow-xl transition-colors",
        isDark ? "bg-white/[0.045]" : "bg-white/55",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-[12px]",
          isDark ? "border border-white/10 bg-black/20" : "border border-white/75",
          innerClassName ?? "p-5",
        )}
        style={!isDark && lightGradient ? { backgroundImage: lightGradient } : undefined}
      >
        {children}
      </div>
    </LiquidGlassCard>
  );
}

// ── Experience entry ──────────────────────────────────────────────────────────

function ExpEntry({
  isDark, role, company, period, location, type, isLast, isCurrent,
}: {
  isDark: boolean; role: string; company: string;
  period: string; location: string; type: ExpType; isLast: boolean; isCurrent?: boolean;
}) {
  return (
    <div className={cn("relative pl-6", !isLast && "flex-1")}>
      {!isLast && (
        <div className={cn(
          "absolute bottom-0 left-[6px] top-[10px] w-px",
          isDark ? "bg-white/10" : "bg-slate-200",
        )} />
      )}
      {isCurrent ? (
        <motion.div
          className="absolute left-0 top-[7px] h-3 w-3 rounded-full"
          style={{ background: isDark ? "#facc15" : "#f59e0b" }}
          animate={{ opacity: [1, 0.4, 1], scale: [1, 1.25, 1] }}
          transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      ) : (
        <div className={cn(
          "absolute left-0 top-[7px] h-3 w-3 rounded-full border-2",
          isDark ? "border-white/25 bg-[#252541]" : "border-slate-300 bg-white",
        )} />
      )}
      <p className={cn("font-['Caveat'] text-[1.4rem] leading-tight", isDark ? "text-white/90" : "text-slate-900")}>
        {role}
      </p>
      <p className={cn("mt-0.5 font-mono text-[11px]", isDark ? "text-white/55" : "text-slate-500")}>
        {company}
      </p>
      <div className="mt-0.5 flex items-center gap-2">
        <p className={cn("font-mono text-[10px]", isDark ? "text-white/35" : "text-slate-400")}>
          {location} · {period}
        </p>
        <span className={cn(
          "rounded-full px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em]",
          type === "Education"
            ? isDark ? "bg-purple-400/15 text-purple-300" : "bg-purple-50 text-purple-500"
            : isDark ? "bg-blue-400/15 text-blue-300"   : "bg-blue-50 text-blue-500",
        )}>
          {type}
        </span>
      </div>
    </div>
  );
}

// ── Currently card with project-card-style hover overlay ─────────────────────

function CurrentlyCard({
  isDark,
  item,
}: {
  isDark: boolean;
  item: typeof currentlyItems[number];
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div
      className="flex-1 cursor-pointer"
      whileHover={{ scale: 1.04, zIndex: 10 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <LiquidGlassCard
        draggable={false}
        blurIntensity="xl"
        shadowIntensity="sm"
        glowIntensity={isDark ? "sm" : "xs"}
        borderRadius="12px"
        className={cn(
          "relative h-full overflow-hidden p-[1.5px] shadow-xl transition-colors",
          isDark ? "bg-white/[0.045]" : "bg-white/55",
        )}
      >
        {/* Card body */}
        <div
          className={cn(
            "flex h-full flex-col gap-2 rounded-[10px] p-3.5",
            isDark ? "border border-white/10" : "border border-white/75",
          )}
          style={isDark ? { backgroundColor: item.bgDark } : { backgroundImage: item.bg }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-lg"
              style={{
                backgroundColor: isDark ? `${item.accent}22` : `${item.accent}28`,
                border: `1.5px solid ${item.accent}44`,
              }}
            >
              <Icon className="h-3 w-3" style={{ color: item.accent }} />
            </div>
            <span className={cn("font-mono text-[8px] uppercase tracking-[0.2em]", isDark ? "text-white/45" : "text-slate-500")}>
              {item.category}
            </span>
          </div>
          <p className={cn("font-['Caveat'] text-[1.1rem] leading-tight", isDark ? "text-white/90" : "text-slate-900")}>
            {item.value.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>

        {/* Hover overlay — same pattern as ProjectCard */}
        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-[10px] px-3 backdrop-blur-sm",
            isDark ? "bg-black/50" : "bg-slate-900/35",
          )}
        >
          <span
            className="text-center font-['Caveat'] text-[1.15rem] leading-tight text-white"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
          >
            {item.hover}
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/55">
            {item.category}
          </span>
        </motion.div>
      </LiquidGlassCard>
    </motion.div>
  );
}

// ── Blinking kaomoji ──────────────────────────────────────────────────────────

function BlinkingKaomoji({ isDark }: { isDark: boolean }) {
  const [blink, setBlink] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function scheduleBlink() {
      timerRef.current = setTimeout(() => {
        setBlink(true);
        timerRef.current = setTimeout(() => {
          setBlink(false);
          scheduleBlink();
        }, 280);
      }, 3000 + Math.random() * 5000);
    }
    scheduleBlink();
    return () => clearTimeout(timerRef.current);
  }, []);

  const eyeStyle = {
    display: "inline-block" as const,
    originY: 0.85,
  };

  return (
    <span className={cn("font-['Caveat'] text-[1.1rem]", isDark ? "text-white/50" : "text-slate-500/80")}>
      {"(That's me "}
      <motion.span style={eyeStyle} animate={{ scaleY: blink ? 0.08 : 1 }} transition={{ duration: 0.25, ease: "easeInOut" }}>◕</motion.span>
      ‿
      <motion.span style={eyeStyle} animate={{ scaleY: blink ? 0.08 : 1 }} transition={{ duration: 0.25, ease: "easeInOut" }}>◕</motion.span>
      {")"}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function AboutView({ isDark }: AboutViewProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [whoIAmIndex, setWhoIAmIndex] = useState(1);

  const label = cn(
    "block font-mono text-[9px] uppercase tracking-[0.28em] mb-2",
    isDark ? "text-white/80" : "text-slate-500",
  );

  const pill = cn(
    "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] leading-none",
    isDark
      ? "border-white/12 bg-white/[0.07] text-white/68"
      : "border-slate-900/12 bg-white/72 text-slate-600",
  );

  return (
    <motion.div
      className="fixed inset-0 z-20 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      {/* ── Marquee CSS ── */}
      <style>{`
        @keyframes about-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .about-marquee-track {
          animation: about-marquee 22s linear infinite;
          will-change: transform;
        }
        .about-marquee-track:hover { animation-play-state: paused; }
      `}</style>

      {/* ── Background ── */}
      <div className={cn(
        "pointer-events-none absolute inset-0 z-0",
        isDark
          ? "bg-gradient-to-b from-[#1a1a2e] via-[#252541] to-[#2d2d4a]"
          : "bg-gradient-to-b from-[#edf4ff] via-[#e4ebff] to-[#f6f1ff]",
      )}>
        <GridBackground isDark={isDark} />
        <StarField isDark={isDark} />
        <div className={cn(
          "absolute inset-0",
          isDark
            ? "bg-gradient-to-b from-transparent via-transparent to-[#1a1a2e]/50"
            : "bg-gradient-to-b from-white/0 via-white/0 to-white/25",
        )} />
      </div>

      {/* ── Layout ── */}
      <div className="relative z-10 flex h-full flex-col px-6 pb-20 pt-5 sm:px-8 lg:pl-12 lg:pr-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-2.5 flex-shrink-0"
        >
          <p className={cn("mb-0.5 font-mono text-[9px] uppercase tracking-[0.28em]", isDark ? "text-white/38" : "text-slate-500")}>
            About
          </p>
          <h1 className={cn("font-['Caveat'] text-[2rem] leading-[0.92]", isDark ? "text-white/92" : "text-slate-900")}>
            Aaryan Shrivastava{" "}
            <BlinkingKaomoji isDark={isDark} />
          </h1>
        </motion.div>

        {/* 3-column grid */}
        <div className="grid min-h-0 flex-1 gap-3 grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.55fr)_minmax(0,1.3fr)]">

          {/* ══ Col A · Photo ══ */}
          <motion.div variants={colAVariants} initial="hidden" animate="visible" className="min-h-0">
            <GlassCard isDark={isDark} className="h-full min-h-0" innerClassName="p-2 h-full">
              <div className="relative h-full overflow-hidden rounded-[10px]">
                <img
                  src={photos[photoIndex]}
                  alt="Aaryan Shrivastava"
                  className="h-full w-full object-cover object-top"
                />
                {photos.length > 1 && (
                  <>
                    <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                      {photos.map((_, i) => (
                        <button key={i} type="button" onClick={() => setPhotoIndex(i)}
                          aria-label={`Photo ${i + 1}`}
                          className={cn("h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none",
                            i === photoIndex ? "w-5 bg-white" : "w-1.5 bg-white/45")} />
                      ))}
                    </div>
                    <button type="button" onClick={() => setPhotoIndex((photoIndex - 1 + photos.length) % photos.length)}
                      aria-label="Previous photo"
                      className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/50">
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => setPhotoIndex((photoIndex + 1) % photos.length)}
                      aria-label="Next photo"
                      className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/50">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* ══ Col B · Bio + AI/Brain + Tools + Get in touch ══ */}
          <motion.div variants={colBVariants} initial="hidden" animate="visible" className="flex min-h-0 flex-col gap-3">

            {/* Bio — grows to fill available space */}
            <GlassCard
              isDark={isDark}
              className="flex-1 min-h-0"
              innerClassName="p-5 flex flex-col gap-3 h-full"
              lightGradient={LIGHT_GRAD.purple}
            >
              <div className="flex min-h-0 flex-1 flex-col">
                <span className={label}>Who I am</span>
                <div className="mb-3 flex items-center gap-3">
                  <div className="relative h-14 w-14 flex-shrink-0">
                    <AnimatePresence mode="wait">
                      {whoIAmIcons.map((item, i) =>
                        i === whoIAmIndex % whoIAmIcons.length ? (
                          <motion.div key={i}
                            initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.6, rotate: 12 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 flex items-center justify-center rounded-xl"
                            style={{
                              backgroundColor: isDark ? `${item.color}22` : `${item.color}28`,
                              border: `1.5px solid ${item.color}44`,
                            }}>
                            <item.icon className="h-7 w-7" style={{ color: item.color }} />
                          </motion.div>
                        ) : null
                      )}
                    </AnimatePresence>
                  </div>
                  <GooeyText
                    texts={whoIAmTexts}
                    morphTime={1.1}
                    cooldownTime={2.2}
                    onIndexChange={setWhoIAmIndex}
                    className="h-14 flex-1"
                    textClassName={cn("font-['Caveat'] text-[2.8rem] leading-none", isDark ? "text-white/92" : "text-slate-900")}
                  />
                </div>
                <div className={cn("space-y-2.5 text-[0.74rem] leading-[1.6]", isDark ? "text-white/68" : "text-slate-600")}>
                  <p>
                    <span className={cn("font-['Caveat'] text-[1.05rem] leading-snug", isDark ? "text-white" : "text-slate-800")}>Hey, it's lovely to have you here.</span>{" "}I'm a Product Designer based in Dublin, working across eCommerce, SaaS, and data-heavy platforms. I've designed and shipped products end to end, taking ideas from 0 to 1 and turning them into experiences used across everything from dashboards to mobile.
                  </p>
                  <p>
                    I enjoy working in ambiguity where the path isn't obvious and the best ideas come through iteration. With a strong understanding of frontend and backend systems, I design with both creativity and technical realism.
                  </p>
                  <p>
                    I use tools like Claude Code, Figma Make, and Antigravity to move faster, but the fantasy stays human, shaped by instinct, creativity, and the courage to take risks.
                  </p>
                  <blockquote className={cn("border-l-2 pl-3 italic", isDark ? "border-white/20 text-white/40" : "border-slate-300 text-slate-400")}>
                    <p>Imagination is more important than knowledge.</p>
                    <p className="mt-0.5 not-italic text-[0.68rem]">— Albert Einstein</p>
                  </blockquote>
                </div>
              </div>
              <div className="flex-shrink-0">
                <p className={cn("text-[0.74rem] leading-[1.6]", isDark ? "text-white/68" : "text-slate-600")}>
                  <span className={cn("font-['Caveat'] text-[1.05rem] leading-snug", isDark ? "text-white" : "text-slate-800")}>Outside of work,</span>{" "}you will find me Playing an RPG, Going cafe hunting where I can read my book, Watching Football or making sweets from all around the globe.
                </p>
              </div>
            </GlassCard>

            {/* AI / Brain */}
            <div className="flex flex-shrink-0 gap-3">
              <GlassCard isDark={isDark} className="flex-1" innerClassName="p-4" lightGradient={LIGHT_GRAD.peach}>
                <span className={label}>What I leverage AI for</span>
                <div className="flex flex-wrap gap-1.5">
                  {aiItems.map((item) => <span key={item} className={pill}>{item}</span>)}
                </div>
              </GlassCard>
              <GlassCard isDark={isDark} className="flex-1" innerClassName="p-4" lightGradient={LIGHT_GRAD.purple}>
                <span className={label}>What I use my Brain for</span>
                <div className="flex flex-wrap gap-1.5">
                  {brainItems.map((item) => <span key={item} className={pill}>{item}</span>)}
                </div>
              </GlassCard>
            </div>

            {/* Tool stack + Get in touch — side by side at bottom */}
            <div className="flex flex-shrink-0 gap-3">

              {/* Tool stack — half width */}
              <GlassCard isDark={isDark} className="flex-1 min-w-0" innerClassName="overflow-hidden px-4 py-3" lightGradient={LIGHT_GRAD.blue}>
                <span className={label}>Tool stack</span>
                <div className="overflow-hidden">
                  <div className="about-marquee-track flex w-max items-end gap-4">
                    {[...tools, ...tools].map((tool, i) => (
                      <div key={i} className="flex flex-shrink-0 flex-col items-center gap-1">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-md" style={{ backgroundColor: tool.bg }}>
                          <img src={tool.iconUrl} alt={tool.name} className="h-[18px] w-[18px]" />
                        </div>
                        <span className={cn("font-mono text-[8px]", isDark ? "text-white/45" : "text-slate-500")}>{tool.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Get in touch — half width, 2×2 icon grid */}
              <GlassCard isDark={isDark} className="flex-1" innerClassName="px-4 py-3" lightGradient={LIGHT_GRAD.blue}>
                <span className={label}>Get in touch</span>
                <div className="grid grid-cols-2 gap-2">
                  {socialLinks.map(({ label: name, href, accent, icon: Icon }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2"
                    >
                      <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200 group-hover:scale-110"
                        style={{ backgroundColor: `${accent}22`, border: `1.5px solid ${accent}55` }}
                      >
                        <Icon className="h-[15px] w-[15px]" style={{ color: accent }} />
                      </div>
                      <span className={cn("text-[0.62rem] font-mono leading-tight", isDark ? "text-white/50" : "text-slate-500")}>{name}</span>
                    </a>
                  ))}
                </div>
              </GlassCard>

            </div>

          </motion.div>

          {/* ══ Col C · Experience + Currently ══ */}
          <motion.div variants={colCVariants} initial="hidden" animate="visible" className="flex min-h-0 flex-col gap-3">

            {/* Experience */}
            <GlassCard isDark={isDark} className="flex-1 min-h-0" innerClassName="p-5 h-full flex flex-col" lightGradient={LIGHT_GRAD.orange}>
              <span className={label}>Experience</span>

              <motion.div variants={expContainerVariants} initial="hidden" animate="visible" className="flex flex-1 flex-col mb-3">
                {workItems.map((item, i) => (
                  <motion.div key={item.company} variants={expEntryVariants} className={cn("flex", i < workItems.length - 1 ? "flex-1" : "")}>
                    <ExpEntry isDark={isDark} {...item} isLast={i === workItems.length - 1} isCurrent={item.period.includes("Present")} />
                  </motion.div>
                ))}
              </motion.div>

              <span className={cn("mb-2 block font-mono text-[8px] uppercase tracking-[0.28em]", isDark ? "text-white/25" : "text-slate-400")}>
                Education
              </span>

              <motion.div
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.085, delayChildren: 0.85 } } }}
                initial="hidden" animate="visible"
                className="flex flex-col gap-3"
              >
                {educationItems.map((item, i) => (
                  <motion.div key={item.company} variants={expEntryVariants}>
                    <ExpEntry isDark={isDark} {...item} isLast={i === educationItems.length - 1} />
                  </motion.div>
                ))}
              </motion.div>
            </GlassCard>

            {/* Currently — 3 cards with hover overlays */}
            <div className="flex flex-shrink-0 gap-3">
              {currentlyItems.map((item) => (
                <CurrentlyCard key={item.category} isDark={isDark} item={item} />
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
