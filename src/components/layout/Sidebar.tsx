'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NAV_GROUPS } from '@/lib/nav';
import { logout } from '@/app/login/actions';

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-3 text-[11px] font-medium tracking-[0.12em] text-ink-soft/70 uppercase">
            {group.label}
          </p>
          <ul className="mt-1.5 space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`block rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? 'bg-ink text-paper'
                        : 'text-ink hover:bg-paper-soft'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="px-5 pt-6 pb-4">
      <p className="text-[11px] tracking-[0.2em] text-ink-soft uppercase">Meli &amp; Kev</p>
      <p className="mt-0.5 font-display text-xl">10 de octubre, 2026</p>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar mobile */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-paper/95 px-4 py-3 backdrop-blur md:hidden">
        <div>
          <p className="text-[10px] tracking-[0.2em] text-ink-soft uppercase">Meli &amp; Kev</p>
          <p className="font-display text-lg leading-tight">10.10.2026</p>
        </div>
        <button
          aria-label="Abrir menú"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-border p-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-ink/30" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-paper shadow-xl">
            <div className="flex items-center justify-between px-5 pt-6 pb-2">
              <div>
                <p className="text-[11px] tracking-[0.2em] text-ink-soft uppercase">Meli &amp; Kev</p>
                <p className="font-display text-xl">10.10.2026</p>
              </div>
              <button aria-label="Cerrar menú" onClick={() => setOpen(false)} className="p-2 text-ink-soft">
                ✕
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <div className="border-t border-border p-3">
              <form action={logout}>
                <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-ink-soft hover:bg-paper-soft">
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-white/40 md:flex">
        <Brand />
        <NavLinks />
        <div className="border-t border-border p-3">
          <form action={logout}>
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-ink-soft hover:bg-paper-soft">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
