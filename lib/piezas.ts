import type { TipoVehiculo } from "./tipos";

export interface Pieza {
  nombre: string;
  /** Pista corta para reconocer la pieza, sin indicaciones de reparación. */
  pista: string;
}

type Mapa = Record<string, Pieza[]>;

const AUTO: Mapa = {
  llantas: [
    { nombre: "Llanta", pista: "El neumático de goma que toca el piso." },
    { nombre: "Aro", pista: "La parte metálica donde va montada la llanta." },
    { nombre: "Tuercas de rueda", pista: "Los pernos que sujetan la rueda al eje." },
    { nombre: "Válvula", pista: "El pequeño pico por donde se infla la llanta." },
  ],
  frenos: [
    { nombre: "Pastillas de freno", pista: "Piezas planas dentro de la pinza que aprietan el disco." },
    { nombre: "Disco de freno", pista: "El plato metálico que gira junto con la rueda." },
    { nombre: "Pinza de freno", pista: "La pieza que abraza el disco y aloja las pastillas." },
    { nombre: "Zapatas y tambor", pista: "Frenos cerrados, comunes en las ruedas traseras antiguas." },
    { nombre: "Líquido de frenos", pista: "El fluido del depósito pequeño junto al motor." },
  ],
  motor: [
    { nombre: "Filtro de aceite", pista: "Cilindro que se enrosca al motor." },
    { nombre: "Filtro de aire", pista: "Caja plástica con un filtro de papel o tela." },
    { nombre: "Bujías", pista: "Piezas pequeñas que encienden la mezcla en motores a gasolina." },
    { nombre: "Correa de distribución", pista: "Correa dentada que sincroniza el motor." },
    { nombre: "Bomba de agua", pista: "Hace circular el refrigerante por el motor." },
  ],
  luces: [
    { nombre: "Faro delantero", pista: "El conjunto de luz al frente del auto." },
    { nombre: "Luz trasera", pista: "El conjunto de luz roja en la parte de atrás." },
    { nombre: "Foco", pista: "La bombilla que va dentro del faro." },
    { nombre: "Luz direccional", pista: "La luz intermitente de giro." },
  ],
  suspension: [
    { nombre: "Amortiguador", pista: "Cilindro con resorte que absorbe los golpes del camino." },
    { nombre: "Resorte", pista: "El muelle en espiral que sostiene el peso del auto." },
    { nombre: "Rótula", pista: "Articulación que une la rueda con la suspensión." },
    { nombre: "Barra estabilizadora", pista: "Barra que reduce el balanceo en las curvas." },
  ],
  bateria: [
    { nombre: "Batería 12V", pista: "La caja rectangular con dos bornes bajo el capó." },
    { nombre: "Bornes de batería", pista: "Los conectores metálicos de los cables de la batería." },
    { nombre: "Alternador", pista: "Genera electricidad mientras el motor está en marcha." },
  ],
  carroceria: [
    { nombre: "Parachoques", pista: "La defensa plástica o metálica delantera o trasera." },
    { nombre: "Espejo retrovisor", pista: "El espejo lateral de la puerta." },
    { nombre: "Capó", pista: "La tapa que cubre el motor." },
    { nombre: "Guardabarros", pista: "El panel que cubre cada rueda." },
  ],
};

const MOTO: Mapa = {
  llantas: [
    { nombre: "Llanta", pista: "El neumático de goma de la moto." },
    { nombre: "Aro", pista: "La parte metálica donde va montada la llanta." },
    { nombre: "Cámara", pista: "El tubo de aire interno de algunas llantas." },
  ],
  frenos: [
    { nombre: "Pastillas de freno", pista: "Piezas planas dentro de la pinza que aprietan el disco." },
    { nombre: "Disco de freno", pista: "El plato metálico que gira con la rueda." },
    { nombre: "Zapatas", pista: "Frenos de tambor, comunes en motos pequeñas." },
  ],
  motor: [
    { nombre: "Filtro de aceite", pista: "Pieza que filtra el aceite del motor." },
    { nombre: "Filtro de aire", pista: "Caja con filtro junto al tanque o al motor." },
    { nombre: "Bujía", pista: "Pieza pequeña que enciende la mezcla." },
  ],
  luces: [
    { nombre: "Faro delantero", pista: "La luz principal al frente de la moto." },
    { nombre: "Luz trasera", pista: "La luz roja de atrás." },
    { nombre: "Direccional", pista: "La luz intermitente de giro." },
  ],
  transmision: [
    { nombre: "Kit de arrastre", pista: "Cadena, piñón y corona, que mueven la rueda trasera." },
    { nombre: "Cadena", pista: "La cadena que une el motor con la rueda trasera." },
    { nombre: "Embrague", pista: "Discos que conectan y cortan la fuerza del motor." },
  ],
  suspension: [
    { nombre: "Amortiguador", pista: "El amortiguador trasero de la moto." },
    { nombre: "Barras de horquilla", pista: "Los tubos de la suspensión delantera." },
  ],
  bateria: [
    { nombre: "Batería 12V", pista: "La batería pequeña bajo el asiento." },
    { nombre: "Regulador de voltaje", pista: "Cuida que la batería no reciba exceso de voltaje." },
  ],
};

/** Piezas extra para vehículos eléctricos e híbridos. */
const ELECTRICO: Mapa = {
  bateria: [
    { nombre: "Batería de alto voltaje", pista: "El gran paquete de baterías del piso o del asiento." },
    { nombre: "Cargador a bordo", pista: "Convierte la corriente de la red para cargar la batería." },
    { nombre: "Puerto de carga", pista: "La entrada donde se conecta el cable de carga." },
  ],
  motor: [
    { nombre: "Motor eléctrico", pista: "El motor que mueve las ruedas, sin combustión." },
    { nombre: "Inversor", pista: "Controla la energía que va al motor eléctrico." },
    { nombre: "Controlador", pista: "La unidad electrónica que gobierna el motor." },
  ],
};

export function piezasDe(tipo: TipoVehiculo, zonaId: string, motor: "gasolina" | "hibrido" | "electrico"): Pieza[] {
  const base = (tipo === "moto" ? MOTO : AUTO)[zonaId] ?? [];
  if (motor === "gasolina") return base;
  const extra = ELECTRICO[zonaId] ?? [];
  if (motor === "electrico") {
    const sinCombustion = base.filter((p) => !/buj[ií]a|distribuci[oó]n|bomba de agua|filtro de aceite/i.test(p.nombre));
    return [...extra, ...sinCombustion];
  }
  return [...base, ...extra];
}
