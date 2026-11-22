"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { piezasDe } from "@/lib/piezas";
import type { TipoVehiculo, Zona } from "@/lib/tipos";

interface Props {
  tipo: TipoVehiculo;
  motor: "gasolina" | "hibrido" | "electrico";
  zona: Zona;
  pieza: string | null;
  onPieza: (nombre: string | null) => void;
  onCerrar: () => void;
  /** Dirección de búsqueda sin el texto, para sumarle la pieza o la descripción. */
  hrefBase: string;
}

export function PanelPieza({ tipo, motor, zona, pieza, onPieza, onCerrar, hrefBase }: Props) {
  const piezas = piezasDe(tipo, zona.id, motor);
  const elegida = piezas.find((p) => p.nombre === pieza);

  const [modoFoto, setModoFoto] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);
  const [nota, setNota] = useState("");
  const fotoActual = useRef<string | null>(null);

  useEffect(() => {
    fotoActual.current = foto;
  }, [foto]);

  useEffect(
    () => () => {
      if (fotoActual.current) URL.revokeObjectURL(fotoActual.current);
    },
    [],
  );

  function alElegirFoto(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    if (foto) URL.revokeObjectURL(foto);
    setFoto(URL.createObjectURL(archivo));
  }

  const conTexto = (texto: string) => (texto ? `${hrefBase}&q=${encodeURIComponent(texto)}` : hrefBase);

  return (
    <aside
      aria-label={`Piezas de la zona ${zona.label}`}
      className="vidrio aparecer pointer-events-auto absolute bottom-10 right-3 top-14 flex w-[290px] flex-col rounded-2xl p-4 text-white sm:right-5"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-cian">Zona elegida</p>
          <h3 className="font-display text-[22px] font-semibold leading-tight">{zona.label}</h3>
        </div>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Quitar la zona"
          className="rounded-lg border border-white/25 px-2 py-1 text-[13px] text-white/80 transition hover:bg-white/10"
        >
          ✕
        </button>
      </div>

      {modoFoto ? (
        <div className="mt-3 flex flex-1 flex-col overflow-y-auto pr-1">
          <p className="text-[13px] text-white/75">Sube una foto de la pieza o de la parte que falla.</p>

          <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/40 bg-white/5 px-3 py-4 text-center transition hover:bg-white/10">
            {foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={foto} alt="Foto de la pieza que subiste" className="h-24 w-full rounded-lg object-cover" />
            ) : (
              <span className="text-[13px] font-semibold text-white/90">Toca para elegir una foto</span>
            )}
            <span className="mt-2 text-[12px] text-white/60">{foto ? "Toca para cambiarla" : "JPG o PNG"}</span>
            <input type="file" accept="image/*" onChange={alElegirFoto} className="sr-only" />
          </label>

          <label className="mt-3 block text-[12px] font-semibold uppercase tracking-wider text-white/70">
            ¿Qué ves o qué le pasa?
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              rows={2}
              placeholder="Ej. el plástico de atrás de la llanta está roto"
              className="mt-1.5 w-full resize-none rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-[14px] font-normal normal-case tracking-normal text-white outline-none placeholder:text-white/45 focus:border-ambar"
            />
          </label>

          <p className="mt-2 text-[12px] leading-snug text-white/60">
            La IA que reconoce la pieza por foto se conectará pronto. Por ahora buscamos con tu descripción y la zona.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-2 text-[13px] text-white/70">
            ¿Cuál es la pieza? Toca la que se parezca a lo que buscas. ¿Esta no es la zona? Toca otro punto del auto.
          </p>
          <ul className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
            {piezas.map((p) => {
              const activa = pieza === p.nombre;
              return (
                <li key={p.nombre}>
                  <button
                    type="button"
                    onClick={() => onPieza(activa ? null : p.nombre)}
                    aria-pressed={activa}
                    className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                      activa
                        ? "border-ambar bg-ambar/20"
                        : "border-white/15 bg-white/5 hover:border-white/40 hover:bg-white/10"
                    }`}
                  >
                    <span className="block text-[14px] font-semibold">{p.nombre}</span>
                    {activa && <span className="mt-0.5 block text-[12px] leading-snug text-white/75">{p.pista}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <div className="mt-3 space-y-2">
        <Link
          href={conTexto(modoFoto ? nota.trim() : (elegida?.nombre ?? ""))}
          className="boton-ambar block rounded-xl px-4 py-2.5 text-center text-[14px] font-semibold"
        >
          {modoFoto
            ? "Buscar con mi descripción"
            : elegida
              ? `Buscar ${elegida.nombre.toLowerCase()}`
              : `Ver repuestos de ${zona.label.toLowerCase()}`}
        </Link>
        <button
          type="button"
          onClick={() => setModoFoto(!modoFoto)}
          className="w-full rounded-xl border border-white/25 px-4 py-2 text-[13px] font-semibold text-white/90 transition hover:bg-white/10"
        >
          {modoFoto ? "Volver a las piezas" : "No sé cuál es: subir una foto"}
        </button>
      </div>
    </aside>
  );
}
