"use client";

import { useCallback, useRef, useState } from "react";
import { Leaf } from "lucide-react";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { analyzeMeal } from "@/lib/api";
import type { ChatMessage as ChatMessageType, DraftImage } from "@/lib/types";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";
import { EmptyChat } from "./empty-chat";
import { ImageLightbox } from "./image-lightbox";

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function Chat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<DraftImage | null>(null);
  const sendingRef = useRef(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleStreamComplete = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id && message.role === "assistant" ? { ...message, status: "done" } : message
      )
    );
  }, []);

  const handleSend = useCallback(async (text: string, images: DraftImage[]) => {
    if (sendingRef.current) return;
    sendingRef.current = true;
    setIsSending(true);

    const assistantId = createId();

    const userMessage: ChatMessageType = {
      id: createId(),
      role: "user",
      text,
      images,
    };
    const assistantMessage: ChatMessageType = {
      id: assistantId,
      role: "assistant",
      text: "",
      status: "thinking",
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    try {
      const content = await analyzeMeal({
        prompt: text || undefined,
        images: images.map((image) => image.file),
      });
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId ? { ...message, text: content, status: "streaming" } : message
        )
      );
    } catch (error) {
      const fallback = "Não consegui analisar agora. Tente novamente.";
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                text: error instanceof Error ? error.message : fallback,
                status: "error",
              }
            : message
        )
      );
    } finally {
      sendingRef.current = false;
      setIsSending(false);
    }
  }, []);

  return (
    <div className="relative z-10 flex h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 pt-4 pb-2 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-leaf text-primary-foreground">
            <Leaf className="size-4" aria-hidden="true" />
          </span>
          <span className="font-display text-xl leading-none font-semibold tracking-tight">
            calor
            <span className="text-terracotta italic">ia</span>s
          </span>
        </div>
        <p className="hidden text-[0.68rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase sm:block">
          Sessão efêmera · nada fica salvo
        </p>
      </header>

      <MessageScrollerProvider autoScroll>
        <MessageScroller className="flex-1">
          <MessageScrollerViewport className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <MessageScrollerContent className="gap-6 pb-2 pt-4">
              {messages.length === 0 ? (
                <MessageScrollerItem className="flex grow flex-col justify-center">
                  <EmptyChat
                    onSuggestion={(prompt) => handleSend(prompt, [])}
                    onPickImage={() => galleryInputRef.current?.click()}
                  />
                </MessageScrollerItem>
              ) : (
                messages.map((message) => (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={message.role === "user"}
                  >
                    <ChatMessage
                      message={message}
                      onStreamComplete={handleStreamComplete}
                      onImageClick={setLightboxImage}
                    />
                  </MessageScrollerItem>
                ))
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton size="icon" className="rounded-full bg-card/90 shadow-soft" />
        </MessageScroller>
      </MessageScrollerProvider>

      <ChatInput galleryInputRef={galleryInputRef} isLoading={isSending} onSend={handleSend} />

      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
