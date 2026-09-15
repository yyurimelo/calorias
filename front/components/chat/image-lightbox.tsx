"use client";

import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DraftImage } from "@/lib/types";

type ImageLightboxProps = {
  image: DraftImage | null;
  onClose: () => void;
};

export function ImageLightbox({ image, onClose }: ImageLightboxProps) {
  return (
    <Dialog
      open={image !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPortal>
        <DialogOverlay className="bg-ink/55 backdrop-blur-sm" />
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className="fixed top-1/2 left-1/2 z-50 w-auto max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          <DialogTitle className="sr-only">{image?.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Imagem enviada na conversa, ampliada.
          </DialogDescription>

          <img
            src={image?.url}
            alt={image?.name ?? ""}
            className="max-h-[calc(100vh-4rem)] w-auto max-w-full rounded-xl object-contain shadow-lift"
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Fechar visualização"
            onClick={onClose}
            className="absolute top-3 right-3 size-10 rounded-full bg-ink/45 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-ink/60 focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <X aria-hidden="true" />
          </Button>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
