// Tipos manuales que reflejan supabase/migrations/0001_init.sql

export type EstadoPago = 'No pagado' | 'Seña' | 'Segundo pago' | 'Pagado completo';
export type EstadoSimple = 'Pendiente' | 'En progreso' | 'Hecho';
export type QuienPaga = 'Novios' | 'Familia de Mel' | 'Familia de Kev' | 'Otros';

export type CategoriaPresupuesto =
  | 'Salón' | 'Catering' | 'Fotografía' | 'Música' | 'Decoración' | 'Souvenirs'
  | 'Invitaciones' | 'Proveedores varios' | 'Hospedaje/Transporte' | 'Outfits'
  | 'Ceremonia' | 'Civil' | 'Otros';

export interface PresupuestoRow {
  id: string;
  nombre: string;
  categoria: CategoriaPresupuesto | null;
  costo: number | null;
  quien_paga: QuienPaga | null;
  vencimiento: string | null;
  estado: EstadoPago;
  notas: string | null;
  created_at: string;
}

export type EstadoInvitacion = 'Pendiente' | 'En diseño' | 'Aprobado' | 'Impreso / Listo';
export interface InvitacionesRow {
  id: string;
  item: string;
  estado: EstadoInvitacion;
  proveedor: string | null;
  costo: number | null;
  vencimiento: string | null;
  notas: string | null;
  created_at: string;
}

export type TipoSouvenir =
  | 'Souvenir' | 'Numerito de mesa' | 'Tarjeta de lugar' | 'Etiqueta souvenir'
  | 'Etiqueta vino' | 'Newspaper' | 'Juegos para invitados' | 'Libro de firmas'
  | 'Cartelería baño' | 'Kit de emergencia baño' | 'Otro';
export type EstadoSouvenir = 'Pendiente' | 'En diseño/cotización' | 'Encargado' | 'Recibido';
export interface SouvenirRow {
  id: string;
  item: string;
  tipo: TipoSouvenir | null;
  proveedor: string | null;
  cantidad: number | null;
  costo_unitario: number | null;
  costo_total: number | null;
  estado: EstadoSouvenir;
  notas: string | null;
  created_at: string;
}

export interface DecoracionRow {
  id: string;
  item: string;
  proveedor: string | null;
  costo: number | null;
  estado: EstadoPago;
  notas: string | null;
  created_at: string;
}

export type CategoriaInspo = 'Decoración' | 'Flores' | 'Vestimenta' | 'Torta' | 'Salón' | 'Papelería' | 'Otro';
export interface InspoRow {
  id: string;
  titulo: string | null;
  categoria: CategoriaInspo | null;
  foto_url: string;
  notas: string | null;
  created_at: string;
}

export interface TodoRow {
  id: string;
  tarea: string;
  estado: EstadoSimple;
  vencimiento: string | null;
  responsable: string | null;
  notas: string | null;
  created_at: string;
}

export interface HospedajeTransporteRow {
  id: string;
  item: string;
  proveedor: string | null;
  costo: number | null;
  estado: EstadoPago;
  notas: string | null;
  created_at: string;
}

export interface CeremoniaRow {
  id: string;
  item: string;
  estado: EstadoSimple;
  responsable: string | null;
  notas: string | null;
  created_at: string;
}

export type EstadoCivil = 'Pendiente' | 'Turno sacado' | 'Hecho';
export interface CivilRow {
  id: string;
  tramite: string;
  estado: EstadoCivil;
  fecha_turno: string | null;
  notas: string | null;
  created_at: string;
}

export interface AcompananteRow {
  id: string;
  nombre: string;
  rol: string | null;
  contacto: string | null;
  notas: string | null;
  created_at: string;
}

export type EstadoOutfit = 'Pendiente' | 'Probado' | 'Comprado / Listo';
export interface OutfitRow {
  id: string;
  persona: string | null;
  item: string;
  proveedor: string | null;
  costo: number | null;
  estado: EstadoOutfit;
  notas: string | null;
  created_at: string;
}

export interface ProveedorRow {
  id: string;
  nombre: string;
  rubro: string | null;
  contacto: string | null;
  costo: number | null;
  estado_pago: EstadoPago;
  notas: string | null;
  created_at: string;
}

export interface PufloRow {
  id: string;
  item: string;
  estado: EstadoSimple;
  responsable: string | null;
  notas: string | null;
  created_at: string;
}

export type EstadoInvitado = 'Invitado' | 'Confirmado' | 'No asiste';
export interface InvitadoRow {
  id: string;
  nombre_apellido: string;
  nombre_normalizado: string;
  grupo: string | null;
  estado: EstadoInvitado;
  tarjeta_pagada: boolean;
  email: string | null;
  preferencia_menu: string | null;
  ayuda_con: string | null;
  toma_alcohol: string | null;
  otras_consideraciones: string | null;
  fecha_confirmacion: string | null;
  created_at: string;
}

export interface RsvpRevisarRow {
  id: string;
  fecha: string | null;
  nombre_recibido: string | null;
  email: string | null;
  preferencia_menu: string | null;
  ayuda_con: string | null;
  toma_alcohol: string | null;
  otras_consideraciones: string | null;
  motivo: string | null;
  resuelto: boolean;
  created_at: string;
}

export interface SyncStateRow {
  id: number;
  last_row_processed: number;
  updated_at: string;
}
