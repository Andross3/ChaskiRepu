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
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  CATALOGO_DEMO,
  type CondicionCatalogo,
  type MarcaCatalogo,
  type RepuestoCatalogo,
} from "@/lib/catalogo-demo";
import { formatBs } from "@/lib/tipos";

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

  useEffect(() => {
    if (!editando) return;

    const alPresionar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        setEditando(null);
        setBorrador(null);
      }
    };

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", alPresionar);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", alPresionar);
    };
  }, [editando]);

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white font-sans text-blue-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-blue-50">
            <Store size={14} />
            Catálogo de tienda
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Catálogo</h1>
          <p className="mt-2 text-lg font-medium text-blue-100">{tienda}</p>

          <div className="mt-6 flex max-w-2xl items-center gap-2 rounded-2xl border border-white/40 bg-white p-1.5 shadow-xl shadow-blue-950/20">
            <Search className="ml-2 h-5 w-5 shrink-0 text-blue-400" aria-hidden="true" />
            <input
              value={q}
              onChange={(evento) => setQ(evento.target.value)}
              placeholder="Busca por repuesto, código o marca..."
              aria-label="Buscar en el catálogo"
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-[15px] font-medium text-blue-950 outline-none placeholder:text-blue-400"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Limpiar búsqueda"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-400 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100">
              <SlidersHorizontal size={14} />
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
              <button
                type="button"
                onClick={limpiarFiltros}
                className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-white/25 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
              >
                <X size={14} />
                Limpiar
              </button>
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
            <button
              type="button"
              onClick={limpiarFiltros}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              <X size={14} />
              Limpiar filtros
            </button>
          )}
        </div>

        {lista.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-blue-100 bg-white p-10 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <Search size={24} />
            </span>
            <p className="mt-4 text-lg font-semibold text-blue-950">No encontramos repuestos</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-blue-500">
              Prueba con otro término de búsqueda o quita algunos filtros.
            </p>
            <button
              type="button"
              onClick={limpiarFiltros}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <X size={16} />
              Limpiar filtros
            </button>
          </div>
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

      {editando && borrador && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-blue-950/50 p-4 backdrop-blur-sm sm:items-center"
          onPointerDown={(evento) => {
            if (evento.target === evento.currentTarget) cerrarEditar();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-editar"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="titulo-editar" className="text-lg font-semibold text-blue-950">
                  Editar repuesto
                </h2>
                <p className="mt-1 text-sm text-blue-500">{editando.nombre}</p>
              </div>
              <button
                type="button"
                onClick={cerrarEditar}
                aria-label="Cerrar"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-blue-400 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-500">
                  Precio (Bs.)
                </span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  autoFocus
                  value={borrador.precio}
                  onChange={(evento) =>
                    setBorrador((previo) => (previo ? { ...previo, precio: evento.target.value } : previo))
                  }
                  className="mt-1.5 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-2.5 text-sm font-semibold text-blue-950 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-500">Stock</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={borrador.stock}
                  onChange={(evento) =>
                    setBorrador((previo) => (previo ? { ...previo, stock: evento.target.value } : previo))
                  }
                  className="mt-1.5 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-2.5 text-sm font-semibold text-blue-950 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>

            <div className="mt-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-500">
                Imagen principal
              </span>
              <div className="mt-1.5 flex items-center gap-3">
                <div
                  className="h-20 w-28 shrink-0 rounded-xl bg-blue-50 bg-cover bg-center ring-1 ring-blue-100"
                  style={{ backgroundImage: `url("${borrador.imagen}")` }}
                  role="img"
                  aria-label="Vista previa de la imagen"
                />
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
                  <ImagePlus size={16} />
                  Cambiar imagen
                  <input type="file" accept="image/*" className="sr-only" onChange={cargarImagen} />
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={cerrarEditar}
                className="rounded-xl border border-blue-100 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={guardarEdicion}
                disabled={!edicionValida}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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
    <div className="group relative shrink-0">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={activo}
        aria-label={label}
        title={label}
        className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition ${
          activo
            ? "border-white bg-white text-blue-700 shadow-lg shadow-blue-950/20"
            : "border-white/30 bg-white/10 text-white hover:border-white/60 hover:bg-white/20"
        }`}
      >
        <Icono size={20} strokeWidth={2.1} />
        {activo && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white ring-2 ring-white">
            <Check size={10} strokeWidth={3} />
          </span>
        )}
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-blue-700 opacity-0 shadow-lg ring-1 ring-blue-100 transition duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
      </span>
    </div>
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
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const total = repuesto.imagenes.length;
  const indiceActual = total > 0 ? indice % total : 0;
  const imagenActual = repuesto.imagenes[indiceActual];
  const condicion = CONDICIONES[repuesto.condicion];
  const IconoCondicion = condicion.Icono;

  useEffect(() => {
    if (!menuAbierto) return;

    const cerrar = (evento: PointerEvent) => {
      if (!menuRef.current?.contains(evento.target as Node)) setMenuAbierto(false);
    };

    document.addEventListener("pointerdown", cerrar);
    return () => document.removeEventListener("pointerdown", cerrar);
  }, [menuAbierto]);

  const anterior = () => setIndice((previo) => (previo - 1 + total) % total);
  const siguiente = () => setIndice((previo) => (previo + 1) % total);

  return (
    <article className="group relative flex flex-col rounded-2xl border border-blue-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/70">
      <div className="relative h-48 overflow-hidden rounded-t-2xl bg-blue-50">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${imagenActual}")` }}
          role="img"
          aria-label={`${repuesto.nombre}, imagen ${indiceActual + 1} de ${total}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 via-transparent to-transparent" />

        <span
          className={`absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${condicion.clase}`}
        >
          <IconoCondicion size={12} />
          {condicion.label}
        </span>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={anterior}
              aria-label="Imagen anterior"
              className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-blue-700 shadow-md transition hover:bg-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={siguiente}
              aria-label="Imagen siguiente"
              className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-blue-700 shadow-md transition hover:bg-white"
            >
              <ChevronRight size={18} />
            </button>
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

      <div ref={menuRef} className="absolute right-3 top-3 z-30">
        <button
          type="button"
          onClick={() => setMenuAbierto((previo) => !previo)}
          aria-label="Opciones del repuesto"
          aria-haspopup="menu"
          aria-expanded={menuAbierto}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-blue-700 shadow-md ring-1 ring-blue-100 backdrop-blur transition hover:bg-white"
        >
          <MoreVertical size={18} />
        </button>

        {menuAbierto && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-1 w-40 overflow-hidden rounded-xl border border-blue-100 bg-white p-1 shadow-xl shadow-blue-950/10"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuAbierto(false);
                onEditar(repuesto);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
            >
              <Pencil size={15} />
              Editar
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuAbierto(false);
                onEliminar(repuesto.id);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={15} />
              Eliminar
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
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
                <span
                  key={marca}
                  title={info.nombre}
                  aria-label={info.nombre}
                  className={`group/marca relative flex h-7 w-7 items-center justify-center rounded-full ring-1 ${info.clase}`}
                >
                  <Icono size={15} strokeWidth={2.2} />
                  <span className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-blue-950 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover/marca:opacity-100">
                    {info.nombre}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-400">Precio</p>
            <p className="text-2xl font-bold tracking-tight text-blue-950">{formatBs(repuesto.precio)}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
              repuesto.stock > 0
                ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                : "bg-red-50 text-red-600 ring-red-100"
            }`}
          >
            <Package size={13} />
            {repuesto.stock > 0 ? `Stock: ${repuesto.stock}` : "Sin stock"}
          </span>
        </div>
      </div>
    </article>
  );
}
