import Link from "next/link";

export function LogoIcono({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a1f66" /><stop offset="1" stopColor="#7a5cff" /></linearGradient></defs><rect width="40" height="40" rx="11" fill="url(#lg)" />
      <path d="M7 16h7M5 22h9M8 28h6" stroke="#d6c9ff" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
      <circle cx="26" cy="20" r="9" fill="none" stroke="#ff8a1f" strokeWidth="3" />
      <circle cx="26" cy="20" r="2.6" fill="#ff8a1f" />
      <path d="M26 11.5v4M26 24.5v4M17.5 20h4M30.5 20h4" stroke="#ff8a1f" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="ChaskiRepu, ir al inicio">
      <LogoIcono />
      <span className="font-display text-[23px] font-semibold leading-none tracking-tight">
        <span className={claro ? "text-white" : "text-marino"}>Chaski</span>
        <span className="text-ambar">Repu</span>
      </span>
    </Link>
  );
}
