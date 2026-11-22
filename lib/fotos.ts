import { supabase } from "./supabase";
import type { Repuesto } from "./tipos";

/** Bucket de las fotos que suben las tiendas. */
const BUCKET = "repuestos";

/**
 * Las fotos de los repuestos de ejemplo viven en su propio bucket público, llamado "ejemplo".
 * Sus rutas se guardan como "ejemplo/NN-nombre.jpg".
 */
const BUCKET_EJEMPLO = "ejemplo";

/** URL pública de la primera foto del repuesto, o null si no tiene (entonces se muestra la ilustración). */
export function fotoDe(r: Pick<Repuesto, "imagenes">): string | null {
  const ruta = r.imagenes?.[0];
  if (!ruta || !supabase) return null;

  const prefijo = `${BUCKET_EJEMPLO}/`;
  if (ruta.startsWith(prefijo)) {
    return supabase.storage.from(BUCKET_EJEMPLO).getPublicUrl(ruta.slice(prefijo.length)).data.publicUrl;
  }
  return supabase.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl;
}
