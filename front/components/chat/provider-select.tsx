"use client";

import { useState } from "react";
import { Check, ChevronDown, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { AIProviderId, ProviderOption } from "@/lib/providers";

type ProviderSelectProps = {
  providers: ProviderOption[];
  value: AIProviderId;
  onChange: (id: AIProviderId) => void;
};

export function ProviderSelect({ providers, value, onChange }: ProviderSelectProps) {
  const [open, setOpen] = useState(false);
  const current = providers.find((option) => option.id === value) ?? providers[0];
  const currentUnavailable = current?.status === "rate_limited";

  const handleSelect = (id: AIProviderId) => {
    setOpen(false);
    onChange(id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Escolher modelo de análise"
          aria-expanded={open}
          className={cn(
            "h-7 max-w-[10.5rem] shrink-0 gap-1 rounded-full px-2.5 text-[0.8rem] font-medium text-muted-foreground transition-colors duration-150 hover:bg-sand hover:text-foreground data-open:bg-sand data-open:text-foreground sm:max-w-none",
            currentUnavailable && "text-terracotta-deep hover:text-terracotta-deep"
          )}
        >
          <span className="truncate">{current?.label}</span>
          {currentUnavailable ? (
            <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="size-3.5 shrink-0" aria-hidden="true" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={10}
        className="w-64 max-w-[calc(100vw-2rem)] gap-0 rounded-xl border-border/80 bg-popover/95 p-1.5 shadow-lift backdrop-blur-md"
      >
        <p className="px-2.5 pt-1.5 pb-1 text-[0.68rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Modelo de análise
        </p>
        {providers.map((option) => {
          const isSelected = option.id === value;
          const isUnavailable = option.status === "rate_limited";
          return (
            <button
              key={option.id}
              type="button"
              disabled={isUnavailable}
              onClick={() => handleSelect(option.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left outline-none transition-colors duration-150",
                isUnavailable
                  ? "cursor-not-allowed"
                  : "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
              )}
            >
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-sm leading-tight font-medium",
                    isUnavailable && "text-muted-foreground"
                  )}
                >
                  {option.label}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-xs leading-snug text-muted-foreground",
                    isUnavailable && "text-terracotta-deep"
                  )}
                >
                  {isUnavailable ? (
                    <>
                      <TriangleAlert className="size-3" aria-hidden="true" />
                      {option.statusLabel}
                    </>
                  ) : (
                    <>
                      <Check className="size-3 text-leaf" aria-hidden="true" />
                      {option.statusLabel}
                    </>
                  )}
                </span>
              </span>
              {isSelected && !isUnavailable && (
                <Check className="size-4 shrink-0 text-leaf" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
