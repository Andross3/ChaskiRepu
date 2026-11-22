import type { Metadata } from "next";
import { Protegido } from "@/components/Protegido";
import { RegistroRepuesto } from "@/components/RegistroRepuesto";

export const metadata: Metadata = {
  title: "Nuevo repuesto | ChaskiRepu",
  description: "Registra un repuesto para autos o motos: fotos, condición, sistema, compatibilidad, precio y stock.",
};

export default function PaginaRegistroRepuesto() {
  return (
    <main>
      <Protegido rol="proveedor">
        <RegistroRepuesto />
      </Protegido>
    </main>
  );
}
