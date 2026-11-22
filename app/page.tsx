import Image from "next/image";
import Link from "next/link";
import { Destacados } from "@/components/Destacados";
import { EtiquetaCondicion } from "@/components/Etiqueta";
import { Portada } from "@/components/Portada";
import { LOGOS_MARCA, MARCAS_DESTACADAS } from "@/lib/marcas";
import { CONDICIONES } from "@/lib/tipos";

const PASOS = [
  {
    n: "1",
    titulo: "Encuentra",
    texto:
      "Elige tu vehículo, toca la zona que falla o describe la pieza. Te mostramos el repuesto exacto en tiendas de tu ciudad.",
  },
  {
    n: "2",
    titulo: "Reserva",
    texto:
      "Aparta el repuesto con una pequeña comisión antes de que se acabe. Pagas el resto al recogerlo o recibirlo.",
  },
  {
    n: "3",
    titulo: "Recibe",
    texto: "Recógelo en la tienda o pídelo a tu casa si la tienda hace envíos. Tú no das vueltas.",
  },
];

export default function Inicio() {
  return (
    <main>
      <Portada />

      <section id="marcas" className="scroll-mt-20 border-b border-linea bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-marino sm:text-4xl">
            Busca por la marca de tu vehículo
          </h2>
          <p className="mt-2 max-w-xl text-[16px] text-ink-2">Toca el logo y mira los repuestos disponibles.</p>
          <ul className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-9">
            {MARCAS_DESTACADAS.map((m) => (
              <li key={m}>
                <Link
                  href={`/buscar?tipo=auto&marca=${encodeURIComponent(m)}`}
                  aria-label={`Repuestos para ${m}`}
                  className="revelar group flex h-24 items-center justify-center rounded-2xl border border-linea bg-white p-3 sombra-suave transition hover:-translate-y-1 hover:border-azul/50"
                >
                  {LOGOS_MARCA[m] ? (
                    <Image
                      src={LOGOS_MARCA[m]}
                      alt={m}
                      width={240}
                      height={160}
                      className="h-full w-full object-contain transition group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-center text-[15px] font-bold text-marino">{m}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-marino sm:text-[44px]">
            Encuentra, reserva y recibe
          </h2>
          <p className="mt-3 max-w-xl text-[17px] text-ink-2">Tres pasos para dejar de caminar de tienda en tienda.</p>
          <div className="mt-9 grid gap-6 md:grid-cols-3">
            {PASOS.map((p) => (
              <article key={p.n} className="revelar rounded-2xl border border-linea bg-white p-7 sombra-suave">
                <span className="flex h-11 w-11 items-center justify-center rounded-full boton-primario font-display text-xl font-semibold">
                  {p.n}
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold text-marino">{p.titulo}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{p.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-linea bg-arena py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-marino sm:text-4xl">
            Original, alternativo, usado o restaurado
          </h2>
          <p className="mt-3 max-w-xl text-[17px] text-ink-2">
            Tú decides cuánto quieres pagar. Siempre sabes qué estás comprando.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {["original", "alternativo", "usado", "restaurado"].map((k) => (
              <div key={k} className="revelar rounded-2xl border border-linea bg-white p-5">
                <EtiquetaCondicion condicion={k} />
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{CONDICIONES[k].desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
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

      <section id="tiendas" className="scroll-mt-20 plano-tecnico py-16 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wider text-ambar">Para tiendas</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-[44px] sm:leading-[1.1]">
              Vende a quien ya te está buscando
            </h2>
            <ul className="mt-6 space-y-3 text-[17px] text-white/85">
              {[
                "Publica tus repuestos nuevos, usados y restaurados.",
                "Recibe reservas y confírmalas desde tu panel.",
                "Mira qué repuestos busca la gente y no encuentra.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ambar text-[11px] font-bold text-marino">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/entrar?rol=tienda"
              className="mt-8 inline-block rounded-xl boton-ambar px-7 py-3.5 text-[16px] font-semibold"
            >
              Registrar mi tienda
            </Link>
          </div>

          <div className="rounded-3xl bg-white p-5 text-ink sombra-alta">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl font-semibold text-marino">Oportunidades de venta</p>
              <span className="rounded-full bg-ambar-suave px-3 py-0.5 text-[12px] font-semibold text-[#8a4300]">
                3 nuevas
              </span>
            </div>
            {[
              ["3 personas buscan", "Pastillas de freno · Suzuki Swift 2018", "hace 12 min"],
              ["2 personas buscan", "Batería de litio · moto eléctrica", "hace 40 min"],
              ["1 persona busca", "Faro delantero LED · Toyota Prius", "hace 2 h"],
            ].map(([a, b, c]) => (
              <div
                key={b}
                className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-linea bg-hielo px-4 py-3"
              >
                <div>
                  <p className="text-[15px] font-semibold text-marino">{a}</p>
                  <p className="text-[13px] text-ink-2">{b}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] text-ink-2">{c}</p>
                  <span className="mt-1 inline-block rounded-lg bg-marino px-3 py-1 text-[12px] font-semibold text-white">
                    Ofrecer
                  </span>
                </div>
              </div>
            ))}
            <p className="mt-3 text-[12px] text-ink-2">Vista de ejemplo del panel de la tienda.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
