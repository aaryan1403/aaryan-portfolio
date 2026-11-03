import xarissDashboard from "@/assets/projects/Shots XARISS.jpeg";
import cpiRecording from "@/assets/video/cpi-recording.mp4";
import cpiRecordingPoster from "@/assets/video/cpi-recording-poster.jpg";
import cpiCover from "@/assets/projects/Shots CPI.png";
import yifCover from "@/assets/projects/Shots Member Login.jpeg";
import doubleDiamond from "@/assets/projects/Double Diamond Process Nessler 2018.jpg";
import cpiOnboarding from "@/assets/projects/CPI onboarding and Add Task.png";
import cpiHome from "@/assets/projects/CPI Home.png";
import cpiAnalysis from "@/assets/projects/CPI analysis.png";
import xarissDashboardPreview from "@/assets/projects/xariss-dashboard-preview.png";
import xarissExperiences from "@/assets/projects/xariss-experiences.png";
import xarissInbox from "@/assets/projects/xariss-inbox.png";
import xarissStoreDashboard from "@/assets/projects/xariss-store-dashboard.png";
import xarissManageExperiences from "@/assets/projects/xariss-manage-experiences.png";
import yifBefore from "@/assets/projects/yif-before.png";
import yifAfter from "@/assets/projects/yif-after.png";
import yifScreenLoginLight from "@/assets/projects/yif-screen-login-light.png";
import yifScreenLoginSplit from "@/assets/projects/yif-screen-login-split.jpg";
import yifScreenMembersV1 from "@/assets/projects/yif-screen-members-v1.png";
import yifScreenMembersV2 from "@/assets/projects/yif-screen-members-v2.png";
import yifScreenMembersV3 from "@/assets/projects/yif-screen-members-v3.png";

// ─── Content Block Types ────────────────────────────────────────────────────

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "placeholder-image"; label: string; caption?: string; src?: string }
  | {
      type: "persona";
      name: string;
      role: string;
      location: string;
      question: string;
      details: string[];
    }
  | {
      type: "rich-persona";
      name: string;
      initial: string;
      avatarColor: string;
      avatarTextColor: string;
      avatarPhoto?: string;
      role: string;
      company: string;
      location: string;
      quote: string;
      goals: string[];
      painPoints: string[];
      behaviour: string;
    }
  | { type: "persona-pair"; personas: Extract<ContentBlock, { type: "rich-persona" }>[] }
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
      type: "spacing-visual";
      baseUnit: number;
      tokens: { name: string; px: number; color: string }[];
      columns: number;
      gutters: string;
      maxWidth: string;
      cardPadding: string;
    }
  | {
      type: "screen";
      number: string;
      title: string;
      question: string;
      image: string | null | undefined;
      decisionsHeading?: string;
      decisions: string[];
    }
  | { type: "decision"; number: string; title: string; body: string }
  | { type: "stats-grid"; items: { value: string; label: string }[] }
  | { type: "callout"; text: string }
  | { type: "reflection"; heading: string; items: string[] }
  | {
      type: "process-steps";
      steps: { label: string; description?: string; subItems?: string[] }[];
    }
  | { type: "role-tags"; tags: string[] }
  | {
      type: "donut-stats";
      items: { percentage: number; label: string; description: string }[];
    }
  | {
      type: "timeline-visual";
      variant: 1 | 2 | 3;
      items: { range: string; stage: string; deliverable: string }[];
    }
  | {
      type: "diamond-visual";
      variant: 1 | 2 | 3;
      items: { range: string; stage: string; deliverable: string }[];
    }
  | { type: "conclusion-statements"; items: string[] }
  | {
      type: "learnings-grid";
      items: { number: string; label: string; body: string }[];
    }
  | { type: "closing-quote"; text: string }
  | { type: "large-paragraph"; text: string }
  | { type: "design-rules-cards"; items: { label: string; body: string }[] }
  | { type: "design-decisions"; items: { bold: string; body: string }[] }
  | { type: "pull-quote"; text: string }
  | {
      type: "appendix-blocks";
      intro: string;
      items: { number: string; title: string; paragraphs: string[]; why: string }[];
    }
  | {
      type: "gantt-timeline";
      totalWeeks: number;
      uxPhases: { label: string; subItems: string[]; startWeek: number; endWeek: number }[];
      uiPhases: { label: string; subItems: string[]; startWeek: number; endWeek: number }[];
    }
  | {
      type: "process-phase-cards";
      items: {
        iconType: "users" | "target" | "lightbulb" | "layers" | "check";
        title: string;
        bullets: string[];
      }[];
    }
  | { type: "ia-tree" }
  | {
      type: "design-laws";
      items: { name: string; concept: string; implementation: string }[];
    }
  | {
      type: "before-after";
      beforeTitle: string;
      afterTitle: string;
      beforeDescription: string;
      afterDescription: string;
      beforeItems: string[];
      afterItems: string[];
      beforeImage?: string;
      afterImage?: string;
    }
  | {
      type: "yif-persona";
      name: string;
      age: number;
      education: string;
      status: string;
      occupation: string;
      location: string;
      story: string;
      goals: string[];
      painPoints: string[];
      needs: string;
      motivations?: string[];
      avatarPhoto?: string;
    }
  | { type: "yif-persona-pair"; personas: Extract<ContentBlock, { type: "yif-persona" }>[] }
  | { type: "exec-summary"; paragraphs: string[]; metrics: { value: string; label: string }[] }
  | { type: "foundation-statement"; overline: string; statement: string; body: string }
  | {
      type: "research-block";
      overline: string;
      stats: { value: string; label: string }[];
      paragraphs: { text: string; voice: "brand-owner" | "store-manager" }[];
    }
  | { type: "problem-callout"; overline: string; text: string }
  | {
      type: "research-goals";
      goals: { id: string; text: string }[];
    }
  | {
      type: "research-questions";
      rows: { questionType: "GENERATIVE" | "EVALUATIVE"; question: string; role: string }[];
    }
  | {
      type: "success-metrics";
      rows: { metric: string; baseline: string; target: string; outcome: string }[];
    }
  | {
      type: "what-i-found";
      text: string;
    }
  | {
      type: "ideation-cards";
      openingLine: string;
      cards: { status: "rejected" | "selected"; title: string; description: string }[];
      closingLine: string;
    };

// ─── Section & Study Types ───────────────────────────────────────────────────

export type CaseStudySection = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  titleParts?: { text: string; accent: boolean }[];
  isAppendix?: boolean;
  group?: string;
  blocks: ContentBlock[];
};

export type CaseStudyStat = { value: string; label: string };

