import type { Metadata } from "next";
import { Fraunces, Inter, Geist } from "next/font/google";
import { AppLayoutWrapper } from "@/components/AppLayoutWrapper";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChaskiRepu | Tu repuesto, sin dar vueltas",
  description:
    "Encuentra repuestos originales, alternativos, usados y restaurados para tu auto o moto, compara precios, reserva y recíbelos en tu casa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        fraunces.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body className="min-h-full">
        <AppLayoutWrapper>{children}</AppLayoutWrapper>
      </body>
    </html>
  );
}
