"use client";

import {
  Bike,
  Car,
  CarFront,
  CarTaxiFront,
  Caravan,
  Check,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  MoreVertical,
  Motorbike,
  Package,
  PackagePlus,
  Pencil,
  Recycle,
  Save,
  Search,
  SlidersHorizontal,
  Store,
  Trash2,
  Truck,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, type ChangeEvent } from "react";
import {
  CATALOGO_DEMO,
  type CondicionCatalogo,
  type MarcaCatalogo,
  type RepuestoCatalogo,
} from "@/lib/catalogo-demo";
import { formatBs } from "@/lib/tipos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MARCAS: Record<MarcaCatalogo, { nombre: string; Icono: LucideIcon; clase: string }> = {
  toyota: { nombre: "Toyota", Icono: CarFront, clase: "bg-red-50 text-red-600 ring-red-100" },
  suzuki: { nombre: "Suzuki", Icono: Car, clase: "bg-blue-50 text-blue-600 ring-blue-100" },
  nissan: { nombre: "Nissan", Icono: CarTaxiFront, clase: "bg-slate-100 text-slate-600 ring-slate-200" },
  honda: { nombre: "Honda", Icono: Bike, clase: "bg-rose-50 text-rose-600 ring-rose-100" },
  yamaha: { nombre: "Yamaha", Icono: Motorbike, clase: "bg-indigo-50 text-indigo-600 ring-indigo-100" },
  hyundai: { nombre: "Hyundai", Icono: Caravan, clase: "bg-sky-50 text-sky-600 ring-sky-100" },
  kia: { nombre: "Kia", Icono: Truck, clase: "bg-emerald-50 text-emerald-600 ring-emerald-100" },
};

const CONDICIONES: Record<CondicionCatalogo, { label: string; Icono: LucideIcon; clase: string }> = {
  nuevo: { label: "Nuevo", Icono: PackagePlus, clase: "bg-blue-600 text-white ring-blue-500/30" },
  usado: { label: "Usado", Icono: Recycle, clase: "bg-amber-500 text-white ring-amber-400/30" },
  reacondicionado: {
    label: "Reacondicionado",
    Icono: Wrench,
    clase: "bg-emerald-600 text-white ring-emerald-500/30",
  },
};

const FILTROS_CONDICION = (Object.keys(CONDICIONES) as CondicionCatalogo[]).map((id) => ({
  id,
  ...CONDICIONES[id],
}));

const FILTROS_MARCA = (Object.keys(MARCAS) as MarcaCatalogo[]).map((id) => ({
  id,
  ...MARCAS[id],
}));

const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

interface BorradorEdicion {
  precio: string;
  stock: string;
  imagen: string;
}

