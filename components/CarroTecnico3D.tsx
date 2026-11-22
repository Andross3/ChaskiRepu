"use client";

import { Billboard, Grid, Line, OrbitControls, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type MutableRefObject, type RefObject } from "react";
import * as THREE from "three";
import type { TipoVehiculo, Zona } from "@/lib/tipos";

const CIAN = "#d6c9ff";
const AZUL_LINEA = "#a58cff";
const RELLENO = "#7a5cff";
const AMBAR = "#ff8a1f";

/* ---------- utilidades de forma ---------- */

type Punto2 = [number, number];

function interpolador(puntos: Punto2[]) {
  const curva = new THREE.SplineCurve(puntos.map(([x, y]) => new THREE.Vector2(x, y)));
  const pts = curva.getPoints(260);
  return (x: number) => {
    if (x <= pts[0].x) return pts[0].y;
    if (x >= pts[pts.length - 1].x) return pts[pts.length - 1].y;
    let lo = 0;
    let hi = pts.length - 1;
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1;
      if (pts[m].x <= x) lo = m;
      else hi = m;
    }
    const a = pts[lo];
    const b = pts[hi];
    return a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x || 1);
  };
}

const techo = interpolador([
  [-2.2, 0.62],
  [-2.05, 0.76],
  [-1.7, 0.9],
  [-1.2, 0.99],
  [-0.8, 1.1],
  [-0.3, 1.2],
  [0.2, 1.18],
  [0.6, 1.05],
  [1.0, 0.86],
  [1.5, 0.74],
  [2.0, 0.62],
  [2.2, 0.5],
]);
const piso = interpolador([
  [-2.2, 0.38],
  [-2.0, 0.26],
  [-1.5, 0.2],
  [1.5, 0.2],
  [2.0, 0.26],
  [2.2, 0.34],
]);
const ancho = interpolador([
  [-2.2, 0.6],
  [-1.95, 0.8],
  [-1.2, 0.9],
  [0.4, 0.92],
  [1.5, 0.88],
  [2.0, 0.74],
  [2.2, 0.52],
]);

const CINTURA = 0.66;

/** Mitad derecha de la sección del auto en la posición x: puntos [z, y] de abajo al centro del techo. */
function seccion(x: number): Punto2[] {
  const b = piso(x);
  const t = techo(x);
  const hw = ancho(x);
  const ys = Math.min(CINTURA, t - 0.05);
  const c = Math.min(1, Math.max(0, (t - ys - 0.05) / 0.2));
  const y = (f: number) => ys + (t - ys) * f;
  return [
    [0, b],
    [hw * 0.78, b],
    [hw * 0.97, b + 0.25 * (ys - b)],
    [hw, b + 0.65 * (ys - b)],
    [hw * 0.985, ys],
    [hw * (0.98 - 0.12 * c), y(0.2)],
    [hw * (0.95 - 0.18 * c), y(0.55)],
    [hw * (0.86 - 0.2 * c), y(0.9)],
    [hw * (0.6 - 0.12 * c), t],
    [0, t],
  ];
}

function anillo(x: number): THREE.Vector3[] {
  const s = seccion(x);
  const pts: THREE.Vector3[] = [];
  for (let k = 0; k <= 9; k++) pts.push(new THREE.Vector3(x, s[k][1], s[k][0]));
  for (let k = 8; k >= 1; k--) pts.push(new THREE.Vector3(x, s[k][1], -s[k][0]));
  return pts;
}

function zSuperficie(x: number, y: number): number {
  const s = seccion(x);
  for (let k = 1; k < s.length; k++) {
    if (y <= s[k][1]) {
      const [z0, y0] = s[k - 1];
      const [z1, y1] = s[k];
      const f = y1 - y0 < 1e-6 ? 0 : (y - y0) / (y1 - y0);
      return z0 + (z1 - z0) * f;
    }
  }
  return 0;
}

function segmentosDe(puntos: THREE.Vector3[], cerrado = false): number[] {
  const out: number[] = [];
  const n = puntos.length;
  const limite = cerrado ? n : n - 1;
  for (let i = 0; i < limite; i++) {
    const a = puntos[i];
    const b = puntos[(i + 1) % n];
    out.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }
  return out;
}

