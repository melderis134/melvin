import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface Deadline {
  label: string;
  date: string;
  source: string;
}

export interface DashboardData {
  totalEstimado: number;
  totalGastado: number;
  invitadosTotal: number;
  invitadosConfirmados: number;
  invitadosNoAsiste: number;
  proximosVencimientos: Deadline[];
}

const COSTO_TABLES = [
  { table: 'presupuesto', costCol: 'costo', estadoCol: 'estado' },
  { table: 'invitaciones', costCol: 'costo', estadoCol: 'estado' },
  { table: 'souvenirs', costCol: 'costo_total', estadoCol: 'estado' },
  { table: 'decoraciones', costCol: 'costo', estadoCol: 'estado' },
  { table: 'hospedaje_transporte', costCol: 'costo', estadoCol: 'estado' },
  { table: 'outfits', costCol: 'costo', estadoCol: 'estado' },
  { table: 'proveedores', costCol: 'costo', estadoCol: 'estado_pago' },
] as const;

const PAID_STATUS = 'Pagado completo';

const DEADLINE_SOURCES = [
  { table: 'presupuesto', dateCol: 'vencimiento', labelCol: 'nombre', source: 'Presupuesto' },
  { table: 'invitaciones', dateCol: 'vencimiento', labelCol: 'item', source: 'Invitaciones' },
  { table: 'todo_list', dateCol: 'vencimiento', labelCol: 'tarea', source: 'To do list' },
  { table: 'civil', dateCol: 'fecha_turno', labelCol: 'tramite', source: 'Civil' },
] as const;

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = createServerSupabaseClient();

  const [costRows, invitadosRows, ...deadlineRows] = await Promise.all([
    Promise.all(
      COSTO_TABLES.map(async ({ table, costCol, estadoCol }) => {
        const { data, error } = await supabase.from(table).select(`${costCol}, ${estadoCol}`);
        if (error) throw new Error(error.message);
        return (data ?? []) as unknown as Record<string, unknown>[];
      }),
    ),
    supabase.from('invitados').select('estado'),
    ...DEADLINE_SOURCES.map(({ table, dateCol, labelCol }) => supabase.from(table).select(`${dateCol}, ${labelCol}`)),
  ]);

  let totalEstimado = 0;
  let totalGastado = 0;
  costRows.forEach((rows, i) => {
    const { costCol, estadoCol } = COSTO_TABLES[i];
    for (const row of rows) {
      const costo = row[costCol];
      if (typeof costo === 'number') {
        totalEstimado += costo;
        if (row[estadoCol] === PAID_STATUS) totalGastado += costo;
      }
    }
  });

  const invitados = (invitadosRows.data ?? []) as { estado: string }[];
  const invitadosTotal = invitados.length;
  const invitadosConfirmados = invitados.filter((i) => i.estado === 'Confirmado').length;
  const invitadosNoAsiste = invitados.filter((i) => i.estado === 'No asiste').length;

  const today = new Date().toISOString().slice(0, 10);
  const proximosVencimientos: Deadline[] = [];
  deadlineRows.forEach((result, i) => {
    const { dateCol, labelCol, source } = DEADLINE_SOURCES[i];
    const rows = (result.data ?? []) as unknown as Record<string, unknown>[];
    for (const row of rows) {
      const date = row[dateCol] as string | null;
      const label = row[labelCol] as string | null;
      if (date && date >= today && label) {
        proximosVencimientos.push({ label, date, source });
      }
    }
  });
  proximosVencimientos.sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalEstimado,
    totalGastado,
    invitadosTotal,
    invitadosConfirmados,
    invitadosNoAsiste,
    proximosVencimientos: proximosVencimientos.slice(0, 5),
  };
}
