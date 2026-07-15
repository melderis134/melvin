'use client';

import { useMemo, useState } from 'react';
import { EditableTable } from '@/components/table/EditableTable';
import { ColumnDef } from '@/components/table/types';
import { InvitadoRow, RsvpRevisarRow } from '@/lib/supabase/types';
import { createInvitado, deleteInvitado, updateInvitado } from './actions';
import { RsvpRevisarList } from './RsvpRevisarList';

const ESTADO_OPTIONS = ['Invitado', 'Confirmado', 'No asiste'];

const columns: ColumnDef<InvitadoRow>[] = [
  { key: 'nombre_apellido', label: 'Nombre y apellido', type: 'text' },
  { key: 'grupo', label: 'Grupo', type: 'text' },
  { key: 'estado', label: 'Estado', type: 'select', options: ESTADO_OPTIONS },
  { key: 'tarjeta_pagada', label: 'Tarjeta pagada', type: 'checkbox' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'preferencia_menu', label: 'Preferencia de menú', type: 'text' },
  { key: 'ayuda_con', label: 'Ayuda con', type: 'text' },
  { key: 'toma_alcohol', label: 'Toma alcohol', type: 'text' },
  { key: 'otras_consideraciones', label: 'Otras consideraciones', type: 'text' },
  {
    key: 'fecha_confirmacion',
    label: 'Confirmó el',
    type: 'computed',
    formatValue: (v) => (v ? new Date(v as string).toLocaleDateString('es-AR') : '—'),
  },
];

export function InvitadosClient({
  guests,
  rsvpRows,
}: {
  guests: InvitadoRow[];
  rsvpRows: RsvpRevisarRow[];
}) {
  const [tab, setTab] = useState<'invitados' | 'revisar'>('invitados');
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string | null>(null);

  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      if (estadoFilter && g.estado !== estadoFilter) return false;
      if (search.trim() && !g.nombre_apellido.toLowerCase().includes(search.trim().toLowerCase())) return false;
      return true;
    });
  }, [guests, search, estadoFilter]);

  return (
    <div>
      <div className="mb-5 flex items-center gap-1 border-b border-border">
        <button
          onClick={() => setTab('invitados')}
          className={`border-b-2 px-3 pb-3 text-sm font-medium transition ${
            tab === 'invitados' ? 'border-ink text-ink' : 'border-transparent text-ink-soft hover:text-ink'
          }`}
        >
          Invitados
        </button>
        <button
          onClick={() => setTab('revisar')}
          className={`border-b-2 px-3 pb-3 text-sm font-medium transition ${
            tab === 'revisar' ? 'border-ink text-ink' : 'border-transparent text-ink-soft hover:text-ink'
          }`}
        >
          Para revisar
          {rsvpRows.length > 0 && (
            <span className="ml-1.5 rounded-full bg-accent-soft px-1.5 py-0.5 text-xs text-accent">
              {rsvpRows.length}
            </span>
          )}
        </button>
      </div>

      {tab === 'invitados' ? (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre…"
              className="w-full max-w-xs rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <div className="flex flex-wrap gap-1.5">
              {(['Invitado', 'Confirmado', 'No asiste'] as const).map((estado) => (
                <button
                  key={estado}
                  onClick={() => setEstadoFilter(estadoFilter === estado ? null : estado)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    estadoFilter === estado
                      ? 'border-ink bg-ink text-paper'
                      : 'border-border bg-surface text-ink-soft hover:bg-paper-soft'
                  }`}
                >
                  {estado}
                </button>
              ))}
            </div>
          </div>

          <EditableTable
            columns={columns}
            rows={filteredGuests}
            onUpdate={updateInvitado}
            onDelete={deleteInvitado}
            onCreate={createInvitado}
            emptyLabel="No hay invitados que coincidan con el filtro."
          />
        </>
      ) : (
        <RsvpRevisarList rows={rsvpRows} guests={guests} />
      )}
    </div>
  );
}
