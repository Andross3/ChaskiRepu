import type { Metadata } from "next";
import { PanelTienda } from "@/components/PanelTienda";

export const metadata: Metadata = {
  title: "Panel de tienda | ChaskiRepu",
};

export default function PaginaTienda() {
  return (
    <main>
      <PanelTienda />
    </main>
  );
}
