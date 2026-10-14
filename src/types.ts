export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  year?: string;
  description: string;
  tags: string[];
  // Screenshot, or a pipeline diagram when there's nothing visual to show
  thumbnail?: string;
  pipeline?: string[];
  demoUrl?: string;
  githubUrl?: string;
  stats: { label: string; value: string }[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  highlights: string[];
  techStack: string[];
}

export interface Social {
  id: string;
  name: string;
  url: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}
