import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { CV_URL } from "@/lib/links";
import { PillButton, ScrubIn, ScrubWords } from "@/components/portfolio/home-motion";
import utsCover from "@/assets/projects/Shots UTS.jpeg";
import memberCover from "@/assets/projects/Shots Member Login.jpeg";

const LINKEDIN_URL = "https://www.linkedin.com/in/aaryan-shrivastava1403";
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

type HomeViewProps = {
  isDark: boolean;
  isPlaying: boolean;
  dublinTime: string;
  mumbaiTime: string;
  email: string;
  onTogglePlayback: () => void;
  onCopyEmail: () => void;
  onOpenCaseStudy: (slug: string) => void;
};

/* ── Small pieces ─────────────────────────────────────────────────────────── */

function useTone(isDark: boolean) {
  return {
    strong: isDark ? "text-white" : "text-slate-950",
    body: isDark ? "text-white/72" : "text-slate-700",
    muted: isDark ? "text-white/55" : "text-slate-500",
    rule: isDark ? "border-white/12" : "border-slate-900/10",
  };
}

/** Plays only while on screen; with reduced motion it stays on its poster. */
function LoopVideo({ src, poster, label, className }: { src: string; poster: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reduceMotion) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className={className}
    />
  );
}

function MusicToggle({ isDark, isPlaying, onToggle }: { isDark: boolean; isPlaying: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isPlaying ? "Pause Cosmic Music" : "Play Cosmic Music"}
      className={cn(
        "flex min-h-10 items-center gap-2.5 rounded-full border px-3.5 text-[13px] backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2",
        isDark
          ? "border-white/14 bg-white/[0.06] text-white/75 hover:bg-white/10 focus-visible:ring-white/40"
          : "border-slate-900/10 bg-white/60 text-slate-600 hover:bg-white/90 focus-visible:ring-slate-900/20",
      )}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-blue-300">
        {isPlaying ? (
          <Pause className="h-2.5 w-2.5 text-orange-500" />
        ) : (
          <Play className="ml-[1px] h-2.5 w-2.5 fill-orange-500 text-orange-500" />
        )}
      </span>
      Cosmic Music
    </button>
  );
}

/* ── Work rows ────────────────────────────────────────────────────────────── */

type FeatureProps = {
  isDark: boolean;
  headline: string;
  meta: string;
  body: ReactNode;
  cta: string;
  onOpen: () => void;
  media: ReactNode;
  glow: string;
  reverse?: boolean;
};

function FeatureRow({ isDark, headline, meta, body, cta, onOpen, media, glow, reverse }: FeatureProps) {
  const tone = useTone(isDark);
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // 0 = row just entering at the bottom, 1 = row just leaving at the top.
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const frame = [0, 0.38, 0.68, 1];
  const scale = useTransform(p, frame, [0.84, 1, 1, 0.93]);
  const rotateX = useTransform(p, frame, [18, 0, 0, -7]);
  const insetY = useTransform(p, frame, [16, 0, 0, 4]);
  const insetX = useTransform(p, frame, [9, 0, 0, 2]);
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round 20px)`;
  const mediaOpacity = useTransform(p, [0, 0.3, 0.82, 1], [0.25, 1, 1, 0.45]);
  const innerScale = useTransform(p, [0, 0.45], [1.16, 1]);
  const glowOpacity = useTransform(p, [0.2, 0.45, 0.7], [0, 0.9, 0.35]);
  const textY = useTransform(p, [0.04, 0.42, 0.72, 1], [110, 0, 0, -50]);
  const textOpacity = useTransform(p, [0.06, 0.36, 0.84, 1], [0, 1, 1, 0.2]);

  return (
    <article ref={ref} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <motion.button
        type="button"
        onClick={onOpen}
        aria-label={`${cta}: ${headline}`}
        style={reduceMotion ? undefined : { scale, rotateX, clipPath, opacity: mediaOpacity, transformPerspective: 1400 }}
        className={cn(
          "group relative block w-full cursor-pointer overflow-hidden rounded-[20px] border text-left will-change-transform focus-visible:outline-none focus-visible:ring-2 lg:col-span-7",
          isDark ? "border-white/12 bg-white/[0.04] focus-visible:ring-white/50" : "border-slate-900/10 bg-white/60 focus-visible:ring-slate-900/30",
          reverse && "lg:order-2",
        )}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(70% 60% at 50% 100%, rgba(${glow},${isDark ? 0.36 : 0.24}), transparent 70%)`,
            opacity: reduceMotion ? 0.75 : glowOpacity,
          }}
        />
        <motion.div className="relative" style={reduceMotion ? undefined : { scale: innerScale }}>
          <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]">{media}</div>
        </motion.div>
      </motion.button>

      <motion.div
        style={reduceMotion ? undefined : { y: textY, opacity: textOpacity }}
        className={cn("lg:col-span-5", reverse && "lg:order-1")}
      >
        <h3 className={cn("text-balance text-[clamp(1.85rem,3vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.025em]", tone.strong)}>
          {headline}
        </h3>
        <p className={cn("mt-4 text-[15px]", tone.muted)}>{meta}</p>
        <p className={cn("mt-5 max-w-[34rem] text-[17px] leading-[1.6]", tone.body)}>{body}</p>
        <PillButton isDark={isDark} variant="outline" icon={ArrowRight} onClick={onOpen} className="mt-7">
          {cta}
        </PillButton>
      </motion.div>
    </article>
  );
}

