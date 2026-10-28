import type { MetadataRoute } from 'next';
import { getProfile } from '@/lib/content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getProfile().url.replace(/\/$/, '');
  return [{ url: `${base}/` }];
}
