import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { InvitadoRow } from '@/lib/supabase/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface SheetRow {
  'Fecha carga': string;
  Id: string;
  'Nombre y Apellido': string;
  Email: string;
  'Preferencia de Menú': string;
  'Necesito ayuda con': string;
  'Toma alcohol': string;
  'Otras consideraciones': string;
}

function normalizeName(raw: string) {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function parseFecha(raw: string | undefined) {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const sheetId = process.env.RSVP_SHEET_ID;
  if (!sheetId) {
    return NextResponse.json({ error: 'Falta RSVP_SHEET_ID' }, { status: 500 });
  }

  const supabase = createServerSupabaseClient();

  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Confirmaciones`;
  const csvRes = await fetch(csvUrl, { cache: 'no-store' });
  if (!csvRes.ok) {
    return NextResponse.json({ error: `No se pudo leer la planilla (${csvRes.status})` }, { status: 502 });
  }
  const csvText = await csvRes.text();

  const parsed = Papa.parse<SheetRow>(csvText, { header: true, skipEmptyLines: true });
  const allRows = parsed.data;

  const { data: syncState, error: syncError } = await supabase
    .from('sync_state')
    .select('last_row_processed')
    .eq('id', 1)
    .single();
  if (syncError) throw new Error(syncError.message);

  const lastRowProcessed = syncState?.last_row_processed ?? 0;
  const newRows = allRows.slice(lastRowProcessed);

  const { data: guestsData, error: guestsError } = await supabase
    .from('invitados')
    .select('id, nombre_normalizado');
  if (guestsError) throw new Error(guestsError.message);
  const guests = (guestsData ?? []) as Pick<InvitadoRow, 'id' | 'nombre_normalizado'>[];

  let procesadas = 0;
  let matcheadas = 0;
  let paraRevisar = 0;

  for (const row of newRows) {
    const nombreCrudo = row['Nombre y Apellido']?.trim();
    if (!nombreCrudo) continue;
    if (nombreCrudo === 'Prueba') continue;

    procesadas++;
    const normalizado = normalizeName(nombreCrudo);
    const matches = guests.filter((g) => g.nombre_normalizado === normalizado);

    const rsvpFields = {
      email: row['Email']?.trim() || null,
      preferencia_menu: row['Preferencia de Menú']?.trim() || null,
      ayuda_con: row['Necesito ayuda con']?.trim() || null,
      toma_alcohol: row['Toma alcohol']?.trim() || null,
      otras_consideraciones: row['Otras consideraciones']?.trim() || null,
    };

    if (matches.length === 1) {
      const { error } = await supabase
        .from('invitados')
        .update({
          estado: 'Confirmado',
          fecha_confirmacion: new Date().toISOString(),
          ...rsvpFields,
        })
        .eq('id', matches[0].id);
      if (error) throw new Error(error.message);
      matcheadas++;
    } else {
      const motivo = matches.length === 0 ? 'Sin coincidencias en la lista de invitados' : 'Coincide con más de un invitado';
      const { error } = await supabase.from('rsvp_revisar').insert({
        fecha: parseFecha(row['Fecha carga']),
        nombre_recibido: nombreCrudo,
        motivo,
        ...rsvpFields,
      });
      if (error) throw new Error(error.message);
      paraRevisar++;
    }
  }

  const { error: updateStateError } = await supabase
    .from('sync_state')
    .update({ last_row_processed: allRows.length, updated_at: new Date().toISOString() })
    .eq('id', 1);
  if (updateStateError) throw new Error(updateStateError.message);

  return NextResponse.json({ procesadas, matcheadas, para_revisar: paraRevisar });
}
