import { systemPrompt } from "../prompts/analyze.prompt";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_TIMEOUT_MS = 120_000;
const DEFAULT_PROMPT = "Analise essa imagem e identifique os alimentos e estime suas calorias.";

type AnalyzeImagesInput = {
  images: string[];
  prompt?: string;
};

export class OpenRouterError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

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

export async function analyzeImages({ images, prompt }: AnalyzeImagesInput) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new OpenRouterError(500, "OPENROUTER_API_KEY não configurada.");
  }

  const payload = {
    model: process.env.OPENROUTER_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: prompt ?? DEFAULT_PROMPT },
          ...images.map((image) => ({
            type: "image_url",
            image_url: { url: image },
          })),
        ],
      },
    ],
  };

  let response: Response | null = null;
  try {
    response = await callOpenRouter(payload, apiKey);
  } catch {
    // Falha de rede ou timeout na primeira tentativa: tenta mais uma vez
    await new Promise((resolve) => setTimeout(resolve, 800));
    try {
      response = await callOpenRouter(payload, apiKey);
    } catch {
      throw new OpenRouterError(504, "A análise demorou demais para responder. Tente novamente.");
    }
  }

  if (!response.ok) {
    throw new OpenRouterError(response.status, await response.text());
  }

  return response.json();
}
