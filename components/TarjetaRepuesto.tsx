import Link from "next/link";
import { Chip, EtiquetaCondicion } from "./Etiqueta";
import { Ilustracion } from "./Ilustracion";
import { fotoDe } from "@/lib/fotos";
import { distanciaKm, textoDistancia, UBICACION_BASE } from "@/lib/geo";
import { formatBs, type Repuesto } from "@/lib/tipos";

const FONDOS = ["#e6eefc", "#e3f6fb", "#eceffb"];

export function fondoPor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return FONDOS[h % FONDOS.length];
}

export function TarjetaRepuesto({ r, indice = 0 }: { r: Repuesto; indice?: number }) {
  const km = r.proveedores ? distanciaKm(UBICACION_BASE, r.proveedores) : null;
  const pocas = r.stock > 0 && r.stock <= 3;
  const foto = fotoDe(r);

  return (
    <Link
      href={`/repuesto?id=${encodeURIComponent(r.id)}`}
      className="aparecer group block overflow-hidden rounded-2xl border border-linea bg-white sombra-suave transition duration-200 hover:-translate-y-1 hover:border-azul/40 hover:shadow-[0_18px_40px_-14px_rgba(11,42,74,0.3)]"
      style={{ animationDelay: `${Math.min(indice, 8) * 60}ms` }}
    >
      <div className="relative flex h-40 items-center justify-center" style={{ background: fondoPor(r.id) }}>
        <EtiquetaCondicion condicion={r.condicion} className="absolute left-3 top-3" />
        {r.ejemplo && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-ink-2">
            Ejemplo
          </span>
        )}
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={foto}
            alt={r.nombre}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <Ilustracion
            categoria={r.categoria}
            className="h-24 w-32 transition duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-[16px] font-semibold leading-snug text-marino">{r.nombre}</h3>
        <p className="mt-1 text-[13px] text-ink-2">
          {r.proveedores?.nombre ?? "Tienda por confirmar"} · {textoDistancia(km)}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Chip tono="azul">{r.categoria}</Chip>
          {r.posicion && <Chip>{r.posicion}</Chip>}
          {r.motor === "electrico" && <Chip tono="verde">Eléctrico</Chip>}
          {r.motor === "hibrido" && <Chip tono="verde">Híbrido</Chip>}
          {pocas && <Chip tono="rojo">Quedan {r.stock}</Chip>}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-2">Precio</p>
            <p className="text-[26px] font-bold leading-tight tracking-tight text-marino">{formatBs(r.precio_bs)}</p>
          </div>
          <span className="rounded-xl bg-marino px-4 py-2 text-[14px] font-semibold text-white transition group-hover:bg-azul">
            Ver detalle
          </span>
        </div>
      </div>
    </Link>
  );
}
