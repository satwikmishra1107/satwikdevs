import { Project, Experience, Social, SkillGroup } from "./types";
import ProjectOne from "./assets/ProjectOne.png";
import ProjectTwo from "./assets/ProjectTwo.png";
import CareerPageMonitor from "./assets/career-page-monitor.png";

export const PROFILE = {
  name: "Satwik Mishra",
  role: "Systems Engineer",
  summary:
    "Software engineer building backend systems in core-banking APIs, and side projects that quietly run themselves.",
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
      "Co-built PDN Tracker, an internal deployment-management platform replacing a deprecated vendor tool and serving 500+ daily active users; owned the frontend and middleware. Release lifecycles are modelled as a table-driven state machine, validated server-side, with send-back reasons and rejected states kept for audit history.",
      "Replaced manual role selection at login with session-based auth and role-embedded access tokens (RBAC), eliminating wrong-role login failures and cutting total login errors by 35%.",
      "Migrated 10+ legacy SOAP services on TCS BaNCS — a core banking platform used by banks worldwide — to REST, tracing each transaction's call chain across UI, middleware, and PL/SQL in a 30+ GB codebase to define contracts with behavioural parity.",
      "Cut a policy-issuance API from 5s+ (timing out) to 250 ms by parallelizing 5 sequential DB calls on a Java thread pool and adding targeted indexes, with compensating cleanup if any call failed.",
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
      "Referrals work best when you ask early. Career Page Monitor watches 120+ company career pages every hour — shared adapters for six ATS platforms (Workday, Greenhouse, Lever, Ashby, SmartRecruiters, Personio) plus headless-browser scrapers for custom sites — and sends a Telegram alert only when a genuinely new opening appears.\n\nA Cloudflare Worker cron dispatches the GitHub Actions runs, after GitHub's own scheduler proved unreliable. Postings are deduplicated on (company, job ID, title), tracked through a React dashboard behind Cloudflare Access, and aged out on a 7-day / 30-day lifecycle to fit inside Supabase's 500 MB free tier.",
    tags: ["Node.js", "Puppeteer", "PostgreSQL", "React", "Cloudflare Workers", "GitHub Actions"],
    thumbnail: CareerPageMonitor,
    githubUrl: "https://github.com/satwikmishra1107/110-Dashboard",
    demoUrl: "https://jobs.satwikdevs.in/",
    stats: [
      { label: "Career pages", value: "120+" },
      { label: "ATS adapters", value: "6" },
      { label: "Cadence", value: "Hourly" },
      { label: "Storage budget", value: "500 MB free tier" },
    ],
  },
  {
    id: "chunky-drive",
    title: "Chunky Drive",
    subtitle: "Chunked file storage",
    year: "2024 — 2026",
    description:
      "Running out of storage led to a simple question: why build another storage server when third-party networks already store files for free?\n\nChunky Drive is a Google-Drive-style app with unlimited storage. The browser splits each file into 8 MB chunks, hashes them with SHA-256, and moves three at a time through a Cloudflare Worker that holds the storage credentials and streams bytes straight through. D1 keeps only the chunk map — about 25 MB of metadata per terabyte stored. Every chunk is re-verified on download and saved to IndexedDB, so downloads pause, survive a closed tab, and resume from the last verified chunk.",
    tags: ["React", "TypeScript", "Cloudflare Workers", "Hono", "Cloudflare D1", "Web Crypto"],
    thumbnail: ProjectOne,
    githubUrl: "https://github.com/satwikmishra1107/Chunky-Drive",
    demoUrl: "https://chunkydrive.satwikdevs.in",
    stats: [
      { label: "Storage", value: "Unlimited · 8 MB chunks" },
      { label: "Transfer", value: "3 parallel lanes, retry + backoff" },
      { label: "Integrity", value: "SHA-256 per chunk + per file" },
      { label: "Downloads", value: "Pause, close the tab, resume" },
    ],
  },
  {
    id: "pdn-tracker",
    title: "PDN Tracker",
    subtitle: "Built at TCS",
    description:
      "When the existing PDN tracking tool had to be retired over security concerns, the workflow fell back to Excel. PDN Tracker replaced it: an internal deployment-management platform that models every release as a table-driven state machine — draft, review, testing, delivery, release — validated server-side, with send-back reasons and audit history so each handoff stays traceable.",
    tags: ["React", "Spring Boot", "Oracle PL/SQL"],
    // Internal company tool: no source link
    thumbnail: ProjectTwo,
    stats: [
      { label: "Daily active users", value: "500+" },
      { label: "Login errors", value: "−35%" },
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
