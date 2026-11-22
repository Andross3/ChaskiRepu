const N = "#0a1f3d";
const C = "#3ea6ff";
const S = "#9cc4ff";
const T = "#2f8bff";
const F = "#22d3ee";
const W = "#f3f7fc";

function Engranaje() {
  return (
    <g stroke={N} strokeWidth="2.5" strokeLinejoin="round">
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x="56" y="10" width="12" height="16" rx="3" fill={N} transform={`rotate(${i * 36} 62 50)`} />
      ))}
      <circle cx="62" cy="50" r="30" fill={S} />
      <circle cx="62" cy="50" r="11" fill={C} />
    </g>
  );
}

export function Ilustracion({ categoria, className = "" }: { categoria: string; className?: string }) {
  const c = (categoria || "").toLowerCase();
  let dibujo: React.ReactNode;

  if (c.includes("fren")) {
    dibujo = (
      <g stroke={N} strokeWidth="2.5" strokeLinejoin="round">
        <circle cx="48" cy="50" r="40" fill={N} />
        <circle cx="48" cy="50" r="28" fill={C} />
        <circle cx="48" cy="50" r="11" fill={S} />
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx="48" cy="30" r="3.4" fill={S} stroke="none" transform={`rotate(${a} 48 50)`} />
        ))}
        <rect x="82" y="26" width="34" height="22" rx="7" fill={T} />
        <rect x="86" y="54" width="34" height="22" rx="7" fill={F} />
      </g>
    );
  } else if (c.includes("llanta")) {
    dibujo = (
      <g stroke={N} strokeWidth="2.5" strokeLinejoin="round">
        <circle cx="62" cy="50" r="42" fill={N} />
        <circle cx="62" cy="50" r="28" fill={W} />
        {[0, 72, 144, 216, 288].map((a) => (
          <rect key={a} x="59" y="24" width="6" height="22" rx="3" fill={S} transform={`rotate(${a} 62 50)`} />
        ))}
        <circle cx="62" cy="50" r="8" fill={C} />
      </g>
    );
  } else if (c.includes("elect") || c.includes("bater")) {
    dibujo = (
      <g stroke={N} strokeWidth="2.5" strokeLinejoin="round">
        <rect x="22" y="22" width="80" height="54" rx="10" fill={N} />
        <rect x="36" y="12" width="14" height="12" rx="3" fill={C} />
        <rect x="74" y="12" width="14" height="12" rx="3" fill={F} />
        <path d="M66 30L50 54h12l-4 16 18-26H64z" fill={S} />
      </g>
    );
  } else if (c.includes("filtro")) {
    dibujo = (
      <g stroke={N} strokeWidth="2.5" strokeLinejoin="round">
        <rect x="34" y="20" width="56" height="62" rx="12" fill={S} />
        <rect x="28" y="14" width="68" height="14" rx="6" fill={N} />
        {[36, 46, 56, 66].map((y) => (
          <path key={y} d={`M42 ${y}h40`} stroke={C} strokeWidth="4" strokeLinecap="round" />
        ))}
        <rect x="50" y="82" width="24" height="10" rx="4" fill={T} />
      </g>
    );
  } else if (c.includes("suspen")) {
    dibujo = (
      <g stroke={N} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        <rect x="55" y="8" width="14" height="30" rx="5" fill={N} />
        <rect x="48" y="66" width="28" height="30" rx="8" fill={N} />
        <path d="M38 38L86 44L38 52L86 60L38 66" fill="none" stroke={S} strokeWidth="7" />
        <path d="M38 38L86 44L38 52L86 60L38 66" fill="none" stroke={N} strokeWidth="2" />
        <circle cx="62" cy="94" r="6" fill={C} />
      </g>
    );
  } else if (c.includes("luz") || c.includes("luces") || c.includes("faro")) {
    dibujo = (
      <g stroke={N} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M96 24L116 14M100 50h22M96 76l20 10" stroke={S} strokeWidth="5" />
        <path d="M24 50c0-22 22-36 48-36v72c-26 0-48-14-48-36z" fill={W} />
        <circle cx="62" cy="50" r="16" fill={S} />
        <circle cx="62" cy="50" r="6" fill={C} />
      </g>
    );
  } else {
    dibujo = <Engranaje />;
  }

  return (
    <svg viewBox="0 0 124 100" className={className} role="img" aria-label={`Ilustración de ${categoria}`}>
      {dibujo}
    </svg>
  );
}
