import Link from 'next/link';
import { Compass } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Topics' },
  { href: '/profile', label: 'Profile' },
  { href: '/recommendations', label: 'Recommendations' },
];

export function SiteHeader() {
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
            <Compass className="size-4" aria-hidden />
          </span>
          <span>Echolens</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-3 py-1.5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
