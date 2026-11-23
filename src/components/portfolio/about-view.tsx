import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Gamepad2, UtensilsCrossed, FileDown, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { CV_URL } from "@/lib/links";
import aaryanPhoto from "@/assets/aaryan-photo.jpg";
import aaryanMobilePhoto from "@/assets/projects/Aaryan_mobile_Image.jpeg";
import { GridBackground } from "@/components/portfolio/grid-background";
import { StarField } from "@/components/portfolio/star-field";
import { LiquidGlassCard } from "@/components/ui/liquid-weather-glass";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

// ── Types ─────────────────────────────────────────────────────────────────────

type AboutViewProps = { isDark: boolean };

type TimelineItem = { role: string; company: string; period: string; location: string };

// ── Data ─────────────────────────────────────────────────────────────────────

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

const workItems: TimelineItem[] = [
  { role: "Product Designer", company: "XARISS Luxury",          period: "Jan 2025 – Present", location: "Dublin" },
  { role: "UI Designer",      company: "Cozmotec",               period: "Aug – Dec 2024",     location: "Dublin" },
  { role: "UX Designer",      company: "Chronic Pain Ireland",   period: "May – Aug 2024",     location: "Dublin" },
  { role: "UX/UI Designer",   company: "Youth India Foundation", period: "Mar – Jul 2022",     location: "Mumbai" },
];

const educationItems: TimelineItem[] = [
  { role: "MSc Human-Computer Interaction", company: "University College Dublin", period: "Sept 2023 – Aug 2024", location: "Dublin" },
  { role: "BE Computer Engineering",        company: "Mumbai University",         period: "Aug 2019 – May 2023",  location: "Mumbai" },
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
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/aaryan-shrivastava1403", accent: "#0A66C2", icon: LinkedinIcon  },
  { label: "Resume",    href: CV_URL, accent: "#8B5CF6", icon: FileDown     },
  { label: "Behance",   href: "https://www.behance.net/aaryanshrivas1", accent: "#1769FF", icon: BehanceIcon  },
  { label: "Calendly",  href: "https://calendly.com/aaryan-shri1403", accent: "#006BFF", icon: CalendarDays },
];

const whoIAmTexts = ["A Product Designer", "A Gamer", "A Tiramisu Expert"];

const whoIAmIcons = [
  { icon: Palette,         color: "#a78bfa" },
  { icon: Gamepad2,        color: "#60a5fa" },
  { icon: UtensilsCrossed, color: "#fb923c" },
];

// ── Motion ───────────────────────────────────────────────────────────────────

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Right-column sections rise in as they scroll into view.
const sectionReveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: EASE_OUT },
};

// ── Blinking kaomoji ──────────────────────────────────────────────────────────

function BlinkingKaomoji({ isDark }: { isDark: boolean }) {
  const [blink, setBlink] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
    <span className={cn("mt-1 text-[15px]", isDark ? "text-white/55" : "text-slate-500")}>
      {"(That's me "}
      <motion.span style={eyeStyle} animate={{ scaleY: blink ? 0.08 : 1 }} transition={{ duration: 0.25, ease: "easeInOut" }}>◕</motion.span>
      ‿
      <motion.span style={eyeStyle} animate={{ scaleY: blink ? 0.08 : 1 }} transition={{ duration: 0.25, ease: "easeInOut" }}>◕</motion.span>
      {")"}
    </span>
  );
}

// ── Timeline ─────────────────────────────────────────────────────────────────

