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

export type AnalyzeErrorBody = {
  error?: string;
  provider?: string;
  errorType?: string;
};

export class AnalyzeError extends Error {
  constructor(
    message: string,
    public readonly provider?: string,
    public readonly errorType?: string
  ) {
    super(message);
    this.name = "AnalyzeError";
  }
}

type AnalyzeMealInput = {
  prompt?: string;
  images: File[];
  provider: string;
};

export const MAX_IMAGES = 5;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function analyzeMeal({ prompt, images, provider }: AnalyzeMealInput): Promise<string> {
  const buildBody = () => {
    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));
    if (prompt?.trim()) formData.append("prompt", prompt.trim());
    formData.append("provider", provider);
    return formData;
  };

  // Tenta novamente quando a conexão falha antes de qualquer resposta
  // (ex.: "socket hang up" do proxy quando o backend reinicia no dev).
  // Backoff progressivo cobre reinícios do tsx watch (~1-2s).
  let response: Response | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      response = await fetch(ANALYZE_ENDPOINT, {
        method: "POST",
        body: buildBody(),
      });
      break;
    } catch {
      if (attempt === 2) {
        throw new Error("Não foi possível conectar ao servidor. Tente novamente.");
      }
      await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
    }
  }

  if (!response) {
    throw new Error("Não foi possível conectar ao servidor. Tente novamente.");
  }

  const data = (await response.json().catch(() => null)) as
    | (AnalyzeResponse & AnalyzeErrorBody)
    | null;

  if (!response.ok) {
    throw new AnalyzeError(
      data?.error ?? "Não foi possível analisar sua refeição.",
      data?.provider,
      data?.errorType
    );
  }

  return data?.choices?.[0]?.message?.content ?? "";
}
