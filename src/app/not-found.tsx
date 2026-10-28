import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <div>
      <h1 className="page-title">404: Page not found</h1>
      <p className="not-found-text">
        <Link href="/">← back to start</Link>
      </p>
    </div>
  );
}
