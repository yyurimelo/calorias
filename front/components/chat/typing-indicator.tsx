export function TypingIndicator() {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3 animate-fade-in">
      <span className="flex items-center gap-1" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="size-1.5 rounded-full bg-leaf animate-typing-dot"
            style={{ animationDelay: `${dot * 180}ms` }}
          />
        ))}
      </span>
      <span className="text-sm text-muted-foreground">Analisando sua refeição…</span>
    </div>
  );
}
