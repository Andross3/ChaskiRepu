import type { TipoVehiculo } from "./tipos";

export interface ModeloVehiculo {
  nombre: string;
  /** Año aproximado de inicio de fabricación o importación. */
  desde: number;
  /** Año aproximado de fin; 2026 si todavía se vende. */
  hasta: number;
  grupo: string;
}

const HOY = 2026;

/** Atajo: m("Corolla", 1990, HOY, "Sedanes y hatchbacks"). */
const m = (nombre: string, desde: number, hasta: number, grupo: string): ModeloVehiculo => ({
  nombre,
  desde,
  hasta,
  grupo,
});

/**
 * Modelos por marca. Los años son aproximados y sirven para acotar la lista de años
 * que se ofrece al usuario; la compatibilidad exacta la confirma la tienda.
 */
const AUTOS: Record<string, ModeloVehiculo[]> = {
  Toyota: [
    m("Corolla", 1990, HOY, "Sedanes y hatchbacks"),
    m("Corolla Fielder", 2000, HOY, "Sedanes y hatchbacks"),
    m("Axio", 2006, HOY, "Sedanes y hatchbacks"),
    m("RunX", 2000, 2006, "Sedanes y hatchbacks"),
    m("Yaris", 1999, HOY, "Sedanes y hatchbacks"),
    m("Vitz", 1999, 2019, "Sedanes y hatchbacks"),
    m("Agya", 2013, HOY, "Sedanes y hatchbacks"),
    m("Starlet", 1990, 1999, "Sedanes y hatchbacks"),
    m("Ist", 2002, 2016, "Sedanes y hatchbacks"),
    m("Raum", 1997, 2011, "Sedanes y hatchbacks"),
    m("Ractis", 2005, 2016, "Sedanes y hatchbacks"),
    m("Funcargo", 1999, 2005, "Sedanes y hatchbacks"),
    m("Camry", 1990, HOY, "Sedanes y hatchbacks"),
    m("Prius", 1997, HOY, "Sedanes y hatchbacks"),
    m("Etios", 2012, 2020, "Sedanes y hatchbacks"),
    m("RAV4", 1994, HOY, "SUVs y vagonetas"),
    m("Land Cruiser Prado", 1990, HOY, "SUVs y vagonetas"),
    m("Land Cruiser Serie 70", 1990, HOY, "SUVs y vagonetas"),
    m("Land Cruiser Serie 200", 2007, 2021, "SUVs y vagonetas"),
    m("Land Cruiser Serie 300", 2021, HOY, "SUVs y vagonetas"),
    m("Fortuner (SW4)", 2005, HOY, "SUVs y vagonetas"),
    m("4Runner", 1990, HOY, "SUVs y vagonetas"),
    m("Rush", 2006, HOY, "SUVs y vagonetas"),
    m("Raize", 2019, HOY, "SUVs y vagonetas"),
    m("Corolla Cross", 2020, HOY, "SUVs y vagonetas"),
    m("Caldina", 1992, 2007, "SUVs y vagonetas"),
    m("Ipsum", 1996, 2009, "SUVs y vagonetas"),
    m("Spacio", 1997, 2007, "SUVs y vagonetas"),
    m("Wish", 2003, 2017, "SUVs y vagonetas"),
    m("Gaia", 1998, 2004, "SUVs y vagonetas"),
    m("Highlander", 2000, HOY, "SUVs y vagonetas"),
    m("Harrier", 1997, HOY, "SUVs y vagonetas"),
    m("C-HR", 2016, HOY, "SUVs y vagonetas"),
    m("FJ Cruiser", 2006, 2022, "SUVs y vagonetas"),
    m("Hilux", 1990, HOY, "Camionetas"),
    m("Tacoma", 1995, HOY, "Camionetas"),
    m("Tundra", 2000, HOY, "Camionetas"),
    m("Probox", 2002, HOY, "Trabajo, minibuses y furgonetas"),
    m("Succeed", 2002, HOY, "Trabajo, minibuses y furgonetas"),
    m("Hiace", 1990, HOY, "Trabajo, minibuses y furgonetas"),
    m("Coaster", 1990, HOY, "Trabajo, minibuses y furgonetas"),
    m("Noah", 2001, HOY, "Trabajo, minibuses y furgonetas"),
    m("Voxy", 2001, HOY, "Trabajo, minibuses y furgonetas"),
    m("TownAce", 1992, HOY, "Trabajo, minibuses y furgonetas"),
    m("LiteAce", 1992, HOY, "Trabajo, minibuses y furgonetas"),
    m("Avanza", 2003, HOY, "Trabajo, minibuses y furgonetas"),
    m("Dyna", 1990, HOY, "Trabajo, minibuses y furgonetas"),
  ],
  Suzuki: [
    m("Swift", 1990, HOY, "Autos"),
    m("Alto", 1990, HOY, "Autos"),
    m("Celerio", 2009, HOY, "Autos"),
    m("Baleno", 1996, HOY, "Autos"),
    m("Dzire", 2008, HOY, "Autos"),
    m("Ignis", 2000, HOY, "Autos"),
    m("S-Presso", 2019, HOY, "Autos"),
    m("Vitara", 1990, HOY, "SUVs y camionetas"),
    m("Grand Vitara", 1998, 2016, "SUVs y camionetas"),
    m("Jimny", 1990, HOY, "SUVs y camionetas"),
    m("Samurai", 1990, 2004, "SUVs y camionetas"),
    m("Fronx", 2023, HOY, "SUVs y camionetas"),
    m("Ertiga", 2012, HOY, "Familiares y trabajo"),
    m("APV", 2005, HOY, "Familiares y trabajo"),
    m("Carry", 1990, HOY, "Familiares y trabajo"),
  ],
  Nissan: [
    m("March", 2010, HOY, "Autos"),
    m("Versa", 2012, HOY, "Autos"),
    m("Sentra", 1990, HOY, "Autos"),
    m("Tiida", 2004, 2018, "Autos"),
    m("Note", 2005, 2020, "Autos"),
    m("Almera", 1995, 2018, "Autos"),
    m("Kicks", 2016, HOY, "SUVs y camionetas"),
    m("Juke", 2010, 2019, "SUVs y camionetas"),
    m("Qashqai", 2007, HOY, "SUVs y camionetas"),
    m("X-Trail", 2001, HOY, "SUVs y camionetas"),
    m("Murano", 2003, 2021, "SUVs y camionetas"),
    m("Patrol", 1990, HOY, "SUVs y camionetas"),
    m("Frontier", 1998, HOY, "SUVs y camionetas"),
    m("Navara", 2005, HOY, "SUVs y camionetas"),
    m("NP300", 2008, HOY, "SUVs y camionetas"),
    m("Urvan", 1990, HOY, "SUVs y camionetas"),
  ],
  Hyundai: [
    m("Atos", 1998, 2014, "Autos"),
    m("Getz", 2002, 2011, "Autos"),
    m("Accent", 1995, HOY, "Autos"),
    m("Elantra", 1992, HOY, "Autos"),
    m("i10", 2007, HOY, "Autos"),
    m("Grand i10", 2013, HOY, "Autos"),
    m("i20", 2008, HOY, "Autos"),
    m("Tucson", 2004, HOY, "SUVs y camionetas"),
    m("Santa Fe", 2000, HOY, "SUVs y camionetas"),
    m("Creta", 2015, HOY, "SUVs y camionetas"),
    m("Kona", 2017, HOY, "SUVs y camionetas"),
    m("Venue", 2019, HOY, "SUVs y camionetas"),
    m("H-1", 1998, HOY, "Familiares y trabajo"),
    m("Porter", 1990, HOY, "Familiares y trabajo"),
  ],
  Kia: [
    m("Picanto", 2004, HOY, "Autos"),
    m("Morning", 2004, HOY, "Autos"),
    m("Rio", 2000, HOY, "Autos"),
    m("Cerato", 2004, HOY, "Autos"),
    m("Soul", 2009, HOY, "Autos"),
    m("Stonic", 2017, HOY, "Autos"),
    m("Sportage", 1995, HOY, "SUVs y camionetas"),
    m("Seltos", 2019, HOY, "SUVs y camionetas"),
    m("Sorento", 2002, HOY, "SUVs y camionetas"),
    m("Carnival", 1999, HOY, "Familiares y trabajo"),
    m("K2700", 1990, HOY, "Familiares y trabajo"),
  ],
  Honda: [
    m("Fit", 2001, 2020, "Autos"),
    m("City", 1997, HOY, "Autos"),
    m("Civic", 1990, HOY, "Autos"),
    m("Accord", 1990, HOY, "Autos"),
    m("Stream", 2000, 2014, "Autos"),
    m("CR-V", 1995, HOY, "SUVs y camionetas"),
    m("HR-V", 1999, HOY, "SUVs y camionetas"),
    m("Vezel", 2013, 2021, "SUVs y camionetas"),
    m("Pilot", 2002, HOY, "SUVs y camionetas"),
    m("Freed", 2008, HOY, "Familiares y trabajo"),
    m("Odyssey", 1994, HOY, "Familiares y trabajo"),
  ],
  Chevrolet: [
    m("Spark", 2005, HOY, "Autos"),
    m("Aveo", 2004, 2020, "Autos"),
    m("Sail", 2010, HOY, "Autos"),
    m("Corsa", 1995, 2012, "Autos"),
    m("Optra", 2004, 2012, "Autos"),
    m("Cruze", 2009, 2023, "Autos"),
    m("Onix", 2012, HOY, "Autos"),
    m("Tracker", 2013, HOY, "SUVs y camionetas"),
    m("Captiva", 2007, 2018, "SUVs y camionetas"),
    m("Blazer", 1990, 2005, "SUVs y camionetas"),
    m("Trailblazer", 2012, HOY, "SUVs y camionetas"),
    m("Luv", 1990, 2015, "SUVs y camionetas"),
    m("D-Max", 2012, HOY, "SUVs y camionetas"),
    m("Silverado", 1999, HOY, "SUVs y camionetas"),
  ],
  Mazda: [
    m("Demio", 1996, 2014, "Autos"),
    m("323", 1990, 2003, "Autos"),
    m("Mazda2", 2007, HOY, "Autos"),
    m("Mazda3", 2003, HOY, "Autos"),
    m("Axela", 2003, 2019, "Autos"),
    m("Atenza", 2002, 2019, "Autos"),
    m("CX-3", 2015, HOY, "SUVs y camionetas"),
    m("CX-30", 2019, HOY, "SUVs y camionetas"),
    m("CX-5", 2012, HOY, "SUVs y camionetas"),
    m("Tribute", 2000, 2011, "SUVs y camionetas"),
    m("BT-50", 2006, HOY, "SUVs y camionetas"),
  ],
  Volkswagen: [
    m("Gol", 1990, 2023, "Autos"),
    m("Fox", 2003, 2021, "Autos"),
    m("Polo", 1995, HOY, "Autos"),
    m("Voyage", 2008, 2023, "Autos"),
    m("Golf", 1990, HOY, "Autos"),
    m("Jetta", 1990, HOY, "Autos"),
    m("Vento", 2014, 2022, "Autos"),
    m("Passat", 1990, 2023, "Autos"),
    m("T-Cross", 2019, HOY, "SUVs y camionetas"),
    m("Tiguan", 2007, HOY, "SUVs y camionetas"),
    m("Amarok", 2010, HOY, "SUVs y camionetas"),
    m("Saveiro", 1990, HOY, "SUVs y camionetas"),
    m("Caddy", 1995, HOY, "Familiares y trabajo"),
    m("Kombi", 1990, 2014, "Familiares y trabajo"),
  ],
};

