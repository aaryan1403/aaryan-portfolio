import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import cosmicMusic from "@/assets/audio/cosmic-music.mp3";
import cpiCover from "@/assets/projects/cpi-cover.jpg";
import stormaCoverA from "@/assets/projects/storma-cover-a.jpg";
import stormaCoverB from "@/assets/projects/storma-cover-b.jpg";
import xarissDashboard from "@/assets/projects/xariss-dashboard.jpg";
import cpiKeyChallenges from "@/assets/projects/cpi-key-challenges.png";
import cpiWireframes from "@/assets/projects/cpi-wireframes.png";
import cpiFinalScreens from "@/assets/projects/cpi-final-screens.png";
import xarissDashboardPreview from "@/assets/projects/xariss-dashboard-preview.png";
import xarissExperiences from "@/assets/projects/xariss-experiences.png";
import xarissInbox from "@/assets/projects/xariss-inbox.png";
import yif1 from "@/assets/projects/yif-1.png";
import yif2 from "@/assets/projects/yif-2.png";
import yif3 from "@/assets/projects/yif-3.png";
import utsDesignProcess from "@/assets/projects/uts-design-process.png";
import utsResearch from "@/assets/projects/uts-research.png";
import utsIdeation from "@/assets/projects/uts-ideation.png";
import { AboutView } from "@/components/portfolio/about-view";
import { CaseStudyView } from "@/components/portfolio/case-study-view";
import { CursorTrail } from "@/components/portfolio/cursor-trail";
import { GridBackground } from "@/components/portfolio/grid-background";
import { NavigationBar } from "@/components/portfolio/navigation-bar";
import {
  ProjectCard,
  type ProjectCardData,
} from "@/components/portfolio/project-card";
import { StarField } from "@/components/portfolio/star-field";

type LayoutMode = "spread" | "grid";
type ViewMode = "home" | "about" | "casestudy";

const projects: ProjectCardData[] = [
  {
    title: "XARISS Partner Dashboard",
    image: xarissDashboard,
    rotation: -8,
    delay: 0,
    hasCaseStudy: true,
    caseStudySlug: "xariss",
    link: "https://www.behance.net/gallery/245926805/Luxury-Enterprise-SaaS-Panel",
    year: "2026",
    description:
      "A B2B CRM platform for luxury brands to manage listings, track bookings, and act on performance data, designed end-to-end for two distinct user roles. **48 brands** onboarded, with store managers going from raw data to actionable decisions in **under 10 minutes**.",
    previewImages: [xarissDashboardPreview, xarissExperiences, xarissInbox],
  },
  {
    title: "Chronic Pain Ireland",
    image: cpiCover,
    rotation: 20,
    delay: 0.1,
    hasCaseStudy: true,
    caseStudySlug: "paceyourself",
    link: "https://www.behance.net/gallery/207388571/Pace-Yourself",
    year: "2024",
    description:
      "A mobile app helping people with chronic pain manage their daily lives — designed through **30+** academic papers, focus groups, thematic analysis, and a **27-person** workshop to ground every decision in real user need. Now live and used by **1,000+** people.",
    previewImages: [cpiKeyChallenges, cpiWireframes, cpiFinalScreens],
  },
  {
    title: "UTS App Redesign",
    image: stormaCoverA,
    rotation: -16,
    delay: 0.2,
    link: "https://www.behance.net/gallery/206497141/UTS-Reimagined",
    year: "2022",
    description:
      "A redesign of Mumbai's official local train ticketing app, used daily by millions of commuters — focused on simplifying a fragmented booking flow into something fast, intuitive, and stress-free for one of the world's busiest transit systems.",
    previewImages: [utsDesignProcess, utsResearch, utsIdeation],
  },
  {
    title: "Member Login Portal",
    image: stormaCoverB,
    rotation: 10,
    delay: 0.15,
    link: "https://www.behance.net/gallery/202145727/Login-Portal",
    year: "2021",
    description:
      "A member login portal, designed through secondary research, information architecture, and iterative wireframing to create a seamless onboarding experience. Delivered as a high-fidelity prototype aligned with stakeholder requirements.",
    previewImages: [yif1, yif2, yif3],
  },
];

// ── Three distinct scatter arrangements ──────────────────────────────────────
// Container is h-[760px] w-full. Cards are 25rem × 17rem.
// Each variant is deliberately art-directed so any random pick looks intentional.

