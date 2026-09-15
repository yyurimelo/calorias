"use client";

import { CircleAlert, Leaf, Maximize2 } from "lucide-react";
import { Message, MessageContent } from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import type { ChatMessage as ChatMessageType, DraftImage } from "@/lib/types";
import { useStreamingText } from "@/lib/use-streaming-text";
import { AnalysisResult } from "./analysis-result";
import { TypingIndicator } from "./typing-indicator";

function AssistantMarker() {
  return (
    <Marker className="gap-1.5">
      <MarkerIcon className="text-leaf">
        <Leaf />
      </MarkerIcon>
      <MarkerContent className="text-[0.7rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        calorias
      </MarkerContent>
    </Marker>
  );
}

function UserMessage({
  message,
  onImageClick,
}: {
  message: Extract<ChatMessageType, { role: "user" }>;
  onImageClick: (image: DraftImage) => void;
}) {
  return (
    <Message align="end" className="animate-message-in">
      <MessageContent className="items-end">
        {message.text && (
          <Bubble variant="outline" align="end">
            <BubbleContent className="rounded-2xl bg-card px-4 py-2.5 text-[0.95rem] leading-relaxed shadow-soft">
              {message.text}
            </BubbleContent>
          </Bubble>
        )}
        {message.images.length > 0 && (
          <div className="flex flex-wrap justify-end gap-2">
            {message.images.map((image) => (
              <button
                key={image.id}
                type="button"
                onClick={() => onImageClick(image)}
                aria-label={`Ampliar imagem ${image.name}`}
                className="group/img relative block size-20 overflow-hidden rounded-xl border border-border/70 shadow-soft outline-none transition-transform duration-200 hover:scale-[1.03] focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <img src={image.url} alt={image.name} className="size-full object-cover" />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-[background-color,opacity] duration-200 group-hover/img:bg-ink/20 group-hover/img:opacity-100"
                >
                  <Maximize2 className="size-4 text-primary-foreground drop-shadow-sm" />
                </span>
              </button>
            ))}
          </div>
        )}
      </MessageContent>
    </Message>
  );
}

function StreamingContent({ text, onComplete }: { text: string; onComplete: () => void }) {
  const displayed = useStreamingText(text, onComplete);
  return <AnalysisResult content={displayed} />;
}

function AssistantMessage({
  message,
  onStreamComplete,
}: {
  message: Extract<ChatMessageType, { role: "assistant" }>;
  onStreamComplete: (id: string) => void;
}) {
  return (
    <Message align="start" className="animate-message-in">
      <MessageContent>
        <AssistantMarker />
        <Bubble variant="ghost">
          <BubbleContent className="overflow-visible">
            {message.status === "thinking" ? (
              <TypingIndicator />
            ) : message.status === "error" ? (
              <div
                role="alert"
                className="flex items-start gap-2.5 text-[0.95rem] text-destructive"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p className="leading-relaxed">{message.text}</p>
              </div>
            ) : message.status === "streaming" ? (
              <StreamingContent
                text={message.text}
                onComplete={() => onStreamComplete(message.id)}
              />
            ) : (
              <AnalysisResult content={message.text} />
            )}
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
}

export function ChatMessage({
  message,
  onStreamComplete,
  onImageClick,
}: {
  message: ChatMessageType;
  onStreamComplete: (id: string) => void;
  onImageClick: (image: DraftImage) => void;
}) {
  if (message.role === "user") {
    return <UserMessage message={message} onImageClick={onImageClick} />;
  }
  return <AssistantMessage message={message} onStreamComplete={onStreamComplete} />;
}
