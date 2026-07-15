import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { WEDDING_DATE, WEDDING_VENUE } from '@/lib/constants';
import { daysUntil, formatDateEs } from '@/lib/date';
import { formatCurrency } from '@/lib/format';
import { getDashboardData } from '@/lib/dashboard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await getDashboardData();
  const dias = daysUntil(WEDDING_DATE);
  const presupuestoPct = data.totalEstimado > 0 ? (data.totalGastado / data.totalEstimado) * 100 : 0;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`${WEDDING_VENUE} · ${formatDateEs(WEDDING_DATE)}`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Faltan"
          value={dias >= 0 ? `${dias} día${dias === 1 ? '' : 's'}` : '¡Ya fue!'}
          detail={formatDateEs(WEDDING_DATE)}
        />
        <StatCard
          label="Presupuesto"
          value={formatCurrency(data.totalGastado)}
          detail={`de ${formatCurrency(data.totalEstimado)} estimado`}
          progress={presupuestoPct}
        />
        <StatCard
          label="Invitados"
          value={`${data.invitadosConfirmados} / ${data.invitadosTotal}`}
          detail={`confirmados${data.invitadosNoAsiste ? ` · ${data.invitadosNoAsiste} no asisten` : ''}`}
          progress={data.invitadosTotal > 0 ? (data.invitadosConfirmados / data.invitadosTotal) * 100 : 0}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <p className="text-xs font-medium tracking-wide text-ink-soft uppercase">Próximos vencimientos</p>
        {data.proximosVencimientos.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">No hay vencimientos próximos cargados.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {data.proximosVencimientos.map((d, i) => (
              <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="text-ink">{d.label}</p>
                  <p className="text-xs text-ink-soft">{d.source}</p>
                </div>
                <p className="font-medium text-ink">{formatDateEs(d.date)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
