import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import cosmicMusic from "@/assets/audio/cosmic-music.mp3";
import cpiCover from "@/assets/projects/Shots CPI.png";
import stormaCoverA from "@/assets/projects/Shots UTS.jpeg";
import stormaCoverB from "@/assets/projects/Shots Member Login.jpeg";
import xarissDashboard from "@/assets/projects/Shots XARISS.jpeg";
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
import { MobileProjectCard } from "@/components/portfolio/mobile-project-card";
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
    summary: "B2B CRM for luxury brands, designed for two user roles.",
    outcomes: ["48 brands onboarded", "Under 10 min to decide"],
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
    summary: "A mobile app helping people with chronic pain manage daily life.",
    outcomes: ["1,000+ users", "27-person workshop"],
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
    summary: "Redesign of Mumbai's local train ticketing app.",
    outcomes: ["Millions of daily commuters", "Simplified booking flow"],
    previewImages: [utsDesignProcess, utsResearch, utsIdeation],
  },
  {
    title: "Member Login Portal",
    image: stormaCoverB,
    rotation: 10,
    delay: 0.15,
    hasCaseStudy: true,
    caseStudySlug: "yifloginportal",
    link: "https://www.behance.net/gallery/202145727/Login-Portal",
    year: "2022",
    description:
      "A member login portal, designed through secondary research, information architecture, and iterative wireframing to create a seamless onboarding experience. Delivered as a high-fidelity prototype aligned with stakeholder requirements.",
    summary: "Member login portal with a seamless onboarding flow.",
    outcomes: ["Hi-fi prototype", "IA + wireframes"],
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
    { top: "42%",   left: "27%" },
    { bottom: "6%", right: "9%"  },
  ],
];

const introDescription =
  "Product Designer with **2+ years of experience**, currently at XARISS building a B2C **Luxury Ecommerce** platform and a B2B **CRM Webapp**.";

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