const scatterLayouts: Record<string, string>[][] = [
  // 0 · Original — top-center anchor, right-side pair, bottom-right anchor
  [
    { top: "0%",    left: "38%",  transform: "translateX(-50%)" },
    { top: "13%",   right: "1%"  },
    { top: "42%",   left: "13%" },
    { bottom: "6%", right: "9%"  },
  ],
  // 1 · Corners — four cards claiming opposite quadrants, leaving centre open
  [
    { top: "3%",    left: "4%"   },
    { top: "6%",    right: "2%"  },
    { bottom: "8%", left: "6%"  },
    { bottom: "5%", right: "3%"  },
  ],
  // 2 · Cascade — top-right to bottom-left diagonal, cards overlap naturally
  [
    { top: "1%",    right: "3%"  },
    { top: "20%",   left: "38%",  transform: "translateX(-50%)" },
    { top: "45%",   left: "8%"  },
    { bottom: "4%", left: "28%", transform: "translateX(-50%)" },
  ],
];

const introDescription =
  "Product Designer with **2+ years of experience**, currently at XARISS building a B2C **Luxury Ecommerce** platform and a B2B **CRM Product**. I use AI to move fast, and creativity and product thinking to make sure what ships actually feels intuitive.";

function renderBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part,
  );
}
const contactEmail = "aaryan.shri1403@gmail.com";
const defaultLightGradient =
  "linear-gradient(180deg, #edf4ff 0%, #e4ebff 48%, #f6f1ff 100%)";
const lightThemeProjectGradients: Record<string, string> = {
  "Chronic Pain Ireland":
    "radial-gradient(circle at 18% 12%, rgba(154, 126, 214, 0.18), transparent 34%), linear-gradient(180deg, #f3efff 0%, #ebe3ff 50%, #f8f4ff 100%)",
  "UTS App Redesign":
    "radial-gradient(circle at 82% 14%, rgba(255, 118, 72, 0.18), transparent 32%), linear-gradient(180deg, #fff2ea 0%, #ffe4d9 48%, #fff6f0 100%)",
  "Member Login Portal":
    "radial-gradient(circle at 80% 18%, rgba(255, 188, 150, 0.16), transparent 34%), linear-gradient(180deg, #fff7f1 0%, #f7e7dd 50%, #fff9f5 100%)",
  "XARISS Partner Dashboard":
    "radial-gradient(circle at 82% 14%, rgba(55, 132, 255, 0.28), transparent 36%), linear-gradient(180deg, #eaf5ff 0%, #d1e5ff 48%, #e6eeff 100%)",
};

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const istFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
});

function formatTime() { return timeFormatter.format(new Date()); }
function formatIST()  { return istFormatter.format(new Date()); }

