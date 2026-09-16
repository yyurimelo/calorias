import { performance } from "node:perf_hooks";
import { systemPrompt } from "../prompts/analyze.prompt";
import {
  errorTypeFromStatus,
  ProviderError,
  type AIProvider,
  type NormalizedAnalysis,
} from "../models";
import { formatDuration, timestamp } from "../lib/logger";

const PROVIDER: AIProvider = "gemini";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_TIMEOUT_MS = 120_000;
const DEFAULT_MODEL = "gemini-flash-latest";

type AnalyzeInput = {
  images: string[];
  prompt: string;
};

type GeminiPart = { text: string } | { inline_data: { mime_type: string; data: string } };

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

function toInlineData(dataUrl: string): GeminiPart {
  const match = /^data:(.*?);base64,(.*)$/s.exec(dataUrl);
  if (!match) {
    throw new ProviderError(PROVIDER, 500, "INTERNAL", "Imagem em formato inválido.");
  }
  return {
    inline_data: {
      mime_type: match[1],
      data: match[2],
    },
  };
}

function extractErrorMessage(body: string, fallback: string): string {
  try {
    const parsed = JSON.parse(body) as GeminiResponse;
    const message = parsed.error?.message;
    if (message) return message;
  } catch {
    // corpo não é JSON; usa o fallback abaixo
  }
  return body.slice(0, 200) || fallback;
}

export async function analyzeWithGemini({
  images,
  prompt,
}: AnalyzeInput): Promise<NormalizedAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new ProviderError(PROVIDER, 500, "INTERNAL", "GEMINI_API_KEY não configurada.");
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  console.log(`[${timestamp()}] [Gemini] Request started`);
  console.log(`[Gemini] Model: ${model}`);

  const payload = {
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: prompt },
          ...images.map(toInlineData),
        ] satisfies GeminiPart[],
      },
    ],
  };

  const start = performance.now();

  let response: Response;
  try {
    response = await fetch(`${GEMINI_URL}/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
    });
  } catch {
    console.log(`[Gemini] Request failed`);
    console.log(`[Gemini] Type: NETWORK`);
    throw new ProviderError(
      PROVIDER,
      504,
      "INTERNAL",
      "A análise demorou demais para responder. Tente novamente."
    );
  }

  if (!response.ok) {
    const type = errorTypeFromStatus(response.status);
    const message = extractErrorMessage(
      await response.text(),
      "O Gemini não conseguiu concluir a análise."
    );
    console.log(`[Gemini] Request failed`);
    console.log(`[Gemini] Status: ${response.status}`);
    console.log(`[Gemini] Type: ${type}`);
    console.log(`[Gemini] Request failed after ${formatDuration(performance.now() - start)}`);
    throw new ProviderError(PROVIDER, response.status, type, message);
  }

  const data = (await response.json()) as GeminiResponse;
  const content = (data.candidates?.[0]?.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("");

  if (!content.trim()) {
    console.log(`[Gemini] Request failed`);
    console.log(`[Gemini] Status: 502`);
    console.log(`[Gemini] Type: INVALID`);
    console.log(`[Gemini] Request failed after ${formatDuration(performance.now() - start)}`);
    throw new ProviderError(PROVIDER, 502, "INVALID", "O Gemini não retornou uma resposta válida.");
  }

  console.log(`[Gemini] Request completed in ${formatDuration(performance.now() - start)}`);

  return {
    model,
    choices: [{ message: { content } }],
  };
}