function geometriaDeSegmentos(arr: number[]) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
  return g;
}

/* ---------- geometrías del auto ---------- */

function construirCarroceria() {
  const NS = 72;
  const NR = 18;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= NS; i++) {
    const x = -2.2 + (4.4 * i) / NS;
    for (const p of anillo(x)) pos.push(p.x, p.y, p.z);
  }
  for (let i = 0; i < NS; i++) {
    for (let j = 0; j < NR; j++) {
      const a = i * NR + j;
      const b = i * NR + ((j + 1) % NR);
      const c = (i + 1) * NR + j;
      const d = (i + 1) * NR + ((j + 1) % NR);
      idx.push(a, c, b, b, c, d);
    }
  }
  const cabeza = anillo(-2.2);
  const nariz = anillo(2.2);
  const cx0 = new THREE.Vector3();
  cabeza.forEach((p) => cx0.add(p));
  cx0.divideScalar(cabeza.length);
  const cx1 = new THREE.Vector3();
  nariz.forEach((p) => cx1.add(p));
  cx1.divideScalar(nariz.length);
  const base = pos.length / 3;
  pos.push(cx0.x, cx0.y, cx0.z, cx1.x, cx1.y, cx1.z);
  for (let j = 0; j < NR; j++) {
    idx.push(base, (j + 1) % NR, j);
    idx.push(base + 1, NS * NR + j, NS * NR + ((j + 1) % NR));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  return g;
}

function construirLineasAuto() {
  const NS = 72;
  const todo: number[] = [];

  for (let i = 0; i <= NS; i += 4) {
    const x = -2.2 + (4.4 * i) / NS;
    todo.push(...segmentosDe(anillo(x), true));
  }

  const longitudinales = [0, 2, 4, 6, 8, 9, 10 + (8 - 8), 10 + (8 - 6), 10 + (8 - 4), 10 + (8 - 2)];
  for (const j of longitudinales) {
    const linea: THREE.Vector3[] = [];
    for (let i = 0; i <= NS; i++) {
      const x = -2.2 + (4.4 * i) / NS;
      linea.push(anillo(x)[j]);
    }
    todo.push(...segmentosDe(linea));
  }

  const yBajo = CINTURA + 0.05;
  for (const lado of [1, -1]) {
    const poligono: THREE.Vector3[] = [];
    const xs: number[] = [];
    for (let k = 0; k <= 14; k++) xs.push(-0.95 + (1.95 * k) / 14);
    for (const x of xs) {
      const y = techo(x) - 0.075;
      poligono.push(new THREE.Vector3(x, y, lado * (zSuperficie(x, y) + 0.008)));
    }
    for (let k = xs.length - 1; k >= 0; k--) {
      const x = xs[k];
      poligono.push(new THREE.Vector3(x, yBajo, lado * (zSuperficie(x, yBajo) + 0.008)));
    }
    todo.push(...segmentosDe(poligono, true));

    for (const x of [-0.3, 0.52]) {
      const puertas: THREE.Vector3[] = [];
      for (let k = 0; k <= 8; k++) {
        const y = piso(x) + 0.1 + ((yBajo - piso(x) - 0.1) * k) / 8;
        puertas.push(new THREE.Vector3(x, y, lado * (zSuperficie(x, y) + 0.006)));
      }
      todo.push(...segmentosDe(puertas));
    }

    for (const cx of [-1.32, 1.32]) {
      const arco: THREE.Vector3[] = [];
      for (let k = 0; k <= 24; k++) {
        const th = (Math.PI * k) / 24;
        const x = cx + 0.53 * Math.cos(th);
        const y = 0.42 + 0.53 * Math.sin(th);
        arco.push(new THREE.Vector3(x, y, lado * (zSuperficie(x, y) + 0.006)));
      }
      todo.push(...segmentosDe(arco));
    }
  }
  return geometriaDeSegmentos(todo);
}

