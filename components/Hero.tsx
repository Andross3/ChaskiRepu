"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { PanelPieza } from "./PanelPieza";
import { zonasDe, type TipoVehiculo } from "@/lib/tipos";

const CarroTecnico3D = dynamic(() => import("./CarroTecnico3D"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-[15px] text-white/70">Preparando el vehículo en 3D...</div>
  ),
});

type Motor = "gasolina" | "hibrido" | "electrico";

const MARCAS: Record<TipoVehiculo, string[]> = {
  auto: ["Toyota", "Suzuki", "Nissan", "Hyundai", "Kia", "Honda", "Chevrolet", "Mazda", "Volkswagen"],
  moto: ["Yamaha", "Honda", "Suzuki", "Bajaj", "Zongshen", "TVS", "Kawasaki"],
};

const ANIOS = Array.from({ length: 32 }, (_, i) => 2026 - i);
const SUGERENCIAS = ["Pastillas de freno", "Filtro de aceite", "Batería", "Llantas", "Faro delantero"];

const campo =
  "mt-1.5 w-full rounded-xl border border-linea bg-white px-3.5 py-3 text-[15px] font-medium text-ink outline-none transition placeholder:text-ink-2/60 focus:border-azul focus:ring-4 focus:ring-azul/15";
const etiqueta = "block text-[12px] font-semibold uppercase tracking-wider text-ink-2";

export function Hero() {
  const [tipo, setTipo] = useState<TipoVehiculo>("auto");
  const [motor, setMotor] = useState<Motor>("gasolina");
  const [zona, setZona] = useState<string | null>(null);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [q, setQ] = useState("");
  const [pieza, setPieza] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");

  const zonas = zonasDe(tipo);
  const zonaActual = zonas.find((z) => z.id === zona);

  const params = new URLSearchParams({ tipo, motor });
  if (zona) params.set("zona", zona);
  if (marca) params.set("marca", marca);
  if (modelo.trim()) params.set("modelo", modelo.trim());
  if (anio) params.set("anio", anio);
  const hrefBase = `/buscar?${params.toString()}`;
  if (q.trim()) params.set("q", q.trim());

  function elegirZona(id: string | null) {
    setZona(id);
    if (pieza) setQ("");
    setPieza(null);
    setAviso("");
  }

  function elegirPieza(nombre: string | null) {
    setPieza(nombre);
    setQ(nombre ?? "");
  }

  function cambiarTipo(t: TipoVehiculo) {
    setTipo(t);
    setZona(null);
    setPieza(null);
    setQ("");
    setMarca("");
    setAviso("");
  }

  return (
    <section className="plano-tecnico relative text-white">
      <div className="mx-auto max-w-4xl px-4 pt-12 text-center sm:px-6 sm:pt-16">
        <p className="hero-1 inline-block rounded-full border border-white/25 bg-white/5 px-4 py-1.5 text-[13px] font-medium text-white/85">
          Repuestos para autos y motos · Bolivia
        </p>
        <h1 className="hero-2 mt-5 font-display text-[38px] font-semibold leading-[1.1] tracking-tight sm:text-[56px]">
          Encuentra el repuesto exacto, <span className="texto-brillo">sin recorrer la ciudad</span>
        </h1>
        <p className="hero-3 mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-white/75">
          Originales, alternativos, usados y restaurados. Toca la zona del vehículo, compara precios y reserva.
        </p>
      </div>

      <div className="hero-4 relative mx-auto mt-2 h-[340px] max-w-5xl sm:h-[440px] lg:h-[500px]">
        <CarroTecnico3D tipo={tipo} zonas={zonas} zonaId={zona} onZona={elegirZona} />

        {zonaActual && (
          <PanelPieza
            tipo={tipo}
            motor={motor}
            zona={zonaActual}
            pieza={pieza}
            onPieza={elegirPieza}
            onCerrar={() => elegirZona(null)}
            hrefBase={hrefBase}
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
                onClick={() => cambiarTipo(t)}
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
                onClick={() => setMotor(id)}
                aria-pressed={motor === id}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold backdrop-blur transition ${
                  motor === id
                    ? "border-cian bg-cian text-marino"
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
                onClick={() => elegirZona(null)}
                className="rounded-full border border-ambar/50 bg-ambar-suave px-3.5 py-1 text-[13px] font-semibold text-[#8a4300]"
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
              <select value={marca} onChange={(e) => setMarca(e.target.value)} className={campo}>
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
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder={tipo === "auto" ? "Ej. Swift" : "Ej. FZ 150"}
                className={campo}
              />
            </label>
            <label className={etiqueta}>
              Año
              <select value={anio} onChange={(e) => setAnio(e.target.value)} className={campo}>
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
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Describe la pieza o escribe su código. Ej. pastillas de freno delanteras"
              className={campo}
            />
          </label>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {SUGERENCIAS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQ(s)}
                className="rounded-full border border-linea bg-hielo px-3 py-1 text-[13px] font-medium text-ink-2 transition hover:border-azul/50 hover:text-marino"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/buscar?${params.toString()}`}
              className="flex-1 rounded-xl boton-primario px-6 py-3.5 text-center text-[16px] font-semibold sm:flex-none sm:px-10"
            >
              Buscar repuestos
            </Link>
            <button
              type="button"
              onClick={() => setAviso("Pronto: sube una foto y la IA te dirá exactamente qué pieza es.")}
              className="rounded-xl border border-linea bg-white px-6 py-3.5 text-[15px] font-semibold text-marino transition hover:border-azul/50 hover:bg-hielo"
            >
              Identificar con foto
            </button>
          </div>
          {aviso && (
            <p role="status" className="mt-3 rounded-xl bg-azul-suave px-4 py-2.5 text-[14px] font-medium text-marino-2">
              {aviso}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
