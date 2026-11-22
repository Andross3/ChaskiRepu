import type { Metadata } from "next";
import { Suspense } from "react";
import { OportunidadesMercado } from "@/components/OportunidadesMercado";

export const metadata: Metadata = {
  title: "Oportunidades de mercado | ChaskiRepu",
  description:
    "Explora los sistemas de vehículos y descubre los repuestos con mayor demanda y cantidad de pedidos en tiempo real.",
};

export default function PaginaOportunidadesMercado() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="size-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            <p className="text-sm font-medium text-slate-500">
              Cargando oportunidades de mercado...
            </p>
          </div>
        </div>
      }
    >
      <OportunidadesMercado />
    </Suspense>
  );
}
