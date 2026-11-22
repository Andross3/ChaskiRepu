"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { inicioDeRol, type Rol } from "@/lib/auth";
import { useSesion } from "@/lib/useSesion";

interface Props {
  /** Rol que puede ver el contenido. Sin rol, basta con haber iniciado sesión. */
  rol?: Rol;
  children: ReactNode;
}

const aviso = "mx-auto max-w-xl px-4 py-20 text-center sm:px-6";

/**
 * Guarda de ruta del lado del cliente: sin sesión manda a /entrar y recuerda a dónde volver.
 * La seguridad real de los datos la dan las políticas RLS de Supabase; esto solo ordena la navegación.
 */
export function Protegido({ rol, children }: Props) {
  const router = useRouter();
  const ruta = usePathname();
  const { cargando, usuario, rol: rolActual } = useSesion();

  useEffect(() => {
    if (!cargando && !usuario) {
      const destino = new URLSearchParams({ volver: ruta });
      if (rol === "proveedor") destino.set("rol", "tienda");
      router.replace(`/entrar?${destino.toString()}`);
    }
  }, [cargando, usuario, ruta, rol, router]);

  if (cargando || !usuario) {
    return (
      <div className={aviso} role="status" aria-live="polite">
        <p className="font-display text-xl font-semibold text-marino">Comprobando tu sesión...</p>
      </div>
    );
  }

  if (rol && rolActual !== rol) {
    return (
      <div className={aviso}>
        <h1 className="font-display text-2xl font-semibold text-marino">
          {rol === "proveedor" ? "Esta área es solo para tiendas" : "Esta área no es para tu cuenta"}
        </h1>
        <p className="mt-3 text-[16px] text-ink-2">
          {rol === "proveedor"
            ? "Tu cuenta es de comprador. Para vender repuestos, crea una cuenta de tienda."
            : "Entra con la cuenta que corresponde."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={inicioDeRol(rolActual ?? "usuario")} className="rounded-2xl boton-primario px-5 py-3 font-semibold">
            Ir a mi área
          </Link>
          {rol === "proveedor" && (
            <Link href="/registro-proveedor" className="rounded-2xl border border-linea px-5 py-3 font-semibold hover:bg-arena">
              Registrar una tienda
            </Link>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
