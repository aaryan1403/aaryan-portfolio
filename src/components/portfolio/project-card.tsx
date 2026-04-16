import { useState } from "react";
import { motion } from "framer-motion";
import { Pin, Sparkles, Radar } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiquidGlassCard } from "@/components/ui/liquid-weather-glass";

export type ProjectCardData = {
  title: string;
  image: string;
  rotation: number;
  delay: number;
  description: string;
  previewImages: string[];
  link: string;
  year?: string;
  hasCaseStudy?: boolean;
  caseStudySlug?: string;
};

type ProjectCardProps = ProjectCardData & {
  index: number;
  isActive: boolean;
  isDark: boolean;
  mode: "spread" | "grid";
  position?: Record<string, string>;
  featuredVariant?: 0 | 1 | 2;
  onHoverChange: (isHovering: boolean) => void;
  onOpenCaseStudy?: () => void;
};

function FeaturedTreatment({
  variant,
}: {
  variant: 0 | 1 | 2;
}) {
  if (variant === 0) {
    return (
      <>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,173,92,0.28),transparent_24%),radial-gradient(circle_at_84%_88%,rgba(86,146,255,0.14),transparent_28%)]" />
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/18 bg-[#ff8a4c]/88 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white shadow-[0_10px_28px_rgba(255,138,76,0.28)] backdrop-blur-md">
          <Pin className="h-3 w-3" />
          <span>Flagship Casestudy</span>
        </div>
        <div className="pointer-events-none absolute right-4 top-4 h-10 w-10 rounded-full border border-white/16 bg-white/8 backdrop-blur-md" />
        <div className="pointer-events-none absolute bottom-4 left-4 h-px w-24 bg-gradient-to-r from-[#ff8a4c]/90 via-white/40 to-transparent" />
      </>
    );
  }

  if (variant === 1) {
    return (
      <>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_20%,rgba(74,144,255,0.2),transparent_28%),linear-gradient(180deg,rgba(6,10,24,0.06),rgba(6,10,24,0))]" />
        <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-between border-b border-white/12 bg-black/18 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2 text-white/80">
            <Sparkles className="h-3.5 w-3.5 text-[#8db8ff]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Featured Build</span>
          </div>
          <span className="rounded-full border border-white/14 bg-white/8 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/60">
            XARISS
          </span>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#3b6fd4]/28 via-[#3b6fd4]/10 to-transparent" />
        <div className="pointer-events-none absolute bottom-5 left-4 flex items-center gap-2 text-white/72">
          <div className="h-2 w-2 rounded-full bg-[#ff9e57]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em]">Flagship workflow</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(78,138,255,0.22),transparent_26%),radial-gradient(circle_at_22%_78%,rgba(255,160,96,0.16),transparent_24%)]" />
      <div className="pointer-events-none absolute left-4 top-4 text-white/82">
        <Radar className="h-4 w-4 text-[#7eb0ff]" />
      </div>
      <div className="pointer-events-none absolute right-4 top-4 rounded-full border border-white/14 bg-black/22 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 backdrop-blur-md">
        Lead Case
      </div>
      <div className="pointer-events-none absolute inset-4 rounded-[12px] border border-white/10" />
      <div className="pointer-events-none absolute inset-7 rounded-[10px] border border-white/6" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-12 w-12 rounded-full border border-[#ff9e57]/30 bg-[#ff9e57]/8 blur-[1px]" />
      <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">
        Priority Story
      </div>
    </>
  );
}

export function ProjectCard({
  title,
  image,
  rotation,
  delay,
  index,
  isActive,
  isDark,
  mode,
  position,
  link,
  year,
  hasCaseStudy,
  featuredVariant,
  onHoverChange,
  onOpenCaseStudy,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const showOverlay = isHovered || isActive;
  const isFeatured = typeof featuredVariant === "number";

  return (
    <motion.article
      className={cn(
        "cursor-pointer outline-none lg:block",
        mode === "spread"
          ? "absolute hidden h-[min(16.15rem,calc(((100vh-220px)/2-12px)*0.95))] w-[min(21.89rem,calc((50vw-3rem)*0.8755))]"
          : "relative hidden h-[min(17.1rem,calc(((100vh-200px)/2-12px)*0.95))] w-full",
      )}
      initial={{ opacity: 0, rotate: rotation, scale: 0.8 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      transition={{
        opacity: { type: "spring", bounce: 0.2, duration: 1, delay },
        rotate: { type: "spring", bounce: 0.2, duration: 1, delay },
        scale: { type: "spring", bounce: 0.2, duration: 1, delay },
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        zIndex: 50,
        transition: { duration: 0.3 },
      }}
      onClick={() => {
        if (hasCaseStudy && onOpenCaseStudy) {
          onOpenCaseStudy();
        } else {
          window.open(link, "_blank", "noopener,noreferrer");
        }
      }}
      onHoverStart={() => {
        setIsHovered(true);
        onHoverChange(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        onHoverChange(false);
      }}
      onFocus={() => onHoverChange(true)}
      onBlur={() => onHoverChange(false)}
      tabIndex={0}
      style={mode === "spread" ? { ...position, zIndex: isFeatured ? 99 : index } : undefined}
    >
      <LiquidGlassCard
        draggable={false}
        blurIntensity="xl"
        shadowIntensity="sm"
        glowIntensity={isDark ? "sm" : "xs"}
        borderRadius="10px"
        className={cn(
          "relative h-full w-full overflow-hidden p-[4px] shadow-2xl transition-colors",
          isDark
            ? "bg-white/10"
            : "bg-white/10",
        )}
      >
        <div
          className={cn(
            "absolute inset-[4px] overflow-hidden rounded-[6px]",
            isDark ? "bg-black/8" : "bg-white/30",
          )}
        >
          <img src={image} alt={title} className="h-full w-full object-cover" />
          {isFeatured ? (
            <FeaturedTreatment variant={featuredVariant} />
          ) : null}
        </div>
        <motion.div
          initial={false}
          animate={{ opacity: showOverlay ? 1 : 0 }}
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-3 backdrop-blur-sm",
            isDark ? "bg-black/45" : "bg-slate-950/30",
            !showOverlay && "pointer-events-none",
          )}
        >
          <span className="px-6 text-center text-[1.5rem] sm:text-[2rem] font-medium leading-tight text-white">
            {title}
          </span>
          {year && (
            <span className="font-mono text-[13px] tracking-[0.1em] text-white/50">
              {year}
            </span>
          )}
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
            Click to view case study
          </span>
        </motion.div>
      </LiquidGlassCard>
    </motion.article>
  );
}
