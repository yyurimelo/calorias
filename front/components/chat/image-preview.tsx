"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DraftImage } from "@/lib/types";

type ImagePreviewProps = {
  image: DraftImage;
  onRemove: (id: string) => void;
};

export function ImagePreview({ image, onRemove }: ImagePreviewProps) {
  return (
    <div className="group/preview relative size-16 shrink-0 overflow-hidden rounded-lg border border-border/80 shadow-soft animate-fade-in">
      <img
        src={image.url}
        alt={`Pré-visualização de ${image.name}`}
        className="size-full object-cover"
      />
      <Button
        type="button"
        variant="secondary"
        size="icon-xs"
        aria-label={`Remover imagem ${image.name}`}
        onClick={() => onRemove(image.id)}
        className="absolute top-1 right-1 size-5 rounded-full opacity-0 shadow-soft transition-opacity duration-150 focus-visible:opacity-100 group-hover/preview:opacity-100"
      >
        <X />
      </Button>
    </div>
  );
}
