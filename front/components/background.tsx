export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-background" />

      <div className="absolute -top-[18%] -left-[12%] size-[52vw] min-size-[420px] rounded-full bg-leaf/14 blur-3xl animate-drift-1" />
      <div className="absolute -right-[16%] -bottom-[20%] size-[46vw] min-size-[380px] rounded-full bg-terracotta/13 blur-3xl animate-drift-2" />
      <div className="absolute top-[32%] right-[8%] size-[26vw] min-size-[240px] rounded-full bg-sand/60 blur-3xl animate-drift-3" />

      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,transparent_55%,oklch(0.94_0.02_85/0.55)_100%)]" />

      <div className="texture-grain absolute inset-0 opacity-[0.05] mix-blend-multiply" />
    </div>
  );
}