// "r,g,b" accents for the mobile focus glow and dark-mode ambient tint.
const mobileProjectHues: Record<string, string> = {
  "XARISS Partner Dashboard": "55,132,255",
  "Chronic Pain Ireland": "154,126,214",
  "UTS App Redesign": "255,118,72",
  "Member Login Portal": "255,170,120",
};
const defaultMobileHue = "120,140,255";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Europe/Dublin",
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
  // Kept apart from activeProjectTitle so scrolling the mobile stack never rewrites the hero copy.
  const [mobileFocusTitle, setMobileFocusTitle] = useState<string | null>(null);
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
  const backgroundProjectTitle = activeProject?.title ?? (viewMode === "home" ? mobileFocusTitle : null);
  const lightThemeBackground = backgroundProjectTitle
    ? lightThemeProjectGradients[backgroundProjectTitle] ?? defaultLightGradient
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
    const measure = () => {
      const panel = panelRef.current;
      if (!panel) return;
      const panelRect = panel.getBoundingClientRect();
      const targetBottom = window.innerHeight - 80;
      setPanelHeight(Math.round(targetBottom - panelRect.top));
    };

    const timer = setTimeout(measure, 600);
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

      {/* Mobile ambient tint: the focused card colours the night sky the way hover does on desktop. */}
      <AnimatePresence>
        {isDark && viewMode === "home" && mobileFocusTitle && (
          <motion.div
            key={mobileFocusTitle}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="pointer-events-none fixed inset-0 lg:hidden"
            style={{
              background: `radial-gradient(120% 60% at 50% 55%, rgba(${mobileProjectHues[mobileFocusTitle] ?? defaultMobileHue},0.16), transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      <div
        className="pointer-events-none absolute inset-0"
        style={isDark ? {
          background: `linear-gradient(to bottom,
            transparent 0%,
            transparent 91%,
            rgba(14, 130, 118, 0.28) 96%,
            rgba(16, 148, 132, 0.45) 100%
          )`
        } : {
          background: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 100%)`
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={cn(
          "fixed top-6 right-6 z-10 hidden text-right font-mono text-[10px] sm:block",
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
        <section className="w-full px-6 pt-8 pb-12 sm:px-10 sm:pt-6 sm:pb-2 lg:w-[30%] lg:pl-12 lg:pr-6 lg:pt-6 lg:pb-10">
          {/* Mobile status line: the clocks and kaomoji that sit in the corners on desktop. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={cn(
              "mb-14 flex items-center justify-between font-mono text-[11px] sm:hidden",
              isDark ? "text-white/55" : "text-slate-500",
            )}
          >
            <span>{currentTime} Dublin · {istTime} Mumbai</span>
            <span aria-hidden="true">(⁰▿⁰)◜✧</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            {viewMode === "about" ? (
              <h1 className={cn("max-w-none whitespace-nowrap font-['Caveat'] text-[1.7rem] sm:text-[2.15rem] leading-[0.92]", isDark ? "text-white/92" : "text-slate-900/92")}>
                About Aaryan
              </h1>
            ) : activeProject ? (
              <div className="pt-1">
                <h1 className={cn("font-['Caveat'] text-[10px] uppercase tracking-[0.28em]", isDark ? "text-white/45" : "text-slate-500")}>{activeProject.title}</h1>
              </div>
            ) : (
              <h1 className={cn("max-w-none font-['Caveat'] text-[2.75rem] leading-[0.95] sm:whitespace-nowrap sm:text-[1.72rem] sm:leading-[0.92] lg:relative lg:-top-[2px]", isDark ? "text-white/92" : "text-slate-900/92")}>
                Hey, it's <br className="sm:hidden" />Aaryan Shrivastava
              </h1>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={cn("mt-5 sm:mt-2", activeProject && viewMode === "home" && "pt-1.5")}
          >
            <p className={cn("max-w-full lg:max-w-[20.5rem] text-[0.97rem] leading-[1.55] sm:text-[0.75rem] sm:leading-[1.45]", activeProject && viewMode === "home" && "max-w-full lg:max-w-[23rem] text-[0.765rem] leading-[1.44]", isDark ? "text-white/80" : "text-slate-700")}>
              {viewMode === "about"
                ? "A dedicated about page is now wired into the app. We can build the full story, timeline, and contact details there next."
                : activeProject
                  ? renderBold(activeProject.description)
                  : renderBold(introDescription)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className={cn("pt-3 sm:pt-1.5", activeProject && viewMode === "home" && "pt-2")}
          >
            <p className={cn("max-w-[20.5rem] font-mono text-[0.72rem] leading-[1.45] sm:text-[0.63rem] sm:leading-[1.32]", activeProject && viewMode === "home" && "max-w-[23rem] text-[0.655rem] leading-[1.34]", isDark ? "text-white/50" : "text-slate-500")}>
              {viewMode === "about"
                ? "Use the home icon to return to the portfolio."
                : activeProject
                  ? "Hover the stack to preview more visual directions."
                  : "Prev worked for: Chronic Pain Ireland (CPI) and Cozmotec"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="mt-7 flex items-center gap-3 sm:hidden"
          >
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause Cosmic Music" : "Play Cosmic Music"}
              className={cn(
                "flex min-h-11 items-center gap-2.5 rounded-full border px-4 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2",
                isDark
                  ? "border-white/12 bg-black/30 text-white/70 focus-visible:ring-white/35"
                  : "border-slate-900/10 bg-white/55 text-slate-600 focus-visible:ring-slate-900/18",
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-blue-300">
                {isPlaying ? (
                  <Pause className="h-3 w-3 text-orange-500" />
                ) : (
                  <Play className="ml-[1px] h-3 w-3 fill-orange-500 text-orange-500" />
                )}
              </span>
              <span className="text-[12px] font-medium">Cosmic Music</span>
            </button>
            <span className={cn("font-mono text-[11px]", isDark ? "text-white/45" : "text-slate-500")}>
              updated 04.03.26
            </span>
          </motion.div>

          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, height: panelHeight }}
            animate={{ opacity: 1, height: panelHeight }}
            transition={{
              opacity: { delay: 1.5, duration: 0.6 },
              height: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            }}
            className={cn(
              "mt-3 hidden min-h-[18rem] w-full max-w-[19.93rem] overflow-hidden rounded-[12px] border p-4 backdrop-blur-sm lg:flex",
              isDark
                ? "border-white/10 bg-white/5"
                : "border-slate-900/10 bg-white/45",
            )}
          >
            <AnimatePresence mode="wait">
            {viewMode === "about" ? (
              <motion.div key="about-panel"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
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
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
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
                  {activeProject.previewImages.slice(0, 3).map((previewImage, index) => (
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
                      <div className="h-full w-full overflow-hidden rounded-[0.95rem]">
                        <img
                          src={previewImage}
                          alt={`${activeProject.title} preview ${index + 1}`}
                          decoding="async"
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty-panel"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
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
            "relative flex flex-1 items-start justify-center px-5 pb-32 sm:px-10 lg:items-center lg:px-0 lg:pb-0",
            layoutMode === "grid" && "pt-0",
          )}
        >
          <div className="flex w-full max-w-xl flex-col gap-16 lg:hidden">
            {mobileCards.map((project, cardIndex) => (
              <MobileProjectCard
                key={project.title}
                project={project}
                index={cardIndex}
                hue={mobileProjectHues[project.title] ?? defaultMobileHue}
                isDark={isDark}
                isFocused={mobileFocusTitle === project.title}
                onOpen={() => {
                  if (project.hasCaseStudy) {
                    openCaseStudy(project.caseStudySlug ?? "xariss");
                  } else {
                    window.open(project.link, "_blank", "noopener,noreferrer");
                  }
                }}
                onFocusChange={(focused) =>
                  setMobileFocusTitle((current) =>
                    focused ? project.title : current === project.title ? null : current,
                  )
                }
              />
            ))}
          </div>

          {viewMode === "home" ? (
            <LayoutGroup id="project-cards">
              <div
                className={cn(
                  layoutMode === "grid"
                    ? "hidden w-full max-w-[56.62rem] gap-5 px-4 lg:mt-[32px] lg:grid lg:grid-cols-2"
                    : "relative hidden h-[min(760px,calc(100vh-200px))] w-full lg:block",
                )}
              >
                {positionedProjects.map((project, index) => (
                  <ProjectCard
                    key={project.title}
                    {...project}
                    mode={layoutMode}
                    index={index}
                    isActive={activeProjectTitle === project.title}
                    isDark={isDark}
                    featuredVariant={project.caseStudySlug === "xariss" ? xarissFeaturedVariant : undefined}
                    layoutTransitionDelay={index * 0.055}
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
              </div>
            </LayoutGroup>
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
            setScatterVariant(0);
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
