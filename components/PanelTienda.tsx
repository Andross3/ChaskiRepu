"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EtiquetaCondicion } from "./Etiqueta";
import { cargarRepuestos } from "@/lib/datos";
import { formatBs, type Repuesto } from "@/lib/tipos";

const RESERVAS = [
  ["Carla M.", "Pastillas de freno delanteras", "Recoge hoy"],
  ["Marcos P.", "Filtro de aceite Toyota", "Envío a domicilio"],
];

const OPORTUNIDADES = [
  ["3 personas buscan", "Pastillas de freno · Suzuki Swift 2018"],
  ["2 personas buscan", "Batería de litio · moto eléctrica"],
  ["1 persona busca", "Faro delantero LED · Toyota Prius"],
];

export function PanelTienda() {
  const [items, setItems] = useState<Repuesto[] | null>(null);

  useEffect(() => {
    let vivo = true;
    cargarRepuestos(false).then((r) => {
      if (vivo) setItems(r.items);
    });
    return () => {
      vivo = false;
    };
  }, []);

  const lista = items ?? [];
  const nombreTienda = lista[0]?.proveedores?.nombre ?? "Tu tienda";
  const unidades = lista.reduce((s, r) => s + r.stock, 0);
  const valor = lista.reduce((s, r) => s + r.stock * r.precio_bs, 0);

  const tarjetas = [
    ["Repuestos publicados", String(lista.length)],
    ["Unidades en stock", String(unidades)],
    ["Valor del inventario", formatBs(valor)],
    ["Reservas por confirmar", String(RESERVAS.length)],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-wider text-azul">Panel de tienda</p>
          <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight text-marino">{nombreTienda}</h1>
          <p className="mt-1 text-[15px] text-ink-2">Vista de demostración con los repuestos reales de tu base de datos.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/tienda/registro"
            className="rounded-xl border border-linea bg-white px-4 py-2.5 text-[14px] font-semibold text-marino transition hover:bg-hielo"
          >
            Editar datos de la tienda
          </Link>
          <Link href="/tienda/publicar" className="rounded-xl boton-primario px-5 py-2.5 text-[14px] font-semibold">
            Publicar repuesto
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tarjetas.map(([t, v]) => (
          <div key={t} className="rounded-2xl border border-linea bg-white p-5 sombra-suave">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-2">{t}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-marino">{items ? v : "..."}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-linea bg-white p-6 sombra-suave">
          <h2 className="font-display text-xl font-semibold text-marino">Tus repuestos</h2>
          {!items ? (
            <p className="mt-4 text-ink-2">Cargando...</p>
          ) : lista.length === 0 ? (
            <p className="mt-4 text-ink-2">Todavía no publicaste repuestos.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-linea text-[12px] uppercase tracking-wider text-ink-2">
                    <th className="py-2 pr-3 font-semibold">Repuesto</th>
                    <th className="py-2 pr-3 font-semibold">Condición</th>
                    <th className="py-2 pr-3 text-right font-semibold">Precio</th>
                    <th className="py-2 text-right font-semibold">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((r) => (
                    <tr key={r.id} className="border-b border-linea/70 last:border-0">
                      <td className="py-3 pr-3">
                        <span className="block font-semibold text-marino">{r.nombre}</span>
                        <span className="text-[12px] text-ink-2">{r.categoria}</span>
                      </td>
                      <td className="py-3 pr-3">
                        <EtiquetaCondicion condicion={r.condicion} />
                      </td>
                      <td className="py-3 pr-3 text-right font-semibold text-marino">{formatBs(r.precio_bs)}</td>
                      <td className="py-3 text-right text-marino">{r.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl border border-linea bg-white p-6 sombra-suave">
            <h2 className="font-display text-xl font-semibold text-marino">Reservas por confirmar</h2>
            <ul className="mt-3 space-y-3">
              {RESERVAS.map(([quien, que, como]) => (
                <li key={que} className="rounded-xl border border-linea bg-hielo p-3">
                  <p className="text-[14px] font-semibold text-marino">{que}</p>
                  <p className="text-[12px] text-ink-2">
                    {quien} · {como}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="rounded-lg bg-verde-suave px-3 py-1 text-[12px] font-semibold text-[#0b6b50]">Confirmar</span>
                    <span className="rounded-lg bg-rojo-suave px-3 py-1 text-[12px] font-semibold text-rojo">Rechazar</span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[12px] text-ink-2">Ejemplo de cómo se verán las reservas.</p>
          </section>

          <section className="plano-tecnico rounded-3xl p-6 text-white sombra-alta">
            <h2 className="font-display text-xl font-semibold">Oportunidades de venta</h2>
            <ul className="mt-3 space-y-2.5">
              {OPORTUNIDADES.map(([a, b]) => (
                <li key={b} className="vidrio rounded-xl px-3.5 py-2.5">
                  <p className="text-[14px] font-semibold">{a}</p>
                  <p className="text-[12px] text-white/70">{b}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[12px] text-white/60">Ejemplo de las búsquedas que verás de tus clientes.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
