import { REPUESTOS_DEMO } from "./demo";
import { supabase } from "./supabase";
import type { Proveedor, Repuesto } from "./tipos";

export interface ResultadoCarga {
  items: Repuesto[];
  reales: number;
  error?: string;
}

/** Fila tal como llega de Supabase. Acepta el esquema nuevo (`precio`) y el anterior (`precio_bs`). */
interface Fila {
  id: string;
  proveedor_id: string | null;
  nombre: string;
  categoria: string;
  condicion: string;
  precio?: number | string | null;
  precio_bs?: number | string | null;
  stock?: number | null;
  tipo_vehiculo?: string | null;
  posicion?: string | null;
  codigo?: string | null;
  equivalencias?: string[] | null;
  sinonimos?: string[] | null;
  motor?: "gasolina" | "hibrido" | "electrico" | null;
  imagenes?: string[] | null;
  descripcion?: string | null;
  proveedores?: ProveedorFila | null;
}

/** Proveedor tal como está en Supabase (esquema actual: nombre_tienda, ubicacion_tienda, telefono). */
interface ProveedorFila {
  nombre_tienda: string | null;
  ubicacion_tienda: string | null;
  telefono: string | null;
  lat: number | null;
  lng: number | null;
  horario: string | null;
  hace_envio: boolean | null;
  radio_envio_km: number | null;
  costo_envio_bs: number | null;
}

function normalizarProveedor(p: ProveedorFila | null | undefined): Proveedor | null {
  if (!p) return null;
  return {
    nombre: p.nombre_tienda ?? "Tienda",
    direccion: p.ubicacion_tienda,
    // Si la tienda no guardó su ubicación, la distancia queda "por confirmar".
    lat: p.lat,
    lng: p.lng,
    whatsapp: p.telefono,
    horario: p.horario,
    hace_envio: p.hace_envio ?? false,
    radio_envio_km: p.radio_envio_km,
    costo_envio_bs: p.costo_envio_bs,
  };
}

function normalizar(f: Fila): Repuesto {
  return {
    id: f.id,
    proveedor_id: f.proveedor_id,
    nombre: f.nombre,
    categoria: f.categoria ?? "",
    posicion: f.posicion ?? null,
    codigo: f.codigo ?? null,
    equivalencias: f.equivalencias ?? null,
    sinonimos: f.sinonimos ?? null,
    condicion: f.condicion ?? "nuevo",
    precio_bs: Number(f.precio ?? f.precio_bs ?? 0),
    stock: Number(f.stock ?? 0),
    tipo_vehiculo: f.tipo_vehiculo ?? "auto",
    motor: f.motor ?? undefined,
    imagenes: f.imagenes ?? null,
    descripcion: f.descripcion ?? null,
    proveedores: normalizarProveedor(f.proveedores),
  };
}

/**
 * Trae los repuestos de Supabase y les suma los de ejemplo (marcados) para ver el diseño con variedad.
 */
export async function cargarRepuestos(incluirEjemplos = true): Promise<ResultadoCarga> {
  let reales: Repuesto[] = [];
  let error: string | undefined;

  if (supabase) {
    const { data, error: err } = await supabase
      .from("repuestos")
      .select("*, proveedores(nombre_tienda,ubicacion_tienda,telefono,lat,lng,horario,hace_envio,radio_envio_km,costo_envio_bs)");
    if (err) error = err.message;
    else {
      reales = ((data ?? []) as unknown as Fila[]).map(normalizar).sort((a, b) => a.precio_bs - b.precio_bs);
    }
  } else {
    error = "Falta configurar las claves de Supabase en el archivo .env";
  }

  // Los repuestos de diseño solo se muestran mientras la base no tenga repuestos propios.
  const items = incluirEjemplos && reales.length === 0 ? REPUESTOS_DEMO : reales;
  return { items, reales: reales.length, error };
}
