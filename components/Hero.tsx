"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { PanelPieza } from "./PanelPieza";
import { ANIOS, MARCAS, SUGERENCIAS, useBuscador } from "@/lib/useBuscador";

const CarroTecnico3D = dynamic(() => import("./CarroTecnico3D"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-[15px] text-white/70">Preparando el vehículo en 3D...</div>
  ),
});

const campo =
  "mt-1.5 w-full rounded-xl border border-linea bg-white px-3.5 py-3 text-[15px] font-medium text-ink outline-none transition placeholder:text-ink-2/60 focus:border-azul focus:ring-4 focus:ring-azul/15";
const etiqueta = "block text-[12px] font-semibold uppercase tracking-wider text-ink-2";

/** Versión grande para quien ya entró a comprar: el auto al centro y el buscador abajo. */
export function Hero({ saludo, titulo }: { saludo: string; titulo: string }) {
  const b = useBuscador();
  const { tipo, zonas, zonaActual } = b;

  return (
    <section className="plano-tecnico relative text-white">
      <div className="mx-auto max-w-4xl px-4 pt-12 text-center sm:px-6 sm:pt-14">
        <p className="hero-1 inline-block rounded-full border border-white/25 bg-white/5 px-4 py-1.5 text-[13px] font-medium text-white/85">
          {saludo}
        </p>
        <h1 className="hero-2 mt-5 font-display text-[38px] font-semibold leading-[1.1] tracking-tight sm:text-[52px]">
          {titulo}
        </h1>
        <p className="hero-3 mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-white/75">
          Toca la zona del vehículo, elige la pieza, compara precios y reserva.
        </p>
      </div>

      <div className="hero-4 relative mx-auto mt-2 h-[340px] max-w-5xl sm:h-[440px] lg:h-[500px]">
        <CarroTecnico3D tipo={tipo} zonas={zonas} zonaId={b.zona} onZona={b.elegirZona} />

        {zonaActual && (
          <PanelPieza
            tipo={tipo}
            motor={b.motor}
            zona={zonaActual}
            pieza={b.pieza}
            onPieza={b.elegirPieza}
            onCerrar={() => b.elegirZona(null)}
            hrefBase={b.hrefBase}
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-2 flex flex-wrap items-start justify-between gap-3 px-4 sm:px-6">
          <div
            className="pointer-events-auto inline-flex rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur"
            role="group"
            aria-label="Tipo de vehículo"
          >
            {(["auto", "moto"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => b.cambiarTipo(t)}
                aria-pressed={tipo === t}
                className={`rounded-lg px-5 py-2 text-[14px] font-semibold transition ${
                  tipo === t ? "bg-white text-marino" : "text-white/80 hover:text-white"
                }`}
              >
                {t === "auto" ? "Auto" : "Moto"}
              </button>
            ))}
          </div>
          <div className="pointer-events-auto flex flex-wrap gap-1.5" role="group" aria-label="Tipo de motor">
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
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold backdrop-blur transition ${
                  b.motor === id
                    ? "border-azul bg-azul text-white"
                    : "border-white/25 bg-white/5 text-white/85 hover:border-white/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[13px] text-white/60">
          Arrastra para girar · Toca un punto para elegir la zona
        </p>
      </div>

      <div className="relative mx-auto -mb-28 max-w-5xl px-4 pb-0 sm:px-6">
        <div className="rounded-3xl border border-linea bg-white p-5 text-ink sombra-alta sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-[22px] font-semibold text-marino">Busca tu repuesto</h2>
            {zonaActual ? (
              <button
                type="button"
                onClick={() => b.elegirZona(null)}
                className="rounded-full border border-ambar/50 bg-ambar-suave px-3.5 py-1 text-[13px] font-semibold text-marino-2"
              >
                Zona: {zonaActual.label} ✕
              </button>
            ) : (
              <span className="text-[13px] text-ink-2">Elige una zona en el vehículo o escribe lo que buscas</span>
            )}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className={etiqueta}>
              Marca
              <select value={b.marca} onChange={(e) => b.setMarca(e.target.value)} className={campo}>
                <option value="">Elige la marca</option>
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
                <option value="">Elige el año</option>
                {ANIOS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className={`${etiqueta} mt-4`}>
            ¿Qué repuesto necesitas?
            <input
              value={b.q}
              onChange={(e) => b.setQ(e.target.value)}
              placeholder="Describe la pieza o escribe su código. Ej. pastillas de freno delanteras"
              className={campo}
            />
          </label>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {SUGERENCIAS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => b.setQ(s)}
                className="rounded-full border border-linea bg-hielo px-3 py-1 text-[13px] font-medium text-ink-2 transition hover:border-azul/50 hover:text-marino"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={b.href}
              className="flex-1 rounded-xl boton-primario px-6 py-3.5 text-center text-[16px] font-semibold sm:flex-none sm:px-10"
            >
              Buscar repuestos
            </Link>
            <button
              type="button"
              onClick={() => b.setAviso("Elige una zona en el auto y sube la foto desde el panel de piezas.")}
              className="rounded-xl border border-linea bg-white px-6 py-3.5 text-[15px] font-semibold text-marino transition hover:border-azul/50 hover:bg-hielo"
            >
              Identificar con foto
            </button>
          </div>
          {b.aviso && (
            <p role="status" className="mt-3 rounded-xl bg-azul-suave px-4 py-2.5 text-[14px] font-medium text-marino-2">
              {b.aviso}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
