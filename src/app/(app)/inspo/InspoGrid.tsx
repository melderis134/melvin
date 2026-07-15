'use client';

import { useMemo, useState, useTransition } from 'react';
import { CategoriaInspo, InspoRow } from '@/lib/supabase/types';
import { deleteInspo, updateInspo } from './actions';

const CATEGORIA_OPTIONS: CategoriaInspo[] = [
  'Decoración',
  'Flores',
  'Vestimenta',
  'Torta',
  'Salón',
  'Papelería',
  'Otro',
];

function InspoCard({ item }: { item: InspoRow }) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm('¿Eliminar esta foto?')) return;
    startTransition(() => {
      deleteInspo(item.id, item.foto_url);
    });
  }

  function saveTitle(value: string) {
    setEditingTitle(false);
    startTransition(() => {
      updateInspo(item.id, { titulo: value || null });
    });
  }

  function changeCategoria(value: string) {
    startTransition(() => {
      updateInspo(item.id, { categoria: value as CategoriaInspo });
    });
  }

  return (
    <div className="group mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="relative">
        {/* Fotos suben a Supabase Storage con URLs arbitrarias; usamos <img> para evitar configurar dominios remotos */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.foto_url} alt={item.titulo ?? 'Inspo'} className="w-full object-cover" loading="lazy" />
        <button
          onClick={handleDelete}
          aria-label="Eliminar"
          className="absolute top-2 right-2 rounded-full bg-ink/70 p-1.5 text-paper opacity-0 transition group-hover:opacity-100 hover:bg-ink"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="p-3">
        {editingTitle ? (
          <input
            autoFocus
            defaultValue={item.titulo ?? ''}
            onBlur={(e) => saveTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
            className="w-full rounded-md border border-border px-1.5 py-1 text-sm outline-none focus:border-accent"
          />
        ) : (
          <button onClick={() => setEditingTitle(true)} className="block w-full text-left text-sm text-ink">
            {item.titulo || <span className="text-ink-soft">Sin título</span>}
          </button>
        )}
        <select
          value={item.categoria ?? ''}
          onChange={(e) => changeCategoria(e.target.value)}
          className="mt-1.5 rounded-full border border-border bg-paper-soft px-2 py-1 text-xs text-ink-soft outline-none"
        >
          {CATEGORIA_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function InspoGrid({ items }: { items: InspoRow[] }) {
  const [filter, setFilter] = useState<CategoriaInspo | null>(null);

  const filtered = useMemo(() => (filter ? items.filter((i) => i.categoria === filter) : items), [items, filter]);

  const usedCategorias = useMemo(
    () => CATEGORIA_OPTIONS.filter((c) => items.some((i) => i.categoria === c)),
    [items],
  );

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-ink-soft shadow-sm">
        Todavía no subiste fotos de inspiración.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilter(null)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            filter === null ? 'border-ink bg-ink text-paper' : 'border-border bg-surface text-ink-soft hover:bg-paper-soft'
          }`}
        >
          Todas
        </button>
        {usedCategorias.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(filter === c ? null : c)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              filter === c ? 'border-ink bg-ink text-paper' : 'border-border bg-surface text-ink-soft hover:bg-paper-soft'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((item) => (
          <InspoCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
