import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-auto bg-noche text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo claro />
          <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/70">
            Tu repuesto, sin dar vueltas. Originales, alternativos, usados y restaurados para autos y motos.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-ambar">Para ti</p>
          <ul className="mt-3 space-y-2 text-[14px] text-white/75">
            <li><Link href="/buscar" className="hover:text-white">Buscar repuestos</Link></li>
            <li><Link href="/#como-funciona" className="hover:text-white">Cómo funciona</Link></li>
            <li><Link href="/entrar" className="hover:text-white">Entrar</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-ambar">Para tiendas</p>
          <ul className="mt-3 space-y-2 text-[14px] text-white/75">
            <li><Link href="/entrar?rol=tienda" className="hover:text-white">Registrar mi tienda</Link></li>
            <li><Link href="/#tiendas" className="hover:text-white">Oportunidades de venta</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-[12px] text-white/55">
        ChaskiRepu · Abstracthon 2026 · Prototipo: los pagos son una simulación y algunos repuestos son de ejemplo.
      </div>
    </footer>
  );
}
