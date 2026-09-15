"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Revela o texto progressivamente, simulando streaming de resposta da IA.
 *
 * Quando o backend passar a enviar streaming real (SSE/ReadableStream),
 * basta trocar este hook por um que consuma o stream — a interface
 * (status "streaming" da mensagem) não muda.
 */
export function useStreamingText(text: string, onComplete?: () => void): string {
  const [visibleCount, setVisibleCount] = useState(0);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const onCompleteRef = useRef(onComplete);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (!text || reducedMotion) return;

    const step = text.length > 700 ? 4 : text.length > 300 ? 3 : 2;
    intervalRef.current = window.setInterval(() => {
      setVisibleCount((prev) => Math.min(text.length, prev + step));
    }, 24);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, reducedMotion]);

  useEffect(() => {
    if (text && (reducedMotion || visibleCount >= text.length)) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      onCompleteRef.current?.();
    }
  }, [text, visibleCount, reducedMotion]);

  if (reducedMotion) return text;
  return text.slice(0, visibleCount);
}
