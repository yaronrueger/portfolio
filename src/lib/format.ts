const monthYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatMonthYear(isoDate: string): string {
  return monthYear.format(new Date(`${isoDate}T00:00:00Z`));
}

export const navItems = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
] as const;

export function skillBar(level: number, cells = 20): string {
  const filled = Math.round((level / 100) * cells);
  return `[${'#'.repeat(filled)}${' '.repeat(cells - filled)}]`;
}

export const PENDING_CLASS = 'scramble-pending';
