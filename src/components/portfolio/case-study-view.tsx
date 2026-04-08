import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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

// ─── Placeholder Image ───────────────────────────────────────────────────────

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
        <ImageIcon
          className="w-7 h-7 opacity-20"
          style={{ color: accentColor }}
        />
        <div className="text-center space-y-1">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-30"
            style={{ color: accentColor }}
          >
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

// ─── Content Block Renderer ──────────────────────────────────────────────────

function BlockRenderer({
  block,
  isDark,
  accentColor,
}: {
  block: ContentBlock;
  isDark: boolean;
  accentColor: string;
}) {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          className={cn(
            "text-[0.925rem] leading-[1.85] max-w-[68ch]",
            isDark ? "text-white/70" : "text-slate-700",
          )}
        >
          {block.text}
        </p>
      );

    case "heading":
      return (
        <h3
          className={cn(
            "font-['Caveat'] text-2xl font-medium pt-2",
            isDark ? "text-white/90" : "text-slate-900",
          )}
        >
          {block.text}
        </h3>
      );

    case "image":
      return (
        <div className="w-full space-y-2">
          <div className="w-full rounded-xl overflow-hidden border border-white/8">
            <img
              src={block.src}
              alt={block.alt}
              className="w-full object-cover"
            />
          </div>
          {block.caption && (
            <p
              className={cn(
                "font-mono text-[10px] text-center",
                isDark ? "text-white/35" : "text-slate-500",
              )}
            >
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

    case "callout":
      return (
        <div
          className={cn(
            "rounded-xl px-5 py-4 border-l-[3px]",
            isDark
              ? "bg-white/[0.04] border-white/20"
              : "bg-slate-900/[0.04] border-slate-400",
          )}
          style={{ borderLeftColor: isDark ? "#3B6FD4" : accentColor }}
        >
          <p
            className={cn(
              "text-[0.875rem] leading-[1.75] italic",
              isDark ? "text-white/75" : "text-slate-700",
            )}
          >
            {block.text}
          </p>
        </div>
      );

    case "persona":
      return (
        <div
          className={cn(
            "rounded-xl p-5 border-l-[3px]",
            isDark
              ? "bg-white/[0.045] border-white/10"
              : "bg-white/60 border-slate-200",
          )}
          style={{ borderLeftColor: isDark ? "#3B6FD4" : accentColor }}
        >
          <div className="flex flex-wrap items-start gap-x-4 gap-y-1 mb-3">
            <div>
              <p
                className={cn(
                  "font-['Caveat'] text-[1.5rem] leading-none",
                  isDark ? "text-white/92" : "text-slate-900",
                )}
              >
                {block.name}
              </p>
              <p
                className={cn(
                  "font-mono text-[10px] uppercase tracking-[0.18em] mt-0.5",
                  isDark ? "text-white/40" : "text-slate-500",
                )}
              >
                {block.role} · {block.location}
              </p>
            </div>
          </div>
          <p
            className={cn(
              "text-[0.875rem] leading-[1.65] font-medium mb-3",
              isDark ? "text-white/80" : "text-slate-800",
            )}
          >
            "{block.question}"
          </p>
          <ul className="space-y-1.5">
            {block.details.map((detail, i) => (
              <li
                key={i}
                className={cn(
                  "flex items-start gap-2 text-[0.825rem] leading-[1.55]",
                  isDark ? "text-white/55" : "text-slate-600",
                )}
              >
                <span
                  className="mt-[6px] h-1 w-1 rounded-full shrink-0"
                  style={{ backgroundColor: isDark ? "#3B6FD4" : accentColor }}
                />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      );

    case "tensions":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {block.items.map((item, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl p-4",
                isDark ? "bg-white/[0.04]" : "bg-white/50 border border-slate-200/60",
              )}
            >
              <p
                className={cn(
                  "text-[0.8rem] font-semibold mb-1.5",
                  isDark ? "text-white/85" : "text-slate-800",
                )}
              >
                {item.title}
              </p>
              <p
                className={cn(
                  "text-[0.8rem] leading-[1.65]",
                  isDark ? "text-white/50" : "text-slate-600",
                )}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      );

    case "phases":
      return (
        <div
          className={cn(
            "rounded-xl overflow-hidden border",
            isDark ? "border-white/8" : "border-slate-200",
          )}
        >
          {/* Header */}
          <div
            className={cn(
              "grid grid-cols-[3rem_1fr_2fr] gap-4 px-5 py-3 border-b",
              isDark
                ? "bg-white/[0.05] border-white/8 text-white/35"
                : "bg-slate-900/[0.04] border-slate-200 text-slate-500",
              "font-mono text-[9px] uppercase tracking-[0.2em]",
            )}
          >
            <span>Phase</span>
            <span>Stage</span>
            <span>Deliverable</span>
          </div>
          {/* Rows */}
          {block.items.map((item, i) => (
            <div
              key={i}
              className={cn(
                "grid grid-cols-[3rem_1fr_2fr] gap-4 px-5 py-3 border-b last:border-0 transition-colors",
                isDark
                  ? "border-white/5 hover:bg-white/[0.02]"
                  : "border-slate-100 hover:bg-slate-50/50",
              )}
            >
              <span
                className="font-mono text-[10px] font-medium pt-0.5"
                style={{ color: isDark ? "#3B6FD4" : accentColor }}
              >
                {item.range}
              </span>
              <span
                className={cn(
                  "text-[0.825rem] font-medium",
                  isDark ? "text-white/80" : "text-slate-800",
                )}
              >
                {item.stage}
              </span>
              <span
                className={cn(
                  "text-[0.8rem] leading-[1.55]",
                  isDark ? "text-white/45" : "text-slate-600",
                )}
              >
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
            <div
              key={i}
              className={cn(
                "flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg px-4 py-3 border",
                isDark
                  ? "border-white/6 bg-white/[0.03]"
                  : "border-slate-200/70 bg-white/40",
              )}
            >
              <div className="w-32 shrink-0">
                <p
                  className={cn(
                    "text-[0.8rem] font-medium",
                    isDark ? "text-white/75" : "text-slate-700",
                  )}
                >
                  {item.name}
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <span
                  className={cn(
                    "font-mono text-[10px] rounded px-2 py-0.5",
                    isDark
                      ? "bg-white/8 text-white/50"
                      : "bg-slate-100 text-slate-600",
                  )}
                >
                  {item.font}
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] rounded px-2 py-0.5",
                    isDark
                      ? "bg-white/8 text-white/50"
                      : "bg-slate-100 text-slate-600",
                  )}
                >
                  {item.size}
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] rounded px-2 py-0.5",
                    isDark
                      ? "bg-white/8 text-white/50"
                      : "bg-slate-100 text-slate-600",
                  )}
                >
                  {item.weight}w
                </span>
              </div>
              <p
                className={cn(
                  "text-[0.775rem] ml-auto",
                  isDark ? "text-white/35" : "text-slate-500",
                )}
              >
                {item.usage}
              </p>
            </div>
          ))}
        </div>
      );

    case "color-system":
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {block.items.map((item, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl p-4 space-y-3",
                isDark ? "bg-white/[0.04]" : "bg-white/50 border border-slate-200/60",
              )}
            >
              <div
                className="w-full h-10 rounded-lg"
                style={{ backgroundColor: item.hex }}
              />
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p
                    className={cn(
                      "text-[0.8rem] font-medium",
                      isDark ? "text-white/85" : "text-slate-800",
                    )}
                  >
                    {item.name}
                  </p>
                  <span
                    className={cn(
                      "font-mono text-[10px]",
                      isDark ? "text-white/35" : "text-slate-500",
                    )}
                  >
                    {item.hex}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-[0.75rem] leading-[1.5]",
                    isDark ? "text-white/40" : "text-slate-500",
                  )}
                >
                  {item.usage}
                </p>
              </div>
            </div>
          ))}
        </div>
      );

    case "classification":
      return (
        <div className="space-y-2">
          {block.items.map((item, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl px-4 py-3 border-l-[3px]",
                isDark ? "bg-white/[0.04]" : "bg-white/50",
              )}
              style={{ borderLeftColor: item.color }}
            >
              <span
                className="rounded-full px-3 py-1 text-[11px] font-medium shrink-0"
                style={{ backgroundColor: item.color, color: item.textColor }}
              >
                {item.name}
              </span>
              <p
                className={cn(
                  "text-[0.825rem] flex-1",
                  isDark ? "text-white/65" : "text-slate-700",
                )}
              >
                {item.desc}
              </p>
              <span
                className={cn(
                  "font-mono text-[10px] uppercase tracking-wide",
                  isDark ? "text-white/35" : "text-slate-500",
                )}
              >
                → {item.action}
              </span>
            </div>
          ))}
        </div>
      );

    case "screen": {
      const hasImage = block.image !== null;
      return (
        <div
          className={cn(
            "rounded-2xl overflow-hidden border",
            isDark ? "border-white/8 bg-white/[0.03]" : "border-slate-200 bg-white/40",
          )}
        >
          {/* Screen header */}
          <div
            className={cn(
              "flex flex-wrap items-center gap-3 px-5 py-4 border-b",
              isDark ? "border-white/8" : "border-slate-200",
            )}
          >
            <span
              className="font-mono text-[10px] font-medium rounded px-2 py-1"
              style={{
                backgroundColor: isDark ? "#3B6FD41a" : `${accentColor}18`,
                color: isDark ? "#3B6FD4" : accentColor,
              }}
            >
              Screen {block.number}
            </span>
            <h4
              className={cn(
                "text-[0.95rem] font-semibold",
                isDark ? "text-white/90" : "text-slate-900",
              )}
            >
              {block.title}
            </h4>
          </div>

          <div className="p-5 space-y-4">
            {/* Primary question */}
            <p
              className={cn(
                "text-[0.875rem] leading-[1.7] font-medium italic",
                isDark ? "text-white/60" : "text-slate-600",
              )}
            >
              Primary question: "{block.question}"
            </p>

            {/* Image */}
            {hasImage ? (
              <div className="w-full rounded-xl overflow-hidden">
                <img
                  src={block.image!}
                  alt={`${block.title} screenshot`}
                  className="w-full object-cover"
                />
              </div>
            ) : (
              <PlaceholderImage
                label={`${block.title} Screenshot`}
                accentColor={isDark ? "#3B6FD4" : accentColor}
              />
            )}

            {/* Key decisions */}
            <div>
              <p
                className={cn(
                  "font-mono text-[9px] uppercase tracking-[0.2em] mb-2.5",
                  isDark ? "text-white/30" : "text-slate-400",
                )}
              >
                Key Decisions
              </p>
              <ul className="space-y-2.5">
                {block.decisions.map((decision, i) => (
                  <li
                    key={i}
                    className={cn(
                      "flex items-start gap-3 text-[0.825rem] leading-[1.65]",
                      isDark ? "text-white/60" : "text-slate-700",
                    )}
                  >
                    <span
                      className="mt-[7px] h-1 w-1 rounded-full shrink-0"
                      style={{
                        backgroundColor: isDark ? "#3B6FD4" : accentColor,
                      }}
                    />
                    {decision}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    case "decision":
      return (
        <div
          className={cn(
            "rounded-xl p-5 space-y-3",
            isDark ? "bg-white/[0.04] border border-white/6" : "bg-white/50 border border-slate-200",
          )}
        >
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[10px] font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0"
              style={{
                backgroundColor: isDark ? "#3B6FD41a" : `${accentColor}15`,
                color: isDark ? "#3B6FD4" : accentColor,
              }}
            >
              {block.number}
            </span>
            <h4
              className={cn(
                "text-[0.9rem] font-semibold",
                isDark ? "text-white/90" : "text-slate-900",
              )}
            >
              {block.title}
            </h4>
          </div>
          <p
            className={cn(
              "text-[0.875rem] leading-[1.8]",
              isDark ? "text-white/60" : "text-slate-600",
            )}
          >
            {block.body}
          </p>
        </div>
      );

    case "stats-grid":
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {block.items.map((stat, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl p-4 text-center",
                isDark ? "bg-white/[0.05]" : "bg-white/60 border border-slate-200/60",
              )}
            >
              <p
                className={cn(
                  "font-['Caveat'] text-3xl",
                  isDark ? "text-white/92" : "text-slate-900",
                )}
                style={{ color: isDark ? "#3B6FD4" : accentColor }}
              >
                {stat.value}
              </p>
              <p
                className={cn(
                  "font-mono text-[9px] uppercase tracking-[0.18em] mt-1",
                  isDark ? "text-white/40" : "text-slate-500",
                )}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      );

    case "reflection":
      return (
        <div
          className={cn(
            "rounded-xl p-5 space-y-3",
            isDark ? "bg-white/[0.04] border border-white/6" : "bg-white/50 border border-slate-200",
          )}
        >
          <p
            className={cn(
              "text-[0.8rem] font-semibold font-mono uppercase tracking-[0.15em]",
              isDark ? "text-white/50" : "text-slate-500",
            )}
          >
            {block.heading}
          </p>
          <ul className="space-y-3">
            {block.items.map((item, i) => (
              <li
                key={i}
                className={cn(
                  "flex items-start gap-3 text-[0.875rem] leading-[1.75]",
                  isDark ? "text-white/65" : "text-slate-700",
                )}
              >
                <span
                  className="mt-[8px] h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: isDark ? "#3B6FD4" : accentColor }}
                />
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

// ─── Section Renderer ────────────────────────────────────────────────────────

function SectionContent({
  section,
  isDark,
  accentColor,
  sectionRef,
}: {
  section: CaseStudySection;
  isDark: boolean;
  accentColor: string;
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
      {/* Section number + title */}
      <div className="flex items-baseline gap-4">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.25em] shrink-0 mt-0.5"
          style={{ color: isDark ? "#3B6FD4" : accentColor }}
        >
          {section.number}
        </span>
        <h2
          className={cn(
            "font-['Caveat'] text-3xl sm:text-4xl leading-tight",
            isDark ? "text-white/92" : "text-slate-900",
          )}
        >
          {section.title}
        </h2>
      </div>

      {/* Divider */}
      <div
        className={cn(
          "h-px w-full",
          isDark ? "bg-white/8" : "bg-slate-200",
        )}
      />

      {/* Blocks */}
      <div className="space-y-5">
        {section.blocks.map((block, i) => (
          <BlockRenderer
            key={i}
            block={block}
            isDark={isDark}
            accentColor={accentColor}
          />
        ))}
      </div>
    </motion.section>
  );
}

// ─── Sidebar TOC ─────────────────────────────────────────────────────────────

function SidebarTOC({
  sections,
  activeSection,
  isDark,
  accentColor,
  behanceUrl,
  onSectionClick,
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
      <p
        className={cn(
          "font-mono text-[9px] uppercase tracking-[0.25em] px-3 mb-2",
          isDark ? "text-white/25" : "text-slate-400",
        )}
      >
        Contents
      </p>
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSectionClick(section.id)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-[0.8rem] transition-all duration-200 flex items-center gap-2.5 group",
              isActive
                ? isDark
                  ? "text-white/90"
                  : "text-slate-900"
                : isDark
                  ? "text-white/35 hover:text-white/65"
                  : "text-slate-400 hover:text-slate-700",
            )}
          >
            {/* Active indicator */}
            <span
              className={cn(
                "h-1 w-1 rounded-full shrink-0 transition-all duration-200",
                isActive ? "scale-125" : "scale-75 opacity-50",
              )}
              style={{
                backgroundColor:
                  isActive
                    ? isDark
                      ? "#3B6FD4"
                      : accentColor
                    : "currentColor",
              }}
            />
            <span className="font-mono text-[9px] opacity-50 shrink-0">
              {section.number}
            </span>
            <span className={isActive ? "font-medium" : ""}>{section.shortTitle}</span>
          </button>
        );
      })}

      {/* Divider */}
      <div
        className={cn(
          "h-px w-full my-3",
          isDark ? "bg-white/8" : "bg-slate-200",
        )}
      />

      {/* Behance link */}
      <a
        href={behanceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-[0.75rem] transition-all duration-200 group",
          isDark
            ? "text-white/35 hover:text-white/60"
            : "text-slate-400 hover:text-slate-700",
        )}
      >
        <ExternalLink className="w-3 h-3 shrink-0" />
        <span>View on Behance</span>
      </a>
    </aside>
  );
}

// ─── Mobile Section Pills ─────────────────────────────────────────────────────

function MobileSectionPills({
  sections,
  activeSection,
  isDark,
  accentColor,
  onSectionClick,
}: {
  sections: CaseStudySection[];
  activeSection: string;
  isDark: boolean;
  accentColor: string;
  onSectionClick: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "lg:hidden sticky top-14 z-20 border-b overflow-x-auto",
        isDark
          ? "bg-[#1a1a2e]/90 border-white/8 backdrop-blur-md"
          : "bg-white/80 border-slate-200 backdrop-blur-md",
      )}
    >
      <div className="flex items-center gap-1 px-4 py-2 min-w-max">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionClick(section.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[11px] transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "text-white font-medium"
                  : isDark
                    ? "text-white/40 hover:text-white/70"
                    : "text-slate-500 hover:text-slate-800",
              )}
              style={
                isActive
                  ? {
                      backgroundColor: isDark ? "#3B6FD4" : accentColor,
                    }
                  : undefined
              }
            >
              {section.shortTitle}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function CaseStudyView({ slug, isDark, onClose }: CaseStudyViewProps) {
  const study = getCaseStudyBySlug(slug);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const accentColor = isDark ? study?.accentColorDark ?? "#3B6FD4" : study?.accentColor ?? "#1a2744";

  // ── Intersection Observer for active section tracking ─────────────────────
  useEffect(() => {
    if (!study) return;

    const observers: IntersectionObserver[] = [];

    study.sections.forEach((section) => {
      const el = sectionRefs.current[section.id];
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(section.id);
            }
          });
        },
        {
          root: containerRef.current,
          rootMargin: "-20% 0px -70% 0px",
          threshold: 0,
        },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [study]);

  // ── Scroll to section ─────────────────────────────────────────────────────
  function scrollToSection(id: string) {
    const el = sectionRefs.current[id];
    const container = containerRef.current;
    if (!el || !container) return;

    const containerTop = container.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    const offset = elTop - containerTop + container.scrollTop - 100;

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
          : "bg-[#f0f4ff] text-slate-900",
      )}
    >
      {/* ── Top Header Bar ─────────────────────────────────────────────────── */}
      <header
        className={cn(
          "sticky top-0 z-30 flex items-center justify-between px-5 sm:px-8 h-14 border-b shrink-0",
          isDark
            ? "bg-[#1a1a2e]/90 backdrop-blur-md border-white/8"
            : "bg-white/80 backdrop-blur-md border-slate-200",
        )}
      >
        {/* Back button */}
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "flex items-center gap-2 text-[0.8rem] transition-all duration-200 group",
            isDark
              ? "text-white/50 hover:text-white/90"
              : "text-slate-400 hover:text-slate-900",
          )}
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Back to Work</span>
        </button>

        {/* Centre label */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-mono text-[9px] uppercase tracking-[0.2em]",
              isDark ? "text-white/30" : "text-slate-400",
            )}
          >
            Case Study
          </span>
          <span
            className={cn(
              "h-3 w-px",
              isDark ? "bg-white/15" : "bg-slate-300",
            )}
          />
          <span
            className={cn(
              "font-mono text-[9px] uppercase tracking-[0.15em] font-medium",
              isDark ? "text-white/60" : "text-slate-600",
            )}
          >
            XARISS
          </span>
        </div>

        {/* Behance link (desktop) */}
        <a
          href={study.behanceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "hidden sm:flex items-center gap-1.5 text-[0.75rem] transition-all duration-200 group",
            isDark
              ? "text-white/35 hover:text-white/70"
              : "text-slate-400 hover:text-slate-700",
          )}
        >
          <span>Behance</span>
          <ExternalLink className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </header>

      {/* ── Mobile Section Pills ────────────────────────────────────────────── */}
      <MobileSectionPills
        sections={study.sections}
        activeSection={activeSection}
        isDark={isDark}
        accentColor={accentColor}
        onSectionClick={scrollToSection}
      />

      {/* ── Body (sidebar + content) ────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto"
      >
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
            {/* ── Hero ────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1,
              }}
              className="space-y-8"
            >
              {/* Title */}
              <div className="space-y-3">
                <h1
                  className={cn(
                    "font-['Caveat'] text-4xl sm:text-5xl lg:text-6xl leading-[1.05]",
                    isDark ? "text-white/95" : "text-slate-900",
                  )}
                >
                  {study.title}
                </h1>
                <p
                  className={cn(
                    "text-[0.95rem] leading-[1.75] max-w-[60ch]",
                    isDark ? "text-white/55" : "text-slate-600",
                  )}
                >
                  {study.subtitle}
                </p>
              </div>

              {/* Metadata grid */}
              <div
                className={cn(
                  "grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl p-4 border",
                  isDark
                    ? "bg-white/[0.04] border-white/8"
                    : "bg-white/60 border-slate-200",
                )}
              >
                {[
                  { label: "Role", value: study.role },
                  { label: "Timeline", value: study.timeline },
                  { label: "Tools", value: study.tools },
                  { label: "Deliverable", value: study.deliverable },
                ].map((meta) => (
                  <div key={meta.label}>
                    <p
                      className={cn(
                        "font-mono text-[9px] uppercase tracking-[0.2em] mb-1",
                        isDark ? "text-white/30" : "text-slate-400",
                      )}
                    >
                      {meta.label}
                    </p>
                    <p
                      className={cn(
                        "text-[0.8rem] leading-[1.4]",
                        isDark ? "text-white/75" : "text-slate-800",
                      )}
                    >
                      {meta.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {study.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className={cn(
                      "rounded-xl p-4 text-center",
                      isDark
                        ? "bg-white/[0.05]"
                        : "bg-white/70 border border-slate-200/60",
                    )}
                  >
                    <p
                      className="font-['Caveat'] text-3xl font-medium"
                      style={{ color: accentColor }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className={cn(
                        "font-mono text-[9px] uppercase tracking-[0.18em] mt-1",
                        isDark ? "text-white/35" : "text-slate-500",
                      )}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Cover image */}
              <div className="w-full rounded-2xl overflow-hidden border border-white/8">
                <img
                  src={study.coverImage}
                  alt={`${study.title} cover`}
                  className="w-full object-cover"
                />
              </div>
            </motion.div>

            {/* ── Sections ─────────────────────────────────────────────────── */}
            {study.sections.map((section) => (
              <SectionContent
                key={section.id}
                section={section}
                isDark={isDark}
                accentColor={accentColor}
                sectionRef={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
              />
            ))}

            {/* ── Footer ───────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={cn(
                "flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t",
                isDark ? "border-white/8" : "border-slate-200",
              )}
            >
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2 text-[0.825rem] transition-all duration-200 group",
                  isDark
                    ? "text-white/40 hover:text-white/80"
                    : "text-slate-400 hover:text-slate-800",
                )}
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                Back to Work
              </button>
              <a
                href={study.behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-2 text-[0.825rem] transition-all duration-200 group",
                  isDark
                    ? "text-white/40 hover:text-white/80"
                    : "text-slate-400 hover:text-slate-800",
                )}
              >
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
