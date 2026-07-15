export interface NavItem {
  href: string;
  label: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'General',
    items: [
      { href: '/', label: 'Dashboard' },
      { href: '/invitados', label: 'Invitados' },
      { href: '/presupuesto', label: 'Presupuesto' },
      { href: '/proveedores', label: 'Proveedores' },
    ],
  },
  {
    label: 'Papelería & detalles',
    items: [
      { href: '/invitaciones', label: 'Invitaciones' },
      { href: '/souvenirs', label: 'Souvenirs' },
      { href: '/decoraciones', label: 'Decoración' },
      { href: '/inspo', label: 'Inspo' },
    ],
  },
  {
    label: 'Organización',
    items: [
      { href: '/todo', label: 'To do list' },
      { href: '/hospedaje-transporte', label: 'Hospedaje / Transporte' },
      { href: '/ceremonia', label: 'Ceremonia' },
      { href: '/civil', label: 'Civil' },
      { href: '/acompanantes', label: 'Acompañantes' },
      { href: '/outfits', label: 'Outfits' },
      { href: '/puflo', label: 'Puflo' },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
