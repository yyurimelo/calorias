function FriesGroup({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} style={style}>
      <g stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect
          x="14"
          y="36"
          width="13"
          height="46"
          rx="6.5"
          strokeOpacity="0.2"
          transform="rotate(-11 20 59)"
        />
        <rect x="30" y="20" width="13" height="54" rx="6.5" strokeOpacity="0.26" />
        <rect
          x="50"
          y="12"
          width="13"
          height="60"
          rx="6.5"
          strokeOpacity="0.3"
          transform="rotate(9 56 42)"
        />
        <rect
          x="68"
          y="26"
          width="13"
          height="50"
          rx="6.5"
          strokeOpacity="0.24"
          transform="rotate(17 74 51)"
        />
        <path d="M36.5 30v36" strokeOpacity="0.13" strokeWidth="1.1" />
        <path d="M56.5 22v40" strokeOpacity="0.13" strokeWidth="1.1" transform="rotate(9 56 42)" />
        <circle cx="40" cy="52" r="1.1" fill="var(--ink)" opacity="0.22" />
        <circle cx="60" cy="34" r="1.1" fill="var(--ink)" opacity="0.18" />
        <circle cx="33" cy="64" r="1.1" fill="var(--ink)" opacity="0.16" />
      </g>
    </svg>
  );
}

function PlateSalad({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} style={style}>
      <circle cx="50" cy="50" r="44" stroke="var(--ink)" strokeOpacity="0.2" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="34" stroke="var(--ink)" strokeOpacity="0.14" strokeWidth="1.2" />
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M38 32c-9-4-13 3-10 9 2 5 8 7 11 4"
          stroke="var(--leaf)"
          strokeOpacity="0.38"
          strokeWidth="1.5"
        />
        <path
          d="M54 28c-2-10 8-11 12-5 3.5 4.5 1 11-4.5 11"
          stroke="var(--leaf)"
          strokeOpacity="0.32"
          strokeWidth="1.5"
        />
        <path
          d="M62 44c9-3 14 3 10 10-3 5-11 4-13-1"
          stroke="var(--leaf)"
          strokeOpacity="0.27"
          strokeWidth="1.5"
        />
        <circle
          cx="42"
          cy="56"
          r="7"
          stroke="var(--terracotta)"
          strokeOpacity="0.32"
          strokeWidth="1.3"
        />
        <path
          d="M42 50v3 M38.5 50.5c1 2 3 3 5 3 2 0 4-1 5-3"
          stroke="var(--leaf)"
          strokeOpacity="0.35"
          strokeWidth="1.1"
        />
      </g>
    </svg>
  );
}

function PlatePasta({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} style={style}>
      <circle cx="50" cy="50" r="44" stroke="var(--ink)" strokeOpacity="0.2" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="34" stroke="var(--ink)" strokeOpacity="0.14" strokeWidth="1.2" />
      <g stroke="var(--ink)" strokeWidth="1.4" strokeLinecap="round" fill="none">
        <path d="M28 42c4-2 8 2 12 0 4-2 8-4 12-2 3 1 5 4 7 7" strokeOpacity="0.26" />
        <path d="M26 52c5-3 10 1 15-1 5-2 9 1 14-1" strokeOpacity="0.22" />
        <path d="M30 62c4-2 8 1 12-1 4-2 8 0 12-2" strokeOpacity="0.18" />
      </g>
      <g strokeLinecap="round" fill="none">
        <path d="M62 34c2-4 6-4 8-2" stroke="var(--leaf)" strokeOpacity="0.4" strokeWidth="1.4" />
        <path d="M66 30l2 4" stroke="var(--leaf)" strokeOpacity="0.3" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

function Utensils({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} style={style}>
      <g stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M26 10v44" strokeOpacity="0.28" />
        <path d="M26 10c-5 0-9 4-9 9 0 5 4 9 9 9 5 0 9-4 9-9 0-5-4-9-9-9Z" strokeOpacity="0.28" />
        <path d="M19 13v12 M26 13v12 M33 13v12" strokeOpacity="0.2" strokeWidth="1.2" />
        <path d="M72 12c-6 0-11 5-11 11 0 6 5 11 11 11 5 0 10-4 10-10" strokeOpacity="0.28" />
        <path d="M82 34v28" strokeOpacity="0.28" />
      </g>
    </svg>
  );
}

function Glass({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} style={style}>
      <g stroke="var(--ink)" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M36 18h28l-4 52c0 4-3 7-7 7H47c-4 0-7-3-7-7L36 18Z"
          strokeOpacity="0.26"
          strokeWidth="1.5"
        />
        <path d="M40 30h20 M42 44h16" strokeOpacity="0.13" strokeWidth="1.2" />
        <path d="M56 10l8-5 5 13" strokeOpacity="0.28" strokeWidth="1.5" />
        <circle
          cx="70"
          cy="26"
          r="6"
          stroke="var(--terracotta)"
          strokeOpacity="0.3"
          strokeWidth="1.3"
        />
        <path d="M70 21v2" stroke="var(--terracotta)" strokeOpacity="0.25" strokeWidth="1.1" />
      </g>
    </svg>
  );
}

function LeafSprig({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} style={style}>
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M18 74C8 70 4 60 10 52c5-7 14-6 16 0"
          stroke="var(--leaf)"
          strokeOpacity="0.38"
          strokeWidth="1.5"
        />
        <path d="M12 66c4-2 8-2 11 1" stroke="var(--leaf)" strokeOpacity="0.24" strokeWidth="1.1" />
        <circle
          cx="48"
          cy="62"
          r="10"
          stroke="var(--terracotta)"
          strokeOpacity="0.28"
          strokeWidth="1.4"
        />
        <path
          d="M48 53v4 M42 54c1.5 2.5 3.5 3.5 6 3.5 2.5 0 4.5-1 6-3.5"
          stroke="var(--leaf)"
          strokeOpacity="0.33"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
}

export function FoodOrnaments() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <FriesGroup className="absolute bottom-[22%] left-2 size-14 -rotate-12 animate-float-slow md:left-[3%] md:size-20" />
      <LeafSprig className="absolute top-[16%] right-2 size-12 rotate-12 md:right-[3%] md:size-16" />

      <Utensils className="absolute top-[18%] left-[2%] hidden size-20 -rotate-15 md:block" />
      <Glass
        className="absolute bottom-[30%] right-[3%] hidden size-16 -rotate-6 animate-float-slow md:block"
        style={{ animationDelay: "1.6s" }}
      />
      <PlatePasta className="absolute bottom-[6%] left-[5%] hidden size-32 rotate-6 md:block" />

      <PlateSalad
        className="absolute top-[8%] right-[3%] hidden size-36 rotate-6 animate-float-slow lg:block"
        style={{ animationDelay: "0.8s" }}
      />
      <FriesGroup className="absolute top-[34%] right-[2%] hidden size-16 rotate-[24deg] lg:block" />
      <PlatePasta className="absolute top-[36%] left-[2%] hidden size-20 -rotate-12 lg:block" />
    </div>
  );
}
