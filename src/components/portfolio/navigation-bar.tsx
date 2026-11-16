import React from "react";
import { motion } from "framer-motion";
import {
  Grid2x2,
  House,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKEDIN_URL = "https://www.linkedin.com/in/aaryan-shrivastava1403";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

type NavigationBarProps = {
  isDark: boolean;
  layoutMode: "spread" | "grid";
  feedback: string | null;
  currentView: "home" | "about" | "casestudy";
  onGoHome: () => void;
  onToggleTheme: () => void;
  onToggleLayout: () => void;
  onCopyEmail: () => void;
  onOpenAbout: () => void;
};

type ActionButtonProps = {
  icon: typeof Sparkles;
  label: string;
  onClick: () => void;
  isDark: boolean;
  // Keeps the hover fill on permanently so visitors can tell which page they're on.
  isCurrent?: boolean;
};

type LinkActionButtonProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  isDark: boolean;
};

function LinkActionButton({ icon, label, href, isDark }: LinkActionButtonProps) {
  return (
    <div className="group relative flex items-center justify-center">
      <div
        className={cn(
          "pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-extralight tracking-[0.04em] text-slate-950 opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100",
          "bg-[#ff6a3d]",
        )}
      >
        {label}
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2",
          isDark
            ? "text-white/78 hover:bg-white/14 focus-visible:ring-white/35"
            : "text-slate-700 hover:bg-slate-900/8 focus-visible:ring-slate-900/18",
        )}
        aria-label={label}
      >
        {icon}
      </a>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  isDark,
  isCurrent = false,
}: ActionButtonProps) {
  return (
    <div className="group relative flex items-center justify-center">
      <div
        className={cn(
          "pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-extralight tracking-[0.04em] text-slate-950 opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100",
          "bg-[#ff6a3d]",
        )}
      >
        {label}
      </div>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2",
          isDark
            ? "text-white/78 hover:bg-white/14 focus-visible:ring-white/35"
            : "text-slate-700 hover:bg-slate-900/8 focus-visible:ring-slate-900/18",
          isCurrent && (isDark ? "bg-white/14 text-white" : "bg-slate-900/8 text-slate-900"),
        )}
        aria-label={label}
        aria-current={isCurrent ? "page" : undefined}
      >
        <Icon className="h-4.5 w-4.5" />
      </button>
    </div>
  );
}

export function NavigationBar({
  isDark,
  layoutMode,
  feedback,
  currentView,
  onGoHome,
  onToggleTheme,
  onToggleLayout,
  onCopyEmail,
  onOpenAbout,
}: NavigationBarProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 lg:left-[68%]"
      aria-label="Portfolio navigation"
    >
      <div className="relative">
        <motion.div
          initial={false}
          animate={{ opacity: feedback ? 1 : 0, y: feedback ? 0 : 8 }}
          className={cn(
            "pointer-events-none absolute -top-9 left-3 rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em]",
            isDark
              ? "bg-white/10 text-white/55"
              : "bg-slate-950/8 text-slate-600",
          )}
        >
          {feedback}
        </motion.div>

        <div
          className={cn(
            "rounded-full shadow-xl backdrop-blur-md max-w-[calc(100vw-2rem)]",
            isDark
              ? "border border-white/18 bg-white/10"
              : "border border-slate-900/10 bg-white/72",
          )}
        >
        <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2">
          <ActionButton
            icon={Sparkles}
            label={isDark ? "Light mode" : "Dark mode"}
            onClick={onToggleTheme}
            isDark={isDark}
          />
          <ActionButton
            icon={House}
            label="Home"
            onClick={onGoHome}
            isDark={isDark}
            isCurrent={currentView === "home"}
          />
          {currentView !== "about" && currentView !== "casestudy" && (
            <div className="hidden lg:contents">
              <ActionButton
                icon={Grid2x2}
                label={layoutMode === "spread" ? "Grid layout" : "Spread layout"}
                onClick={onToggleLayout}
                isDark={isDark}
              />
            </div>
          )}
          <ActionButton
            icon={Mail}
            label="Copy email"
            onClick={onCopyEmail}
            isDark={isDark}
          />
          <ActionButton
            icon={UserRound}
            label="About me"
            onClick={onOpenAbout}
            isDark={isDark}
            isCurrent={currentView === "about"}
          />
          <div
            className={cn(
              "mx-1 h-5 w-px",
              isDark ? "bg-white/15" : "bg-slate-900/10",
            )}
            aria-hidden="true"
          />
          <LinkActionButton
            icon={<LinkedinIcon className="h-4.5 w-4.5" />}
            label="LinkedIn"
            href={LINKEDIN_URL}
            isDark={isDark}
          />
        </div>
        </div>
      </div>
    </motion.nav>
  );
}
