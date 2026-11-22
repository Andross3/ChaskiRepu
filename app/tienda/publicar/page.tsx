import type { Metadata } from "next";
import { PublicarRepuesto } from "@/components/PublicarRepuesto";

export const metadata: Metadata = {
  title: "Publicar repuesto | ChaskiRepu",
};

export default function PaginaPublicar() {
  return (
    <main>
      <PublicarRepuesto />
    </main>
  );
}
