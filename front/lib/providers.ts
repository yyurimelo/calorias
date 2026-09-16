export type AIProviderId = "gemini" | "openrouter";

export type ProviderStatus = "available" | "rate_limited";

export type ProviderOption = {
  id: AIProviderId;
  label: string;
  status: ProviderStatus;
  statusLabel: string;
};

export const DEFAULT_PROVIDER: AIProviderId = "gemini";

const BASE_PROVIDERS: Array<Pick<ProviderOption, "id" | "label">> = [
  { id: "gemini", label: "Gemini Flash" },
  { id: "openrouter", label: "OpenRouter" },
];

export function buildProviderOptions(
  statuses: Partial<Record<AIProviderId, ProviderStatus>>
): ProviderOption[] {
  return BASE_PROVIDERS.map((base) => {
    const status = statuses[base.id] ?? "available";
    return {
      ...base,
      status,
      statusLabel: status === "rate_limited" ? "Limite atingido" : "Disponível",
    };
  });
}
