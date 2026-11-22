"use client";

import { useState } from "react";
import { zonasDe, type TipoVehiculo } from "./tipos";

export type Motor = "gasolina" | "hibrido" | "electrico";

export const MARCAS: Record<TipoVehiculo, string[]> = {
  auto: ["Toyota", "Suzuki", "Nissan", "Hyundai", "Kia", "Honda", "Chevrolet", "Mazda", "Volkswagen"],
  moto: ["Yamaha", "Honda", "Suzuki", "Bajaj", "Zongshen", "TVS", "Kawasaki"],
};

export const ANIOS = Array.from({ length: 32 }, (_, i) => 2026 - i);
export const SUGERENCIAS = ["Pastillas de freno", "Filtro de aceite", "Batería", "Llantas", "Faro delantero"];

/** Estado compartido del buscador por vehículo: tipo, motor, zona, pieza y datos del vehículo. */
export function useBuscador() {
  const [tipo, setTipo] = useState<TipoVehiculo>("auto");
  const [motor, setMotor] = useState<Motor>("gasolina");
  const [zona, setZona] = useState<string | null>(null);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [q, setQ] = useState("");
  const [pieza, setPieza] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");

  const zonas = zonasDe(tipo);
  const zonaActual = zonas.find((z) => z.id === zona);

  const params = new URLSearchParams({ tipo, motor });
  if (zona) params.set("zona", zona);
  if (marca) params.set("marca", marca);
  if (modelo.trim()) params.set("modelo", modelo.trim());
  if (anio) params.set("anio", anio);
  const hrefBase = `/buscar?${params.toString()}`;
  if (q.trim()) params.set("q", q.trim());
  const href = `/buscar?${params.toString()}`;

  function elegirZona(id: string | null) {
    setZona(id);
    if (pieza) setQ("");
    setPieza(null);
    setAviso("");
  }

  function elegirPieza(nombre: string | null) {
    setPieza(nombre);
    setQ(nombre ?? "");
  }

  function cambiarTipo(t: TipoVehiculo) {
    setTipo(t);
    setZona(null);
    setPieza(null);
    setQ("");
    setMarca("");
    setAviso("");
  }

  return {
    tipo,
    motor,
    setMotor,
    zona,
    zonas,
    zonaActual,
    marca,
    setMarca,
    modelo,
    setModelo,
    anio,
    setAnio,
    q,
    setQ,
    pieza,
    aviso,
    setAviso,
    hrefBase,
    href,
    elegirZona,
    elegirPieza,
    cambiarTipo,
  };
}
