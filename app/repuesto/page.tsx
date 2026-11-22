import type { Metadata } from "next";
import { Suspense } from "react";
import { DetalleRepuesto } from "@/components/DetalleRepuesto";

export const metadata: Metadata = {
  title: "Repuesto | ChaskiRepu",
};

export default function PaginaRepuesto() {
  return (
    <main>
      <Suspense fallback={<div className="mx-auto max-w-6xl px-6 py-16 font-display text-xl font-bold">Cargando...</div>}>
        <DetalleRepuesto />
      </Suspense>
    </main>
  );
}
