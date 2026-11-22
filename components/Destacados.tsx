"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TarjetaRepuesto } from "./TarjetaRepuesto";
import { cargarRepuestos } from "@/lib/datos";
import type { Repuesto } from "@/lib/tipos";

export function Destacados() {
  const [items, setItems] = useState<Repuesto[] | null>(null);
  const [reales, setReales] = useState(0);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let vivo = true;
    cargarRepuestos(true).then((r) => {
      if (!vivo) return;
      setItems(r.items.slice(0, 4));
      setReales(r.reales);
      setError(r.error);
    });
    return () => {
      vivo = false;
    };
  }, []);

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-xl border border-linea bg-rojo-suave px-4 py-2 text-[14px] font-semibold text-marino">
          No pudimos leer la base de datos: {error}
        </p>
      )}
      {!items ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-3xl border border-linea bg-white/60" />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((r, i) => (
            <TarjetaRepuesto key={r.id} r={r} indice={i} />
          ))}
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-ink-2">
          {items ? `${reales} repuestos reales de la base de datos; los marcados como "Ejemplo" son solo para ver el diseño.` : ""}
        </p>
        <Link
          href="/buscar"
          className="rounded-2xl border border-linea bg-white px-5 py-2.5 font-display text-[15px] font-semibold text-marino sombra-suave transition hover:bg-ambar-suave"
        >
          Ver todos los repuestos
        </Link>
      </div>
    </div>
  );
}