function construirRueda(radio: number, grosor: number) {
  const todo: number[] = [];
  const circulo = (r: number, z: number, n = 44) => {
    const pts: THREE.Vector3[] = [];
    for (let k = 0; k < n; k++) {
      const a = (2 * Math.PI * k) / n;
      pts.push(new THREE.Vector3(r * Math.cos(a), r * Math.sin(a), z));
    }
    return segmentosDe(pts, true);
  };
  for (const z of [-grosor, grosor]) {
    todo.push(...circulo(radio, z), ...circulo(radio * 0.72, z), ...circulo(radio * 0.3, z, 20));
    for (let k = 0; k < 5; k++) {
      const a = (2 * Math.PI * k) / 5;
      todo.push(
        radio * 0.3 * Math.cos(a),
        radio * 0.3 * Math.sin(a),
        z,
        radio * 0.72 * Math.cos(a + 0.18),
        radio * 0.72 * Math.sin(a + 0.18),
        z,
      );
    }
  }
  for (let k = 0; k < 16; k++) {
    const a = (2 * Math.PI * k) / 16;
    const x = radio * Math.cos(a);
    const y = radio * Math.sin(a);
    todo.push(x, y, -grosor, x, y, grosor);
  }
  return geometriaDeSegmentos(todo);
}

/* ---------- piezas animadas ---------- */

function Rueda({ geo, posicion }: { geo: THREE.BufferGeometry; posicion: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z -= dt * 2.4;
  });
  return (
    <group position={posicion}>
      <group ref={ref}>
        <lineSegments geometry={geo}>
          <lineBasicMaterial color={CIAN} transparent opacity={0.95} />
        </lineSegments>
      </group>
    </group>
  );
}

