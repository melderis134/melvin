'use client';

import { useMemo, useState } from 'react';
import { InvitadoRow } from '@/lib/supabase/types';

export function GuestPicker({
  guests,
  onSelect,
}: {
  guests: InvitadoRow[];
  onSelect: (guest: InvitadoRow) => void;
}) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<InvitadoRow | null>(null);
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return guests.slice(0, 6);
    const q = query.toLowerCase();
    return guests.filter((g) => g.nombre_apellido.toLowerCase().includes(q)).slice(0, 6);
  }, [guests, query]);

  return (
    <div className="relative">
      <input
        value={selected ? selected.nombre_apellido : query}
        onChange={(e) => {
          setSelected(null);
          setQuery(e.target.value);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder="Buscar invitado existente…"
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
      />
      {focused && !selected && results.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-border bg-surface shadow-md">
          {results.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                onMouseDown={() => {
                  setSelected(g);
                  setQuery('');
                  onSelect(g);
                }}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-paper-soft"
              >
                {g.nombre_apellido}
                {g.grupo && <span className="ml-2 text-xs text-ink-soft">{g.grupo}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
