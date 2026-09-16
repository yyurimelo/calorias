import { performance } from "node:perf_hooks";
import { systemPrompt } from "../prompts/analyze.prompt";
import {
  errorTypeFromStatus,
  ProviderError,
  type AIProvider,
  type NormalizedAnalysis,
} from "../models";
import { formatDuration, timestamp } from "../lib/logger";

const PROVIDER: AIProvider = "openrouter";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_TIMEOUT_MS = 120_000;

type AnalyzeInput = {
  images: string[];
  prompt: string;
};

type OpenRouterResponse = NormalizedAnalysis & {
  error?: {
    message?: string;
    code?: number;
  };
};

function callOpenRouter(payload: unknown, apiKey: string): Promise<Response> {
  return fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(OPENROUTER_TIMEOUT_MS),
  });
}

function extractErrorMessage(body: string, fallback: string): string {
  try {
    const parsed = JSON.parse(body) as OpenRouterResponse;
    const message = parsed.error?.message;
    if (message) return message;
  } catch {
    // corpo não é JSON; usa o fallback abaixo
  }
  return body.slice(0, 200) || fallback;
}

export async function analyzeWithOpenRouter({
  images,
  prompt,
}: AnalyzeInput): Promise<NormalizedAnalysis> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new ProviderError(PROVIDER, 500, "INTERNAL", "OPENROUTER_API_KEY não configurada.");
  }

  const model = process.env.OPENROUTER_MODEL;

  console.log(`[${timestamp()}] [OpenRouter] Request started`);
  console.log(`[OpenRouter] Model: ${model ?? "(não configurado)"}`);

  const payload = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          ...images.map((image) => ({
            type: "image_url",
            image_url: { url: image },
          })),
        ],
      },
    ],
  };

  const start = performance.now();

  let response: Response | null = null;
  try {
    response = await callOpenRouter(payload, apiKey);
  } catch {
    // Falha de rede ou timeout na primeira tentativa: tenta mais uma vez
    await new Promise((resolve) => setTimeout(resolve, 800));
    try {
      response = await callOpenRouter(payload, apiKey);
    } catch {
      console.log(`[OpenRouter] Request failed`);
      console.log(`[OpenRouter] Type: NETWORK`);
      console.log(`[OpenRouter] Request failed after ${formatDuration(performance.now() - start)}`);
      throw new ProviderError(
        PROVIDER,
        504,
        "INTERNAL",
        "A análise demorou demais para responder. Tente novamente."
      );
    }
  }

  if (!response.ok) {
    const type = errorTypeFromStatus(response.status);
    const message = extractErrorMessage(
      await response.text(),
      "O OpenRouter não conseguiu concluir a análise."
    );
    console.log(`[OpenRouter] Request failed`);
    console.log(`[OpenRouter] Status: ${response.status}`);
    console.log(`[OpenRouter] Type: ${type}`);
    console.log(`[OpenRouter] Request failed after ${formatDuration(performance.now() - start)}`);
    throw new ProviderError(PROVIDER, response.status, type, message);
  }

  const data = (await response.json()) as OpenRouterResponse;

  console.log(`[OpenRouter] Request completed in ${formatDuration(performance.now() - start)}`);

  return {
    model: data.model,
    choices: data.choices ?? [],
  };
}
