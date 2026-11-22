"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { inicioDeRol, iniciarSesion, registrarUsuario, rutaSegura } from "@/lib/auth";
import { useSesion } from "@/lib/useSesion";

type Cuenta = "usuario" | "tienda";

const campo =
  "mt-1.5 w-full rounded-xl border border-linea bg-white px-3.5 py-3 text-[16px] font-medium normal-case tracking-normal text-marino outline-none transition placeholder:text-ink-2/60 focus:border-azul focus:ring-4 focus:ring-azul/15";
const etiqueta = "block text-[12px] font-semibold uppercase tracking-wider text-ink-2";

const OPCIONES: { id: Cuenta; titulo: string; texto: string; tono: string }[] = [
  { id: "usuario", titulo: "Quiero buscar repuestos", texto: "Para mi auto o mi moto", tono: "#e3efff" },
  { id: "tienda", titulo: "Tengo una tienda", texto: "Quiero vender mis repuestos", tono: "#ffeedd" },
];

export function FormularioEntrar() {
  const router = useRouter();
  const sp = useSearchParams();
  const volver = rutaSegura(sp.get("volver"));
  const sesion = useSesion();

  const [crear, setCrear] = useState(sp.get("crear") === "1");
  const [cuenta, setCuenta] = useState<Cuenta>(sp.get("rol") === "tienda" ? "tienda" : "usuario");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const esTienda = cuenta === "tienda";

  // Si ya hay sesión, no tiene sentido mostrar el formulario.
  useEffect(() => {
    if (!sesion.cargando && sesion.usuario && sesion.rol) {
      router.replace(volver ?? inicioDeRol(sesion.rol));
    }
  }, [sesion.cargando, sesion.usuario, sesion.rol, volver, router]);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setError("");
    setAviso("");

    if (!correo.trim() || !contrasena) {
      setError("Escribe tu correo y tu contraseña.");
      return;
    }
    if (crear && !nombre.trim()) {
      setError("Escribe tu nombre.");
      return;
    }
    if (crear && contrasena.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      setEnviando(true);
      if (crear) {
        const { requiereConfirmacion } = await registrarUsuario({ nombre, correo, contrasena, telefono });
        if (requiereConfirmacion) {
          setAviso("Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.");
          setCrear(false);
          setContrasena("");
          return;
        }
        router.push(volver ?? inicioDeRol("usuario"));
      } else {
        const { rol } = await iniciarSesion(correo, contrasena);
        router.push(volver ?? inicioDeRol(rol));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
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

        {crear && (
          <>
            <p className="mt-1 text-[15px] text-ink-2">¿Cómo quieres usar ChaskiRepu?</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Tipo de cuenta">
              {OPCIONES.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={cuenta === o.id}
                  onClick={() => setCuenta(o.id)}
                  className="rounded-2xl border border-linea p-4 text-left transition hover:border-azul/50"
                  style={{ background: cuenta === o.id ? o.tono : "#fff", borderColor: cuenta === o.id ? "#2f8bff" : undefined }}
                >
                  <span className="block font-display text-[17px] font-semibold text-marino">{o.titulo}</span>
                  <span className="block text-[13px] text-ink-2">{o.texto}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {crear && esTienda ? (
          <div className="mt-5 rounded-2xl border border-linea bg-hielo p-5">
            <p className="text-[15px] text-ink-2">
              Las tiendas se registran con los datos del negocio: nombre, teléfono y ubicación.
            </p>
            <Link
              href="/registro-proveedor"
              className="mt-4 block w-full rounded-2xl boton-primario px-6 py-4 text-center text-[17px] font-semibold"
            >
              Registrar mi tienda
            </Link>
          </div>
        ) : (
          <form className="mt-5 space-y-4" onSubmit={enviar} noValidate>
            {aviso && (
              <p role="status" className="rounded-xl border border-verde/30 bg-verde-suave px-4 py-3 text-[14px] text-marino">
                {aviso}
              </p>
            )}
            {crear && (
              <label className={etiqueta}>
                Nombre completo
                <input
                  className={campo}
                  autoComplete="name"
                  placeholder="Ej. Carla Quispe"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </label>
            )}
            <label className={etiqueta}>
              Correo
              <input
                type="email"
                className={campo}
                autoComplete="email"
                placeholder="tucorreo@ejemplo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </label>
            {crear && (
              <label className={etiqueta}>
                Teléfono (opcional)
                <input
                  type="tel"
                  className={campo}
                  autoComplete="tel"
                  placeholder="70000000"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </label>
            )}
            <label className={etiqueta}>
              Contraseña
              <input
                type="password"
                className={campo}
                autoComplete={crear ? "new-password" : "current-password"}
                placeholder={crear ? "Mínimo 8 caracteres" : "Tu contraseña"}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </label>

            {error && (
              <p role="alert" className="rounded-xl border border-rojo/30 bg-rojo-suave px-4 py-3 text-[14px] font-medium text-rojo">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-2xl boton-primario px-6 py-4 text-[17px] font-semibold disabled:opacity-60"
            >
              {enviando ? "Un momento..." : crear ? "Crear mi cuenta" : "Entrar"}
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-[15px]">
          {crear ? "¿Ya tienes cuenta? " : "¿Eres nuevo? "}
          <button
            type="button"
            onClick={() => {
              setCrear(!crear);
              setError("");
              setAviso("");
            }}
            className="font-semibold text-azul underline-offset-4 hover:underline"
          >
            {crear ? "Inicia sesión" : "Crea tu cuenta"}
          </button>
        </p>
      </section>
    </div>
  );
}
