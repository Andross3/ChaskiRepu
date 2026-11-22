import Link from "next/link";
import { Logo } from "./Logo";

const ENLACES = [
  { href: "/buscar", texto: "Buscar repuestos" },
  { href: "/#como-funciona", texto: "Cómo funciona" },
  { href: "/#tiendas", texto: "Para tiendas" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-linea bg-crema/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {ENLACES.map((e) => (
            <Link key={e.href} href={e.href} className="text-[15px] font-medium text-ink-2 transition hover:text-marino">
              {e.texto}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/entrar"
            className="hidden rounded-xl px-4 py-2 text-[14px] font-semibold text-marino transition hover:bg-arena sm:inline-block"
          >
            Entrar
          </Link>
          <Link
            href="/entrar?crear=1"
            className="rounded-xl boton-primario px-4 py-2 text-[14px] font-semibold"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </header>
  );
}
