import { condicionInfo } from "@/lib/tipos";

export function EtiquetaCondicion({ condicion, className = "" }: { condicion: string; className?: string }) {
  const c = condicionInfo(condicion);
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-[12px] font-semibold ${className}`}
      style={{ background: c.bg, color: c.fg, borderColor: c.borde }}
    >
      {c.label}
    </span>
  );
}

export function Chip({
  children,
  tono = "neutro",
  className = "",
}: {
  children: React.ReactNode;
  tono?: "neutro" | "azul" | "ambar" | "verde" | "rojo";
  className?: string;
}) {
  const tonos = {
    neutro: "bg-hielo text-ink-2 border-linea",
    azul: "bg-azul-suave text-marino-2 border-[#d9d0ff]",
    ambar: "bg-ambar-suave text-[#8a4300] border-[#ffcf9e]",
    verde: "bg-verde-suave text-[#0b6b50] border-[#a8e8d1]",
    rojo: "bg-rojo-suave text-rojo border-[#efc3b9]",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[12px] font-medium ${tonos[tono]} ${className}`}
    >
      {children}
    </span>
  );
}
