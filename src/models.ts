export type Model = {
  id: string;
  name: string;
  provider: string;
  inputPrice: number;
  outputPrice: number;
  evalScore?: number;
  contextWindow: number;
};

export const MODELS: Model[] = [
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    inputPrice: 0.00014,
    outputPrice: 0.00028,
    evalScore: 82.6,
    contextWindow: 64000,
  },
  {
    id: 'qwen/qwen-2.5-32b-instruct',
    name: 'Qwen2.5-32B',
    provider: 'Qwen',
    inputPrice: 0.0006,
    outputPrice: 0.0012,
    evalScore: 92.7,
    contextWindow: 32000,
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude Haiku',
    provider: 'Anthropic',
    inputPrice: 0.00025,
    outputPrice: 0.00125,
    evalScore: 88.1,
    contextWindow: 200000,
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude Sonnet',
    provider: 'Anthropic',
    inputPrice: 0.003,
    outputPrice: 0.015,
    evalScore: 92.0,
    contextWindow: 200000,
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude Opus',
    provider: 'Anthropic',
    inputPrice: 0.015,
    outputPrice: 0.075,
    evalScore: 94.1,
    contextWindow: 200000,
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    inputPrice: 0.0025,
    outputPrice: 0.01,
    evalScore: 90.2,
    contextWindow: 128000,
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    inputPrice: 0.00015,
    outputPrice: 0.0006,
    evalScore: 87.5,
    contextWindow: 128000,
  },
  {
    id: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    inputPrice: 0.01,
    outputPrice: 0.03,
    evalScore: 89.8,
    contextWindow: 128000,
  },
  {
    id: 'google/gemini-1.5-flash',
    name: 'Gemini Flash',
    provider: 'Google',
    inputPrice: 0.000075,
    outputPrice: 0.0003,
    evalScore: 85.3,
    contextWindow: 1000000,
  },
  {
    id: 'google/gemini-1.5-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    inputPrice: 0.00125,
    outputPrice: 0.005,
    evalScore: 89.5,
    contextWindow: 1000000,
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B',
    provider: 'Meta',
    inputPrice: 0.0009,
    outputPrice: 0.0009,
    evalScore: 86.2,
    contextWindow: 128000,
  },
  {
    id: 'mistralai/mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral',
    inputPrice: 0.002,
    outputPrice: 0.006,
    evalScore: 87.8,
    contextWindow: 128000,
  },
  {
    id: 'xai/grok-2',
    name: 'Grok-2',
    provider: 'xAI',
    inputPrice: 0.0002,
    outputPrice: 0.0004,
    evalScore: 84.1,
    contextWindow: 131072,
  },
];

export function getModelById(id: string): Model | undefined {
  return MODELS.find((m) => m.id === id);
}

export function getModelByName(name: string): Model | undefined {
  return MODELS.find(
    (m) => m.name.toLowerCase() === name.toLowerCase()
  );
}

export function getModels(): Model[] {
  return MODELS;
}
