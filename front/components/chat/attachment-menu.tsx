"use client";

import { useState } from "react";
import { Camera, FolderOpen, Image, Paperclip } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type AttachmentSource = "camera" | "gallery" | "files";

const OPTIONS: Array<{
  source: AttachmentSource;
  icon: typeof Camera;
  label: string;
  hint: string;
}> = [
  { source: "camera", icon: Camera, label: "Câmera", hint: "Tirar uma foto agora" },
  { source: "gallery", icon: Image, label: "Galeria", hint: "Escolher da biblioteca" },
  { source: "files", icon: FolderOpen, label: "Arquivos", hint: "Procurar no dispositivo" },
];

type AttachmentMenuProps = {
  className?: string;
  onSelect: (source: AttachmentSource) => void;
};

export function AttachmentMenu({ className, onSelect }: AttachmentMenuProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (source: AttachmentSource) => {
    setOpen(false);
    onSelect(source);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Anexar imagem"
          aria-expanded={open}
          className={cn(
            "size-9 shrink-0 rounded-full text-muted-foreground transition-colors duration-150 hover:bg-sand hover:text-foreground data-open:bg-sand data-open:text-foreground",
            className
          )}
        >
          <Paperclip aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={10}
        className="w-64 max-w-[calc(100vw-2rem)] gap-0 rounded-xl border-border/80 bg-popover/95 p-1.5 shadow-lift backdrop-blur-md"
      >
        <p className="px-2.5 pt-1.5 pb-1 text-[0.68rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Adicionar à mensagem
        </p>
        {OPTIONS.map(({ source, icon: Icon, label, hint }) => (
          <button
            key={source}
            type="button"
            onClick={() => handleSelect(source)}
            className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left outline-none transition-colors duration-150 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sand text-foreground/80">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm leading-tight font-medium">{label}</span>
              <span className="block text-xs leading-snug text-muted-foreground">{hint}</span>
            </span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
