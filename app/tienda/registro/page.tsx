import type { Metadata } from "next";
import { RegistroTienda } from "@/components/RegistroTienda";

export const metadata: Metadata = {
  title: "Datos de tu tienda | ChaskiRepu",
};

export default function PaginaRegistroTienda() {
  return (
    <main>
      <RegistroTienda />
    </main>
  );
}
