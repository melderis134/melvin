export function daysUntil(dateIso: string, from = new Date()) {
  const target = new Date(dateIso);
  const diffMs = target.getTime() - from.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDateEs(dateIso: string) {
  return new Date(dateIso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'America/Argentina/Cordoba',
  });
}

export function daysUntilShort(dateIso: string, from = new Date()) {
  const days = daysUntil(dateIso, from);
  if (days < 0) return null;
  return days;
}
