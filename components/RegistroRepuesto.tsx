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
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Bike,
  Camera,
  Car,
  Calendar,
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  crearRepuesto,
  obtenerUrlImagen,
  type Repuesto,
  type CondicionRepuesto,
} from "@/services/repuesto";

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
  archivo?: File;
};

const CONDICIONES: { id: CondicionRepuesto; titulo: string; texto: string; icono: LucideIcon }[] = [
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

export function RegistroRepuesto() {
  const [nombre, setNombre] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [tipoVehiculo, setTipoVehiculo] = useState<TipoVehiculo>("auto");
  const [condicion, setCondicion] = useState<CondicionRepuesto>("nuevo");
  const [sistema, setSistema] = useState<Sistema>("motor");
  const [marcas, setMarcas] = useState<MarcaId[]>([]);
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("1");
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [arrastrando, setArrastrando] = useState<number | null>(null);
  const [intento, setIntento] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [repuestoGuardado, setRepuestoGuardado] = useState<Repuesto | null>(null);
  const [enviado, setEnviado] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const inputFotos = useRef<Array<HTMLInputElement | null>>([]);
  const fotosRef = useRef<Foto[]>([]);
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
      archivo,
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
    setModelo("");
    setAno("");
    setTipoVehiculo("auto");
    setCondicion("nuevo");
    setSistema("motor");
    setMarcas([]);
    setPrecio("");
    setStock("1");
    setIntento(false);
    setGuardando(false);
    setErrorServidor(null);
    setRepuestoGuardado(null);
    setEnviado(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function alEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIntento(true);
    setErrorServidor(null);

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

    try {
      setGuardando(true);

      const archivos = fotos
        .map((f) => f.archivo)
        .filter((f): f is File => f instanceof File);

      const resultado = await crearRepuesto({
        nombre: nombre.trim(),
        categoria: sistemaActivo?.nombre || sistema,
        condicion: condicion,
        compatibilidad: [nombresMarcas.join(", "), modelo.trim(), ano.trim()]
          .filter(Boolean)
          .join(" · "),
        precio: precioNumero,
        stock: stockNumero,
        modelo: modelo.trim(),
        ano_repuesto: ano.trim(),
        imagenes: archivos,
      });

      setRepuestoGuardado(resultado);
      setEnviado(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      console.error("Error al registrar repuesto con Supabase:", err);
      const mensaje =
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado al conectar con Supabase.";
      setErrorServidor(mensaje);
    } finally {
      setGuardando(false);
    }
  }

  if (enviado) {
    const urlFotoPrincipal =
      repuestoGuardado?.imagenes && repuestoGuardado.imagenes.length > 0
        ? obtenerUrlImagen(repuestoGuardado.imagenes[0])
        : fotos[0]?.url;

    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 font-sans">
        <Card className="rounded-3xl border border-blue-200 bg-white p-6 sm:p-9 text-center shadow-xl">
          <CardHeader className="p-0 flex flex-col items-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60 mb-4">
              <Check className="size-8 stroke-[2.5]" />
            </span>
            <CardTitle className="text-3xl font-bold text-slate-900 tracking-tight font-sans">
              ¡Repuesto guardado exitosamente!
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 mt-2 max-w-md font-sans">
              El repuesto ha sido registrado en la base de datos de Supabase y sus imágenes han sido almacenadas en el Storage.
            </CardDescription>
            {repuestoGuardado?.id && (
              <Badge variant="outline" className="mt-3 font-mono text-[11px] text-slate-500 border-slate-200">
                ID: {repuestoGuardado.id}
              </Badge>
            )}
          </CardHeader>

          <CardContent className="p-0 mt-6">
            <div className="rounded-2xl border border-blue-100 bg-slate-50/80 p-5 text-left space-y-4">
              <div className="flex items-start gap-3.5">
                {urlFotoPrincipal ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlFotoPrincipal}
                    alt={nombre}
                    className="size-14 rounded-xl object-cover border border-slate-200 shadow-xs"
                  />
                ) : (
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                    <Package className="size-7" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900 text-lg">{nombre}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {condicionActiva?.titulo} · {sistemaActivo?.nombre} · {tipoVehiculo === "auto" ? "Auto" : "Moto"}
                  </p>
                </div>
              </div>

              {/* Nuevos campos mostrados: Modelo y Año */}
              {(modelo || ano) && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-700">
                  {modelo && (
                    <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200/60">
                      <Car className="size-3.5 text-blue-600 shrink-0" />
                      <span className="text-slate-400">Modelo:</span>
                      <span className="font-semibold text-slate-900 truncate">{modelo}</span>
                    </div>
                  )}
                  {ano && (
                    <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200/60">
                      <Calendar className="size-3.5 text-blue-600 shrink-0" />
                      <span className="text-slate-400">Año:</span>
                      <span className="font-semibold text-slate-900 truncate">{ano}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 pt-1">
                {nombresMarcas.map((marca) => (
                  <Badge
                    key={marca}
                    variant="secondary"
                    className="bg-white text-blue-700 border border-blue-200 font-semibold px-2.5 py-0.5"
                  >
                    {marca}
                  </Badge>
                ))}
              </div>

              <Separator className="bg-slate-200" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Precio</p>
                  <p className="text-2xl font-extrabold text-blue-900">
                    Bs {precioNumero.toLocaleString("es-BO")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Stock</p>
                  <p className="text-sm font-bold text-slate-700">{stockNumero} unidades</p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-0 mt-6 flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={reiniciar}
              className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold px-5"
            >
              Registrar otro repuesto
            </Button>
            <Button
              render={<Link href="/catalogo" />}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 shadow-md shadow-blue-500/20"
            >
              Ver en catálogo
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10 font-sans">
        {/* Header Superior */}
        <header className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-6 sm:p-8 text-white shadow-lg">
          <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 size-48 rounded-full bg-sky-400/15 blur-3xl" />
          <div className="relative">
            <Badge className="bg-blue-500/30 text-blue-100 border-white/20 mb-3 text-xs font-semibold">
              Gestión de Inventario · Conexión Supabase
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-sans">
              Nuevo Repuesto
            </h1>
            <p className="mt-2 max-w-2xl text-base text-blue-100/90 leading-relaxed font-sans">
              Registra la pieza, sus fotos, modelo, año y compatibilidad para que se guarde directamente en el catálogo.
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
            {/* SECCIÓN 1: DATOS DE LA PIEZA (Incluye Nombre, Modelo y Año) */}
            <Card className="rounded-3xl border border-blue-100/80 bg-white shadow-sm overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <Package className="size-5" />
                  </span>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900 font-sans">
                      Datos de la pieza
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 font-sans">
                      Nombre del repuesto, modelo compatible y año de aplicación.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                {/* Nombre de la pieza */}
                <div className="space-y-2">
                  <Label htmlFor="nombre-pieza" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Nombre de pieza <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Wrench className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id="nombre-pieza"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      aria-invalid={errorNombre}
                      className="pl-10 h-11 rounded-xl border-slate-200 bg-white text-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                      placeholder="Ej. Pastillas de freno delanteras, Bomba de agua, Amortiguador"
                      autoComplete="off"
                    />
                  </div>
                  {errorNombre && (
                    <p className="text-xs font-medium text-red-600 mt-1">Escribe el nombre de la pieza.</p>
                  )}
                </div>

                {/* 2 CAMPOS ADICIONALES REQUERIDOS: MODELO Y AÑO */}
                <div className="grid gap-4 sm:grid-cols-2 pt-1">
                  {/* Campo Modelo */}
                  <div className="space-y-2">
                    <Label htmlFor="modelo-repuesto" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Modelo del repuesto / vehículo
                    </Label>
                    <div className="relative">
                      <Car className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="modelo-repuesto"
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-slate-200 bg-white text-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        placeholder="Ej. Hilux, Corolla, Sentra, Tucson, Duster"
                        autoComplete="off"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">Modelo vehicular específico al que aplica.</p>
                  </div>

                  {/* Campo Año */}
                  <div className="space-y-2">
                    <Label htmlFor="ano-repuesto" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Año del repuesto / vehículo
                    </Label>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="ano-repuesto"
                        value={ano}
                        onChange={(e) => setAno(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-slate-200 bg-white text-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        placeholder="Ej. 2018 - 2024 o 2022"
                        autoComplete="off"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">Año o intervalo de años de compatibilidad.</p>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* SECCIÓN 2: FOTOS DEL REPUESTO */}
            <Card className="rounded-3xl border border-blue-100/80 bg-white shadow-sm overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <Camera className="size-5" />
                    </span>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900 font-sans">
                        Fotos del repuesto
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 font-sans">
                        Se subirán al Storage de Supabase en la carpeta del repuesto.
                      </CardDescription>
                    </div>
                  </div>

                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100"
                        />
                      }
                    >
                      <Info className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 text-white text-xs p-2 rounded-lg">
                      Puedes subir hasta 3 fotos. La primera será la principal.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid gap-3 sm:grid-cols-3">
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
                              ? "border-slate-200 bg-slate-50"
                              : "border-dashed border-blue-200 bg-blue-50/50 hover:border-blue-400 hover:bg-blue-50"
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
                              className="size-full object-cover"
                            />
                            <div className="absolute inset-x-0 top-0 flex justify-end gap-1.5 p-2">
                              <button
                                type="button"
                                onClick={() => inputFotos.current[indice]?.click()}
                                aria-label={`Cambiar foto ${indice + 1}`}
                                className="flex size-7 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm backdrop-blur hover:bg-white transition"
                              >
                                <Camera className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => quitarFoto(indice)}
                                aria-label={`Quitar foto ${indice + 1}`}
                                className="flex size-7 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-sm backdrop-blur hover:bg-white transition"
                              >
                                <Trash className="size-3.5" />
                              </button>
                            </div>
                            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/85 to-transparent px-2.5 pb-2 pt-6 text-[11px] font-semibold text-white">
                              Foto {indice + 1}
                              {indice === 0 ? " · Principal" : ""}
                            </span>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => inputFotos.current[indice]?.click()}
                            className="flex size-full flex-col items-center justify-center gap-1.5 text-blue-700 p-3"
                          >
                            <span className="flex size-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm border border-blue-100">
                              <ImagePlus className="size-5" />
                            </span>
                            <span className="text-xs font-semibold">Foto {indice + 1}</span>
                            <span className="text-[10px] text-slate-400">
                              {indice === 0 ? "Principal" : "Opcional"}
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs text-slate-400">{fotos.length}/3 fotos · Formatos JPG, PNG o WebP</p>
              </CardContent>
            </Card>

            {/* SECCIÓN 3: CONDICIÓN DE LA PIEZA */}
            <Card className="rounded-3xl border border-blue-100/80 bg-white shadow-sm overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <BadgeCheck className="size-5" />
                  </span>
                  <div>
                    <CardTitle id={idCondicion} className="text-xl font-bold text-slate-900 font-sans">
                      Condición de pieza
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 font-sans">
                      Elige el estado real del repuesto para informar al comprador.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div
                  role="radiogroup"
                  aria-labelledby={idCondicion}
                  className="grid gap-3 sm:grid-cols-3"
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
                            ? "border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
                        }`}
                      >
                        <span
                          className={`flex size-10 items-center justify-center rounded-xl ${
                            activo ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          <Icono className="size-5" />
                        </span>
                        <span className="mt-3 text-sm font-bold text-slate-900">{opcion.titulo}</span>
                        <span className="mt-0.5 text-xs leading-snug text-slate-500">{opcion.texto}</span>
                        {activo && (
                          <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-blue-600 text-white">
                            <Check className="size-3 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* SECCIÓN 4: SISTEMA DE VEHÍCULO */}
            <Card className="rounded-3xl border border-blue-100/80 bg-white shadow-sm overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <Cog className="size-5" />
                  </span>
                  <div>
                    <CardTitle id={idSistema} className="text-xl font-bold text-slate-900 font-sans">
                      Sistema del vehículo
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 font-sans">
                      ¿A qué subsistema automotriz pertenece esta pieza?
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div
                  role="radiogroup"
                  aria-labelledby={idSistema}
                  className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4"
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
                            ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/15 font-semibold"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50"
                        }`}
                      >
                        <span
                          className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                            activo ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          <Icono className="size-4" />
                        </span>
                        <span className="text-xs font-semibold leading-tight">{opcion.nombre}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* SECCIÓN 5: COMPATIBILIDAD DE MARCAS */}
            <Card id="marcas" tabIndex={-1} className="rounded-3xl border border-blue-100/80 bg-white shadow-sm overflow-hidden scroll-mt-24 outline-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <Car className="size-5" />
                    </span>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900 font-sans">
                        Compatibilidad de marcas
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 font-sans">
                        Selecciona las marcas vehiculares compatibles con esta pieza.
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      marcas.length > 0
                        ? "bg-blue-600 text-white font-semibold"
                        : "bg-slate-100 text-slate-500"
                    }
                  >
                    {marcas.length} seleccionada{marcas.length === 1 ? "" : "s"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4 mt-2">
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
                            ? "border-blue-600 bg-blue-50 ring-2 ring-blue-500/15"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
                        }`}
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-100 shadow-2xs">
                          <LogoMarca marca={marca.id} />
                        </span>
                        <span className="text-xs font-bold text-slate-800">{marca.nombre}</span>
                        {activo && (
                          <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-blue-600 text-white">
                            <Check className="size-2.5 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errorMarcas && (
                  <p className="mt-2 text-xs font-medium text-red-600">Selecciona al menos una marca compatible.</p>
                )}
              </CardContent>
            </Card>

            {/* SECCIÓN 6: PRECIO Y STOCK */}
            <Card className="rounded-3xl border border-blue-100/80 bg-white shadow-sm overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <CircleDollarSign className="size-5" />
                  </span>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900 font-sans">
                      Precio y stock
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 font-sans">
                      Define el precio de venta en Bolivianos y la cantidad en stock.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Precio */}
                  <div className="space-y-2">
                    <Label htmlFor="precio" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Precio (Bs) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-600">
                        Bs
                      </span>
                      <Input
                        id="precio"
                        type="number"
                        min={0}
                        step="0.01"
                        inputMode="decimal"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        aria-invalid={errorPrecio}
                        className="pl-11 h-11 rounded-xl border-slate-200 bg-white text-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        placeholder="0.00"
                      />
                    </div>
                    {errorPrecio && <p className="text-xs font-medium text-red-600">Ingresa un precio mayor a 0.</p>}
                  </div>

                  {/* Stock */}
                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Cantidad en stock
                    </Label>
                    <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white h-11 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setStock((valor) => String(Math.max(0, (Number(valor) || 0) - 1)))}
                        aria-label="Disminuir stock"
                        className="size-11 rounded-none text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Minus className="size-4" />
                      </Button>
                      <input
                        id="stock"
                        type="number"
                        min={0}
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="min-w-0 flex-1 border-x border-slate-200 bg-transparent px-3 text-center text-sm font-bold text-slate-900 outline-none"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setStock((valor) => String((Number(valor) || 0) + 1))}
                        aria-label="Aumentar stock"
                        className="size-11 rounded-none text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    <p className="text-[11px] text-slate-400">Unidades reales listas para despacho.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ASIDE DE VISTA RÁPIDA (CARD DE SHADCN) */}
          <aside className="h-fit space-y-4 lg:sticky lg:top-20">
            <Card className="rounded-3xl border border-blue-200/80 bg-white shadow-md overflow-hidden">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold text-slate-900 font-sans">
                    Vista previa de publicación
                  </CardTitle>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-200 text-xs">
                    En vivo
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-4">
                {/* Imagen del repuesto */}
                <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                  {fotos[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fotos[0].url} alt="Foto principal del repuesto" className="size-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5 text-slate-400">
                      <Camera className="size-7" />
                      <span className="text-xs font-semibold">Sin foto cargada</span>
                    </div>
                  )}
                </div>

                {/* Nombre de la pieza */}
                <div>
                  <p className="line-clamp-2 text-base font-bold leading-snug text-slate-900">
                    {nombre.trim() || "Nombre del repuesto"}
                  </p>
                </div>

                {/* NUEVOS CAMPOS EN LA VISTA PREVIA: MODELO Y AÑO */}
                {(modelo || ano) && (
                  <div className="rounded-xl bg-blue-50/70 p-3 border border-blue-100 text-xs space-y-1.5">
                    {modelo && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <Car className="size-3.5 text-blue-600 shrink-0" />
                        <span className="text-slate-400">Modelo:</span>
                        <span className="font-bold text-slate-900">{modelo}</span>
                      </div>
                    )}
                    {ano && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="size-3.5 text-blue-600 shrink-0" />
                        <span className="text-slate-400">Año:</span>
                        <span className="font-bold text-slate-900">{ano}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Badges de condición, sistema y vehículo */}
                <div className="flex flex-wrap gap-1.5">
                  <Badge className="bg-blue-600 text-white text-[11px]">
                    {condicionActiva?.titulo}
                  </Badge>
                  <Badge variant="outline" className="border-blue-200 text-blue-800 text-[11px]">
                    {sistemaActivo?.nombre}
                  </Badge>
                  <Badge variant="outline" className="border-slate-200 text-slate-700 text-[11px]">
                    {tipoVehiculo === "auto" ? "Auto" : "Moto"}
                  </Badge>
                </div>

                {/* Marcas compatibles */}
                <div className="flex flex-wrap gap-1">
                  {nombresMarcas.length > 0 ? (
                    nombresMarcas.map((marca) => (
                      <span
                        key={marca}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-800 border border-slate-200"
                      >
                        {marca}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">Sin marcas seleccionadas</span>
                  )}
                </div>

                <Separator className="bg-slate-100" />

                {/* Precio y stock */}
                <div className="flex items-end justify-between pt-1">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Precio</p>
                    <p className="text-2xl font-black text-blue-900">
                      Bs {precioNumero.toLocaleString("es-BO")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stock</p>
                    <p className="text-sm font-bold text-slate-700">{stockNumero} u.</p>
                  </div>
                </div>

                {/* Alerta de Error si falla la inserción o conexión con Supabase */}
                {errorServidor && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-bold text-red-800">Error al guardar</p>
                      <p className="mt-0.5 leading-relaxed text-[11px]">{errorServidor}</p>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-5 pt-0 flex flex-col gap-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={guardando}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-75 transition-all"
                >
                  {guardando ? (
                    <>
                      <span className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <span>Publicar repuesto</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
                <p className="text-center text-[11px] text-slate-400">
                  Se subirá a la base de datos y Storage de Supabase
                </p>
              </CardFooter>
            </Card>
          </aside>
        </form>
      </div>
    </TooltipProvider>
  );
}

function LogoMarca({ marca }: { marca: MarcaId }) {
  const base = {
    viewBox: "0 0 48 48",
    className: "size-8",
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
