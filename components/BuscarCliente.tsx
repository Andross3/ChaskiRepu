"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { TarjetaRepuesto } from "./TarjetaRepuesto";
import { cargarRepuestos } from "@/lib/datos";
import { CONDICIONES, formatBs, zonasDe, type Repuesto, type TipoVehiculo } from "@/lib/tipos";

type Orden = "barato" | "caro" | "cercano";

const PALABRAS_VACIAS = new Set(["para", "con", "del", "los", "las", "una", "uno", "que", "por", "mi", "de", "el", "la", "en", "y"]);

const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Deja solo números de una medida de llanta: "195/65 R15" y "195/65R15" quedan iguales. */
const soloMedida = (s: string) => normalizar(s).replace(/[^0-9]/g, "");

/** Cuántas palabras de la búsqueda aparecen en el repuesto (sin tildes ni mayúsculas). */
function puntaje(r: Repuesto, q: string): number {
  const palabras = normalizar(q)
    .split(/[^a-z0-9]+/)
    .filter((p) => p.length >= 3 && !PALABRAS_VACIAS.has(p));
  if (palabras.length === 0) return 1;
  const texto = normalizar(
    [r.nombre, r.categoria, r.posicion ?? "", r.codigo ?? "", ...(r.sinonimos ?? []), ...(r.equivalencias ?? [])].join(" "),
  );
  return palabras.filter((p) => texto.includes(p.length > 5 ? p.slice(0, p.length - 1) : p)).length;
}

