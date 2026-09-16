"use client";

import { useRef, useState } from "react";
import { ArrowUp, ImagePlus, LoaderIcon } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { DraftImage } from "@/lib/types";
import type { AIProviderId, ProviderOption } from "@/lib/providers";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGES, MAX_IMAGE_SIZE } from "@/lib/api";
import { AttachmentMenu, type AttachmentSource } from "./attachment-menu";
import { ImagePreview } from "./image-preview";
import { ProviderSelect } from "./provider-select";

type ChatInputProps = {
  galleryInputRef: React.RefObject<HTMLInputElement | null>;
  isLoading: boolean;
  provider: AIProviderId;
  providers: ProviderOption[];
  onProviderChange: (id: AIProviderId) => void;
  onSend: (text: string, images: DraftImage[]) => void;
};

function createDraftImage(file: File): DraftImage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    file,
    url: URL.createObjectURL(file),
    name: file.name,
  };
}

export function ChatInput({
  galleryInputRef,
  isLoading,
  provider,
  providers,
  onProviderChange,
  onSend,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [images, setImages] = useState<DraftImage[]>([]);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const dragCounterRef = useRef(0);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);
  const lastErrorRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showError = (message: string) => {
    setAttachmentError(message);
    if (lastErrorRef.current) clearTimeout(lastErrorRef.current);
    lastErrorRef.current = setTimeout(() => setAttachmentError(null), 5000);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const availableSlots = MAX_IMAGES - images.length;
    if (availableSlots <= 0) {
      showError(`São permitidas no máximo ${MAX_IMAGES} imagens por mensagem.`);
      return;
    }

    const valid: DraftImage[] = [];
    for (const file of Array.from(files).slice(0, availableSlots)) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        showError("Envie apenas imagens JPG, PNG ou WebP.");
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        showError("Cada imagem deve ter no máximo 5MB.");
        continue;
      }
      valid.push(createDraftImage(file));
    }

    if (valid.length > 0) {
      setAttachmentError(null);
      setImages((prev) => [...prev, ...valid]);
    }
  };

  const openSource = (source: AttachmentSource) => {
    if (source === "camera") cameraInputRef.current?.click();
    else if (source === "gallery") galleryInputRef.current?.click();
    else filesInputRef.current?.click();
  };

  const hasImageFiles = (event: React.DragEvent) =>
    Array.from(event.dataTransfer.items ?? []).some(
      (item) => item.kind === "file" && item.type.startsWith("image/")
    );

  const handleDragEnter = (event: React.DragEvent) => {
    if (!hasImageFiles(event)) return;
    event.preventDefault();
    dragCounterRef.current += 1;
    setDragActive(true);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDragLeave = () => {
    dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
    if (dragCounterRef.current === 0) setDragActive(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    dragCounterRef.current = 0;
    setDragActive(false);
    handleFiles(event.dataTransfer.files);
  };

  const submit = () => {
    if (isLoading) return;
    const trimmed = text.trim();
    if (!trimmed && images.length === 0) return;
    onSend(trimmed, images);
    setText("");
    setImages([]);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const canSend = text.trim().length > 0 || images.length > 0;

  const sendButton = (className: string) => (
    <Button
      type="button"
      size="icon"
      aria-label="Enviar mensagem"
      disabled={!canSend || isLoading}
      onClick={submit}
      className={cn(
        "shrink-0 rounded-full bg-primary text-primary-foreground transition-all duration-200 hover:bg-leaf-deep hover:shadow-lift active:scale-95 disabled:opacity-40 disabled:shadow-none",
        className
      )}
    >
      {isLoading ? (
        <LoaderIcon role="status" aria-label="Enviando" className="animate-spin" />
      ) : (
        <ArrowUp aria-hidden="true" />
      )}
    </Button>
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-3 sm:px-6 sm:pb-4">
      <div
        className={cn(
          "relative rounded-3xl border border-border/90 bg-card/85 p-3 shadow-lift backdrop-blur-md transition-[border-color,background-color] duration-200 focus-within:border-ring/50 md:rounded-2xl md:p-2.5",
          dragActive && "border-ring/70 bg-card"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          tabIndex={-1}
          className="sr-only"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          multiple
          tabIndex={-1}
          className="sr-only"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <input
          ref={filesInputRef}
          type="file"
          accept="image/*"
          multiple
          tabIndex={-1}
          className="sr-only"
          onChange={(event) => handleFiles(event.target.files)}
        />

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1 pb-2.5">
            {images.map((image) => (
              <ImagePreview
                key={image.id}
                image={image}
                onRemove={(id) => setImages((prev) => prev.filter((img) => img.id !== id))}
              />
            ))}
          </div>
        )}

        {attachmentError && (
          <p role="alert" className="px-1 pb-2 text-xs text-destructive">
            {attachmentError}
          </p>
        )}

        <div className="hidden items-end gap-1 md:flex">
          <AttachmentMenu onSelect={openSource} />

          <Textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder="Pergunte sobre sua refeição…"
            aria-label="Mensagem"
            className="min-w-0 min-h-0 max-h-40 flex-1 resize-none border-0 bg-transparent px-1 py-2.5 shadow-none focus-visible:ring-0"
          />

          {sendButton("size-9")}
        </div>

        <div className="hidden items-center px-1 pt-1.5 md:flex">
          <ProviderSelect providers={providers} value={provider} onChange={onProviderChange} />
        </div>

        <div className="md:hidden">
          <Textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder="Pergunte qualquer coisa"
            aria-label="Mensagem"
            className="min-w-0 min-h-12 max-h-40 w-full resize-none border-0 bg-transparent px-1 pt-1 pb-2 shadow-none focus-visible:ring-0"
          />

          <div className="flex items-center justify-between gap-2">
            <ProviderSelect providers={providers} value={provider} onChange={onProviderChange} />

            <div className="flex shrink-0 items-center gap-2">
              <AttachmentMenu className="size-10" onSelect={openSource} />

              {sendButton("size-10")}
            </div>
          </div>
        </div>

        {dragActive && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-ring/60 bg-card/95 backdrop-blur-sm animate-fade-in md:rounded-2xl"
          >
            <ImagePlus className="size-4 text-leaf" />
            <span className="text-sm font-medium">Solte a imagem aqui</span>
          </div>
        )}
      </div>

      <p className="pt-2 text-center text-[0.68rem] leading-snug text-muted-foreground/90">
        A IA pode cometer erros. Confira informações importantes.
      </p>
    </div>
  );
}