function Escaner({ largo, alto }: { largo: number; alto: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * 0.55;
    ref.current.position.x = Math.sin(t) * largo;
  });
  return (
    <mesh ref={ref} position={[0, alto / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[2.6, alto]} />
      <meshBasicMaterial
        color={CIAN}
        transparent
        opacity={0.06}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Pulsos() {
  const anillos = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    anillos.current.forEach((m, i) => {
      if (!m) return;
      const f = (t * 0.35 + i * 0.5) % 1;
      m.scale.setScalar(1 + f * 1.3);
      (m.material as THREE.MeshBasicMaterial).opacity = 0.35 * (1 - f);
    });
  });
  return (
    <>
      {[0, 1].map((i) => (
        <mesh
          key={i}
          ref={(m) => {
            anillos.current[i] = m;
          }}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, 0]}
        >
          <ringGeometry args={[2.5, 2.54, 96]} />
          <meshBasicMaterial color={CIAN} transparent opacity={0.3} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

type Botones = MutableRefObject<Record<string, HTMLDivElement | null>>;

const _mundo = new THREE.Vector3();
const _pantalla = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _rayo = new THREE.Raycaster();

function actualizarBotones(
  grupo: THREE.Group | null,
  ocluir: THREE.Mesh | null,
  zonas: Zona[],
  posiciones: Record<string, [number, number, number]>,
  botones: Record<string, HTMLDivElement | null>,
  camera: THREE.Camera,
  size: { width: number; height: number },
) {
  if (!grupo) return;
  grupo.updateWorldMatrix(true, false);
  ocluir?.updateWorldMatrix(true, false);
  for (const z of zonas) {
    const el = botones[z.id];
    const p = posiciones[z.id];
    if (!el || !p) continue;
    _mundo.set(p[0], p[1], p[2]);
    grupo.localToWorld(_mundo);
    _pantalla.copy(_mundo).project(camera);
    const x = (_pantalla.x * 0.5 + 0.5) * size.width;
    const y = (-_pantalla.y * 0.5 + 0.5) * size.height;

    _dir.copy(_mundo).sub(camera.position);
    const distancia = _dir.length();
    _dir.normalize();
    _rayo.set(camera.position, _dir);
    _rayo.far = distancia - 0.04;
    const tapado = ocluir ? _rayo.intersectObject(ocluir, false).length > 0 : false;
    const visible = !tapado && _pantalla.z < 1;

    el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    el.style.opacity = visible ? "1" : "0";
    el.style.pointerEvents = visible ? "auto" : "none";
  }
}

/**
 * Lleva cada botón HTML a su lugar en pantalla siguiendo el punto 3D, sin re-renderizar React.
 * Oculta el botón cuando la carrocería lo tapa desde la cámara.
 */
function Proyector({
  zonas,
  posiciones,
  ocluir,
  botones,
}: {
  zonas: Zona[];
  posiciones: Record<string, [number, number, number]>;
  ocluir: RefObject<THREE.Mesh | null>;
  botones: Botones;
}) {
  const { camera, size } = useThree();
  const grupo = useRef<THREE.Group>(null);

  useFrame(() => {
    actualizarBotones(grupo.current, ocluir.current, zonas, posiciones, botones.current, camera, size);
  });

  return <group ref={grupo} />;
}

/* ---------- auto ---------- */

const POS_AUTO: Record<string, [number, number, number]> = {
  llantas: [-1.32, 0.45, 1.02],
  frenos: [1.32, 0.45, 1.02],
  motor: [1.45, 0.82, 0],
  luces: [2.13, 0.56, 0.4],
  suspension: [1.32, 0.86, 0.66],
  bateria: [0, 0.34, 0.98],
  carroceria: [-0.1, 0.58, 0.98],
};

function Auto({ zonas, botones }: Props) {
  const carroceria = useMemo(() => construirCarroceria(), []);
  const lineas = useMemo(() => construirLineasAuto(), []);
  const rueda = useMemo(() => construirRueda(0.42, 0.11), []);
  const silueta = useMemo(() => {
    const arriba: [number, number, number][] = [];
    const abajo: [number, number, number][] = [];
    for (let i = 0; i <= 120; i++) {
      const x = -2.2 + (4.4 * i) / 120;
      arriba.push([x, techo(x), 0]);
      abajo.push([x, piso(x), 0]);
    }
    return { arriba, abajo };
  }, []);
  const ocluir = useRef<THREE.Mesh>(null);

  return (
    <group>
      <mesh geometry={carroceria}>
        <meshBasicMaterial color={RELLENO} transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={ocluir} geometry={carroceria} scale={0.985}>
        <meshBasicMaterial colorWrite={false} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={lineas}>
        <lineBasicMaterial color={CIAN} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <Line points={silueta.arriba} color="#ffffff" lineWidth={1.8} transparent opacity={0.9} />
      <Line points={silueta.abajo} color={AZUL_LINEA} lineWidth={1.4} transparent opacity={0.8} />

      <Rueda geo={rueda} posicion={[-1.32, 0.42, 0.82]} />
      <Rueda geo={rueda} posicion={[1.32, 0.42, 0.82]} />
      <Rueda geo={rueda} posicion={[-1.32, 0.42, -0.82]} />
      <Rueda geo={rueda} posicion={[1.32, 0.42, -0.82]} />

      {[-1, 1].map((lado) => (
        <group key={lado}>
          <mesh position={[2.14, 0.5, lado * 0.42]}>
            <boxGeometry args={[0.07, 0.05, 0.34]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-2.17, 0.54, lado * 0.46]}>
            <boxGeometry args={[0.05, 0.06, 0.36]} />
            <meshBasicMaterial color={AMBAR} />
          </mesh>
        </group>
      ))}

      <Proyector zonas={zonas} posiciones={POS_AUTO} ocluir={ocluir} botones={botones} />
    </group>
  );
}

/* ---------- moto ---------- */

const POS_MOTO: Record<string, [number, number, number]> = {
  llantas: [-1.05, 0.45, 0.2],
  frenos: [1.05, 0.45, 0.2],
  motor: [0.1, 0.55, 0.3],
  luces: [1.18, 1.05, 0.12],
  transmision: [-0.55, 0.42, 0.24],
  suspension: [1.0, 0.8, 0.16],
  bateria: [-0.3, 0.86, 0.26],
};

function Moto({ zonas, botones }: Props) {
  const rueda = useMemo(() => construirRueda(0.47, 0.06), []);
  const marco = useMemo(() => {
    const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);
    const tramos: THREE.Vector3[][] = [
      [v(-1.05, 0.47), v(-0.55, 0.9), v(0.35, 0.98), v(0.98, 1.05)],
      [v(-1.05, 0.47), v(-0.15, 0.5), v(0.55, 0.52), v(0.98, 1.05)],
      [v(-0.55, 0.9), v(-0.15, 0.5)],
      [v(1.05, 0.47), v(0.98, 1.12)],
      [v(0.98, 1.12), v(0.88, 1.28, 0.42), v(0.88, 1.28, -0.42)],
      [v(0.98, 1.12), v(0.88, 1.28, 0.42)],
      [v(0.98, 1.12), v(0.88, 1.28, -0.42)],
      [v(-0.15, 0.42, 0.22), v(-1.25, 0.58, 0.22)],
      [v(-0.15, 0.42, -0.22), v(-1.25, 0.58, -0.22)],
      [v(-1.05, 0.47), v(-0.2, 0.55)],
    ];
    const arr: number[] = [];
    tramos.forEach((t) => arr.push(...segmentosDe(t)));
    return geometriaDeSegmentos(arr);
  }, []);
  const tanque = useMemo(() => {
    const g = new THREE.SphereGeometry(0.34, 14, 9);
    g.scale(1.5, 0.8, 0.8);
    g.translate(0.45, 1.06, 0);
    return new THREE.WireframeGeometry(g);
  }, []);
  const motor = useMemo(() => new THREE.WireframeGeometry(new THREE.BoxGeometry(0.7, 0.42, 0.34, 4, 3, 2)), []);
  const asiento = useMemo(() => {
    const g = new THREE.BoxGeometry(0.85, 0.1, 0.3, 6, 1, 2);
    g.translate(-0.45, 0.98, 0);
    return new THREE.WireframeGeometry(g);
  }, []);
  const faro = useMemo(() => new THREE.WireframeGeometry(new THREE.SphereGeometry(0.14, 10, 8)), []);
  const ocluir = useRef<THREE.Mesh>(null);

  return (
    <group>
      <Rueda geo={rueda} posicion={[-1.05, 0.47, 0]} />
      <Rueda geo={rueda} posicion={[1.05, 0.47, 0]} />
      <lineSegments geometry={marco}>
        <lineBasicMaterial color={CIAN} transparent opacity={0.95} />
      </lineSegments>
      <lineSegments geometry={tanque}>
        <lineBasicMaterial color={AZUL_LINEA} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <lineSegments geometry={asiento}>
        <lineBasicMaterial color={AZUL_LINEA} transparent opacity={0.8} />
      </lineSegments>
      <lineSegments geometry={motor} position={[0.15, 0.58, 0]}>
        <lineBasicMaterial color={CIAN} transparent opacity={0.75} />
      </lineSegments>
      <lineSegments geometry={faro} position={[1.12, 1.08, 0]}>
        <lineBasicMaterial color="#ffffff" />
      </lineSegments>
      <mesh ref={ocluir} position={[0.2, 0.8, 0]}>
        <boxGeometry args={[1.5, 0.5, 0.05]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <Proyector zonas={zonas} posiciones={POS_MOTO} ocluir={ocluir} botones={botones} />
    </group>
  );
}

/* ---------- escena ---------- */

interface Props {
  zonas: Zona[];
  zonaId: string | null;
  onZona: (id: string | null) => void;
  botones: Botones;
}

interface ControlesOrbita {
  target: THREE.Vector3;
  update(): void;
}

const TARGET_BASE_ARR: [number, number, number] = [0, 0.55, 0];
const TARGET_BASE = new THREE.Vector3(...TARGET_BASE_ARR);
const CAMARA_BASE = new THREE.Vector3(4.5, 2.1, 4.9);
const _destinoTarget = new THREE.Vector3();
const _destinoCamara = new THREE.Vector3();

/** Acerca la cámara a la zona elegida (o la devuelve a la vista general). */
function enfocar(
  controles: ControlesOrbita | null,
  camera: THREE.Camera,
  zona: [number, number, number] | null,
  escala: number,
  panelAbajo: boolean,
) {
  if (!controles) return;
  if (zona) {
    _destinoTarget.set(
      zona[0] * escala + (panelAbajo ? 0 : 0.6),
      zona[1] * escala - (panelAbajo ? 0.3 : 0),
      zona[2] * escala,
    );
    _destinoCamara.set(_destinoTarget.x + 1.5, _destinoTarget.y + 0.95, _destinoTarget.z + 3.0);
  } else {
    _destinoTarget.copy(TARGET_BASE);
    _destinoCamara.copy(CAMARA_BASE);
  }
  controles.target.lerp(_destinoTarget, 0.09);
  camera.position.lerp(_destinoCamara, 0.09);
  controles.update();
}

const RADIO_ZONA: Record<string, number> = {
  llantas: 0.55,
  frenos: 0.5,
  motor: 0.5,
  luces: 0.3,
  suspension: 0.36,
  bateria: 0.36,
  carroceria: 0.5,
  transmision: 0.36,
};

/** Aro luminoso que marca la pieza elegida y siempre mira a la cámara. */
function Resalte({ posicion, radio }: { posicion: [number, number, number]; radio: number }) {
  const anillo = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (anillo.current) anillo.current.scale.setScalar(1 + 0.12 * Math.sin(clock.getElapsedTime() * 4));
  });
  return (
    <Billboard position={posicion}>
      <mesh ref={anillo}>
        <ringGeometry args={[radio, radio + 0.035, 56]} />
        <meshBasicMaterial color={AMBAR} transparent opacity={0.95} depthTest={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[radio, 40]} />
        <meshBasicMaterial color={AMBAR} transparent opacity={0.12} depthTest={false} />
      </mesh>
    </Billboard>
  );
}

