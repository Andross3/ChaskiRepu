"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bike,
  Boxes,
  Camera,
  Car,
  Check,
  CircleDollarSign,
  Cog,
  Compass,
  Disc3,
  Fuel,
  Gauge,
  ImagePlus,
  Info,
  Minus,
  Package,
  Plus,
  Settings2,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Trash,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

type Condicion = "nuevo" | "usado" | "reacondicionado";
type TipoVehiculo = "auto" | "moto";
type Sistema =
  | "motor"
  | "transmision"
  | "frenos"
  | "suspension"
  | "electrico"
  | "direccion"
  | "enfriamiento"
  | "escape"
  | "combustible"
  | "carroceria";
type MarcaId =
  | "toyota"
  | "nissan"
  | "suzuki"
  | "bmw"
  | "hyundai"
  | "chevrolet"
  | "ford"
  | "honda"
  | "kia"
  | "mitsubishi"
  | "mazda"
  | "volkswagen";

type Foto = {
  id: string;
  url: string;
  nombre: string;
};

const CONDICIONES: { id: Condicion; titulo: string; texto: string; icono: LucideIcon }[] = [
  { id: "nuevo", titulo: "Repuesto Nuevo", texto: "Sin uso, listo para instalar", icono: Sparkles },
  { id: "usado", titulo: "Repuesto Usado", texto: "Con señales normales de uso", icono: Wrench },
  { id: "reacondicionado", titulo: "Repuesto Reacondicionado", texto: "Restaurado y probado", icono: ShieldCheck },
];

const SISTEMAS: { id: Sistema; nombre: string; icono: LucideIcon }[] = [
  { id: "motor", nombre: "Motor", icono: Cog },
  { id: "transmision", nombre: "Transmisión", icono: Settings2 },
  { id: "frenos", nombre: "Frenos", icono: Disc3 },
  { id: "suspension", nombre: "Suspensión", icono: Gauge },
  { id: "electrico", nombre: "Eléctrico", icono: Zap },
  { id: "direccion", nombre: "Dirección", icono: Compass },
  { id: "enfriamiento", nombre: "Enfriamiento", icono: Snowflake },
  { id: "escape", nombre: "Escape", icono: Wind },
  { id: "combustible", nombre: "Combustible", icono: Fuel },
  { id: "carroceria", nombre: "Carrocería", icono: Car },
];

const MARCAS: { id: MarcaId; nombre: string }[] = [
  { id: "toyota", nombre: "Toyota" },
  { id: "nissan", nombre: "Nissan" },
  { id: "suzuki", nombre: "Suzuki" },
  { id: "bmw", nombre: "BMW" },
  { id: "hyundai", nombre: "Hyundai" },
  { id: "chevrolet", nombre: "Chevrolet" },
  { id: "ford", nombre: "Ford" },
  { id: "honda", nombre: "Honda" },
  { id: "kia", nombre: "Kia" },
  { id: "mitsubishi", nombre: "Mitsubishi" },
  { id: "mazda", nombre: "Mazda" },
  { id: "volkswagen", nombre: "Volkswagen" },
];

const bloque =
  "rounded-3xl border border-blue-100/80 bg-white p-5 shadow-[0_1px_2px_rgba(26,19,64,0.04),0_18px_40px_-28px_rgba(37,99,235,0.35)] sm:p-6";
const etiqueta = "block text-[12px] font-semibold uppercase tracking-wider text-ink-2";
const campo =
  "mt-2 w-full rounded-xl border border-linea bg-white px-4 py-3.5 text-[15px] font-medium text-marino outline-none transition placeholder:text-ink-2/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15";

