import { Project, Experience, Social, SkillGroup } from "./types";
import ProjectOne from "./assets/ProjectOne.png";
import ProjectTwo from "./assets/ProjectTwo.png";
import CareerPageMonitor from "./assets/career-page-monitor.png";

export const PROFILE = {
  name: "Satwik Mishra",
  role: "Systems Engineer · TCS",
  summary:
    "Software engineer building backend systems — core-banking APIs at TCS, and side projects that quietly run themselves.",
};

// Rewritten to /Resume_Latex.pdf by public/_redirects (and by vite.config.ts locally)
export const RESUME_URL = "/resume";

// Shown in the contact section with click-to-copy. Leave empty to hide it.
export const CONTACT_EMAIL = "satwikmishra1107@gmail.com";

export const MANIFESTO = {
  title: "Software, systems & curiosity.",
  body1:
    "Software engineering with a focus on backend systems, full-stack applications, and solving problems that are a little more complicated than they first appear",
  highlightPhrase: "Performance. Reliability. Simplicity.",
};

export const ACHIEVEMENTS = [
  { label: "LeetCode Knight", value: "1882 rating · 500+ problems" },
  { label: "IIIT Trichy", value: "Coding Club & Web Dev Club Coordinator" },
];

export const SKILLS: SkillGroup[] = [
  { label: "Languages", items: ["Java", "TypeScript", "JavaScript", "Python", "SQL", "C++"] },
  { label: "Backend", items: ["Spring Boot", "Node.js", "Express", "REST", "WebSockets", "OAuth 2.0 / JWT"] },
  { label: "Frontend", items: ["React", "Next.js", "Redux", "Tailwind", "Vite"] },
  { label: "Data", items: ["PostgreSQL", "Oracle PL/SQL", "MongoDB", "Supabase", "Firebase"] },
  { label: "Cloud & DevOps", items: ["AWS EC2 / Lambda", "Cloudflare Workers / Pages", "GitHub Actions"] },
];

// Newest first
export const EXPERIENCES: Experience[] = [
  {
    id: "tcs",
    role: "Systems Engineer — Innovator",
    company: "Tata Consultancy Services",
    period: "Nov 2024 — Present",
    highlights: [
      "Designed and shipped PDN Tracker, an internal deployment-management platform replacing a deprecated vendor tool. Release lifecycles are modelled as a state machine with rollback and audit logging; it serves 500+ daily active users.",
      "Implemented session-based authentication and role-based access control for secure cross-team access, reducing login failures by 35%.",
      "Migrated 10+ legacy SOAP services on TCS BaNCS — a core banking platform used by banks worldwide — to REST, tracing each transaction's call chain across UI, middleware, and PL/SQL in a 30+ GB codebase to define contracts with behavioural parity.",
      "Re-architected synchronous transaction callbacks into asynchronous, multi-threaded processing, cutting response latency from 5s+ to 250 ms.",
      "Root-caused production incidents across application logs, Oracle data, and stored procedures, resolving the data-integrity issues behind the majority of tickets.",
    ],
    techStack: ["Java", "Spring Boot", "Oracle PL/SQL", "REST", "React"],
  },
  {
    id: "iiit",
    role: "B.Tech, Electronics & Communication Engineering",
    company: "IIIT Tiruchirappalli",
    period: "Nov 2020 — Apr 2024",
    highlights: [
      "Coding Club Coordinator — organised competitive programming contests for the campus.",
      "Web Dev Club Coordinator — led workshops and hackathons to grow the web development culture.",
    ],
    techStack: [],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "career-monitor",
    title: "Career Page Monitor",
    year: "2026",
    description:
      "Referrals work best when you ask early. Career Page Monitor watches 120+ company career pages every hour — shared adapters for six ATS platforms (Workday, Greenhouse, Lever, Ashby, SmartRecruiters, Personio) plus headless-browser scrapers for custom sites — and sends a Telegram alert only when a genuinely new opening appears.\n\nA Cloudflare Worker cron dispatches the GitHub Actions runs, after GitHub's own scheduler proved unreliable. Postings are deduplicated on (company, job ID), tracked through a React dashboard behind Cloudflare Access, and aged out on a 7-day / 30-day lifecycle to fit inside Supabase's 500 MB free tier.",
    tags: ["Node.js", "Puppeteer", "PostgreSQL", "React", "Cloudflare Workers", "GitHub Actions"],
    thumbnail: CareerPageMonitor,
    stats: [
      { label: "Career pages", value: "120+" },
      { label: "ATS adapters", value: "6" },
      { label: "Cadence", value: "Hourly" },
      { label: "Storage budget", value: "500 MB free tier" },
    ],
  },
  {
    id: "chunky-discord",
    title: "Chunky Discord",
    subtitle: "Distributed file storage",
    year: "2024",
    description:
      "Running out of storage led to a simple question: why build another storage server when Discord already stores files for free?\n\nChunky Discord splits files into 20 MB chunks to stay under Discord's attachment limit, uploads and downloads them in parallel with retry and backoff, and verifies every chunk with a content hash on reassembly. Chunk metadata lives in Firebase, so the server itself stays stateless.",
    tags: ["React", "Node.js", "Firebase", "AWS EC2"],
    thumbnail: ProjectOne,
    githubUrl: "https://github.com/satwikmishra1107/ChunkyDiscord",
    stats: [
      { label: "Chunk size", value: "20 MB" },
      { label: "Largest file in use", value: "700 MB · 35+ chunks" },
      { label: "Transfer", value: "Parallel, retry + backoff" },
      { label: "Integrity", value: "Per-chunk content hash" },
    ],
  },
  {
    id: "pdn-tracker",
    title: "PDN Tracker",
    subtitle: "Built at TCS",
    description:
      "When the existing PDN tracking tool had to be retired over security concerns, the workflow fell back to Excel. PDN Tracker replaced it: an internal deployment-management platform that models every release as a state machine — submission, review, testing, deployment — with rollback and audit logging so each handoff stays traceable.",
    tags: ["React", "Spring Boot", "Oracle PL/SQL"],
    // Internal company tool: no source link
    thumbnail: ProjectTwo,
    stats: [
      { label: "Daily active users", value: "500+" },
      { label: "Login failures", value: "−35%" },
      { label: "Release model", value: "State machine" },
      { label: "Access", value: "Session auth + RBAC" },
    ],
  },
];

export const SOCIALS: Social[] = [
  { id: "linkedin", name: "LinkedIn", url: "https://www.linkedin.com/in/satwik-mishra-1107-/" },
  { id: "github", name: "GitHub", url: "https://github.com/satwikmishra1107" },
  { id: "leetcode", name: "LeetCode", url: "https://leetcode.com/u/satwik_mishra11/" },
];
