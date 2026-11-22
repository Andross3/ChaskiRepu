"use client";

import Image from "next/image";
import { LOGOS_MARCA } from "@/lib/marcas";

interface Props {
  marcas: string[];
  valor: string;
  onCambiar: (marca: string) => void;
  /** Fila más baja, para tarjetas pequeñas. */
  compacto?: boolean;
  /** Para fondos claros (tarjeta blanca). */
  claro?: boolean;
}

/** Fila de logos para elegir la marca con un toque, sin escribir ni abrir listas. */
export function SelectorMarca({ marcas, valor, onCambiar, compacto = false, claro = false }: Props) {
  return (
    <div role="group" aria-label="Marca del vehículo">
      <div className="flex items-center justify-between">
        <p className={`text-[11px] font-semibold uppercase tracking-wider ${claro ? "text-ink-2" : "text-white/65"}`}>Marca</p>
        {valor && (
          <button
            type="button"
            onClick={() => onCambiar("")}
            className={`text-[12px] font-semibold underline-offset-4 hover:underline ${claro ? "text-azul" : "text-white/80 hover:text-white"}`}
          >
            Quitar: {valor}
          </button>
        )}
      </div>
      <ul className="mt-2 flex snap-x gap-2 overflow-x-auto pb-1.5 [scrollbar-width:thin]">
        {marcas.map((m) => {
          const logo = LOGOS_MARCA[m];
          const activa = valor === m;
          return (
            <li key={m} className="shrink-0 snap-start">
              <button
                type="button"
                onClick={() => onCambiar(activa ? "" : m)}
                aria-pressed={activa}
                aria-label={m}
                title={m}
                className={`relative flex items-center justify-center rounded-xl bg-white transition ${
                  compacto ? "h-12 w-[74px]" : "h-14 w-[88px]"
                } ${
                  activa
                    ? `ring-[3px] ring-ambar ring-offset-2 ${claro ? "ring-offset-white" : "ring-offset-[#123566]"}`
                    : claro ? "ring-1 ring-linea hover:ring-azul/50" : "opacity-90 ring-1 ring-white/30 hover:opacity-100 hover:ring-white/70"
                }`}
              >
                {logo ? (
                  <Image src={logo} alt={m} width={176} height={112} className="h-full w-full object-contain p-1.5" />
                ) : (
                  <span className="px-1 text-center text-[12px] font-bold leading-tight text-marino">{m}</span>
                )}
                {activa && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ambar text-[11px] font-bold text-white">
                    ✓
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
