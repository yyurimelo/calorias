import { systemPrompt } from "../prompts/analyze.prompt";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
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

export async function analyzeImages({ images, prompt }: AnalyzeImagesInput) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new OpenRouterError(500, "OPENROUTER_API_KEY não configurada.");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
    }),
  });

  if (!response.ok) {
    throw new OpenRouterError(response.status, await response.text());
  }

  return response.json();
}