function Escena({ tipo, zonas, zonaId, onZona, botones, panelAbajo }: Props & { tipo: TipoVehiculo; panelAbajo: boolean }) {
  const controles = useThree((s) => s.controls) as unknown as ControlesOrbita | null;
  const camera = useThree((s) => s.camera);
  const limite = useRef(0);
  const posiciones = tipo === "auto" ? POS_AUTO : POS_MOTO;
  const escala = tipo === "auto" ? 1 : 1.25;
  const posZona = zonaId ? (posiciones[zonaId] ?? null) : null;
  const [reducirMovimiento] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    limite.current = performance.now() + 2200;
  }, [zonaId, tipo]);

  useFrame(() => {
    if (performance.now() < limite.current) enfocar(controles, camera, posZona, escala, panelAbajo);
  });

  return (
    <>
      <Grid
        position={[0, 0, 0]}
        args={[30, 30]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#4b3aa8"
        sectionSize={2.5}
        sectionThickness={1.1}
        sectionColor="#8a74ff"
        fadeDistance={14}
        fadeStrength={1.6}
        infiniteGrid
      />
      <Pulsos />
      <Sparkles count={70} scale={[9, 3.4, 7]} size={2.4} speed={0.35} opacity={0.7} color={CIAN} />
      <group scale={tipo === "auto" ? 1 : 1.25}>
        {tipo === "auto" ? (
          <Auto zonas={zonas} zonaId={zonaId} onZona={onZona} botones={botones} />
        ) : (
          <Moto zonas={zonas} zonaId={zonaId} onZona={onZona} botones={botones} />
        )}
        <Escaner largo={tipo === "auto" ? 2.1 : 1.3} alto={tipo === "auto" ? 1.3 : 1.35} />
        {zonaId && posZona && <Resalte posicion={posZona} radio={RADIO_ZONA[zonaId] ?? 0.4} />}
      </group>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        autoRotate={!zonaId && !reducirMovimiento}
        autoRotateSpeed={1.1}
        target={TARGET_BASE_ARR}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 2.08}
      />
    </>
  );
}

export default function CarroTecnico3D({
  tipo,
  zonas,
  zonaId,
  onZona,
  panelAbajo = false,
}: Omit<Props, "botones"> & { tipo: TipoVehiculo; panelAbajo?: boolean }) {
  const botones: Botones = useRef({});

  return (
    <div className="relative h-full w-full">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [4.5, 2.1, 4.9], fov: 34 }}
        gl={{ alpha: true, antialias: true }}
        aria-label="Vehículo en 3D. Arrastra para girarlo y toca un punto para elegir la zona."
      >
        <Escena tipo={tipo} zonas={zonas} zonaId={zonaId} onZona={onZona} botones={botones} panelAbajo={panelAbajo} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {zonas.map((z) => {
          const activa = zonaId === z.id;
          return (
            <div
              key={z.id}
              ref={(el) => {
                botones.current[z.id] = el;
              }}
              className="absolute left-0 top-0 opacity-0 transition-opacity duration-150"
              style={{ willChange: "transform" }}
            >
              <button
                type="button"
                className="hs"
                aria-pressed={activa}
                aria-label={`Zona ${z.label}`}
                onClick={() => onZona(activa ? null : z.id)}
              >
                <span className="hs-etiqueta">{z.label}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
