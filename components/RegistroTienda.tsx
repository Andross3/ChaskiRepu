"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CONDICIONES } from "@/lib/tipos";

const campo =
  "mt-1.5 w-full rounded-xl border border-linea bg-white px-3.5 py-3 text-[16px] font-medium normal-case tracking-normal text-marino outline-none transition placeholder:text-ink-2/60 focus:border-azul focus:ring-4 focus:ring-azul/15";
const etiqueta = "block text-[12px] font-semibold uppercase tracking-wider text-ink-2";
const bloque = "rounded-3xl border border-linea bg-white p-6 sombra-suave";

const TIPOS = [
  ["repuestera", "Repuestera", "Vendo repuestos nuevos"],
  ["importadora", "Importadora", "Traigo repuestos de afuera"],
  ["usados", "Vendedor de usados", "Vendo piezas de segunda mano"],
] as const;

const VEHICULOS = ["Autos", "Motos", "Eléctricos", "Híbridos"];
const MARCAS = ["Toyota", "Suzuki", "Nissan", "Hyundai", "Kia", "Honda", "Chevrolet", "Mazda", "Volkswagen", "Yamaha", "Bajaj"];

const SUGERENCIAS = [
  "Pon el nombre con el que tus clientes ya te conocen.",
  "Declara siempre si la pieza es original, alternativa, usada o restaurada.",
  "Las fotos claras y el código de la pieza ayudan a vender más rápido.",
  "Si haces envíos, indica hasta dónde llegas: aparecerás a más clientes.",
];

function alternar(lista: string[], v: string): string[] {
  return lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v];
}

