import type { Metadata } from "next";
import { RegistroProveedor } from "@/components/RegistroProveedor";

export const metadata: Metadata = {
  title: "Registro de proveedor | ChaskiRepu",
  description:
    "Crea tu cuenta de proveedor, registra tu tienda y empieza a publicar repuestos en ChaskiRepu.",
};

export default function PaginaRegistroProveedor() {
  return (
    <main>
      <RegistroProveedor />
    </main>
  );
}
