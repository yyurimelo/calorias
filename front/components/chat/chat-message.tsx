"use client";

import { CircleAlert, Leaf } from "lucide-react";
import { Message, MessageContent } from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
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

function UserMessage({ message }: { message: Extract<ChatMessageType, { role: "user" }> }) {
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
              <img
                key={image.id}
                src={image.url}
                alt={image.name}
                className="size-20 rounded-xl border border-border/70 object-cover shadow-soft"
              />
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
}: {
  message: ChatMessageType;
  onStreamComplete: (id: string) => void;
}) {
  if (message.role === "user") {
    return <UserMessage message={message} />;
  }
  return <AssistantMessage message={message} onStreamComplete={onStreamComplete} />;
}