export type CaseStudyData = {
  slug: string;
  title: string;
  subtitle: string;
  coverImage: string;
  demoVideo?: string;
  demoPoster?: string;
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
    "Designing an enterprise analytics and operations platform for luxury brand partnerships. From a blank brief to a full 7-screen high-fidelity prototype.",
  coverImage: xarissDashboard,
  demoVideo: "/xariss-demo.mp4",
  demoPoster: "/xariss-demo-poster.jpg",
  accentColor: "#1a2744",
  accentColorDark: "#3B6FD4",
  role: "UX Designer (Solo)",
  timeline: "12-phase process",
  tools: "Figma · HTML/CSS",
  deliverable: "7 hi-fi screens + design system",
  behanceUrl:
    "https://www.behance.net/gallery/245926805/Luxury-Enterprise-SaaS-Panel",
  stats: [
    { value: "48", label: "Partners Onboarded" },
    { value: "<10min", label: "Data to Decision" },
    { value: "68%", label: "Partner Activation Rate" },
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
          type: "exec-summary",
          paragraphs: [
            "XARISS connects luxury brand partners with high-value customers through curated in-store experiences. But partners had no visibility into how those experiences were performing. Listing updates had to go through the XARISS team. There was no way to compare stores, track conversions, or know if the partnership was commercially worth it.",
            "I designed the Partner Intelligence Platform — a dual-role analytics and operations dashboard serving two very different users: Brand Owners who think in portfolio-level patterns, and Store Managers who think in today's tasks. One product, one navigation, but every section scoped to the user's role.",
          ],
          metrics: [
            { value: "48", label: "Partners onboarded" },
            { value: "<10min", label: "Data to decision" },
            { value: "68%", label: "Partner activation rate" },
          ],
        },
        {
          type: "foundation-statement",
          overline: "LAYING THE FOUNDATION",
          statement: "Italian luxury brands. Global labels. Independent houses.",
          body: "We were asking all of them to hand us their stores, their customers, and their reputation — and giving them **nothing to measure us by**.",
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
          type: "research-block",
          overline: "RESEARCH",
          stats: [
            { value: "24", label: "Interviews" },
            { value: "6", label: "Brand Owners" },
            { value: "18", label: "Store Managers" },
          ],
          paragraphs: [
            {
              text: "I interviewed 24 partners. The Brand Owners weren't frustrated. They were **indifferent** — already listed on platforms they'd forgotten about. When I asked how they track which partnerships drive revenue, the most common answer was _we don't_.",
              voice: "brand-owner",
            },
            {
              text: "The Store Managers had **the opposite energy**. They cared too much. Online enquiries coming through XARISS were landing in spreadsheets between walk-in customers, and peak season meant those **spreadsheets just stopped getting opened**.",
              voice: "store-manager",
            },
          ],
        },
        {
          type: "problem-callout",
          overline: "PROBLEM STATEMENT",
          text: "How do I build a single system that **proves commercial value** to Brand Owners who have no reason to trust another platform, and **eliminates operational friction** for Store Managers who don't have 10 minutes to spare?",
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
          text: "Instead of jumping straight to screens, the process was structured into twelve sequential phases. Each phase produced a concrete document: information architecture, feature spec, design system, component library, dashboard architecture. No high-fidelity screen was touched until all of that existed.",
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

    // ── 04 · From Research to Reasoning ──────────────────────────────────────
    {
      id: "reasoning",
      number: "04",
      title: "From Research to Reasoning",
      shortTitle: "Reasoning",
      titleParts: [
        { text: "From Research ", accent: false },
        { text: "to Reasoning", accent: true },
      ],
      blocks: [
        {
          type: "research-goals",
          goals: [
            { id: "G1", text: "Understand how brand managers define commercial value." },
            { id: "G2", text: "Identify current decision-making workflows and what data partners look for before investing more." },
            { id: "G3", text: "Map trust barriers toward external platforms." },
            { id: "G4", text: "Understand time constraints and cognitive load of store-level staff." },
            { id: "G5", text: "Identify what triggers a partner to take action versus ignore a signal." },
          ],
        },
        {
          type: "research-questions",
          rows: [
            { questionType: "GENERATIVE", question: "How do you evaluate if a partnership is working?", role: "Brand Owner" },
            { questionType: "GENERATIVE", question: "What data do you look for before investing more?", role: "Brand Owner" },
            { questionType: "GENERATIVE", question: "Have you worked with platforms you didn't trust? Why?", role: "Brand Owner" },
            { questionType: "EVALUATIVE", question: "If you had one screen, what would you want to see first?", role: "Brand Owner" },
            { questionType: "GENERATIVE", question: "How do you track performance or customer interest today?", role: "Store Manager" },
            { questionType: "GENERATIVE", question: "What slows you down when using reports or spreadsheets?", role: "Store Manager" },
            { questionType: "EVALUATIVE", question: "How much time do you have for dashboards in a day?", role: "Store Manager" },
            { questionType: "EVALUATIVE", question: "How should urgent issues be communicated to you?", role: "Store Manager" },
          ],
        },
        {
          type: "success-metrics",
          rows: [
            { metric: "Partner Activation Rate", baseline: "No prior platform", target: "≥ 60%", outcome: "68%" },
            { metric: "Time to Decision", baseline: "No self-serve data", target: "< 15 min", outcome: "< 10 min" },
            { metric: "Partners Onboarded", baseline: "0", target: "40+", outcome: "48" },
          ],
        },
        {
          type: "what-i-found",
          text: "Thematic analysis on the 24 interviews surfaced five recurring pain points, but they all came back to the same root: partners had **no self-serve way to understand or manage their presence on XARISS**. Brand Owners **couldn't measure value**. Store Managers **couldn't manage workload**. Both were dependent on us for things they should've been able to do themselves.",
        },
        {
          type: "ideation-cards",
          openingLine: "I ran Crazy 8s to generate breadth, then Dark Side Ideation to stress-test the worst versions of each idea. Three directions emerged. **Two failed. One survived.**",
          cards: [
            {
              status: "rejected",
              title: "Separate dashboards per role",
              description: "A dedicated Brand Owner app and a separate Store Manager app. Rejected — doubles the maintenance surface, fragments the product, and forces future features to be built twice.",
            },
            {
              status: "rejected",
              title: "Single dashboard, toggle between views",
              description: "One screen with a role toggle at the top. Rejected — Store Managers would see a Brand Owner view they can't use every time they switch. Cognitive noise for the user who has the least time to waste.",
            },
            {
              status: "selected",
              title: "One navigation, role-scoped data",
              description: "Same structure, same pages, but every section opens pre-filtered to the user's scope. Brand Owners see portfolio-level data. Store Managers see their store only. No toggles, no confusion, no duplicate product.",
            },
          ],
          closingLine: "That last direction became the architecture: a vertical information cascade where each layer answers a progressively more specific question. The top of the dashboard answers the primary question **in under 60 seconds**. Everything below it exists to explain why.",
        },
      ],
    },

    // ── 05 · User Personas ────────────────────────────────────────────────────
    {
      id: "personas",
      number: "05",
      title: "User Personas",
      shortTitle: "Personas",
      blocks: [
        {
          type: "persona-pair",
          personas: [
            {
              type: "rich-persona",
              name: "Marco R.",
              initial: "M",
              avatarColor: "#1e40af",
              avatarTextColor: "#ffffff",
              avatarPhoto: "https://randomuser.me/api/portraits/men/32.jpg",
              role: "Brand Owner",
              company: "Gucci Italia",
              location: "Milan · Manages 4 stores",
              quote: "Which stores are actually driving revenue, and which ones are underperforming?",
              goals: [
                "See portfolio performance at a glance without digging through reports",
                "Compare store-level KPIs to identify where to invest attention",
                "Make data-driven decisions about listing strategy and pricing",
                "Justify platform value to internal stakeholders with clear ROI",
              ],
              painPoints: [
                "Raw data without clear interpretation wastes decision-making time",
                "No single place to compare all stores, has to jump between tools",
                "Can't tell if a conversion drop is seasonal or structural",
                "Insight cards that describe a problem but suggest no action",
              ],
              behaviour: "Logs in weekly or before brand reviews. Treats the platform as an executive report, not a daily tool. Skips navigation and goes straight to top-line scores.",
            },
            {
              type: "rich-persona",
              name: "Giulia L.",
              initial: "G",
              avatarColor: "#0f766e",
              avatarTextColor: "#ffffff",
              avatarPhoto: "https://randomuser.me/api/portraits/women/44.jpg",
              role: "Store Manager",
              company: "Gucci Florence",
              location: "Via Tornabuoni · Manages 1 store",
              quote: "What do I need to do today to keep bookings coming in?",
              goals: [
                "Know what needs my attention before the first guest arrives",
                "Respond to customer inquiries quickly, with the right context",
                "Keep listing content fresh and availability slots up to date",
                "Understand why bookings dropped without needing an analyst",
              ],
              painPoints: [
                "Dashboards built for analysts, not operators. Too much noise for daily use",
                "Guest inquiries buried in email, disconnected from booking context",
                "No clear signal when a listing needs to be updated vs. is fine",
                "Period-based analytics are useless at 9am, she needs today's picture",
              ],
              behaviour: "Checks the dashboard every morning and after lunch. Uses it like a task list, checking what's overdue, what's urgent, and what can wait.",
            },
          ],
        },
      ],
    },

    // ── 06 · Screen Decisions ────────────────────────────────────────────────
    {
      id: "screens",
      number: "06",
      title: "Screen Decisions",
      shortTitle: "Screens",
      blocks: [
        {
          type: "paragraph",
          text: "Every screen was designed around one primary question. The zone ordering, component selection, and hierarchy all followed from that question, not from convention.",
        },
        {
          type: "screen",
          number: "01",
          title: "Brand Owner Dashboard",
          question:
            "Is my partnership performing, and which store is responsible for the gap?",
          image: xarissDashboardPreview,
          decisionsHeading: "WHY THIS UX WORKS",
          decisions: [
            "Partners had no self-serve visibility. Performance data lived in internal XARISS reports that partners had to request and wait for. This dashboard replaces that dependency entirely.",
            "The Partnership Health Score sits first because Brand Owners don't have time to interpret raw numbers — they need a pass/fail read in five seconds. The KPI cards show 30-day deltas because that's how they told me they think: month over month, up or down, invest more or pull back. What used to be a \"send me the report\" email is now a single glance.",
          ],
        },
        {
          type: "screen",
          number: "02",
          title: "Store Manager Dashboard",
          question: "What do I need to act on today?",
          image: xarissStoreDashboard,
          decisionsHeading: "WHY THIS UX WORKS",
          decisions: [
            "Same shell, same nav, but every metric is scoped to one store and one day. KPIs show today's bookings, today's enquiries, today's revenue — not last month's trends. Replaces the spreadsheet Store Managers were maintaining between walk-in customers.",
            "The Conversion sub-score at 58% in red tells them what needs fixing without reading anything else.",
          ],
        },
        {
          type: "screen",
          number: "03",
          title: "Experience Analytics",
          question:
            "Why is this experience's conversion collapsing, and what specifically broke?",
          image: xarissExperiences,
          decisionsHeading: "WHY THIS UX WORKS",
          decisions: [
            "Five-stage conversion funnel with drop-off rates color-coded between stages — green for normal, amber for elevated, red for critical. Partners used to see a booking number and have no idea where demand was being lost.",
            "Now the funnel shows exactly where it breaks: the -84% View → Attempt drop turns red, a contextual callout appears inline with a \"Check Availability\" CTA. The diagnosis and the fix live in the same view.",
          ],
        },
        {
          type: "screen",
          number: "04",
          title: "Customers / Inquiry Inbox",
          question:
            "Who needs a response right now, and what do I know about them before I reply?",
          image: xarissInbox,
          decisionsHeading: "WHY THIS UX WORKS",
          decisions: [
            "Three-panel layout — thread list, message detail, guest profile. Store Managers were answering enquiries blind, with no context on who the customer was or what they'd booked before. Now the guest's booking history, lifetime value, and cancellation rate are visible before they even read the message.",
            "Reply templates pre-populate routine responses so a Store Manager between walk-in customers can respond in under 30 seconds instead of drafting from scratch. Overdue threads turn red at 24 hours — urgency through time, not badge counts.",
          ],
        },
        {
          type: "screen",
          number: "05",
          title: "Experiences Module",
          question:
            "Which of my experiences need attention, and what kind of attention do they need?",
          image: xarissManageExperiences,
          decisions: [
            "Grid/table view with classification badges and content health bars communicates experience status without requiring the user to read every number.",
            "Red card border on Declining experiences makes the problem visible before the user reads the KPIs.",
            "Alert banner surfaces the single most urgent issue above the fold. Hard to miss.",
          ],
        },
        {
          type: "screen",
          number: "06",
          title: "Content & Media Library",
          question:
            "Is my content fresh, complete, and ready to convert high-intent visitors?",
          image: undefined,
          decisions: [
            "Stale and missing-alt-text assets are flagged in a section above the main media grid. Alert-first pattern, consistent with the rest of the platform.",
            "Right-hand Content Health panel scores five dimensions with colour-coded sub-scores, then lists specific items requiring attention with direct CTAs.",
          ],
        },
        {
          type: "screen",
          number: "07",
          title: "Settings Module",
          question:
            "How do I configure my account without losing my place in the product?",
          image: undefined,
          decisions: [
            "A secondary navigation rail handles sub-sections instead of the global sidebar, keeping the sidebar at seven items while giving settings the depth it needs.",
            "Notification toggles map directly to the five Partnership Health Score components, creating a clear conceptual link between monitoring and alerting.",
          ],
        },
      ],
    },

    // ── 08 · Notable Decisions ───────────────────────────────────────────────
    {
      id: "decisions",
      number: "07",
      title: "Notable Design Decisions",
      shortTitle: "Key Decisions",
      blocks: [
        {
          type: "paragraph",
          text: "Some decisions involved real tradeoffs. These were the most thought-through ones.",
        },
        {
          type: "decision",
          number: "1",
          title: "Leading with a Composite Score",
          body: "Opening a dashboard with a single number (the Partnership Health Score at 82/100) is a departure from typical analytics products, where raw data comes first. The argument for it: executive users already carry a mental model of \"how are we doing?\" The score answers that in under a second, and once it does, users are ready to dig in. Bloomberg works the same way with risk indicators. The score is the headline. The data is the article.",
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
          body: "The Recommended Actions section (URGENT / ATTENTION / OPPORTUNITY / MAINTENANCE) was not in the original brief. It came from realising that insight cards alone don't close the loop. A user who reads \"Private Shopping conversion -31%\" and sees a Review button still has to figure out what reviewing actually means. The actions section reframes each issue as a problem with an estimated consequence and one direct CTA. That's not data. It's an instruction grounded in data.",
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
          body: "Most funnel designs show the current state: X impressions, Y views, Z bookings. The XARISS analytics funnel adds a second layer, showing the prior period as a dashed outline behind the current bars. So you're not just seeing the current conversion shape, you're seeing whether it has changed. The difference between \"conversion is 3.4%\" and \"conversion is 3.4%, down from 9% last month\" is the difference between a number and a problem. Only the second version creates urgency.",
        },
      ],
    },

    // ── 09 · Outcomes ────────────────────────────────────────────────────────
    {
      id: "outcomes",
      number: "08",
      title: "Outcomes & Reflection",
      shortTitle: "Outcomes",
      blocks: [
        {
          type: "stats-grid",
          items: [
            { value: "48", label: "Partners Onboarded" },
            { value: "<10min", label: "Data to Decision" },
            { value: "7", label: "Hi-Fi Screens" },
            { value: "2", label: "User Roles" },
          ],
        },
        {
          type: "paragraph",
          text: "The work shows what it takes to move a vague brief through research, information architecture, feature specification, and design system creation, all the way into a polished high-fidelity prototype, without losing the thread at any stage.",
        },
        {
          type: "paragraph",
          text: "It also showed fluency in enterprise SaaS patterns: multi-role access models, data table design, analytics hierarchy, notification systems, and operational workflow UX. The core insight underneath all of it is that data products only work when the design actively lowers the interpretive burden on the user. Every screen had a question it was trying to answer, not data it was trying to display.",
        },
        {
          type: "reflection",
          heading: "What I Would Do Differently",
          items: [
            "The mobile-responsive design was scoped out to maintain prototype fidelity, but store managers are more likely to be on tablet than desktop. A tablet variant would be the highest-priority next iteration.",
            "The onboarding flow for a new brand partner (setting up their first experience, configuring availability, connecting their store) is the missing piece that explains how users actually arrive at this platform.",
          ],
        },
      ],
    },

    // ── Appendix ─────────────────────────────────────────────────────────────
    {
      id: "appendix",
      number: "",
      title: "What's Not in This Case Study",
      shortTitle: "Appendix",
      isAppendix: true,
      blocks: [
        {
          type: "appendix-blocks",
          intro: "This case study covers what I can show. Here's what I left out, and why.",
          items: [
            {
              number: "01",
              title: "Initial User Research",
              paragraphs: [
                "Before any IA or feature decisions, I ran **surveys** and **semi-structured interviews** with Brand Owners and Store Managers from active XARISS partnerships. The goal was to understand how they currently track performance, where they feel stuck waiting on the XARISS team, and what decisions they simply can't make without better data.",
                "That research is where the two core pain points came from — partners depending on internal teams for basic content updates, and having no clear way to know if the partnership is actually worth it commercially. Everything in the platform traces back to those two things.",
              ],
              why: "The interviews include sensitive partner information and internal business context that can't be made public without sign-off.",
            },
            {
              number: "02",
              title: "Ideation & Early Exploration",
              paragraphs: [
                "The features didn't come out of nowhere. Before settling on the dashboard structure, we ran **Crazy 8s** sessions to sketch out very different directions, including a simpler report-only version and one that put the customer inbox front and centre instead of performance data.",
                "A lot of those directions didn't work, and that was the point. The call to lead with the Partnership Health Score came directly from those sessions. We tested what happened when partners landed on raw KPI numbers first, and they'd spend the opening minute just trying to figure out if things were good or bad. The UI was making them do work it should have done for them.",
              ],
              why: "Early sketches are messy on purpose. Without the conversation around them, they just look like rough drawings rather than actual decisions being worked through.",
            },
            {
              number: "03",
              title: "Testing & Validation",
              paragraphs: [
                "Three rounds of testing shaped the final designs.",
                "**A/B testing** on the dashboard layout, mainly around whether the Health Score or the KPI cards should come first. The Health Score version consistently got partners to a clear read faster, with fewer questions during moderated sessions.",
                "**Heatmap analysis** via Hotjar on a clickable prototype. The standout finding: people kept clicking the small sparklines inside the KPI cards expecting to open Analytics. That made it obvious the drill-down needed to be a real interaction, not just a visual detail.",
                "**Supervised usability testing** with Brand Owner and Store Manager participants, run in separate sessions because their mental models are genuinely different. Store Managers moved through operational tasks faster than we expected. Brand Owners struggled more with moving between the store comparison and experience performance tables, which is what drove the final layout sequencing.",
              ],
              why: "Recordings and heatmap data stay internal to XARISS. The findings show up throughout the case study in the decisions they led to — this section just makes that visible.",
            },
          ],
        },
      ],
    },
  ],
};

