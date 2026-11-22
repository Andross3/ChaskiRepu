"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { TarjetaRepuesto } from "./TarjetaRepuesto";
import type { Repuesto } from "@/lib/tipos";

const campo =
  "mt-1.5 w-full rounded-xl border border-linea bg-white px-3.5 py-3 text-[15px] font-medium normal-case tracking-normal text-marino outline-none transition placeholder:text-ink-2/60 focus:border-azul focus:ring-4 focus:ring-azul/15";
const etiqueta = "block text-[12px] font-semibold uppercase tracking-wider text-ink-2";
const bloque = "rounded-3xl border border-linea bg-white p-6 sombra-suave";

const CATEGORIAS = ["Frenos", "Llantas", "Filtros", "Motor", "Electrico", "Luces", "Suspension", "Transmision", "Carroceria"];
const POSICIONES = ["Delantera", "Trasera", "Izquierda", "Derecha", "Motor", "Interior"];

export function PublicarRepuesto() {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("Frenos");
  const [posicion, setPosicion] = useState("Delantera");
  const [codigo, setCodigo] = useState("");
  const [condicion, setCondicion] = useState("usado");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("1");
  const [vehiculo, setVehiculo] = useState<"auto" | "moto">("auto");
  const [motor, setMotor] = useState<"gasolina" | "hibrido" | "electrico">("gasolina");
  const [foto, setFoto] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);
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

  const vista: Repuesto = {
    id: "vista-previa",
    proveedor_id: null,
    nombre: nombre.trim() || "Nombre del repuesto",
    categoria,
    posicion,
    codigo: codigo.trim() || null,
    equivalencias: [],
    sinonimos: [],
    condicion,
    precio_bs: Number(precio) || 0,
    stock: Number(stock) || 0,
    tipo_vehiculo: vehiculo,
    motor,
    proveedores: { nombre: "Tu tienda", direccion: null, lat: null, lng: null, whatsapp: null },
  };

  if (guardado) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-verde-suave text-3xl font-semibold text-[#0b6b50]">
          ✓
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold text-marino">Repuesto listo</h1>
        <p className="mt-2 text-[16px] text-ink-2">
          Modo demostración: el repuesto todavía no se guarda en la base de datos. Cuando conectemos el inicio de sesión
          real, aparecerá en tu inventario.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setGuardado(false)}
            className="rounded-xl border border-linea bg-white px-5 py-3 text-[15px] font-semibold text-marino transition hover:bg-hielo"
          >
            Publicar otro
          </button>
          <Link href="/tienda" className="rounded-xl boton-primario px-5 py-3 text-[15px] font-semibold">
            Volver a mi panel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/tienda" className="text-[14px] font-semibold text-marino underline-offset-4 hover:underline">
        ← Volver a mi panel
      </Link>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-marino sm:text-5xl">
        Publicar un repuesto
      </h1>
      <p className="mt-3 max-w-2xl text-[17px] text-ink-2">
        Mientras llenas el formulario ves cómo lo verán tus clientes.
      </p>

      <form
        className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]"
        onSubmit={(e) => {
          e.preventDefault();
          setGuardado(true);
        }}
      >
        <div className="space-y-6">
          <section className={bloque}>
            <h2 className="font-display text-xl font-semibold text-marino">La pieza</h2>
            <label className={`${etiqueta} mt-4`}>
              Nombre
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={campo}
                placeholder="Ej. Pastillas de freno delanteras"
              />
            </label>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <label className={etiqueta}>
                Categoría
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={campo}>
                  {CATEGORIAS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className={etiqueta}>
                Posición
                <select value={posicion} onChange={(e) => setPosicion(e.target.value)} className={campo}>
                  {POSICIONES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className={etiqueta}>
                Código (opcional)
                <input value={codigo} onChange={(e) => setCodigo(e.target.value)} className={campo} placeholder="Ej. PF-5678" />
              </label>
            </div>
          </section>

          <section className={bloque}>
            <h2 className="font-display text-xl font-semibold text-marino">Estado y precio</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <label className={etiqueta}>
                Condición
                <select value={condicion} onChange={(e) => setCondicion(e.target.value)} className={campo}>
                  <option value="original">Original</option>
                  <option value="alternativo">Alternativo</option>
                  <option value="usado">Usado</option>
                  <option value="restaurado">Restaurado</option>
                </select>
              </label>
              <label className={etiqueta}>
                Precio (Bs)
                <input
                  type="number"
                  min={0}
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className={campo}
                  placeholder="Ej. 180"
                />
              </label>
              <label className={etiqueta}>
                Unidades
                <input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} className={campo} />
              </label>
            </div>
          </section>

          <section className={bloque}>
            <h2 className="font-display text-xl font-semibold text-marino">Para qué vehículo</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className={etiqueta}>
                Vehículo
                <select value={vehiculo} onChange={(e) => setVehiculo(e.target.value as "auto" | "moto")} className={campo}>
                  <option value="auto">Auto</option>
                  <option value="moto">Moto</option>
                </select>
              </label>
              <label className={etiqueta}>
                Tipo de motor
                <select
                  value={motor}
                  onChange={(e) => setMotor(e.target.value as "gasolina" | "hibrido" | "electrico")}
                  className={campo}
                >
                  <option value="gasolina">Gasolina</option>
                  <option value="hibrido">Híbrido</option>
                  <option value="electrico">Eléctrico</option>
                </select>
              </label>
            </div>
            <label className={`${etiqueta} mt-4`}>
              Marcas y modelos compatibles
              <input className={campo} placeholder="Ej. Toyota Hilux 2015 a 2020, Suzuki Swift 2018" />
            </label>
          </section>

          <section className={bloque}>
            <h2 className="font-display text-xl font-semibold text-marino">Foto</h2>
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-azul/40 bg-hielo px-4 py-6 text-center transition hover:bg-azul-suave">
              {foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={foto} alt="Foto del repuesto" className="h-40 w-full rounded-xl object-cover" />
              ) : (
                <span className="text-[15px] font-semibold text-marino">Toca para subir una foto clara de la pieza</span>
              )}
              <span className="mt-2 text-[12px] text-ink-2">{foto ? "Toca para cambiarla" : "JPG o PNG"}</span>
              <input type="file" accept="image/*" onChange={alElegirFoto} className="sr-only" />
            </label>
          </section>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-2">Así lo verán tus clientes</p>
          <div className="pointer-events-none" aria-hidden="true">
            <TarjetaRepuesto r={vista} />
          </div>
          <button type="submit" className="w-full rounded-2xl boton-primario px-6 py-4 text-[17px] font-semibold">
            Publicar repuesto
          </button>
        </aside>
      </form>
    </div>
  );
}
