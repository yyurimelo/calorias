export const AI_PROVIDERS = ["gemini", "openrouter"] as const;

export type AIProvider = (typeof AI_PROVIDERS)[number];

export type ProviderErrorType = "AUTH" | "RATE_LIMIT" | "INVALID" | "INTERNAL";

export type NormalizedAnalysis = {
  model?: string;
  choices: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export function errorTypeFromStatus(status: number): ProviderErrorType {
  if (status === 401 || status === 403) return "AUTH";
  if (status === 429) return "RATE_LIMIT";
  if (status >= 500) return "INTERNAL";
  return "INVALID";
}

export class ProviderError extends Error {
  constructor(
    public readonly provider: AIProvider,
    public readonly status: number,
    public readonly type: ProviderErrorType,
    message: string
  ) {
    super(message);
    this.name = "ProviderError";
  }
}