// ─── Pace Yourself Case Study ────────────────────────────────────────────────

const paceyourselfCaseStudy: CaseStudyData = {
  slug: "paceyourself",
  title: "Pace Yourself",
  subtitle:
    "A Mobile App for People Living with Chronic Pain to manage and understand their daily lives better.",
  coverImage: cpiCover,
  demoVideo: cpiRecording,
  demoPoster: cpiRecordingPoster,
  accentColor: "#5B3A8C",
  accentColorDark: "#9B72CF",
  role: "UX/UI Designer (Solo)",
  timeline: "8-week academic project",
  tools: "Figma · Miro · Adobe XD",
  deliverable: "End-to-end hi-fi prototype + design system",
  behanceUrl: "https://www.behance.net/gallery/207388571/Pace-Yourself",
  stats: [
    { value: "1,000+", label: "Active Users" },
    { value: "3", label: "User Personas" },
    { value: "5", label: "Research Methods" },
    { value: "20+", label: "Wireframe Screens" },
  ],
  sections: [
    // ── 01 · Project Overview ─────────────────────────────────────────────────
    {
      id: "overview",
      number: "01",
      title: "Project Overview",
      shortTitle: "Overview",
      group: "Introduction",
      blocks: [
        {
          type: "paragraph",
          text: "The project moved through several phases: ideation, persona development, multiple design rounds, and the final prototype. Each phase brought decisions shaped by what users actually needed, what was technically buildable, and what made sense as design.",
        },
        {
          type: "paragraph",
          text: "Pace Yourself is a digital health platform built as part of an academic UX project at University College Dublin (MSc HCI), focused on chronic pain management. The project looked at how emerging technologies like VR gamification, wearable sensors, and AI coaching could come together into a single mobile-first product.",
        },
      ],
    },

    // ── 02 · Problem Statement ────────────────────────────────────────────────
    {
      id: "problem",
      number: "02",
      title: "Problem Statement",
      shortTitle: "Problem",
      group: "Introduction",
      blocks: [
        {
          type: "paragraph",
          text: "Chronic pain is a persistent, often debilitating condition that affects millions of people. Unlike acute pain, it doesn't go away after the expected healing window, and it can completely disrupt how someone lives. People dealing with it regularly face social isolation, emotional strain, and a frustrating lack of understanding from those around them, including their doctors.",
        },
        {
          type: "paragraph",
          text: "The challenge was to design something that could genuinely help: manage pain, support mental and emotional health, and improve daily life. Not just a symptom tracker. A whole-person approach.",
        },
      ],
    },

    // ── 03 · Problem Solution ─────────────────────────────────────────────────
    {
      id: "solution",
      number: "03",
      title: "Problem Solution",
      shortTitle: "Solution",
      group: "Introduction",
      blocks: [
        {
          type: "paragraph",
          text: "We built a mobile app that helps people manage chronic pain through personalised tracking, community support, and educational content. It addresses the physical side of pain, but also the emotional and social weight that comes with it.",
        },
        {
          type: "paragraph",
          text: "The platform grows with the user, tracking long-term trends while delivering daily interactions that still feel achievable on a bad day. The name 'Pace Yourself' is deliberate. It reflects the reality that good days and bad days both happen, and that progress matters more than perfection.",
        },
      ],
    },

    // ── 04 · My Role ──────────────────────────────────────────────────────────
    {
      id: "role",
      number: "04",
      title: "My Role",
      shortTitle: "My Role",
      group: "Introduction",
      blocks: [
        {
          type: "paragraph",
          text: "This was a group academic project at University College Dublin. I was involved across most phases, from research strategy through to final prototype.",
        },
        {
          type: "role-tags",
          tags: [
            "Design Strategy",
            "Problem Solution",
            "Information Architecture",
            "Empathy Mapping",
            "Usability Testing",
            "User Flow",
            "Prototyping",
            "Wireframes",
            "Competitive Analysis",
            "Visual Design",
            "User Research",
            "User Persona",
          ],
        },
      ],
    },

    // ── 05 · Design Thinking Process ─────────────────────────────────────────
    {
      id: "design-thinking",
      number: "05",
      title: "Design Thinking Process",
      shortTitle: "Design Thinking",
      group: "Research",
      blocks: [
        {
          type: "paragraph",
          text: "The process was human-centred from the start. We used 'How Might We' questions to frame the ideation, and each phase produced something concrete that fed directly into the next one.",
        },
        {
          type: "process-steps",
          steps: [
            {
              label: "Discover",
              subItems: ["User Research", "User Interview", "Entrant Analysis"],
            },
            {
              label: "Define",
              subItems: [
                "User Persona",
                "User Journey Map",
                "Goal Statement",
                "Empathy Map",
              ],
            },
            {
              label: "Ideate",
              subItems: ["Brainstorming", "Card Sorting", "User Flow"],
            },
            {
              label: "Design",
              subItems: [
                "Paper Wireframes",
                "Visual Design",
                "Prototype",
              ],
            },
            {
              label: "Test",
              subItems: [
                "Check Usability",
                "Survey Insight",
                "Improvements",
              ],
            },
          ],
        },
      ],
    },

    // ── 06 · Project Timeline ─────────────────────────────────────────────────
    {
      id: "timeline",
      number: "06",
      title: "Project Timeline",
      shortTitle: "Timeline",
      group: "Research",
      blocks: [
        {
          type: "paragraph",
          text: "The project ran across two parallel tracks, UX Design and UI Design, sequenced deliberately so visual decisions came after structure had been validated.",
        },
        {
          type: "timeline-visual",
          variant: 1,
          items: [
            { range: "W1–2", stage: "UX: Research & Discovery", deliverable: "Desk research, user interviews, competitive landscape analysis, technology audit" },
            { range: "W2–3", stage: "UX: Define & Synthesise", deliverable: "Thematic analysis, affinity maps, 3 user personas, HMW question bank" },
            { range: "W3–4", stage: "UX: Ideation", deliverable: "Crazy 8s session, dark side ideation, concept selection matrix, strategic focus statement" },
            { range: "W4–5", stage: "UX: Information Architecture", deliverable: "Site map, user flows, wireframe sketches for all key screens" },
            { range: "W5–6", stage: "UI: Design System", deliverable: "Typography scale, colour system, component library foundations" },
            { range: "W6–7", stage: "UI: Visual Design", deliverable: "High-fidelity screens: Onboarding, Home Dashboard, Pain Analysis, VR Module" },
            { range: "W7–8", stage: "UI: Prototype & Test", deliverable: "Interactive prototype, usability test sessions, final iteration pass" },
          ],
        },
      ],
    },

    // ── 07 · Technological Interventions ─────────────────────────────────────
    {
      id: "tech-interventions",
      number: "07",
      title: "Technological Interventions",
      shortTitle: "Tech",
      group: "Research",
      blocks: [
        {
          type: "paragraph",
          text: "Research into chronic pain interventions pointed to three technology categories. The design weighted each based on evidence of user impact.",
        },
        {
          type: "donut-stats",
          items: [
            {
              percentage: 40,
              label: "VR & Gamification",
              description:
                "These tools distract from pain and educate users through immersive experiences, reducing perceived pain intensity in clinical studies.",
            },
            {
              percentage: 35,
              label: "Wearables",
              description:
                "Devices that track movement and provide real-time feedback to help manage pain through passive biometric monitoring.",
            },
            {
              percentage: 25,
              label: "AI Applications",
              description:
                "Personalised tracking and therapeutic content tailored to users' pain and emotional needs via conversational AI.",
            },
          ],
        },
      ],
    },

    // ── 08 · Design Challenges ────────────────────────────────────────────────
    {
      id: "challenges",
      number: "08",
      title: "Design Challenges",
      shortTitle: "Challenges",
      group: "Research",
      blocks: [
        {
          type: "paragraph",
          text: "Chronic pain is complex in a way most design problems aren't. It affects physical health, emotional state, and social life at the same time. The core challenge was building something that could genuinely support pain management while making daily life better, not just record it.",
        },
        {
          type: "paragraph",
          text: "First: pain is invisible. A 7/10 for one person might be a 4/10 for another, and the same person's 7/10 on a Monday can mean something completely different on a Friday. A tracking system that just asks for a number without context will produce data that's useless.",
        },
        {
          type: "paragraph",
          text: "Second: cognitive load under distress. The user who most needs the app on a high-pain day is also the least able to deal with a complex interface. The design has to work for someone who's exhausted and in pain. Simpler, not just smaller.",
        },
        {
          type: "paragraph",
          text: "Third: the hope-despair cycle. Apps that track every symptom can accidentally keep users fixated on pain as the defining thing about their life. The platform has to point toward capability and progress, not just document the bad days.",
        },
      ],
    },

    // ── 09 · Key Challenges ───────────────────────────────────────────────────
    {
      id: "key-challenges",
      number: "09",
      title: "Key Challenges",
      shortTitle: "Key Challenges",
      group: "Research",
      blocks: [
        {
          type: "paragraph",
          text: "Four How Might We questions came out of the research and guided the ideation phase.",
        },
        {
          type: "tensions",
          items: [
            {
              title: "Empathy & Understanding",
              desc: "How Might We better empathise with individuals suffering from chronic pain to design solutions that truly meet their needs?",
            },
            {
              title: "Effective Communication",
              desc: "How can we improve the communication of pain experiences to family, friends, and healthcare providers?",
            },
            {
              title: "Motivation & Support",
              desc: "How Might We help users find and maintain the motivation needed to seek pain relief and adhere to management plans?",
            },
            {
              title: "Fear & Avoidance",
              desc: "How can we address the fear associated with chronic pain and encourage users to engage in activities without exacerbating their condition?",
            },
          ],
        },
      ],
    },

    // ── 10 · Design Process ───────────────────────────────────────────────────
    {
      id: "double-diamond",
      number: "10",
      title: "Design Process",
      shortTitle: "Double Diamond",
      group: "Ideation",
      blocks: [
        {
          type: "paragraph",
          text: "The project followed Dan Nessler's revamped Double Diamond, a diverge-converge cycle run twice over. The first diamond locks in the right problem. The second builds the right solution.",
        },
        { type: "image", src: doubleDiamond, alt: "Double Diamond Process by Dan Nessler 2018", caption: "Dan Nessler's revamped Double Diamond (2018)" },
        {
          type: "callout",
          text: "The Double Diamond isn't a clean straight line in practice. This project cycled back between Define and Develop twice, as research kept uncovering aspects of the chronic pain experience that changed how we framed the problem.",
        },
      ],
    },

    // ── 11 · Thematic Analysis Process ───────────────────────────────────────
    {
      id: "thematic-analysis",
      number: "11",
      title: "Thematic Analysis",
      shortTitle: "Analysis",
      group: "Ideation",
      blocks: [
        {
          type: "paragraph",
          text: "Data from interviews, diary studies, and secondary sources went through a five-step thematic analysis. The goal was to make sure everything we built on was grounded in actual evidence, not assumptions.",
        },
        {
          type: "process-steps",
          steps: [
            {
              label: "Data & Codes",
              description: "Starting with data collection and initial coding of raw interview transcripts.",
            },
            {
              label: "Thematic Analysis",
              description: "Identifying patterns and candidate themes across the full coded data set.",
            },
            {
              label: "Data Cleaning",
              description: "Manually refining the data by removing irrelevant or duplicate codes.",
            },
            {
              label: "Refining Codes",
              description: "Simplifying and grouping overlapping codes into coherent theme clusters.",
            },
            {
              label: "Insights",
              description: "Deriving emotional and behavioural insights from the cleaned and refined data.",
            },
          ],
        },
      ],
    },

    // ── 12 · Ideation ─────────────────────────────────────────────────────────
    {
      id: "ideation",
      number: "12",
      title: "Ideation",
      shortTitle: "Ideation",
      group: "Ideation",
      blocks: [
        {
          type: "heading",
          text: "Initial Brainstorming",
        },
        {
          type: "paragraph",
          text: "The team generated as many ideas as possible in the first round, deliberately not filtering for feasibility. Quantity first, quality later.",
        },
        {
          type: "heading",
          text: "Concept Selection",
        },
        {
          type: "paragraph",
          text: "From there, ideas were filtered down to what was practical, impactful, and aligned with the project. Concepts were checked against four things: technical feasibility, user desirability, business viability, and whether they actually answered the core HMW questions.",
        },
        {
          type: "heading",
          text: "Strategic Focus",
        },
        {
          type: "callout",
          text: "The final concepts were picked because they could actually meet user needs, were technically buildable, and stayed true to what the project was trying to do.",
        },
      ],
    },

    // ── 13 · User Personas ────────────────────────────────────────────────────
    {
      id: "personas",
      number: "13",
      title: "User Personas",
      shortTitle: "Personas",
      group: "Ideation",
      blocks: [
        {
          type: "paragraph",
          text: "Three personas came from the research, each with a different relationship to chronic pain and a different set of needs from a digital health app.",
        },
        {
          type: "rich-persona",
          name: "Tess McQueen",
          initial: "T",
          avatarColor: "#7C3AED",
          avatarTextColor: "#ffffff",
          avatarPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
          role: "Senior Executive",
          company: "Dublin, Ireland",
          location: "Age 35 · Female · Employee",
          quote:
            "It's exhausting to wake up each day and fight a battle with an invisible enemy. I've spent countless hours and money searching for answers...",
          goals: [
            "Get back to an active lifestyle and follow her hobbies",
            "Work and take care of her child without restriction from pain",
            "Find a reliable diagnosis after years of undiagnosed chronic pain",
          ],
          painPoints: [
            "Undiagnosed condition with no clear path to treatment",
            "No reliable resources or doctors who understand her case",
            "Money spent on consultations with no actionable outcome",
            "Feels misunderstood by healthcare providers and family",
          ],
          behaviour:
            "Once highly active, now sedentary due to constant pain following a car accident. Experiences anxiety and difficulty accessing disability benefits without a formal diagnosis.",
        },
        {
          type: "rich-persona",
          name: "Brant Armani",
          initial: "B",
          avatarColor: "#1E40AF",
          avatarTextColor: "#ffffff",
          avatarPhoto: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&crop=face",
          role: "Jobless",
          company: "Cork, Ireland",
          location: "Age 42 · Male · Unemployed",
          quote:
            "Finding the right treatment feels endless. I just want to feel better and connect with others who understand. It's frustrating to spend so much on treatments that don't work.",
          goals: [
            "Find the right treatment plan after multiple ineffective therapies",
            "Engage in physiotherapy to ease pain sustainably",
            "Connect with people going through a similar experience",
          ],
          painPoints: [
            "Pain medication does not provide relief",
            "Uncertainty about future and loss of purpose since leaving work",
            "Isolation and guilt, people tend to tune out when he talks about pain",
            "Multiple treatments tried with no lasting improvement",
          ],
          behaviour:
            "Had to quit his job due to chronic pain. Losing faith in the healthcare system and finding it difficult to access welfare support. Seeks genuine connection with others who truly understand his experience.",
        },
        {
          type: "rich-persona",
          name: "Richard Sanchez",
          initial: "R",
          avatarColor: "#065F46",
          avatarTextColor: "#ffffff",
          avatarPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
          role: "Office Administrator",
          company: "Galway, Ireland",
          location: "Age 40 · Male · Employed",
          quote:
            "Finding the right treatment feels endless. I just want to feel better and connect with others who understand. It's frustrating to spend so much on treatments that don't work.",
          goals: [
            "Create an environment that understands and accommodates his pain condition",
            "Manage pain effectively alongside daily and social activities",
            "Build a lifestyle aligned with his arthritis condition",
          ],
          painPoints: [
            "Difficulty conducting daily activities due to arthritis flare-ups",
            "Unable to maintain stable work hours consistently",
            "Hard to participate in social activities without early departures",
            "Difficulty developing and adapting to a new lifestyle",
          ],
          behaviour:
            "Richard's arthritis severely impacts his daily life, disrupting work and social activities. Despite challenges, he is determined to manage his pain and seeks an inclusive environment where his condition is understood.",
        },
      ],
    },

    // ── 14 · HMW Questions ────────────────────────────────────────────────────
    {
      id: "hmw",
      number: "14",
      title: "HMW Questions",
      shortTitle: "HMW",
      group: "Ideation",
      blocks: [
        {
          type: "reflection",
          heading: "How Might We…",
          items: [
            "HMW help people go about their daily activities despite pain?",
            "HMW enable people in chronic pain to have a meaningful social life?",
            "HMW make it harder for people to go about their daily activities and enhance their pain? (Dark side)",
            "HMW socially isolate people in chronic pain even more? (Dark side)",
            "HMW improve communication between people in chronic pain and their healthcare providers?",
            "HMW provide effective support systems for individuals dealing with chronic pain?",
            "HMW make pain management tools more accessible and user-friendly?",
            "HMW empower people with chronic pain to track and understand their condition better?",
          ],
        },
        {
          type: "callout",
          text: "With the HMW questions in hand, we used two ideation techniques: Crazy 8s for rapid ideation and Dark Side Ideation for an adversarial perspective.",
        },
      ],
    },

    // ── 15 · Ideation Techniques ──────────────────────────────────────────────
    {
      id: "ideation-techniques",
      number: "15",
      title: "Ideation Techniques",
      shortTitle: "Techniques",
      group: "Ideation",
      blocks: [
        {
          type: "heading",
          text: "Crazy 8s",
        },
        {
          type: "paragraph",
          text: "A rapid brainstorming method aimed at generating multiple solutions quickly. Each team member sketched eight distinct ideas in eight minutes, resulting in a variety of rough concepts. This technique produced a wide range of potential solutions that were later refined and expanded upon in further brainstorming sessions.",
        },
        {
          type: "heading",
          text: "Dark Side Ideation",
        },
        {
          type: "paragraph",
          text: "The method involves deliberately inverting the problem: how would you make this worse? The team reframed every design challenge in the most negative way possible, brainstormed solutions to those dark versions, then flipped those ideas into positive ones.",
        },
        {
          type: "callout",
          text: "Dark side insight: a streak system that resets on a missed day is the worst thing you could build for a chronic pain app. It punishes exactly the users who need the most support. That realisation directly shaped the pacing metaphor at the core of the product.",
        },
      ],
    },

    // ── 16 · Driving the Design ───────────────────────────────────────────────
    {
      id: "driving-design",
      number: "16",
      title: "Driving the Design",
      shortTitle: "Driving Design",
      group: "Ideation",
      blocks: [
        {
          type: "paragraph",
          text: "Four HMW questions from the dark side ideation process directly shaped the structural design decisions in the final prototype.",
        },
        {
          type: "tensions",
          items: [
            {
              title: "HMW enhance daily activity difficulty?",
              desc: "Alarm or doorbell sounds are loud and annoying. A pull bar is added to a push door with no clear instructions. Difficulty connecting with family and friends. Medication management is made harder with confusing or useless reminders.",
            },
            {
              title: "HMW help despite pain?",
              desc: "Personalisation of sounds. Devices notify others in the house when the user is experiencing significant pain. Adaptive UI that simplifies on high-pain days.",
            },
            {
              title: "HMW socially isolate further?",
              desc: "Isolating people by withholding resources and support. An app that spreads negative reminders and tells users what others think behind their back. Missing important notifications for messages and calls.",
            },
            {
              title: "HMW enable meaningful social life?",
              desc: "An app that periodically reminds users they are not a burden, making a collage of positive things their close ones have said. Peer community features connecting users with shared experiences.",
            },
          ],
        },
      ],
    },

    // ── 17 · Project Retrospect ───────────────────────────────────────────────
    {
      id: "retrospect",
      number: "17",
      title: "Project Retrospect",
      shortTitle: "Retrospect",
      group: "Design",
      blocks: [
        {
          type: "reflection",
          heading: "Empathy Building",
          items: [
            "The team studied chronic pain through literature, subreddit analysis, and focus groups, gaining a deeper emotional connection and understanding.",
            "Designing for an invisible condition means actively resisting the instinct to make everything visible. Not every experience needs a chart.",
          ],
        },
        {
          type: "reflection",
          heading: "Emotional Impact",
          items: [
            "Engaging with chronic pain highlighted the emotional challenges and clarified the problems to address.",
            "Dark side ideation was the single most generative session in the project. Constraints and adversarial framing consistently produce better ideas than open brainstorming.",
          ],
        },
        {
          type: "reflection",
          heading: "Learning Moments",
          items: [
            "We hit walls, re-evaluated what we were building, and used dark side ideation to find directions we wouldn't have found otherwise.",
            "I underestimated how hard it is to design for cognitive load. What reads as 'clean' to a designer reads as 'empty and confusing' to a user in distress.",
          ],
        },
        {
          type: "reflection",
          heading: "Design Insights",
          items: [
            "Key findings included the importance of task tracking for pacing, and the need for time, pain, and mood tracking to manage pain effectively.",
            "A good accessibility audit is also a good chronic pain audit. Low contrast, small tap targets, and animation-heavy interfaces all fail the same users.",
          ],
        },
      ],
    },

    // ── 18 · Typography & Colors ──────────────────────────────────────────────
    {
      id: "design-system",
      number: "18",
      title: "Typography & Colors",
      shortTitle: "Design System",
      group: "Design",
      blocks: [
        {
          type: "paragraph",
          text: "The design system came from one principle: warm authority. The platform serves vulnerable users in hard moments. It needed to feel trustworthy without being clinical, and expressive without being frivolous.",
        },
        {
          type: "type-scale",
          items: [
            {
              name: "Display",
              font: "Urbanist",
              size: "32–40px",
              weight: "700",
              usage: "Hero states, pain level score, bold headers",
            },
            {
              name: "Heading 1",
              font: "Urbanist",
              size: "22–26px",
              weight: "600",
              usage: "Screen titles, section headers",
            },
            {
              name: "Heading 2",
              font: "Urbanist",
              size: "16–18px",
              weight: "600",
              usage: "Card headers, module titles",
            },
            {
              name: "Body",
              font: "Urbanist",
              size: "14–15px",
              weight: "400",
              usage: "Primary content, descriptions",
            },
            {
              name: "Label",
              font: "Urbanist",
              size: "10–11px",
              weight: "500",
              usage: "Data labels, navigation, tags",
            },
            {
              name: "Caption",
              font: "Urbanist",
              size: "9–10px",
              weight: "400",
              usage: "Chart axes, timestamps",
            },
          ],
        },
        {
          type: "color-system",
          items: [
            {
              name: "Deep Purple",
              hex: "#5B3A8C",
              role: "Primary",
              usage: "Primary actions, active states, brand identity",
            },
            {
              name: "Lavender",
              hex: "#9B72CF",
              role: "Secondary",
              usage: "Progress indicators, secondary buttons, dark mode primary",
            },
            {
              name: "Soft Lilac",
              hex: "#E9DEFF",
              role: "Surface",
              usage: "Card backgrounds, selected states, subtle fills",
            },
            {
              name: "Calm Teal",
              hex: "#0D9488",
              role: "Success",
              usage: "Positive feedback, stable trend indicators",
            },
            {
              name: "Warm Amber",
              hex: "#F59E0B",
              role: "Warning",
              usage: "Elevated pain alerts, pacing cautions",
            },
            {
              name: "Soft Red",
              hex: "#EF4444",
              role: "Alert",
              usage: "High pain states, critical notifications only",
            },
          ],
        },
      ],
    },

    // ── 19 · Wireframes ───────────────────────────────────────────────────────
    {
      id: "wireframes",
      number: "19",
      title: "Wireframes",
      shortTitle: "Wireframes",
      group: "Design",
      blocks: [
        {
          type: "paragraph",
          text: "Wireframes covered three core sections: Onboarding, Home Dashboard, and Pain Analysis. Each was done at two levels, rough sketches for structure and annotated mid-fidelity frames for handoff.",
        },
        {
          type: "heading",
          text: "Onboarding",
        },
        {
          type: "screen",
          number: "01",
          title: "Welcome & Add Task",
          question: "How do we build trust before asking for sensitive health information?",
          image: cpiOnboarding,
          decisions: [
            "Users enter basic information (just their name) as the first step. Minimal friction.",
            "Progressive disclosure: medical history is optional and deferred to session 2.",
            "An info button guides users unfamiliar with pacing and baseline time concepts.",
            "Baseline time for each task is user-determined. Experienced users set it directly.",
            "Others can use the app's suggested baseline after recording tasks a few times.",
          ],
        },
        {
          type: "heading",
          text: "Home Dashboard",
        },
        {
          type: "screen",
          number: "02",
          title: "Home — Task Timer & Completion",
          question: "What does the user need to see in the first 5 seconds of opening the app?",
          image: cpiHome,
          decisions: [
            "A clock shows task duration with a running puppy. No countdown, users see how long the task has been going.",
            "Tasks can be stopped anytime. Multiple tasks ensure pacing integrity.",
            "Users record their daily mood using one of five emoticon icons.",
            "Completing tasks earns coins. Positive reinforcement without any clinical framing.",
            "No streak resets. Absence is treated as a signal to support, not shame.",
          ],
        },
        {
          type: "heading",
          text: "Analysis",
        },
        {
          type: "screen",
          number: "03",
          title: "My Stats — Weekly Analysis",
          question: "How do we make trend data feel empowering rather than discouraging?",
          image: cpiAnalysis,
          decisions: [
            "Tab-based 'My Stats' dashboard: Day / Week / Month / Total views.",
            "The app records task duration, daily mood, and pain flare-ups across all periods.",
            "A natural language insight headline sits above the chart. Interpretation before raw data.",
          ],
        },
      ],
    },
    // ── 21 · Conclusion & Learnings ──────────────────────────────────────────
    {
      id: "conclusion",
      number: "21",
      title: "Conclusion & Learnings",
      shortTitle: "Conclusion",
      group: "Outcome",
      blocks: [
        {
          type: "conclusion-statements",
          items: [
            "Chronic pain is invisible, so the design had to make it legible, both to the person experiencing it and to the people around them.",
            "Every feature was pressure-tested against one question: does this add to a sick person's cognitive load, or reduce it?",
            "The app that emerged isn't about pain management. It's about giving people back a sense of control over their own story.",
          ],
        },
        {
          type: "learnings-grid",
          items: [
            {
              number: "01",
              label: "Invert to uncover",
              body: "Dark Side Ideation exposed failure modes that positive brainstorming missed entirely. Build the worst version first.",
            },
            {
              number: "02",
              label: "Granularity is agency",
              body: "Letting users choose the resolution of their own data (daily, weekly, total) is what separates a tool that empowers from one that overwhelms.",
            },
            {
              number: "03",
              label: "Research pre-solves the problem",
              body: "By the time ideation started, the direction was already half-formed. Thematic analysis did more design work than any brainstorm session.",
            },
            {
              number: "04",
              label: "Emotional cost is a design constraint",
              body: "For users in chronic pain, every unnecessary interaction is a tax they can't afford. Designing for finite bandwidth produces more humane interfaces than designing for feature completeness.",
            },
          ],
        },
        {
          type: "closing-quote",
          text: "Designing for chronic pain taught me that the most useful thing a product can do is get out of the way and let people live.",
        },
      ],
    },
  ],
};

