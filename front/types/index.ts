export interface Prestamo {
  id: string;
  cliente_id: string;
  monto: number;
  monto_final: number;
  monto_adeudado: number;
  cuotas_totales: number;
  cuotas_pagadas: number;
  semanas: number;
  intereses: number;
  solo_interes: boolean;
  fecha_inicio: string;
  vendedor: string;
  activo: boolean;
  created_at: string;
  dias_alerta?: number;
  pagos?: Pago[];
}

export interface Pago {
  id: string;
  prestamo_id: string;
  fecha: string;
  monto: number;
}

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  direccion: string;
  google_maps?: string;
  telefono_personal: string;
  telefono_referencia?: string;
  telefono_tres?: string;
  created_at: string;
  updated_at: string;
  prestamoActual?: Prestamo;
}

export interface Vendedor {
  id: string;
  nombre: string;
  rol: 'admin' | 'vendedor';
  creadoEn: number;
}

export interface BalanceSemanal {
  nuevosClientes: number;
  totalPrestamos: number;
  totalPrestado: number;
  totalCobrado: number;
  prestamosDeLaSemana: { cliente: string; monto: number; fechaFormateada: string }[];
  fechaHoy: string;
}