export function RegistroRepuesto() {
  const [nombre, setNombre] = useState("");
  const [tipoVehiculo, setTipoVehiculo] = useState<TipoVehiculo>("auto");
  const [condicion, setCondicion] = useState<Condicion>("nuevo");
  const [sistema, setSistema] = useState<Sistema>("motor");
  const [marcas, setMarcas] = useState<MarcaId[]>([]);
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("1");
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [arrastrando, setArrastrando] = useState<number | null>(null);
  const [intento, setIntento] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const inputFotos = useRef<Array<HTMLInputElement | null>>([]);
  const fotosRef = useRef<Foto[]>([]);
  const ayudaFotosId = useId();
  const idCondicion = useId();
  const idSistema = useId();

  useEffect(() => {
    fotosRef.current = fotos;
  }, [fotos]);

  useEffect(
    () => () => {
      fotosRef.current.forEach((foto) => URL.revokeObjectURL(foto.url));
    },
    [],
  );

  const condicionActiva = CONDICIONES.find((item) => item.id === condicion);
  const sistemaActivo = SISTEMAS.find((item) => item.id === sistema);
  const nombresMarcas = MARCAS.filter((marca) => marcas.includes(marca.id)).map((marca) => marca.nombre);
  const stockNumero = Math.max(0, Math.floor(Number(stock) || 0));
  const precioNumero = Math.max(0, Number(precio) || 0);
  const errorNombre = intento && !nombre.trim();
  const errorMarcas = intento && marcas.length === 0;
  const errorPrecio = intento && precioNumero <= 0;

  function agregarFoto(archivo: File, indice: number) {
    if (!archivo.type.startsWith("image/")) return;
    if (!fotos[indice] && fotos.length >= 3) return;

    const anterior = fotos[indice];
    if (anterior) URL.revokeObjectURL(anterior.url);

    const nueva: Foto = {
      id: crypto.randomUUID(),
      url: URL.createObjectURL(archivo),
      nombre: archivo.name,
    };

    setFotos((actuales) => {
      if (indice < actuales.length) {
        const copia = [...actuales];
        copia[indice] = nueva;
        return copia;
      }
      return [...actuales, nueva];
    });
  }

  function alElegirFoto(e: ChangeEvent<HTMLInputElement>, indice: number) {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (archivo) agregarFoto(archivo, indice);
  }

  function quitarFoto(indice: number) {
    const foto = fotos[indice];
    if (!foto) return;
    URL.revokeObjectURL(foto.url);
    setFotos((actuales) => actuales.filter((_, posicion) => posicion !== indice));
  }

  function alSoltarFoto(e: DragEvent<HTMLDivElement>, indice: number) {
    e.preventDefault();
    setArrastrando(null);
    const archivo = e.dataTransfer.files?.[0];
    if (archivo) agregarFoto(archivo, indice);
  }

  function alternarMarca(id: MarcaId) {
    setMarcas((actuales) =>
      actuales.includes(id) ? actuales.filter((marca) => marca !== id) : [...actuales, id],
    );
  }

  function navegarRadios<T extends string>(
    e: KeyboardEvent<HTMLDivElement>,
    opciones: readonly T[],
    actual: T,
    cambiar: (valor: T) => void,
  ) {
    const paso =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;

    if (!paso) return;

    e.preventDefault();
    const indice = Math.max(0, opciones.indexOf(actual));
    const siguiente = opciones[(indice + paso + opciones.length) % opciones.length];
    cambiar(siguiente);
    const botones = e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    botones[opciones.indexOf(siguiente)]?.focus();
  }

  function alPresionarEnter(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key !== "Enter" || e.defaultPrevented) return;

    const objetivo = e.target;
    if (!(objetivo instanceof HTMLInputElement)) return;
    if (!["text", "number", "search", "email", "tel", "url"].includes(objetivo.type)) return;

    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const navegables = Array.from(
      form.querySelectorAll<HTMLElement>(
        'input:not([type="file"]):not([type="button"]):not([type="submit"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button[type="submit"]:not([disabled])',
      ),
    ).filter((elemento) => elemento.offsetParent !== null);

    const indice = navegables.indexOf(objetivo);
    const siguiente = navegables[indice + 1];
    if (siguiente) siguiente.focus();
    else objetivo.blur();
  }

  function reiniciar() {
    fotosRef.current.forEach((foto) => URL.revokeObjectURL(foto.url));
    setFotos([]);
    setNombre("");
    setTipoVehiculo("auto");
    setCondicion("nuevo");
    setSistema("motor");
    setMarcas([]);
    setPrecio("");
    setStock("1");
    setIntento(false);
    setEnviado(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function alEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIntento(true);

    if (!nombre.trim()) {
      document.getElementById("nombre-pieza")?.focus();
      return;
    }

    if (marcas.length === 0) {
      document.getElementById("marcas")?.focus();
      return;
    }

    if (precioNumero <= 0) {
      document.getElementById("precio")?.focus();
      return;
    }

    setEnviado(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (enviado) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <div className="rounded-[2rem] border border-blue-100 bg-white p-6 text-center shadow-[0_2px_4px_rgba(26,19,64,0.04),0_28px_60px_-18px_rgba(37,99,235,0.35)] sm:p-9">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/60">
            <Check size={30} strokeWidth={3} />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold text-marino">Repuesto registrado</h1>
          <p className="mt-2 text-[15px] text-ink-2">
            Modo demostración: el repuesto no se guarda en la base de datos. Así se vería en tu inventario.
          </p>

          <div className="mt-6 rounded-2xl border border-linea bg-hielo p-4 text-left">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 ring-1 ring-blue-100">
                <Package size={20} />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-marino">{nombre}</p>
                <p className="text-[12px] text-ink-2">
                  {condicionActiva?.titulo} · {sistemaActivo?.nombre} · {tipoVehiculo === "auto" ? "Auto" : "Moto"}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {nombresMarcas.map((marca) => (
                <span
                  key={marca}
                  className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100"
                >
                  {marca}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-linea pt-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-2">Precio</p>
                <p className="font-display text-2xl font-semibold text-marino">
                  Bs {precioNumero.toLocaleString("es-BO")}
                </p>
              </div>
              <p className="text-[13px] font-semibold text-ink-2">{stockNumero} unidades</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reiniciar}
              className="rounded-xl border border-linea bg-white px-5 py-3 text-[15px] font-semibold text-marino transition hover:bg-blue-50"
            >
              Registrar otro
            </button>
            <Link href="/" className="rounded-xl boton-primario px-5 py-3 text-[15px] font-semibold">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[14px] font-semibold text-marino underline-offset-4 hover:underline"
      >
        <ArrowLeft size={16} />
        Volver
      </Link>

      <header className="relative mt-4 overflow-hidden rounded-[2rem] border border-blue-100 bg-linear-to-br from-blue-50 via-white to-sky-50 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-[12px] font-semibold text-blue-700">
            <Boxes size={14} />
            Inventario
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-marino sm:text-5xl">
            Nuevo Repuesto
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] text-ink-2">
            Registra la pieza, sus fotos y la compatibilidad para que los clientes la encuentren sin dar vueltas.
          </p>
        </div>
      </header>

      <form
        ref={formRef}
        onSubmit={alEnviar}
        onKeyDown={alPresionarEnter}
        className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
      >
        <div className="space-y-6">
          <section className={bloque}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Package size={20} />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-marino">Datos de la pieza</h2>
                <p className="text-[13px] text-ink-2">Empieza con el nombre y el tipo de vehículo.</p>
              </div>
            </div>

            <label htmlFor="nombre-pieza" className={`${etiqueta} mt-5`}>
              Nombre de pieza
            </label>
            <div className="relative">
              <Wrench
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-ink-2/60"
              />
              <input
                id="nombre-pieza"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                aria-invalid={errorNombre}
                className={`${campo} pl-11`}
                placeholder="Ej. Pastillas de freno delanteras"
                autoComplete="off"
              />
            </div>
            {errorNombre && <p className="mt-1.5 text-[12px] font-medium text-rojo">Escribe el nombre de la pieza.</p>}

            <p className={`${etiqueta} mt-5`}>Tipo de vehículo</p>
            <div
              role="radiogroup"
              aria-label="Tipo de vehículo"
              className="mt-2 grid grid-cols-2 gap-2.5"
              onKeyDown={(e) => navegarRadios(e, ["auto", "moto"] as const, tipoVehiculo, setTipoVehiculo)}
            >
              {(["auto", "moto"] as const).map((tipo) => {
                const activo = tipoVehiculo === tipo;
                const Icono = tipo === "auto" ? Car : Bike;
                return (
                  <button
                    key={tipo}
                    type="button"
                    role="radio"
                    aria-checked={activo}
                    onClick={() => setTipoVehiculo(tipo)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                      activo
                        ? "border-blue-500 bg-blue-50 text-blue-700 ring-4 ring-blue-500/10"
                        : "border-linea bg-white text-marino hover:border-blue-300 hover:bg-blue-50/40"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        activo ? "bg-blue-600 text-white" : "bg-hielo text-blue-600"
                      }`}
                    >
                      <Icono size={18} />
                    </span>
                    <span className="text-[14px] font-semibold">{tipo === "auto" ? "Auto" : "Moto"}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className={bloque}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Camera size={20} />
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold text-marino">Fotos del repuesto</h2>
                  <p className="text-[13px] text-ink-2">Muestra la pieza desde distintos ángulos.</p>
                </div>
              </div>
              <div className="group relative shrink-0">
                <button
                  type="button"
                  aria-describedby={ayudaFotosId}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                >
                  <Info size={17} />
                </button>
                <span
                  id={ayudaFotosId}
                  role="tooltip"
                  className="pointer-events-none absolute right-0 top-11 z-20 w-56 rounded-xl bg-marino px-3 py-2 text-[12px] font-medium leading-snug text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100"
                >
                  Puedes subir hasta 3 fotos. La primera será la principal.
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((indice) => {
                const foto = fotos[indice];
                const activo = arrastrando === indice;
                return (
                  <div
                    key={indice}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={() => setArrastrando(indice)}
                    onDragLeave={() => setArrastrando((actual) => (actual === indice ? null : actual))}
                    onDrop={(e) => alSoltarFoto(e, indice)}
                    className={`relative aspect-[4/3] overflow-hidden rounded-2xl border transition ${
                      activo
                        ? "border-blue-500 bg-blue-50 ring-4 ring-blue-500/15"
                        : foto
                          ? "border-linea bg-hielo"
                          : "border-dashed border-blue-200 bg-blue-50/60 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    <input
                      ref={(elemento) => {
                        inputFotos.current[indice] = elemento;
                      }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => alElegirFoto(e, indice)}
                      className="sr-only"
                      aria-label={`Subir foto ${indice + 1}`}
                    />

                    {foto ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={foto.url}
                          alt={`Vista previa de ${foto.nombre}`}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-x-0 top-0 flex justify-end gap-1.5 p-2">
                          <button
                            type="button"
                            onClick={() => inputFotos.current[indice]?.click()}
                            aria-label={`Cambiar foto ${indice + 1}`}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-marino shadow-sm backdrop-blur transition hover:bg-white"
                          >
                            <Camera size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => quitarFoto(indice)}
                            aria-label={`Quitar foto ${indice + 1}`}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rojo shadow-sm backdrop-blur transition hover:bg-white"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                        <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-marino/85 to-transparent px-2.5 pb-2 pt-6 text-[11px] font-semibold text-white">
                          Foto {indice + 1}
                          {indice === 0 ? " · Principal" : ""}
                        </span>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => inputFotos.current[indice]?.click()}
                        className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-blue-700"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                          <ImagePlus size={19} />
                        </span>
                        <span className="text-[13px] font-semibold">Foto {indice + 1}</span>
                        <span className="text-[11px] text-ink-2">{indice === 0 ? "Principal" : "Opcional"}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[12px] text-ink-2">{fotos.length}/3 fotos · JPG, PNG o WebP</p>
          </section>

          <section className={bloque}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BadgeCheck size={20} />
              </span>
              <div>
                <h2 id={idCondicion} className="font-display text-xl font-semibold text-marino">
                  Condición de pieza
                </h2>
                <p className="text-[13px] text-ink-2">Elige el estado real del repuesto.</p>
              </div>
            </div>

            <div
              role="radiogroup"
              aria-labelledby={idCondicion}
              className="mt-5 grid gap-3 sm:grid-cols-3"
              onKeyDown={(e) =>
                navegarRadios(
                  e,
                  CONDICIONES.map((item) => item.id),
                  condicion,
                  setCondicion,
                )
              }
            >
              {CONDICIONES.map((opcion) => {
                const activo = condicion === opcion.id;
                const Icono = opcion.icono;
                return (
                  <button
                    key={opcion.id}
                    type="button"
                    role="radio"
                    aria-checked={activo}
                    onClick={() => setCondicion(opcion.id)}
                    className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                      activo
                        ? "border-blue-500 bg-blue-50/80 ring-4 ring-blue-500/10"
                        : "border-linea bg-white hover:border-blue-300 hover:bg-blue-50/40"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        activo ? "bg-blue-600 text-white" : "bg-hielo text-blue-600"
                      }`}
                    >
                      <Icono size={19} />
                    </span>
                    <span className="mt-3 text-[14px] font-semibold text-marino">{opcion.titulo}</span>
                    <span className="mt-0.5 text-[12px] leading-snug text-ink-2">{opcion.texto}</span>
                    {activo && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className={bloque}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Cog size={20} />
              </span>
              <div>
                <h2 id={idSistema} className="font-display text-xl font-semibold text-marino">
                  Sistema de vehículo
                </h2>
                <p className="text-[13px] text-ink-2">¿A qué sistema pertenece la pieza?</p>
              </div>
            </div>

            <div
              role="radiogroup"
              aria-labelledby={idSistema}
              className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4"
              onKeyDown={(e) =>
                navegarRadios(
                  e,
                  SISTEMAS.map((item) => item.id),
                  sistema,
                  setSistema,
                )
              }
            >
              {SISTEMAS.map((opcion) => {
                const activo = sistema === opcion.id;
                const Icono = opcion.icono;
                return (
                  <button
                    key={opcion.id}
                    type="button"
                    role="radio"
                    aria-checked={activo}
                    onClick={() => setSistema(opcion.id)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition ${
                      activo
                        ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/10"
                        : "border-linea bg-white text-marino hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        activo ? "bg-blue-600 text-white" : "bg-hielo text-blue-600"
                      }`}
                    >
                      <Icono size={16} />
                    </span>
                    <span className="text-[13px] font-semibold leading-tight">{opcion.nombre}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section id="marcas" tabIndex={-1} className={`${bloque} scroll-mt-24 outline-none`}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Car size={20} />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-marino">Compatibilidad de marcas</h2>
                <p className="text-[13px] text-ink-2">Selecciona todas las marcas compatibles.</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className={etiqueta}>Marcas compatibles</p>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  marcas.length > 0 ? "bg-blue-100 text-blue-700" : "bg-hielo text-ink-2"
                }`}
              >
                {marcas.length} seleccionada{marcas.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
              {MARCAS.map((marca) => {
                const activo = marcas.includes(marca.id);
                return (
                  <button
                    key={marca.id}
                    type="button"
                    aria-pressed={activo}
                    onClick={() => alternarMarca(marca.id)}
                    className={`relative flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                      activo
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10"
                        : "border-linea bg-white hover:border-blue-300 hover:bg-blue-50/40"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-linea">
                      <LogoMarca marca={marca.id} />
                    </span>
                    <span className="text-[13px] font-semibold text-marino">{marca.nombre}</span>
                    {activo && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {errorMarcas && (
              <p className="mt-2 text-[12px] font-medium text-rojo">Selecciona al menos una marca compatible.</p>
            )}
          </section>

          <section className={bloque}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CircleDollarSign size={20} />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-marino">Precio y stock</h2>
                <p className="text-[13px] text-ink-2">Define cuánto cuesta y cuántas unidades tienes.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="precio" className={etiqueta}>
                  Precio (Bs)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-[14px] font-bold text-blue-600">
                    Bs
                  </span>
                  <input
                    id="precio"
                    type="number"
                    min={0}
                    step="0.01"
                    inputMode="decimal"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    aria-invalid={errorPrecio}
                    className={`${campo} pl-12`}
                    placeholder="0,00"
                  />
                </div>
                {errorPrecio && <p className="mt-1.5 text-[12px] font-medium text-rojo">Ingresa un precio mayor a 0.</p>}
              </div>

              <div>
                <label htmlFor="stock" className={etiqueta}>
                  Cantidad en stock
                </label>
                <div className="mt-2 flex items-stretch overflow-hidden rounded-xl border border-linea bg-white transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/15">
                  <button
                    type="button"
                    onClick={() => setStock((valor) => String(Math.max(0, (Number(valor) || 0) - 1)))}
                    aria-label="Disminuir stock"
                    className="flex w-12 items-center justify-center text-ink-2 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Minus size={17} />
                  </button>
                  <input
                    id="stock"
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="min-w-0 flex-1 border-x border-linea bg-transparent px-3 py-3 text-center text-[15px] font-semibold text-marino outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setStock((valor) => String((Number(valor) || 0) + 1))}
                    aria-label="Aumentar stock"
                    className="flex w-12 items-center justify-center text-ink-2 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Plus size={17} />
                  </button>
                </div>
                <p className="mt-1.5 text-[12px] text-ink-2">Indica cuántas unidades tienes disponibles.</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-[0_1px_2px_rgba(26,19,64,0.04),0_18px_40px_-28px_rgba(37,99,235,0.35)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-marino">Vista rápida</h2>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">Demo</span>
            </div>

            <div className="mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-linea bg-hielo">
              {fotos[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fotos[0].url} alt="Foto principal del repuesto" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-ink-2">
                  <Camera size={26} />
                  <span className="text-[12px] font-semibold">Sin foto todavía</span>
                </div>
              )}
            </div>

            <p className="mt-3 line-clamp-2 font-display text-lg font-semibold leading-snug text-marino">
              {nombre.trim() || "Nombre del repuesto"}
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                {condicionActiva?.titulo}
              </span>
              <span className="rounded-full bg-hielo px-2.5 py-1 text-[11px] font-semibold text-ink-2">
                {sistemaActivo?.nombre}
              </span>
              <span className="rounded-full bg-hielo px-2.5 py-1 text-[11px] font-semibold text-ink-2">
                {tipoVehiculo === "auto" ? "Auto" : "Moto"}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {nombresMarcas.length > 0 ? (
                nombresMarcas.map((marca) => (
                  <span
                    key={marca}
                    className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100"
                  >
                    {marca}
                  </span>
                ))
              ) : (
                <span className="text-[12px] text-ink-2">Aún no eliges marcas compatibles.</span>
              )}
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-linea pt-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-2">Precio</p>
                <p className="font-display text-2xl font-semibold text-marino">
                  Bs {precioNumero.toLocaleString("es-BO")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-2">Stock</p>
                <p className="text-[15px] font-semibold text-marino">{stockNumero} u.</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl boton-primario px-6 py-4 text-[16px] font-semibold"
          >
            Guardar repuesto
            <ArrowRight size={18} />
          </button>
          <p className="text-center text-[12px] leading-snug text-ink-2">
            Modo demostración: por ahora no se guarda en la base de datos.
          </p>
        </aside>
      </form>
    </div>
  );
}

function LogoMarca({ marca }: { marca: MarcaId }) {
  const base = {
    viewBox: "0 0 48 48",
    className: "h-8 w-8",
    "aria-hidden": "true",
    focusable: "false",
  } as const;

  switch (marca) {
    case "toyota":
      return (
        <svg {...base}>
          <ellipse cx="24" cy="24" rx="20" ry="13" fill="none" stroke="#EB0A1E" strokeWidth="3.2" />
          <ellipse cx="24" cy="24" rx="10.5" ry="5" fill="none" stroke="#EB0A1E" strokeWidth="3.2" />
          <ellipse cx="24" cy="24" rx="5" ry="13" fill="none" stroke="#EB0A1E" strokeWidth="3.2" />
        </svg>
      );
    case "nissan":
      return (
        <svg {...base}>
          <circle cx="24" cy="24" r="18" fill="none" stroke="#C3002F" strokeWidth="2.4" />
          <rect x="7" y="21.5" width="34" height="5" rx="2.5" fill="#C3002F" />
        </svg>
      );
    case "suzuki":
      return (
        <svg {...base}>
          <path
            d="M32 12c-7 0-12 3.6-12 8.6 0 4.2 3.1 6.4 8.1 8.2 4 1.4 5.4 2.4 5.4 3.9 0 2-2.6 3.2-6.2 3.2-3.2 0-6-1-8.6-3"
            fill="none"
            stroke="#E30613"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "bmw":
      return (
        <svg {...base}>
          <circle cx="24" cy="24" r="19" fill="#fff" stroke="#111" strokeWidth="2.4" />
          <path d="M24 5a19 19 0 0 1 19 19H24Z" fill="#1C69D4" />
          <path d="M24 43a19 19 0 0 1-19-19h19Z" fill="#1C69D4" />
          <circle cx="24" cy="24" r="19" fill="none" stroke="#111" strokeWidth="2.4" />
          <circle cx="24" cy="24" r="13" fill="none" stroke="#111" strokeWidth="1.6" />
        </svg>
      );
    case "hyundai":
      return (
        <svg {...base}>
          <ellipse cx="24" cy="24" rx="21" ry="12" fill="none" stroke="#002C5F" strokeWidth="2.4" />
          <path
            d="M13.5 32 19 16M34.5 32 29 16M17 24h14"
            fill="none"
            stroke="#002C5F"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "chevrolet":
      return (
        <svg {...base}>
          <path d="M8 19.5h10.5l3.4-4h8.2l3.4 4H42v9h-8.5l-3.4 4h-8.2l-3.4-4H8Z" fill="#D1A64A" />
        </svg>
      );
    case "ford":
      return (
        <svg {...base}>
          <ellipse cx="24" cy="24" rx="22" ry="12" fill="#003478" />
          <ellipse cx="24" cy="24" rx="18.5" ry="8.5" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.85" />
          <text
            x="24"
            y="28.5"
            textAnchor="middle"
            fill="#fff"
            fontFamily="Georgia, serif"
            fontSize="13"
            fontStyle="italic"
            fontWeight="700"
          >
            Ford
          </text>
        </svg>
      );
    case "honda":
      return (
        <svg {...base}>
          <rect x="6" y="6" width="36" height="36" rx="9" fill="none" stroke="#E40521" strokeWidth="2.6" />
          <path
            d="M16 14v20M32 14v20M16 24h16"
            fill="none"
            stroke="#E40521"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "kia":
      return (
        <svg {...base}>
          <ellipse cx="24" cy="24" rx="22" ry="11.5" fill="#05141F" />
          <text
            x="24"
            y="28"
            textAnchor="middle"
            fill="#fff"
            fontFamily="Arial, sans-serif"
            fontSize="11"
            fontWeight="800"
            letterSpacing="0.5"
          >
            KIA
          </text>
        </svg>
      );
    case "mitsubishi":
      return (
        <svg {...base}>
          <path d="M24 6l8 13-8 5-8-5Z" fill="#E60012" />
          <path d="M9 35 5 28l11-13 8 5Z" fill="#E60012" />
          <path d="M39 35l4-7-11-13-8 5Z" fill="#E60012" />
        </svg>
      );
    case "mazda":
      return (
        <svg {...base}>
          <ellipse cx="24" cy="24" rx="20" ry="13" fill="none" stroke="#101820" strokeWidth="2.2" />
          <path
            d="M11 29c4.5-8 8.5-11.5 13-11.5S32.5 21 37 29"
            fill="none"
            stroke="#101820"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="M24 17v12" fill="none" stroke="#101820" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case "volkswagen":
      return (
        <svg {...base}>
          <circle cx="24" cy="24" r="19" fill="#001E50" />
          <path
            d="M11 15l6.5 20L24 21l6.5 14L37 15"
            fill="none"
            stroke="#fff"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="24" r="19" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.5" />
        </svg>
      );
  }
}
