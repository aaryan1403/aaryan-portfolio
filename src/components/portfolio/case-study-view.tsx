import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, Image as ImageIcon, Play, Volume2, VolumeX, Maximize2, X, Check, Users, Target, Lightbulb, Layers, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { GridBackground } from "@/components/portfolio/grid-background";
import { StarField } from "@/components/portfolio/star-field";
import {
  type ContentBlock,
  type CaseStudySection,
  getCaseStudyBySlug,
} from "@/data/case-studies";

// ─── Props ───────────────────────────────────────────────────────────────────

type CaseStudyViewProps = {
  slug: string;
  isDark: boolean;
  onClose: () => void;
};

// ─── Light mode palette (matches about-view LIGHT_GRAD) ──────────────────────

const LIGHT_SECTION_COLORS = [
  { bg: "radial-gradient(circle at 20% 20%, rgba(55,132,255,0.10), transparent 50%), linear-gradient(135deg,#eaf5ff,#d1e5ff)", border: "rgba(55,132,255,0.18)" },
  { bg: "radial-gradient(circle at 80% 20%, rgba(154,126,214,0.12), transparent 50%), linear-gradient(135deg,#f3efff,#ebe3ff)", border: "rgba(154,126,214,0.18)" },
  { bg: "radial-gradient(circle at 20% 80%, rgba(55,132,255,0.08), transparent 50%), linear-gradient(135deg,#e6eeff,#eaf5ff)", border: "rgba(55,132,255,0.15)" },
  { bg: "radial-gradient(circle at 80% 80%, rgba(154,126,214,0.10), transparent 50%), linear-gradient(135deg,#f6f0ff,#ebe3ff)", border: "rgba(154,126,214,0.15)" },
  { bg: "radial-gradient(circle at 50% 20%, rgba(55,132,255,0.09), transparent 50%), linear-gradient(135deg,#edf4ff,#d8e8ff)", border: "rgba(55,132,255,0.14)" },
];

// ─── Placeholder Image ────────────────────────────────────────────────────────

function PlaceholderImage({
  label,
  caption,
  accentColor,
  src,
}: {
  label: string;
  caption?: string;
  accentColor: string;
  src?: string;
}) {
  return (
    <div className="w-full space-y-2">
      {src ? (
        <div className="w-full rounded-xl overflow-hidden border border-white/5">
          <img src={src} alt={label} loading="lazy" decoding="async" className="w-full h-auto block" />
        </div>
      ) : (
        <div
          className="w-full aspect-video rounded-xl flex flex-col items-center justify-center gap-3 border border-white/5"
          style={{
            background: `linear-gradient(135deg, ${accentColor}22 0%, ${accentColor}08 100%)`,
          }}
        >
          <ImageIcon className="w-7 h-7 opacity-20" style={{ color: accentColor }} />
          <div className="text-center space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-30" style={{ color: accentColor }}>
              {label}
            </p>
            <p className="font-mono text-[10px] sm:text-[9px] opacity-20" style={{ color: accentColor }}>
              Screenshot Coming Soon
            </p>
          </div>
        </div>
      )}
      {caption && (
        <p className="font-mono text-[10px] opacity-40 text-center">{caption}</p>
      )}
    </div>
  );
}

// ─── Case Study Video Player ──────────────────────────────────────────────────

const SPEEDS = [0.5, 1, 1.5, 2];

