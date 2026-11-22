import { REPUESTOS_DEMO } from "./demo";
import { supabase } from "./supabase";
import type { Repuesto } from "./tipos";

export interface ResultadoCarga {
  items: Repuesto[];
  reales: number;
  error?: string;
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
      .select("*, proveedores(nombre,direccion,lat,lng,whatsapp)")
      .order("precio_bs", { ascending: true });
    if (err) error = err.message;
    else reales = (data ?? []) as unknown as Repuesto[];
  } else {
    error = "Falta configurar las claves de Supabase en el archivo .env";
  }

  const items = incluirEjemplos ? [...reales, ...REPUESTOS_DEMO] : reales;
  return { items, reales: reales.length, error };
}
