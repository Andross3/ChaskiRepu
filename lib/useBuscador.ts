"use client";

import { useState } from "react";
import { aniosDe, modelosDe } from "./modelos";
import { zonasDe, type TipoVehiculo } from "./tipos";

export type Motor = "gasolina" | "hibrido" | "electrico";

export const MARCAS: Record<TipoVehiculo, string[]> = {
  auto: ["Toyota", "Suzuki", "Nissan", "Hyundai", "Kia", "Honda", "Chevrolet", "Mazda", "Volkswagen"],
  moto: ["Yamaha", "Honda", "Suzuki", "Bajaj", "Zongshen", "TVS", "Kawasaki"],
};

export const SUGERENCIAS = ["Pastillas de freno", "Filtro de aceite", "Batería", "Llantas", "Faro delantero"];

/** Estado compartido del buscador por vehículo: tipo, motor, zona, pieza y datos del vehículo. */
export function useBuscador() {
  const [tipo, setTipo] = useState<TipoVehiculo>("auto");
  const [motor, setMotor] = useState<Motor>("gasolina");
  const [zona, setZona] = useState<string | null>(null);
  const [marca, setMarcaEstado] = useState("");
  const [modelo, setModeloEstado] = useState("");
  const [anio, setAnio] = useState("");
  const [codMotor, setCodMotor] = useState("");
  const [medida, setMedida] = useState("");
  const [q, setQ] = useState("");
  const [pieza, setPieza] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");

  const zonas = zonasDe(tipo);
  const zonaActual = zonas.find((z) => z.id === zona);

  const modelos = modelosDe(tipo, marca);
  const modeloActual = modelos.find((x) => x.nombre === modelo) ?? null;
  const anios = aniosDe(modeloActual);
  const mostrarMedida = zona === "llantas" || /llanta|neum[aá]tic|goma/i.test(q);

  const params = new URLSearchParams({ tipo, motor });
  if (zona) params.set("zona", zona);
  if (marca) params.set("marca", marca);
  if (modelo.trim()) params.set("modelo", modelo.trim());
  if (anio) params.set("anio", anio);
  if (codMotor.trim()) params.set("codmotor", codMotor.trim().toUpperCase());
  if (mostrarMedida && medida.trim()) params.set("medida", medida.trim());
  const hrefBase = `/buscar?${params.toString()}`;
  if (q.trim()) params.set("q", q.trim());
  const href = `/buscar?${params.toString()}`;

  function setMarca(v: string) {
    setMarcaEstado(v);
    setModeloEstado("");
    setAnio("");
    setCodMotor("");
  }

  function setModelo(v: string) {
    setModeloEstado(v);
    const nuevo = modelosDe(tipo, marca).find((x) => x.nombre === v);
    if (anio && nuevo && (Number(anio) < nuevo.desde || Number(anio) > nuevo.hasta)) setAnio("");
  }

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
    setMarcaEstado("");
    setModeloEstado("");
    setAnio("");
    setCodMotor("");
    setMedida("");
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
    modelos,
    anio,
    setAnio,
    anios,
    codMotor,
    setCodMotor,
    medida,
    setMedida,
    mostrarMedida,
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