function ZoomableScreenshot({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge ${alt}`}
        className="relative block w-full rounded-xl overflow-hidden cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B6FD4]"
      >
        <img src={src} alt={alt} loading="lazy" decoding="async" className="w-full object-cover" />
        <span className="sm:hidden absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[11px] text-white/90 backdrop-blur-sm">
          <Maximize2 className="h-3 w-3" />
          Tap to zoom
        </span>
      </button>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] overflow-auto overscroll-contain bg-black/92"
              onClick={() => setOpen(false)}
            >
              <div className="flex min-h-full min-w-max items-center p-4 sm:min-w-0 sm:justify-center sm:p-10">
                <img
                  src={src}
                  alt={alt}
                  onClick={(e) => e.stopPropagation()}
                  className="w-[1100px] max-w-none rounded-lg sm:w-auto sm:max-w-full sm:max-h-[88vh]"
                />
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close enlarged screenshot"
                className="fixed right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                style={{ top: "max(0.75rem, env(safe-area-inset-top))" }}
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

function CaseStudyVideo({ src, poster, isDark }: { src: string; poster?: string; isDark: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
      setHasStarted(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  }

  function handleFullscreen() {
    const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
    else v.webkitEnterFullscreen?.();
  }

  function handleTimeUpdate() {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  }

  function handleLoadedMetadata() {
    setDuration(videoRef.current?.duration ?? 0);
  }

  function handleScrub(e: React.MouseEvent<HTMLDivElement>) {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
  }

  function cycleSpeed() {
    const v = videoRef.current;
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (v) v.playbackRate = next;
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  const currentTime = duration ? (progress / 100) * duration : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={cn(
        "w-full rounded-2xl overflow-hidden border group",
        isDark ? "border-white/10 bg-black/40" : "border-blue-100/80 bg-black/5",
      )}
    >
      {/* ── Video + overlay ── */}
      <div className="relative w-full aspect-video bg-black cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          preload="metadata"
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => { setIsPlaying(false); setHasStarted(false); setProgress(0); }}
          className="w-full h-full object-cover"
        />

        {/* Big play button overlay — shown before first play */}
        <AnimatePresence>
          {!hasStarted && (
            <motion.div
              key="play-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/30 backdrop-blur-[2px]"
            >
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
                style={{ background: "rgba(59,111,212,0.92)" }}
              >
                <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />
              </motion.div>
              <div className="text-center">
                <p className="text-white/90 text-sm font-medium tracking-wide">Platform Walkthrough</p>
                <p className="text-white/45 text-[11px] font-mono mt-0.5">
                  {duration ? formatTime(duration) : "Loading…"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause indicator on click when playing */}
        <AnimatePresence>
          {hasStarted && !isPlaying && (
            <motion.div
              key="pause-overlay"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white translate-x-0.5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Controls bar ── */}
      <div className={cn(
        "flex items-center gap-4 px-4 py-2.5 border-t",
        isDark ? "border-white/8 bg-white/[0.03]" : "border-blue-100/60 bg-white/50",
      )}>
        {/* Play/pause */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="group/ctl -m-2 flex h-11 w-11 shrink-0 items-center justify-center"
        >
          <span className={cn(
            "flex items-center justify-center w-7 h-7 rounded-full transition-all duration-150",
            isDark ? "bg-white/10 group-hover/ctl:bg-white/20 text-white/70 group-hover/ctl:text-white" : "bg-blue-50 group-hover/ctl:bg-blue-100 text-blue-600",
          )}>
            {isPlaying
              ? <span className="flex gap-[3px]"><span className="w-[3px] h-3 rounded-sm bg-current"/><span className="w-[3px] h-3 rounded-sm bg-current"/></span>
              : <Play className="w-3 h-3 fill-current translate-x-px" />}
          </span>
        </button>

        {/* Time */}
        <span className={cn("font-mono text-[10px] shrink-0 tabular-nums", isDark ? "text-white/55" : "text-slate-500")}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Scrubber */}
        <div
          className="flex-1 -my-3 py-3 cursor-pointer"
          onClick={handleScrub}
        >
          <div className={cn("h-1 rounded-full relative overflow-hidden", isDark ? "bg-white/10" : "bg-slate-200")}>
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-none"
              style={{ width: `${progress}%`, backgroundColor: "#3B6FD4" }}
            />
          </div>
        </div>

        {/* Mute */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="group/ctl -m-2 flex h-11 w-11 shrink-0 items-center justify-center"
        >
          <span className={cn(
            "flex items-center justify-center w-7 h-7 rounded-full transition-all duration-150",
            isDark ? "bg-white/10 group-hover/ctl:bg-white/20 text-white/70 group-hover/ctl:text-white" : "bg-blue-50 group-hover/ctl:bg-blue-100 text-blue-600",
          )}>
            {isMuted
              ? <VolumeX className="w-3.5 h-3.5" />
              : <Volume2 className="w-3.5 h-3.5" />}
          </span>
        </button>

        {/* Playback speed */}
        <button
          type="button"
          onClick={cycleSpeed}
          aria-label={`Playback speed ${speed}×`}
          className="group/ctl -m-2 flex h-11 min-w-11 shrink-0 items-center justify-center px-2"
        >
          <span className={cn(
            "flex items-center justify-center h-7 px-2 rounded-full font-mono text-[10px] font-medium transition-all duration-150",
            isDark ? "bg-white/10 group-hover/ctl:bg-white/20 text-white/70 group-hover/ctl:text-white" : "bg-blue-50 group-hover/ctl:bg-blue-100 text-blue-600",
          )}>
            {speed === 1 ? "1×" : `${speed}×`}
          </span>
        </button>

        {/* Fullscreen */}
        <button
          type="button"
          onClick={handleFullscreen}
          aria-label="Fullscreen"
          className="group/ctl -m-2 flex h-11 w-11 shrink-0 items-center justify-center"
        >
          <span className={cn(
            "flex items-center justify-center w-7 h-7 rounded-full transition-all duration-150",
            isDark ? "bg-white/10 group-hover/ctl:bg-white/20 text-white/70 group-hover/ctl:text-white" : "bg-blue-50 group-hover/ctl:bg-blue-100 text-blue-600",
          )}>
            <Maximize2 className="w-3 h-3" />
          </span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Rich Persona Card ────────────────────────────────────────────────────────

type RichPersonaData = Extract<ContentBlock, { type: "rich-persona" }>;

function RichPersonaCard({ persona, isDark, index, accentColor }: { persona: RichPersonaData; isDark: boolean; index: number; accentColor: string }) {
  const lightStyle = index === 0
    ? { background: "radial-gradient(circle at 20% 10%, rgba(55,132,255,0.12), transparent 50%), linear-gradient(135deg,#eaf5ff,#d1e5ff)", borderColor: "rgba(55,132,255,0.2)" }
    : { background: "radial-gradient(circle at 80% 10%, rgba(14,116,144,0.10), transparent 50%), linear-gradient(135deg,#f0fdff,#ccfbf1)", borderColor: "rgba(14,116,144,0.18)" };

  return (
    <div
      className={cn(
        "rounded-2xl p-6 border flex flex-col gap-5",
        isDark
          ? "bg-white/[0.04] border-white/8"
          : "border",
      )}
      style={!isDark ? { background: lightStyle.background, borderColor: lightStyle.borderColor } : undefined}
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-lg font-bold ring-2 ring-white/10"
          style={{ backgroundColor: persona.avatarColor, color: persona.avatarTextColor }}
        >
          {persona.avatarPhoto
            ? <img src={persona.avatarPhoto} alt={persona.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            : persona.initial}
        </div>
        <div>
          <p className={cn("font-['Caveat'] text-2xl leading-tight", isDark ? "text-white/92" : "text-slate-900")}>
            {persona.name}
          </p>
          <p className={cn("font-mono text-[10px] uppercase tracking-[0.15em]", isDark ? "text-white/65" : "text-slate-500")}>
            {persona.role} · {persona.company}
          </p>
          <p className={cn("font-mono text-[10px] sm:text-[9px]", isDark ? "text-white/55" : "text-slate-500")}>
            {persona.location}
          </p>
        </div>
      </div>

      {/* Quote */}
      <div
        className={cn("rounded-xl px-4 py-3 border-l-[3px]", isDark ? "bg-white/[0.03]" : "bg-white/50")}
        style={{ borderLeftColor: persona.avatarColor }}
      >
        <p className={cn("text-[0.875rem] leading-[1.7] font-medium italic", isDark ? "text-white/75" : "text-slate-700")}>
          "{persona.quote}"
        </p>
      </div>

      {/* Goals + Pain Points */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.18em] mb-2.5", isDark ? "text-white/60" : "text-slate-500")}>
            Goals
          </p>
          <ul className="space-y-2">
            {persona.goals.map((g, i) => (
              <li key={i} className={cn("flex items-start gap-2 text-[0.8rem] leading-[1.55]", isDark ? "text-white/82" : "text-slate-700")}>
                <span className="mt-[6px] h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: isDark ? getLightAccent(accentColor) : accentColor }} />
                {g}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.18em] mb-2.5", isDark ? "text-white/60" : "text-slate-500")}>
            Pain Points
          </p>
          <ul className="space-y-2">
            {persona.painPoints.map((p, i) => (
              <li key={i} className={cn("flex items-start gap-2 text-[0.8rem] leading-[1.55]", isDark ? "text-white/82" : "text-slate-700")}>
                <span className="mt-[6px] h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: "#f87171" }} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Behaviour */}
      <div className={cn("rounded-lg px-3 py-2.5", isDark ? "bg-white/[0.03]" : "bg-white/40")}>
        <span className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.18em] mr-2", isDark ? "text-white/60" : "text-slate-500")}>
          Behaviour
        </span>
        <span className={cn("text-[0.8rem] leading-[1.55]", isDark ? "text-white/78" : "text-slate-600")}>
          {persona.behaviour}
        </span>
      </div>
    </div>
  );
}

// ─── Spacing Visual Block ─────────────────────────────────────────────────────

type SpacingVisualData = Extract<ContentBlock, { type: "spacing-visual" }>;

function SpacingVisual({ block, isDark }: { block: SpacingVisualData; isDark: boolean }) {
  const maxPx = Math.max(...block.tokens.map(t => t.px));

  return (
    <div className="space-y-6">
      {/* Token scale */}
      <div
        className={cn("rounded-xl p-5 border", isDark ? "bg-white/[0.03] border-white/6" : "bg-white/50 border-slate-200")}
      >
        <p className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.2em] mb-4", isDark ? "text-white/55" : "text-slate-500")}>
          Spacing Scale — 4px Base Unit
        </p>
        <div className="space-y-3">
          {block.tokens.map((token) => (
            <div key={token.name} className="flex items-center gap-4">
              <span className={cn("font-mono text-[11px] w-10 shrink-0 text-right", isDark ? "text-white/50" : "text-slate-500")}>
                {token.name}
              </span>
              <div className="flex-1 flex items-center gap-2">
                <div
                  className="rounded h-5 shrink-0 transition-all"
                  style={{
                    width: `${(token.px / maxPx) * 100}%`,
                    minWidth: "4px",
                    backgroundColor: isDark ? token.color : token.color,
                    opacity: isDark ? 0.75 : 0.65,
                  }}
                />
                <span className={cn("font-mono text-[10px] sm:text-[9px] shrink-0", isDark ? "text-white/55" : "text-slate-500")}>
                  {token.px}px · {token.px / block.baseUnit}u
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid system */}
      <div className={cn("rounded-xl p-5 border", isDark ? "bg-white/[0.03] border-white/6" : "bg-white/50 border-slate-200")}>
        <p className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.2em] mb-4", isDark ? "text-white/55" : "text-slate-500")}>
          Layout Grid
        </p>
        <div className="space-y-4">
          {/* Column visualiser */}
          <div className="flex gap-[3px] h-8">
            {Array.from({ length: block.columns }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{ backgroundColor: isDark ? "rgba(59,111,212,0.25)" : "rgba(37,99,235,0.15)" }}
              />
            ))}
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Columns", value: `${block.columns}` },
              { label: "Gutters", value: block.gutters },
              { label: "Max Width", value: block.maxWidth },
              { label: "Card Padding", value: block.cardPadding },
            ].map((stat) => (
              <div key={stat.label} className={cn("rounded-lg px-3 py-2.5 text-center", isDark ? "bg-white/[0.04]" : "bg-slate-50/80")}>
                <p className={cn("text-[0.95rem] font-semibold font-mono", isDark ? "text-white/80" : "text-slate-800")}>
                  {stat.value}
                </p>
                <p className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.15em] mt-0.5", isDark ? "text-white/55" : "text-slate-500")}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Inline bold helper ───────────────────────────────────────────────────────

function renderBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part,
  );
}

type Tone = { fg: string; bg: string; surface: string };
const TONES: Record<"positive" | "negative" | "generative" | "evaluative" | "goal", { dark: Tone; light: Tone }> = {
  positive:   { dark: { fg: "#4ade80", bg: "rgba(74,222,128,0.14)", surface: "rgba(74,222,128,0.06)" },
                light: { fg: "#16a34a", bg: "rgba(22,163,74,0.10)", surface: "rgba(22,163,74,0.04)" } },
  negative:   { dark: { fg: "rgba(252,165,165,0.92)", bg: "rgba(248,113,113,0.14)", surface: "rgba(239,68,68,0.06)" },
                light: { fg: "#dc2626", bg: "rgba(220,38,38,0.09)", surface: "rgba(220,38,38,0.04)" } },
  generative: { dark: { fg: "rgba(230,185,100,0.92)", bg: "rgba(210,150,50,0.15)", surface: "rgba(210,150,50,0.06)" },
                light: { fg: "#92650a", bg: "rgba(200,140,40,0.11)", surface: "rgba(200,140,40,0.05)" } },
  evaluative: { dark: { fg: "rgba(150,185,255,0.92)", bg: "rgba(80,120,210,0.18)", surface: "rgba(80,120,210,0.06)" },
                light: { fg: "#1d4ed8", bg: "rgba(60,100,210,0.10)", surface: "rgba(60,100,210,0.04)" } },
  goal:       { dark: { fg: "rgba(200,225,120,0.92)", bg: "rgba(180,210,80,0.14)", surface: "rgba(180,210,80,0.07)" },
                light: { fg: "#4d7c0f", bg: "rgba(130,180,50,0.14)", surface: "rgba(130,180,50,0.09)" } },
};
const tone = (name: keyof typeof TONES, isDark: boolean) => TONES[name][isDark ? "dark" : "light"];

// Bold rendered in accent color — used for problem-callout where bold = design goal
function renderBoldAccent(text: string, color: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} style={{ color }}>{part.slice(2, -2)}</strong>
      : part,
  );
}

// Rich inline renderer: **bold** and _italic+accent_ — used for research paragraphs
function renderRich(text: string, accent: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("_") && part.endsWith("_"))
      return <em key={i} style={{ color: accent }}>{part.slice(1, -1)}</em>;
    return part;
  });
}

// Blend accent with white so small text meets 4.5:1 on dark backgrounds
function getLightAccent(accent: string): string {
  if (!/^#[0-9a-f]{6}$/i.test(accent)) return accent;
  const r = parseInt(accent.slice(1, 3), 16);
  const g = parseInt(accent.slice(3, 5), 16);
  const b = parseInt(accent.slice(5, 7), 16);
  return `rgb(${Math.round(r * 0.55 + 114.75)},${Math.round(g * 0.55 + 114.75)},${Math.round(b * 0.55 + 114.75)})`;
}

// ─── Content Block Renderer ───────────────────────────────────────────────────

function BlockRenderer({
  block,
  isDark,
  accentColor,
  sectionIndex,
}: {
  block: ContentBlock;
  isDark: boolean;
  accentColor: string;
  sectionIndex: number;
}) {
  // Lighten the accent for small text in dark mode so every study meets 4.5:1
  const textAccent = isDark ? getLightAccent(accentColor) : accentColor;

  switch (block.type) {
    case "paragraph":
      return (
        <p className={cn("text-[0.925rem] leading-[1.85] max-w-[68ch]", isDark ? "text-white/70" : "text-slate-700")}>
          {renderBold(block.text)}
        </p>
      );

    case "heading":
      return (
        <h3 className={cn("font-['Caveat'] text-2xl font-medium pt-2", isDark ? "text-white/90" : "text-slate-900")}>
          {block.text}
        </h3>
      );

    case "image":
      return (
        <div className="w-full space-y-2">
          <div className="w-full rounded-xl overflow-hidden border border-white/8">
            <img src={block.src} alt={block.alt} loading="lazy" decoding="async" className="w-full object-cover" />
          </div>
          {block.caption && (
            <p className={cn("font-mono text-[10px] text-center", isDark ? "text-white/55" : "text-slate-500")}>
              {block.caption}
            </p>
          )}
        </div>
      );

    case "placeholder-image":
      return (
        <PlaceholderImage
          label={block.label}
          caption={block.caption}
          accentColor={isDark ? "#3B6FD4" : accentColor}
          src={block.src}
        />
      );

    case "callout": {
      const lightColors = LIGHT_SECTION_COLORS[sectionIndex % LIGHT_SECTION_COLORS.length];
      return (
        <div
          className={cn("rounded-xl px-5 py-4 border-l-[3px]")}
          style={isDark
            ? { background: "rgba(255,255,255,0.04)", borderLeftColor: "#3B6FD4" }
            : { background: lightColors.bg, borderLeftColor: accentColor, borderColor: lightColors.border, borderWidth: "1px", borderStyle: "solid", borderLeftWidth: "3px" }}
        >
          <p className={cn("text-[0.875rem] leading-[1.75] italic", isDark ? "text-white/75" : "text-slate-700")}>
            {block.text}
          </p>
        </div>
      );
    }

    case "persona":
      return (
        <div
          className={cn("rounded-xl p-5 border-l-[3px]", isDark ? "bg-white/[0.045] border-white/10" : "bg-white/60 border-slate-200")}
          style={{ borderLeftColor: isDark ? "#3B6FD4" : accentColor }}
        >
          <div className="flex flex-wrap items-start gap-x-4 gap-y-1 mb-3">
            <div>
              <p className={cn("font-['Caveat'] text-[1.5rem] leading-none", isDark ? "text-white/92" : "text-slate-900")}>
                {block.name}
              </p>
              <p className={cn("font-mono text-[10px] uppercase tracking-[0.18em] mt-0.5", isDark ? "text-white/55" : "text-slate-500")}>
                {block.role} · {block.location}
              </p>
            </div>
          </div>
          <p className={cn("text-[0.875rem] leading-[1.65] font-medium mb-3", isDark ? "text-white/80" : "text-slate-800")}>
            "{block.question}"
          </p>
          <ul className="space-y-1.5">
            {block.details.map((detail, i) => (
              <li key={i} className={cn("flex items-start gap-2 text-[0.825rem] leading-[1.55]", isDark ? "text-white/55" : "text-slate-600")}>
                <span className="mt-[6px] h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: isDark ? "#3B6FD4" : accentColor }} />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      );

    case "rich-persona":
      return <RichPersonaCard persona={block} isDark={isDark} index={sectionIndex % 2} accentColor={accentColor} />;

    case "persona-pair":
      return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {block.personas.map((persona, i) => (
            <RichPersonaCard key={persona.name} persona={persona} isDark={isDark} index={i} accentColor={accentColor} />
          ))}
        </div>
      );

    case "tensions":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {block.items.map((item, i) => {
            const lc = LIGHT_SECTION_COLORS[i % LIGHT_SECTION_COLORS.length];
            return (
              <div
                key={i}
                className={cn("rounded-xl p-4 border", isDark ? "bg-white/[0.04] border-white/6" : "border")}
                style={!isDark ? { background: lc.bg, borderColor: lc.border } : undefined}
              >
                <p className={cn("text-[0.8rem] font-semibold mb-1.5", isDark ? "text-white/85" : "text-slate-800")}>
                  {item.title}
                </p>
                <p className={cn("text-[0.8rem] leading-[1.65]", isDark ? "text-white/50" : "text-slate-600")}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      );

    case "phases":
      return (
        <div className={cn("rounded-xl overflow-hidden border", isDark ? "border-white/10 bg-[#1e2040]" : "border-slate-200 bg-white")}>
          <div className={cn("grid grid-cols-[3rem_1fr_2fr] gap-4 px-5 py-3 border-b font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.2em]",
            isDark ? "bg-[#252850] border-white/10 text-white/40" : "bg-blue-50/80 border-slate-200 text-slate-500")}>
            <span>Phase</span>
            <span>Stage</span>
            <span>Deliverable</span>
          </div>
          {block.items.map((item, i) => (
            <div key={i} className={cn(
              "grid grid-cols-[3rem_1fr_2fr] gap-4 px-5 py-3 border-b last:border-0 transition-colors",
              isDark
                ? i % 2 === 0 ? "border-white/6 bg-[#1e2040] hover:bg-[#252850]" : "border-white/6 bg-[#21244a] hover:bg-[#272b55]"
                : "border-slate-100 hover:bg-blue-50/30",
            )}>
              <span className="font-mono text-[10px] font-medium pt-0.5" style={{ color: textAccent }}>
                {item.range}
              </span>
              <span className={cn("text-[0.825rem] font-medium", isDark ? "text-white/80" : "text-slate-800")}>
                {item.stage}
              </span>
              <span className={cn("text-[0.8rem] leading-[1.55]", isDark ? "text-white/45" : "text-slate-600")}>
                {item.deliverable}
              </span>
            </div>
          ))}
        </div>
      );

    case "type-scale":
      return (
        <div className="space-y-2">
          {block.items.map((item, i) => (
            <div key={i} className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg px-4 py-3 border",
              isDark ? "border-white/6 bg-white/[0.03]" : "border-slate-200/70 bg-white/60")}>
              <div className="w-32 shrink-0">
                <p className={cn("text-[0.8rem] font-medium", isDark ? "text-white/75" : "text-slate-700")}>{item.name}</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                {[item.font, item.size, `${item.weight}w`].map((tag) => (
                  <span key={tag} className={cn("font-mono text-[10px] rounded px-2 py-0.5",
                    isDark ? "bg-white/8 text-white/50" : "bg-blue-50 text-blue-700 border border-blue-100")}>
                    {tag}
                  </span>
                ))}
              </div>
              <p className={cn("text-[0.775rem] ml-auto", isDark ? "text-white/35" : "text-slate-500")}>{item.usage}</p>
            </div>
          ))}
        </div>
      );

    case "color-system":
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {block.items.map((item) => (
            <div key={item.name} className={cn("rounded-xl p-4 space-y-3 border",
              isDark ? "bg-white/[0.04] border-white/6" : "bg-white/60 border-slate-200/60")}>
              <div className="w-full h-10 rounded-lg" style={{ backgroundColor: item.hex }} />
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className={cn("text-[0.8rem] font-medium", isDark ? "text-white/85" : "text-slate-800")}>{item.name}</p>
                  <span className={cn("font-mono text-[10px]", isDark ? "text-white/55" : "text-slate-500")}>{item.hex}</span>
                </div>
                <p className={cn("text-[0.75rem] leading-[1.5]", isDark ? "text-white/40" : "text-slate-500")}>{item.usage}</p>
              </div>
            </div>
          ))}
        </div>
      );

    case "classification":
      return (
        <div className="space-y-2">
          {block.items.map((item) => (
            <div key={item.name} className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl px-4 py-3 border-l-[3px]",
              isDark ? "bg-white/[0.04]" : "bg-white/50 border border-slate-100")}
              style={{ borderLeftColor: item.color }}>
              <span className="rounded-full px-3 py-1 text-[11px] font-medium shrink-0"
                style={{ backgroundColor: item.color, color: item.textColor }}>
                {item.name}
              </span>
              <p className={cn("text-[0.825rem] flex-1", isDark ? "text-white/65" : "text-slate-700")}>{item.desc}</p>
              <span className={cn("font-mono text-[10px] uppercase tracking-wide", isDark ? "text-white/55" : "text-slate-500")}>
                → {item.action}
              </span>
            </div>
          ))}
        </div>
      );

    case "spacing-visual":
      return <SpacingVisual block={block} isDark={isDark} />;

    case "screen": {
      return (
        <div className={cn("rounded-2xl overflow-hidden border", isDark ? "border-white/8 bg-white/[0.03]" : "border-slate-200 bg-white/50")}>
          <div className={cn("flex flex-wrap items-center gap-3 px-5 py-4 border-b", isDark ? "border-white/8" : "border-slate-200 bg-blue-50/40")}>
            <span className="font-mono text-[10px] font-medium rounded px-2 py-1"
              style={{ backgroundColor: isDark ? `${accentColor}1a` : "#dbeafe", color: isDark ? textAccent : "#1d4ed8" }}>
              Screen {block.number}
            </span>
            <h4 className={cn("text-[0.95rem] font-semibold", isDark ? "text-white/90" : "text-slate-900")}>{block.title}</h4>
          </div>
          <div className="p-5 space-y-4">
            <p className={cn("text-[0.875rem] leading-[1.7] font-medium italic", isDark ? "text-white/60" : "text-slate-600")}>
              Primary question: "{block.question}"
            </p>
            {typeof block.image === "string" ? (
              <ZoomableScreenshot src={block.image} alt={`${block.title} screenshot`} />
            ) : block.image === null ? (
              <PlaceholderImage label={`${block.title} Screenshot`} accentColor={isDark ? "#3B6FD4" : accentColor} />
            ) : null}
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.32em] mb-2.5"
                style={{ color: block.decisionsHeading ? textAccent : (isDark ? "rgba(255,255,255,0.55)" : "#94a3b8") }}
              >
                {block.decisionsHeading ?? "Key Decisions"}
              </p>
              {block.decisionsHeading ? (
                <div className="space-y-3.5">
                  {block.decisions.map((para, i) => (
                    <p key={i} className={cn("text-[0.875rem] leading-[1.75]", isDark ? "text-white/72" : "text-slate-700")}>
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {block.decisions.map((decision, i) => (
                    <li key={i} className={cn("flex items-start gap-3 text-[0.825rem] leading-[1.65]", isDark ? "text-white/60" : "text-slate-700")}>
                      <span className="mt-[7px] h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: isDark ? "#3B6FD4" : accentColor }} />
                      {decision}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      );
    }

    case "decision": {
      const decisionColors = [
        { light: "#dbeafe", text: "#1d4ed8" },
        { light: "#ede9fe", text: "#6d28d9" },
        { light: "#dcfce7", text: "#15803d" },
        { light: "#fef9c3", text: "#a16207" },
        { light: "#fce7f3", text: "#be185d" },
      ];
      const dc = decisionColors[(parseInt(block.number) - 1) % decisionColors.length];
      return (
        <div className={cn("rounded-xl p-5 space-y-3 border", isDark ? "bg-white/[0.04] border-white/6" : "bg-white/50 border-slate-200")}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0"
              style={isDark
                ? { backgroundColor: `${accentColor}1a`, color: textAccent }
                : { backgroundColor: dc.light, color: dc.text }}>
              {block.number}
            </span>
            <h4 className={cn("text-[0.9rem] font-semibold", isDark ? "text-white/90" : "text-slate-900")}>
              {block.title}
            </h4>
          </div>
          <p className={cn("text-[0.875rem] leading-[1.8]", isDark ? "text-white/60" : "text-slate-600")}>{block.body}</p>
        </div>
      );
    }

    case "stats-grid":
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {block.items.map((stat, i) => {
            const lc = LIGHT_SECTION_COLORS[i % LIGHT_SECTION_COLORS.length];
            return (
              <div key={stat.label}
                className={cn("rounded-xl p-4 text-center border", isDark ? "bg-white/[0.05] border-white/6" : "border")}
                style={!isDark ? { background: lc.bg, borderColor: lc.border } : undefined}>
                <p className="font-['Caveat'] text-3xl font-medium" style={{ color: isDark ? "#3B6FD4" : accentColor }}>
                  {stat.value}
                </p>
                <p className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.18em] mt-1", isDark ? "text-white/65" : "text-slate-600")}>
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      );

    case "reflection":
      return (
        <div className={cn("rounded-xl p-5 space-y-3 border",
          isDark ? "bg-white/[0.04] border-white/6" : "bg-white/50 border-slate-200")}>
          <p className={cn("text-[0.8rem] font-semibold font-mono uppercase tracking-[0.15em]", isDark ? "text-white/50" : "text-slate-500")}>
            {block.heading}
          </p>
          <ul className="space-y-3">
            {block.items.map((item, i) => (
              <li key={i} className={cn("flex items-start gap-3 text-[0.875rem] leading-[1.75]", isDark ? "text-white/65" : "text-slate-700")}>
                <span className="mt-[8px] h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: isDark ? "#3B6FD4" : accentColor }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

    case "process-steps": {
      return (
        <div className="w-full space-y-4">
          {/* Horizontal flow — sm+ */}
          <div className="hidden sm:flex items-start">
            {block.steps.map((step, i) => (
              <div key={i} className="flex items-start flex-1 min-w-0">
                <div className="flex flex-col items-center flex-1 min-w-0 px-1">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-mono text-[11px] font-bold"
                    style={{
                      backgroundColor: isDark ? `${accentColor}33` : `${accentColor}18`,
                      color: isDark ? textAccent : accentColor,
                      boxShadow: `0 0 0 2px ${accentColor}40`,
                    }}
                  >
                    {i + 1}
                  </div>
                  <p className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.15em] text-center mt-2 leading-tight", isDark ? "text-white/75" : "text-slate-800")}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className={cn("text-[0.72rem] leading-[1.5] text-center mt-1.5", isDark ? "text-white/40" : "text-slate-500")}>
                      {step.description}
                    </p>
                  )}
                  {step.subItems && step.subItems.length > 0 && (
                    <ul className="mt-2 space-y-1 w-full">
                      {step.subItems.map((item, j) => (
                        <li key={j} className={cn("flex items-start gap-1.5 text-[0.7rem] leading-[1.45]", isDark ? "text-white/35" : "text-slate-500")}>
                          <span className="mt-[5px] h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {i < block.steps.length - 1 && (
                  <div className="flex items-center w-5 shrink-0 mt-[18px]">
                    <div className="h-px flex-1" style={{ backgroundColor: `${accentColor}40` }} />
                    <svg width="6" height="8" viewBox="0 0 6 8" style={{ color: `${accentColor}60` }}>
                      <path d="M0 0 L6 4 L0 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Vertical stack — mobile */}
          <div className="sm:hidden space-y-3">
            {block.steps.map((step, i) => {
              const lc = LIGHT_SECTION_COLORS[i % LIGHT_SECTION_COLORS.length];
              return (
                <div
                  key={i}
                  className={cn("flex gap-4 rounded-xl px-4 py-3 border", isDark ? "bg-white/[0.04] border-white/6" : "border")}
                  style={!isDark ? { background: lc.bg, borderColor: lc.border } : undefined}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-mono text-[10px] font-bold mt-0.5"
                    style={{ backgroundColor: `${accentColor}20`, color: isDark ? textAccent : accentColor }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p className={cn("font-mono text-[10px] font-medium uppercase tracking-[0.12em]", isDark ? "text-white/80" : "text-slate-800")}>
                      {step.label}
                    </p>
                    {step.description && (
                      <p className={cn("text-[0.8rem] leading-[1.6] mt-1", isDark ? "text-white/45" : "text-slate-600")}>
                        {step.description}
                      </p>
                    )}
                    {step.subItems && (
                      <ul className="mt-2 space-y-1">
                        {step.subItems.map((item, j) => (
                          <li key={j} className={cn("flex items-start gap-2 text-[0.775rem] leading-[1.5]", isDark ? "text-white/35" : "text-slate-500")}>
                            <span className="mt-[5px] h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case "role-tags": {
      return (
        <div
          className="w-full rounded-2xl p-6 sm:p-8 border"
          style={
            isDark
              ? {
                  background: `linear-gradient(135deg, ${accentColor}40 0%, ${accentColor}25 100%)`,
                  borderColor: `${accentColor}50`,
                }
              : {
                  background: `linear-gradient(135deg, ${accentColor}12 0%, ${accentColor}07 100%)`,
                  borderColor: `${accentColor}25`,
                }
          }
        >
          <p className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.25em] mb-5", isDark ? "text-white/55" : "text-slate-500")}>
            Responsibilities
          </p>
          <div className="flex flex-wrap gap-2.5">
            {block.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3.5 py-1.5 rounded-full text-[0.8rem] font-medium border"
                style={
                  isDark
                    ? { backgroundColor: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.85)", borderColor: "rgba(255,255,255,0.15)" }
                    : { backgroundColor: accentColor, color: "#ffffff", borderColor: "transparent" }
                }
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      );
    }

    case "donut-stats": {
      const RADIUS = 36;
      const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {block.items.map((item, i) => {
            const offset = CIRCUMFERENCE * (1 - item.percentage / 100);
            const lc = LIGHT_SECTION_COLORS[i % LIGHT_SECTION_COLORS.length];
            return (
              <div
                key={i}
                className={cn("rounded-2xl p-6 flex flex-col items-center gap-4 border", isDark ? "bg-white/[0.04] border-white/6" : "border")}
                style={!isDark ? { background: lc.bg, borderColor: lc.border } : undefined}
              >
                <div className="relative w-24 h-24">
                  <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="48" cy="48" r={RADIUS} fill="none"
                      stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}
                      strokeWidth="8" />
                    <motion.circle
                      cx="48" cy="48" r={RADIUS} fill="none"
                      stroke={accentColor}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      initial={{ strokeDashoffset: CIRCUMFERENCE }}
                      whileInView={{ strokeDashoffset: offset }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-['Caveat'] text-2xl font-medium" style={{ color: accentColor }}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className={cn("text-[0.875rem] font-semibold", isDark ? "text-white/85" : "text-slate-800")}>
                    {item.label}
                  </p>
                  <p className={cn("text-[0.775rem] leading-[1.55]", isDark ? "text-white/45" : "text-slate-600")}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    case "timeline-visual": {
      const timelineItems = block.items;

      // ── Option A: Vertical Rail ───────────────────────────────────────────
      if (block.variant === 1) {
        return (
          <div className="relative pl-8">
            <div
              className="absolute left-[14px] top-4 bottom-4 w-[2px] rounded-full"
              style={{
                background: isDark
                  ? `linear-gradient(to bottom, ${accentColor}70, ${accentColor}15)`
                  : `linear-gradient(to bottom, ${accentColor}55, ${accentColor}10)`,
              }}
            />
            <div className="space-y-4">
              {timelineItems.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className="relative z-10 w-5 h-5 rounded-full shrink-0 mt-1 flex items-center justify-center border-2"
                    style={{ backgroundColor: isDark ? "#1a1a2e" : "#f5f3ff", borderColor: accentColor }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                  </div>
                  <div className={cn("flex-1 rounded-xl p-4 border", isDark ? "bg-white/[0.04] border-white/6" : "border-slate-200 bg-white/70")}>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span
                        className="font-mono text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0"
                        style={{ backgroundColor: `${accentColor}20`, color: textAccent }}
                      >
                        {item.range}
                      </span>
                      <span className={cn("text-[0.85rem] font-semibold", isDark ? "text-white/90" : "text-slate-800")}>
                        {item.stage}
                      </span>
                    </div>
                    <p className={cn("text-[0.78rem] leading-[1.65]", isDark ? "text-white/45" : "text-slate-600")}>
                      {item.deliverable}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // ── Option B: Progress Cards ──────────────────────────────────────────
      if (block.variant === 2) {
        return (
          <div className="space-y-3">
            {timelineItems.map((item, i) => {
              const m = item.range.match(/W(\d+)[^\d]+(\d+)/);
              const ws = m ? parseInt(m[1]) : i + 1;
              const we = m ? parseInt(m[2]) : i + 2;
              const total = 8;
              const barLeft = ((ws - 1) / total) * 100;
              const barW = ((we - ws + 1) / total) * 100;
              const lc = LIGHT_SECTION_COLORS[i % LIGHT_SECTION_COLORS.length];
              return (
                <div
                  key={i}
                  className={cn("rounded-2xl p-5 border", isDark ? "bg-white/[0.04] border-white/6" : "border")}
                  style={!isDark ? { background: lc.bg, borderColor: lc.border } : undefined}
                >
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: textAccent }}>
                        {item.range}
                      </span>
                      <span className="font-mono text-[9px]" style={{ color: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)" }}>
                        8-WEEK PROJECT
                      </span>
                    </div>
                    <div className={cn("relative h-1.5 rounded-full", isDark ? "bg-white/8" : "bg-black/5")}>
                      <div
                        className="absolute top-0 h-full rounded-full"
                        style={{ left: `${barLeft}%`, width: `${barW}%`, backgroundColor: accentColor }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div
                      className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-['Caveat'] text-lg font-bold"
                      style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[0.85rem] font-semibold mb-1", isDark ? "text-white/90" : "text-slate-800")}>
                        {item.stage}
                      </p>
                      <p className={cn("text-[0.775rem] leading-[1.6]", isDark ? "text-white/45" : "text-slate-600")}>
                        {item.deliverable}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }

      // ── Option C: Grid Cards with ghost number ────────────────────────────
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {timelineItems.map((item, i) => {
            const lc = LIGHT_SECTION_COLORS[i % LIGHT_SECTION_COLORS.length];
            return (
              <div
                key={i}
                className={cn("rounded-2xl p-5 border relative overflow-hidden", isDark ? "bg-white/[0.04] border-white/6" : "border")}
                style={!isDark ? { background: lc.bg, borderColor: lc.border } : undefined}
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-1 -top-4 font-['Caveat'] text-[80px] leading-none font-bold select-none pointer-events-none"
                  style={{ color: isDark ? `${accentColor}10` : `${accentColor}09` }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="relative z-10">
                  <span
                    className="font-mono text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest"
                    style={{ backgroundColor: `${accentColor}20`, color: textAccent }}
                  >
                    {item.range}
                  </span>
                  <p className={cn("text-[0.875rem] font-semibold mt-2 mb-1.5", isDark ? "text-white/90" : "text-slate-800")}>
                    {item.stage}
                  </p>
                  <p className={cn("text-[0.775rem] leading-[1.65]", isDark ? "text-white/45" : "text-slate-600")}>
                    {item.deliverable}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    case "diamond-visual": {
      const dItems = block.items;

      // ── Option A: SVG Double Diamond ──────────────────────────────────────
      if (block.variant === 1) {
        return (
          <div className="space-y-5">
            <div className="flex justify-between px-1 mb-1">
              <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.3)" }}>Designing the right thing</p>
              <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.3)" }}>Designing things right</p>
            </div>
            <div className={cn("rounded-2xl overflow-hidden border", isDark ? "border-white/6" : "border-slate-200")}>
              <svg viewBox="0 0 400 110" className="w-full" style={{ height: "110px", display: "block" }}>
                <polygon
                  points="8,55 100,8 192,55 100,102"
                  fill={isDark ? `${accentColor}35` : `${accentColor}20`}
                  stroke={accentColor}
                  strokeWidth="1.5"
                  strokeOpacity="0.55"
                />
                <polygon
                  points="208,55 300,8 392,55 300,102"
                  fill={isDark ? `${accentColor}25` : `${accentColor}14`}
                  stroke={accentColor}
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />
                <line x1="192" y1="55" x2="208" y2="55" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="3,3" />
                <text x="68" y="52" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="700" fill={accentColor} fillOpacity="0.9">Discover</text>
                <text x="132" y="62" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="700" fill={accentColor} fillOpacity="0.65">Define</text>
                <text x="268" y="52" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="700" fill={accentColor} fillOpacity="0.9">Develop</text>
                <text x="332" y="62" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="700" fill={accentColor} fillOpacity="0.65">Deliver</text>
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {dItems.map((item, i) => (
                <div key={i} className={cn("rounded-xl p-4 border", isDark ? "bg-white/[0.04] border-white/6" : "border-slate-200 bg-white/60")}>
                  <div className="font-mono text-[9px] uppercase tracking-widest mb-1.5" style={{ color: textAccent }}>{item.range}</div>
                  <p className={cn("text-[0.8rem] font-semibold mb-1", isDark ? "text-white/85" : "text-slate-800")}>{item.stage}</p>
                  <p className={cn("text-[0.75rem] leading-[1.6]", isDark ? "text-white/45" : "text-slate-600")}>{item.deliverable}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // ── Option B: Phase Circles ───────────────────────────────────────────
      if (block.variant === 2) {
        return (
          <div className="space-y-5">
            <div className="flex items-start">
              {dItems.map((item, i) => (
                <div key={i} className="flex items-start flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0 px-0.5">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center font-['Caveat'] text-2xl font-bold shrink-0"
                      style={{
                        backgroundColor: i % 2 === 0 ? `${accentColor}30` : `${accentColor}18`,
                        color: accentColor,
                        boxShadow: `0 0 0 3px ${accentColor}20`,
                      }}
                    >
                      {i + 1}
                    </div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-center px-1" style={{ color: textAccent }}>
                      {item.stage}
                    </p>
                    <p className={cn("text-[0.68rem] leading-[1.5] text-center px-1", isDark ? "text-white/35" : "text-slate-500")}>
                      {item.deliverable.split(":")[0]}
                    </p>
                  </div>
                  {i < dItems.length - 1 && (
                    <div className="shrink-0 flex items-start pt-[22px]">
                      <div className="flex items-center">
                        <div className="w-3 h-px" style={{ backgroundColor: `${accentColor}40` }} />
                        <svg width="5" height="7" viewBox="0 0 5 7">
                          <path d="M0 0 L5 3.5 L0 7" stroke={accentColor} strokeWidth="1.2" fill="none" opacity="0.5" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {dItems.map((item, i) => (
                <div key={i} className={cn("rounded-xl p-4 border", isDark ? "bg-white/[0.04] border-white/6" : "border-slate-200")}>
                  <div className="font-mono text-[9px] uppercase tracking-widest mb-1.5" style={{ color: textAccent }}>{item.range}</div>
                  <p className={cn("text-[0.8rem] font-semibold mb-1", isDark ? "text-white/85" : "text-slate-800")}>{item.stage}</p>
                  <p className={cn("text-[0.75rem] leading-[1.6]", isDark ? "text-white/45" : "text-slate-600")}>{item.deliverable}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // ── Option C: Stepped Direction Cards ────────────────────────────────
      const directions = ["↗", "↘", "↗", "↘"];
      const dirLabels = ["Diverge", "Converge", "Diverge", "Converge"];
      const indentClass = ["mr-10", "ml-10", "mr-10", "ml-10"];
      return (
        <div className="space-y-2">
          {dItems.map((item, i) => (
            <div
              key={i}
              className={cn(
                "rounded-2xl p-5 border flex gap-4 items-center",
                indentClass[i],
                isDark ? "bg-white/[0.04] border-white/6" : "border-slate-200 bg-white/60",
              )}
            >
              <div className="shrink-0 text-center w-12">
                <div className="font-['Caveat'] text-3xl leading-none" style={{ color: accentColor }}>
                  {directions[i]}
                </div>
                <div className="font-mono text-[7px] uppercase tracking-widest mt-0.5" style={{ color: isDark ? "rgba(255,255,255,0.45)" : `${accentColor}bb` }}>
                  {dirLabels[i]}
                </div>
              </div>
              <div className="h-10 w-px shrink-0" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)" }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className="font-mono text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest"
                    style={{ backgroundColor: `${accentColor}20`, color: textAccent }}
                  >
                    {item.range}
                  </span>
                  <span className={cn("text-[0.85rem] font-semibold", isDark ? "text-white/90" : "text-slate-800")}>
                    {item.stage}
                  </span>
                </div>
                <p className={cn("text-[0.775rem] leading-[1.6]", isDark ? "text-white/45" : "text-slate-600")}>
                  {item.deliverable}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    case "large-paragraph":
      return (
        <p className={cn("text-[1.05rem] sm:text-[1.15rem] leading-[1.8] max-w-2xl font-light", isDark ? "text-white/78" : "text-slate-700")}>
          {block.text}
        </p>
      );

    case "design-rules-cards":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {block.items.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "rounded-xl p-5 border space-y-3 relative overflow-hidden",
                isDark ? "bg-white/[0.04] border-white/6" : "bg-white/60 border-slate-200",
              )}
            >
              <div
                aria-hidden="true"
                className="absolute -right-2 -top-5 font-['Caveat'] text-[72px] leading-none font-bold select-none pointer-events-none"
                style={{ color: isDark ? `${accentColor}12` : `${accentColor}10` }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <span
                className="inline-block font-mono text-[10px] sm:text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest"
                style={{ backgroundColor: `${accentColor}18`, color: textAccent }}
              >
                {card.label}
              </span>
              <p className={cn("text-[0.85rem] leading-[1.75] relative z-10", isDark ? "text-white/62" : "text-slate-600")}>
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      );

    case "design-decisions":
      return (
        <div className="space-y-0">
          {block.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "py-4 flex gap-4 items-start",
                i < block.items.length - 1
                  ? isDark ? "border-b border-white/[0.06]" : "border-b border-slate-200/80"
                  : "",
              )}
            >
              <div
                className="w-[3px] rounded-full shrink-0 self-stretch mt-1"
                style={{ backgroundColor: `${accentColor}55`, minHeight: "1.2rem" }}
              />
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className={cn("text-[0.9rem] font-semibold leading-snug", isDark ? "text-white/90" : "text-slate-900")}>
                  {item.bold}
                </p>
                <p className={cn("text-[0.85rem] leading-[1.75]", isDark ? "text-white/58" : "text-slate-600")}>
                  {item.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      );

    case "pull-quote":
      return (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="py-6 text-center"
        >
          <p
            className="font-['Caveat'] text-[1.4rem] sm:text-[1.75rem] leading-[1.5] mx-auto max-w-2xl italic"
            style={{ color: accentColor }}
          >
            "{block.text}"
          </p>
        </motion.div>
      );

    case "conclusion-statements":
      return (
        <div className="space-y-4">
          {block.items.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-4 items-start pl-1"
            >
              <div
                className="w-[3px] rounded-full shrink-0 self-stretch mt-1"
                style={{ backgroundColor: accentColor, minHeight: "1.4rem" }}
              />
              <p
                className={cn(
                  "text-[1.05rem] leading-[1.65] font-medium",
                  isDark ? "text-white/85" : "text-slate-800",
                )}
              >
                {renderBold(text)}
              </p>
            </motion.div>
          ))}
        </div>
      );

    case "learnings-grid":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {block.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "relative overflow-hidden rounded-2xl border p-5",
                isDark ? "bg-white/[0.04] border-white/6" : "bg-white/60 border-slate-200",
              )}
            >
              <div
                aria-hidden="true"
                className="absolute -right-2 -top-5 font-['Caveat'] text-[72px] leading-none font-bold select-none pointer-events-none"
                style={{ color: isDark ? `${accentColor}10` : `${accentColor}0c` }}
              >
                {item.number}
              </div>
              <div className="relative z-10">
                <span
                  className="mb-2 inline-block font-mono text-[10px] sm:text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${accentColor}20`, color: textAccent }}
                >
                  {item.number}
                </span>
                <p className={cn("text-[0.9rem] font-semibold mb-1.5 leading-snug", isDark ? "text-white/92" : "text-slate-900")}>
                  {item.label}
                </p>
                <p className={cn("text-[0.78rem] leading-[1.65]", isDark ? "text-white/55" : "text-slate-600")}>
                  {item.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      );

    case "closing-quote":
      return (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="py-4 text-center"
        >
          <p
            className="font-['Caveat'] text-[1.35rem] sm:text-[1.6rem] leading-[1.5] mx-auto max-w-2xl"
            style={{ color: accentColor }}
          >
            "{block.text}"
          </p>
        </motion.div>
      );

    case "appendix-blocks":
      return (
        <div className="space-y-6">
          {/* Intro */}
          <p className={cn("text-[0.88rem] leading-[1.75]", isDark ? "text-white/55" : "text-slate-500")}>
            {block.intro}
          </p>
          {/* Numbered blocks */}
          <div className="space-y-8">
            {block.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-3"
              >
                {/* Number + Title */}
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-mono text-[0.75rem] font-semibold tracking-widest shrink-0"
                    style={{ color: textAccent }}
                  >
                    {item.number}
                  </span>
                  <h4 className={cn("font-['Caveat'] text-[1.2rem] sm:text-[1.4rem] leading-tight", isDark ? "text-white/88" : "text-slate-900")}>
                    {item.title}
                  </h4>
                </div>
                {/* Body paragraphs */}
                <div className={cn("space-y-2.5 text-[0.84rem] leading-[1.75] pl-8", isDark ? "text-white/58" : "text-slate-600")}>
                  {item.paragraphs.map((p, j) => (
                    <p key={j}>{renderBold(p)}</p>
                  ))}
                </div>
                {/* Why line */}
                <div
                  className="ml-8 pl-4 py-2"
                  style={{ borderLeft: `2px solid ${accentColor}55` }}
                >
                  <p className={cn("text-[0.8rem] leading-[1.7] italic", isDark ? "text-white/42" : "text-slate-500")}>
                    <span className="not-italic font-medium" style={{ color: textAccent }}>Why it's not in the case study: </span>
                    {item.why}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );

    // ── Gantt Timeline ──────────────────────────────────────────────────────
    case "gantt-timeline": {
      const uxColor = "#7FBB83";
      const uiColor = accentColor;

      const PhaseRow = ({
        phase,
        color,
      }: {
        phase: { label: string; subItems: string[]; startWeek: number; endWeek: number };
        color: string;
      }) => (
        <div className="grid gap-3 items-center" style={{ gridTemplateColumns: "140px 1fr" }}>
          <div className="min-w-0">
            <p className={cn("text-[0.8rem] font-semibold leading-tight", isDark ? "text-white/85" : "text-slate-800")}>
              {phase.label}
            </p>
            <p className={cn("text-[0.7rem] leading-tight mt-0.5", isDark ? "text-white/35" : "text-slate-400")}>
              {phase.subItems.join(" · ")}
            </p>
          </div>
          <div className={cn("relative h-7 rounded-md overflow-hidden", isDark ? "bg-white/6" : "bg-slate-100")}>
            <motion.div
              className="absolute top-0 h-full rounded-md"
              style={{
                left: `${(phase.startWeek / block.totalWeeks) * 100}%`,
                backgroundColor: color,
              }}
              initial={{ width: 0 }}
              whileInView={{ width: `${((phase.endWeek - phase.startWeek) / block.totalWeeks) * 100}%` }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            />
          </div>
        </div>
      );

      return (
        <div className={cn("rounded-xl p-5 border space-y-3", isDark ? "bg-white/[0.03] border-white/6" : "bg-white/60 border-slate-200")}>
          {/* Week header */}
          <div className="grid gap-3 items-start" style={{ gridTemplateColumns: "140px 1fr" }}>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] pt-0.5" style={{ color: isDark ? "rgba(255,255,255,0.72)" : "#475569" }}>
              Phase
            </p>
            <div className="flex flex-col gap-1">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: isDark ? "rgba(255,255,255,0.72)" : "#475569" }}>
                Week →
              </p>
              <div className="flex">
                {Array.from({ length: block.totalWeeks }).map((_, i) => (
                  <div key={i} className="flex-1 text-center font-mono font-semibold text-[10px] sm:text-[9px]" style={{ color: isDark ? "rgba(255,255,255,0.60)" : "#64748B" }}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* UX phases */}
          <div className="space-y-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] mb-2" style={{ color: uxColor }}>
              UX Design
            </p>
            {block.uxPhases.map((phase, i) => (
              <PhaseRow key={i} phase={phase} color={uxColor} />
            ))}
          </div>

          {/* Divider */}
          <div className={cn("h-px w-full", isDark ? "bg-white/8" : "bg-slate-200")} />

          {/* UI phases */}
          <div className="space-y-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] mb-2" style={{ color: uiColor }}>
              UI Design
            </p>
            {block.uiPhases.map((phase, i) => (
              <PhaseRow key={i} phase={phase} color={uiColor} />
            ))}
          </div>
        </div>
      );
    }

    // ── Process Phase Cards ─────────────────────────────────────────────────
    case "process-phase-cards": {
      const iconMap: Record<string, React.ReactNode> = {
        users: <Users className="w-6 h-6 text-slate-700" />,
        target: <Target className="w-6 h-6 text-slate-700" />,
        lightbulb: <Lightbulb className="w-6 h-6 text-slate-700" />,
        layers: <Layers className="w-6 h-6 text-slate-700" />,
        check: <CheckCircle className="w-6 h-6 text-slate-700" />,
      };
      return (
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {block.items.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="rounded-2xl p-5 flex flex-col gap-3 flex-1 min-w-[175px]"
              style={{ backgroundColor: "#7FBB83" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/10 shrink-0">
                {iconMap[card.iconType]}
              </div>
              <p className="font-bold text-[0.9rem] text-slate-900 leading-tight">{card.title}</p>
              <ul className="space-y-2 flex-1">
                {card.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-2 text-[0.75rem] text-slate-700 leading-[1.5]">
                    <span className="mt-[5px] h-1.5 w-1.5 rounded-full shrink-0 bg-slate-600" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      );
    }

    // ── IA Tree ─────────────────────────────────────────────────────────────
    case "ia-tree": {
      const orange = "#FB7800";
      // Brighter lines so branches are clearly visible
      const lineColor = isDark ? "rgba(255,255,255,0.50)" : "#94A3B8";
      const subTextFill = isDark ? "rgba(255,255,255,0.72)" : "#374151";
      const bgFill = isDark ? "rgba(255,255,255,0.02)" : "#FFFFFF";
      const sw = "2"; // stroke width

      return (
        <div className={cn("rounded-xl border overflow-hidden", isDark ? "border-white/8" : "border-slate-200")}>
          <div className="overflow-x-auto">
            <svg
              viewBox="0 0 1040 400"
              style={{ minWidth: "860px", width: "100%", height: "auto", display: "block" }}
            >
              <rect width="1040" height="400" fill={bgFill} />

              {/* ─ Root Node ─ */}
              <rect x="450" y="16" width="140" height="34" rx="9" fill={orange} />
              <text x="520" y="38" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="system-ui,sans-serif">Login Portal</text>

              {/* Root → Level 1 (H-bar) */}
              <line x1="520" y1="50" x2="520" y2="84" stroke={lineColor} strokeWidth={sw} />
              <line x1="355" y1="84" x2="685" y2="84" stroke={lineColor} strokeWidth={sw} />
              <line x1="355" y1="84" x2="355" y2="100" stroke={lineColor} strokeWidth={sw} />
              <line x1="685" y1="84" x2="685" y2="100" stroke={lineColor} strokeWidth={sw} />

              {/* ─ Level 1 Nodes ─ */}
              <rect x="315" y="100" width="80" height="32" rx="9" fill={orange} />
              <text x="355" y="121" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="system-ui,sans-serif">Login</text>

              <rect x="638" y="100" width="94" height="32" rx="9" fill={orange} />
              <text x="685" y="121" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="system-ui,sans-serif">Signout</text>

              {/* Login → Level 2 (fan) */}
              <line x1="355" y1="132" x2="355" y2="168" stroke={lineColor} strokeWidth={sw} />
              {/* Horizontal bus spanning all 6 child centers */}
              <line x1="62" y1="168" x2="940" y2="168" stroke={lineColor} strokeWidth={sw} />
              {/* Vertical stubs to each L2 node */}
              {[62, 210, 373, 545, 728, 940].map((cx) => (
                <line key={cx} x1={cx} y1="168" x2={cx} y2="188" stroke={lineColor} strokeWidth={sw} />
              ))}

              {/* ─ Level 2 Nodes ─ */}
              {/* Profile — center 62 */}
              <rect x="28" y="188" width="68" height="32" rx="8" fill={orange} />
              <text x="62" y="209" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="system-ui,sans-serif">Profile</text>

              {/* Raise an Issue — center 210 */}
              <rect x="158" y="188" width="104" height="32" rx="8" fill={orange} />
              <text x="210" y="209" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="system-ui,sans-serif">Raise an Issue</text>

              {/* Calendar — center 373 */}
              <rect x="333" y="188" width="80" height="32" rx="8" fill={orange} />
              <text x="373" y="209" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="system-ui,sans-serif">Calendar</text>

              {/* View Dept. Members — center 545, two lines */}
              <rect x="488" y="186" width="114" height="36" rx="8" fill={orange} />
              <text x="545" y="202" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="system-ui,sans-serif">View Dept.</text>
              <text x="545" y="217" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="system-ui,sans-serif">Members</text>

              {/* Hall of Fame — center 728 */}
              <rect x="682" y="188" width="92" height="32" rx="8" fill={orange} />
              <text x="728" y="209" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="system-ui,sans-serif">Hall of Fame</text>

              {/* Open Positions — center 940 */}
              <rect x="892" y="188" width="104" height="32" rx="8" fill={orange} />
              <text x="944" y="209" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="system-ui,sans-serif">Open Positions</text>

              {/* Level 2 → sub-item connectors */}
              {[62, 210, 373, 545, 944].map((cx) => (
                <line key={`sub-${cx}`} x1={cx} y1="220" x2={cx} y2="238" stroke={lineColor} strokeWidth="1.5" />
              ))}

              {/* ─ Sub-items (fontSize 11, spacing 18px) ─ */}
              {/* Profile */}
              {["Name / Age / DOB", "Documents", "Status", "Department", "Achievements", "Salary Details", "Update Profile"].map((t, i) => (
                <text key={i} x="62" y={252 + i * 18} textAnchor="middle" fill={subTextFill} fontSize="11" fontFamily="system-ui,sans-serif">{t}</text>
              ))}
              {/* Raise Issue */}
              <text x="210" y="252" textAnchor="middle" fill={subTextFill} fontSize="11" fontFamily="system-ui,sans-serif">Fill Survey</text>
              {/* Calendar */}
              {["Upcoming Events", "Holidays", "Available Leaves", "Apply for Leave"].map((t, i) => (
                <text key={i} x="373" y={252 + i * 18} textAnchor="middle" fill={subTextFill} fontSize="11" fontFamily="system-ui,sans-serif">{t}</text>
              ))}
              {/* View Members */}
              <text x="545" y="252" textAnchor="middle" fill={subTextFill} fontSize="11" fontFamily="system-ui,sans-serif">Name / Age / DOB / CD</text>
              {/* Open Positions */}
              <text x="944" y="252" textAnchor="middle" fill={subTextFill} fontSize="11" fontFamily="system-ui,sans-serif">Send Applications</text>
            </svg>
          </div>
        </div>
      );
    }

    // ── Design Laws ─────────────────────────────────────────────────────────
    case "design-laws": {
      return (
        <div className="relative space-y-0 pl-10">
          {/* Dashed vertical line */}
          <div
            className="absolute left-[18px] top-5 bottom-5 border-l-2 border-dashed"
            style={{ borderColor: isDark ? `${accentColor}30` : `${accentColor}40` }}
          />

          {block.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative pb-8 last:pb-0"
            >
              {/* Number circle */}
              <div
                className="absolute -left-10 top-0 w-9 h-9 rounded-full flex items-center justify-center font-mono text-[13px] font-bold shrink-0 z-10 shadow-sm"
                style={{
                  backgroundColor: accentColor,
                  color: "rgba(0,0,0,0.82)",
                  boxShadow: isDark ? `0 0 0 4px rgba(0,0,0,0.4), 0 0 12px ${accentColor}40` : `0 0 0 4px white`,
                }}
              >
                {i + 1}
              </div>

              {/* Content */}
              <div className={cn("rounded-xl p-5 border ml-1", isDark ? "bg-white/[0.04] border-white/6" : "bg-white/70 border-slate-200")}>
                <p className="text-[0.95rem] font-semibold mb-3" style={{ color: accentColor }}>
                  {item.name}
                </p>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.18em] shrink-0 mt-[2px]", isDark ? "text-white/55" : "text-slate-500")}>
                      Concept
                    </span>
                    <p className={cn("text-[0.825rem] leading-[1.65]", isDark ? "text-white/65" : "text-slate-700")}>
                      {item.concept}
                    </p>
                  </div>
                  <div className={cn("h-px", isDark ? "bg-white/6" : "bg-slate-100")} />
                  <div className="flex gap-2">
                    <span className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.18em] shrink-0 mt-[2px]", isDark ? "text-white/55" : "text-slate-500")}>
                      Applied
                    </span>
                    <p className={cn("text-[0.825rem] leading-[1.65]", isDark ? "text-white/55" : "text-slate-600")}>
                      {item.implementation}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );
    }

    // ── Before & After ──────────────────────────────────────────────────────
    case "before-after": {
      // Reusable image display — matches PlaceholderImage style when no src
      const ScreenImage = ({ src, label, clr }: { src?: string; label: string; clr: string }) =>
        src ? (
          <div
            className="w-full rounded-xl overflow-hidden border border-white/5"
            style={{ background: `linear-gradient(135deg, ${clr}22 0%, ${clr}08 100%)` }}
          >
            <img src={src} alt={label} loading="lazy" decoding="async" className="w-full h-auto block" />
          </div>
        ) : (
          <div
            className="w-full aspect-video rounded-xl flex flex-col items-center justify-center gap-3 border border-white/5"
            style={{ background: `linear-gradient(135deg, ${clr}22 0%, ${clr}08 100%)` }}
          >
            <ImageIcon className="w-7 h-7 opacity-20" style={{ color: clr }} />
            <div className="text-center space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-30" style={{ color: clr }}>{label}</p>
              <p className="font-mono text-[10px] sm:text-[9px] opacity-20" style={{ color: clr }}>Screenshot Coming Soon</p>
            </div>
          </div>
        );

      const beforeClr = isDark ? "#f87171" : "#ef4444";

      return (
        <div className="flex flex-col gap-6">
          {/* ── BEFORE ── */}
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div>
              <p className={cn("text-[0.8rem] font-bold uppercase tracking-wider", isDark ? "text-red-400/80" : "text-red-500")}>
                {block.beforeTitle}
              </p>
              <p className={cn("text-[0.72rem] mt-0.5", isDark ? "text-white/35" : "text-slate-500")}>
                {block.beforeDescription}
              </p>
            </div>
            {/* Bullets */}
            <ul className="space-y-2.5">
              {block.beforeItems.map((item, i) => (
                <li key={i} className={cn("flex items-start gap-2.5 text-[0.85rem] leading-[1.6]", isDark ? "text-white/55" : "text-slate-600")}>
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full shrink-0 bg-red-400/60" />
                  {item}
                </li>
              ))}
            </ul>
            {/* Full-width image */}
            <ScreenImage src={block.beforeImage} label="Before Screenshot" clr={beforeClr} />
          </div>

          {/* ── ARROW divider ── */}
          <div className="flex items-center justify-center gap-3 py-2">
            <div className={cn("h-px flex-1 opacity-20", isDark ? "bg-white" : "bg-slate-400")} />
            <svg width="36" height="36" viewBox="0 0 36 36">
              <path
                d="M18 4 L18 28 M10 20 L18 28 L26 20"
                stroke={accentColor}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 3"
              />
            </svg>
            <div className={cn("h-px flex-1 opacity-20", isDark ? "bg-white" : "bg-slate-400")} />
          </div>

          {/* ── AFTER ── */}
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div>
              <p className="text-[0.8rem] font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                {block.afterTitle}
              </p>
              <p className={cn("text-[0.72rem] mt-0.5", isDark ? "text-white/35" : "text-slate-500")}>
                {block.afterDescription}
              </p>
            </div>
            {/* Full-width image first */}
            <ScreenImage src={block.afterImage} label="After Screenshot" clr={accentColor} />
            {/* Bullets below */}
            <ul className="space-y-2.5">
              {block.afterItems.map((item, i) => (
                <li key={i} className={cn("flex items-start gap-2.5 text-[0.85rem] leading-[1.6]", isDark ? "text-white/65" : "text-slate-700")}>
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    // ── YIF Persona (single — not used directly, only via pair) ─────────────
    case "yif-persona":
      return null;

    // ── YIF Persona Pair ────────────────────────────────────────────────────
    case "yif-persona-pair": {
      return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {block.personas.map((persona, idx) => {
            const nameColor = accentColor;
            const bgStyle = isDark
              ? { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }
              : idx === 0
              ? { background: "radial-gradient(circle at 20% 10%, rgba(251,120,0,0.08), transparent 50%), linear-gradient(135deg,#fff7f0,#fde8dc)", borderColor: "rgba(251,120,0,0.2)" }
              : { background: "radial-gradient(circle at 80% 10%, rgba(127,187,131,0.10), transparent 50%), linear-gradient(135deg,#f0fbf1,#e4f5e5)", borderColor: "rgba(127,187,131,0.25)" };

            return (
              <div
                key={persona.name}
                className="rounded-2xl border flex flex-col gap-0 overflow-hidden"
                style={bgStyle}
              >
                {/* Header */}
                <div className={cn("flex items-center gap-4 p-5 pb-4", isDark ? "border-b border-white/6" : "border-b border-black/5")}>
                  {/* Avatar */}
                  <div
                    className="w-16 h-16 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-xl font-bold ring-2 ring-white/20"
                    style={{
                      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
                    }}
                  >
                    {persona.avatarPhoto
                      ? <img src={persona.avatarPhoto} alt={persona.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      : persona.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[1.05rem] leading-tight" style={{ color: nameColor }}>
                      {persona.name}
                    </p>
                    <p className={cn("text-[0.75rem] mt-0.5", isDark ? "text-white/45" : "text-slate-500")}>
                      {persona.occupation} · Age {persona.age}
                    </p>
                    <p className={cn("text-[0.7rem]", isDark ? "text-white/30" : "text-slate-400")}>
                      {persona.education} · {persona.location}
                    </p>
                  </div>
                </div>

                {/* Story */}
                <div className="px-5 py-4">
                  <p className={cn("text-[0.8rem] leading-[1.7] italic", isDark ? "text-white/55" : "text-slate-600")}>
                    "{persona.story}"
                  </p>
                </div>

                {/* Goals + Pain Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                  <div className={cn("px-5 pb-4", isDark ? "border-r-0 sm:border-r border-white/6" : "border-r-0 sm:border-r border-black/5")}>
                    <p className={cn("font-mono text-[9px] uppercase tracking-[0.2em] mb-2", isDark ? "text-white/55" : "text-slate-500")}>
                      Goals
                    </p>
                    <ul className="space-y-1.5">
                      {persona.goals.map((g, i) => (
                        <li key={i} className={cn("flex items-start gap-2 text-[0.775rem] leading-[1.55]", isDark ? "text-white/60" : "text-slate-700")}>
                          <span className="mt-[5px] h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: nameColor }} />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-5 pb-4">
                    <p className={cn("font-mono text-[9px] uppercase tracking-[0.2em] mb-2", isDark ? "text-white/55" : "text-slate-500")}>
                      Pain Points
                    </p>
                    <ul className="space-y-1.5">
                      {persona.painPoints.map((p, i) => (
                        <li key={i} className={cn("flex items-start gap-2 text-[0.775rem] leading-[1.55]", isDark ? "text-white/60" : "text-slate-700")}>
                          <span className="mt-[5px] h-1 w-1 rounded-full shrink-0 bg-red-400/60" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Needs */}
                <div
                  className={cn("mx-4 mb-4 rounded-lg px-4 py-3 border-l-[3px]")}
                  style={{
                    borderLeftColor: nameColor,
                    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.5)",
                  }}
                >
                  <span className={cn("font-mono text-[9px] uppercase tracking-[0.18em] mr-2", isDark ? "text-white/55" : "text-slate-500")}>
                    Needs
                  </span>
                  <span className={cn("text-[0.775rem] leading-[1.6]", isDark ? "text-white/58" : "text-slate-600")}>
                    {persona.needs}
                  </span>
                </div>

                {/* Motivations (optional) */}
                {persona.motivations && persona.motivations.length > 0 && (
                  <div className="px-5 pb-5">
                    <p className={cn("font-mono text-[9px] uppercase tracking-[0.2em] mb-2", isDark ? "text-white/55" : "text-slate-500")}>
                      Motivations
                    </p>
                    <ul className="space-y-1">
                      {persona.motivations.map((m, i) => (
                        <li key={i} className={cn("flex items-start gap-2 text-[0.775rem] leading-[1.55]", isDark ? "text-white/50" : "text-slate-600")}>
                          <span className="mt-[5px] h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: "#7FBB83" }} />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // ── Executive Summary ──────────────────────────────────────────────────
    case "exec-summary":
      return (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-7"
        >
          <div className="space-y-5 max-w-[680px]">
            {block.paragraphs.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={cn("text-[1.02rem] leading-[1.72]", isDark ? "text-white/72" : "text-slate-700")}
              >
                {para}
              </motion.p>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn("flex flex-wrap items-start gap-x-10 gap-y-5 pt-6 border-t", isDark ? "border-white/10" : "border-slate-200")}
          >
            {block.metrics.map((m, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span
                  className="font-['Caveat'] text-[2.1rem] leading-none font-semibold"
                  style={{ color: accentColor }}
                >
                  {m.value}
                </span>
                <span className={cn("font-mono text-[10px] uppercase tracking-[0.22em]", isDark ? "text-white/50" : "text-slate-500")}>
                  {m.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      );

    // ── Foundation Statement ───────────────────────────────────────────────
    case "foundation-statement":
      return (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="pt-16 space-y-4 max-w-[680px]"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-mono text-[10px] uppercase tracking-[0.32em]"
            style={{ color: textAccent }}
          >
            {block.overline}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn("text-[1.55rem] sm:text-[1.7rem] leading-[1.3] font-normal", isDark ? "text-white/92" : "text-slate-900")}
          >
            {block.statement}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn("text-[1.0rem] leading-[1.72]", isDark ? "text-white/62" : "text-slate-600")}
          >
            {renderBold(block.body)}
          </motion.p>
        </motion.div>
      );

    // ── Research Block ─────────────────────────────────────────────────────
    case "research-block": {
      const voiceBorder = isDark
        ? [`${accentColor}70`, "rgba(255,255,255,0.14)"]
        : [`${accentColor}55`, "rgba(0,0,0,0.10)"];
      return (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-8 max-w-[680px]"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="font-mono text-[10px] uppercase tracking-[0.32em]"
            style={{ color: textAccent }}
          >
            {block.overline}
          </motion.p>
          <div className="flex flex-wrap items-start gap-x-10 gap-y-4">
            {block.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col gap-1"
              >
                <span className={cn("font-mono text-[1.55rem] font-medium leading-none tabular-nums", isDark ? "text-white/90" : "text-slate-800")}>
                  {stat.value}
                </span>
                <span className={cn("font-mono text-[10px] uppercase tracking-[0.18em]", isDark ? "text-white/55" : "text-slate-500")}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="space-y-5">
            {block.paragraphs.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={cn("text-[1.0rem] leading-[1.78] pl-4", isDark ? "text-white/70" : "text-slate-700")}
                style={{ borderLeft: `2px solid ${voiceBorder[i % 2]}` }}
              >
                {renderRich(para.text, textAccent)}
              </motion.p>
            ))}
          </div>
        </motion.div>
      );
    }

    // ── Problem Callout ────────────────────────────────────────────────────
    case "problem-callout":
      return (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="pt-16 max-w-[680px]"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="font-mono text-[10px] uppercase tracking-[0.32em] mb-5"
            style={{ color: textAccent }}
          >
            {block.overline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-r-xl px-8 py-9"
            style={{
              borderLeft: `3px solid ${accentColor}`,
              background: isDark ? `${accentColor}10` : `${accentColor}08`,
            }}
          >
            <p className={cn("text-[1.18rem] sm:text-[1.3rem] leading-[1.68] font-normal", isDark ? "text-white/88" : "text-slate-800")}>
              {renderBoldAccent(block.text, textAccent)}
            </p>
          </motion.div>
        </motion.div>
      );

    // ── Research Goals ─────────────────────────────────────────────────────
    case "research-goals":
      return (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-5 max-w-[820px]"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="font-mono text-[10px] uppercase tracking-[0.32em]"
            style={{ color: textAccent }}
          >
            RESEARCH GOALS
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {block.goals.map((goal, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="rounded-xl p-6 flex flex-col gap-2"
                style={{ background: tone("goal", isDark).surface }}
              >
                <span className={cn("font-semibold text-[0.875rem]", isDark ? "text-white/88" : "text-slate-800")}>
                  {goal.id}
                </span>
                <span className={cn("text-[0.875rem] leading-[1.65]", isDark ? "text-white/68" : "text-slate-700")}>
                  {goal.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

    // ── Research Questions ─────────────────────────────────────────────────
    case "research-questions":
      return (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-5 pt-16 max-w-[820px]"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="font-mono text-[10px] uppercase tracking-[0.32em]"
            style={{ color: textAccent }}
          >
            RESEARCH QUESTIONS
          </motion.p>
          <div className={cn("rounded-xl border overflow-hidden", isDark ? "border-white/8" : "border-slate-200")}>
            <div className={cn(
              "hidden sm:grid gap-x-5 px-5 py-3",
              "grid-cols-[100px_1fr_110px]",
              isDark ? "border-b border-white/8" : "border-b border-slate-200 bg-slate-50/60",
            )}>
              {["TYPE", "RESEARCH QUESTION", "ROLE"].map((h) => (
                <span key={h} className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.18em]", isDark ? "text-white/55" : "text-slate-500")}>
                  {h}
                </span>
              ))}
            </div>
            {block.rows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={cn(
                  "grid gap-y-2.5 sm:gap-x-5 items-start px-5 py-4",
                  "grid-cols-1 sm:grid-cols-[100px_1fr_110px]",
                  i < block.rows.length - 1 ? (isDark ? "border-b border-white/[0.07]" : "border-b border-slate-100") : "",
                )}
              >
                <div className="flex items-center gap-3 sm:block sm:pt-0.5">
                  <span
                    className="font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.1em] px-2 py-[3px] rounded"
                    style={(() => {
                      const t = tone(row.questionType === "GENERATIVE" ? "generative" : "evaluative", isDark);
                      return { background: t.bg, color: t.fg };
                    })()}
                  >
                    {row.questionType}
                  </span>
                  <span className={cn("sm:hidden text-[0.8rem]", isDark ? "text-white/60" : "text-slate-500")}>
                    {row.role}
                  </span>
                </div>
                <p className={cn("text-[0.875rem] leading-[1.65]", isDark ? "text-white/72" : "text-slate-700")}>
                  {row.question}
                </p>
                <span className={cn("hidden sm:block text-[0.825rem] leading-[1.65]", isDark ? "text-white/42" : "text-slate-500")}>
                  {row.role}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

    // ── Success Metrics ────────────────────────────────────────────────────
    case "success-metrics":
      return (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-5 pt-16 max-w-[820px]"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="font-mono text-[10px] uppercase tracking-[0.32em]"
            style={{ color: textAccent }}
          >
            SUCCESS METRICS
          </motion.p>
          <div className={cn("rounded-xl border overflow-hidden", isDark ? "border-white/8" : "border-slate-200")}>
            <div className={cn(
              "hidden sm:grid grid-cols-4 gap-x-4 px-5 py-3",
              isDark ? "border-b border-white/8" : "border-b border-slate-200 bg-slate-50/60",
            )}>
              {["METRIC", "BASELINE", "TARGET", "OUTCOME"].map((h) => (
                <span key={h} className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.18em]", isDark ? "text-white/55" : "text-slate-500")}>
                  {h}
                </span>
              ))}
            </div>
            {block.rows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.09 }}
                className={cn(
                  "grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-3 items-start sm:items-center px-5 py-5",
                  i < block.rows.length - 1 ? (isDark ? "border-b border-white/[0.07]" : "border-b border-slate-100") : "",
                )}
              >
                <span className={cn("col-span-3 sm:col-span-1 text-[0.875rem] font-semibold", isDark ? "text-white/85" : "text-slate-800")}>
                  {row.metric}
                </span>
                {([
                  { label: "Baseline", value: row.baseline, className: isDark ? "text-white/40" : "text-slate-500", style: undefined },
                  { label: "Target", value: row.target, className: "", style: { color: textAccent } },
                  { label: "Outcome", value: row.outcome, className: "font-semibold", style: { color: tone("positive", isDark).fg } },
                ]).map((cell) => (
                  <div key={cell.label} className="min-w-0">
                    <span className={cn("sm:hidden block font-mono text-[10px] uppercase tracking-[0.14em] mb-1", isDark ? "text-white/50" : "text-slate-500")}>
                      {cell.label}
                    </span>
                    <span className={cn("text-[0.875rem]", cell.className)} style={cell.style}>
                      {cell.value}
                    </span>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

    // ── What I Found ───────────────────────────────────────────────────────
    case "what-i-found":
      return (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-4 pt-16 max-w-[680px]"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="font-mono text-[10px] uppercase tracking-[0.32em]"
            style={{ color: textAccent }}
          >
            WHAT I FOUND
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn("text-[1.05rem] leading-[1.82]", isDark ? "text-white/75" : "text-slate-700")}
          >
            {renderBold(block.text)}
          </motion.p>
        </motion.div>
      );

    // ── Ideation Cards ─────────────────────────────────────────────────────
    case "ideation-cards":
      return (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-7 pt-16"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="font-mono text-[10px] uppercase tracking-[0.32em]"
            style={{ color: textAccent }}
          >
            IDEATION
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn("text-[1.0rem] leading-[1.75] max-w-[680px]", isDark ? "text-white/72" : "text-slate-700")}
          >
            {renderBold(block.openingLine)}
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[900px]">
            {block.cards.map((card, i) => {
              const isSelected = card.status === "selected";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="rounded-xl p-7 flex flex-col gap-3"
                  style={{
                    background: isSelected
                      ? isDark ? `${accentColor}14` : `${accentColor}0d`
                      : tone("negative", isDark).surface,
                  }}
                >
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.12em] px-2.5 py-[3px] rounded"
                      style={{
                        background: tone(isSelected ? "positive" : "negative", isDark).bg,
                        color: tone(isSelected ? "positive" : "negative", isDark).fg,
                      }}
                    >
                      {isSelected
                        ? <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                        : <X className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />}
                      {isSelected ? "Selected" : "Rejected"}
                    </span>
                  </div>
                  <p
                    className={cn("text-[0.95rem] font-semibold leading-snug", !isSelected && (isDark ? "text-white/82" : "text-slate-800"))}
                    style={isSelected ? { color: textAccent } : undefined}
                  >
                    {card.title}
                  </p>
                  <p className={cn("text-[0.85rem] leading-[1.65]", isDark ? "text-white/60" : "text-slate-600")}>
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn("text-[1.0rem] leading-[1.75] max-w-[680px] pt-2", isDark ? "text-white/72" : "text-slate-700")}
          >
            {renderBold(block.closingLine)}
          </motion.p>
        </motion.div>
      );

    default:
      return null;
  }
}

// ─── Section Renderer ─────────────────────────────────────────────────────────

function SectionContent({
  section,
  isDark,
  accentColor,
  sectionIndex,
  sectionRef,
}: {
  section: CaseStudySection;
  isDark: boolean;
  accentColor: string;
  sectionIndex: number;
  sectionRef: (el: HTMLElement | null) => void;
}) {
  if (section.isAppendix) {
    return (
      <motion.section
        id={section.id}
        ref={sectionRef}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="scroll-mt-24 pt-10 mt-8"
      >
        {/* Full-width hairline separator */}
        <div className={cn("h-px w-full mb-10", isDark ? "bg-white/10" : "bg-slate-200")} />
        {/* Appendix overline label */}
        <p className="font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.32em] mb-3"
          style={{ color: isDark ? getLightAccent(accentColor) : accentColor }}>
          A note on scope
        </p>
        <h2 className={cn("font-['Caveat'] text-3xl sm:text-4xl leading-tight mb-6", isDark ? "text-white/88" : "text-slate-800")}>
          {section.title}
        </h2>
        <div className="space-y-5">
          {section.blocks.map((block, i) => (
            <BlockRenderer key={i} block={block} isDark={isDark} accentColor={accentColor} sectionIndex={sectionIndex} />
          ))}
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      id={section.id}
      ref={sectionRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6 scroll-mt-24"
    >
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] shrink-0 mt-0.5"
          style={{ color: isDark ? getLightAccent(accentColor) : accentColor }}>
          {section.number}
        </span>
        <h2 className={cn("font-['Caveat'] text-3xl sm:text-4xl leading-tight", isDark ? "text-white/92" : "text-slate-900")}>
          {section.titleParts
            ? section.titleParts.map((part, i) => (
                <span key={i} style={part.accent ? { color: accentColor } : undefined}>
                  {part.text}
                </span>
              ))
            : section.title}
        </h2>
      </div>
      <div className={cn("h-px w-full", isDark ? "bg-white/8" : "bg-blue-100")} />
      <div className="space-y-5">
        {section.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} isDark={isDark} accentColor={accentColor} sectionIndex={sectionIndex} />
        ))}
      </div>
    </motion.section>
  );
}

// ─── Sidebar TOC ──────────────────────────────────────────────────────────────

function SidebarTOC({
  sections, activeSection, isDark, accentColor, behanceUrl, onSectionClick,
}: {
  sections: CaseStudySection[];
  activeSection: string;
  isDark: boolean;
  accentColor: string;
  behanceUrl: string;
  onSectionClick: (id: string) => void;
}) {
  const navSections = sections.filter(s => !s.isAppendix);
  const isGrouped = navSections.some(s => s.group);

  // Build ordered group list
  const groups: { label: string; items: CaseStudySection[] }[] = [];
  if (isGrouped) {
    const seen = new Map<string, CaseStudySection[]>();
    navSections.forEach(s => {
      const g = s.group ?? "Other";
      if (!seen.has(g)) seen.set(g, []);
      seen.get(g)!.push(s);
    });
    seen.forEach((items, label) => groups.push({ label, items }));
  }

  const activeGroup = isGrouped
    ? (navSections.find(s => s.id === activeSection)?.group ?? groups[0]?.label)
    : null;

  const sectionButton = (section: CaseStudySection, indented = false) => {
    const isActive = activeSection === section.id;
    return (
      <button key={section.id} type="button" onClick={() => onSectionClick(section.id)}
        className={cn(
          "w-full text-left py-1.5 rounded-lg text-[0.8rem] transition-all duration-200 flex items-center gap-2.5",
          indented ? "pl-5 pr-3" : "px-3",
          isActive
            ? isDark ? "text-white/95" : "text-slate-900"
            : isDark ? "text-white/72 hover:text-white/90" : "text-slate-600 hover:text-slate-900",
        )}>
        <span className={cn("h-1 w-1 rounded-full shrink-0 transition-all duration-200", isActive ? "scale-125" : "scale-75 opacity-50")}
          style={{ backgroundColor: isActive ? (isDark ? "#3B6FD4" : accentColor) : "currentColor" }} />
        <span className={cn("font-mono text-[10px] sm:text-[9px] shrink-0", isDark ? "text-white/60" : "text-slate-500")}>{section.number}</span>
        <span className={isActive ? "font-medium" : ""}>{section.shortTitle}</span>
      </button>
    );
  };

  return (
    <aside className="sticky top-20 h-fit w-52 shrink-0 py-2 hidden lg:flex flex-col gap-0.5 overflow-y-auto max-h-[calc(100vh-6rem)]">
      <p className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.25em] px-3 mb-2", isDark ? "text-white/65" : "text-slate-600")}>
        Contents
      </p>

      {isGrouped ? (
        /* ── Grouped layout (e.g. CPI) ── */
        <div className="flex flex-col gap-0.5">
          {groups.map(({ label, items }) => {
            const isActiveGroup = label === activeGroup;
            return (
              <div key={label} className="flex flex-col">
                {/* Group label */}
                <p className={cn(
                  "px-3 pt-3 pb-1 font-mono text-[8.5px] uppercase tracking-[0.28em] transition-colors duration-200 select-none",
                  isActiveGroup
                    ? isDark ? "text-white/85" : "text-slate-800"
                    : isDark ? "text-white/65" : "text-slate-600",
                )}>
                  {label}
                </p>
                {/* Animated section list */}
                <AnimatePresence initial={false}>
                  {isActiveGroup && (
                    <motion.div
                      key="items"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      {items.map(s => sectionButton(s, true))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Flat layout (e.g. XARISS) ── */
        navSections.map(s => sectionButton(s, false))
      )}

      <div className={cn("h-px w-full my-3", isDark ? "bg-white/8" : "bg-slate-200")} />
      <a href={behanceUrl} target="_blank" rel="noopener noreferrer"
        className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-[0.75rem] transition-all duration-200",
          isDark ? "text-white/72 hover:text-white/90" : "text-slate-600 hover:text-slate-900")}>
        <ExternalLink className="w-3 h-3 shrink-0" />
        <span>View on Behance</span>
      </a>
    </aside>
  );
}

// ─── Mobile Pills ─────────────────────────────────────────────────────────────

function MobileSectionPills({
  sections, activeSection, isDark, accentColor, onSectionClick,
}: {
  sections: CaseStudySection[];
  activeSection: string;
  isDark: boolean;
  accentColor: string;
  onSectionClick: (id: string) => void;
}) {
  return (
    <div className={cn("lg:hidden sticky top-14 z-20 border-b overflow-x-auto",
      isDark ? "bg-[#1a1a2e]/90 border-white/8 backdrop-blur-md" : "bg-white/85 border-blue-100 backdrop-blur-md")}>
      <div className="flex items-center gap-0.5 px-3.5 py-0.5 min-w-max">
        {sections.filter(s => !s.isAppendix).map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button key={section.id} type="button" onClick={() => onSectionClick(section.id)}
              aria-current={isActive ? "true" : undefined}
              className="group/pill flex min-h-11 items-center px-0.5">
              <span
                className={cn("px-3 py-1.5 rounded-full text-[11px] transition-all duration-200 whitespace-nowrap",
                  isActive ? "text-white font-medium" : isDark ? "text-white/65 group-hover/pill:text-white/85" : "text-slate-500 group-hover/pill:text-slate-800")}
                style={isActive ? { backgroundColor: isDark ? "#3B6FD4" : accentColor } : undefined}>
                {section.shortTitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CaseStudyView({ slug, isDark, onClose }: CaseStudyViewProps) {
  const study = getCaseStudyBySlug(slug);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const accentColor = isDark ? study?.accentColorDark ?? "#3B6FD4" : study?.accentColor ?? "#1a2744";

  // ── IntersectionObserver ──────────────────────────────────────────────────
  useEffect(() => {
    if (!study) return;
    const observers: IntersectionObserver[] = [];
    study.sections.forEach((section) => {
      const el = sectionRefs.current[section.id];
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(section.id); });
        },
        { root: containerRef.current, rootMargin: "-20% 0px -70% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [study]);

  function scrollToSection(id: string) {
    const el = sectionRefs.current[id];
    const container = containerRef.current;
    if (!el || !container) return;
    const offset = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 100;
    container.scrollTo({ top: offset, behavior: "smooth" });
  }

  if (!study) return null;

  return (
    <motion.div
      key={`case-study-${slug}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "fixed inset-0 z-20 flex flex-col",
        isDark
          ? "bg-gradient-to-b from-[#1a1a2e] via-[#252541] to-[#2d2d4a] text-white"
          : "text-slate-900",
      )}
      style={!isDark ? {
        background: "radial-gradient(circle at 80% 20%, rgba(55,132,255,0.18), transparent 40%), linear-gradient(180deg, #edf4ff 0%, #e4ebff 48%, #f0f6ff 100%)",
      } : undefined}
    >
      {/* ── Background effects (dark mode only) ──────────────────────────── */}
      {isDark && (
        <>
          <GridBackground isDark={isDark} />
          <StarField isDark={isDark} />
        </>
      )}

      {/* ── Top Header ───────────────────────────────────────────────────── */}
      <header className={cn(
        "relative z-30 sticky top-0 flex items-center justify-between px-5 sm:px-8 h-14 border-b shrink-0",
        isDark ? "bg-[#1a1a2e]/80 backdrop-blur-md border-white/8" : "bg-white/70 backdrop-blur-md border-blue-100",
      )}>
        <button type="button" onClick={onClose}
          className={cn("-ml-2 flex min-h-11 items-center gap-2 px-2 text-[0.8rem] transition-all duration-200 group",
            isDark ? "text-white/72 hover:text-white/95" : "text-slate-600 hover:text-slate-900")}>
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Back to Work</span>
        </button>

        <div className="flex items-center gap-2">
          <span className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.2em]", isDark ? "text-white/60" : "text-slate-500")}>
            Case Study
          </span>
          <span className={cn("h-3 w-px", isDark ? "bg-white/15" : "bg-blue-200")} />
          <span className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.15em] font-medium", isDark ? "text-white/60" : "text-blue-700")}>
            {study.slug.toUpperCase()}
          </span>
        </div>

        <a href={study.behanceUrl} target="_blank" rel="noopener noreferrer"
          className={cn("hidden sm:flex items-center gap-1.5 text-[0.75rem] transition-all duration-200 group",
            isDark ? "text-white/35 hover:text-white/70" : "text-slate-400 hover:text-blue-700")}>
          <span>Behance</span>
          <ExternalLink className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </header>

      {/* ── Mobile Pills ─────────────────────────────────────────────────── */}
      <MobileSectionPills
        sections={study.sections}
        activeSection={activeSection}
        isDark={isDark}
        accentColor={accentColor}
        onSectionClick={scrollToSection}
      />

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div ref={containerRef} className="relative z-10 flex-1 overflow-y-auto">
        <div className="flex max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10 py-10 gap-12">

          {/* Sidebar */}
          <SidebarTOC
            sections={study.sections}
            activeSection={activeSection}
            isDark={isDark}
            accentColor={accentColor}
            behanceUrl={study.behanceUrl}
            onSectionClick={scrollToSection}
          />

          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-16 pb-32">

            {/* ── Hero ───────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="space-y-8"
            >
              <div className="space-y-3">
                <h1 className={cn("font-['Caveat'] text-4xl sm:text-5xl lg:text-6xl leading-[1.05]", isDark ? "text-white/95" : "text-slate-900")}>
                  {study.title}
                </h1>
                <p className={cn("text-[0.95rem] leading-[1.75] max-w-[60ch]", isDark ? "text-white/55" : "text-slate-600")}>
                  {study.subtitle}
                </p>
              </div>

              {/* Platform demo video */}
              {study.demoVideo && (
                <CaseStudyVideo src={study.demoVideo} poster={study.demoPoster} isDark={isDark} />
              )}

              {/* Metadata grid */}
              <div className={cn("grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl p-4 border",
                isDark ? "bg-white/[0.04] border-white/8" : "bg-white/60 border-blue-100")}>
                {[
                  { label: "Role", value: study.role },
                  { label: "Timeline", value: study.timeline },
                  { label: "Tools", value: study.tools },
                  { label: "Deliverable", value: study.deliverable },
                ].map((meta) => (
                  <div key={meta.label}>
                    <p className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.2em] mb-1", isDark ? "text-white/55" : "text-blue-600")}>
                      {meta.label}
                    </p>
                    <p className={cn("text-[0.8rem] leading-[1.4]", isDark ? "text-white/75" : "text-slate-800")}>
                      {meta.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className={cn("grid gap-3", study.stats.length === 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4")}>
                {study.stats.map((stat, i) => {
                  const lc = LIGHT_SECTION_COLORS[i % LIGHT_SECTION_COLORS.length];
                  return (
                    <div key={stat.label}
                      className={cn("rounded-xl p-4 text-center border", isDark ? "bg-white/[0.05] border-white/6" : "border")}
                      style={!isDark ? { background: lc.bg, borderColor: lc.border } : undefined}>
                      <p className="font-['Caveat'] text-3xl font-medium" style={{ color: accentColor }}>
                        {stat.value}
                      </p>
                      <p className={cn("font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.18em] mt-1", isDark ? "text-white/65" : "text-slate-600")}>
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Cover image */}
              <div className={cn("w-full rounded-2xl overflow-hidden border", isDark ? "border-white/8" : "border-blue-100/80")}>
                <img src={study.coverImage} alt={`${study.title} cover`} fetchPriority="high" decoding="async" className="w-full object-cover" />
              </div>
            </motion.div>

            {/* ── Sections ───────────────────────────────────────────────── */}
            {study.sections.map((section, i) => (
              <SectionContent
                key={section.id}
                section={section}
                isDark={isDark}
                accentColor={accentColor}
                sectionIndex={i}
                sectionRef={(el) => { sectionRefs.current[section.id] = el; }}
              />
            ))}

            {/* ── Footer ─────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t",
                isDark ? "border-white/8" : "border-blue-100")}>
              <button type="button" onClick={onClose}
                className={cn("flex min-h-11 items-center gap-2 px-2 text-[0.825rem] transition-all duration-200 group",
                  isDark ? "text-white/72 hover:text-white/95" : "text-slate-600 hover:text-slate-900")}>
                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                Back to Work
              </button>
              <a href={study.behanceUrl} target="_blank" rel="noopener noreferrer"
                className={cn("flex min-h-11 items-center gap-2 px-2 text-[0.825rem] transition-all duration-200 group",
                  isDark ? "text-white/72 hover:text-white/95" : "text-slate-600 hover:text-blue-700")}>
                View full project on Behance
                <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </motion.div>
          </main>
        </div>
      </div>
    </motion.div>
  );
}
