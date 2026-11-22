
import { supabase } from "@/lib/supabase";

// ==========================================
// TIPOS
// ==========================================

export type CondicionRepuesto =
  | "nuevo"
  | "usado"
  | "reacondicionado";

export interface Repuesto {
  id: string;
  nombre: string;
  categoria: string;
  condicion: CondicionRepuesto;
  compatibilidad: string[];
  precio: number;
  stock: number;
  modelo: string;
  ano_repuesto: string;
  imagenes: string[];
}

export interface CrearRepuesto {
  nombre: string;
  categoria: string;
  condicion: CondicionRepuesto;
  compatibilidad: string[];
  precio: number;
  stock: number;
  modelo: string;
  ano_repuesto: string;
  imagenes?: File[];
}

export interface ActualizarRepuesto {
  nombre?: string;
  categoria?: string;
  condicion?: CondicionRepuesto;
  compatibilidad?: string[];
  precio?: number;
  stock?: number;
  modelo?: string;
  ano_repuesto?: string;
  imagenes?: File[];
}

// ==========================================
// CONFIGURACIÓN
// ==========================================

const BUCKET = "repuestos";
const MAX_IMAGENES = 3;

// Verificar conexión con Supabase
function getSupabase() {
  if (!supabase) {
    throw new Error("Supabase no está configurado.");
  }

  return supabase;
}

// ==========================================
// STORAGE - SUBIR IMÁGENES
// ==========================================

export async function subirImagenes(
  archivos: File[],
  repuestoId: string
): Promise<string[]> {
  const client = getSupabase();

  if (archivos.length > MAX_IMAGENES) {
    throw new Error("Solo puedes subir un máximo de 3 imágenes.");
  }

  const rutas: string[] = [];

  try {
    for (const archivo of archivos) {
      if (!archivo.type.startsWith("image/")) {
        throw new Error(`${archivo.name} no es una imagen válida.`);
      }

      const extension = archivo.name.split(".").pop() || "jpg";

      const ruta = `${repuestoId}/${crypto.randomUUID()}.${extension}`;

      const { error } = await client.storage
        .from(BUCKET)
        .upload(ruta, archivo, {
          contentType: archivo.type,
          upsert: false,
        });

      if (error) {
        throw error;
      }

      rutas.push(ruta);
    }

    return rutas;

  } catch (error) {
    // Limpiar imágenes subidas si ocurre un error
    if (rutas.length > 0) {
      await client.storage.from(BUCKET).remove(rutas);
    }

    throw error;
  }
}

// ==========================================
// STORAGE - OBTENER URL PÚBLICA
// ==========================================

export function obtenerUrlImagen(ruta: string): string {
  const client = getSupabase();

  const { data } = client.storage
    .from(BUCKET)
    .getPublicUrl(ruta);

  return data.publicUrl;
}

// ==========================================
// STORAGE - ELIMINAR IMÁGENES
// ==========================================

export async function eliminarImagenes(
  rutas: string[]
): Promise<void> {
  if (rutas.length === 0) return;

  const client = getSupabase();

  const { error } = await client.storage
    .from(BUCKET)
    .remove(rutas);

  if (error) {
    throw error;
  }
}

// ==========================================
// CREATE - CREAR REPUESTO
// ==========================================

export async function crearRepuesto(
  datos: CrearRepuesto
): Promise<Repuesto> {
  const client = getSupabase();

  const archivos = datos.imagenes ?? [];

  if (archivos.length > MAX_IMAGENES) {
    throw new Error("Solo puedes subir un máximo de 3 imágenes.");
  }

  // Crear identificador para organizar las imágenes
  const id = crypto.randomUUID();

  // Subir imágenes antes de insertar el registro
  const rutas = await subirImagenes(archivos, id);

  const { data, error } = await client
    .from("repuestos")
    .insert({
      id,
      nombre: datos.nombre,
      categoria: datos.categoria,
      condicion: datos.condicion,
      compatibilidad: datos.compatibilidad,
      precio: datos.precio,
      stock: datos.stock,
      modelo: datos.modelo,
      ano_repuesto: datos.ano_repuesto,
      imagenes: rutas,
    })
    .select()
    .single();

  if (error) {
    // Evitar archivos huérfanos
    if (rutas.length > 0) {
      try {
        await eliminarImagenes(rutas);
      } catch (errorLimpieza) {
        console.error("No se pudieron limpiar las imágenes del repuesto:", errorLimpieza);
      }
    }
    throw error;
  }

  return data as Repuesto;
}

// ==========================================
// READ - OBTENER TODOS LOS REPUESTOS
// ==========================================

export async function obtenerRepuestos(): Promise<Repuesto[]> {
  const client = getSupabase();

  const { data, error } = await client
    .from("repuestos")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Repuesto[];
}

// ==========================================
// READ - OBTENER REPUESTO POR ID
// ==========================================

export async function obtenerRepuestoPorId(
  id: string
): Promise<Repuesto> {
  const client = getSupabase();

  const { data, error } = await client
    .from("repuestos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data as Repuesto;
}

// ==========================================
// UPDATE - ACTUALIZAR REPUESTO
// ==========================================

export async function actualizarRepuesto(
  id: string,
  datos: ActualizarRepuesto
): Promise<Repuesto> {
  const client = getSupabase();

  // Obtener registro actual
  const actual = await obtenerRepuestoPorId(id);

  const { imagenes: archivos, ...campos } = datos;

  let nuevasRutas: string[] | undefined;

  // Si se envían imágenes, reemplazar las anteriores
  if (archivos !== undefined) {
    if (archivos.length > MAX_IMAGENES) {
      throw new Error("Solo puedes subir un máximo de 3 imágenes.");
    }

    nuevasRutas = await subirImagenes(archivos, id);
  }

  const { data, error } = await client
    .from("repuestos")
    .update({
      ...campos,
      ...(nuevasRutas !== undefined && {
        imagenes: nuevasRutas,
      }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    // Si falla la actualización, conservar las imágenes anteriores
    if (nuevasRutas) {
      await eliminarImagenes(nuevasRutas);
    }

    throw error;
  }

  // Eliminar imágenes anteriores después de actualizar correctamente
  if (nuevasRutas !== undefined && actual.imagenes.length > 0) {
    await eliminarImagenes(actual.imagenes);
  }

  return data as Repuesto;
}

// ==========================================
// DELETE - ELIMINAR REPUESTO
// ==========================================

export async function eliminarRepuesto(
  id: string
): Promise<void> {
  const client = getSupabase();

  // Obtener imágenes antes de eliminar el registro
  const actual = await obtenerRepuestoPorId(id);

  const { error } = await client
    .from("repuestos")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  // Eliminar imágenes del Storage
  await eliminarImagenes(actual.imagenes);
}
