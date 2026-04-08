import xarissDashboard from "@/assets/projects/xariss-dashboard.jpg";
import xarissDashboardPreview from "@/assets/projects/xariss-dashboard-preview.png";
import xarissExperiences from "@/assets/projects/xariss-experiences.png";
import xarissInbox from "@/assets/projects/xariss-inbox.png";

// ─── Content Block Types ────────────────────────────────────────────────────

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "placeholder-image"; label: string; caption?: string }
  | {
      type: "persona";
      name: string;
      role: string;
      location: string;
      question: string;
      details: string[];
    }
  | { type: "tensions"; items: { title: string; desc: string }[] }
  | {
      type: "phases";
      items: { range: string; stage: string; deliverable: string }[];
    }
  | {
      type: "type-scale";
      items: {
        name: string;
        font: string;
        size: string;
        weight: string;
        usage: string;
      }[];
    }
  | {
      type: "color-system";
      items: { name: string; hex: string; role: string; usage: string }[];
    }
  | {
      type: "classification";
      items: {
        name: string;
        color: string;
        textColor: string;
        desc: string;
        action: string;
      }[];
    }
  | {
      type: "screen";
      number: string;
      title: string;
      question: string;
      image: string | null;
      decisions: string[];
    }
  | { type: "decision"; number: string; title: string; body: string }
  | { type: "stats-grid"; items: { value: string; label: string }[] }
  | { type: "callout"; text: string }
  | { type: "reflection"; heading: string; items: string[] };

// ─── Section & Study Types ───────────────────────────────────────────────────

export type CaseStudySection = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  blocks: ContentBlock[];
};

export type CaseStudyStat = { value: string; label: string };

export type CaseStudyData = {
  slug: string;
  title: string;
  subtitle: string;
  coverImage: string;
  accentColor: string;
  accentColorDark: string;
  role: string;
  timeline: string;
  tools: string;
  deliverable: string;
  behanceUrl: string;
  stats: CaseStudyStat[];
  sections: CaseStudySection[];
};

// ─── XARISS Case Study ───────────────────────────────────────────────────────

