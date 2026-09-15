import { Utensils } from "lucide-react";

type MealItem = {
  name: string;
  detail?: string;
  kcal?: string;
};

type ParsedAnalysis = {
  intro: string[];
  items: MealItem[];
  total?: string;
  notes: string[];
};

const KCAL_VALUE_PATTERN = /[≈~]?\s*\d[\d.,]*(?:\s*[–—-]\s*\d[\d.,]*)?\s*(?:kcal|calorias)\b/i;

function stripBold(text: string): string {
  return text.replace(/\*\*/g, "").trim();
}

function parseAnalysis(content: string): ParsedAnalysis {
  const lines = content.split("\n").map((line) => line.trim());
  const parsed: ParsedAnalysis = { intro: [], items: [], notes: [] };

  let inNotes = false;
  let pastList = false;

  for (const line of lines) {
    if (!line) continue;

    const lower = line.toLowerCase();
    const isTotal = lower.includes("total") && lower.includes("kcal");

    if (isTotal && !line.startsWith("-")) {
      parsed.total = stripBold(line.replace(/^.*?:\s*/, ""));
      continue;
    }

    if (lower.startsWith("observaç") || lower.startsWith("observações")) {
      inNotes = true;
      const rest = line.replace(/^observa[çc][õo]es?\s*:?\s*/i, "");
      if (rest) parsed.notes.push(stripBold(rest));
      continue;
    }

    if (inNotes) {
      parsed.notes.push(stripBold(line));
      continue;
    }

    if (line.startsWith("-")) {
      pastList = true;
      const parts = stripBold(line.slice(1))
        .split(/\s+—\s+|\s+[-–]\s+/)
        .map((part) => part.trim())
        .filter(Boolean);

      const item: MealItem = { name: parts[0] ?? "" };

      if (parts.length > 1) {
        const last = parts[parts.length - 1] ?? "";
        const kcalMatch = last.match(KCAL_VALUE_PATTERN);

        if (kcalMatch) {
          item.kcal = kcalMatch[0].trim();
          const details = [...parts.slice(1, -1), last.replace(kcalMatch[0], "").trim()].filter(
            Boolean
          );
          if (details.length > 0) item.detail = details.join(" · ");
        } else {
          item.detail = parts.slice(1).join(" · ");
        }
      }

      if (item.name) parsed.items.push(item);
      continue;
    }

    if (!pastList && !inNotes) parsed.intro.push(stripBold(line));
  }

  return parsed;
}

const KCAL_SPLIT_PATTERN = /[≈~]?\s*\d+(?:[.,]\d+)?\s*(?:kcal|calorias)/gi;

function HighlightedText({ text }: { text: string }) {
  const parts = text.split(KCAL_SPLIT_PATTERN);
  return (
    <>
      {parts.map((part, index) =>
        /^≈?\s*\d+(?:[.,]\d+)?\s*(?:kcal|calorias)$/i.test(part) ? (
          <span key={index} className="font-semibold text-terracotta-deep tabular-nums">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={index} className="font-semibold">
            <HighlightedText text={part.slice(2, -2)} />
          </strong>
        ) : (
          <HighlightedText key={index} text={part} />
        )
      )}
    </>
  );
}

function MealSheet({ analysis }: { analysis: ParsedAnalysis }) {
  return (
    <div className="min-w-0 w-full">
      {analysis.intro.length > 0 && (
        <p className="wrap-break-word text-[0.95rem] leading-relaxed text-foreground/90">
          {analysis.intro.map((line, index) => (
            <span key={index}>
              <InlineText text={line} />
              {index < analysis.intro.length - 1 && <br />}
            </span>
          ))}
        </p>
      )}

      <div
        data-slot="meal-sheet"
        className="mt-4 min-w-0 rounded-2xl border border-border/80 bg-card/80 shadow-soft @container"
      >
        <div className="flex items-center gap-2 px-5 pt-4 pb-1">
          <Utensils className="size-4 shrink-0 text-leaf" aria-hidden="true" />
          <span className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Sua refeição
          </span>
        </div>

        <ul className="divide-y divide-border/70">
          {analysis.items.map((item, index) => (
            <li
              key={index}
              className="min-w-0 px-5 py-3.5 @md:grid @md:grid-cols-[minmax(0,auto)_minmax(0,1fr)_auto] @md:items-baseline @md:gap-2"
            >
              <span className="wrap-break-word block min-w-0 font-display text-[1.05rem] leading-snug font-medium">
                {item.name}
              </span>
              {item.detail && (
                <span className="wrap-break-word mt-1 block min-w-0 text-sm leading-snug text-muted-foreground @md:mt-0">
                  {item.detail}
                </span>
              )}
              <span className="mt-2 flex min-w-0 items-baseline gap-2 @md:mt-0">
                <span
                  className="min-w-4 flex-1 border-b border-dotted border-border"
                  aria-hidden="true"
                />
                {item.kcal && (
                  <span className="wrap-break-word min-w-0 text-sm font-semibold text-terracotta-deep tabular-nums">
                    {item.kcal}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {analysis.total && (
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 rounded-b-2xl border-t border-border bg-sand/50 px-5 py-4">
            <span className="min-w-0 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Total estimado
            </span>
            <span className="wrap-break-word min-w-0 font-display text-xl font-semibold text-terracotta-deep tabular-nums">
              {analysis.total}
            </span>
          </div>
        )}
      </div>

      {analysis.notes.length > 0 && (
        <p className="wrap-break-word mt-4 font-display text-[0.95rem] leading-relaxed text-muted-foreground italic">
          {analysis.notes.map((note, index) => (
            <span key={index}>
              <InlineText text={note} />
              {index < analysis.notes.length - 1 && <br />}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

function PlainText({ content }: { content: string }) {
  const paragraphs = content.split("\n").filter((line) => line.trim());
  return (
    <div className="min-w-0 w-full max-w-full space-y-3">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="wrap-break-word text-[0.95rem] leading-relaxed">
          <InlineText text={paragraph} />
        </p>
      ))}
    </div>
  );
}

export function AnalysisResult({ content }: { content: string }) {
  const analysis = parseAnalysis(content);

  if (analysis.items.length === 0) {
    return <PlainText content={content} />;
  }

  return <MealSheet analysis={analysis} />;
}
