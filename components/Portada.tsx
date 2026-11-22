"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { PanelPieza } from "./PanelPieza";
import { ANIOS, MARCAS, useBuscador } from "@/lib/useBuscador";

const CarroTecnico3D = dynamic(() => import("./CarroTecnico3D"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-[14px] text-white/70">Preparando el vehículo en 3D...</div>
  ),
});

const campo =
  "mt-1.5 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-[14px] font-medium text-white outline-none transition placeholder:text-white/45 focus:border-ambar [&>option]:text-black";
const etiqueta = "block text-[11px] font-semibold uppercase tracking-wider text-white/65";

const CONDICIONES = [
  ["Original", "#6ee7a8"],
  ["Alternativo", "#7cc4ff"],
  ["Usado", "#ffc266"],
  ["Restaurado", "#ff8fb3"],
] as const;

/** Primera pantalla pública: texto a la izquierda y el auto con el buscador a la derecha. */
export function Portada() {
  const b = useBuscador();
  const { tipo, zonas, zonaActual } = b;

  return (
    <section className="plano-tecnico relative overflow-hidden text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.08fr] lg:py-20">
        <div>
          <p className="hero-1 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[13px] font-medium text-white/85">
            <span className="text-ambar" aria-hidden="true">
              ⚡
            </span>
            Marketplace de repuestos · Bolivia
          </p>
          <h1 className="hero-2 mt-6 font-display text-[44px] font-semibold leading-[1.05] tracking-tight sm:text-[64px]">
            Tu repuesto,
            <span className="mt-3 block w-fit rounded-2xl border border-ambar/60 bg-ambar/10 px-4 py-1 text-ambar">
              sin dar vueltas
            </span>
          </h1>
          <p className="hero-3 mt-6 max-w-md text-[17px] leading-relaxed text-white/75">
            Encuentra repuestos originales, alternativos, usados y restaurados para tu auto o moto. Compara, reserva y
            recíbelo al instante.
          </p>
          <div className="hero-3 mt-8 flex flex-wrap gap-3">
            <Link
              href="/entrar?rol=usuario"
              className="rounded-xl boton-primario px-7 py-3.5 text-[16px] font-semibold"
            >
              Buscar un repuesto
            </Link>
            <Link
              href="/entrar?rol=tienda"
              className="vidrio rounded-xl px-7 py-3.5 text-[16px] font-semibold text-white transition hover:bg-white/15"
            >
              Tengo una tienda
            </Link>
          </div>
          <ul className="hero-4 mt-8 flex flex-wrap gap-2" aria-label="Tipos de repuesto">
            {CONDICIONES.map(([nombre, color]) => (
              <li
                key={nombre}
                className="vidrio inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[12px] font-semibold uppercase tracking-wide text-white/85"
              >
                <span className="h-2 w-2 rounded-full" style={{ background: color }} aria-hidden="true" />
                {nombre}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-4 vidrio rounded-[1.75rem] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div
              className="inline-flex rounded-xl border border-white/15 bg-white/10 p-1"
              role="group"
              aria-label="Tipo de vehículo"
            >
              {(["auto", "moto"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => b.cambiarTipo(t)}
                  aria-pressed={tipo === t}
                  className={`rounded-lg px-4 py-1.5 text-[13px] font-semibold transition ${
                    tipo === t ? "bg-ambar text-marino" : "text-white/80 hover:text-white"
                  }`}
                >
                  {t === "auto" ? "Auto" : "Moto"}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Tipo de motor">
              {(
                [
                  ["gasolina", "Gasolina"],
                  ["hibrido", "Híbrido"],
                  ["electrico", "Eléctrico"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => b.setMotor(id)}
                  aria-pressed={b.motor === id}
                  className={`rounded-full border px-3 py-1 text-[12px] font-semibold transition ${
                    b.motor === id
                      ? "border-cian bg-cian text-marino"
                      : "border-white/20 text-white/80 hover:border-white/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={`relative mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/20 transition-all duration-500 ${zonaActual ? "h-[420px]" : "h-[270px] sm:h-[310px]"}`}>
            <CarroTecnico3D tipo={tipo} zonas={zonas} zonaId={b.zona} onZona={b.elegirZona} panelAbajo />
            {!zonaActual && (
              <p className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-white/85">
                Toca una zona del vehículo para buscar
              </p>
            )}
            {zonaActual && (
              <PanelPieza
                compacto
                tipo={tipo}
                motor={b.motor}
                zona={zonaActual}
                pieza={b.pieza}
                onPieza={b.elegirPieza}
                onCerrar={() => b.elegirZona(null)}
                hrefBase={b.hrefBase}
              />
            )}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2.5">
            <label className={etiqueta}>
              Marca
              <select value={b.marca} onChange={(e) => b.setMarca(e.target.value)} className={campo}>
                <option value="">Elige</option>
                {MARCAS[tipo].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className={etiqueta}>
              Modelo
              <input
                value={b.modelo}
                onChange={(e) => b.setModelo(e.target.value)}
                placeholder={tipo === "auto" ? "Ej. Swift" : "Ej. FZ 150"}
                className={campo}
              />
            </label>
            <label className={etiqueta}>
              Año
              <select value={b.anio} onChange={(e) => b.setAnio(e.target.value)} className={campo}>
                <option value="">Elige</option>
                {ANIOS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-3 flex flex-wrap gap-2.5">
            <Link
              href={b.href}
              className="flex-1 rounded-xl boton-primario px-6 py-3 text-center text-[15px] font-semibold"
            >
              Buscar repuestos
            </Link>
            <button
              type="button"
              onClick={() => b.setAviso("Toca una zona del auto y sube la foto desde el panel de piezas.")}
              className="rounded-xl border border-white/25 px-5 py-3 text-[14px] font-semibold text-white/90 transition hover:bg-white/10"
            >
              Identificar con foto
            </button>
          </div>
          {b.aviso && (
            <p role="status" className="mt-3 rounded-xl bg-white/10 px-4 py-2 text-[13px] font-medium text-white/90">
              {b.aviso}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
