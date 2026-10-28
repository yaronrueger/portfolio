import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';
import { getProfile, getProjects } from '@/lib/content';
import { navItems, PENDING_CLASS } from '@/lib/format';
import { accentClass } from '@/lib/palette';
import { TextScramble } from '@/components/text-scramble';

const profile = getProfile();

export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title: {
    default: profile.name,
    template: `%s — ${profile.name}`,
  },
  description: profile.description,
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: profile.name,
    title: profile.name,
    description: profile.description,
    locale: 'en_US',
    url: '/',
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const projects = await getProjects();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('${PENDING_CLASS}')`,
          }}
        />
        <TextScramble />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="layout">
          <aside className="sidebar">
            <Link href="/" className="site-name">
              {profile.name}
            </Link>
            <p className="site-title grey comment">{profile.title}</p>

            <nav aria-label="Main">
              <ul className="nav-list">
                {navItems.map((item, index) => (
                  <li key={item.href}>
                    <Link href={item.href} className={`bracket ${accentClass(index + 1)}`}>
                      {item.label.toLowerCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="rule" />

            <section className="episode-list" aria-label="Projects">
              <p className="grey comment">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </p>
              <ol className="section">
                {projects.map((project, index) => (
                  <li key={project.slug}>
                    <Link href={`#${project.slug}`} className={accentClass(index)}>
                      {String(index + 1).padStart(2, '0')}: {project.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          </aside>

          <div className="content">
            <main id="main" className="main">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