export function BuscarCliente() {
  const sp = useSearchParams();
  const tipoInicial = (sp.get("tipo") as TipoVehiculo | null) ?? null;
  const zonaInicial = sp.get("zona");
  const marca = sp.get("marca");
  const modelo = sp.get("modelo");
  const anio = sp.get("anio");
  const medida = sp.get("medida");
  const codMotor = sp.get("codmotor");

  const [items, setItems] = useState<Repuesto[] | null>(null);
  const [reales, setReales] = useState(0);
  const [error, setError] = useState<string | undefined>();

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [tipo, setTipo] = useState<"todos" | TipoVehiculo>(tipoInicial ?? "todos");
  const [zona, setZona] = useState<string | null>(zonaInicial);
  const [conds, setConds] = useState<string[]>([]);
  const [precioMax, setPrecioMax] = useState<number | null>(null);
  const [soloStock, setSoloStock] = useState(true);
  const [orden, setOrden] = useState<Orden>("barato");
  const [ejemplos, setEjemplos] = useState(true);

  useEffect(() => {
    let vivo = true;
    cargarRepuestos(true).then((r) => {
      if (!vivo) return;
      setItems(r.items);
      setReales(r.reales);
      setError(r.error);
    });
    return () => {
      vivo = false;
    };
  }, []);

  const tope = useMemo(
    () => Math.max(100, Math.ceil(Math.max(0, ...(items ?? []).map((i) => i.precio_bs)) / 100) * 100),
    [items],
  );
  const maxActual = precioMax ?? tope;

  const zonaInfo = useMemo(() => {
    if (!zona) return null;
    const base = tipo === "todos" ? "auto" : tipo;
    return zonasDe(base).find((z) => z.id === zona) ?? null;
  }, [zona, tipo]);

  const lista = useMemo(() => {
    const base = (items ?? []).filter((r) => {
      if (!ejemplos && r.ejemplo) return false;
      if (tipo !== "todos" && r.tipo_vehiculo !== tipo) return false;
      if (zonaInfo && !zonaInfo.categorias.some((c) => c.toLowerCase() === r.categoria.toLowerCase())) return false;
      if (medida && r.categoria.toLowerCase() === "llantas" && !soloMedida(r.nombre).includes(soloMedida(medida))) return false;
      if (conds.length && !conds.includes(r.condicion.toLowerCase())) return false;
      if (r.precio_bs > maxActual) return false;
      if (soloStock && r.stock <= 0) return false;
      return puntaje(r, q.trim()) > 0;
    });
    const texto = q.trim();
    return [...base].sort((a, b) => {
      if (texto) {
        const d = puntaje(b, texto) - puntaje(a, texto);
        if (d !== 0) return d;
      }
      return orden === "caro" ? b.precio_bs - a.precio_bs : a.precio_bs - b.precio_bs;
    });
  }, [items, ejemplos, tipo, zonaInfo, medida, conds, maxActual, soloStock, q, orden]);

  const alternar = (c: string) => setConds((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));
  const hayFiltros = conds.length > 0 || zona !== null || tipo !== "todos" || precioMax !== null || q !== "";
  const limpiar = () => {
    setConds([]);
    setZona(null);
    setTipo("todos");
    setPrecioMax(null);
    setQ("");
  };

  return (
    <div>
      <section className="plano-tecnico text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Buscar repuestos</h1>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(marca || modelo || anio || medida || codMotor) && (
              <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[14px] font-semibold text-white">
                {[marca, modelo, anio, codMotor && `motor ${codMotor}`, medida && `llanta ${medida}`].filter(Boolean).join(" · ")}
              </span>
            )}
            {tipoInicial && (
              <span className="rounded-full border-2 border-white/40 px-3 py-1.5 text-[13px] font-semibold">
                {tipoInicial === "moto" ? "Moto" : "Auto"}
              </span>
            )}
            <Link href="/" className="text-[13px] font-semibold text-ambar underline-offset-4 hover:underline">
              Cambiar vehículo
            </Link>
          </div>
          <div className="mt-5 flex max-w-2xl items-center gap-2 rounded-2xl border border-linea bg-white p-1.5 sombra-suave">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nombre, código o descripción: pastillas, batería, filtro..."
              aria-label="Buscar repuesto"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[16px] font-medium text-marino outline-none placeholder:text-ink-2"
            />
            <span className="rounded-xl boton-ambar px-4 py-2.5 text-[14px] font-semibold">Buscar</span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[290px_1fr]">
        <aside className="h-fit rounded-3xl border border-linea bg-white p-5 sombra-suave lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Filtros</h2>
            {hayFiltros && (
              <button type="button" onClick={limpiar} className="text-[13px] font-semibold text-rojo hover:underline">
                Limpiar
              </button>
            )}
          </div>

          <fieldset className="mt-4">
            <legend className="text-[12px] font-semibold uppercase tracking-wider text-ink-2">Vehículo</legend>
            <div className="mt-2 flex gap-1.5">
              {(["todos", "auto", "moto"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipo(t)}
                  aria-pressed={tipo === t}
                  className={`flex-1 rounded-xl border border-linea px-2 py-2 text-[14px] font-semibold transition ${
                    tipo === t ? "bg-ambar" : "bg-white hover:bg-ambar-suave"
                  }`}
                >
                  {t === "todos" ? "Todos" : t === "auto" ? "Auto" : "Moto"}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="text-[12px] font-semibold uppercase tracking-wider text-ink-2">Condición</legend>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["original", "alternativo", "usado", "restaurado"].map((c) => {
                const info = CONDICIONES[c];
                const activa = conds.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => alternar(c)}
                    aria-pressed={activa}
                    className="rounded-lg border border-linea px-3 py-1.5 text-[12px] font-semibold transition"
                    style={
                      activa
                        ? { background: info.bg, color: info.fg }
                        : { background: "#fff", color: "#0a1f3d" }
                    }
                  >
                    {info.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-5">
            <label htmlFor="precio" className="flex items-center justify-between text-[12px] font-semibold uppercase tracking-wider text-ink-2">
              Precio máximo
              <span className="rounded-lg bg-ambar-suave px-2 py-0.5 text-[13px] normal-case tracking-normal text-marino">
                {formatBs(maxActual)}
              </span>
            </label>
            <input
              id="precio"
              type="range"
              min={50}
              max={tope}
              step={50}
              value={maxActual}
              onChange={(e) => setPrecioMax(Number(e.target.value))}
              className="mt-3 w-full accent-azul"
            />
          </div>

          <div className="mt-5">
            <label htmlFor="orden" className="text-[12px] font-semibold uppercase tracking-wider text-ink-2">
              Ordenar por
            </label>
            <select
              id="orden"
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className="mt-2 w-full rounded-xl border border-linea bg-white px-3 py-2.5 text-[15px] font-semibold"
            >
              <option value="barato">Del más barato al más caro</option>
              <option value="caro">Del más caro al más barato</option>
            </select>
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-[15px] font-medium">
            <input type="checkbox" checked={soloStock} onChange={(e) => setSoloStock(e.target.checked)} className="h-5 w-5 accent-azul" />
            Solo con stock
          </label>
          <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[15px] font-medium">
            <input type="checkbox" checked={ejemplos} onChange={(e) => setEjemplos(e.target.checked)} className="h-5 w-5 accent-azul" />
            Mostrar datos de ejemplo
          </label>
        </aside>

        <section aria-live="polite">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-xl font-semibold">
              {items ? `${lista.length} repuestos hallados` : "Buscando..."}
            </p>
            {zonaInfo && (
              <button
                type="button"
                onClick={() => setZona(null)}
                className="rounded-full border border-linea bg-azul-suave px-3 py-1 text-[13px] font-semibold"
              >
                Zona: {zonaInfo.label} ✕
              </button>
            )}
          </div>
          {items && (
            <p className="mt-1 text-[13px] text-ink-2">
              {reales} reales de la base de datos{ejemplos ? " + ejemplos para ver el diseño" : ""}.
            </p>
          )}
          {error && (
            <p className="mt-3 rounded-xl border border-linea bg-rojo-suave px-4 py-2 text-[14px] font-semibold">
              No pudimos leer la base de datos: {error}
            </p>
          )}

          {!items ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-3xl border border-linea bg-white/60" />
              ))}
            </div>
          ) : lista.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-linea bg-white p-8 text-center sombra-suave">
              <p className="font-display text-2xl font-semibold">No encontramos ese repuesto todavía</p>
              <p className="mx-auto mt-2 max-w-md text-[16px] text-ink-2">
                Cuéntanos qué buscas y las tiendas te responderán cuando lo tengan.
              </p>
              <span className="mt-5 inline-block rounded-2xl boton-ambar px-6 py-3 text-[15px] font-semibold">
                Publicar mi búsqueda (pronto)
              </span>
            </div>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {lista.map((r, i) => (
                <TarjetaRepuesto key={r.id} r={r} indice={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