export function CatalogoCliente({ tienda }: { tienda: string }) {
  const [repuestos, setRepuestos] = useState<RepuestoCatalogo[]>(CATALOGO_DEMO);
  const [q, setQ] = useState("");
  const [condiciones, setCondiciones] = useState<CondicionCatalogo[]>([]);
  const [marcas, setMarcas] = useState<MarcaCatalogo[]>([]);
  const [editando, setEditando] = useState<RepuestoCatalogo | null>(null);
  const [borrador, setBorrador] = useState<BorradorEdicion | null>(null);

  const hayFiltros = condiciones.length > 0 || marcas.length > 0 || q.trim() !== "";

  const edicionValida = useMemo(() => {
    if (!borrador) return false;

    const precio = Number(borrador.precio);
    const stock = Number(borrador.stock);

    return (
      borrador.precio.trim() !== "" &&
      borrador.stock.trim() !== "" &&
      Number.isFinite(precio) &&
      precio >= 0 &&
      Number.isInteger(stock) &&
      stock >= 0
    );
  }, [borrador]);

  const lista = useMemo(() => {
    const termino = normalizar(q.trim());

    return repuestos.filter((repuesto) => {
      if (condiciones.length > 0 && !condiciones.includes(repuesto.condicion)) return false;
      if (marcas.length > 0 && !marcas.some((marca) => repuesto.marcas.includes(marca))) return false;
      if (!termino) return true;

      const texto = normalizar(
        [
          repuesto.nombre,
          repuesto.codigo,
          CONDICIONES[repuesto.condicion].label,
          ...repuesto.marcas.map((marca) => MARCAS[marca].nombre),
        ].join(" "),
      );

      return termino.split(/\s+/).every((parte) => texto.includes(parte));
    });
  }, [repuestos, q, condiciones, marcas]);

  const alternarCondicion = (condicion: CondicionCatalogo) => {
    setCondiciones((previas) =>
      previas.includes(condicion) ? previas.filter((item) => item !== condicion) : [...previas, condicion],
    );
  };

  const alternarMarca = (marca: MarcaCatalogo) => {
    setMarcas((previas) => (previas.includes(marca) ? previas.filter((item) => item !== marca) : [...previas, marca]));
  };

  const limpiarFiltros = () => {
    setCondiciones([]);
    setMarcas([]);
    setQ("");
  };

  const abrirEditar = (repuesto: RepuestoCatalogo) => {
    setEditando(repuesto);
    setBorrador({
      precio: String(repuesto.precio),
      stock: String(repuesto.stock),
      imagen: repuesto.imagenes[0] ?? "",
    });
  };

  const cerrarEditar = () => {
    setEditando(null);
    setBorrador(null);
  };

  const eliminar = (id: string) => {
    setRepuestos((previos) => previos.filter((repuesto) => repuesto.id !== id));
  };

  const cargarImagen = (evento: ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = () => {
      if (typeof lector.result === "string") {
        setBorrador((previo) => (previo ? { ...previo, imagen: lector.result as string } : previo));
      }
    };
    lector.readAsDataURL(archivo);
    evento.target.value = "";
  };

  const guardarEdicion = () => {
    if (!editando || !borrador) return;

    const precio = Number(borrador.precio);
    const stock = Number(borrador.stock);

    if (
      borrador.precio.trim() === "" ||
      borrador.stock.trim() === "" ||
      !Number.isFinite(precio) ||
      precio < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return;
    }

    setRepuestos((previos) =>
      previos.map((repuesto) =>
        repuesto.id === editando.id
          ? {
              ...repuesto,
              precio,
              stock,
              imagenes: [borrador.imagen || repuesto.imagenes[0], ...repuesto.imagenes.slice(1)],
            }
          : repuesto,
      ),
    );
    cerrarEditar();
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white font-sans text-blue-950">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
            <Badge
              variant="outline"
              className="gap-2 rounded-full border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-blue-50"
            >
              <Store className="size-3.5" />
              Catálogo de tienda
            </Badge>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Catálogo</h1>
            <p className="mt-2 text-lg font-medium text-blue-100">{tienda}</p>

            <div className="relative mt-6 flex max-w-2xl items-center rounded-2xl border border-white/40 bg-white p-1.5 shadow-xl shadow-blue-950/20">
              <Search className="ml-2 size-5 shrink-0 text-blue-400" aria-hidden="true" />
              <Input
                value={q}
                onChange={(evento) => setQ(evento.target.value)}
                placeholder="Busca por repuesto, código o marca..."
                aria-label="Buscar en el catálogo"
                className="h-9 border-none bg-transparent px-2 text-[15px] font-medium text-blue-950 shadow-none ring-0 placeholder:text-blue-400 focus-visible:ring-0"
              />
              {q && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setQ("")}
                  aria-label="Limpiar búsqueda"
                  className="size-8 rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-700"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100">
                <SlidersHorizontal className="size-3.5" />
                Filtros
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {FILTROS_CONDICION.map((filtro) => (
                  <BotonFiltro
                    key={filtro.id}
                    activo={condiciones.includes(filtro.id)}
                    label={filtro.label}
                    Icono={filtro.Icono}
                    onClick={() => alternarCondicion(filtro.id)}
                  />
                ))}
              </div>

              <span className="hidden h-6 w-px bg-white/20 sm:block" />

              <div className="flex flex-wrap items-center gap-2">
                {FILTROS_MARCA.map((filtro) => (
                  <BotonFiltro
                    key={filtro.id}
                    activo={marcas.includes(filtro.id)}
                    label={filtro.nombre}
                    Icono={filtro.Icono}
                    onClick={() => alternarMarca(filtro.id)}
                  />
                ))}
              </div>

              {hayFiltros && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={limpiarFiltros}
                  className="ml-auto gap-1.5 rounded-xl border border-white/25 text-xs font-semibold text-white hover:bg-white/15 hover:text-white"
                >
                  <X className="size-3.5" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-blue-950">
                {lista.length} {lista.length === 1 ? "repuesto" : "repuestos"}
              </h2>
              <p className="mt-1 text-sm text-blue-500">
                {hayFiltros ? "Resultados según tus filtros" : "Todo el inventario disponible"}
              </p>
            </div>
            {hayFiltros && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={limpiarFiltros}
                className="gap-1.5 rounded-xl border-blue-100 bg-white text-xs font-semibold text-blue-700 shadow-xs hover:bg-blue-50 hover:text-blue-800"
              >
                <X className="size-3.5" />
                Limpiar filtros
              </Button>
            )}
          </div>

          {lista.length === 0 ? (
            <Card className="mt-8 border-blue-100 bg-white p-10 text-center shadow-xs">
              <CardContent className="flex flex-col items-center p-0">
                <span className="flex size-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                  <Search className="size-6" />
                </span>
                <p className="mt-4 text-lg font-semibold text-blue-950">No encontramos repuestos</p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-blue-500">
                  Prueba con otro término de búsqueda o quita algunos filtros.
                </p>
                <Button
                  type="button"
                  onClick={limpiarFiltros}
                  className="mt-5 gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <X className="size-4" />
                  Limpiar filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {lista.map((repuesto) => (
                <TarjetaCatalogo
                  key={repuesto.id}
                  repuesto={repuesto}
                  onEditar={abrirEditar}
                  onEliminar={eliminar}
                />
              ))}
            </div>
          )}

          <p className="mt-8 text-center text-xs text-blue-400">
            Los cambios de esta vista son provisionales y no se guardan en la base de datos.
          </p>
        </section>

        <Dialog
          open={Boolean(editando)}
          onOpenChange={(abierto) => {
            if (!abierto) cerrarEditar();
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar repuesto</DialogTitle>
              <DialogDescription>{editando?.nombre}</DialogDescription>
            </DialogHeader>

            {borrador && (
              <div className="space-y-4 py-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="precio-repuesto"
                      className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-500"
                    >
                      Precio (Bs.)
                    </Label>
                    <Input
                      id="precio-repuesto"
                      type="number"
                      min={0}
                      step={1}
                      autoFocus
                      value={borrador.precio}
                      onChange={(evento) =>
                        setBorrador((previo) => (previo ? { ...previo, precio: evento.target.value } : previo))
                      }
                      className="rounded-xl border-blue-100 bg-blue-50/50 font-semibold text-blue-950 focus-visible:border-blue-400 focus-visible:bg-white focus-visible:ring-blue-100"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="stock-repuesto"
                      className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-500"
                    >
                      Stock
                    </Label>
                    <Input
                      id="stock-repuesto"
                      type="number"
                      min={0}
                      step={1}
                      value={borrador.stock}
                      onChange={(evento) =>
                        setBorrador((previo) => (previo ? { ...previo, stock: evento.target.value } : previo))
                      }
                      className="rounded-xl border-blue-100 bg-blue-50/50 font-semibold text-blue-950 focus-visible:border-blue-400 focus-visible:bg-white focus-visible:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-500">
                    Imagen principal
                  </Label>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-20 w-28 shrink-0 rounded-xl bg-blue-50 bg-cover bg-center ring-1 ring-blue-100"
                      style={{ backgroundImage: `url("${borrador.imagen}")` }}
                      role="img"
                      aria-label="Vista previa de la imagen"
                    />
                    <Label
                      htmlFor="archivo-imagen"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-sm font-semibold text-blue-700 shadow-xs transition hover:bg-blue-50"
                    >
                      <ImagePlus className="size-4" />
                      Cambiar imagen
                      <input
                        id="archivo-imagen"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={cargarImagen}
                      />
                    </Label>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={cerrarEditar}
                className="rounded-xl border-blue-100 font-semibold text-blue-700 hover:bg-blue-50"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={guardarEdicion}
                disabled={!edicionValida}
                className="gap-2 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="size-4" />
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

function BotonFiltro({
  activo,
  label,
  Icono,
  onClick,
}: {
  activo: boolean;
  label: string;
  Icono: LucideIcon;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClick}
            aria-pressed={activo}
            aria-label={label}
            className={`relative size-11 rounded-xl border transition ${
              activo
                ? "border-white bg-white text-blue-700 shadow-lg shadow-blue-950/20 hover:bg-white/90 hover:text-blue-700"
                : "border-white/30 bg-white/10 text-white hover:border-white/60 hover:bg-white/20 hover:text-white"
            }`}
          />
        }
      >
        <Icono className="size-5" strokeWidth={2.1} />
        {activo && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-blue-600 text-white ring-2 ring-white">
            <Check className="size-2.5" strokeWidth={3} />
          </span>
        )}
      </TooltipTrigger>
      <TooltipContent side="bottom" className="border border-blue-100 bg-white text-xs font-semibold text-blue-700 shadow-md">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function TarjetaCatalogo({
  repuesto,
  onEditar,
  onEliminar,
}: {
  repuesto: RepuestoCatalogo;
  onEditar: (repuesto: RepuestoCatalogo) => void;
  onEliminar: (id: string) => void;
}) {
  const [indice, setIndice] = useState(0);

  const total = repuesto.imagenes.length;
  const indiceActual = total > 0 ? indice % total : 0;
  const imagenActual = repuesto.imagenes[indiceActual];
  const condicion = CONDICIONES[repuesto.condicion];
  const IconoCondicion = condicion.Icono;

  const anterior = () => setIndice((previo) => (previo - 1 + total) % total);
  const siguiente = () => setIndice((previo) => (previo + 1) % total);

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-2xl border-blue-100 bg-white py-0 shadow-xs transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/70">
      <div className="relative h-48 overflow-hidden rounded-t-2xl bg-blue-50">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${imagenActual}")` }}
          role="img"
          aria-label={`${repuesto.nombre}, imagen ${indiceActual + 1} de ${total}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 via-transparent to-transparent" />

        <Badge
          variant="outline"
          className={`absolute left-3 top-3 z-10 gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${condicion.clase}`}
        >
          <IconoCondicion className="size-3" />
          {condicion.label}
        </Badge>

        {total > 1 && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon-xs"
              onClick={anterior}
              aria-label="Imagen anterior"
              className="absolute left-2 top-1/2 z-10 size-8 -translate-y-1/2 rounded-full bg-white/90 text-blue-700 shadow-md backdrop-blur hover:bg-white"
            >
              <ChevronLeft className="size-4.5" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon-xs"
              onClick={siguiente}
              aria-label="Imagen siguiente"
              className="absolute right-2 top-1/2 z-10 size-8 -translate-y-1/2 rounded-full bg-white/90 text-blue-700 shadow-md backdrop-blur hover:bg-white"
            >
              <ChevronRight className="size-4.5" />
            </Button>
            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {repuesto.imagenes.map((_, posicion) => (
                <button
                  key={posicion}
                  type="button"
                  onClick={() => setIndice(posicion)}
                  aria-label={`Ver imagen ${posicion + 1}`}
                  aria-current={posicion === indiceActual}
                  className={`h-1.5 rounded-full transition-all ${
                    posicion === indiceActual ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white/90"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="absolute right-3 top-3 z-30">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Opciones del repuesto"
                className="size-9 rounded-xl bg-white/90 text-blue-700 shadow-md ring-1 ring-blue-100 backdrop-blur hover:bg-white"
              />
            }
          >
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 border-blue-100 bg-white p-1 shadow-xl shadow-blue-950/10">
            <DropdownMenuItem
              onClick={() => onEditar(repuesto)}
              className="gap-2 font-medium text-blue-700 hover:bg-blue-50 focus:bg-blue-50 focus:text-blue-700"
            >
              <Pencil className="size-3.5" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onEliminar(repuesto.id)}
              className="gap-2 font-medium"
            >
              <Trash2 className="size-3.5" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold leading-snug text-blue-950">{repuesto.nombre}</h3>
        <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-400">
          {repuesto.codigo}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-400">Compatible</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {repuesto.marcas.map((marca) => {
              const info = MARCAS[marca];
              const Icono = info.Icono;
              return (
                <Tooltip key={marca}>
                  <TooltipTrigger
                    render={
                      <span
                        tabIndex={0}
                        aria-label={info.nombre}
                        className={`relative flex size-7 cursor-default items-center justify-center rounded-full ring-1 ${info.clase}`}
                      />
                    }
                  >
                    <Icono className="size-3.5" strokeWidth={2.2} />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-blue-950 px-2 py-1 text-[10px] font-semibold text-white">
                    {info.nombre}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-400">Precio</p>
            <p className="text-2xl font-bold tracking-tight text-blue-950">{formatBs(repuesto.precio)}</p>
          </div>
          <Badge
            variant="outline"
            className={`gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
              repuesto.stock > 0
                ? "border-emerald-100 bg-emerald-50 text-emerald-700 ring-emerald-100"
                : "border-red-100 bg-red-50 text-red-600 ring-red-100"
            }`}
          >
            <Package className="size-3.5" />
            {repuesto.stock > 0 ? `Stock: ${repuesto.stock}` : "Sin stock"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