function phoneFrame(isDark: boolean) {
  return cn(
    "overflow-hidden rounded-[2rem] border-[5px] shadow-[0_30px_70px_-24px_rgba(0,0,0,0.6)]",
    isDark ? "border-[#0e0e1a]" : "border-slate-900",
  );
}

function SidePhone({
  isDark,
  src,
  alt,
  side,
  spread,
  opacity,
}: {
  isDark: boolean;
  src: string;
  alt: string;
  side: "left" | "right";
  spread: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  const sign = side === "left" ? 1 : -1;
  // spread 1 = tucked behind the centre phone, 0 = fanned out into place.
  const x = useTransform(spread, (s) => `${s * 70 * sign}%`);
  const rotate = useTransform(spread, [1, 0], [0, -6 * sign]);
  return (
    <motion.div
      className={cn("relative z-0 hidden h-[80%] sm:block", side === "left" ? "-mr-[3%]" : "-ml-[3%]")}
      style={reduceMotion ? { rotate: -6 * sign, y: "5%" } : { x, y: "5%", rotate, opacity }}
    >
      <div className={cn(phoneFrame(isDark), "h-full")}>
        <img src={src} alt={alt} loading="lazy" decoding="async" className="aspect-[516/1120] h-full w-auto object-cover" />
      </div>
    </motion.div>
  );
}

/** The live app in the middle, with two real screens fanning out from behind it as the row scrolls in. */
function CpiTrio({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "center 45%"] });
  const spread = useTransform(p, [0.25, 1], [1, 0]);
  const sideOpacity = useTransform(p, [0.25, 0.7], [0, 1]);

  return (
    <div
      ref={ref}
      className="relative flex aspect-[4/5] items-center justify-center gap-[6%] p-6 sm:aspect-[1280/800]"
      style={{
        // A lavender stage taken from the app's own purple, so the phones sit on a surface instead of floating in the sky.
        background: isDark
          ? "radial-gradient(80% 70% at 50% 38%, #5b4a8a 0%, #3a2f5e 48%, #241c3d 100%)"
          : "radial-gradient(80% 70% at 50% 38%, #f3eeff 0%, #e2d8fa 55%, #cfc0f2 100%)",
      }}
    >
      <SidePhone isDark={isDark} side="left" spread={spread} opacity={sideOpacity} src="/home/cpi-stats.jpg" alt="Stats: a month calendar charting pain across the days" />
      <div className={cn(phoneFrame(isDark), "relative z-10 h-full max-h-[34rem]")}>
        <LoopVideo
          src="/home/cpi-loop.mp4"
          poster="/home/cpi-loop.jpg"
          label="Chronic Pain Ireland app in use"
          className="aspect-[516/1120] h-full w-auto object-cover"
        />
      </div>
      <SidePhone isDark={isDark} side="right" spread={spread} opacity={sideOpacity} src="/home/cpi-mood.jpg" alt="Daily check-in: rate your mood, scale your pain, log a flare-up" />
    </div>
  );
}

type MoreWorkProps = {
  isDark: boolean;
  image: string;
  headline: string;
  meta: string;
  onOpen: () => void;
  external?: boolean;
  delay?: number;
};

