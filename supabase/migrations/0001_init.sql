-- Boda Meli & Kev — esquema inicial
create extension if not exists pgcrypto;
create extension if not exists unaccent;

-- Presupuesto general
create table presupuesto (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  categoria text check (categoria in ('Salón','Catering','Fotografía','Música','Decoración','Souvenirs','Invitaciones','Proveedores varios','Hospedaje/Transporte','Outfits','Ceremonia','Civil','Otros')),
  costo numeric,
  quien_paga text check (quien_paga in ('Novios','Familia de Meli','Familia de Kev','Otros')),
  vencimiento date,
  estado text check (estado in ('No pagado','Seña','Segundo pago','Pagado completo')) default 'No pagado',
  notas text,
  created_at timestamptz default now()
);

-- Invitaciones (diseño/impresión de la tarjeta de invitación en sí)
create table invitaciones (
  id uuid default gen_random_uuid() primary key,
  item text not null,
  estado text check (estado in ('Pendiente','En diseño','Aprobado','Impreso / Listo')) default 'Pendiente',
  proveedor text,
  costo numeric,
  vencimiento date,
  notas text,
  created_at timestamptz default now()
);

-- Souvenirs (incluye papelería del día: numeritos, place cards, etc.)
create table souvenirs (
  id uuid default gen_random_uuid() primary key,
  item text not null,
  tipo text check (tipo in ('Souvenir','Numerito de mesa','Tarjeta de lugar','Etiqueta souvenir','Etiqueta vino','Newspaper','Juegos para invitados','Libro de firmas','Cartelería baño','Kit de emergencia baño','Otro')),
  proveedor text,
  cantidad integer,
  costo_unitario numeric,
  costo_total numeric generated always as (cantidad * costo_unitario) stored,
  estado text check (estado in ('Pendiente','En diseño/cotización','Encargado','Recibido')) default 'Pendiente',
  notas text,
  created_at timestamptz default now()
);

create table decoraciones (
  id uuid default gen_random_uuid() primary key,
  item text not null,
  proveedor text,
  costo numeric,
  estado text check (estado in ('No pagado','Seña','Segundo pago','Pagado completo')) default 'No pagado',
  notas text,
  created_at timestamptz default now()
);

-- Inspo / moodboard — foto_url apunta a Supabase Storage
create table inspo (
  id uuid default gen_random_uuid() primary key,
  titulo text,
  categoria text check (categoria in ('Decoración','Flores','Vestimenta','Torta','Salón','Papelería','Otro')),
  foto_url text not null,
  notas text,
  created_at timestamptz default now()
);

create table todo_list (
  id uuid default gen_random_uuid() primary key,
  tarea text not null,
  estado text check (estado in ('Pendiente','En progreso','Hecho')) default 'Pendiente',
  vencimiento date,
  responsable text,
  notas text,
  created_at timestamptz default now()
);

create table hospedaje_transporte (
  id uuid default gen_random_uuid() primary key,
  item text not null,
  proveedor text,
  costo numeric,
  estado text check (estado in ('No pagado','Seña','Segundo pago','Pagado completo')) default 'No pagado',
  notas text,
  created_at timestamptz default now()
);

create table ceremonia (
  id uuid default gen_random_uuid() primary key,
  item text not null,
  estado text check (estado in ('Pendiente','En progreso','Hecho')) default 'Pendiente',
  responsable text,
  notas text,
  created_at timestamptz default now()
);

create table civil (
  id uuid default gen_random_uuid() primary key,
  tramite text not null,
  estado text check (estado in ('Pendiente','Turno sacado','Hecho')) default 'Pendiente',
  fecha_turno date,
  notas text,
  created_at timestamptz default now()
);

create table acompanantes (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  rol text,
  contacto text,
  notas text,
  created_at timestamptz default now()
);

create table outfits (
  id uuid default gen_random_uuid() primary key,
  persona text,
  item text not null,
  proveedor text,
  costo numeric,
  estado text check (estado in ('Pendiente','Probado','Comprado / Listo')) default 'Pendiente',
  notas text,
  created_at timestamptz default now()
);

create table proveedores (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  rubro text,
  contacto text,
  costo numeric,
  estado_pago text check (estado_pago in ('No pagado','Seña','Segundo pago','Pagado completo')) default 'No pagado',
  notas text,
  created_at timestamptz default now()
);

create table puflo (
  id uuid default gen_random_uuid() primary key,
  item text not null,
  estado text check (estado in ('Pendiente','En progreso','Hecho')) default 'Pendiente',
  responsable text,
  notas text,
  created_at timestamptz default now()
);

-- Invitados: lista maestra + estado de confirmación
create table invitados (
  id uuid default gen_random_uuid() primary key,
  nombre_apellido text not null,
  nombre_normalizado text generated always as (
    lower(regexp_replace(unaccent(nombre_apellido), '\s+', ' ', 'g'))
  ) stored,
  grupo text, -- para agrupar "+1" bajo la misma invitación
  estado text check (estado in ('Invitado','Confirmado','No asiste')) default 'Invitado',
  tarjeta_pagada boolean default false,
  email text,
  preferencia_menu text,
  ayuda_con text,
  toma_alcohol text,
  otras_consideraciones text,
  fecha_confirmacion timestamptz,
  created_at timestamptz default now()
);

-- Confirmaciones de RSVP que no matchearon automáticamente contra "invitados"
create table rsvp_revisar (
  id uuid default gen_random_uuid() primary key,
  fecha timestamptz,
  nombre_recibido text,
  email text,
  preferencia_menu text,
  ayuda_con text,
  toma_alcohol text,
  otras_consideraciones text,
  motivo text,
  resuelto boolean default false,
  created_at timestamptz default now()
);

-- Estado de la sincronización de RSVP (última fila de la Google Sheet ya procesada)
create table sync_state (
  id integer primary key default 1,
  last_row_processed integer not null default 0,
  updated_at timestamptz default now(),
  constraint sync_state_singleton check (id = 1)
);
insert into sync_state (id, last_row_processed) values (1, 0);

-- Row Level Security: el acceso ya está protegido por el gate de contraseña
-- a nivel de la app, así que todas las policies quedan abiertas.
do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'presupuesto','invitaciones','souvenirs','decoraciones','inspo',
      'todo_list','hospedaje_transporte','ceremonia','civil','acompanantes',
      'outfits','proveedores','puflo','invitados','rsvp_revisar','sync_state'
    ])
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('create policy %I on %I for all using (true) with check (true);', t || '_open', t);
  end loop;
end $$;
