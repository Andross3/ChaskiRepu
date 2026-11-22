"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PackagePlus,
  BookOpen,
  TrendingUp,
  ChevronRight,
  Sparkles,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";

const MENU_OPCIONES = [
  {
    titulo: "Agregar repuesto",
    href: "/registro-repuesto",
    icono: PackagePlus,
  },
  {
    titulo: "Ver catálogo",
    href: "/catalogo",
    icono: BookOpen,
  },
  {
    titulo: "Oportunidades del mercado",
    href: "/oportunidades-mercado",
    icono: TrendingUp,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-blue-900/50 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-950 text-white font-sans [&_[data-slot=sidebar-inner]]:bg-gradient-to-b [&_[data-slot=sidebar-inner]]:from-blue-950 [&_[data-slot=sidebar-inner]]:via-blue-900 [&_[data-slot=sidebar-inner]]:to-slate-950 [&_[data-slot=sidebar-inner]]:text-white shadow-xl"
    >
      {/* Header del Sidebar */}
      <SidebarHeader className="p-4 border-b border-blue-800/40">
        <div className="flex items-center justify-between gap-2">
          <Logo claro={true} />
        </div>
      </SidebarHeader>

      {/* Contenido Principal con las 3 opciones requeridas */}
      <SidebarContent className="px-2 py-4 space-y-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-200/70 text-[11px] font-bold uppercase tracking-wider px-2">
            Navegación
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="gap-1.5">
              {MENU_OPCIONES.map((opcion) => {
                const Icono = opcion.icono;
                const estaActivo =
                  pathname === opcion.href ||
                  (opcion.href !== "/" && pathname.startsWith(opcion.href));

                return (
                  <SidebarMenuItem key={opcion.href}>
                    <SidebarMenuButton
                      render={<Link href={opcion.href} />}
                      isActive={estaActivo}
                      tooltip={opcion.titulo}
                      className={`w-full rounded-xl px-3 py-2.5 h-auto text-sm transition-all duration-200 group ${
                        estaActivo
                          ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/30 hover:bg-blue-600 hover:text-white"
                          : "text-blue-100/90 hover:bg-blue-800/60 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                              estaActivo
                                ? "bg-white/20 text-white"
                                : "bg-blue-800/50 text-blue-300 group-hover:bg-blue-700/60 group-hover:text-white"
                            }`}
                          >
                            <Icono className="size-4" />
                          </div>
                          <span className="text-sm font-medium tracking-tight">
                            {opcion.titulo}
                          </span>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer del Sidebar */}
      <SidebarFooter className="p-3 border-t border-blue-800/40">
        <Link
          href="/entrar"
          className="flex items-center justify-between w-full rounded-xl bg-blue-900/50 hover:bg-blue-800/70 p-2.5 text-xs text-blue-100 transition border border-blue-800/50"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-blue-700 text-white">
              <User className="size-3.5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">Mi Cuenta</p>
              <p className="text-[10px] text-blue-300">Iniciar sesión</p>
            </div>
          </div>
          <ChevronRight className="size-4 text-blue-300" />
        </Link>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
