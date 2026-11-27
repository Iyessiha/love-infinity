'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Item = { href: string; label: string; badge?: number };

export default function AdminNav({ items }: { items: Item[] }) {
  const path = usePathname();
  return (
    <nav className="adm-nav" aria-label="Administration">
      {items.map((i) => {
        const actif = i.href === '/admin' ? path === '/admin' : path.startsWith(i.href);
        return (
          <Link key={i.href} href={i.href} aria-current={actif ? 'page' : undefined}>
            {i.label}
            {i.badge ? <span className="adm-badge" aria-label={`${i.badge} à traiter`}>{i.badge}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
