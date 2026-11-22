import type { Metadata } from "next";
import { Destacados } from "@/components/Destacados";
import { Hero } from "@/components/Hero";

export const metadata: Metadata = {
  title: "Comprar repuestos | ChaskiRepu",
};

export default function PaginaComprar() {
  return (
    <main>
      <Hero saludo="Tu espacio para comprar" titulo="¿Qué repuesto buscas hoy?" />
      <section className="pb-16 pt-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-marino sm:text-4xl">
            Disponibles ahora
          </h2>
          <p className="mb-8 mt-3 max-w-xl text-[17px] text-ink-2">
            Repuestos publicados por tiendas, con precio, estado y distancia.
          </p>
          <Destacados />
        </div>
      </section>
    </main>
  );
}