function MoreWorkCard({ isDark, image, headline, meta, onOpen, external, delay = 0 }: MoreWorkProps) {
  const tone = useTone(isDark);
  const reduceMotion = useReducedMotion();
  const Icon = external ? ArrowUpRight : ArrowRight;
  const ref = useRef<HTMLButtonElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // `delay` staggers the second card by shifting its scroll window, not its clock.
  const y = useTransform(p, [0, 0.42 + delay], [120, 0]);
  const opacity = useTransform(p, [0, 0.32 + delay, 0.9, 1], [0, 1, 1, 0.4]);
  const imageScale = useTransform(p, [0, 0.5 + delay], [1.22, 1]);
  const imageY = useTransform(p, [0, 1], ["-6%", "6%"]);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onOpen}
      style={reduceMotion ? undefined : { y, opacity }}
      className="group block w-full cursor-pointer text-left focus-visible:outline-none"
    >
      <div
        className={cn(
          "overflow-hidden rounded-[18px] border group-focus-visible:ring-2",
          isDark ? "border-white/12 group-focus-visible:ring-white/50" : "border-slate-900/10 group-focus-visible:ring-slate-900/30",
        )}
      >
        <motion.div style={reduceMotion ? undefined : { scale: imageScale, y: imageY }}>
          <img
            src={image}
            alt=""
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </motion.div>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className={cn("text-balance text-[1.4rem] font-medium leading-[1.2] tracking-[-0.015em]", tone.strong)}>{headline}</h3>
          <p className={cn("mt-2 text-[15px]", tone.muted)}>{meta}</p>
        </div>
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
            isDark ? "border-white/15 text-white/60 group-hover:border-white group-hover:bg-white group-hover:text-[#1a1a2e]" : "border-slate-900/15 text-slate-500 group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white",
          )}
        >
          <Icon className={cn("h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]", external ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : "group-hover:translate-x-0.5")} />
        </span>
      </div>
    </motion.button>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

const strengths = [
  {
    claim: "Complex B2B tools, made calm.",
    proof: "At XARISS I designed one dashboard for two user roles across 48 luxury brands, so store managers get from raw data to a decision in under 10 minutes.",
  },
  {
    claim: "Research that reaches real people.",
    proof: "The Chronic Pain Ireland app came out of 30+ academic papers, focus groups and a 27-person workshop. It's now used by 1,000+ people.",
  },
  {
    claim: "Design that ships as code.",
    proof: "I build the front end of what I design myself, including the site you're reading now.",
  },
];

const scaleStories = [
  {
    who: "Starting from a blank page",
    promise: "I take a product from a blank page to a structure that won't need rebuilding at the next stage.",
    story: "At XARISS, I turned an 80-page document into a brand, a platform and a partner system. I structured it around what customers are looking for, so it can grow from 50 partners to 1,000 without a redesign. The designs helped secure two years of funding.",
    metrics: [
      { value: "80 pages", label: "into a brand, platform and partner system" },
      { value: "50 → 1,000", label: "partners, without a redesign" },
      { value: "2 years", label: "of funding the designs helped secure" },
    ],
  },
  {
    who: "Growing without breaking",
    promise: "I make room for new features and scope without breaking what users already rely on.",
    story: "At Cozmotec, I rebuilt a recruitment platform's information architecture so users reached key data in 3 clicks instead of 7, and retention rose by 50%.",
    metrics: [
      { value: "7 → 3", label: "clicks to reach key data" },
      { value: "+50%", label: "user retention" },
    ],
  },
];

const growthVectors = ["devices", "features", "data", "people using it"];

