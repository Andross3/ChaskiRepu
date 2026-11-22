"use client";

import { useState } from "react";
import { fotoDe } from "@/lib/fotos";
import type { Repuesto } from "@/lib/tipos";
import { Ilustracion } from "./Ilustracion";

interface Props {
  r: Repuesto;
  /** Clases de la foto (ocupa todo el recuadro por defecto). */
  claseFoto?: string;
  /** Clases de la ilustración que se muestra si no hay foto o no carga. */
  claseIlustracion?: string;
}

/** Foto del repuesto. Si no tiene foto o no carga, muestra la ilustración de su categoría. */
export function FotoRepuesto({
  r,
  claseFoto = "h-full w-full object-cover",
  claseIlustracion = "h-24 w-32",
}: Props) {
  const [fallo, setFallo] = useState(false);
  const url = fotoDe(r);

  if (!url || fallo) return <Ilustracion categoria={r.categoria} className={claseIlustracion} />;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={r.nombre} loading="lazy" onError={() => setFallo(true)} className={claseFoto} />
  );
}
