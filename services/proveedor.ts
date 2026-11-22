
import { supabase } from "@/lib/supabase";

export interface RegistroProveedorInput {
  nombre: string;
  correo: string;
  contrasena: string;
  telefono: string;
  tienda: string;
  ubicacion: string;
}

export interface RegistroProveedorResult {
  userId: string;
  requiereConfirmacion: boolean;
}

export async function registrarProveedor(
  datos: RegistroProveedorInput
): Promise<RegistroProveedorResult> {
  if (!supabase) {
    throw new Error("No se pudo conectar con Supabase.");
  }

  const { data, error } = await supabase.auth.signUp({
    email: datos.correo.trim(),
    password: datos.contrasena,
    options: {
      data: {
        nombre: datos.nombre.trim(),
        telefono: datos.telefono.trim(),
        rol: "proveedor",
        nombre_tienda: datos.tienda.trim(),
        ubicacion_tienda: datos.ubicacion.trim(),
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("No se pudo crear el usuario.");
  }

  return {
    userId: data.user.id,
    requiereConfirmacion: !data.session,
  };
}
