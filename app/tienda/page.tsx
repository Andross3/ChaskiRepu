import type { Metadata } from "next";
import { PanelTienda } from "@/components/PanelTienda";
import { Protegido } from "@/components/Protegido";

export const metadata: Metadata = {
  title: "Panel de tienda | ChaskiRepu",
};

export default function PaginaTienda() {
  return (
    <main>
      <Protegido rol="proveedor">
        <PanelTienda />
      </Protegido>
    </main>
  );
}
