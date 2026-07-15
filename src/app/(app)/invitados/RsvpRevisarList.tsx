'use client';

import { useState, useTransition } from 'react';
import { InvitadoRow, RsvpRevisarRow } from '@/lib/supabase/types';
import { GuestPicker } from './GuestPicker';
import { resolveRsvpAsNew, resolveRsvpToExisting } from './actions';

function RsvpCard({ rsvp, guests }: { rsvp: RsvpRevisarRow; guests: InvitadoRow[] }) {
  const [selectedGuest, setSelectedGuest] = useState<InvitadoRow | null>(null);
  const [isPending, startTransition] = useTransition();

  function assign() {
    if (!selectedGuest) return;
    startTransition(() => {
      resolveRsvpToExisting(rsvp, selectedGuest.id);
    });
  }

  function createNew() {
    if (!window.confirm(`¿Crear un invitado nuevo llamado "${rsvp.nombre_recibido}"?`)) return;
    startTransition(() => {
      resolveRsvpAsNew(rsvp);
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-ink">{rsvp.nombre_recibido}</p>
          {rsvp.motivo && <p className="text-xs text-accent">{rsvp.motivo}</p>}
        </div>
        {rsvp.fecha && <p className="text-xs text-ink-soft">{new Date(rsvp.fecha).toLocaleDateString('es-AR')}</p>}
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
        {rsvp.email && (
          <div>
            <dt className="text-xs text-ink-soft">Email</dt>
            <dd>{rsvp.email}</dd>
          </div>
        )}
        {rsvp.preferencia_menu && (
          <div>
            <dt className="text-xs text-ink-soft">Preferencia de menú</dt>
            <dd>{rsvp.preferencia_menu}</dd>
          </div>
        )}
        {rsvp.ayuda_con && (
          <div>
            <dt className="text-xs text-ink-soft">Necesita ayuda con</dt>
            <dd>{rsvp.ayuda_con}</dd>
          </div>
        )}
        {rsvp.toma_alcohol && (
          <div>
            <dt className="text-xs text-ink-soft">Toma alcohol</dt>
            <dd>{rsvp.toma_alcohol}</dd>
          </div>
        )}
        {rsvp.otras_consideraciones && (
          <div className="sm:col-span-2">
            <dt className="text-xs text-ink-soft">Otras consideraciones</dt>
            <dd>{rsvp.otras_consideraciones}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <GuestPicker guests={guests} onSelect={setSelectedGuest} />
        </div>
        <button
          onClick={assign}
          disabled={!selectedGuest || isPending}
          className="rounded-lg bg-ink px-3 py-2 text-sm font-medium text-paper transition hover:bg-ink/90 disabled:opacity-40"
        >
          Asignar
        </button>
        <button
          onClick={createNew}
          disabled={isPending}
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink transition hover:bg-paper-soft disabled:opacity-40"
        >
          Crear invitado nuevo
        </button>
      </div>
    </div>
  );
}

export function RsvpRevisarList({ rows, guests }: { rows: RsvpRevisarRow[]; guests: InvitadoRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-ink-soft shadow-sm">
        No hay confirmaciones pendientes de revisar. 🎉
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rows.map((rsvp) => (
        <RsvpCard key={rsvp.id} rsvp={rsvp} guests={guests} />
      ))}
    </div>
  );
}