const MOTOS: Record<string, ModeloVehiculo[]> = {
  Yamaha: [
    m("YBR 125", 2005, HOY, "Motos"),
    m("FZ 150", 2014, HOY, "Motos"),
    m("FZ 250", 2018, HOY, "Motos"),
    m("XTZ 125", 2005, HOY, "Motos"),
    m("XTZ 250", 2008, HOY, "Motos"),
    m("MT-03", 2016, HOY, "Motos"),
    m("R15", 2008, HOY, "Motos"),
    m("NMAX", 2016, HOY, "Motos"),
  ],
  Honda: [
    m("CG 125", 1990, 2018, "Motos"),
    m("CG 150", 2004, 2022, "Motos"),
    m("XR 150L", 2014, HOY, "Motos"),
    m("XRE 300", 2010, HOY, "Motos"),
    m("CB 190R", 2015, HOY, "Motos"),
    m("Wave 110", 2008, HOY, "Motos"),
    m("Biz 125", 2005, HOY, "Motos"),
    m("PCX 150", 2014, HOY, "Motos"),
  ],
  Suzuki: [
    m("GN 125", 1990, HOY, "Motos"),
    m("Gixxer 150", 2015, HOY, "Motos"),
    m("DR 150", 2012, HOY, "Motos"),
    m("V-Strom 250", 2017, HOY, "Motos"),
  ],
  Bajaj: [
    m("Boxer 150", 2008, HOY, "Motos"),
    m("Pulsar 180", 2008, HOY, "Motos"),
    m("Pulsar NS 200", 2012, HOY, "Motos"),
    m("Dominar 400", 2017, HOY, "Motos"),
    m("Discover 125", 2008, 2020, "Motos"),
  ],
  Zongshen: [m("ZS 150", 2008, HOY, "Motos"), m("ZS 200", 2012, HOY, "Motos")],
  TVS: [m("Apache 160", 2012, HOY, "Motos"), m("Apache 200", 2016, HOY, "Motos"), m("HLX 125", 2010, HOY, "Motos")],
  Kawasaki: [m("Ninja 300", 2013, HOY, "Motos"), m("Ninja 400", 2018, HOY, "Motos"), m("KLX 250", 2000, HOY, "Motos")],
};