function Timeline({ isDark, items }: { isDark: boolean; items: TimelineItem[] }) {
  return (
    <ol className="relative">
      {/* The rail draws downward as the list scrolls in. */}
      <motion.span
        aria-hidden="true"
        className={cn("absolute bottom-3 left-[5px] top-3 w-px origin-top", isDark ? "bg-white/15" : "bg-slate-300")}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 }}
      />
      {items.map((item, i) => {
        const isCurrent = item.period.includes("Present");
        return (
          <motion.li
            key={item.company}
            className="relative grid grid-cols-1 gap-x-6 pb-8 pl-8 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto]"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 + i * 0.07 }}
          >
            {isCurrent ? (
              <motion.span
                aria-hidden="true"
                className="absolute left-0 top-[9px] h-[11px] w-[11px] rounded-full"
                style={{ background: isDark ? "#facc15" : "#f59e0b" }}
                animate={{ opacity: [1, 0.45, 1], scale: [1, 1.25, 1] }}
                transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
            ) : (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-[9px] h-[11px] w-[11px] rounded-full border-2",
                  isDark ? "border-white/30 bg-[#252541]" : "border-slate-400 bg-white",
                )}
              />
            )}
            <div>
              <p className={cn("text-[1.2rem] font-medium leading-snug tracking-[-0.01em]", isDark ? "text-white" : "text-slate-950")}>
                {item.role}
              </p>
              <p className={cn("mt-1 text-[15px]", isDark ? "text-white/70" : "text-slate-600")}>
                {item.company}
              </p>
            </div>
            <p className={cn(
              "mt-1 text-[14px] tabular-nums sm:mt-1 sm:text-right",
              isDark ? "text-white/55" : "text-slate-500",
            )}>
              {item.period}
              <span className="block">{item.location}</span>
            </p>
          </motion.li>
        );
      })}
    </ol>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function AboutView({ isDark }: AboutViewProps) {
  const [whoIAmIndex, setWhoIAmIndex] = useState(1);

  const bodyText = isDark ? "text-white/75" : "text-slate-700";
  const emphasis = cn("font-semibold", isDark ? "text-white" : "text-slate-900");
  const sectionHeading = cn(
    "mb-8 text-[clamp(1.6rem,2.4vw,2rem)] font-medium leading-none tracking-[-0.02em]",
    isDark ? "text-white" : "text-slate-950",
  );

  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-20 overflow-y-auto",
        isDark
          ? "bg-gradient-to-b from-[#1a1a2e] via-[#252541] to-[#2d2d4a]"
          : "bg-gradient-to-b from-[#edf4ff] via-[#e4ebff] to-[#f6f1ff]",
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      {/* ── Background (fixed so it stays put while the story scrolls) ── */}
      <div className={cn(
        "pointer-events-none fixed inset-0 z-0",
        isDark
          ? "bg-gradient-to-b from-[#1a1a2e] via-[#252541] to-[#2d2d4a]"
          : "bg-gradient-to-b from-[#edf4ff] via-[#e4ebff] to-[#f6f1ff]",
      )}>
        <GridBackground isDark={isDark} />
        <StarField isDark={isDark} />
        <div
          className="absolute inset-0"
          style={isDark ? {
            background: "linear-gradient(to bottom, transparent 0%, transparent 91%, rgba(14, 130, 118, 0.28) 96%, rgba(16, 148, 132, 0.45) 100%)",
          } : {
            background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[84rem] grid-cols-1 lg:grid-cols-[minmax(0,30%)_minmax(0,1fr)]">

        {/* ══ Profile · sticky on desktop ══ */}
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="flex flex-col px-6 pt-10 sm:px-10 lg:sticky lg:top-0 lg:h-dvh lg:self-start lg:pb-24 lg:pl-12 lg:pr-4 lg:pt-6"
        >
          <LiquidGlassCard
            draggable={false}
            blurIntensity="xl"
            shadowIntensity="sm"
            glowIntensity={isDark ? "sm" : "xs"}
            borderRadius="16px"
            className={cn(
              "aspect-[4/5] overflow-hidden p-[5px] shadow-xl sm:aspect-[4/3] lg:aspect-auto lg:min-h-0 lg:flex-1",
              isDark ? "bg-white/[0.06]" : "bg-white/55",
            )}
          >
            {/* The portrait opens from the bottom up: the one authored entrance on this page. */}
            <motion.div
              className="relative h-full overflow-hidden rounded-[12px]"
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.15 }}
            >
              <picture>
                <source media="(min-width: 1024px)" srcSet={aaryanPhoto} />
                <motion.img
                  src={aaryanMobilePhoto}
                  alt="Aaryan Shrivastava"
                  className="h-full w-full object-cover object-center lg:object-[center_80%]"
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.15 }}
                />
              </picture>
            </motion.div>
          </LiquidGlassCard>

          <h1 className={cn("mt-6 text-[2.25rem] font-medium leading-[1.05] tracking-[-0.03em] lg:text-[2rem]", isDark ? "text-white" : "text-slate-950")}>
            Aaryan Shrivastava
          </h1>
          <BlinkingKaomoji isDark={isDark} />

          <div className="mt-4 flex items-center gap-3">
            <div className="relative h-11 w-11 flex-shrink-0">
              <AnimatePresence mode="wait">
                {whoIAmIcons.map((item, i) =>
                  i === whoIAmIndex % whoIAmIcons.length ? (
                    <motion.div key={i}
                      initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.6, rotate: 12 }}
                      transition={{ duration: 0.4, ease: EASE_OUT }}
                      className="absolute inset-0 flex items-center justify-center rounded-xl"
                      style={{ backgroundColor: isDark ? `${item.color}22` : `${item.color}28`, border: `1.5px solid ${item.color}44` }}>
                      <item.icon className="h-5 w-5" style={{ color: item.color }} />
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>
            </div>
            <GooeyText
              texts={whoIAmTexts} morphTime={1.1} cooldownTime={2.2} onIndexChange={setWhoIAmIndex}
              className="h-11 flex-1"
              textClassName={cn(
                // GooeyText centres by default; pin the words next to their icon.
                "left-0 text-left font-['Caveat'] text-[2rem] leading-none",
                isDark ? "text-white/92" : "text-slate-900",
              )}
            />
          </div>

          <nav aria-label="Get in touch" className="mt-6 grid grid-cols-2 gap-2">
            {socialLinks.map(({ label: name, href, accent, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex min-h-11 items-center gap-2.5 rounded-xl border px-2.5 py-1.5 backdrop-blur-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2",
                  isDark
                    ? "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.08] focus-visible:ring-white/40"
                    : "border-slate-900/10 bg-white/55 hover:border-slate-900/20 hover:bg-white/80 focus-visible:ring-slate-900/25",
                )}
              >
                <span
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: `${accent}22`, border: `1.5px solid ${accent}55` }}
                >
                  <Icon className="h-[15px] w-[15px]" style={{ color: accent }} />
                </span>
                <span className={cn("text-[0.85rem]", isDark ? "text-white/80" : "text-slate-700")}>{name}</span>
              </a>
            ))}
          </nav>
        </motion.aside>

        {/* ══ Story · scrolls ══ */}
        <main className="px-6 pb-36 pt-16 sm:px-10 lg:pb-40 lg:pl-16 lg:pr-12 lg:pt-24">
          <div className="max-w-[40rem]">

            <motion.section {...sectionReveal} transition={{ ...sectionReveal.transition, delay: 0.25 }} aria-label="About me">
              <p className={cn("text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance", isDark ? "text-white" : "text-slate-950")}>
                Hey, it’s <span className="mr-[0.08em] inline-block font-['Caveat'] text-[1.2em] font-semibold leading-none tracking-normal text-[#ff9a62]">lovely</span> to have you here.
              </p>
              <div className={cn("mt-8 space-y-5 text-[17px] leading-[1.65]", bodyText)}>
                <p>
                  I’m a product designer based in Dublin, with <strong className={emphasis}>three years of experience</strong> across luxury, SaaS and data-heavy platforms. I’ve designed and shipped products end to end, taking ideas from a blank page to working software, from partner dashboards to mobile apps. At XARISS, a luxury concierge platform, I rebuilt a partner dashboard that <strong className={emphasis}>cut decision time from over 30 minutes to under 10</strong>, and I now <strong className={emphasis}>build the front end myself in code</strong>.
                </p>
                <p>
                  I do my <strong className={emphasis}>best work in ambiguity</strong>, where the path isn’t obvious and the best ideas come through iteration. I use tools like Claude Code, Figma Make and Antigravity to move faster, but the vision stays human, shaped by instinct, creativity and the courage to take risks.
                </p>
              </div>

              <figure className="my-12">
                <blockquote className={cn("font-['Caveat'] text-[2rem] leading-[1.15]", isDark ? "text-white/85" : "text-slate-800")}>
                  “Imagination is more important than knowledge.”
                </blockquote>
                <figcaption className={cn("mt-2 font-mono text-[12px]", isDark ? "text-white/55" : "text-slate-500")}>
                  Albert Einstein
                </figcaption>
              </figure>

              <p className={cn("text-[17px] leading-[1.65]", bodyText)}>
                <strong className={emphasis}>Outside of work,</strong>{" "}you will find me playing an RPG, going cafe hunting where I can read my book, watching football or making sweets from all around the globe.
              </p>
            </motion.section>

            <motion.section {...sectionReveal} className="mt-24" aria-labelledby="about-experience">
              <h2 id="about-experience" className={sectionHeading}>Experience</h2>
              <Timeline isDark={isDark} items={workItems} />
            </motion.section>

            <motion.section {...sectionReveal} className="mt-20" aria-labelledby="about-education">
              <h2 id="about-education" className={sectionHeading}>Education</h2>
              <Timeline isDark={isDark} items={educationItems} />
            </motion.section>

            <motion.section {...sectionReveal} className="mt-20" aria-labelledby="about-tools">
              <h2 id="about-tools" className={sectionHeading}>Tools I work with</h2>
              <ul className="flex flex-wrap gap-x-5 gap-y-4">
                {tools.map((tool) => (
                  <li key={tool.name} className="flex flex-col items-center gap-1.5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl shadow-md" style={{ backgroundColor: tool.bg }}>
                      <img src={tool.iconUrl} alt="" loading="lazy" decoding="async" className="h-5 w-5" />
                    </span>
                    <span className={cn("text-[12px]", isDark ? "text-white/60" : "text-slate-500")}>{tool.name}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

          </div>
        </main>
      </div>
    </motion.div>
  );
}
