import { supabase } from "./supabase";

/** Roles de la base (enum rol_usuario). En la interfaz "proveedor" se muestra como "tienda". */
export type Rol = "usuario" | "mecanico" | "proveedor";

export interface RegistroUsuarioInput {
  nombre: string;
  correo: string;
  contrasena: string;
  telefono?: string;
}

function cliente() {
  if (!supabase) throw new Error("No se pudo conectar con Supabase. Revisa las claves del archivo .env.");
  return supabase;
}

/** Traduce los mensajes de Supabase a algo que el usuario entienda. */
function traducir(mensaje: string): string {
  const m = mensaje.toLowerCase();
  if (m.includes("invalid login credentials")) return "Correo o contraseña incorrectos.";
  if (m.includes("email not confirmed")) return "Debes confirmar tu correo antes de entrar. Revisa tu bandeja.";
  if (m.includes("already registered") || m.includes("already been registered")) return "Ese correo ya tiene una cuenta. Inicia sesión.";
  if (m.includes("password should be")) return "La contraseña es muy débil. Usa al menos 8 caracteres.";
  if (m.includes("rate limit")) return "Demasiados intentos. Espera un momento y prueba de nuevo.";
  if (m.includes("failed to fetch") || m.includes("network")) return "No hay conexión con el servidor. Revisa tu internet.";
  return mensaje;
}

export async function iniciarSesion(correo: string, contrasena: string): Promise<{ userId: string; rol: Rol }> {
  const db = cliente();
  const { data, error } = await db.auth.signInWithPassword({ email: correo.trim(), password: contrasena });
  if (error) throw new Error(traducir(error.message));
  if (!data.user) throw new Error("No se pudo iniciar sesión.");
  return { userId: data.user.id, rol: await obtenerRol(data.user.id) };
}

export async function registrarUsuario(datos: RegistroUsuarioInput): Promise<{ requiereConfirmacion: boolean }> {
  const db = cliente();
  const { data, error } = await db.auth.signUp({
    email: datos.correo.trim(),
    password: datos.contrasena,
    options: {
      // handle_new_user crea el perfil con este rol; cualquier valor distinto de "proveedor" queda como "usuario".
      data: { nombre: datos.nombre.trim(), telefono: datos.telefono?.trim() ?? null, rol: "usuario" },
    },
  });
  if (error) throw new Error(traducir(error.message));
  if (!data.user) throw new Error("No se pudo crear la cuenta.");
  return { requiereConfirmacion: !data.session };
}

export async function cerrarSesion(): Promise<void> {
  const db = cliente();
  const { error } = await db.auth.signOut();
  if (error) throw new Error(traducir(error.message));
}

/** Lee el rol del perfil (la política perfiles_select_propio solo deja ver el propio). */
export async function obtenerRol(userId: string): Promise<Rol> {
  const db = cliente();
  const { data } = await db.from("perfiles").select("rol").eq("id", userId).maybeSingle();
  return (data?.rol as Rol | undefined) ?? "usuario";
}

/** A dónde mandar a cada rol al entrar. */
export function inicioDeRol(rol: Rol): string {
  return rol === "proveedor" ? "/tienda" : "/comprar";
}

/** Solo acepta rutas internas para evitar redirecciones a otros sitios. */
export function rutaSegura(ruta: string | null | undefined): string | null {
  if (!ruta || !ruta.startsWith("/") || ruta.startsWith("//") || ruta.includes("\\")) return null;
  return ruta;
}
