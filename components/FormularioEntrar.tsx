"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Rol = "usuario" | "tienda";

const campo =
  "mt-1.5 w-full rounded-xl border border-linea bg-white px-3.5 py-3 text-[16px] font-medium normal-case tracking-normal text-marino outline-none transition placeholder:text-ink-2/60 focus:border-azul focus:ring-4 focus:ring-azul/15";
const etiqueta = "block text-[12px] font-semibold uppercase tracking-wider text-ink-2";

const OPCIONES: { id: Rol; titulo: string; texto: string; tono: string }[] = [
  { id: "usuario", titulo: "Quiero buscar repuestos", texto: "Para mi auto o mi moto", tono: "#e3efff" },
  { id: "tienda", titulo: "Ya tengo una tienda", texto: "Quiero vender mis repuestos", tono: "#ffeedd" },
];

export function FormularioEntrar() {
  const router = useRouter();
  const sp = useSearchParams();
  const [rol, setRol] = useState<Rol>(sp.get("rol") === "tienda" ? "tienda" : "usuario");
  const [crear, setCrear] = useState(sp.get("crear") === "1");

  const esTienda = rol === "tienda";

  function continuar() {
    if (esTienda) router.push(crear ? "/tienda/registro" : "/tienda");
    else router.push("/comprar");
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:py-14">
      <section className="plano-tecnico relative overflow-hidden rounded-[2rem] p-8 text-white sombra-alta">
        <p className="inline-block rounded-full border border-white/60 bg-white/10 px-3.5 py-1 text-[13px] font-semibold text-white">
          {esTienda ? "Para tiendas" : "Para ti"}
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {esTienda ? "Vende a quien ya te está buscando." : "Tu repuesto, sin dar vueltas."}
        </h1>
        <ul className="mt-6 space-y-3 text-[16px] text-white/90">
          {(esTienda
            ? [
                "Publica tus repuestos nuevos, usados y restaurados.",
                "Recibe reservas y confírmalas desde tu panel.",
                "Mira qué repuestos busca el mercado.",
              ]
            : [
                "Elige tu vehículo y toca la pieza que falla.",
                "Compara precios de tiendas cercanas.",
                "Reserva y recibe en tu casa.",
              ]
          ).map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-bold text-azul">
                ✓
              </span>
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[2rem] border border-linea bg-white p-6 sombra-alta sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-marino">{crear ? "Crea tu cuenta" : "Inicia sesión"}</h2>
        <p className="mt-1 text-[15px] text-ink-2">¿Cómo quieres entrar?</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Cómo quieres entrar">
          {OPCIONES.map((o) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={rol === o.id}
              onClick={() => setRol(o.id)}
              className="rounded-2xl border border-linea p-4 text-left transition hover:border-azul/50"
              style={{ background: rol === o.id ? o.tono : "#fff", borderColor: rol === o.id ? "#2f8bff" : undefined }}
            >
              <span className="block font-display text-[17px] font-semibold text-marino">{o.titulo}</span>
              <span className="block text-[13px] text-ink-2">{o.texto}</span>
            </button>
          ))}
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            continuar();
          }}
        >
          {crear && (
            <label className={etiqueta}>
              Nombre completo
              <input className={campo} autoComplete="name" placeholder="Opcional por ahora" />
            </label>
          )}
          <label className={etiqueta}>
            Correo o teléfono
            <input className={campo} autoComplete="username" placeholder="Opcional por ahora" />
          </label>
          <label className={etiqueta}>
            Contraseña
            <input
              type="password"
              className={campo}
              autoComplete={crear ? "new-password" : "current-password"}
              placeholder="Opcional por ahora"
            />
          </label>
          <button type="submit" className="w-full rounded-2xl boton-primario px-6 py-4 text-[17px] font-semibold">
            {esTienda ? (crear ? "Continuar con los datos de mi tienda" : "Entrar a mi tienda") : "Entrar y buscar repuestos"}
          </button>
        </form>

        <p className="mt-4 rounded-xl border border-linea bg-hielo px-4 py-3 text-[13px] text-ink-2">
          Modo demostración: todavía no se piden datos. Puedes entrar con los campos vacíos; el inicio de sesión real se
          conectará después.
        </p>

        <p className="mt-5 text-center text-[15px]">
          {crear ? "¿Ya tienes cuenta? " : "¿Eres nuevo? "}
          <button
            type="button"
            onClick={() => setCrear(!crear)}
            className="font-semibold text-azul underline-offset-4 hover:underline"
          >
            {crear ? "Inicia sesión" : "Crea tu cuenta"}
          </button>
        </p>
      </section>
    </div>
  );
}
