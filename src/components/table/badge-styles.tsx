const BADGE_STYLES: Record<string, string> = {
  'No pagado': 'bg-neutral-badge text-ink-soft',
  'Seña': 'bg-accent-soft text-accent',
  'Segundo pago': 'bg-accent-soft text-accent',
  'Pagado completo': 'bg-sage-soft text-sage',

  Pendiente: 'bg-neutral-badge text-ink-soft',
  'En diseño': 'bg-accent-soft text-accent',
  'En diseño/cotización': 'bg-accent-soft text-accent',
  Aprobado: 'bg-sage-soft text-sage',
  'Impreso / Listo': 'bg-sage-soft text-sage',
  Encargado: 'bg-accent-soft text-accent',
  Recibido: 'bg-sage-soft text-sage',

  'En progreso': 'bg-accent-soft text-accent',
  Hecho: 'bg-sage-soft text-sage',

  Invitado: 'bg-neutral-badge text-ink-soft',
  Confirmado: 'bg-sage-soft text-sage',
  'No asiste': 'bg-accent-soft text-danger',

  'Turno sacado': 'bg-accent-soft text-accent',
  Probado: 'bg-accent-soft text-accent',
  'Comprado / Listo': 'bg-sage-soft text-sage',
};

export function badgeClasses(value: string) {
  return BADGE_STYLES[value] ?? 'bg-neutral-badge text-ink-soft';
}

export function Badge({ value }: { value: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${badgeClasses(value)}`}>
      {value}
    </span>
  );
}