export function HomeView({
  isDark,
  isPlaying,
  dublinTime,
  mumbaiTime,
  email,
  onTogglePlayback,
  onCopyEmail,
  onOpenCaseStudy,
}: HomeViewProps) {
  const tone = useTone(isDark);
  const reduceMotion = useReducedMotion();

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { y: "105%" },
          animate: { y: "0%" },
          transition: { duration: 1.05, ease: EASE_OUT, delay },
        };
  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE_OUT, delay },
        };

  // Leaving the hero, the headline drifts up and blurs into the sky; scrolling back brings it home.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: h } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const headY = useTransform(h, [0, 1], [0, -180]);
  // Fade and blur share one filter so they can never drift apart.
  const headFade = useTransform(h, [0, 0.6], [1, 0]);
  const headBlurPx = useTransform(h, [0.08, 0.6], [0, 9]);
  const headFilter = useMotionTemplate`blur(${headBlurPx}px) opacity(${headFade})`;
  const headScale = useTransform(h, [0, 1], [1, 0.94]);
  const subY = useTransform(h, [0, 1], [0, -110]);
  const subOpacity = useTransform(h, [0, 0.45], [1, 0]);
  const proofY = useTransform(h, [0, 1], [0, -60]);
  const proofOpacity = useTransform(h, [0.35, 0.85], [1, 0]);

  const proof = [
    { value: "48", label: "luxury brands onboarded onto the XARISS partner dashboard" },
    { value: "<10 min", label: "for store managers to reach a decision, down from 30+" },
    { value: "1,000+", label: "people using the Chronic Pain Ireland app" },
  ];

  return (
    <div className="relative z-10">
      {/* ── Hero: the night sky stays fully visible here ── */}
      <section ref={heroRef} className="relative flex min-h-dvh flex-col">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-[18rem] h-[calc(38%+18rem)]"
          style={{
            background: isDark
              ? "linear-gradient(to bottom, transparent 0%, rgba(14,130,118,0.18) 45%, rgba(16,148,132,0.34) 62%, rgba(16,148,132,0.12) 82%, transparent 100%)"
              : "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.35) 60%, transparent 100%)",
          }}
        />

        <motion.header {...fadeUp(0.05)} className="relative mx-auto flex w-full max-w-[84rem] items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
          <span className={cn("text-[15px] font-medium tracking-[-0.01em]", tone.strong)}>Aaryan Shrivastava</span>
          <div className="flex items-center gap-4">
            <span className={cn("hidden text-[14px] tabular-nums sm:inline", tone.muted)}>{dublinTime} in Dublin</span>
            <MusicToggle isDark={isDark} isPlaying={isPlaying} onToggle={onTogglePlayback} />
          </div>
        </motion.header>

        <div className="relative mx-auto flex w-full max-w-[84rem] flex-1 flex-col justify-center px-6 pb-10 pt-16 sm:px-10 sm:pt-20">
          <motion.div style={reduceMotion ? undefined : { y: headY, filter: headFilter, scale: headScale, transformOrigin: "0% 50%" }}>
          <h1 className={cn("text-[clamp(2.6rem,5.4vw,5.1rem)] font-medium leading-[1.04] tracking-[-0.035em]", tone.strong)}>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span {...rise(0.15)} className="block text-balance">Three years of designing products.</motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.14em]">
              <motion.span {...rise(0.28)} className="block text-balance">
                Now I{" "}
                <span className="relative mr-[0.1em] inline-block">
                  <span className="font-['Caveat'] text-[1.2em] font-semibold leading-none tracking-normal text-[#ff9a62]">build</span>
                  <svg aria-hidden="true" viewBox="0 0 200 16" preserveAspectRatio="none" className="absolute -bottom-[0.08em] left-[-4%] h-[0.16em] w-[108%] overflow-visible">
                    <motion.path
                      d="M3 11 C 50 4, 120 3, 197 8"
                      fill="none"
                      stroke="#ff8a4c"
                      strokeWidth="5"
                      strokeLinecap="round"
                      initial={reduceMotion ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: EASE_OUT, delay: 1.05 }}
                    />
                  </svg>
                </span>{" "}
                them too.
              </motion.span>
            </span>
          </h1>
          </motion.div>

          <motion.div style={reduceMotion ? undefined : { y: subY, opacity: subOpacity }}>
          <motion.p {...fadeUp(0.6)} className={cn("mt-8 max-w-[40rem] text-[clamp(1.1rem,1.6vw,1.35rem)] leading-[1.55]", tone.body)}>
            Product designer at <span className={tone.strong}>XARISS</span>, designing a luxury concierge platform and the intelligence platform behind it, and shipping the front end myself in code.
          </motion.p>
          <motion.p {...fadeUp(0.7)} className={cn("mt-3 text-[15px]", tone.muted)}>
            Based in Dublin. Previously at Chronic Pain Ireland and Cozmotec.
          </motion.p>

          <motion.div {...fadeUp(0.8)} className="mt-10 flex flex-wrap items-center gap-3">
            <PillButton isDark={isDark} variant="solid" size="lg" icon={ArrowDown} arrow="down" href="#work">
              See my work
            </PillButton>
            <PillButton isDark={isDark} variant="outline" size="lg" icon={ArrowUpRight} arrow="diagonal" href={CV_URL} external>
              View my CV
            </PillButton>
            <PillButton isDark={isDark} variant="outline" size="lg" onClick={onCopyEmail}>
              Copy email
            </PillButton>
          </motion.div>
          </motion.div>
        </div>

        <motion.div style={reduceMotion ? undefined : { y: proofY, opacity: proofOpacity }} className="relative">
        <motion.dl {...fadeUp(0.95)} className={cn("relative mx-auto grid w-full max-w-[84rem] gap-8 border-t px-6 pb-28 pt-7 sm:grid-cols-3 sm:gap-10 sm:px-10 sm:pb-32", tone.rule)}>
          {proof.map((item) => (
            <div key={item.value}>
              <dt className={cn("shrink-0 text-[clamp(2rem,3.4vw,3rem)] font-medium leading-none tracking-[-0.03em] tabular-nums", tone.strong)}>{item.value}</dt>
              <dd className={cn("mt-2 max-w-[17rem] text-[15px] leading-[1.45] sm:mt-3", tone.muted)}>{item.label}</dd>
            </div>
          ))}
        </motion.dl>
        </motion.div>
      </section>

      {/* ── Below the hero the sky dims, but its stars and grid stay faintly visible behind the work ── */}
      <div
        className="relative"
        style={{
          background: isDark
            ? "linear-gradient(to bottom, rgba(26,26,46,0) 0, rgba(26,26,46,0.5) 18rem, rgba(30,30,52,0.55) 100%)"
            : "linear-gradient(to bottom, rgba(238,244,255,0) 0, rgba(238,244,255,0.55) 18rem, rgba(244,240,255,0.6) 100%)",
        }}
      >
        <section id="work" className="mx-auto w-full max-w-[84rem] scroll-mt-6 px-6 pt-24 sm:px-10 sm:pt-32">
          <ScrubIn>
            <h2 className={cn("text-[clamp(2.25rem,4vw,3.5rem)] font-medium tracking-[-0.03em]", tone.strong)}>
              <ScrubWords text="Selected work" from={0} lift offset={["start 96%", "start 66%"]} />
            </h2>
          </ScrubIn>

          <div className="mt-14 flex flex-col gap-24 sm:mt-20 sm:gap-36">
            <FeatureRow
              isDark={isDark}
              headline="Cut partner decision time from 30+ minutes to under 10."
              meta="XARISS Partner Dashboard · B2B SaaS · 2026"
              body={<>A CRM for luxury brands to manage listings, track bookings and act on performance data, designed end to end for two user roles. <span className={tone.strong}>48 brands</span> are onboarded.</>}
              cta="Read the case study"
              onOpen={() => onOpenCaseStudy("xariss")}
              glow="55,132,255"
              media={
                <div className="p-3 sm:p-5">
                  <LoopVideo
                    src="/home/xariss-loop.mp4"
                    poster="/home/xariss-loop.jpg"
                    label="XARISS partner dashboard in use"
                    className="aspect-[1280/728] w-full rounded-[12px] object-cover shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]"
                  />
                </div>
              }
            />

            <FeatureRow
              isDark={isDark}
              reverse
              headline="A pain-management app now used by 1,000+ people."
              meta="Chronic Pain Ireland · Mobile app · 2024"
              body={<>Built on <span className={tone.strong}>30+ academic papers</span>, focus groups and a <span className={tone.strong}>27-person workshop</span>, so every screen traces back to what people living with chronic pain actually need.</>}
              cta="Read the case study"
              onOpen={() => onOpenCaseStudy("paceyourself")}
              glow="154,126,214"
              media={
                <CpiTrio isDark={isDark} />
              }
            />
          </div>

          <div className="mt-24 sm:mt-36">
            <ScrubIn distance={36}>
              <h2 className={cn("text-[clamp(1.6rem,2.4vw,2rem)] font-medium tracking-[-0.02em]", tone.strong)}>More work</h2>
            </ScrubIn>
            <div className="mt-8 grid gap-12 sm:grid-cols-2 sm:gap-8">
              <MoreWorkCard
                isDark={isDark}
                image={utsCover}
                headline="Rethinking ticket booking for Mumbai's daily commuters"
                meta="UTS App Redesign · Mobile · 2022"
                external
                onOpen={() => window.open("https://www.behance.net/gallery/206497141/UTS-Reimagined", "_blank", "noopener,noreferrer")}
              />
              <MoreWorkCard
                isDark={isDark}
                image={memberCover}
                headline="A member login portal with a seamless onboarding flow"
                meta="Member Login Portal · Web · 2022"
                delay={0.08}
                onOpen={() => onOpenCaseStudy("yifloginportal")}
              />
            </div>
          </div>
        </section>

        {/* ── Built to scale ── */}
        <section aria-labelledby="built-to-scale" className="mx-auto w-full max-w-[84rem] px-6 pt-32 sm:px-10 sm:pt-44">
          <ScrubIn>
            <h2 id="built-to-scale" className={cn("text-[clamp(2.25rem,4vw,3.5rem)] font-medium tracking-[-0.03em]", tone.strong)}>
              <ScrubWords
                text="Built to Scale"
                from={0}
                lift
                offset={["start 96%", "start 66%"]}
                accent={{ word: "Scale", className: "font-['Caveat'] text-[1.2em] font-semibold leading-none tracking-normal text-[#ff9a62]" }}
              />
            </h2>
          </ScrubIn>

          {/* The thesis: the first line sets up, the second lands. */}
          <p className="mt-12 max-w-[60rem] text-balance text-[clamp(2rem,4.4vw,4rem)] font-medium leading-[1.06] tracking-[-0.035em]">
            <span className={isDark ? "text-white/65" : "text-slate-600"}>
              <ScrubWords text="Most products don't break at launch." from={0.12} offset={["start 92%", "start 60%"]} />
            </span>{" "}
            <span className={tone.strong}>
              <ScrubWords text="They break when the business grows." from={0.12} offset={["start 84%", "start 50%"]} />
            </span>
          </p>

          <ScrubIn className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-14">
            <p className={cn("text-[clamp(1.35rem,2vw,1.6rem)] font-medium leading-[1.25] tracking-[-0.015em] lg:col-span-4", tone.strong)}>
              I design for that moment.
            </p>
            <div className="lg:col-span-8">
              <p className={cn("max-w-[42rem] text-[17px] leading-[1.65]", tone.body)}>
                I turn user pain points into clear business requirements, then plan the information architecture and the build around where the product will be in the next few quarters:
              </p>
              <ul aria-label="What the product grows into" className="mt-6 flex flex-wrap gap-2.5">
                {growthVectors.map((item) => (
                  <li
                    key={item}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[15px]",
                      isDark ? "border-white/15 bg-white/[0.04] text-white/85" : "border-slate-900/12 bg-white/60 text-slate-800",
                    )}
                  >
                    <span aria-hidden="true" className="font-medium text-[#ff9a62]">+</span>
                    more {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrubIn>

          <div className="mt-20 grid gap-16 sm:mt-24 lg:grid-cols-2 lg:gap-14">
            {scaleStories.map((story, index) => (
              <ScrubIn key={story.who} offset={["start 98%", index ? "start 58%" : "start 62%"]}>
                <article className={cn("flex h-full flex-col border-t pt-8", isDark ? "border-white/20" : "border-slate-900/15")}>
                  <h3 className={cn("text-balance text-[clamp(1.6rem,2.4vw,2.1rem)] font-medium leading-[1.12] tracking-[-0.02em]", tone.strong)}>
                    {story.who}
                  </h3>
                  <p className={cn("mt-4 max-w-[34rem] text-[clamp(1.1rem,1.4vw,1.25rem)] leading-[1.5]", isDark ? "text-white/85" : "text-slate-800")}>
                    {story.promise}
                  </p>
                  <p className={cn("mt-4 max-w-[34rem] text-[16px] leading-[1.65]", tone.muted)}>{story.story}</p>
                  {/* A ledger, not a row: each number gets its own line, so three never fight for one column's width. */}
                  <dl className="mt-auto pt-10">
                    {story.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className={cn("flex flex-col gap-1.5 border-t py-4 sm:flex-row sm:items-baseline sm:gap-6", isDark ? "border-white/10" : "border-slate-900/10")}
                      >
                        <dt className={cn("text-[15px] leading-[1.4]", tone.muted)}>{metric.label}</dt>
                        <dd className={cn("whitespace-nowrap text-[clamp(1.75rem,2.3vw,2.25rem)] font-medium leading-none tracking-[-0.03em] tabular-nums order-first sm:w-[11.5rem] sm:shrink-0", tone.strong)}>
                          {metric.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>
              </ScrubIn>
            ))}
          </div>

          <ScrubIn distance={32} className="mt-16 sm:mt-20">
            <p className={cn("text-[clamp(1.1rem,1.6vw,1.3rem)]", tone.muted)}>
              Proven across{" "}
              <span className={tone.strong}>B2B</span>,{" "}
              <span className={tone.strong}>SaaS</span> and{" "}
              <span className={tone.strong}>B2C e-commerce</span>.
            </p>
          </ScrubIn>
        </section>

        {/* ── What I do best ── */}
        <section className="mx-auto w-full max-w-[84rem] px-6 pt-32 sm:px-10 sm:pt-44">
          <ScrubIn>
            <h2 className={cn("text-[clamp(2.25rem,4vw,3.5rem)] font-medium tracking-[-0.03em]", tone.strong)}>
              <ScrubWords text="What I do best" from={0} lift offset={["start 96%", "start 66%"]} />
            </h2>
          </ScrubIn>
          <ul className="mt-12">
            {strengths.map((item, index) => (
              <li
                key={item.claim}
                className={cn("grid gap-3 border-t py-9 lg:grid-cols-12 lg:gap-14", tone.rule, index === strengths.length - 1 && "border-b")}
              >
                <p className={cn("text-[clamp(1.6rem,2.6vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.02em] lg:col-span-6", tone.strong)}>
                  <ScrubWords text={item.claim} offset={["start 92%", "start 58%"]} />
                </p>
                <p className={cn("max-w-[36rem] text-[17px] leading-[1.6] lg:col-span-6 lg:pt-1.5", tone.body)}>
                  <ScrubWords text={item.proof} from={0.22} offset={["start 88%", "start 50%"]} />
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Contact ── */}
        <footer className="mx-auto w-full max-w-[84rem] px-6 pb-36 pt-32 sm:px-10 sm:pt-44">
          <h2 className={cn("text-balance text-[clamp(2.75rem,7vw,6rem)] font-medium leading-[1] tracking-[-0.04em]", tone.strong)}>
            <ScrubWords text="Let's build something together." from={0} lift offset={["start 100%", "start 58%"]} />
          </h2>
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <a
              href={`mailto:${email}`}
              className={cn(
                "relative break-all pb-1 text-[clamp(1.2rem,2.2vw,1.75rem)] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-100 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] before:absolute before:inset-x-0 before:bottom-0 before:h-[2px] before:origin-left before:scale-x-0 before:bg-[#ff8a4c] before:transition-transform before:delay-100 before:duration-500 before:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:scale-x-0 hover:before:scale-x-100",
                isDark ? "text-white after:bg-white/30" : "text-slate-900 after:bg-slate-900/25",
              )}
            >
              {email}
            </a>
            <div className="flex flex-wrap gap-3">
              <PillButton isDark={isDark} variant="solid" onClick={onCopyEmail}>
                Copy email
              </PillButton>
              <PillButton isDark={isDark} variant="outline" icon={ArrowUpRight} arrow="diagonal" href={LINKEDIN_URL} external>
                LinkedIn
              </PillButton>
              <PillButton isDark={isDark} variant="outline" icon={ArrowUpRight} arrow="diagonal" href={CV_URL} external>
                CV
              </PillButton>
            </div>
          </div>

          <div className={cn("mt-20 flex flex-col gap-3 border-t pt-7 text-[14px] sm:flex-row sm:items-center sm:justify-between", tone.rule, tone.muted)}>
            <span className="tabular-nums">{dublinTime} in Dublin · {mumbaiTime} in Mumbai</span>
            <span aria-hidden="true">(⁰▿⁰)◜✧˖°</span>
            <span>© 2026 Aaryan Shrivastava</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
