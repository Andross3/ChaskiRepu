"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Flame,
  GitFork,
  Disc,
  Layers,
  Zap,
  Compass,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Package,
  Calendar,
  Car,
  Tag,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  ImageOff,
  Clock,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
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
import { Separator } from "@/components/ui/separator";

export interface RepuestoOportunidad {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  ano: string;
  pedidos: number;
  urgencia: "Alta" | "Media" | "Normal";
  codigoOem?: string;
  precioPromedioEstimado?: string;
  tiempoPromedioRespuesta?: string;
}

export interface SistemaVehiculo {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  pedidosTotales: number;
  icono: typeof Flame;
  badgeTexto: string;
  repuestos: RepuestoOportunidad[];
}

export const SISTEMAS_VEHICULO: SistemaVehiculo[] = [
  {
    id: "motor",
    slug: "motor",
    nombre: "Motor",
    descripcion:
      "Componentes térmicos, sistemas de inyección, culatas, bombas, sellos y distribución.",
    pedidosTotales: 184,
    icono: Flame,
    badgeTexto: "Demanda récord",
    repuestos: [
      {
        id: "mot-1",
        nombre: "Bomba de Aceite de Alta Presión",
        marca: "Toyota",
        modelo: "Hilux 2.8 D-4D",
        ano: "2018 - 2024",
        pedidos: 42,
        urgencia: "Alta",
        codigoOem: "15100-0E010",
        precioPromedioEstimado: "$140 - $190",
        tiempoPromedioRespuesta: "Menos de 24h",
      },
      {
        id: "mot-2",
        nombre: "Kit de Distribución con Bomba de Agua",
        marca: "Nissan",
        modelo: "Sentra B17 1.8",
        ano: "2015 - 2021",
        pedidos: 38,
        urgencia: "Alta",
        codigoOem: "13028-1KC0A",
        precioPromedioEstimado: "$95 - $130",
        tiempoPromedioRespuesta: "Mismo día",
      },
      {
        id: "mot-3",
        nombre: "Inyectores Common Rail Piezoeléctricos",
        marca: "Ford",
        modelo: "Ranger 3.2 TDCi",
        ano: "2016 - 2023",
        pedidos: 29,
        urgencia: "Alta",
        codigoOem: "BK2Q-9K546-AG",
        precioPromedioEstimado: "$220 - $280",
        tiempoPromedioRespuesta: "24h - 48h",
      },
      {
        id: "mot-4",
        nombre: "Termostato Electrónico con Carcasa y Sensor",
        marca: "Chevrolet",
        modelo: "Cruze 1.8 LT",
        ano: "2013 - 2019",
        pedidos: 27,
        urgencia: "Media",
        codigoOem: "55577072",
        precioPromedioEstimado: "$45 - $65",
        tiempoPromedioRespuesta: "24h",
      },
      {
        id: "mot-5",
        nombre: "Válvula PCV y Tapa de Válvulas con Empaque",
        marca: "Hyundai",
        modelo: "Tucson 2.0 Nu",
        ano: "2016 - 2022",
        pedidos: 25,
        urgencia: "Media",
        codigoOem: "22410-2E000",
        precioPromedioEstimado: "$75 - $110",
        tiempoPromedioRespuesta: "24h",
      },
      {
        id: "mot-6",
        nombre: "Radiador de Enfriamiento de Motor en Aluminio",
        marca: "Kia",
        modelo: "Sportage 2.4",
        ano: "2017 - 2023",
        pedidos: 23,
        urgencia: "Normal",
        codigoOem: "25310-D9000",
        precioPromedioEstimado: "$85 - $125",
        tiempoPromedioRespuesta: "48h",
      },
    ],
  },
  {
    id: "transmision",
    slug: "transmision",
    nombre: "Transmisión",
    descripcion:
      "Embragues, cajas mecánicas y automáticas, sensores de velocidad, juntas homocinéticas.",
    pedidosTotales: 142,
    icono: GitFork,
    badgeTexto: "Alta rotación",
    repuestos: [
      {
        id: "tra-1",
        nombre: "Kit de Embrague Completo (Disco, Prensa y Collarín)",
        marca: "Toyota",
        modelo: "Yaris Sedan 1.5",
        ano: "2017 - 2023",
        pedidos: 36,
        urgencia: "Alta",
        codigoOem: "31210-52052",
        precioPromedioEstimado: "$110 - $160",
        tiempoPromedioRespuesta: "Menos de 24h",
      },
      {
        id: "tra-2",
        nombre: "Sensor de Velocidad Entrada / Salida CVT",
        marca: "Nissan",
        modelo: "X-Trail T32",
        ano: "2016 - 2022",
        pedidos: 31,
        urgencia: "Alta",
        codigoOem: "31935-1XF01",
        precioPromedioEstimado: "$50 - $75",
        tiempoPromedioRespuesta: "24h",
      },
      {
        id: "tra-3",
        nombre: "Volante Bimasa con Pernos de Anclaje",
        marca: "Volkswagen",
        modelo: "Amarok 2.0 BiTDI",
        ano: "2014 - 2021",
        pedidos: 28,
        urgencia: "Media",
        codigoOem: "03L105266DC",
        precioPromedioEstimado: "$320 - $410",
        tiempoPromedioRespuesta: "24h - 48h",
      },
      {
        id: "tra-4",
        nombre: "Semieje Delantero Izquierdo Completo",
        marca: "Renault",
        modelo: "Duster 2.0 4x4",
        ano: "2015 - 2020",
        pedidos: 24,
        urgencia: "Normal",
        codigoOem: "39101-7299R",
        precioPromedioEstimado: "$90 - $135",
        tiempoPromedioRespuesta: "48h",
      },
      {
        id: "tra-5",
        nombre: "Cuerpo de Válvulas y Solenoides Automáticos",
        marca: "Honda",
        modelo: "CR-V 2.4 AWD",
        ano: "2013 - 2018",
        pedidos: 23,
        urgencia: "Media",
        codigoOem: "27200-R90-003",
        precioPromedioEstimado: "$180 - $260",
        tiempoPromedioRespuesta: "48h",
      },
    ],
  },
  {
    id: "frenos",
    slug: "frenos",
    nombre: "Frenos",
    descripcion:
      "Pastillas cerámicas, discos ventilados, calipers, bombas centrales y sensores ABS.",
    pedidosTotales: 215,
    icono: Disc,
    badgeTexto: "Mayor volumen",
    repuestos: [
      {
        id: "fre-1",
        nombre: "Pastillas de Freno Cerámicas Delanteras",
        marca: "Toyota",
        modelo: "RAV4 Hybrid",
        ano: "2019 - 2024",
        pedidos: 58,
        urgencia: "Alta",
        codigoOem: "04465-42200",
        precioPromedioEstimado: "$40 - $65",
        tiempoPromedioRespuesta: "Inmediato",
      },
      {
        id: "fre-2",
        nombre: "Discos de Freno Ventilados Ranurados (Par)",
        marca: "Suzuki",
        modelo: "Grand Vitara 2.4",
        ano: "2012 - 2020",
        pedidos: 46,
        urgencia: "Alta",
        codigoOem: "55311-65J00",
        precioPromedioEstimado: "$80 - $120",
        tiempoPromedioRespuesta: "Menos de 24h",
      },
      {
        id: "fre-3",
        nombre: "Módulo Hidráulico con Bomba ABS",
        marca: "Hyundai",
        modelo: "Accent 1.4",
        ano: "2015 - 2021",
        pedidos: 41,
        urgencia: "Alta",
        codigoOem: "58920-1R300",
        precioPromedioEstimado: "$160 - $240",
        tiempoPromedioRespuesta: "24h",
      },
      {
        id: "fre-4",
        nombre: "Caliper de Freno Trasero Derecho con Freno de Mano",
        marca: "Mazda",
        modelo: "Mazda 3 SkyActiv",
        ano: "2016 - 2022",
        pedidos: 37,
        urgencia: "Media",
        codigoOem: "B45A-26-61XA",
        precioPromedioEstimado: "$95 - $145",
        tiempoPromedioRespuesta: "24h",
      },
      {
        id: "fre-5",
        nombre: "Servofreno (Booster) de Vacío",
        marca: "Mitsubishi",
        modelo: "L200 2.5 DI-D",
        ano: "2014 - 2021",
        pedidos: 33,
        urgencia: "Normal",
        codigoOem: "4630A113",
        precioPromedioEstimado: "$110 - $170",
        tiempoPromedioRespuesta: "48h",
      },
    ],
  },
  {
    id: "suspension",
    slug: "suspension",
    nombre: "Suspensión",
    descripcion:
      "Amortiguadores hidráulicos y de gas, resortes helicoidales, trapecios y cazoletas.",
    pedidosTotales: 167,
    icono: Layers,
    badgeTexto: "Gran demanda",
    repuestos: [
      {
        id: "sus-1",
        nombre: "Amortiguadores Delanteros a Gas Reforzados (Par)",
        marca: "Toyota",
        modelo: "Corolla Cross 2.0",
        ano: "2021 - 2024",
        pedidos: 45,
        urgencia: "Alta",
        codigoOem: "48510-02W30",
        precioPromedioEstimado: "$130 - $180",
        tiempoPromedioRespuesta: "Menos de 24h",
      },
      {
        id: "sus-2",
        nombre: "Trapecios / Brazos de Control con Rótulas",
        marca: "Nissan",
        modelo: "Qashqai J11",
        ano: "2015 - 2022",
        pedidos: 39,
        urgencia: "Alta",
        codigoOem: "54500-4EA0B",
        precioPromedioEstimado: "$85 - $130",
        tiempoPromedioRespuesta: "24h",
      },
      {
        id: "sus-3",
        nombre: "Cazoletas Superiores con Rodamiento de Giro",
        marca: "Kia",
        modelo: "Rio 1.4",
        ano: "2017 - 2023",
        pedidos: 31,
        urgencia: "Media",
        codigoOem: "54610-H8000",
        precioPromedioEstimado: "$35 - $55",
        tiempoPromedioRespuesta: "24h",
      },
      {
        id: "sus-4",
        nombre: "Barra Estabilizadora Delantera y Bieletas",
        marca: "Ford",
        modelo: "EcoSport 1.5",
        ano: "2014 - 2020",
        pedidos: 27,
        urgencia: "Media",
        codigoOem: "CN15-5484-AA",
        precioPromedioEstimado: "$60 - $90",
        tiempoPromedioRespuesta: "48h",
      },
      {
        id: "sus-5",
        nombre: "Kit de Bujes de Suspensión en Poliuretano",
        marca: "Subaru",
        modelo: "Forester 2.5 AWD",
        ano: "2016 - 2022",
        pedidos: 25,
        urgencia: "Normal",
        codigoOem: "20204-AG011",
        precioPromedioEstimado: "$70 - $105",
        tiempoPromedioRespuesta: "48h",
      },
    ],
  },
  {
    id: "electrico",
    slug: "electrico",
    nombre: "Sistema Eléctrico",
    descripcion:
      "Alternadores, arrancadores, computadoras de motor (ECU), arneses y sensores de oxígeno.",
    pedidosTotales: 128,
    icono: Zap,
    badgeTexto: "En crecimiento",
    repuestos: [
      {
        id: "ele-1",
        nombre: "Alternador 12V 130A con Polea Libre",
        marca: "Chevrolet",
        modelo: "Tracker 1.2 Turbo",
        ano: "2020 - 2024",
        pedidos: 34,
        urgencia: "Alta",
        codigoOem: "26233777",
        precioPromedioEstimado: "$160 - $220",
        tiempoPromedioRespuesta: "24h",
      },
      {
        id: "ele-2",
        nombre: "Sensor de Oxígeno Primario (Banda Ancha)",
        marca: "Nissan",
        modelo: "Versa 1.6",
        ano: "2018 - 2024",
        pedidos: 37,
        urgencia: "Alta",
        codigoOem: "22693-1KC0A",
        precioPromedioEstimado: "$65 - $95",
        tiempoPromedioRespuesta: "Menos de 24h",
      },
      {
        id: "ele-3",
        nombre: "Motor de Arranque Reforzado 1.4kW",
        marca: "Toyota",
        modelo: "Fortuner 2.7",
        ano: "2016 - 2023",
        pedidos: 29,
        urgencia: "Media",
        codigoOem: "28100-0C080",
        precioPromedioEstimado: "$120 - $175",
        tiempoPromedioRespuesta: "24h",
      },
      {
        id: "ele-4",
        nombre: "Computadora de Inyección / Motor (ECU)",
        marca: "Volkswagen",
        modelo: "Gol 1.6 MSI",
        ano: "2015 - 2021",
        pedidos: 28,
        urgencia: "Media",
        codigoOem: "032906034P",
        precioPromedioEstimado: "$210 - $310",
        tiempoPromedioRespuesta: "48h",
      },
    ],
  },
  {
    id: "direccion",
    slug: "direccion",
    nombre: "Dirección",
    descripcion:
      "Cremalleras electroasistidas (EPS), bombas hidráulicas, terminales y barras axiales.",
    pedidosTotales: 98,
    icono: Compass,
    badgeTexto: "Oportunidad activa",
    repuestos: [
      {
        id: "dir-1",
        nombre: "Cremallera de Dirección Electroasistida EPS",
        marca: "Toyota",
        modelo: "Corolla E210",
        ano: "2019 - 2024",
        pedidos: 27,
        urgencia: "Alta",
        codigoOem: "45510-02600",
        precioPromedioEstimado: "$290 - $390",
        tiempoPromedioRespuesta: "24h",
      },
      {
        id: "dir-2",
        nombre: "Terminales y Axiales de Dirección (Kit 4 Piezas)",
        marca: "Hyundai",
        modelo: "Elantra 1.6",
        ano: "2016 - 2022",
        pedidos: 26,
        urgencia: "Normal",
        codigoOem: "56820-F2000",
        precioPromedioEstimado: "$45 - $70",
        tiempoPromedioRespuesta: "24h",
      },
      {
        id: "dir-3",
        nombre: "Bomba de Dirección Hidráulica de Paletas",
        marca: "Mitsubishi",
        modelo: "Montero Sport 3.0",
        ano: "2013 - 2019",
        pedidos: 24,
        urgencia: "Media",
        codigoOem: "MR992873",
        precioPromedioEstimado: "$115 - $165",
        tiempoPromedioRespuesta: "48h",
      },
      {
        id: "dir-4",
        nombre: "Columna de Dirección con Motor Eléctrico Integrado",
        marca: "Kia",
        modelo: "Cerato 1.6",
        ano: "2015 - 2021",
        pedidos: 21,
        urgencia: "Media",
        codigoOem: "56300-A7000",
        precioPromedioEstimado: "$195 - $275",
        tiempoPromedioRespuesta: "48h",
      },
    ],
  },
];