export function ElishaPortfolio() {
  const [currentTime, setCurrentTime] = useState(formatTime);
  const [istTime, setIstTime]         = useState(formatIST);
  const [activeProjectTitle, setActiveProjectTitle] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("grid");
  const [scatterVariant, setScatterVariant] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [activeCaseStudySlug, setActiveCaseStudySlug] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hoverDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [panelHeight, setPanelHeight] = useState<number>(() =>
    Math.min(Math.max(window.innerHeight - 320, 288), 616),
  );

  const activeProject = useMemo(
    () =>
      viewMode === "home"
        ? projects.find((project) => project.title === activeProjectTitle) ?? null
        : null,
    [activeProjectTitle, viewMode],
  );

  function openCaseStudy(slug: string) {
    setActiveCaseStudySlug(slug);
    setViewMode("casestudy");
  }

  function closeCaseStudy() {
    setViewMode("home");
    setActiveCaseStudySlug(null);
  }

  const mobileCards = useMemo(() => projects, []);
  const positionedProjects = useMemo(
    () =>
      projects.map((project, index) => ({
        ...project,
        position: layoutMode === "spread"
          ? scatterLayouts[scatterVariant][index]
          : {},
      })),
    [layoutMode, scatterVariant],
  );
  const lightThemeBackground = activeProject
    ? lightThemeProjectGradients[activeProject.title] ?? defaultLightGradient
    : defaultLightGradient;
  const xarissFeaturedVariant: 0 = 0;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(formatTime());
      setIstTime(formatIST());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    return () => root.classList.remove("dark");
  }, [isDark]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setFeedback(null);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return undefined;
    }

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const spreadHeight = () =>
      Math.min(Math.max(window.innerHeight - 320, 288), 616);

    const measureGrid = () => {
      const grid = document.querySelector<HTMLElement>(".grid-cols-2.gap-5");
      const panel = panelRef.current;
      if (!grid || !panel) return;
      const panelRect = panel.getBoundingClientRect();
      const cards = Array.from(grid.querySelectorAll("article")).filter(
        (c) => c.getBoundingClientRect().height > 10,
      );
      if (cards.length === 0) return;
      const maxBottom = Math.max(...cards.map((c) => c.getBoundingClientRect().bottom));
      setPanelHeight(Math.round(maxBottom - panelRect.top));
    };

    const measure = () => {
      if (layoutMode === "grid") measureGrid();
      else setPanelHeight(spreadHeight());
    };

    const timer = setTimeout(measure, layoutMode === "grid" ? 1400 : 0);
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => requestAnimationFrame(measure), 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [layoutMode]);

  async function copyToClipboard(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setFeedback(label);
    } catch {
      setFeedback("Copy failed");
    }
  }

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setFeedback("Playback blocked");
    }
  }

  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden transition-colors duration-500",
        isDark
          ? "bg-gradient-to-b from-[#1a1a2e] via-[#252541] to-[#2d2d4a] text-white"
          : "bg-[#eef4ff] text-slate-900",
      )}
      style={!isDark ? { backgroundImage: lightThemeBackground } : undefined}
    >
      <CursorTrail />
      <GridBackground isDark={isDark} />
      <StarField isDark={isDark} />

      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          isDark
            ? "bg-gradient-to-b from-transparent via-transparent to-[#1a1a2e]/50"
            : "bg-gradient-to-b from-white/0 via-white/0 to-white/25",
        )}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={cn(
          "fixed top-6 right-6 z-10 text-right font-mono text-[9px] sm:text-[10px]",
          isDark ? "text-gray-400" : "text-slate-500",
        )}
      >
        <div>{currentTime}</div>
        <div>DUBLIN, IRELAND</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        className={cn(
          "fixed top-6 left-1/2 z-10 hidden -translate-x-1/2 font-mono text-xs md:block",
          isDark ? "text-gray-400" : "text-slate-500",
        )}
      >
        (⁰▿⁰)◜✧˖°
      </motion.div>

      <div className={cn("relative z-10 flex min-h-screen flex-col lg:flex-row", (viewMode === "about" || viewMode === "casestudy") && "invisible lg:visible")}>
        <section className="w-full px-6 pt-6 pb-2 sm:px-10 lg:w-[30%] lg:pl-12 lg:pr-6 lg:pt-6 lg:pb-10">
          <div>
            <AnimatePresence mode="sync">
            {viewMode === "about" ? (
              <motion.h1 key="about-title"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={cn(
                  "max-w-none whitespace-nowrap font-['Caveat'] text-[1.7rem] sm:text-[2.15rem] leading-[0.92]",
                  isDark ? "text-white/92" : "text-slate-900/92",
                )}
              >
                About Aaryan
              </motion.h1>
            ) : activeProject ? (
              <motion.div key={`project-title-${activeProject.title}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="pt-1"
              >
                <p
                  className={cn(
                    "mb-2 font-mono text-[10px] uppercase tracking-[0.28em]",
                    isDark ? "text-white/45" : "text-slate-500",
                  )}
                >
                  Selected project
                </p>
                <h1
                  className={cn(
                    "max-w-[21rem] font-['Caveat'] text-[1.62rem] leading-[1.01]",
                    isDark ? "text-white/92" : "text-slate-900/92",
                  )}
                >
                  {activeProject.title}
                </h1>
              </motion.div>
            ) : (
              <motion.h1 key="default-title"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={cn(
                  "max-w-none whitespace-nowrap font-['Caveat'] text-[1.45rem] sm:text-[1.72rem] leading-[0.92] lg:relative lg:-top-[2px]",
                  isDark ? "text-white/92" : "text-slate-900/92",
                )}
              >
                Hey, it's Aaryan Shrivastava
              </motion.h1>
            )}
            </AnimatePresence>
          </div>

          <div className="mt-1">
            <AnimatePresence mode="sync">
              <motion.p
                key={`desc-${viewMode === "about" ? "about" : activeProject?.title ?? "default"}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={cn(
                  "max-w-full lg:max-w-[20.5rem] text-[0.75rem] leading-[1.45]",
                  activeProject && viewMode === "home" && "max-w-full lg:max-w-[23rem] text-[0.765rem] leading-[1.44]",
                  isDark ? "text-white/80" : "text-slate-700",
                )}
              >
                {viewMode === "about"
                  ? "A dedicated about page is now wired into the app. We can build the full story, timeline, and contact details there next."
                  : activeProject
                    ? renderBold(activeProject.description)
                    : renderBold(introDescription)}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className={cn("pt-1.5", activeProject && viewMode === "home" && "pt-2")}>
            <AnimatePresence mode="sync">
              <motion.p
                key={`tag-${viewMode === "about" ? "about" : activeProject?.title ?? "default"}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={cn(
                  "max-w-[20.5rem] font-mono text-[0.63rem] leading-[1.32]",
                  activeProject && viewMode === "home" && "max-w-[23rem] text-[0.655rem] leading-[1.34]",
                  isDark ? "text-white/50" : "text-slate-500",
                )}
              >
                {viewMode === "about"
                  ? "Use the home icon to return to the portfolio."
                  : activeProject
                    ? "Hover the stack to preview more visual directions."
                    : "Prev worked for: Chronic Pain Ireland (CPI) and Cozmotec"}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, height: panelHeight }}
            animate={{ opacity: 1, height: panelHeight }}
            transition={{
              opacity: { delay: 1.5, duration: 0.6 },
              height: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            }}
            className={cn(
              "mt-3 hidden min-h-[18rem] w-full max-w-[21.5rem] overflow-hidden rounded-[12px] border p-4 backdrop-blur-sm lg:flex",
              isDark
                ? "border-white/10 bg-white/5"
                : "border-slate-900/10 bg-white/45",
            )}
          >
            <AnimatePresence mode="sync">
            {viewMode === "about" ? (
              <motion.div key="about-panel"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex h-full flex-col justify-between"
              >
                <div>
                  <p
                    className={cn(
                      "pb-3 font-mono text-[11px]",
                      isDark ? "text-white/45" : "text-slate-500",
                    )}
                  >
                    About page
                  </p>
                  <div
                    className={cn(
                      "rounded-[10px] border p-4",
                      isDark
                        ? "border-white/10 bg-white/[0.04]"
                        : "border-slate-900/10 bg-white/65",
                    )}
                  >
                    <p
                      className={cn(
                        "text-sm leading-6",
                        isDark ? "text-white/78" : "text-slate-700",
                      )}
                    >
                      This page is now connected to the navigation. Next we can
                      turn it into a proper about section with your story,
                      process, experience timeline, and selected capabilities.
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "rounded-[10px] border p-4",
                    isDark
                      ? "border-white/10 bg-white/[0.04]"
                      : "border-slate-900/10 bg-white/65",
                  )}
                >
                  <p
                    className={cn(
                      "font-mono text-[11px] uppercase tracking-[0.22em]",
                      isDark ? "text-white/40" : "text-slate-500",
                    )}
                  >
                    Ready for next pass
                  </p>
                  <p
                    className={cn(
                      "mt-3 text-sm leading-6",
                      isDark ? "text-white/75" : "text-slate-700",
                    )}
                  >
                    Add biography, values, tools, and a concise resume-style
                    summary when you are ready.
                  </p>
                </div>
              </motion.div>
            ) : activeProject ? (
              <motion.div
                key={activeProject.title}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={cn(
                  "flex h-full flex-col",
                  activeProject.hasCaseStudy && "cursor-pointer",
                )}
                onClick={
                  activeProject.hasCaseStudy
                    ? () => openCaseStudy(activeProject.caseStudySlug ?? "xariss")
                    : undefined
                }
              >
                <div
                  className={cn(
                    "px-2 pb-2 font-mono text-[11px]",
                    isDark ? "text-white/45" : "text-slate-500",
                  )}
                >
                  Highlights
                </div>
                <div className="grid min-h-0 flex-1 auto-rows-fr gap-3">
                  {activeProject.previewImages.slice(0, 2).map((previewImage, index) => (
                    <motion.div
                      key={previewImage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.3 }}
                      className={cn(
                        "min-h-0 overflow-hidden rounded-[1.15rem] border p-1.5",
                        isDark
                          ? "border-white/10 bg-white/6"
                          : "border-slate-900/8 bg-white/70",
                      )}
                    >
                      <div className="h-full min-h-0 overflow-hidden rounded-[0.95rem]">
                        <img
                          src={previewImage}
                          alt={`${activeProject.title} preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty-panel"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid h-full place-items-center px-4 text-center"
              >
                <div className="flex flex-col items-center justify-center gap-5">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-300 to-pink-300">
                      <span className="text-3xl">🎨</span>
                    </div>
                    <div className="text-3xl">✨</div>
                  </div>
                  <p
                    className={cn(
                      "font-mono text-xs italic",
                      isDark ? "text-white/40" : "text-slate-500",
                    )}
                  >
                    preview a project
                  </p>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        </section>

        <section
          className={cn(
            "relative flex flex-1 items-center justify-center px-6 pb-24 lg:px-0 lg:pb-0",
            layoutMode === "grid" && "pt-0",
          )}
        >
          <div className="grid w-full max-w-2xl grid-cols-1 sm:grid-cols-2 gap-3 px-4 sm:px-8 lg:hidden">
            {mobileCards.map((project) => (
              project.hasCaseStudy ? (
              <button key={project.title} type="button" onClick={() => openCaseStudy(project.caseStudySlug ?? "xariss")} className="text-left w-full">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: project.delay + 0.2 }}
                className={cn(
                  "overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm",
                  isDark
                    ? "border border-white/10 bg-white/5"
                    : "border border-slate-900/10 bg-white/55",
                )}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-48 sm:h-64 w-full object-cover"
                />
                <div className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p
                      className={cn(
                        "text-lg font-medium",
                        isDark ? "text-white" : "text-slate-900",
                      )}
                    >
                      {project.title}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-sm",
                        isDark ? "text-white/55" : "text-slate-600",
                      )}
                    >
                      {renderBold(project.description)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "font-mono text-xs",
                      isDark ? "text-white/45" : "text-slate-500",
                    )}
                  >
                    OPEN
                  </span>
                </div>
              </motion.article>
              </button>
              ) : (
              <a key={project.title} href={project.link} target="_blank" rel="noopener noreferrer">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: project.delay + 0.2 }}
                className={cn(
                  "overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm",
                  isDark
                    ? "border border-white/10 bg-white/5"
                    : "border border-slate-900/10 bg-white/55",
                )}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-48 sm:h-64 w-full object-cover"
                />
                <div className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p
                      className={cn(
                        "text-lg font-medium",
                        isDark ? "text-white" : "text-slate-900",
                      )}
                    >
                      {project.title}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-sm",
                        isDark ? "text-white/55" : "text-slate-600",
                      )}
                    >
                      {renderBold(project.description)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "font-mono text-xs",
                      isDark ? "text-white/45" : "text-slate-500",
                    )}
                  >
                    OPEN
                  </span>
                </div>
              </motion.article>
              </a>
              )
            ))}
          </div>

          {viewMode === "home" ? (
            <AnimatePresence mode="wait" initial={false}>
              {layoutMode === "spread" ? (
                <motion.div
                  key="spread-layout"
                  initial={{ opacity: 0, y: 22, scale: 0.985, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -14, scale: 1.01, filter: "blur(8px)" }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="relative hidden h-[min(760px,calc(100vh-200px))] w-full lg:block"
                >
                  {positionedProjects.map((project, index) => (
                    <ProjectCard
                      key={project.title}
                      {...project}
                      mode="spread"
                      index={index}
                      isActive={activeProjectTitle === project.title}
                      isDark={isDark}
                      featuredVariant={project.caseStudySlug === "xariss" ? xarissFeaturedVariant : undefined}
                      onHoverChange={(isHovering) => {
                        if (isHovering) {
                          if (hoverDismissTimer.current) clearTimeout(hoverDismissTimer.current);
                          setActiveProjectTitle(project.title);
                        } else {
                          hoverDismissTimer.current = setTimeout(() => setActiveProjectTitle(null), 3000);
                        }
                      }}
                      onOpenCaseStudy={project.hasCaseStudy ? () => openCaseStudy(project.caseStudySlug ?? "xariss") : undefined}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="grid-layout"
                  initial={{ opacity: 0, y: 22, scale: 0.985, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -14, scale: 1.01, filter: "blur(8px)" }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="hidden w-full max-w-[66rem] grid-cols-2 gap-5 px-4 lg:mt-[32px] lg:grid"
                >
                  {projects.map((project, index) => (
                    <ProjectCard
                      key={project.title}
                      {...project}
                      mode="grid"
                      index={index}
                      isActive={activeProjectTitle === project.title}
                      isDark={isDark}
                      featuredVariant={project.caseStudySlug === "xariss" ? xarissFeaturedVariant : undefined}
                      onHoverChange={(isHovering) => {
                        if (isHovering) {
                          if (hoverDismissTimer.current) clearTimeout(hoverDismissTimer.current);
                          setActiveProjectTitle(project.title);
                        } else {
                          hoverDismissTimer.current = setTimeout(() => setActiveProjectTitle(null), 3000);
                        }
                      }}
                      onOpenCaseStudy={project.hasCaseStudy ? () => openCaseStudy(project.caseStudySlug ?? "xariss") : undefined}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="hidden w-full max-w-[66rem] items-center justify-center lg:flex">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "max-w-3xl rounded-[18px] border p-8 backdrop-blur-xl",
                  isDark
                    ? "border-white/12 bg-white/[0.05]"
                    : "border-slate-900/10 bg-white/70",
                )}
              >
                <p
                  className={cn(
                    "font-mono text-[11px] uppercase tracking-[0.22em]",
                    isDark ? "text-white/40" : "text-slate-500",
                  )}
                >
                  About page stub
                </p>
                <h2
                  className={cn(
                    "mt-4 font-['Caveat'] text-5xl",
                    isDark ? "text-white/92" : "text-slate-900",
                  )}
                >
                  We can build this next
                </h2>
                <p
                  className={cn(
                    "mt-5 max-w-2xl text-base leading-8",
                    isDark ? "text-white/72" : "text-slate-700",
                  )}
                >
                  The about route is now connected. In the next pass we can
                  shape it into a proper editorial profile with your story,
                  design philosophy, selected experience, and a cleaner contact
                  pathway.
                </p>
              </motion.div>
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {viewMode === "about" && (
          <AboutView key="about-view" isDark={isDark} />
        )}
        {viewMode === "casestudy" && activeCaseStudySlug && (
          <CaseStudyView
            key={`case-study-${activeCaseStudySlug}`}
            slug={activeCaseStudySlug}
            isDark={isDark}
            onClose={closeCaseStudy}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-6 right-6 z-10 hidden text-right sm:block"
      >
        <div
          className={cn(
            "mb-2 font-mono text-xs",
            isDark ? "text-white/40" : "text-slate-500",
          )}
        >
          updated 04.03.26
        </div>
        <div
          className={cn(
            "flex items-center justify-end gap-3 font-mono text-xs",
            isDark ? "text-white/40" : "text-slate-500",
          )}
        >
          <div>{istTime}</div>
          <div>MUMBAI, INDIA</div>
        </div>
      </motion.div>

      <NavigationBar
        isDark={isDark}
        layoutMode={layoutMode}
        feedback={feedback}
        currentView={viewMode}
        onGoHome={() => setViewMode("home")}
        onToggleTheme={() => setIsDark((current) => !current)}
        onToggleLayout={() => {
          if (layoutMode === "spread") {
            setLayoutMode("grid");
          } else {
            // Pick a random scatter variant that's different from the current one
            const next = (scatterVariant + 1 + Math.floor(Math.random() * (scatterLayouts.length - 1))) % scatterLayouts.length;
            setScatterVariant(next);
            setLayoutMode("spread");
          }
        }}
        onCopyEmail={() => copyToClipboard(contactEmail, "Email copied")}
        onOpenAbout={() => setViewMode("about")}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-6 left-4 sm:left-12 z-40 hidden sm:block"
      >
        <audio ref={audioRef} src={cosmicMusic} preload="metadata" />
        <button
          type="button"
          onClick={togglePlayback}
          className={cn(
            "flex items-center gap-3 rounded-full px-4 py-2 backdrop-blur-md transition-all focus-visible:outline-none focus-visible:ring-2",
            isDark
              ? "border border-white/10 bg-black/30 focus-visible:ring-white/35"
              : "border border-slate-900/10 bg-white/55 focus-visible:ring-slate-900/18",
          )}
          aria-label={isPlaying ? "Pause Cosmic Music" : "Play Cosmic Music"}
        >
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-blue-300">
            {isPlaying ? (
              <Pause className="h-2.5 w-2.5 text-orange-500" />
            ) : (
              <Play className="ml-[1px] h-2.5 w-2.5 fill-orange-500 text-orange-500" />
            )}
          </div>
          <span
            className={cn(
              "font-mono text-[10px]",
              isDark ? "text-white/50" : "text-slate-500",
            )}
          >
            {isPlaying ? "PLAYING" : "PAUSED"}
          </span>
          <div
            className={cn(
              "h-3 w-px",
              isDark ? "bg-white/20" : "bg-slate-900/10",
            )}
          />
          <div
            className={cn(
              "max-w-[120px] truncate text-[10px] font-medium",
              isDark ? "text-white/60" : "text-slate-600",
            )}
          >
            Cosmic Music
          </div>
        </button>
      </motion.div>
    </div>
  );
}
