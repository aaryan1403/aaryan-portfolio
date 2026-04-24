import { useState } from "react";
import { motion } from "framer-motion";
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
  hasCaseStudy?: boolean;
};

type ProjectCardProps = ProjectCardData & {
  index: number;
  isActive: boolean;
  isDark: boolean;
  mode: "spread" | "grid";
  position?: Record<string, string>;
  onHoverChange: (isHovering: boolean) => void;
  onOpenCaseStudy?: () => void;
};

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
  hasCaseStudy,
  onHoverChange,
  onOpenCaseStudy,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const showOverlay = isHovered || isActive;

  return (
    <motion.article
      className={cn(
        "cursor-pointer outline-none lg:block",
        mode === "spread"
          ? "absolute hidden h-[17rem] w-[25rem]"
          : "relative hidden h-[18rem] w-full",
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
      style={mode === "spread" ? { ...position, zIndex: index } : undefined}
    >
      <LiquidGlassCard
        draggable={false}
        blurIntensity="xl"
        shadowIntensity="sm"
        glowIntensity={isDark ? "sm" : "xs"}
        borderRadius="10px"
        className={cn(
          "relative h-full w-full overflow-hidden p-[2px] shadow-2xl transition-colors",
          isDark
            ? "bg-white/[0.045]"
            : "bg-white/55",
        )}
      >
        <div
          className={cn(
            "absolute inset-[2px] overflow-hidden rounded-[8px]",
            isDark ? "border border-white/28 bg-black/8" : "border border-white/72 bg-white/30",
          )}
        >
          <img src={image} alt={title} className="h-full w-full object-cover" />
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
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
            Case study preview
          </span>
        </motion.div>
      </LiquidGlassCard>
    </motion.article>
  );
}
