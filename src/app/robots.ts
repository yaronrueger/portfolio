import type { MetadataRoute } from 'next';
import { getProfile } from '@/lib/content';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const base = getProfile().url.replace(/\/$/, '');
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${base}/sitemap.xml`,
  };
}
