/** Tipos y reglas compartidas entre /api/identificar y el panel de piezas. */

export type Confianza = "alta" | "media" | "baja";

export interface ResultadoIA {
  /** "identificada": hay una pieza de la lista. "no_seguro": la IA no pudo decidir y no se inventa nada. */
  estado: "identificada" | "no_seguro";
  /** Nombre exacto de una pieza de la lista de la zona; null si no está seguro. */
  pieza: string | null;
  confianza: Confianza;
  /** Qué ve la IA en la foto, en una frase. Nunca indica cómo reparar. */
  motivo: string;
  /** Aviso fijo (lo decide el servidor, no la IA) para piezas de seguridad. */
  aviso: string | null;
}

export const AVISO_MECANICO = "Instálalo con un mecánico.";

/** Piezas de seguridad: frenos, dirección y baterías de alto voltaje. */
export function esPiezaDeSeguridad(zonaId: string, pieza: string): boolean {
  if (zonaId === "frenos") return true;
  return /freno|zapata|r[oó]tula|direcci[oó]n|terminal|alto voltaje|inversor|cargador/i.test(pieza);
}
