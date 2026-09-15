/**
 * Camada de integração com o backend.
 *
 * O frontend chama sempre endpoints RELATIVOS (/api/...).
 * O proxy configurado em next.config.ts encaminha /api/* para o
 * backend (variável BACKEND_URL em .env.local), então o browser
 * nunca fala diretamente com outra origem.
 */

export const ANALYZE_ENDPOINT = "/api/analyze";

export type AnalyzeResponse = {
  id?: string;
  model?: string;
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type AnalyzeMealInput = {
  prompt?: string;
  images: File[];
};

export const MAX_IMAGES = 5;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function analyzeMeal({ prompt, images }: AnalyzeMealInput): Promise<string> {
  const formData = new FormData();
  images.forEach((image) => formData.append("images", image));
  if (prompt?.trim()) formData.append("prompt", prompt.trim());

  const response = await fetch(ANALYZE_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  const data = (await response.json().catch(() => null)) as
    | (AnalyzeResponse & { error?: string })
    | null;

  if (!response.ok) {
    throw new Error(data?.error ?? "Não foi possível analisar sua refeição.");
  }

  return data?.choices?.[0]?.message?.content ?? "";
}
