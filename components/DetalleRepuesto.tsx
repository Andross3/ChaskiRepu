"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Chip, EtiquetaCondicion } from "./Etiqueta";
import { Ilustracion } from "./Ilustracion";
import { fondoPor } from "./TarjetaRepuesto";
import { cargarRepuestos } from "@/lib/datos";
import { distanciaKm, textoDistancia, UBICACION_BASE } from "@/lib/geo";
import { COMISION_RESERVA_BS, condicionInfo, formatBs, type Repuesto } from "@/lib/tipos";

type Paso = "ver" | "entrega" | "pago" | "listo";

function hash(s: string): number {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return h;
}

function QRDemo({ semilla }: { semilla: string }) {
  const n = 21;
  let s = hash(semilla) || 1;
  const celdas: [number, number][] = [];
  const buscador = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (buscador(x, y)) continue;
      s = (s * 1664525 + 1013904223) >>> 0;
      if ((s >>> 16) % 2 === 0) celdas.push([x, y]);
    }
  }
  const ojo = (ox: number, oy: number) => (
    <g key={`${ox}-${oy}`}>
      <rect x={ox} y={oy} width="7" height="7" fill="#1a1340" />
      <rect x={ox + 1} y={oy + 1} width="5" height="5" fill="#fff" />
      <rect x={ox + 2} y={oy + 2} width="3" height="3" fill="#1a1340" />
    </g>
  );
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} className="mx-auto h-44 w-44 rounded-xl border border-linea bg-white" role="img" aria-label="Código QR de ejemplo">
      {celdas.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#1a1340" />
      ))}
      {ojo(0, 0)}
      {ojo(n - 7, 0)}
      {ojo(0, n - 7)}
    </svg>
  );
}

function Moto() {
  return (
    <svg viewBox="0 0 120 64" className="h-14 w-24" aria-hidden="true">
      <g stroke="#1a1340" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="26" cy="46" r="12" fill="#1a1340" />
        <circle cx="26" cy="46" r="5" fill="#ffeedd" />
        <circle cx="94" cy="46" r="12" fill="#1a1340" />
        <circle cx="94" cy="46" r="5" fill="#ffeedd" />
        <path d="M26 46L50 30H78L94 46" fill="none" strokeWidth="4" />
        <path d="M44 30C48 20 68 18 78 26L74 34H48Z" fill="#7a5cff" />
        <path d="M78 26L86 14H98" fill="none" />
        <rect x="14" y="14" width="26" height="18" rx="3" fill="#ffeedd" />
        <path d="M6 22h6M4 28h8" stroke="#ff8a1f" />
      </g>
    </svg>
  );
}

