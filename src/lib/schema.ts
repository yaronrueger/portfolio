import { z } from 'zod';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

export const profileSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  employer: z.object({
    name: z.string().min(1),
    location: z.string().min(1),
  }),
  url: z.url(),
  description: z.string().min(1),
  bio: z.array(z.string().min(1)).min(1),
  links: z.object({
    github: z.url(),
    linkedin: z.union([z.url(), z.literal('')]),
    email: z.email(),
  }),
  career: z.array(
    z.object({
      date: isoDate,
      title: z.string().min(1),
      organization: z.string().min(1),
    }),
  ),
  education: z.array(
    z.object({
      date: isoDate,
      endDate: isoDate.optional(),
      title: z.string().min(1),
      organization: z.string().optional(),
    }),
  ),
  skills: z.array(
    z.object({
      name: z.string().min(1),
      level: z.number().int().min(0).max(100),
    }),
  ),
});

export type Profile = z.infer<typeof profileSchema>;

export const projectFrontmatterSchema = z.object({
  repo: z.string().min(1),
  title: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  year: z.number().int().min(2000).max(2100).optional(),
  homepage: z.url().optional(),
  stack: z.array(z.string().min(1)).optional(),
  hidden: z.boolean().optional(),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

export const githubRepoSchema = z.object({
  name: z.string().min(1),
  html_url: z.url(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  homepage: z.string().nullable(),
  topics: z.array(z.string()),
  fork: z.boolean(),
  archived: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type GithubRepo = z.infer<typeof githubRepoSchema>;
