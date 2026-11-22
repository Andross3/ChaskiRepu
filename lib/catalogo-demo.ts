export type CondicionCatalogo = "nuevo" | "usado" | "reacondicionado";

export type MarcaCatalogo = "toyota" | "suzuki" | "nissan" | "honda" | "yamaha" | "hyundai" | "kia";

export interface RepuestoCatalogo {
  id: string;
  nombre: string;
  codigo: string;
  condicion: CondicionCatalogo;
  precio: number;
  stock: number;
  marcas: MarcaCatalogo[];
  imagenes: string[];
}

export const CATALOGO_DEMO: RepuestoCatalogo[] = [
  {
    id: "cat-1",
    nombre: "Pastillas de freno cerámicas delanteras",
    codigo: "ALT-5581",
    condicion: "nuevo",
    precio: 340,
    stock: 6,
    marcas: ["toyota", "suzuki", "nissan"],
    imagenes: ["/catalogo/freno.svg", "/catalogo/caja.svg", "/catalogo/detalle.svg"],
  },
  {
    id: "cat-2",
    nombre: "Amortiguador delantero derecho",
    codigo: "AMR-210",
    condicion: "reacondicionado",
    precio: 260,
    stock: 2,
    marcas: ["toyota", "hyundai"],
    imagenes: ["/catalogo/amortiguador.svg", "/catalogo/caja.svg", "/catalogo/detalle.svg"],
  },
  {
    id: "cat-3",
    nombre: "Batería 12V 70Ah libre de mantenimiento",
    codigo: "BAT-70L",
    condicion: "nuevo",
    precio: 780,
    stock: 9,
    marcas: ["toyota", "nissan", "honda"],
    imagenes: ["/catalogo/bateria.svg", "/catalogo/caja.svg", "/catalogo/detalle.svg"],
  },
  {
    id: "cat-4",
    nombre: "Faro delantero LED",
    codigo: "FAR-LED-7",
    condicion: "usado",
    precio: 190,
    stock: 1,
    marcas: ["suzuki", "honda"],
    imagenes: ["/catalogo/faro.svg", "/catalogo/detalle.svg", "/catalogo/caja.svg"],
  },
  {
    id: "cat-5",
    nombre: "Llanta radial 195/60 R15",
    codigo: "LL-195-60",
    condicion: "usado",
    precio: 280,
    stock: 4,
    marcas: ["toyota", "suzuki", "kia"],
    imagenes: ["/catalogo/llanta.svg", "/catalogo/detalle.svg", "/catalogo/caja.svg"],
  },
  {
    id: "cat-6",
    nombre: "Filtro de aceite de alto flujo",
    codigo: "FIL-AC-22",
    condicion: "nuevo",
    precio: 45,
    stock: 24,
    marcas: ["toyota", "nissan", "hyundai"],
    imagenes: ["/catalogo/filtro.svg", "/catalogo/caja.svg", "/catalogo/detalle.svg"],
  },
  {
    id: "cat-7",
    nombre: "Bujía de iridio",
    codigo: "BUJ-IR-9",
    condicion: "nuevo",
    precio: 65,
    stock: 16,
    marcas: ["honda", "yamaha", "suzuki"],
    imagenes: ["/catalogo/bujia.svg", "/catalogo/caja.svg", "/catalogo/detalle.svg"],
  },
  {
    id: "cat-8",
    nombre: "Radiador de aluminio",
    codigo: "RAD-AL-14",
    condicion: "reacondicionado",
    precio: 620,
    stock: 3,
    marcas: ["toyota", "nissan"],
    imagenes: ["/catalogo/radiador.svg", "/catalogo/detalle.svg", "/catalogo/caja.svg"],
  },
  {
    id: "cat-9",
    nombre: "Kit de embrague completo",
    codigo: "EMB-KIT-3",
    condicion: "nuevo",
    precio: 950,
    stock: 5,
    marcas: ["toyota", "suzuki"],
    imagenes: ["/catalogo/detalle.svg", "/catalogo/caja.svg", "/catalogo/freno.svg"],
  },
];