export function DetalleRepuesto() {
  const id = useSearchParams().get("id");
  const [r, setR] = useState<Repuesto | null | undefined>(undefined);
  const [paso, setPaso] = useState<Paso>("ver");
  const [modo, setModo] = useState<"recoger" | "envio">("recoger");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errorForm, setErrorForm] = useState("");

  useEffect(() => {
    let vivo = true;
    cargarRepuestos(true).then((res) => {
      if (vivo) setR(res.items.find((i) => i.id === id) ?? null);
    });
    return () => {
      vivo = false;
    };
  }, [id]);

  const codigo = useMemo(() => (r ? `CR-${(hash(r.id) % 9000) + 1000}` : ""), [r]);

  if (r === undefined) {
    return <div className="mx-auto max-w-6xl px-6 py-16 font-display text-xl font-semibold">Cargando repuesto...</div>;
  }
  if (r === null) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="font-display text-3xl font-semibold">No encontramos este repuesto</p>
        <Link href="/buscar" className="mt-6 inline-block rounded-2xl boton-ambar px-6 py-3 font-semibold">
          Volver a buscar
        </Link>
      </div>
    );
  }

  const p = r.proveedores;
  const km = p ? distanciaKm(UBICACION_BASE, p) : null;
  const cond = condicionInfo(r.condicion);
  const mapaUrl = p?.lat != null && p?.lng != null ? `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}` : null;
  const wa = p?.whatsapp
    ? `https://wa.me/591${p.whatsapp}?text=${encodeURIComponent(`Hola, vi "${r.nombre}" en ChaskiRepu y quiero consultar.`)}`
    : null;
  const agotado = r.stock <= 0;

  function continuarEntrega() {
    if (!nombre.trim() || !telefono.trim()) {
      setErrorForm("Escribe tu nombre y tu teléfono para reservar.");
      return;
    }
    if (modo === "envio" && !direccion.trim()) {
      setErrorForm("Escribe la dirección donde quieres recibirlo.");
      return;
    }
    setErrorForm("");
    setPaso("pago");
  }

  const pasos: [Paso, string][] = [
    ["entrega", "Entrega"],
    ["pago", "Pago"],
    ["listo", "Listo"],
  ];
  const idxPaso = paso === "ver" ? -1 : pasos.findIndex(([k]) => k === paso);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link href="/buscar" className="text-[14px] font-semibold text-marino underline-offset-4 hover:underline">
        ← Volver a resultados
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <div
            className="relative flex h-72 items-center justify-center rounded-[2rem] border border-linea sombra-alta"
            style={{ background: fondoPor(r.id) }}
          >
            <EtiquetaCondicion condicion={r.condicion} className="absolute left-4 top-4" />
            {r.ejemplo && (
              <span className="absolute right-4 top-4 rounded-lg border border-linea bg-white px-2.5 py-1 text-[11px] font-semibold">
                EJEMPLO
              </span>
            )}
            <Ilustracion categoria={r.categoria} className="flotar h-56 w-72" />
          </div>

          <h1 className="mt-7 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{r.nombre}</h1>
          <p className="mt-2 text-[16px] text-ink-2">{cond.desc}</p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <p className="inline-block text-5xl font-bold tracking-tight text-marino">
              {formatBs(r.precio_bs)}
            </p>
            <Chip tono={agotado ? "rojo" : "verde"} className="!text-[13px] !px-3 !py-1">
              {agotado ? "Agotado" : r.stock <= 3 ? `Quedan ${r.stock}` : `${r.stock} disponibles`}
            </Chip>
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ["Categoría", r.categoria],
              ["Posición", r.posicion ?? "Sin definir"],
              ["Vehículo", r.tipo_vehiculo === "moto" ? "Moto" : "Auto"],
              ["Código", r.codigo ?? "Sin código"],
              ["Equivalencias", r.equivalencias?.length ? r.equivalencias.join(", ") : "Sin registrar"],
              ["Compatibilidad", "Por confirmar con el vendedor"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-linea bg-white px-4 py-3">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-2">{k}</dt>
                <dd className="mt-0.5 text-[15px] font-semibold">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 overflow-hidden rounded-3xl border border-linea bg-white sombra-suave">
            <div
              className="relative h-40 border-b-2 border-linea"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent 0 31px, rgba(11,42,74,0.1) 31px 32px), repeating-linear-gradient(90deg, transparent 0 31px, rgba(11,42,74,0.1) 31px 32px), #efeafc",
              }}
            >
              <svg viewBox="0 0 60 80" className="absolute left-1/2 top-1/2 h-16 w-12 -translate-x-1/2 -translate-y-[85%]" aria-hidden="true">
                <path d="M30 76C14 52 6 42 6 28a24 24 0 0148 0c0 14-8 24-24 48z" fill="#ff8a1f" stroke="#1a1340" strokeWidth="4" />
                <circle cx="30" cy="28" r="9" fill="#fff4e0" stroke="#1a1340" strokeWidth="4" />
              </svg>
              <span className="absolute bottom-3 left-3 rounded-lg border border-linea bg-white px-2.5 py-1 text-[12px] font-semibold">
                Mapa de ejemplo
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-display text-lg font-semibold">{p?.nombre ?? "Tienda por confirmar"}</p>
                <p className="text-[14px] text-ink-2">{p?.direccion ?? "Dirección por confirmar"}</p>
                <p className="mt-0.5 text-[13px] font-semibold text-ambar-fuerte">{textoDistancia(km)} de ti</p>
              </div>
              <div className="flex gap-2">
                {mapaUrl && (
                  <a
                    href={mapaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-linea bg-azul-suave px-4 py-2 text-[14px] font-semibold sombra-suave transition hover:-translate-y-0.5"
                  >
                    Cómo llegar
                  </a>
                )}
                {wa && (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-linea bg-white px-4 py-2 text-[14px] font-semibold transition hover:bg-ambar-suave"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-[2rem] border border-linea bg-white p-6 sombra-alta lg:sticky lg:top-24">
          {paso !== "ver" && (
            <ol className="mb-5 flex items-center gap-2" aria-label="Pasos de la reserva">
              {pasos.map(([k, label], i) => (
                <li key={k} className="flex flex-1 items-center gap-2">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-linea font-display text-[14px] font-semibold"
                    style={{ background: i <= idxPaso ? "#ff8a1f" : "#fff" }}
                  >
                    {i + 1}
                  </span>
                  <span className={`text-[13px] font-semibold ${i <= idxPaso ? "" : "text-ink-2"}`}>{label}</span>
                  {i < pasos.length - 1 && <span className="h-0.5 flex-1 bg-marino/25" />}
                </li>
              ))}
            </ol>
          )}

          {paso === "ver" && (
            <div>
              <h2 className="font-display text-2xl font-semibold">Resérvalo antes de que se acabe</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                La tienda te aparta el repuesto durante 24 horas. Pagas el resto cuando lo recoges o lo recibes.
              </p>
              <div className="mt-5 space-y-2 rounded-2xl border border-linea bg-arena p-4 text-[15px]">
                <div className="flex justify-between"><span>Reserva (ChaskiRepu)</span><b>{formatBs(COMISION_RESERVA_BS)}</b></div>
                <div className="flex justify-between"><span>Pagas al recoger</span><b>{formatBs(r.precio_bs)}</b></div>
              </div>
              <button
                type="button"
                disabled={agotado}
                onClick={() => setPaso("entrega")}
                className="mt-5 w-full rounded-2xl boton-ambar px-6 py-4 text-[18px] font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                {agotado ? "Agotado" : `Reservar por ${formatBs(COMISION_RESERVA_BS)}`}
              </button>
            </div>
          )}

          {paso === "entrega" && (
            <div>
              <h2 className="font-display text-xl font-semibold">¿Cómo lo quieres recibir?</h2>
              <div className="mt-4 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Modo de entrega">
                {(
                  [
                    ["recoger", "Recoger en la tienda", "#ece8ff"],
                    ["envio", "Envío a mi casa", "#ffeedd"],
                  ] as const
                ).map(([k, t, c]) => (
                  <button
                    key={k}
                    type="button"
                    role="radio"
                    aria-checked={modo === k}
                    onClick={() => setModo(k)}
                    className="rounded-2xl border border-linea p-3 text-left font-display text-[14px] font-semibold transition"
                    style={{ background: modo === k ? c : "#fff", borderColor: modo === k ? "#7a5cff" : undefined }}
                  >
                    {k === "envio" && <Moto />}
                    {t}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                <label className="block text-[12px] font-semibold uppercase tracking-wider text-ink-2">
                  Tu nombre
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="mt-1 w-full rounded-xl border border-linea px-3 py-2.5 text-[15px] font-medium normal-case tracking-normal" />
                </label>
                <label className="block text-[12px] font-semibold uppercase tracking-wider text-ink-2">
                  Teléfono
                  <input value={telefono} onChange={(e) => setTelefono(e.target.value)} inputMode="tel" className="mt-1 w-full rounded-xl border border-linea px-3 py-2.5 text-[15px] font-medium normal-case tracking-normal" />
                </label>
                {modo === "envio" && (
                  <>
                    <label className="block text-[12px] font-semibold uppercase tracking-wider text-ink-2">
                      Dirección
                      <input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Calle, número, zona" className="mt-1 w-full rounded-xl border border-linea px-3 py-2.5 text-[15px] font-medium normal-case tracking-normal placeholder:text-ink-2" />
                    </label>
                    <label className="block text-[12px] font-semibold uppercase tracking-wider text-ink-2">
                      Referencia
                      <input value={referencia} onChange={(e) => setReferencia(e.target.value)} placeholder="Portón verde, frente a la farmacia" className="mt-1 w-full rounded-xl border border-linea px-3 py-2.5 text-[15px] font-medium normal-case tracking-normal placeholder:text-ink-2" />
                    </label>
                    <p className="rounded-xl bg-arena px-3 py-2 text-[13px]">
                      La tienda confirma si llega a tu zona y cuánto cuesta el envío. Pronto podrás marcar tu casa en el mapa.
                    </p>
                  </>
                )}
              </div>
              {errorForm && (
                <p role="alert" className="mt-3 rounded-xl border border-linea bg-rojo-suave px-3 py-2 text-[14px] font-semibold">
                  {errorForm}
                </p>
              )}
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => setPaso("ver")} className="rounded-2xl border border-linea px-5 py-3 font-semibold hover:bg-ambar-suave">
                  Atrás
                </button>
                <button type="button" onClick={continuarEntrega} className="flex-1 rounded-2xl boton-primario px-5 py-3 text-[16px] font-semibold">
                  Continuar al pago
                </button>
              </div>
            </div>
          )}

          {paso === "pago" && (
            <div>
              <p className="rounded-xl border border-linea bg-ambar-suave px-3 py-2 text-center text-[13px] font-semibold">
                Modo demostración: no se mueve dinero real
              </p>
              <h2 className="mt-4 text-center font-display text-xl font-semibold">Paga tu reserva con QR</h2>
              <p className="mt-1 text-center font-display text-4xl font-semibold">{formatBs(COMISION_RESERVA_BS)}</p>
              <div className="mt-4">
                <QRDemo semilla={r.id} />
              </div>
              <p className="mt-3 text-center text-[13px] text-ink-2">Escanea desde tu app del banco (simulado).</p>
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => setPaso("entrega")} className="rounded-2xl border border-linea px-5 py-3 font-semibold hover:bg-ambar-suave">
                  Atrás
                </button>
                <button type="button" onClick={() => setPaso("listo")} className="flex-1 rounded-2xl boton-primario px-5 py-3 text-[16px] font-semibold">
                  Ya pagué (simulado)
                </button>
              </div>
            </div>
          )}

          {paso === "listo" && (
            <div className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-linea bg-azul-suave text-3xl font-semibold">
                ✓
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold">¡Reserva lista, {nombre.split(" ")[0] || "amigo"}!</h2>
              <p className="mt-1 text-[15px] text-ink-2">La tienda te aparta el repuesto por 24 horas.</p>
              <div className="mt-4 rounded-2xl border-2 border-dashed border-linea bg-arena p-4">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-2">Código de reserva</p>
                <p className="font-display text-4xl font-semibold tracking-wider">{codigo}</p>
              </div>
              <div className="mt-4 rounded-2xl border border-linea bg-white p-3 text-left text-[14px]">
                <p><b>{r.nombre}</b></p>
                <p className="text-ink-2">{p?.nombre} · {modo === "envio" ? `Envío a ${direccion}` : "Recoges en la tienda"}</p>
                <p className="mt-1 font-semibold">Pagas al {modo === "envio" ? "recibir" : "recoger"}: {formatBs(r.precio_bs)}</p>
              </div>
              {modo === "envio" && (
                <div className="mt-4 flex items-center justify-center gap-3 rounded-2xl border border-linea bg-ambar-suave px-4 py-3">
                  <Moto />
                  <p className="text-left font-display text-[14px] font-semibold">El chaski va a casa de {nombre.split(" ")[0] || "tu casa"} cuando la tienda confirme.</p>
                </div>
              )}
              <div className="mt-5 flex gap-3">
                {wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-2xl border border-linea px-4 py-3 text-[15px] font-semibold hover:bg-ambar-suave">
                    WhatsApp
                  </a>
                )}
                <Link href="/buscar" className="flex-1 rounded-2xl boton-ambar px-4 py-3 text-[15px] font-semibold">
                  Seguir buscando
                </Link>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