const xarissCaseStudy: CaseStudyData = {
  slug: "xariss",
  title: "XARISS Partner Intelligence Platform",
  subtitle:
    "Designing an enterprise analytics and operations platform for luxury brand partnerships — from zero to a full 7-screen high-fidelity prototype.",
  coverImage: xarissDashboard,
  accentColor: "#1a2744",
  accentColorDark: "#3B6FD4",
  role: "UX Designer (Solo)",
  timeline: "12-phase process",
  tools: "Figma · HTML/CSS",
  deliverable: "Portfolio project — 7 hi-fi screens + design system",
  behanceUrl:
    "https://www.behance.net/gallery/245926805/Luxury-Enterprise-SaaS-Panel",
  stats: [
    { value: "7", label: "Screens Designed" },
    { value: "15+", label: "Core Components" },
    { value: "3", label: "Research Phases" },
    { value: "2", label: "User Roles" },
  ],
  sections: [
    // ── 01 · Overview ────────────────────────────────────────────────────────
    {
      id: "overview",
      number: "01",
      title: "Project Overview",
      shortTitle: "Overview",
      blocks: [
        {
          type: "paragraph",
          text: "XARISS is a fictionalised B2B SaaS platform that enables luxury brand partners — think Gucci, Bottega Veneta, Saint Laurent — to list, manage, and optimise in-store experiences for high-intent consumers. Think OpenTable meets Salesforce for luxury retail experiences.",
        },
        {
          type: "paragraph",
          text: "The platform had to answer one question above all others: \"Is XARISS generating bookings and revenue for my brand?\" Every design decision — from the information architecture to the typography scale to the order of zones on the dashboard — was made in service of that question. This case study documents how a blank brief became a functioning seven-screen enterprise product.",
        },
        {
          type: "heading",
          text: "The Platform",
        },
        {
          type: "paragraph",
          text: "XARISS connects luxury brand owners managing multi-location portfolios with the store managers who run day-to-day operations. The platform sits between these two roles, surfacing analytics, managing bookings, handling customer inquiries, and optimising listing content — all in one place.",
        },
        {
          type: "heading",
          text: "The Challenge",
        },
        {
          type: "paragraph",
          text: "Enterprise SaaS for luxury brands carries specific design constraints: it must feel premium without sacrificing information density, it must be immediately usable by non-technical operators, and it must translate complex multi-variate data into decisions a store manager can act on in under 60 seconds.",
        },
      ],
    },

    // ── 02 · Problem Space ───────────────────────────────────────────────────
    {
      id: "problem",
      number: "02",
      title: "Problem Space",
      shortTitle: "Problem",
      blocks: [
        {
          type: "paragraph",
          text: "The platform serves two fundamentally different users whose needs, mental models, and time pressures share almost no overlap. Getting this wrong would mean designing one good dashboard and one unusable one.",
        },
        {
          type: "persona",
          name: "Marco R.",
          role: "Brand Owner",
          location: "Gucci Italia · Views 4 stores",
          question:
            "Which stores and experiences are driving revenue — and which are leaking demand?",
          details: [
            "Reviews monthly performance across locations",
            "Needs to compare stores and identify underperformers",
            "Makes portfolio-level investment decisions",
            "Works retrospectively — needs trend data over time",
          ],
        },
        {
          type: "persona",
          name: "Giulia L.",
          role: "Store Manager",
          location: "Florence, Via Tornabuoni · Runs 1 store",
          question:
            "What do I need to do today to keep bookings coming in?",
          details: [
            "Checks the dashboard daily, sometimes multiple times",
            "Needs to know what's happening right now",
            "Responds to inquiries and manages availability",
            "Forward-facing — needs action items, not reports",
          ],
        },
        {
          type: "heading",
          text: "The Key Tensions",
        },
        {
          type: "paragraph",
          text: "These tensions shaped every significant design decision throughout the project:",
        },
        {
          type: "tensions",
          items: [
            {
              title: "Information Density vs Clarity",
              desc: "More data means harder decisions — the platform had to be dense enough to be useful but structured enough to not require training.",
            },
            {
              title: "Analytics vs Operations",
              desc: "Brand Owners need retrospective insight. Store Managers need forward-facing action. Both live in the same product.",
            },
            {
              title: "Premium Feel vs Enterprise Function",
              desc: "Luxury brand aesthetics (sparse, typographic, restrained) pull against enterprise UX needs (information-rich, scannable, colour-coded).",
            },
            {
              title: "Portfolio View vs Single-Store View",
              desc: "The same experience data means completely different things depending on whether you manage one store or four.",
            },
            {
              title: "Insight vs Instruction",
              desc: "Surfacing that conversion dropped 31% is useless without telling the user what to do about it.",
            },
          ],
        },
      ],
    },

    // ── 03 · Design Process ──────────────────────────────────────────────────
    {
      id: "process",
      number: "03",
      title: "Design Process",
      shortTitle: "Process",
      blocks: [
        {
          type: "paragraph",
          text: "Rather than jumping straight to screens, the design process was structured into twelve sequential phases. Each phase produced a document — information architecture, feature specification, design system, component library, dashboard architecture — before a single high-fidelity screen was designed.",
        },
        {
          type: "paragraph",
          text: "This mirrors professional product design workflows at companies like Figma, Notion, and Stripe.",
        },
        {
          type: "phases",
          items: [
            {
              range: "1–2",
              stage: "Discovery",
              deliverable:
                "Platform brief, user research synthesis, competitive analysis (Airbnb Experiences, Viator, Resy, Salesforce)",
            },
            {
              range: "3",
              stage: "Information Architecture",
              deliverable:
                "Global navigation (7 items), 15-screen page hierarchy, breadcrumb system, role-based access model",
            },
            {
              range: "4",
              stage: "Feature Specification",
              deliverable:
                "12 platform features, 13 KPI definitions, 6-stage conversion funnel, 5 experience classification types, 9 alert categories",
            },
            {
              range: "5",
              stage: "Dashboard Architecture",
              deliverable:
                "10-layer hierarchy, 4 KPI card variants, 8 chart types, Partnership Health Score (5-component model), drill-down paths",
            },
            {
              range: "6",
              stage: "Screen Architecture",
              deliverable:
                "Full layout specifications: 9-zone grid for both dashboards, sidebar structure, responsive behaviour rules",
            },
            {
              range: "7",
              stage: "Design System",
              deliverable:
                "9-token spacing scale, 13-level type scale, full colour system, 11 component styles, data visualisation rules",
            },
            {
              range: "8",
              stage: "Component Library",
              deliverable:
                "7 interactive component demos: KPI Card, Health Score, Experience Table Row, Alert Card, Insight Card, Quick Action, Store Leaderboard",
            },
            {
              range: "9",
              stage: "Brand Dashboard",
              deliverable:
                "Complete high-fidelity screen: multi-store view, store comparison matrix, experience performance table",
            },
            {
              range: "10",
              stage: "Store Dashboard",
              deliverable:
                "Single-store variant: operational widgets, inquiry panel, capacity status, listing health",
            },
            {
              range: "11",
              stage: "Experience Analytics",
              deliverable:
                "Deep-dive diagnostic page: horizontal funnel, booking trend, availability calendar, booking history table",
            },
            {
              range: "12",
              stage: "Operational Modules",
              deliverable:
                "Four modules in one shell: Customers/Inbox, Experiences, Content/Media Library, Settings",
            },
          ],
        },
      ],
    },

    // ── 04 · Design System ───────────────────────────────────────────────────
    {
      id: "design-system",
      number: "04",
      title: "Design System",
      shortTitle: "Design System",
      blocks: [
        {
          type: "paragraph",
          text: "The design system was built around a single governing principle: calm authority. The platform deals with real money and real business performance. It had to feel like a Bloomberg Terminal dressed in Bottega Veneta — information-dense but never anxious, data-rich but never noisy.",
        },
        {
          type: "heading",
          text: "Typography",
        },
        {
          type: "paragraph",
          text: "Two typefaces handle all hierarchy. DM Serif Display carries the emotional weight — used exclusively for headline scores, page titles, and the XARISS logo wordmark. DM Sans handles everything functional: labels, table cells, navigation, captions. The contrast between a 42px serif health score and a 10px sans axis label creates hierarchy that communicates importance without relying on colour alone.",
        },
        {
          type: "type-scale",
          items: [
            {
              name: "Display / Score",
              font: "DM Serif Display",
              size: "38–42px",
              weight: "400",
              usage: "Health scores, hero values",
            },
            {
              name: "Page Title",
              font: "DM Serif Display",
              size: "22–26px",
              weight: "400",
              usage: "Dashboard and section headers",
            },
            {
              name: "Zone Label",
              font: "DM Sans",
              size: "10px",
              weight: "600",
              usage: "Uppercase · Spaced · Section identifiers",
            },
            {
              name: "KPI Value",
              font: "DM Sans",
              size: "24–28px",
              weight: "700",
              usage: "Primary metric display",
            },
            {
              name: "Table Cell",
              font: "DM Sans",
              size: "12px",
              weight: "400/600",
              usage: "Data grid content",
            },
            {
              name: "Axis Label",
              font: "DM Sans",
              size: "10px",
              weight: "400",
              usage: "Chart annotations",
            },
          ],
        },
        {
          type: "heading",
          text: "Colour Philosophy",
        },
        {
          type: "paragraph",
          text: "The palette uses a near-monochromatic neutral base (#0F1117 ink through #F7F8FA surface) with a single blue accent (#3B6FD4) and three semantic colours (green/amber/red) reserved strictly for functional meaning.",
        },
        {
          type: "callout",
          text: "No element uses colour for decoration. Every instance of green, amber, or red carries a specific meaning: positive trajectory, warning threshold, or critical failure. This rule was maintained across all 15 components and all 7 screens without exception.",
        },
        {
          type: "color-system",
          items: [
            {
              name: "Ink",
              hex: "#0F1117",
              role: "Background base",
              usage: "Page background, deepest surfaces",
            },
            {
              name: "Surface",
              hex: "#F7F8FA",
              role: "Light surface",
              usage: "Card backgrounds, input fields",
            },
            {
              name: "Brand Blue",
              hex: "#3B6FD4",
              role: "Primary accent",
              usage: "XARISS UI elements, primary actions",
            },
            {
              name: "Success",
              hex: "#22C55E",
              role: "Positive trajectory",
              usage: "Growth indicators, healthy status",
            },
            {
              name: "Warning",
              hex: "#F59E0B",
              role: "Warning threshold",
              usage: "Declining metrics, content staleness",
            },
            {
              name: "Critical",
              hex: "#EF4444",
              role: "Critical failure",
              usage: "Conversion drops, urgent alerts",
            },
          ],
        },
        {
          type: "heading",
          text: "Spacing & Grid",
        },
        {
          type: "paragraph",
          text: "A 4px base unit generates the full spacing scale (4/8/12/16/24/32/48px). The main content area uses a 12-column grid with 16px gutters, capped at 1160px to maintain comfortable line lengths at high resolutions. Card padding is fixed at 24px. Page padding is 26–32px. This creates predictable visual rhythm that designers can maintain without checking specifications.",
        },
        {
          type: "heading",
          text: "Experience Classification System",
        },
        {
          type: "paragraph",
          text: "One of the most consequential decisions in the design system was establishing a five-tier classification for experience performance. Each classification carries colour, iconography, and a default recommended action — creating a shared vocabulary between the analytics data and the operational UI.",
        },
        {
          type: "classification",
          items: [
            {
              name: "Revenue Driver",
              color: "#16a34a",
              textColor: "#ffffff",
              desc: "Experiences generating top 25% revenue",
              action: "Scale",
            },
            {
              name: "High Potential",
              color: "#0d9488",
              textColor: "#ffffff",
              desc: "Strong views, underperforming conversion",
              action: "Diagnose & optimise",
            },
            {
              name: "Declining",
              color: "#dc2626",
              textColor: "#ffffff",
              desc: "Week-over-week booking drop > 20%",
              action: "Immediate review",
            },
            {
              name: "Niche Performer",
              color: "#7c3aed",
              textColor: "#ffffff",
              desc: "Low volume, high conversion",
              action: "Targeted promotion",
            },
            {
              name: "Stale",
              color: "#d97706",
              textColor: "#ffffff",
              desc: "No bookings in 30 days or content > 60 days old",
              action: "Update or archive",
            },
          ],
        },
      ],
    },

    // ── 05 · Screen Decisions ────────────────────────────────────────────────
    {
      id: "screens",
      number: "05",
      title: "Screen Decisions",
      shortTitle: "Screens",
      blocks: [
        {
          type: "paragraph",
          text: "Every screen was designed to answer one primary question. The zone ordering, component selection, and information hierarchy were determined by that question — not by convention.",
        },
        {
          type: "screen",
          number: "01",
          title: "Brand Owner Dashboard",
          question:
            "Is my partnership performing, and which store is responsible for the gap?",
          image: xarissDashboardPreview,
          decisions: [
            "The Partnership Health Score opens the dashboard as a single 82/100 composite — giving the user an immediate pass/fail signal before any supporting data.",
            "Five sub-components (Booking Growth, Conversion Efficiency, Content Freshness, Customer Response, Experience Diversity) are revealed beneath, each with its own trend indicator.",
            "The Store Comparison table uses a classification column rather than ranking stores by revenue — turning raw data into vocabulary that drives conversation and action.",
            "The Efficiency Matrix scatter plot juxtaposes conversion rate against revenue contribution, making it immediately visible when a high-traffic store is underconverting.",
            "Insight cards surface four automated interpretations with estimated revenue impact to create urgency without being alarmist.",
          ],
        },
        {
          type: "screen",
          number: "02",
          title: "Store Manager Dashboard",
          question: "What do I need to act on today?",
          image: null,
          decisions: [
            "Shares the same shell and design system as the Brand Dashboard but makes 14 structural changes. Multi-store components are removed.",
            "Three operational widgets in Zone C (Today's Bookings, Pending Inquiries, Capacity Status) replace analytics-focused components.",
            "The Pending Inquiries widget carries a red left border and shows the oldest unanswered inquiry's age (52 hours) — temporal urgency, not badge-based.",
            "The Listing Status module shows two cards with health scores directly on the dashboard, surfacing content gaps without extra navigation.",
            "Avatar colour changes from blue (Brand Owner) to teal (Store Manager) as a persistent visual signal of role context — borrowed from Slack and Notion.",
          ],
        },
        {
          type: "screen",
          number: "03",
          title: "Experience Analytics",
          question:
            "Why is this experience's conversion collapsing, and what specifically broke?",
          image: xarissExperiences,
          decisions: [
            "Horizontal funnel layout renders each stage as a horizontal bar with absolute count, percentage of total, and delta versus prior period — all at a glance.",
            "Drop transitions between stages shown as percentage labels in coloured pills — white/green for normal, amber for elevated, red for critical.",
            "Elevated or critical drops trigger a contextual callout directly beneath the affected transition with CTA — the insight is attached to the data that generated it.",
            "A four-stat diagnosis banner synthesises: Overall Conv. Rate, Primary Drop Stage, Secondary Drop Stage, and Est. Missed Bookings.",
            "The right-hand Diagnosis card states the interpretation in plain language: 'Demand is healthy. Conversion is failing at two sequential stages.'",
          ],
        },
        {
          type: "screen",
          number: "04",
          title: "Customers / Inquiry Inbox",
          question:
            "Who needs a response right now, and what do I know about them before I reply?",
          image: xarissInbox,
          decisions: [
            "Three-panel layout: thread list (290px fixed) / message detail (flex) / guest profile (250px fixed).",
            "Guest profile panel is always visible — the store manager sees past bookings, lifetime value, and cancellation rate before reading the inquiry.",
            "Thread timestamps use colour to communicate urgency: grey for normal, amber for 12–24 hours, red for over 24 hours. Classification is at a glance.",
            "Reply box contains three template shortcuts that pre-populate the textarea, reducing cognitive load of routine responses while keeping content editable.",
            "Experience tags appear on every thread item — the most operationally relevant context after the guest name.",
          ],
        },
        {
          type: "screen",
          number: "05",
          title: "Experiences Module",
          question:
            "Which of my experiences need attention, and what kind of attention do they need?",
          image: null,
          decisions: [
            "Grid/table view with classification badges and content health bars communicates experience status without requiring the user to read every number.",
            "Red card border on Declining experiences makes the problem visible before the user reads the KPIs.",
            "Alert banner surfaces the single most urgent issue above the fold — cannot be missed.",
          ],
        },
        {
          type: "screen",
          number: "06",
          title: "Content & Media Library",
          question:
            "Is my content fresh, complete, and ready to convert high-intent visitors?",
          image: null,
          decisions: [
            "Stale and missing-alt-text assets flagged in a dedicated section above the rest of the media grid — alert-first pattern used throughout the platform.",
            "Right-hand Content Health panel scores five dimensions with colour-coded sub-scores, then lists specific items requiring attention with direct CTAs.",
          ],
        },
        {
          type: "screen",
          number: "07",
          title: "Settings Module",
          question:
            "How do I configure my account without losing my place in the product?",
          image: null,
          decisions: [
            "Secondary navigation rail (not the global sidebar) for sub-section navigation — reducing sidebar items to seven while giving settings the depth it needs.",
            "Notification toggles map precisely to the five Partnership Health Score components — a deliberate conceptual link between monitoring and alerting.",
          ],
        },
      ],
    },

    // ── 06 · Notable Decisions ───────────────────────────────────────────────
    {
      id: "decisions",
      number: "06",
      title: "Notable Design Decisions",
      shortTitle: "Key Decisions",
      blocks: [
        {
          type: "paragraph",
          text: "Some decisions required trading off competing values. These were the most deliberate.",
        },
        {
          type: "decision",
          number: "1",
          title: "Leading with a Composite Score",
          body: "Opening a dashboard with a single number — the Partnership Health Score at 82/100 — is a significant departure from standard analytics product patterns, where raw data is typically shown first. The argument for it: executive-level users already have a mental model of 'how are we doing?' The score answers that question in under one second and earns the user's trust to drill down. Bloomberg does the same thing with risk indicators; the score is the headline, the data is the article.",
        },
        {
          type: "decision",
          number: "2",
          title: "Colour Used Functionally, Not Decoratively",
          body: "The platform uses colour only for three purposes: blue for XARISS-branded UI elements and primary actions, and semantic green/amber/red for health status only. Everything else is neutral. This means classification badges and health bars carry meaning that persists across every screen. When a store manager sees an amber bar anywhere in the product, they already know it means warning. The system teaches itself through consistency.",
        },
        {
          type: "decision",
          number: "3",
          title: "The Recommended Actions Section",
          body: "The Recommended Actions section — URGENT / ATTENTION / OPPORTUNITY / MAINTENANCE — was not in the original brief. It emerged from a recognition that insight cards alone do not close the loop. A user who reads 'Private Shopping conversion -31%' and a Review button still has to decide what reviewing means. The actions section frames each issue as a problem statement with an estimated consequence and a single direct CTA. That is not data — it is an instruction grounded in data.",
        },
        {
          type: "decision",
          number: "4",
          title: "Role Switching as Navigation, Not Settings",
          body: "Switching between Brand Owner view and Store Manager view is surfaced as a top-level navigation element, not buried in profile settings. This reflects a real pattern in multi-role enterprise tools: the same user often needs to shift contexts during a single session. Making the role switch instantaneous and visually confirmed (avatar colour change, scope label update, sidebar swap) means users can toggle between the two views in two clicks without losing their place in the data.",
        },
        {
          type: "decision",
          number: "5",
          title: "Funnel Over Time vs Funnel as State",
          body: "Standard conversion funnel designs show the current state: X impressions became Y views became Z bookings. The XARISS analytics funnel adds a second layer — the prior period as a dashed outline behind the current bars — so the user sees not just the current conversion shape but whether that shape has changed. This is the difference between 'conversion at this stage is 3.4%' and 'conversion at this stage is 3.4%, down from 9% last month.' Only the second sentence creates urgency and earns the design its diagnostic claim.",
        },
      ],
    },

    // ── 07 · Outcomes ────────────────────────────────────────────────────────
    {
      id: "outcomes",
      number: "07",
      title: "Outcomes & Reflection",
      shortTitle: "Outcomes",
      blocks: [
        {
          type: "stats-grid",
          items: [
            { value: "12", label: "Design Phases" },
            { value: "7", label: "Hi-Fi Screens" },
            { value: "2", label: "User Roles" },
            { value: "190KB", label: "Unified Prototype" },
          ],
        },
        {
          type: "paragraph",
          text: "The work demonstrates the ability to take a vague product brief through research synthesis, information architecture, feature specification, design system creation, and into a polished high-fidelity prototype — without losing coherence at any stage.",
        },
        {
          type: "paragraph",
          text: "Fluency in enterprise SaaS design patterns: multi-role access models, data table design, analytics dashboard hierarchy, notification and alert systems, and operational workflow UX. A clear understanding that data products only work when the design actively reduces the interpretive burden on the user. Every screen was designed to answer a specific question, not to display all available data.",
        },
        {
          type: "reflection",
          heading: "What I Would Do Differently",
          items: [
            "User testing with actual luxury brand operations staff would likely surface edge cases in the experience table — specifically around multi-store experiences that appear in different contexts.",
            "The mobile-responsive design was scoped out to maintain prototype fidelity, but store managers are more likely to be on tablet than desktop. A tablet variant would be the highest-priority next iteration.",
            "The onboarding flow for a new brand partner — setting up their first experience, configuring availability, connecting their store — is the missing context for how users arrive at this platform.",
          ],
        },
      ],
    },
  ],
};

// ─── Export ──────────────────────────────────────────────────────────────────

export const caseStudies: CaseStudyData[] = [xarissCaseStudy];

export function getCaseStudyBySlug(slug: string): CaseStudyData | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}
