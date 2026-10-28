import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { remark } from 'remark';
import profileData from '@/content/profile.json';
import { getPublicRepos } from './github';
import {
  profileSchema,
  projectFrontmatterSchema,
  type ProjectFrontmatter,
  type Profile,
} from './schema';

const PROJECTS_DIR = path.join(process.cwd(), 'src', 'content', 'projects');

export type Project = {
  slug: string;
  title: string;
  summary: string;
  year: number;
  stack: string[];
  githubUrl: string;
  homepage?: string;
  bodyHtml: string;
};

export function getProfile(): Profile {
  return profileSchema.parse(profileData);
}

async function renderMarkdown(source: string): Promise<string> {
  const file = await remark().use(remarkGfm).use(remarkHtml).process(source);
  return String(file);
}

type Override = { data: ProjectFrontmatter; body: string };

async function readOverrides(): Promise<Map<string, Override>> {
  const overrides = new Map<string, Override>();
  const files = (await readdir(PROJECTS_DIR)).filter((file) => file.endsWith('.md'));
  for (const file of files) {
    const parsed = matter(await readFile(path.join(PROJECTS_DIR, file), 'utf8'));
    const data = projectFrontmatterSchema.parse(parsed.data);
    overrides.set(data.repo.toLowerCase(), { data, body: parsed.content });
  }
  return overrides;
}

async function loadProjects(): Promise<Project[]> {
  const [repos, overrides] = await Promise.all([getPublicRepos(), readOverrides()]);

  const projects: Project[] = [];
  for (const repo of repos) {
    const override = overrides.get(repo.name.toLowerCase());
    if (override?.data.hidden) continue;

    projects.push({
      slug: repo.name.toLowerCase(),
      title: override?.data.title ?? repo.name,
      summary: override?.data.summary ?? repo.description ?? '',
      year: override?.data.year ?? new Date(repo.created_at).getUTCFullYear(),
      stack: override?.data.stack ?? [...(repo.language ? [repo.language] : []), ...repo.topics],
      githubUrl: repo.html_url,
      homepage: override?.data.homepage ?? (repo.homepage || undefined),
      bodyHtml: override?.body.trim() ? await renderMarkdown(override.body) : '',
    });
  }
  return projects;
}

let projectsPromise: Promise<Project[]> | undefined;

export function getProjects(): Promise<Project[]> {
  projectsPromise ??= loadProjects();
  return projectsPromise;
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((project) => project.slug === slug);
}
