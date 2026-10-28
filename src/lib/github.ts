import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { githubRepoSchema, type GithubRepo } from './schema';

const GITHUB_USER = 'yaronrueger';
const CACHE_FILE = path.join(process.cwd(), '.cache', 'github-repos.json');

const reposResponseSchema = z.array(githubRepoSchema);

async function fetchFromApi(): Promise<GithubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?type=owner&sort=updated&per_page=100`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'portfolio-build',
      },
    },
  );
  if (!res.ok) {
    throw new Error(`GitHub API responded with ${res.status}`);
  }
  return reposResponseSchema.parse(await res.json());
}

async function readCache(): Promise<GithubRepo[] | null> {
  try {
    return reposResponseSchema.parse(JSON.parse(await readFile(CACHE_FILE, 'utf8')));
  } catch {
    return null;
  }
}

export async function getPublicRepos(): Promise<GithubRepo[]> {
  let repos: GithubRepo[];
  try {
    repos = await fetchFromApi();
    await mkdir(path.dirname(CACHE_FILE), { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(repos, null, 2));
  } catch (error) {
    const cached = await readCache();
    console.warn(`[github] fetch failed: ${(error as Error).message}`);
    if (!cached) {
      console.warn('[github] no cached repository list available, continuing with none');
      return [];
    }
    console.warn(`[github] using cached list (${cached.length} repositories)`);
    repos = cached;
  }
  return repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}
