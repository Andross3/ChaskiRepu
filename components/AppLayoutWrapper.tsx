"use client";

import { ReactNode } from "react";
import Link from "next/link";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { Toaster } from "@/components/ui/toast";

export function AppLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <Toaster>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset className="flex flex-col min-h-screen bg-slate-50/50">
          {/* Barra superior mínima con el trigger del sidebar (sin el navbar anterior) */}
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-blue-100/80 bg-white/95 px-4 backdrop-blur-md">
            <SidebarTrigger className="size-9 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition" />
            <Separator orientation="vertical" className="h-5 bg-blue-100" />

            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-900/80 tracking-wide uppercase">
                  Panel ChaskiRepu
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/entrar"
                  className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                >
                  Mi Cuenta
                </Link>
              </div>
            </div>
          </header>

          {/* Contenido de la página */}
          <div className="flex-1 flex flex-col">{children}</div>

          {/* Footer */}
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </Toaster>
  );
}
