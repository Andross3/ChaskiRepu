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
import { LogoIcono } from "@/components/Logo";

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
      <SidebarHeader className="p-3 border-b border-blue-800/40 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 overflow-hidden group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
          aria-label="ChaskiRepu, ir al inicio"
        >
          <div className="shrink-0 flex items-center justify-center">
            <LogoIcono size={32} />
          </div>
          <span className="font-display text-[21px] font-semibold leading-none tracking-tight whitespace-nowrap group-data-[collapsible=icon]:hidden">
            <span className="text-white">Chaski</span>
            <span className="text-amber-500">Repu</span>
          </span>
        </Link>
      </SidebarHeader>

      {/* Contenido Principal con las 3 opciones requeridas */}
      <SidebarContent className="px-2 py-4 space-y-4 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2">
        <SidebarGroup className="p-0">

          <SidebarGroupContent className="mt-2 group-data-[collapsible=icon]:mt-0">
            <SidebarMenu className="gap-2 group-data-[collapsible=icon]:gap-2.5 group-data-[collapsible=icon]:items-center">
              {MENU_OPCIONES.map((opcion) => {
                const Icono = opcion.icono;
                const estaActivo =
                  pathname === opcion.href ||
                  (opcion.href !== "/" && pathname.startsWith(opcion.href));

                return (
                  <SidebarMenuItem
                    key={opcion.href}
                    className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full"
                  >
                    <SidebarMenuButton
                      render={<Link href={opcion.href} />}
                      isActive={estaActivo}
                      tooltip={opcion.titulo}
                      className={`w-full rounded-xl px-3 py-2.5 h-10 text-sm transition-all duration-200 flex items-center gap-3 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto ${
                        estaActivo
                          ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/30 hover:bg-blue-600 hover:text-white"
                          : "text-blue-100/90 hover:bg-blue-800/60 hover:text-white"
                      }`}
                    >
                      <Icono className="size-5 shrink-0 transition-transform group-hover:scale-110 group-data-[collapsible=icon]:mx-auto" />

                      <span className="text-sm font-medium tracking-tight truncate group-data-[collapsible=icon]:hidden">
                        {opcion.titulo}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer del Sidebar centrado al colapsar */}
      <SidebarFooter className="p-2.5 border-t border-blue-800/40 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
        <Link
          href="/entrar"
          title="Mi Cuenta - Iniciar sesión"
          className="flex items-center justify-between w-full rounded-xl bg-blue-900/50 hover:bg-blue-800/70 p-2.5 text-xs text-blue-100 transition border border-blue-800/50 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-none"
        >
          <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
            <div className="flex size-7 items-center justify-center rounded-lg bg-blue-700 text-white shrink-0 group-data-[collapsible=icon]:size-8">
              <User className="size-4" />
            </div>
            <div className="text-left group-data-[collapsible=icon]:hidden">
              <p className="font-semibold text-white">Mi Cuenta</p>
              <p className="text-[10px] text-blue-300">Iniciar sesión</p>
            </div>
          </div>
          <ChevronRight className="size-4 text-blue-300 group-data-[collapsible=icon]:hidden" />
        </Link>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
