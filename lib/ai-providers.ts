// Mapa de provedores de IA → logo (Simple Icons) + cor da marca.
// Em arquivo NEUTRO (sem "use client") para poder ser usado em server e client.
export const AI_PROVIDERS: Record<string, { slug: string; color: string; label: string }> = {
  openai: { slug: "openai", color: "412991", label: "OpenAI" },
  "openai-org": { slug: "openai", color: "412991", label: "OpenAI" },
  anthropic: { slug: "anthropic", color: "D97757", label: "Anthropic" },
  google: { slug: "googlegemini", color: "8E75B2", label: "Google" },
  "google-vertex": { slug: "googlegemini", color: "8E75B2", label: "Google" },
  meta: { slug: "meta", color: "0467DF", label: "Meta" },
  "meta-llama": { slug: "meta", color: "0467DF", label: "Meta" },
  deepseek: { slug: "deepseek", color: "4D6BFE", label: "DeepSeek" },
  qwen: { slug: "alibabadotcom", color: "FF6A00", label: "Qwen / Alibaba" },
  mistralai: { slug: "mistralai", color: "FA520F", label: "Mistral" },
  mistral: { slug: "mistralai", color: "FA520F", label: "Mistral" },
  nvidia: { slug: "nvidia", color: "76B900", label: "NVIDIA" },
  "x-ai": { slug: "x", color: "000000", label: "xAI (Grok)" },
  microsoft: { slug: "microsoft", color: "5E5E5E", label: "Microsoft" },
  cohere: { slug: "cohere", color: "39594D", label: "Cohere" },
  perplexity: { slug: "perplexity", color: "1FB8CD", label: "Perplexity" },
  moonshotai: { slug: "moonrepo", color: "6F4FF2", label: "Moonshot" },
};

export function providerOf(modelId: string): string {
  return modelId.replace(/^~/, "").split("/")[0].toLowerCase();
}

export function providerLabel(modelId: string): string {
  return AI_PROVIDERS[providerOf(modelId)]?.label ?? providerOf(modelId);
}
