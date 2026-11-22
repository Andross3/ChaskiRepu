"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CircleCheck,
  CircleExclamationPoint,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Store,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { registrarProveedor } from "@/services/proveedor";
import { toast } from "@/components/ui/toast";

type Campos = {
  nombre: string;
  correo: string;
  contrasena: string;
  confirmar: string;
  telefono: string;
  tienda: string;
  ubicacion: string;
};

const VACIO: Campos = {
  nombre: "",
  correo: "",
  contrasena: "",
  confirmar: "",
  telefono: "",
  tienda: "",
  ubicacion: "",
};

const CAMPO_BASE =
  "h-11 rounded-xl border-blue-200 bg-white pl-10 text-[15px] text-slate-900 shadow-none transition placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20";

const BENEFICIOS = [
  "Publica tu catálogo y recibe reservas de clientes cercanos.",
  "Gestiona pedidos y stock desde un solo panel.",
  "Aumenta tu visibilidad en búsquedas por vehículo y zona.",
];

function MensajeError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p role="alert" className="flex items-center gap-1.5 text-[12px] font-medium text-red-600">
      <CircleExclamationPoint className="size-3.5 shrink-0" />
      {children}
    </p>
  );
}

export function RegistroProveedor() {
  const [datos, setDatos] = useState<Campos>(VACIO);
  const [mostrarClave, setMostrarClave] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [acepta, setAcepta] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [requiereConfirmacion, setRequiereConfirmacion] = useState(false);

  function actualizar(campo: keyof Campos, valor: string) {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => {
      if (!prev[campo]) return prev;
      const siguiente = { ...prev };
      delete siguiente[campo];
      return siguiente;
    });
  }

  function validar() {
    const nuevos: Record<string, string> = {};

    if (!datos.nombre.trim()) nuevos.nombre = "Escribe tu nombre completo.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim()))
      nuevos.correo = "Ingresa un correo electrónico válido.";
    if (datos.contrasena.length < 8) nuevos.contrasena = "Usa al menos 8 caracteres.";
    if (datos.confirmar !== datos.contrasena)
      nuevos.confirmar = "Las contraseñas no coinciden.";
    if (!/^[0-9+\s-]{7,}$/.test(datos.telefono.trim()))
      nuevos.telefono = "Ingresa un teléfono válido.";
    if (!datos.tienda.trim()) nuevos.tienda = "Escribe el nombre de tu tienda.";
    if (!datos.ubicacion.trim()) nuevos.ubicacion = "Indica dónde está tu tienda.";
    if (!acepta) nuevos.terminos = "Debes aceptar los términos y condiciones.";

    return nuevos;
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nuevos = validar();
    setErrores(nuevos);

    if (Object.keys(nuevos).length > 0) return;

    try {
      setCargando(true);

      const resultado = await registrarProveedor({
        nombre: datos.nombre,
        correo: datos.correo,
        contrasena: datos.contrasena,
        telefono: datos.telefono,
        tienda: datos.tienda,
        ubicacion: datos.ubicacion,
      });

      setRequiereConfirmacion(resultado.requiereConfirmacion);
      setEnviado(true);
      toast.add({
        type: "success",
        title: "Registro completado",
        description: resultado.requiereConfirmacion
          ? "Revisa tu correo para confirmar la cuenta."
          : "Tu cuenta de proveedor ya está lista.",
      });

    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error durante el registro.";
      toast.add({
        type: "error",
        title: "No se pudo completar el registro",
        description: mensaje,
      });
    } finally {
      setCargando(false);
    }
  }

  function reiniciar() {
    setDatos(VACIO);
    setAcepta(false);
    setErrores({});
    setEnviado(false);
  }

  return (
    <div className="min-h-full bg-blue-50/50 font-sans text-slate-900">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:py-16">
        <aside className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-7 text-white shadow-2xl shadow-blue-900/20 sm:p-10 lg:sticky lg:top-24 lg:h-fit">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-10 size-64 rounded-full bg-sky-300/20 blur-3xl" />

          <span className="relative inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wide ring-1 ring-white/25">
            <Sparkles className="size-3.5" />
            Registro de proveedor
          </span>

          <h1 className="relative mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Suma tu tienda a ChaskiRepu
          </h1>
          <p className="relative mt-3 text-[16px] leading-relaxed text-blue-50/90">
            Crea tu cuenta de proveedor y muestra tus repuestos a miles de conductores que ya están buscando.
          </p>

          <ul className="relative mt-7 space-y-3.5">
            {BENEFICIOS.map((texto) => (
              <li key={texto} className="flex items-start gap-3 text-[15px] text-blue-50/95">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                  <BadgeCheck className="size-4" />
                </span>
                {texto}
              </li>
            ))}
          </ul>

          <div className="relative mt-8 flex items-start gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/20">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-sky-200" />
            <p className="text-[13px] leading-relaxed text-blue-50/90">
              Tus datos se usan para crear tu cuenta de proveedor y registrar la información de tu tienda.
            </p>
          </div>
        </aside>

        <Card className="rounded-3xl border-0 bg-white shadow-xl shadow-blue-900/5 ring-1 ring-blue-100 [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)]">
          <CardHeader className="gap-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              {enviado ? "¡Registro completado!" : "Crea tu cuenta de proveedor"}
            </CardTitle>
            <CardDescription className="text-[15px] text-slate-500">
              {enviado
                ? requiereConfirmacion
                  ? "Confirma tu correo electrónico para activar la cuenta."
                  : "Tu cuenta ya está creada y puedes continuar."
                : "Completa los datos de tu cuenta y de tu tienda."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {enviado ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-blue-50 ring-1 ring-blue-200">
                  <CircleCheck className="size-8 text-blue-600" />
                </span>
                <div>
                  <p className="text-lg font-semibold text-slate-900">Gracias, {datos.nombre.split(" ")[0] || "proveedor"}.</p>
                  <p className="mt-1 max-w-sm text-[15px] leading-relaxed text-slate-500">
                    Registramos tu tienda <span className="font-semibold text-slate-700">{datos.tienda}</span>.
                    {requiereConfirmacion && " Revisa tu correo para confirmar la cuenta."}
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
                  <Link
                    href="/entrar"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-[15px] font-semibold text-white transition hover:bg-blue-700"
                  >
                    Ir a iniciar sesión
                    <ArrowRight className="size-4" />
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={reiniciar}
                    className="h-11 rounded-xl border-blue-200 text-[15px] font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    Registrar otra tienda
                  </Button>
                </div>
              </div>
            ) : (
              <form className="grid gap-5 sm:grid-cols-2" onSubmit={enviar} noValidate>
                <div className="sm:col-span-2">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-blue-600">Datos de acceso</p>
                  <Separator className="mt-2 bg-blue-100" />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="nombre" className="text-[13px] font-semibold text-slate-700">
                    Nombre completo
                  </Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-blue-500" />
                    <Input
                      id="nombre"
                      autoComplete="name"
                      placeholder="Ej. Ana Quispe"
                      value={datos.nombre}
                      onChange={(e) => actualizar("nombre", e.target.value)}
                      aria-invalid={Boolean(errores.nombre)}
                      className={cn(CAMPO_BASE, errores.nombre && "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20")}
                    />
                  </div>
                  <MensajeError>{errores.nombre}</MensajeError>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="correo" className="text-[13px] font-semibold text-slate-700">
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-blue-500" />
                    <Input
                      id="correo"
                      type="email"
                      autoComplete="email"
                      placeholder="tucorreo@ejemplo.com"
                      value={datos.correo}
                      onChange={(e) => actualizar("correo", e.target.value)}
                      aria-invalid={Boolean(errores.correo)}
                      className={cn(CAMPO_BASE, errores.correo && "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20")}
                    />
                  </div>
                  <MensajeError>{errores.correo}</MensajeError>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="telefono" className="text-[13px] font-semibold text-slate-700">
                    Teléfono
                  </Label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-blue-500" />
                    <Input
                      id="telefono"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="Ej. 71234567"
                      value={datos.telefono}
                      onChange={(e) => actualizar("telefono", e.target.value)}
                      aria-invalid={Boolean(errores.telefono)}
                      className={cn(CAMPO_BASE, errores.telefono && "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20")}
                    />
                  </div>
                  <MensajeError>{errores.telefono}</MensajeError>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contrasena" className="text-[13px] font-semibold text-slate-700">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-blue-500" />
                    <Input
                      id="contrasena"
                      type={mostrarClave ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Mínimo 8 caracteres"
                      value={datos.contrasena}
                      onChange={(e) => actualizar("contrasena", e.target.value)}
                      aria-invalid={Boolean(errores.contrasena)}
                      className={cn(CAMPO_BASE, "pr-11", errores.contrasena && "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20")}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarClave((v) => !v)}
                      aria-label={mostrarClave ? "Ocultar contraseña" : "Mostrar contraseña"}
                      className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      {mostrarClave ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  <MensajeError>{errores.contrasena}</MensajeError>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmar" className="text-[13px] font-semibold text-slate-700">
                    Confirmar contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-blue-500" />
                    <Input
                      id="confirmar"
                      type={mostrarConfirmar ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Repite tu contraseña"
                      value={datos.confirmar}
                      onChange={(e) => actualizar("confirmar", e.target.value)}
                      aria-invalid={Boolean(errores.confirmar)}
                      className={cn(CAMPO_BASE, "pr-11", errores.confirmar && "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20")}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarConfirmar((v) => !v)}
                      aria-label={mostrarConfirmar ? "Ocultar contraseña" : "Mostrar contraseña"}
                      className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      {mostrarConfirmar ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  <MensajeError>{errores.confirmar}</MensajeError>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-blue-600">Datos de la tienda</p>
                  <Separator className="mt-2 bg-blue-100" />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="tienda" className="text-[13px] font-semibold text-slate-700">
                    Nombre de la tienda
                  </Label>
                  <div className="relative">
                    <Store className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-blue-500" />
                    <Input
                      id="tienda"
                      autoComplete="organization"
                      placeholder="Ej. Repuestos Chaski"
                      value={datos.tienda}
                      onChange={(e) => actualizar("tienda", e.target.value)}
                      aria-invalid={Boolean(errores.tienda)}
                      className={cn(CAMPO_BASE, errores.tienda && "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20")}
                    />
                  </div>
                  <MensajeError>{errores.tienda}</MensajeError>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="ubicacion" className="text-[13px] font-semibold text-slate-700">
                    Ubicación
                  </Label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-blue-500" />
                    <Input
                      id="ubicacion"
                      autoComplete="street-address"
                      placeholder="Calle, número, ciudad"
                      value={datos.ubicacion}
                      onChange={(e) => actualizar("ubicacion", e.target.value)}
                      aria-invalid={Boolean(errores.ubicacion)}
                      className={cn(CAMPO_BASE, errores.ubicacion && "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20")}
                    />
                  </div>
                  <MensajeError>{errores.ubicacion}</MensajeError>
                </div>

                <div className="sm:col-span-2 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terminos"
                      checked={acepta}
                      onCheckedChange={(valor) => {
                        setAcepta(valor);
                        setErrores((prev) => {
                          if (!prev.terminos) return prev;
                          const siguiente = { ...prev };
                          delete siguiente.terminos;
                          return siguiente;
                        });
                      }}
                      className="mt-0.5 border-blue-300 data-[checked]:border-blue-600 data-[checked]:bg-blue-600"
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="terminos"
                        className="cursor-pointer text-[14px] font-normal leading-relaxed text-slate-600"
                      >
                        Acepto los{" "}
                        <span className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2">
                          términos y condiciones
                        </span>{" "}
                        y la{" "}
                        <span className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2">
                          política de privacidad
                        </span>{" "}
                        de ChaskiRepu.
                      </Label>
                      <MensajeError>{errores.terminos}</MensajeError>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    disabled={cargando}
                    className="h-12 w-full rounded-xl bg-blue-600 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
                  >
                    {cargando ? "Creando cuenta..." : "Crear cuenta de proveedor"}
                    {!cargando && <ArrowRight className="size-4" />}
                  </Button>
                  <p className="mt-3 text-center text-[13px] text-slate-500">
                    ¿Ya tienes una cuenta?{" "}
                    <Link href="/entrar" className="font-semibold text-blue-700 underline-offset-4 hover:underline">
                      Inicia sesión
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
