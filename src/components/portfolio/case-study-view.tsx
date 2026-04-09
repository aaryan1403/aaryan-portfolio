import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, Image as ImageIcon, Play, Volume2, VolumeX, Maximize2 } from "lucide-react";
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
}: {
  label: string;
  caption?: string;
  accentColor: string;
}) {
  return (
    <div className="w-full space-y-2">
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
          <p className="font-mono text-[9px] opacity-20" style={{ color: accentColor }}>
            Screenshot Coming Soon
          </p>
        </div>
      </div>
      {caption && (
        <p className="font-mono text-[10px] opacity-40 text-center">{caption}</p>
      )}
    </div>
  );
}

// ─── Case Study Video Player ──────────────────────────────────────────────────

function CaseStudyVideo({ src, isDark }: { src: string; isDark: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

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
    videoRef.current?.requestFullscreen?.();
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
        "flex items-center gap-3 px-4 py-2.5 border-t",
        isDark ? "border-white/8 bg-white/[0.03]" : "border-blue-100/60 bg-white/50",
      )}>
        {/* Play/pause */}
        <button
          type="button"
          onClick={togglePlay}
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-full transition-all duration-150",
            isDark ? "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white" : "bg-blue-50 hover:bg-blue-100 text-blue-600",
          )}
        >
          {isPlaying
            ? <span className="flex gap-[3px]"><span className="w-[3px] h-3 rounded-sm bg-current"/><span className="w-[3px] h-3 rounded-sm bg-current"/></span>
            : <Play className="w-3 h-3 fill-current translate-x-px" />}
        </button>

        {/* Time */}
        <span className={cn("font-mono text-[10px] shrink-0 tabular-nums", isDark ? "text-white/35" : "text-slate-400")}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Scrubber */}
        <div
          className={cn("flex-1 h-1 rounded-full cursor-pointer relative overflow-hidden", isDark ? "bg-white/10" : "bg-slate-200")}
          onClick={handleScrub}
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-none"
            style={{ width: `${progress}%`, backgroundColor: "#3B6FD4" }}
          />
        </div>

        {/* Mute */}
        <button
          type="button"
          onClick={toggleMute}
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-full transition-all duration-150",
            isDark ? "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white" : "bg-blue-50 hover:bg-blue-100 text-blue-600",
          )}
        >
          {isMuted
            ? <VolumeX className="w-3.5 h-3.5" />
            : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        {/* Fullscreen */}
        <button
          type="button"
          onClick={handleFullscreen}
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-full transition-all duration-150",
            isDark ? "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white" : "bg-blue-50 hover:bg-blue-100 text-blue-600",
          )}
        >
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Rich Persona Card ────────────────────────────────────────────────────────

type RichPersonaData = Extract<ContentBlock, { type: "rich-persona" }>;