export function RegistroTienda() {
  const router = useRouter();
  const [tipo, setTipo] = useState("repuestera");
  const [condiciones, setCondiciones] = useState<string[]>(["original", "usado"]);
  const [vehiculos, setVehiculos] = useState<string[]>(["Autos"]);
  const [marcas, setMarcas] = useState<string[]>([]);
  const [envios, setEnvios] = useState(false);
  const [ubicacion, setUbicacion] = useState("");

  function usarMiUbicacion() {
    if (!("geolocation" in navigator)) {
      setUbicacion("Tu navegador no permite obtener la ubicación.");
      return;
    }
    setUbicacion("Buscando tu ubicación...");
    navigator.geolocation.getCurrentPosition(
      (p) => setUbicacion(`Ubicación guardada: ${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`),
      () => setUbicacion("No pudimos obtener tu ubicación. Puedes escribir la dirección."),
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-[13px] font-semibold uppercase tracking-wider text-azul">Datos de tu tienda</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-marino sm:text-5xl">
        Cuéntanos de tu tienda
      </h1>
      <p className="mt-3 max-w-2xl text-[17px] text-ink-2">
        Con estos datos los clientes te encuentran en el mapa y saben qué repuestos vendes. Todo es opcional por ahora.
      </p>

      <form
        className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/tienda");
        }}
      >
        <div className="space-y-6">
          <section className={bloque}>
            <h2 className="font-display text-xl font-semibold text-marino">Tu negocio</h2>
            <label className={`${etiqueta} mt-4`}>
              Nombre de la tienda
              <input className={campo} placeholder="Ej. Repuestos Chaski" />
            </label>
            <div className="mt-4 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Tipo de negocio">
              {TIPOS.map(([id, t, s]) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={tipo === id}
                  onClick={() => setTipo(id)}
                  className={`rounded-2xl border p-3.5 text-left transition ${
                    tipo === id ? "border-azul bg-azul-suave" : "border-linea bg-white hover:border-azul/40"
                  }`}
                >
                  <span className="block text-[15px] font-semibold text-marino">{t}</span>
                  <span className="block text-[12px] text-ink-2">{s}</span>
                </button>
              ))}
            </div>
          </section>

          <section className={bloque}>
            <h2 className="font-display text-xl font-semibold text-marino">Dónde estás</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className={etiqueta}>
                Dirección
                <input className={campo} placeholder="Calle, número, zona" />
              </label>
              <label className={etiqueta}>
                Ciudad
                <input className={campo} placeholder="Ej. La Paz" />
              </label>
              <label className={etiqueta}>
                WhatsApp
                <input className={campo} inputMode="tel" placeholder="7XXXXXXX" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={etiqueta}>
                  Abres
                  <input type="time" defaultValue="08:30" className={campo} />
                </label>
                <label className={etiqueta}>
                  Cierras
                  <input type="time" defaultValue="18:30" className={campo} />
                </label>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={usarMiUbicacion}
                className="rounded-xl border border-linea bg-white px-4 py-2.5 text-[14px] font-semibold text-marino transition hover:border-azul/50 hover:bg-hielo"
              >
                Usar mi ubicación actual
              </button>
              {ubicacion && (
                <p role="status" className="text-[14px] text-ink-2">
                  {ubicacion}
                </p>
              )}
            </div>
          </section>

          <section className={bloque}>
            <h2 className="font-display text-xl font-semibold text-marino">Qué vendes</h2>
            <p className="mt-1 text-[14px] text-ink-2">Marca todo lo que ofreces.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["original", "alternativo", "usado", "restaurado"].map((k) => (
                <label
                  key={k}
                  className={`flex cursor-pointer gap-3 rounded-2xl border p-3.5 transition ${
                    condiciones.includes(k) ? "border-azul bg-azul-suave" : "border-linea hover:border-azul/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={condiciones.includes(k)}
                    onChange={() => setCondiciones(alternar(condiciones, k))}
                    className="mt-1 h-5 w-5 accent-azul"
                  />
                  <span>
                    <span className="block text-[15px] font-semibold text-marino">{CONDICIONES[k].label}</span>
                    <span className="block text-[12px] text-ink-2">{CONDICIONES[k].desc}</span>
                  </span>
                </label>
              ))}
            </div>

            <p className="mt-5 text-[12px] font-semibold uppercase tracking-wider text-ink-2">Para qué vehículos</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {VEHICULOS.map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={vehiculos.includes(v)}
                  onClick={() => setVehiculos(alternar(vehiculos, v))}
                  className={`rounded-full border px-4 py-1.5 text-[14px] font-semibold transition ${
                    vehiculos.includes(v)
                      ? "border-azul bg-azul text-white"
                      : "border-linea bg-white text-ink-2 hover:border-azul/40"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            <p className="mt-5 text-[12px] font-semibold uppercase tracking-wider text-ink-2">Marcas que manejas</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {MARCAS.map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={marcas.includes(m)}
                  onClick={() => setMarcas(alternar(marcas, m))}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${
                    marcas.includes(m)
                      ? "border-marino bg-marino text-white"
                      : "border-linea bg-hielo text-ink-2 hover:border-azul/40"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </section>

          <section className={bloque}>
            <h2 className="font-display text-xl font-semibold text-marino">Envíos a domicilio</h2>
            <label className="mt-3 flex cursor-pointer items-center gap-3 text-[15px] font-semibold text-marino">
              <input
                type="checkbox"
                checked={envios}
                onChange={(e) => setEnvios(e.target.checked)}
                className="h-5 w-5 accent-azul"
              />
              Hago envíos a domicilio
            </label>
            {envios && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className={etiqueta}>
                  Hasta cuántos km entregas
                  <input type="number" min={1} max={50} defaultValue={5} className={campo} />
                </label>
                <label className={etiqueta}>
                  Costo del envío (Bs)
                  <input type="number" min={0} defaultValue={12} className={campo} />
                </label>
              </div>
            )}
          </section>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="plano-tecnico rounded-3xl p-6 text-white sombra-alta">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-ambar">Sugerencias</p>
            <ul className="mt-3 space-y-3 text-[14px] leading-relaxed text-white/85">
              {SUGERENCIAS.map((s) => (
                <li key={s} className="flex gap-2.5">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ambar" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <button type="submit" className="w-full rounded-2xl boton-primario px-6 py-4 text-[17px] font-semibold">
            Guardar y entrar a mi panel
          </button>
          <button
            type="button"
            onClick={() => router.push("/tienda")}
            className="w-full rounded-2xl border border-linea bg-white px-6 py-3 text-[15px] font-semibold text-marino transition hover:bg-hielo"
          >
            Completar después
          </button>
        </aside>
      </form>
    </div>
  );
}
