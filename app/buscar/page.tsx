import type { Metadata } from "next";
import { Suspense } from "react";
import { BuscarCliente } from "@/components/BuscarCliente";

export const metadata: Metadata = {
  title: "Buscar repuestos | ChaskiRepu",
};

export default function PaginaBuscar() {
  return (
    <main>
      <Suspense fallback={<div className="mx-auto max-w-6xl px-6 py-16 font-display text-xl font-bold">Cargando...</div>}>
        <BuscarCliente />
      </Suspense>
    </main>
  );
}
