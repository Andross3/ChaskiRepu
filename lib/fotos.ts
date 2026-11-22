import { supabase } from "./supabase";
import type { Repuesto } from "./tipos";

const BUCKET = "repuestos";

/** URL pública de la primera foto del repuesto, o null si no tiene (entonces se muestra la ilustración). */
export function fotoDe(r: Pick<Repuesto, "imagenes">): string | null {
  const ruta = r.imagenes?.[0];
  if (!ruta || !supabase) return null;
  return supabase.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl;
}
