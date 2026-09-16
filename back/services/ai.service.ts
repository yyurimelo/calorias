import { AI_PROVIDERS, type AIProvider, type NormalizedAnalysis } from "../models";
import { analyzeWithGemini } from "./gemini.service";
import { analyzeWithOpenRouter } from "./openrouter.service";

export const DEFAULT_PROMPT =
  "Analise essa imagem e identifique os alimentos e estime suas calorias.";

const DEFAULT_PROVIDER: AIProvider = "gemini";

export type AnalyzeInput = {
  provider: AIProvider;
  images: string[];
  prompt?: string;
};

export type AnalyzeOutput = NormalizedAnalysis & {
  provider: AIProvider;
};

export function isAIProvider(value: string): value is AIProvider {
  return (AI_PROVIDERS as readonly string[]).includes(value);
}

export function getDefaultProvider(): AIProvider {
  const fromEnv = process.env.AI_PROVIDER;
  if (fromEnv && isAIProvider(fromEnv)) return fromEnv;
  if (fromEnv) {
    console.warn(
      `[AI] AI_PROVIDER inválido ("${fromEnv}"). Valores permitidos: ${AI_PROVIDERS.join(", ")}. Usando "${DEFAULT_PROVIDER}".`
    );
  }
  return DEFAULT_PROVIDER;
}

export function getModelFor(provider: AIProvider): string {
  if (provider === "gemini") {
    return process.env.GEMINI_MODEL || "gemini-flash-latest";
  }
  return process.env.OPENROUTER_MODEL || "(não configurado)";
}

export function analyzeWithAI({ provider, images, prompt }: AnalyzeInput): Promise<AnalyzeOutput> {
  const resolvedPrompt = prompt?.trim() ? prompt : DEFAULT_PROMPT;

  const result: Promise<NormalizedAnalysis> =
    provider === "gemini"
      ? analyzeWithGemini({ images, prompt: resolvedPrompt })
      : analyzeWithOpenRouter({ images, prompt: resolvedPrompt });

  return result.then((analysis) => ({ provider, ...analysis }));
}