export function modelosDe(tipo: TipoVehiculo, marca: string): ModeloVehiculo[] {
  return (tipo === "moto" ? MOTOS : AUTOS)[marca] ?? [];
}

/** Años que se ofrecen para un modelo: del más nuevo al más antiguo. Sin modelo, un rango general. */
export function aniosDe(modelo?: ModeloVehiculo | null): number[] {
  const desde = modelo?.desde ?? 1990;
  const hasta = modelo?.hasta ?? HOY;
  return Array.from({ length: hasta - desde + 1 }, (_, i) => hasta - i);
}

/** Códigos de motor frecuentes de Toyota, como sugerencia opcional. */
export const CODIGOS_MOTOR_TOYOTA = [
  "1NZ",
  "2NZ",
  "1KR",
  "1ZZ",
  "2ZR",
  "3ZR",
  "1KD",
  "2KD",
  "1GD",
  "2GD",
  "1TR",
  "2TR",
  "1GR",
  "1UZ",
  "2UZ",
  "3RZ",
];

/** Medidas de llanta muy comunes, para tocar en lugar de escribir. */
export const MEDIDAS_LLANTA = [
  "175/65 R14",
  "185/60 R15",
  "195/65 R15",
  "205/55 R16",
  "215/60 R17",
  "225/65 R17",
  "265/65 R17",
  "265/60 R18",
  "90/90-18",
  "110/70-17",
];
