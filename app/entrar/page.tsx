import type { Metadata } from "next";
import { Suspense } from "react";
import { FormularioEntrar } from "@/components/FormularioEntrar";

export const metadata: Metadata = {
  title: "Entrar | ChaskiRepu",
};

export default function PaginaEntrar() {
  return (
    <main>
      <Suspense fallback={<div className="mx-auto max-w-6xl px-6 py-16 font-display text-xl font-bold">Cargando...</div>}>
        <FormularioEntrar />
      </Suspense>
    </main>
  );
}
