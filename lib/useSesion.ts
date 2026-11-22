"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { Rol } from "./auth";
import { supabase } from "./supabase";

export interface Sesion {
  cargando: boolean;
  usuario: User | null;
  rol: Rol | null;
  nombre: string | null;
}

const SIN_SESION: Sesion = { cargando: false, usuario: null, rol: null, nombre: null };

/** Sesión actual de Supabase y el rol del perfil. Se actualiza al entrar o salir. */
export function useSesion(): Sesion {
  // Sin cliente de Supabase no hay nada que cargar: se arranca ya sin sesión.
  const [sesion, setSesion] = useState<Sesion>({ ...SIN_SESION, cargando: supabase !== null });

  useEffect(() => {
    const db = supabase;
    if (!db) return;
    let vivo = true;

    async function cargar(usuario: User | null) {
      if (!db || !vivo) return;
      if (!usuario) {
        setSesion(SIN_SESION);
        return;
      }
      const { data } = await db.from("perfiles").select("rol,nombre").eq("id", usuario.id).maybeSingle();
      if (!vivo) return;
      setSesion({
        cargando: false,
        usuario,
        rol: (data?.rol as Rol | undefined) ?? "usuario",
        nombre: data?.nombre || usuario.email || null,
      });
    }

    db.auth.getSession().then(({ data }) => cargar(data.session?.user ?? null));
    const { data: suscripcion } = db.auth.onAuthStateChange((_evento, session) => {
      // Se difiere para no llamar a Supabase dentro del propio callback (puede bloquearse).
      setTimeout(() => cargar(session?.user ?? null), 0);
    });

    return () => {
      vivo = false;
      suscripcion.subscription.unsubscribe();
    };
  }, []);

  return sesion;
}
