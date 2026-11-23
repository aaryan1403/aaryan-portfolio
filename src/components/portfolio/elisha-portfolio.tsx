import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import cosmicMusic from "@/assets/audio/cosmic-music.mp3";
import { AboutView } from "@/components/portfolio/about-view";
import { CaseStudyView } from "@/components/portfolio/case-study-view";
import { CursorTrail } from "@/components/portfolio/cursor-trail";
import { GridBackground } from "@/components/portfolio/grid-background";
import { HomeView } from "@/components/portfolio/home-view";
import { NavigationBar } from "@/components/portfolio/navigation-bar";
import { StarField } from "@/components/portfolio/star-field";

type ViewMode = "home" | "about" | "casestudy";

const contactEmail = "aaryan.shri1403@gmail.com";

const dublinFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Europe/Dublin",
});

const mumbaiFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
});

function formatDublin() { return dublinFormatter.format(new Date()); }
function formatMumbai() { return mumbaiFormatter.format(new Date()); }

export function ElishaPortfolio() {
  const [dublinTime, setDublinTime] = useState(formatDublin);
  const [mumbaiTime, setMumbaiTime] = useState(formatMumbai);
  const [isDark, setIsDark] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [activeCaseStudySlug, setActiveCaseStudySlug] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const overlayOpen = viewMode !== "home";

  function openCaseStudy(slug: string) {
    setActiveCaseStudySlug(slug);
    setViewMode("casestudy");
  }

  function closeCaseStudy() {
    setViewMode("home");
    setActiveCaseStudySlug(null);
  }

  function goHome() {
    if (viewMode === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setViewMode("home");
    setActiveCaseStudySlug(null);
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDublinTime(formatDublin());
      setMumbaiTime(formatMumbai());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    return () => root.classList.remove("dark");
  }, [isDark]);

  // The home page scrolls the document; About and case studies scroll inside their own overlay.
  useEffect(() => {
    document.body.style.overflow = overlayOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [overlayOpen]);

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = window.setTimeout(() => setFeedback(null), 1800);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  // The new theme spreads out from the toggle as a growing circle, then the old one is gone.
  function toggleTheme(origin: { x: number; y: number }) {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion) {
      setIsDark((current) => !current);
      return;
    }

    const radius = Math.hypot(
      Math.max(origin.x, window.innerWidth - origin.x),
      Math.max(origin.y, window.innerHeight - origin.y),
    );
    // Colour transitions would fade a second time inside the reveal, so they sit out the switch.
    root.classList.add("theme-switching");
    const transition = document.startViewTransition(() => {
      flushSync(() => setIsDark((current) => !current));
    });
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${radius}px at ${origin.x}px ${origin.y}px)`] },
          { duration: 720, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
    transition.finished.finally(() => root.classList.remove("theme-switching"));
  }

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
    if (!audio) return;
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
        "relative min-h-screen font-['Instrument_Sans',ui-sans-serif,system-ui,sans-serif] transition-colors duration-500",
        isDark
          ? "bg-gradient-to-b from-[#1a1a2e] via-[#252541] to-[#2d2d4a] text-white"
          : "bg-gradient-to-b from-[#edf4ff] via-[#e4ebff] to-[#f6f1ff] text-slate-900",
      )}
    >
      <CursorTrail />
      <audio ref={audioRef} src={cosmicMusic} preload="metadata" />

      {/* The night sky stays put while the page scrolls over it. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-0",
          isDark
            ? "bg-gradient-to-b from-[#1a1a2e] via-[#252541] to-[#2d2d4a]"
            : "bg-gradient-to-b from-[#edf4ff] via-[#e4ebff] to-[#f6f1ff]",
        )}
      >
        <GridBackground isDark={isDark} />
        <StarField isDark={isDark} />
      </div>

      <div className={cn(overlayOpen && "invisible")} aria-hidden={overlayOpen || undefined}>
        <HomeView
          isDark={isDark}
          isPlaying={isPlaying}
          dublinTime={dublinTime}
          mumbaiTime={mumbaiTime}
          email={contactEmail}
          onTogglePlayback={togglePlayback}
          onCopyEmail={() => copyToClipboard(contactEmail, "Email copied")}
          onOpenCaseStudy={openCaseStudy}
        />
      </div>

      <AnimatePresence>
        {viewMode === "about" && <AboutView key="about-view" isDark={isDark} />}
        {viewMode === "casestudy" && activeCaseStudySlug && (
          <CaseStudyView
            key={`case-study-${activeCaseStudySlug}`}
            slug={activeCaseStudySlug}
            isDark={isDark}
            onClose={closeCaseStudy}
          />
        )}
      </AnimatePresence>

      <NavigationBar
        isDark={isDark}
        feedback={feedback}
        currentView={viewMode}
        onGoHome={goHome}
        onToggleTheme={toggleTheme}
        onCopyEmail={() => copyToClipboard(contactEmail, "Email copied")}
        onOpenAbout={() => setViewMode("about")}
      />
    </div>
  );
}
