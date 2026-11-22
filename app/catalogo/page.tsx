import type { Metadata } from "next";
import { CatalogoCliente } from "@/components/CatalogoCliente";

export const metadata: Metadata = {
  title: "Catálogo | ChaskiRepu",
  description: "Explora repuestos nuevos, usados y reacondicionados compatibles con tu vehículo.",
};

export default function PaginaCatalogo() {
  return (
    <main>
      <CatalogoCliente tienda="ChaskiRepu" />
    </main>
  );
}
