export type TipoVehiculo = "auto" | "moto";

export interface Proveedor {
  nombre: string;
  direccion: string | null;
  lat: number | null;
  lng: number | null;
  whatsapp: string | null;
}

export interface Repuesto {
  id: string;
  proveedor_id: string | null;
  nombre: string;
  categoria: string;
  posicion: string | null;
  codigo: string | null;
  equivalencias: string[] | null;
  sinonimos: string[] | null;
  condicion: string;
  precio_bs: number;
  stock: number;
  tipo_vehiculo: string;
  motor?: "gasolina" | "hibrido" | "electrico";
  proveedores?: Proveedor | null;
  ejemplo?: boolean;
}

export interface InfoCondicion {
  label: string;
  bg: string;
  fg: string;
  borde: string;
  desc: string;
}

export const CONDICIONES: Record<string, InfoCondicion> = {
  original: {
    label: "Original",
    bg: "#0a1f3d",
    fg: "#ffffff",
    borde: "#0a1f3d",
    desc: "De fábrica, la pieza exacta de tu marca.",
  },
  nuevo: {
    label: "Nuevo",
    bg: "#0a1f3d",
    fg: "#ffffff",
    borde: "#0a1f3d",
    desc: "Sin uso, directo de la tienda.",
  },
  alternativo: {
    label: "Alternativo",
    bg: "#e3efff",
    fg: "#12315f",
    borde: "#c3dcff",
    desc: "Nuevo de otra marca, con buena calidad y mejor precio.",
  },
  usado: {
    label: "Usado",
    bg: "#ffeedd",
    fg: "#8a4300",
    borde: "#ffcf9e",
    desc: "De segunda mano, probado y a buen precio.",
  },
  restaurado: {
    label: "Restaurado",
    bg: "#d9f7ec",
    fg: "#0b6b50",
    borde: "#a8e8d1",
    desc: "Reparado a nuevo, con garantía de la tienda.",
  },
};

export const condicionInfo = (c: string): InfoCondicion =>
  CONDICIONES[c?.toLowerCase()] ?? CONDICIONES.nuevo;

export interface Zona {
  id: string;
  label: string;
  categorias: string[];
}

export const ZONAS_AUTO: Zona[] = [
  { id: "llantas", label: "Llantas", categorias: ["Llantas"] },
  { id: "frenos", label: "Frenos", categorias: ["Frenos"] },
  { id: "motor", label: "Motor", categorias: ["Filtros", "Motor"] },
  { id: "luces", label: "Luces", categorias: ["Luces", "Electrico"] },
  { id: "suspension", label: "Suspensión", categorias: ["Suspension"] },
  { id: "bateria", label: "Batería", categorias: ["Electrico"] },
  { id: "carroceria", label: "Carrocería", categorias: ["Carroceria"] },
];

export const ZONAS_MOTO: Zona[] = [
  { id: "llantas", label: "Llantas", categorias: ["Llantas"] },
  { id: "frenos", label: "Frenos", categorias: ["Frenos"] },
  { id: "motor", label: "Motor", categorias: ["Filtros", "Motor"] },
  { id: "luces", label: "Luces", categorias: ["Luces", "Electrico"] },
  { id: "transmision", label: "Transmisión", categorias: ["Transmision"] },
  { id: "suspension", label: "Suspensión", categorias: ["Suspension"] },
  { id: "bateria", label: "Batería", categorias: ["Electrico"] },
];

export const zonasDe = (t: TipoVehiculo) => (t === "moto" ? ZONAS_MOTO : ZONAS_AUTO);

export function formatBs(n: number): string {
  const entero = Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Bs. ${entero}`;
}

export const COMISION_RESERVA_BS = 10;