// ─── YIF Member Login Portal Case Study ─────────────────────────────────────

const yifCaseStudy: CaseStudyData = {
  slug: "yifloginportal",
  title: "YIF Member Login Portal",
  subtitle:
    "Designing a centralized, user-friendly login portal for Youth India Foundation — from user research and information architecture to high-fidelity screens over 3 months.",
  coverImage: yifCover,
  accentColor: "#FB7800",
  accentColorDark: "#FF9A3C",
  role: "UX/UI Designer (Solo)",
  timeline: "3 months · Mar–Jul 2022",
  tools: "Figma · Pen & Paper",
  deliverable: "5 hi-fi screens + design system",
  behanceUrl: "https://www.behance.net/gallery/202145727/Login-Portal",
  stats: [
    { value: "70%", label: "User satisfaction increase" },
    { value: "10", label: "Members interviewed" },
    { value: "3mo", label: "Project duration" },
    { value: "5", label: "Hi-fi screens" },
  ],
  sections: [
    // ── 01 · About ───────────────────────────────────────────────────────────
    {
      id: "about",
      number: "01",
      title: "About the Project",
      shortTitle: "About",
      group: "Introduction",
      blocks: [
        {
          type: "paragraph",
          text: "During my internship at Youth India Foundation (March 2022 – July 2022), I was entrusted with designing a member login portal for the foundation. The project spanned three months and aimed to improve the user experience by developing a user-friendly, visually appealing, and functional portal. To ensure a robust design approach, I followed the 5-step design thinking process, placing user feedback and design principles at the core of every decision.",
        },
        {
          type: "role-tags",
          tags: [
            "End-to-end UX Design",
            "User Research",
            "Information Architecture",
            "Wireframing",
            "Hi-Fi Design",
            "Usability Testing",
          ],
        },
      ],
    },

    // ── 02 · Problem ─────────────────────────────────────────────────────────
    {
      id: "problem",
      number: "02",
      title: "Problem Statement",
      shortTitle: "Problem",
      group: "Introduction",
      blocks: [
        {
          type: "paragraph",
          text: "Youth India Foundation lacked a **centralized, user-friendly login portal**, leading to inconsistent branding, poor usability, and high cognitive load. Members struggled with **navigation and task completion**, reducing engagement and satisfaction. The foundation needed a **simple, visually appealing portal** aligned with their brand to enhance **accessibility and user experience.**",
        },
        {
          type: "callout",
          text: "How might we design a login portal that is simple enough for volunteers to use daily, yet powerful enough for HR managers to handle access and administration?",
        },
      ],
    },

    // ── 03 · Goal ────────────────────────────────────────────────────────────
    {
      id: "goal",
      number: "03",
      title: "Goal",
      shortTitle: "Goal",
      group: "Introduction",
      blocks: [
        {
          type: "design-decisions",
          items: [
            {
              bold: "Develop a login portal",
              body: "that aligns with the existing visual and branding guidelines of the Youth India Foundation.",
            },
            {
              bold: "Enhance user satisfaction",
              body: "by making the design simple, intuitive, and easy to use for both volunteers and HR staff.",
            },
            {
              bold: "Incorporate UX and UI laws",
              body: "to optimise usability and reduce cognitive load across all portal interactions.",
            },
          ],
        },
      ],
    },

    // ── 04 · Timeline ────────────────────────────────────────────────────────
    {
      id: "timeline",
      number: "04",
      title: "Project Timeline",
      shortTitle: "Timeline",
      group: "Process",
      blocks: [
        {
          type: "gantt-timeline",
          totalWeeks: 12,
          uxPhases: [
            {
              label: "Understand",
              subItems: ["User Research", "Interviews", "Competitive Analysis"],
              startWeek: 0,
              endWeek: 4,
            },
            {
              label: "Define",
              subItems: ["Personas", "Insight Synthesis"],
              startWeek: 3,
              endWeek: 6,
            },
            {
              label: "Ideate",
              subItems: ["User Flow", "Information Architecture"],
              startWeek: 5,
              endWeek: 8,
            },
          ],
          uiPhases: [
            {
              label: "Design",
              subItems: ["Wireframes", "Hi-Fi Design", "Prototype"],
              startWeek: 7,
              endWeek: 10,
            },
            {
              label: "Test",
              subItems: ["Feedback Sessions", "A/B Testing", "Refinement"],
              startWeek: 9,
              endWeek: 12,
            },
          ],
        },
      ],
    },

    // ── 05 · Design Process ──────────────────────────────────────────────────
    {
      id: "design-process",
      number: "05",
      title: "Design Process",
      shortTitle: "Process",
      group: "Process",
      blocks: [
        {
          type: "process-phase-cards",
          items: [
            {
              iconType: "users",
              title: "Empathize",
              bullets: [
                "Interviewed 10 members",
                "Identified key needs",
                "Applied user feedback",
                "Improved satisfaction by 70%",
              ],
            },
            {
              iconType: "target",
              title: "Define",
              bullets: [
                "Analysed website theme",
                "Aligned on brand guidelines",
                "Created consistent design system",
              ],
            },
            {
              iconType: "lightbulb",
              title: "Ideate",
              bullets: [
                "Researched similar websites",
                "Developed Information Architecture",
              ],
            },
            {
              iconType: "layers",
              title: "Prototype",
              bullets: [
                "Designed low-fi wireframes",
                "Applied Hick's, Fitts' & Miller's Laws",
              ],
            },
            {
              iconType: "check",
              title: "Test",
              bullets: [
                "Created hi-fi designs",
                "Improved through A/B testing",
              ],
            },
          ],
        },
      ],
    },

    // ── 06 · User Research ───────────────────────────────────────────────────
    {
      id: "user-research",
      number: "06",
      title: "User Research",
      shortTitle: "Research",
      group: "Process",
      blocks: [
        {
          type: "paragraph",
          text: "To understand the needs of the portal's users, 10 members of Youth India Foundation were interviewed. The research focused on frustrations with the existing system, priorities when logging in, and what would make their experience more seamless. Three key themes emerged from the sessions:",
        },
        {
          type: "donut-stats",
          items: [
            {
              percentage: 50,
              label: "Engaging Portal",
              description:
                "5 members expressed the need for an engaging, easy-to-use portal to stay motivated and connected.",
            },
            {
              percentage: 30,
              label: "Separate HR Login",
              description:
                "3 HR participants preferred a separate login system for managing member access and operations.",
            },
            {
              percentage: 20,
              label: "Clear Info Display",
              description:
                "2 participants emphasised the importance of displaying all essential information clearly on the dashboard.",
            },
          ],
        },
      ],
    },

    // ── 07 · User Personas ───────────────────────────────────────────────────
    {
      id: "personas",
      number: "07",
      title: "User Personas",
      shortTitle: "Personas",
      group: "Define",
      blocks: [
        {
          type: "paragraph",
          text: "Creating user personas ensures the design meets the specific needs of both volunteers and administrators. Two personas emerged from the research — each with distinct goals, frustrations, and workflows that shaped every major design decision.",
        },
        {
          type: "yif-persona-pair",
          personas: [
            {
              type: "yif-persona",
              name: "Ayesha Sharma",
              age: 24,
              education: "MBA",
              status: "Single",
              occupation: "Volunteer Member",
              location: "India",
              avatarPhoto: "https://randomuser.me/api/portraits/women/79.jpg",
              story:
                "Ayesha joined Youth India Foundation to contribute to social causes. She relies on the portal to track her volunteer hours, access event schedules, and stay connected with the team. Complex interfaces frustrate her — she prefers simple, clean designs that let her find what she needs fast.",
              goals: [
                "Quickly log in to access event schedules, tasks, and announcements.",
                "View personal contributions and track volunteer hours.",
                "Stay updated with foundation activities without technical hassle.",
              ],
              painPoints: [
                "Frustrated by complex login processes with too many steps.",
                "Struggles with remembering multiple passwords across different systems.",
                "Dislikes cluttered interfaces that obscure key information.",
              ],
              needs: "A simple, fast login experience with a clear dashboard showing relevant information at a glance.",
            },
            {
              type: "yif-persona",
              name: "Rohit Malhotra",
              age: 35,
              education: "Master in IT",
              status: "Single",
              occupation: "HR Manager",
              location: "India",
              avatarPhoto: "https://randomuser.me/api/portraits/men/75.jpg",
              story:
                "Rohit manages volunteer recruitment and engagement at Youth India Foundation. With many members logging in daily, he often handles access issues. Busy with administrative tasks, he needs a streamlined portal to simplify workflows, resolve issues quickly, and keep members connected.",
              goals: [
                "Manage member access and permissions efficiently.",
                "Monitor member engagement and task completion.",
                "Quickly resolve login or portal issues raised by members.",
              ],
              painPoints: [
                "Difficulty troubleshooting login issues for members.",
                "Needs to juggle multiple administrative tasks without delays.",
                "Prefers streamlined dashboards for better management overview.",
              ],
              needs: "A centralized platform to manage member access, monitor engagement, and troubleshoot login issues efficiently.",
              motivations: [
                "Smooth onboarding and engagement of volunteers.",
                "Operational efficiency through easy access to data and reports.",
              ],
            },
          ],
        },
      ],
    },

    // ── 08 · Information Architecture ───────────────────────────────────────
    {
      id: "ideate",
      number: "08",
      title: "Information Architecture",
      shortTitle: "IA",
      group: "Define",
      blocks: [
        {
          type: "paragraph",
          text: "With user needs clearly defined, the information architecture maps out every node the portal would need — from the root login branches to individual member profile sub-sections. The sitemap below shows the full navigation structure, covering six main modules.",
        },
        { type: "ia-tree" },
      ],
    },

    // ── 09 · Prototype / Design Laws ────────────────────────────────────────
    {
      id: "prototype",
      number: "09",
      title: "Application of Design Laws",
      shortTitle: "Design Laws",
      group: "Design",
      blocks: [
        {
          type: "paragraph",
          text: "Four core UX laws shaped the design decisions across the portal. Each principle guided specific choices in layout, hierarchy, and interaction design — grounding every decision in measurable usability improvement.",
        },
        {
          type: "design-laws",
          items: [
            {
              name: "Hick's Law",
              concept: "Simplify choices to reduce decision-making time.",
              implementation:
                "On the portal's homepage, only three clear login options were provided (HR Admin, Super Admin, Member), reducing clutter and helping users log in quickly without confusion.",
            },
            {
              name: "Law of Proximity",
              concept: "Group related elements together to improve comprehension.",
              implementation:
                "Information like tasks, events, and announcements was placed close to each other, helping users intuitively navigate relevant sections without cognitive jumping.",
            },
            {
              name: "Miller's Law",
              concept: "Limit information to 5–7 items to avoid cognitive overload.",
              implementation:
                "Key details were summarised on the dashboard to prevent users from feeling overwhelmed, ensuring a smooth and accessible experience for all members.",
            },
            {
              name: "Fitts' Law",
              concept: "Larger and closer buttons make interaction faster.",
              implementation:
                "Big, easy-to-click CTAs (like 'Login' and 'View Tasks') were strategically placed to reduce effort and improve usability for all users.",
            },
          ],
        },
      ],
    },

    // ── 10 · Before & After ──────────────────────────────────────────────────
    {
      id: "before-after",
      number: "10",
      title: "Before & After",
      shortTitle: "Before/After",
      group: "Design",
      blocks: [
        {
          type: "before-after",
          beforeTitle: "Before",
          afterTitle: "After",
          beforeDescription: "Old YIF Members page — static, unstructured, role-agnostic",
          afterDescription: "Redesigned portal — role-based, searchable, status-aware",
          beforeImage: yifBefore,
          afterImage: yifAfter,
          beforeItems: [
            "Photo card grid of team members with no role differentiation",
            "Basic pagination (1 2 3 ... 10) — no search or filter capability",
            "No persistent navigation structure or sidebar",
            "Generic footer with foundation links and social icons",
            "No role-based login or member management features",
          ],
          afterItems: [
            "Persistent left sidebar: Profile, Raise Issue, View Members, Hall of Fame, Open Positions, Logout",
            "Search bar at top of member list for instant filtering",
            "Clean data table: Name/View link, Email, Contact, Department, Status",
            "Color-coded status badges: Offline (red), Remote (blue), Hybrid (purple)",
            "Role-based login: HR Admin, Super Admin, and Member — each with tailored access",
          ],
        },
      ],
    },

    // ── 11 · Final Outcome ───────────────────────────────────────────────────
    {
      id: "outcome",
      number: "11",
      title: "Final Outcome",
      shortTitle: "Outcome",
      group: "Outcome",
      blocks: [
        {
          type: "conclusion-statements",
          items: [
            "The **final designs were user-centric** and visually engaging, ensuring ease of use and satisfaction across all member types.",
            "The **user satisfaction rate increased by 70%**, validating the end-to-end design process from research to high-fidelity prototype.",
            "The **project strengthened** interpersonal collaboration skills through continuous iteration with Foundation members and stakeholders.",
          ],
        },
        {
          type: "heading",
          text: "Key Takeaways",
        },
        {
          type: "learnings-grid",
          items: [
            {
              number: "01",
              label: "User-Centric Design",
              body: "Early interviews aligned the design direction with real user needs, preventing costly rework later in the process.",
            },
            {
              number: "02",
              label: "Testing & Iteration",
              body: "A/B testing identified the strongest visual treatment and interaction patterns before finalising the hi-fi designs.",
            },
            {
              number: "03",
              label: "Design Principles",
              body: "Applying Hick's, Miller's, and Fitts' Laws improved usability in measurable, concrete ways rather than just aesthetically.",
            },
            {
              number: "04",
              label: "Continuous Improvement",
              body: "Iterative feedback loops with Foundation members enhanced both visual appeal and functional clarity across all screens.",
            },
          ],
        },
      ],
    },

    // ── 12 · Typography & Colours ────────────────────────────────────────────
    {
      id: "typography",
      number: "12",
      title: "Typography & Colours",
      shortTitle: "Typography",
      group: "Outcome",
      blocks: [
        {
          type: "type-scale",
          items: [
            {
              name: "Display",
              font: "Poppins",
              size: "36px+",
              weight: "900",
              usage: "Hero headings, section titles, large callouts",
            },
            {
              name: "Heading",
              font: "Poppins",
              size: "24–32px",
              weight: "700",
              usage: "Section headings, card titles, sub-labels",
            },
            {
              name: "Body",
              font: "Poppins",
              size: "14–16px",
              weight: "400",
              usage: "Body copy, descriptions, table content, labels",
            },
          ],
        },
        {
          type: "color-system",
          items: [
            {
              name: "Primary Orange",
              hex: "#FB7800",
              role: "Accent",
              usage: "CTAs, headings, icon fills, active states",
            },
            {
              name: "Dark Grey",
              hex: "#111111",
              role: "Text Primary",
              usage: "Primary text, high-contrast headings",
            },
            {
              name: "Mid Grey",
              hex: "#404040",
              role: "Text Secondary",
              usage: "Body text, secondary content",
            },
            {
              name: "Primary Green",
              hex: "#7FBB83",
              role: "Accent Green",
              usage: "Process cards, success states, badges",
            },
            {
              name: "Light Green",
              hex: "#B2F9A7",
              role: "Green Light",
              usage: "Subtle green tints, hover states",
            },
            {
              name: "Orange Light",
              hex: "#FFC9A2",
              role: "Orange Tint",
              usage: "Warm backgrounds, highlight areas",
            },
            {
              name: "Button Green",
              hex: "#2CA735",
              role: "CTA Button",
              usage: "Login button, primary call-to-action",
            },
            {
              name: "Link Blue",
              hex: "#4B4DED",
              role: "Text Link",
              usage: "Hyperlinks, interactive text elements",
            },
            {
              name: "Stroke Light",
              hex: "#EEEEEE",
              role: "Border",
              usage: "Card borders, dividers, subtle separators",
            },
          ],
        },
      ],
    },

    // ── 13 · Visual Design ───────────────────────────────────────────────────
    {
      id: "visual-design",
      number: "13",
      title: "Visual Design",
      shortTitle: "Visual Design",
      group: "Outcome",
      blocks: [
        {
          type: "paragraph",
          text: "The final hi-fidelity screens cover two login variants and three dashboard views. The design uses warm white and green tones with orange as the primary accent — creating a welcoming, accessible aesthetic aligned with the Foundation's community-driven ethos.",
        },
        {
          type: "placeholder-image",
          label: "Login Screen — Light Variant",
          src: yifScreenLoginLight,
          caption:
            '"Choose Account Type" with three role icons (HR Admin, Super Admin, Member), email/password fields, and a green Login button.',
        },
        {
          type: "placeholder-image",
          label: "Login Screen — Split Variant",
          src: yifScreenLoginSplit,
          caption:
            "White left panel for the form, green right panel with flat illustration — same three-role login flow in a split-screen layout.",
        },
        {
          type: "placeholder-image",
          label: "Member Details Dashboard (v1)",
          src: yifScreenMembersV1,
          caption:
            "Left sidebar navigation, search bar, and member data table with Name, Email, Contact, Department, and color-coded Status badges.",
        },
        {
          type: "placeholder-image",
          label: "Member Details Dashboard (v2)",
          src: yifScreenMembersV2,
          caption:
            "Dashboard with full member table showing Offline/Remote/Hybrid status distribution across the dataset.",
        },
        {
          type: "placeholder-image",
          label: "Member Details Dashboard (v3)",
          src: yifScreenMembersV3,
          caption:
            "Alternate status badge styling showing the updated visual treatment after A/B testing feedback sessions.",
        },
      ],
    },
  ],
};

// ─── Export ──────────────────────────────────────────────────────────────────

export const caseStudies: CaseStudyData[] = [xarissCaseStudy, paceyourselfCaseStudy, yifCaseStudy];

export function getCaseStudyBySlug(slug: string): CaseStudyData | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}