export function OportunidadesMercado() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sistemaSeleccionadoId = searchParams.get("sistema");

  const [busqueda, setBusqueda] = useState("");
  const [marcaFiltro, setMarcaFiltro] = useState<string>("todas");

  // Sistema actual seleccionado (si existe)
  const sistemaActual = useMemo(() => {
    if (!sistemaSeleccionadoId) return null;
    return (
      SISTEMAS_VEHICULO.find(
        (s) => s.slug.toLowerCase() === sistemaSeleccionadoId.toLowerCase()
      ) || null
    );
  }, [sistemaSeleccionadoId]);

  // Total de pedidos sumados en todos los sistemas
  const totalPedidosGlobales = useMemo(() => {
    return SISTEMAS_VEHICULO.reduce((acc, curr) => acc + curr.pedidosTotales, 0);
  }, []);

  // Marcas únicas disponibles para filtrar
  const marcasDisponibles = useMemo(() => {
    if (!sistemaActual) return [];
    const set = new Set(sistemaActual.repuestos.map((r) => r.marca));
    return Array.from(set);
  }, [sistemaActual]);

  // Repuestos filtrados en la vista de categoría
  const repuestosFiltrados = useMemo(() => {
    if (!sistemaActual) return [];
    return sistemaActual.repuestos.filter((r) => {
      const coincideBusqueda =
        busqueda === "" ||
        r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.modelo.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.ano.toLowerCase().includes(busqueda.toLowerCase()) ||
        (r.codigoOem && r.codigoOem.toLowerCase().includes(busqueda.toLowerCase()));

      const coincideMarca =
        marcaFiltro === "todas" ||
        r.marca.toLowerCase() === marcaFiltro.toLowerCase();

      return coincideBusqueda && coincideMarca;
    });
  }, [sistemaActual, busqueda, marcaFiltro]);

  const seleccionarSistema = (slug: string) => {
    setBusqueda("");
    setMarcaFiltro("todas");
    router.push(`/oportunidades-mercado?sistema=${slug}`);
  };

  const limpiarSeleccion = () => {
    setBusqueda("");
    setMarcaFiltro("todas");
    router.push("/oportunidades-mercado");
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 font-sans pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl">
          {/* Navegación de migas de pan (Breadcrumb) */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-200 mb-4 font-sans">
            <button
              onClick={limpiarSeleccion}
              className="hover:text-white transition flex items-center gap-1.5 focus:outline-none focus:underline"
            >
              <span>Inicio</span>
            </button>
            <ChevronRight className="size-3.5 text-blue-300/60" />
            <button
              onClick={limpiarSeleccion}
              className={`hover:text-white transition ${
                !sistemaActual ? "text-white font-semibold" : ""
              }`}
            >
              Oportunidades de mercado
            </button>
            {sistemaActual && (
              <>
                <ChevronRight className="size-3.5 text-blue-300/60" />
                <span className="text-white font-semibold">
                  {sistemaActual.nombre}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs sm:text-sm font-medium text-blue-100 backdrop-blur-sm border border-white/15 mb-3">
                <Sparkles className="size-3.5 text-blue-300" />
                <span>Panel de Demanda Activa en Tiempo Real</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-sans">
                Oportunidades de mercado
              </h1>
              <p className="mt-3 max-w-2xl text-base sm:text-lg text-blue-100/90 leading-relaxed font-sans">
                Monitorea la cantidad de pedidos solicitados por clientes que
                necesitan repuestos automotrices. Elige un sistema del vehículo
                para explorar la lista de piezas con mayor demanda.
              </p>
            </div>

            {/* Métrica global rápida */}
            <div className="shrink-0 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 flex items-center gap-4 text-white">
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/30 text-white border border-white/20 shadow-inner">
                <TrendingUp className="size-6 text-blue-200" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-blue-200 font-medium">
                  Pedidos Totales Activos
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    {totalPedidosGlobales}
                  </span>
                  <span className="text-xs text-blue-200 font-medium">
                    en 6 sistemas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 font-sans">
        {/* VISTA 1: EXPLORADOR DE SISTEMAS DEL VEHÍCULO */}
        {!sistemaActual ? (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
                  Sistemas del vehículo para explorar
                </h2>
                <p className="text-sm text-slate-500 mt-1 font-sans">
                  Selecciona una categoría para ver los repuestos requeridos y la
                  cantidad de pedidos en espera.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 border border-blue-200/80">
                <Clock className="size-3.5 text-blue-600" />
                <span>Actualizado hoy según solicitudes reales</span>
              </div>
            </div>

            {/* Grid de Cards de Sistemas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SISTEMAS_VEHICULO.map((sistema) => {
                const Icono = sistema.icono;
                return (
                  <Card
                    key={sistema.id}
                    onClick={() => seleccionarSistema(sistema.slug)}
                    className="group relative cursor-pointer overflow-hidden border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 hover:ring-2 hover:ring-blue-500/20"
                  >
                    {/* Borde superior azul dinámico al pasar el cursor */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-blue-600 transition-colors" />

                    <CardHeader className="pb-3 pt-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                          <Icono className="size-6 transition-transform group-hover:scale-110" />
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-800 border border-blue-200/70 text-xs font-medium"
                        >
                          {sistema.badgeTexto}
                        </Badge>
                      </div>

                      <CardTitle className="text-xl font-bold text-slate-900 mt-3 group-hover:text-blue-700 transition-colors font-sans">
                        {sistema.nombre}
                      </CardTitle>

                      <CardDescription className="text-sm text-slate-500 line-clamp-2 mt-1 leading-relaxed font-sans">
                        {sistema.descripcion}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-4">
                      <div className="rounded-xl bg-gradient-to-r from-blue-50/80 to-slate-50 p-3.5 border border-blue-100/80 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-blue-900/80 font-medium">
                            Cantidad de pedidos
                          </p>
                          <p className="text-2xl font-black text-blue-900 tracking-tight">
                            {sistema.pedidosTotales}
                            <span className="text-xs font-normal text-slate-500 ml-1.5">
                              pedidos activos
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block">
                            Piezas clave
                          </span>
                          <span className="text-xs font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-100 shadow-xs">
                            {sistema.repuestos.length} tipos
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0 pb-4 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                      <span>Ver repuestos solicitados</span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          /* VISTA 2: LISTA DE REPUESTOS DENTRO DEL SISTEMA SELECCIONADO */
          <div className="space-y-6">
            {/* Barra superior de retorno y resumen de la categoría */}
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={limpiarSeleccion}
                className="w-fit border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition rounded-xl gap-2 font-medium"
              >
                <ArrowLeft className="size-4" />
                <span>Volver a todos los sistemas</span>
              </Button>

              {/* Banner con la cantidad de pedidos de esta categoría */}
              <div className="rounded-2xl border border-blue-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                    <sistemaActual.icono className="size-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">
                        Sistema de {sistemaActual.nombre}
                      </h2>
                      <Badge className="bg-blue-600 text-white hover:bg-blue-700 border-none font-semibold">
                        {sistemaActual.badgeTexto}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 max-w-xl font-sans">
                      {sistemaActual.descripcion}
                    </p>
                  </div>
                </div>

                {/* Destacado: Cantidad de pedidos de esta categoría */}
                <div className="flex sm:flex-col md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                    Demanda de la categoría
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-blue-700 tracking-tight">
                      {sistemaActual.pedidosTotales}
                    </span>
                    <span className="text-sm font-semibold text-slate-600">
                      pedidos en espera
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selector rápido horizontal de otros sistemas */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                Cambiar sistema:
              </span>
              {SISTEMAS_VEHICULO.map((s) => {
                const activo = s.id === sistemaActual.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => seleccionarSistema(s.slug)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                      activo
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200/90 hover:bg-blue-50/60 hover:text-blue-700 hover:border-blue-200"
                    }`}
                  >
                    <s.icono className="size-3.5" />
                    <span>{s.nombre}</span>
                    <span
                      className={`ml-1 text-[11px] rounded-full px-1.5 py-0.2 ${
                        activo ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {s.pedidosTotales}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Barra de Búsqueda y Filtros */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Buscar repuesto por nombre, marca, modelo o año..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10 h-10 rounded-lg border-slate-200 bg-slate-50/50 text-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                />
              </div>

              {/* Filtro por marca */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                <SlidersHorizontal className="size-4 text-slate-400 hidden sm:block mr-1" />
                <button
                  onClick={() => setMarcaFiltro("todas")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                    marcaFiltro === "todas"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Todas ({sistemaActual.repuestos.length})
                </button>
                {marcasDisponibles.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMarcaFiltro(m)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                      marcaFiltro.toLowerCase() === m.toLowerCase()
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* LISTA DE CARDS DE REPUESTOS */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-slate-600 font-sans">
                  Mostrando {repuestosFiltrados.length} repuesto
                  {repuestosFiltrados.length !== 1 ? "s" : ""} solicitado
                  {repuestosFiltrados.length !== 1 ? "s" : ""}
                </p>
                <span className="text-xs text-blue-600 font-medium">
                  Demanda verificada por ChaskiRepu
                </span>
              </div>

              {repuestosFiltrados.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Search className="size-6" />
                  </div>
                  <h3 className="mt-3 text-base font-bold text-slate-900 font-sans">
                    No se encontraron repuestos con ese criterio
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 font-sans">
                    Intenta cambiar la búsqueda o restablecer los filtros de marca.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setBusqueda("");
                      setMarcaFiltro("todas");
                    }}
                    className="mt-4 rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    Restablecer filtros
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                  {repuestosFiltrados.map((repuesto) => (
                    <Card
                      key={repuesto.id}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 hover:ring-2 hover:ring-blue-100"
                    >
                      {/* IMAGEN DEL REPUESTO: TOTALMENTE VACÍA (SIN IMÁGENES FICTICIAS) */}
                      <div className="relative aspect-[16/10] w-full bg-slate-100/80 border-b border-slate-100 flex flex-col items-center justify-center text-slate-400 transition-colors group-hover:bg-blue-50/40">
                        {/* Contenedor vacío sin fotos generadas ficticias */}
                        <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center">
                          <div className="flex size-11 items-center justify-center rounded-full bg-white/90 border border-slate-200/70 text-slate-400 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors">
                            <ImageOff className="size-5 stroke-[1.5]" />
                          </div>
                          <span className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">
                            Espacio para fotografía
                          </span>
                        </div>

                        {/* Badge de cantidad de pedidos en la esquina de la imagen */}
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-600/95 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                            <Package className="size-3" />
                            {repuesto.pedidos} pedidos
                          </span>
                        </div>

                        {/* Badge de Urgencia */}
                        <div className="absolute top-3 left-3">
                          <Badge
                            className={
                              repuesto.urgencia === "Alta"
                                ? "bg-amber-500 text-white font-semibold text-[11px]"
                                : "bg-slate-700 text-white text-[11px]"
                            }
                          >
                            {repuesto.urgencia === "Alta" ? "Demanda Urgente" : "Demanda Regular"}
                          </Badge>
                        </div>
                      </div>

                      {/* DATOS DEL REPUESTO */}
                      <CardHeader className="p-4 pb-2">
                        {/* Nombre del repuesto */}
                        <CardTitle className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug font-sans">
                          {repuesto.nombre}
                        </CardTitle>

                        {/* Marca, Modelo y Año (Requeridos específicamente por el usuario) */}
                        <div className="mt-3 space-y-1.5">
                          {/* Marca */}
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-sans">
                            <Tag className="size-3.5 text-blue-600 shrink-0" />
                            <span className="text-slate-400 font-medium">Marca:</span>
                            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                              {repuesto.marca}
                            </span>
                          </div>

                          {/* Modelo */}
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-sans">
                            <Car className="size-3.5 text-blue-600 shrink-0" />
                            <span className="text-slate-400 font-medium">Modelo:</span>
                            <span className="font-semibold text-slate-800">
                              {repuesto.modelo}
                            </span>
                          </div>

                          {/* Año */}
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-sans">
                            <Calendar className="size-3.5 text-blue-600 shrink-0" />
                            <span className="text-slate-400 font-medium">Año:</span>
                            <span className="font-semibold text-slate-800">
                              {repuesto.ano}
                            </span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 pt-0 pb-3">
                        {/* Detalles adicionales de conveniencia comercial */}
                        <div className="mt-2 rounded-xl bg-blue-50/60 p-2.5 border border-blue-100/70 text-xs space-y-1">
                          {repuesto.codigoOem && (
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-slate-400">OEM ref:</span>
                              <span className="font-mono font-medium text-slate-700">
                                {repuesto.codigoOem}
                              </span>
                            </div>
                          )}
                          {repuesto.precioPromedioEstimado && (
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-slate-400">Rango de mercado:</span>
                              <span className="font-bold text-blue-900">
                                {repuesto.precioPromedioEstimado}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <span className="text-xs font-semibold text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <CheckCircle2 className="size-3.5 text-emerald-600" />
                          <span>Atender solicitud</span>
                        </span>
                        <Button
                          size="xs"
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 shadow-xs font-medium text-xs"
                        >
                          Ofertar repuesto
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sección informativa para proveedores / tiendas */}
        <div className="mt-16 rounded-3xl border border-blue-200/90 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 size-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <Badge className="bg-white/15 text-blue-100 border-white/20 mb-3 text-xs">
              Para Tiendas y Distribuidores
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              ¿Tienes stock de estos repuestos en tu almacén?
            </h3>
            <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed font-sans">
              Las oportunidades de mercado muestran los pedidos directos que los
              conductores y mecánicos están buscando en este momento en ChaskiRepu.
              Publica tu inventario para conectar con compradores de inmediato.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => router.push("/registro-proveedor")}
                className="bg-white text-blue-900 hover:bg-blue-50 font-bold px-5 py-2.5 rounded-xl shadow-md"
              >
                Registrarme como Proveedor
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/buscar")}
                className="border-white/30 text-white hover:bg-white/10 rounded-xl px-4"
              >
                Explorar Catálogo General
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
