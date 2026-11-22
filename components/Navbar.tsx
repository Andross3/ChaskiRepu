"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const ENLACES = [
  { href: "/buscar", texto: "Buscar repuestos" },
  { href: "/#como-funciona", texto: "Cómo funciona" },
  { href: "/#tiendas", texto: "Para tiendas" },
];

export function Navbar() {
  const oscuro = usePathname() === "/";

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur ${
        oscuro ? "border-white/10 bg-noche/80 text-white" : "border-linea bg-crema/90"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo claro={oscuro} />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className={`text-[15px] font-medium transition ${
                oscuro ? "text-white/75 hover:text-white" : "text-ink-2 hover:text-marino"
              }`}
            >
              {e.texto}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/entrar"
            className={`hidden rounded-xl px-4 py-2 text-[14px] font-semibold transition sm:inline-block ${
              oscuro ? "border border-white/20 text-white hover:bg-white/10" : "text-marino hover:bg-arena"
            }`}
          >
            Iniciar sesión
          </Link>
          <Link href="/entrar?crear=1" className="rounded-xl boton-primario px-4 py-2 text-[14px] font-semibold">
            Crear cuenta
          </Link>
        </div>
      </div>
    </header>
  );
}
