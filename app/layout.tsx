import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