function RichPersonaCard({ persona, isDark, index }: { persona: RichPersonaData; isDark: boolean; index: number }) {
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
            ? <img src={persona.avatarPhoto} alt={persona.name} className="w-full h-full object-cover" />
            : persona.initial}
        </div>
        <div>
          <p className={cn("font-['Caveat'] text-2xl leading-tight", isDark ? "text-white/92" : "text-slate-900")}>
            {persona.name}
          </p>
          <p className={cn("font-mono text-[10px] uppercase tracking-[0.15em]", isDark ? "text-white/40" : "text-slate-500")}>
            {persona.role} · {persona.company}
          </p>
          <p className={cn("font-mono text-[9px]", isDark ? "text-white/30" : "text-slate-400")}>
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
          <p className={cn("font-mono text-[9px] uppercase tracking-[0.18em] mb-2.5", isDark ? "text-white/30" : "text-slate-400")}>
            Goals
          </p>
          <ul className="space-y-2">
            {persona.goals.map((g, i) => (
              <li key={i} className={cn("flex items-start gap-2 text-[0.8rem] leading-[1.55]", isDark ? "text-white/60" : "text-slate-700")}>
                <span className="mt-[6px] h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: persona.avatarColor }} />
                {g}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={cn("font-mono text-[9px] uppercase tracking-[0.18em] mb-2.5", isDark ? "text-white/30" : "text-slate-400")}>
            Pain Points
          </p>
          <ul className="space-y-2">
            {persona.painPoints.map((p, i) => (
              <li key={i} className={cn("flex items-start gap-2 text-[0.8rem] leading-[1.55]", isDark ? "text-white/60" : "text-slate-700")}>
                <span className="mt-[6px] h-1 w-1 rounded-full shrink-0 opacity-60" style={{ backgroundColor: "#ef4444" }} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Behaviour */}
      <div className={cn("rounded-lg px-3 py-2.5", isDark ? "bg-white/[0.03]" : "bg-white/40")}>
        <span className={cn("font-mono text-[9px] uppercase tracking-[0.18em] mr-2", isDark ? "text-white/30" : "text-slate-400")}>
          Behaviour
        </span>
        <span className={cn("text-[0.8rem] leading-[1.55]", isDark ? "text-white/55" : "text-slate-600")}>
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
        <p className={cn("font-mono text-[9px] uppercase tracking-[0.2em] mb-4", isDark ? "text-white/30" : "text-slate-400")}>
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
                <span className={cn("font-mono text-[9px] shrink-0", isDark ? "text-white/25" : "text-slate-400")}>
                  {token.px}px · {token.px / block.baseUnit}u
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid system */}
      <div className={cn("rounded-xl p-5 border", isDark ? "bg-white/[0.03] border-white/6" : "bg-white/50 border-slate-200")}>
        <p className={cn("font-mono text-[9px] uppercase tracking-[0.2em] mb-4", isDark ? "text-white/30" : "text-slate-400")}>
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
                <p className={cn("font-mono text-[9px] uppercase tracking-[0.15em] mt-0.5", isDark ? "text-white/30" : "text-slate-400")}>
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
  switch (block.type) {
    case "paragraph":
      return (
        <p className={cn("text-[0.925rem] leading-[1.85] max-w-[68ch]", isDark ? "text-white/70" : "text-slate-700")}>
          {block.text}
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
            <img src={block.src} alt={block.alt} className="w-full object-cover" />
          </div>
          {block.caption && (
            <p className={cn("font-mono text-[10px] text-center", isDark ? "text-white/35" : "text-slate-500")}>
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
              <p className={cn("font-mono text-[10px] uppercase tracking-[0.18em] mt-0.5", isDark ? "text-white/40" : "text-slate-500")}>
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
      return <RichPersonaCard persona={block} isDark={isDark} index={0} />;

    case "persona-pair":
      return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {block.personas.map((persona, i) => (
            <RichPersonaCard key={persona.name} persona={persona} isDark={isDark} index={i} />
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
          <div className={cn("grid grid-cols-[3rem_1fr_2fr] gap-4 px-5 py-3 border-b font-mono text-[9px] uppercase tracking-[0.2em]",
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
              <span className="font-mono text-[10px] font-medium pt-0.5" style={{ color: isDark ? "#3B6FD4" : accentColor }}>
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
                  <span className={cn("font-mono text-[10px]", isDark ? "text-white/35" : "text-slate-500")}>{item.hex}</span>
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
              <span className={cn("font-mono text-[10px] uppercase tracking-wide", isDark ? "text-white/35" : "text-slate-500")}>
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
              style={{ backgroundColor: isDark ? "#3B6FD41a" : "#dbeafe", color: isDark ? "#3B6FD4" : "#1d4ed8" }}>
              Screen {block.number}
            </span>
            <h4 className={cn("text-[0.95rem] font-semibold", isDark ? "text-white/90" : "text-slate-900")}>{block.title}</h4>
          </div>
          <div className="p-5 space-y-4">
            <p className={cn("text-[0.875rem] leading-[1.7] font-medium italic", isDark ? "text-white/60" : "text-slate-600")}>
              Primary question: "{block.question}"
            </p>
            {typeof block.image === "string" ? (
              <div className="w-full rounded-xl overflow-hidden">
                <img src={block.image} alt={`${block.title} screenshot`} className="w-full object-cover" />
              </div>
            ) : block.image === null ? (
              <PlaceholderImage label={`${block.title} Screenshot`} accentColor={isDark ? "#3B6FD4" : accentColor} />
            ) : null}
            <div>
              <p className={cn("font-mono text-[9px] uppercase tracking-[0.2em] mb-2.5", isDark ? "text-white/30" : "text-slate-400")}>
                Key Decisions
              </p>
              <ul className="space-y-2.5">
                {block.decisions.map((decision, i) => (
                  <li key={i} className={cn("flex items-start gap-3 text-[0.825rem] leading-[1.65]", isDark ? "text-white/60" : "text-slate-700")}>
                    <span className="mt-[7px] h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: isDark ? "#3B6FD4" : accentColor }} />
                    {decision}
                  </li>
                ))}
              </ul>
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
                ? { backgroundColor: "#3B6FD41a", color: "#3B6FD4" }
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
                <p className={cn("font-mono text-[9px] uppercase tracking-[0.18em] mt-1", isDark ? "text-white/40" : "text-slate-600")}>
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
          style={{ color: isDark ? "#3B6FD4" : accentColor }}>
          {section.number}
        </span>
        <h2 className={cn("font-['Caveat'] text-3xl sm:text-4xl leading-tight", isDark ? "text-white/92" : "text-slate-900")}>
          {section.title}
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
  return (
    <aside className="sticky top-20 h-fit w-52 shrink-0 py-2 hidden lg:flex flex-col gap-1">
      <p className={cn("font-mono text-[9px] uppercase tracking-[0.25em] px-3 mb-2", isDark ? "text-white/25" : "text-slate-400")}>
        Contents
      </p>
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <button key={section.id} type="button" onClick={() => onSectionClick(section.id)}
            className={cn("w-full text-left px-3 py-2 rounded-lg text-[0.8rem] transition-all duration-200 flex items-center gap-2.5",
              isActive
                ? isDark ? "text-white/90" : "text-slate-900"
                : isDark ? "text-white/35 hover:text-white/65" : "text-slate-400 hover:text-slate-700")}>
            <span className={cn("h-1 w-1 rounded-full shrink-0 transition-all duration-200", isActive ? "scale-125" : "scale-75 opacity-50")}
              style={{ backgroundColor: isActive ? (isDark ? "#3B6FD4" : accentColor) : "currentColor" }} />
            <span className="font-mono text-[9px] opacity-50 shrink-0">{section.number}</span>
            <span className={isActive ? "font-medium" : ""}>{section.shortTitle}</span>
          </button>
        );
      })}
      <div className={cn("h-px w-full my-3", isDark ? "bg-white/8" : "bg-slate-200")} />
      <a href={behanceUrl} target="_blank" rel="noopener noreferrer"
        className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-[0.75rem] transition-all duration-200",
          isDark ? "text-white/35 hover:text-white/60" : "text-slate-400 hover:text-slate-700")}>
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
      <div className="flex items-center gap-1 px-4 py-2 min-w-max">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button key={section.id} type="button" onClick={() => onSectionClick(section.id)}
              className={cn("px-3 py-1.5 rounded-full text-[11px] transition-all duration-200 whitespace-nowrap",
                isActive ? "text-white font-medium" : isDark ? "text-white/40 hover:text-white/70" : "text-slate-500 hover:text-slate-800")}
              style={isActive ? { backgroundColor: isDark ? "#3B6FD4" : accentColor } : undefined}>
              {section.shortTitle}
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
          className={cn("flex items-center gap-2 text-[0.8rem] transition-all duration-200 group",
            isDark ? "text-white/50 hover:text-white/90" : "text-slate-400 hover:text-slate-900")}>
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Back to Work</span>
        </button>

        <div className="flex items-center gap-2">
          <span className={cn("font-mono text-[9px] uppercase tracking-[0.2em]", isDark ? "text-white/30" : "text-slate-400")}>
            Case Study
          </span>
          <span className={cn("h-3 w-px", isDark ? "bg-white/15" : "bg-blue-200")} />
          <span className={cn("font-mono text-[9px] uppercase tracking-[0.15em] font-medium", isDark ? "text-white/60" : "text-blue-700")}>
            XARISS
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
                <CaseStudyVideo src={study.demoVideo} isDark={isDark} />
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
                    <p className={cn("font-mono text-[9px] uppercase tracking-[0.2em] mb-1", isDark ? "text-white/30" : "text-blue-400")}>
                      {meta.label}
                    </p>
                    <p className={cn("text-[0.8rem] leading-[1.4]", isDark ? "text-white/75" : "text-slate-800")}>
                      {meta.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {study.stats.map((stat, i) => {
                  const lc = LIGHT_SECTION_COLORS[i % LIGHT_SECTION_COLORS.length];
                  return (
                    <div key={stat.label}
                      className={cn("rounded-xl p-4 text-center border", isDark ? "bg-white/[0.05] border-white/6" : "border")}
                      style={!isDark ? { background: lc.bg, borderColor: lc.border } : undefined}>
                      <p className="font-['Caveat'] text-3xl font-medium" style={{ color: accentColor }}>
                        {stat.value}
                      </p>
                      <p className={cn("font-mono text-[9px] uppercase tracking-[0.18em] mt-1", isDark ? "text-white/35" : "text-slate-500")}>
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Cover image */}
              <div className={cn("w-full rounded-2xl overflow-hidden border", isDark ? "border-white/8" : "border-blue-100/80")}>
                <img src={study.coverImage} alt={`${study.title} cover`} className="w-full object-cover" />
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
                className={cn("flex items-center gap-2 text-[0.825rem] transition-all duration-200 group",
                  isDark ? "text-white/40 hover:text-white/80" : "text-slate-400 hover:text-slate-800")}>
                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                Back to Work
              </button>
              <a href={study.behanceUrl} target="_blank" rel="noopener noreferrer"
                className={cn("flex items-center gap-2 text-[0.825rem] transition-all duration-200 group",
                  isDark ? "text-white/40 hover:text-white/80" : "text-slate-400 hover:text-blue-700")}>
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
