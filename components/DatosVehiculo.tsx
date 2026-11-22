"use client";

import { CODIGOS_MOTOR_TOYOTA, MEDIDAS_LLANTA } from "@/lib/modelos";
import type { useBuscador } from "@/lib/useBuscador";

type Buscador = ReturnType<typeof useBuscador>;

const ESTILOS = {
  oscuro: {
    etiqueta: "block text-[11px] font-semibold uppercase tracking-wider text-white/65",
    campo:
      "mt-1.5 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-[14px] font-medium text-white outline-none transition placeholder:text-white/45 focus:border-ambar [&>option]:text-black [&_optgroup]:text-black",
    ayuda: "text-[12px] leading-snug text-white/65",
    resumen: "cursor-pointer text-[12px] font-semibold text-white/75 hover:text-white",
    chip: "rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[12px] font-semibold text-white/85 transition hover:border-white/60",
    chipOn: "border-ambar bg-ambar/20",
    caja: "rounded-xl border border-ambar/40 bg-ambar/10 p-3",
  },
  claro: {
    etiqueta: "block text-[12px] font-semibold uppercase tracking-wider text-ink-2",
    campo:
      "mt-1.5 w-full rounded-xl border border-linea bg-white px-3.5 py-3 text-[15px] font-medium text-ink outline-none transition placeholder:text-ink-2/60 focus:border-azul focus:ring-4 focus:ring-azul/15",
    ayuda: "text-[12px] leading-snug text-ink-2",
    resumen: "cursor-pointer text-[13px] font-semibold text-azul hover:underline",
    chip: "rounded-full border border-linea bg-hielo px-2.5 py-1 text-[12px] font-semibold text-ink-2 transition hover:border-azul/50",
    chipOn: "border-azul bg-azul-suave text-marino",
    caja: "rounded-xl border border-azul/30 bg-azul-suave/60 p-3",
  },
} as const;

/** Modelo, año, código de motor (opcional) y medida de llanta, según lo que se busca. */
export function DatosVehiculo({ b, claro = false }: { b: Buscador; claro?: boolean }) {
  const e = claro ? ESTILOS.claro : ESTILOS.oscuro;
  const grupos = Array.from(new Set(b.modelos.map((x) => x.grupo)));
  const modeloActual = b.modelos.find((x) => x.nombre === b.modelo);
  const medidas = b.tipo === "moto" ? MEDIDAS_LLANTA.filter((x) => !x.includes(" R")) : MEDIDAS_LLANTA.filter((x) => x.includes(" R"));
  const esToyota = b.tipo === "auto" && b.marca === "Toyota";

  return (
    <div className="space-y-2.5">
      <div className={`grid gap-2.5 ${claro ? "sm:grid-cols-2" : "grid-cols-2"}`}>
        <label className={e.etiqueta}>
          Modelo
          {b.modelos.length > 0 ? (
            <select value={b.modelo} onChange={(ev) => b.setModelo(ev.target.value)} className={e.campo}>
              <option value="">Elige el modelo</option>
              {grupos.map((g) => (
                <optgroup key={g} label={g}>
                  {b.modelos
                    .filter((x) => x.grupo === g)
                    .map((x) => (
                      <option key={x.nombre} value={x.nombre}>
                        {x.nombre}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          ) : (
            <input
              value={b.modelo}
              onChange={(ev) => b.setModelo(ev.target.value)}
              placeholder={b.marca ? "Escribe el modelo" : "Elige primero la marca"}
              className={e.campo}
            />
          )}
        </label>
        <label className={e.etiqueta}>
          Año
          <select value={b.anio} onChange={(ev) => b.setAnio(ev.target.value)} className={e.campo}>
            <option value="">Elige el año</option>
            {b.anios.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      </div>
      {modeloActual && (
        <p className={e.ayuda}>
          {modeloActual.nombre}: fabricado aprox. de {modeloActual.desde} a{" "}
          {modeloActual.hasta >= 2026 ? "hoy" : modeloActual.hasta}. Cada generación usa piezas distintas, por eso
          pedimos el año.
        </p>
      )}

      {b.mostrarMedida && (
        <div className={e.caja}>
          <label className={e.etiqueta}>
            Medida de la llanta
            <input
              value={b.medida}
              onChange={(ev) => b.setMedida(ev.target.value)}
              placeholder={b.tipo === "moto" ? "Ej. 90/90-18" : "Ej. 195/65 R15"}
              className={e.campo}
            />
          </label>
          <p className={`mt-1.5 ${e.ayuda}`}>Está escrita en el costado de tu llanta. Toca una medida común:</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {medidas.map((medida) => (
              <button
                key={medida}
                type="button"
                onClick={() => b.setMedida(b.medida === medida ? "" : medida)}
                aria-pressed={b.medida === medida}
                className={`${e.chip} ${b.medida === medida ? e.chipOn : ""}`}
              >
                {medida}
              </button>
            ))}
          </div>
        </div>
      )}

      <details>
        <summary className={e.resumen}>Más datos (opcional)</summary>
        <label className={`${e.etiqueta} mt-2`}>
          Código de motor
          <input
            value={b.codMotor}
            onChange={(ev) => b.setCodMotor(ev.target.value)}
            list={esToyota ? "codigos-motor-toyota" : undefined}
            placeholder={esToyota ? "Ej. 1NZ, 2KD, 1GR" : "Ej. el que figura en la tarjeta de propiedad"}
            className={e.campo}
          />
        </label>
        {esToyota && (
          <datalist id="codigos-motor-toyota">
            {CODIGOS_MOTOR_TOYOTA.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        )}
      </details>
    </div>
  );
}
