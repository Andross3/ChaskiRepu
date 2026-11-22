"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { ResultadoIA } from "@/lib/ia";
import { reducirImagen } from "@/lib/imagen";
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
  /** Versión horizontal para tarjetas pequeñas: va abajo del visor, no a un lado. */
  compacto?: boolean;
}

export function PanelPieza({ tipo, motor, zona, pieza, onPieza, onCerrar, hrefBase, compacto = false }: Props) {
  const piezas = piezasDe(tipo, zona.id, motor);
  const elegida = piezas.find((p) => p.nombre === pieza);

  const [modoFoto, setModoFoto] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);
  const [nota, setNota] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const router = useRouter();
  const [analizando, setAnalizando] = useState(false);
  const [redirigiendo, setRedirigiendo] = useState(false);
  const [resultadoIA, setResultadoIA] = useState<ResultadoIA | null>(null);
  const [errorIA, setErrorIA] = useState("");
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
    const elegido = e.target.files?.[0];
    if (!elegido) return;
    if (foto) URL.revokeObjectURL(foto);
    setFoto(URL.createObjectURL(elegido));
    setArchivo(elegido);
    setResultadoIA(null);
    setErrorIA("");
  }

  /** Envía la foto (reducida) al servidor, que consulta la IA. La clave nunca llega al navegador. */
  async function identificar() {
    if (!archivo || analizando) return;
    setAnalizando(true);
    setErrorIA("");
    setResultadoIA(null);
    try {
      const imagen = await reducirImagen(archivo);
      const r = await fetch("/api/identificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagen, nota: nota.trim(), tipo, zona: zona.id, motor }),
      });
      const datos = (await r.json().catch(() => ({}))) as Partial<ResultadoIA> & { error?: string };
      if (!r.ok) throw new Error(datos.error ?? "No pudimos identificar la pieza.");
      const resultado = datos as ResultadoIA;
      setResultadoIA(resultado);
      // Con una pieza identificada se pasa directo a los repuestos de esa pieza.
      if (resultado.estado === "identificada" && resultado.pieza) {
        setRedirigiendo(true);
        router.push(`${conTexto(resultado.pieza)}&pieza=${encodeURIComponent(resultado.pieza)}`);
      }
    } catch (e) {
      setErrorIA(e instanceof Error ? e.message : "No pudimos identificar la pieza. Busca con una descripción.");
    } finally {
      setAnalizando(false);
    }
  }

  const conTexto = (texto: string) => (texto ? `${hrefBase}&q=${encodeURIComponent(texto)}` : hrefBase);
  // Con una pieza elegida se envía también `pieza`, para que /buscar muestre solo esa pieza y no toda la zona.
  const piezaIA = resultadoIA?.estado === "identificada" ? resultadoIA.pieza : null;
  const enlaceDeBusqueda = modoFoto
    ? piezaIA
      ? `${conTexto(piezaIA)}&pieza=${encodeURIComponent(piezaIA)}`
      : conTexto(nota.trim())
    : elegida ? `${conTexto(elegida.nombre)}&pieza=${encodeURIComponent(elegida.nombre)}` : hrefBase;

  const contenedor = compacto
    ? "vidrio aparecer pointer-events-auto absolute inset-x-3 bottom-3 flex max-h-[88%] flex-col rounded-2xl p-3.5 text-white"
    : "vidrio aparecer pointer-events-auto absolute bottom-10 right-3 top-14 flex w-[290px] flex-col rounded-2xl p-4 text-white sm:right-5";

  return (
    <aside aria-label={`Piezas de la zona ${zona.label}`} className={contenedor}>
      <div className="flex items-start justify-between gap-2">
        <div className={compacto ? "flex items-baseline gap-2" : ""}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-cian">Zona elegida</p>
          <h3 className={`font-display font-semibold leading-tight ${compacto ? "text-[18px]" : "text-[22px]"}`}>
            {zona.label}
          </h3>
        </div>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Quitar la zona"
          className="rounded-lg border border-white/25 px-2 py-0.5 text-[13px] text-white/80 transition hover:bg-white/10"
        >
          ✕
        </button>
      </div>

      {modoFoto ? (
        <div className="mt-2 flex flex-1 flex-col overflow-y-auto pr-1">
          <div className={compacto ? "grid gap-3 sm:grid-cols-2" : ""}>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/40 bg-white/5 px-3 py-3 text-center transition hover:bg-white/10">
              {foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={foto} alt="Foto de la pieza que subiste" className="h-14 w-full rounded-lg object-cover" />
              ) : (
                <span className="text-[13px] font-semibold text-white/90">Toca para elegir una foto</span>
              )}
              <span className="mt-1.5 text-[12px] text-white/60">{foto ? "Toca para cambiarla" : "JPG o PNG"}</span>
              <input type="file" accept="image/*" onChange={alElegirFoto} className="sr-only" />
            </label>

            <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/70">
              ¿Qué ves o qué le pasa?
              <textarea
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                rows={compacto ? 3 : 2}
                placeholder="Ej. el plástico de atrás de la llanta está roto"
                className="mt-1.5 w-full resize-none rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-[14px] font-normal normal-case tracking-normal text-white outline-none placeholder:text-white/45 focus:border-ambar"
              />
            </label>
          </div>
        </div>
      ) : (
        <>
          {!compacto && (
            <p className="mt-2 text-[13px] text-white/70">
              ¿Cuál es la pieza? Toca la que se parezca a lo que buscas. ¿Esta no es la zona? Toca otro punto del auto.
            </p>
          )}
          <ul className={`mt-2.5 flex-1 overflow-y-auto pr-1 ${compacto ? "flex flex-wrap gap-2" : "space-y-2"}`}>
            {piezas.map((p) => {
              const activa = pieza === p.nombre;
              return (
                <li key={p.nombre} className={compacto ? "" : "block"}>
                  <button
                    type="button"
                    onClick={() => onPieza(activa ? null : p.nombre)}
                    aria-pressed={activa}
                    className={`rounded-xl border px-3 py-2 text-left transition ${compacto ? "" : "w-full"} ${
                      activa
                        ? "border-ambar bg-ambar/20"
                        : "border-white/15 bg-white/5 hover:border-white/40 hover:bg-white/10"
                    }`}
                  >
                    <span className="block text-[14px] font-semibold">{p.nombre}</span>
                    {activa && !compacto && (
                      <span className="mt-0.5 block text-[12px] leading-snug text-white/75">{p.pista}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          {compacto && elegida && <p className="mt-2 text-[12px] leading-snug text-white/75">{elegida.pista}</p>}
        </>
      )}

      {/* Identificación con IA: fuera del área con scroll, para que el botón y el resultado siempre se vean. */}
      {modoFoto && (
        <div className="mt-2 space-y-2">
          <button
            type="button"
            onClick={identificar}
            disabled={!archivo || analizando || redirigiendo}
            className="w-full rounded-xl border border-cian/60 bg-cian/15 px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-cian/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {analizando
              ? "Analizando la foto..."
              : redirigiendo
                ? "Buscando los repuestos..."
                : archivo
                  ? "Identificar la pieza y buscarla con IA"
                  : "Elige una foto para identificarla con IA"}
          </button>

          {resultadoIA && (
            <div role="status" className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-[13px] leading-snug">
              {resultadoIA.estado === "identificada" ? (
                <>
                  <p className="text-[15px] font-semibold">
                    Parece: {resultadoIA.pieza}{" "}
                    <span className="text-[12px] font-medium text-white/70">(confianza {resultadoIA.confianza})</span>
                  </p>
                  {resultadoIA.motivo && <p className="mt-0.5 text-white/75">{resultadoIA.motivo}</p>}
                  {resultadoIA.aviso && <p className="mt-1 font-semibold text-ambar">{resultadoIA.aviso}</p>}
                </>
              ) : (
                <>
                  <p className="text-[15px] font-semibold">No estoy seguro de qué pieza es.</p>
                  <p className="mt-0.5 text-white/75">
                    Revisa que la zona elegida ({zona.label.toLowerCase()}) sea la correcta, prueba con otra foto más cercana o
                    describe qué ves.
                  </p>
                </>
              )}
            </div>
          )}
          {errorIA && (
            <p role="alert" className="rounded-xl border border-rojo/40 bg-rojo/15 px-3 py-2 text-[13px] font-medium">
              {errorIA}
            </p>
          )}
          <p className="text-[11px] leading-snug text-white/55">
            La IA solo identifica la pieza, no indica reparaciones y puede equivocarse. La foto no se guarda en ChaskiRepu.
          </p>
        </div>
      )}

      <div className={`mt-2.5 gap-2 ${compacto ? "flex flex-wrap" : "space-y-2"}`}>
        <Link
          href={enlaceDeBusqueda}
          className={`boton-ambar block rounded-xl px-4 py-2.5 text-center text-[14px] font-semibold ${compacto ? "flex-1" : ""}`}
        >
          {modoFoto
            ? piezaIA
              ? `Buscar ${piezaIA.toLowerCase()}`
              : nota.trim()
                ? "Buscar con mi descripción"
                : `Ver repuestos de ${zona.label.toLowerCase()}`
            : elegida
              ? `Buscar ${elegida.nombre.toLowerCase()}`
              : `Ver repuestos de ${zona.label.toLowerCase()}`}
        </Link>
        <button
          type="button"
          onClick={() => setModoFoto(!modoFoto)}
          className={`rounded-xl border border-white/25 px-4 py-2 text-[13px] font-semibold text-white/90 transition hover:bg-white/10 ${compacto ? "" : "w-full"}`}
        >
          {modoFoto ? "Volver a las piezas" : "No sé cuál es: subir una foto"}
        </button>
      </div>
    </aside>
  );
}
