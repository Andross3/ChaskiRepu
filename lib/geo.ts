/** Ubicación de referencia del usuario (centro de La Paz) mientras no se pida el permiso del GPS. */
export const UBICACION_BASE = { lat: -16.4955, lng: -68.1336 };

export function distanciaKm(
  a: { lat: number; lng: number },
  b: { lat: number | null; lng: number | null },
): number | null {
  if (b.lat == null || b.lng == null) return null;
  const R = 6371;
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function textoDistancia(km: number | null): string {
  if (km == null) return "ubicación por confirmar";
  return `a ${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}
