import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectCardData } from "@/components/portfolio/project-card";

type MobileProjectCardProps = {
  project: ProjectCardData;
  index: number;
  // "r,g,b" accent used for the focused glow.
  hue: string;
  isDark: boolean;
  isFocused: boolean;
  onOpen: () => void;
  onFocusChange: (focused: boolean) => void;
};

export function MobileProjectCard({ project, index, hue, isDark, isFocused, onOpen, onFocusChange }: MobileProjectCardProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const isFlagship = project.caseStudySlug === "xariss";
  const ctaLabel = project.hasCaseStudy ? "View case study" : "View on Behance";

  // The card crossing the middle of the screen takes the role desktop gives to hover.
  const inFocusBand = useInView(ref, { margin: "-42% 0px -42% 0px" });
  const onFocusChangeRef = useRef(onFocusChange);
  useEffect(() => { onFocusChangeRef.current = onFocusChange; });
  useEffect(() => { onFocusChangeRef.current(inFocusBand); }, [inFocusBand]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["-5%", "5%"]);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 36, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: index === 0 ? 0.35 : 0 }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${project.title}. ${ctaLabel}`}
        className={cn(
          "group block w-full rounded-[18px] border p-[5px] text-left backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-500 focus-visible:outline-none focus-visible:ring-2",
          isDark
            ? isFocused ? "border-white/28 bg-white/[0.09] focus-visible:ring-white/40" : "border-white/12 bg-white/[0.05] focus-visible:ring-white/40"
            : isFocused ? "border-slate-900/18 bg-white/70 focus-visible:ring-slate-900/25" : "border-slate-900/10 bg-white/50 focus-visible:ring-slate-900/25",
        )}
        style={{
          boxShadow: isFocused
            ? `0 30px 60px -30px rgba(${hue},0.75)`
            : "0 20px 40px -32px rgba(0,0,0,0.6)",
        }}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[13px] bg-black/10">
          <motion.img
            src={project.image}
            alt=""
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            style={{ y: imageY, scale: reduceMotion ? 1 : 1.12 }}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#0d0b1e]/90 via-[#0d0b1e]/40 to-transparent" />

          {isFlagship && (
            <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-[#ff8a4c]/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md">
              <Pin className="h-3 w-3" aria-hidden="true" />
              Flagship case study
            </span>
          )}
          {project.year && (
            <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 font-mono text-[11px] text-white/85 backdrop-blur-md">
              {project.year}
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <h2 className="text-[1.45rem] font-medium leading-[1.1] text-white [text-wrap:balance]">
              {project.title}
            </h2>
            <span
              className={cn(
                "mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-500",
                isFocused ? "border-white/40 bg-white/20 text-white" : "border-white/20 bg-white/10 text-white/80",
              )}
              aria-hidden="true"
            >
              {project.hasCaseStudy ? <ArrowRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
            </span>
          </div>
        </div>
      </button>

      <div className="px-1 pt-4">
        {project.summary && (
          <p className={cn("text-[0.95rem] leading-[1.5]", isDark ? "text-white/80" : "text-slate-700")}>
            {project.summary}
          </p>
        )}

        {project.outcomes && project.outcomes.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Results">
            {project.outcomes.map((outcome) => (
              <li
                key={outcome}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[12px]",
                  isDark ? "border-white/12 bg-white/[0.06] text-white/82" : "border-slate-900/10 bg-white/60 text-slate-700",
                )}
              >
                {outcome}
              </li>
            ))}
          </ul>
        )}

        <div
          role="group"
          aria-label={`${project.title} highlights`}
          tabIndex={0}
          className="-mx-1 mt-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain px-1 pb-1 [scrollbar-width:none] focus-visible:outline-none [&::-webkit-scrollbar]:hidden"
        >
          {project.previewImages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${project.title} highlight ${i + 1}`}
              loading="lazy"
              decoding="async"
              className={cn(
                "aspect-[16/10] w-[64%] shrink-0 snap-start rounded-[10px] border object-cover object-top",
                isDark ? "border-white/10" : "border-slate-900/10",
              )}
            />
          ))}
        </div>
      </div>
    </motion.article>
  );
}
