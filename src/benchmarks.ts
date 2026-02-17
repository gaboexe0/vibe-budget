export interface BenchmarkScores {
  humaneval?: number;
  swe_bench?: number;
  swe_bench_verified?: number;
  livecode_bench?: number;
  gpqa_diamond?: number;
  arc_agi_2?: number;
  hle?: number;
  mmlu?: number;
  mmlu_pro?: number;
  math_500?: number;
  aime_2025?: number;
  video_mmmu?: number;
  mmmu_pro?: number;
  gdpval_aa?: number;
  terminal_bench?: number;
}

export interface ModelBenchmark {
  name: string;
  scores: BenchmarkScores;
}

export const BENCHMARKS: Record<string, BenchmarkScores> = {
  // OpenAI
  'GPT-5.2': { humaneval: 89.0, swe_bench: 80.0, swe_bench_verified: 55.6, livecode_bench: 89.0, gpqa_diamond: 90.3, hle: 35.4, mmlu: 91.8, mmlu_pro: 88.2, aime_2025: 100.0, video_mmmu: 85.9 },
  'GPT-5.1': { humaneval: 88.5, gpqa_diamond: 88.1, hle: 17.6, mmlu: 90.5, mmlu_pro: 86.0 },
  'GPT-5 Nano': { humaneval: 85.0 },
  'GPT-4o': { humaneval: 90.2, swe_bench: 33.2, livecode_bench: 29.5, gpqa_diamond: 79.4, mmlu: 88.7, mmlu_pro: 82.5 },
  'GPT-4o-mini': { humaneval: 87.0, swe_bench: 68.1, mmlu: 82.0 },
  'GPT-4 Turbo': { humaneval: 87.1, mmlu: 86.4 },
  'o3': { swe_bench: 69.1 },
  'o4-mini': { swe_bench: 68.1 },

  // Anthropic
  'Claude Opus 4.6': { swe_bench_verified: 80.8, gpqa_diamond: 87.0, arc_agi_2: 36.7, hle: 36.7, terminal_bench: 65.4 },
  'Claude Opus 4.5': { humaneval: 93.8, swe_bench_verified: 80.9, gpqa_diamond: 87.0, arc_agi_2: 37.6, hle: 43.2, mmlu: 90.2, mmlu_pro: 89.5, terminal_bench: 65.4 },
  'Claude Sonnet 4.5': { swe_bench: 62.3, swe_bench_verified: 77.2, mmlu: 88.6, mmlu_pro: 85.2 },
  'Claude Sonnet 4': { livecode_bench: 47.1 },
  'Claude 3.7 Sonnet': { swe_bench: 62.3 },
  'Claude 3.7 Opus': { hle: 74.2 },
  'Claude 3.5 Sonnet': { humaneval: 92.0, swe_bench: 49.0, livecode_bench: 36.4, mmlu: 88.3 },
  'Claude 3.5 Haiku': { humaneval: 88.1, mmlu: 82.4 },
  'Claude 3 Opus': { humaneval: 84.9, mmlu: 86.8 },

  // Google
  'Gemini 3 Pro': { humaneval: 92.5, swe_bench_verified: 76.2, livecode_bench: 91.7, gpqa_diamond: 91.9, arc_agi_2: 31.1, hle: 37.2, mmlu: 91.8, mmlu_pro: 89.8, video_mmmu: 87.6, mmmu_pro: 81.0 },
  'Gemini 3 Flash Preview': { livecode_bench: 90.8, gpqa_diamond: 90.4, video_mmmu: 86.9 },
  'Gemini 3 Deep Think': { gpqa_diamond: 93.8, arc_agi_2: 45.1, hle: 40.0 },
  'Gemini 2.5 Pro': { humaneval: 73.0, swe_bench: 63.8, mmlu: 86.2 },
  'Gemini 2.5 Ultra': {},
  'Gemini 2.5 Flash': { humaneval: 71.0 },
  'Gemini 2.5 Flash-Lite': { humaneval: 68.0 },
  'Gemini 2.0 Flash': { humaneval: 70.0 },
  'Gemini 1.5 Pro': { humaneval: 72.0 },
  'Gemini 1.0 Ultra': { humaneval: 74.0 },
  'Gemini Diffusion': { humaneval: 89.6 },

  // xAI
  'Grok 4': { swe_bench_verified: 58.6, gpqa_diamond: 88.0 },
  'Grok 4 Code': { swe_bench_verified: 70.8 },
  'Grok 4.1 Fast Reasoning': {},
  'Grok 4.1': { gpqa_diamond: 88.4 },
  'Grok 2': { humaneval: 88.4 },

  // DeepSeek
  'DeepSeek V4': { humaneval: 85.0 },
  'DeepSeek V3': { humaneval: 82.6, swe_bench_verified: 73.0, mmlu: 85.4 },
  'DeepSeek V3.2': {},
  'DeepSeek V3.2 Exp': {},
  'DeepSeek V3.2 Speciale': { livecode_bench: 89.6 },
  'DeepSeek R1': { humaneval: 96.1, mmlu: 88.9, math_500: 97.3 },
  'DeepSeek R1-0528': { humaneval: 95.0 },
  'DeepSeek Coder V2': {},
  'DeepSeek Coder 33B': {},
  'DeepSeek Math': {},
  'DeepSeek Prover': {},
  'DeepSeek Reasoner': {},

  // Qwen
  'Qwen3 Coder 480B': {},
  'Qwen3 Coder Next': { swe_bench_verified: 70.6, terminal_bench: 36.2 },
  'Qwen3 235B Thinking': { livecode_bench: 74.1 },
  'Qwen3 80B Thinking': {},
  'Qwen3 Max': { terminal_bench: 74.8 },
  'Qwen 2.5 Coder 32B': { humaneval: 92.7, swe_bench_verified: 69.6 },
  'Qwen 2.5 Coder 14B': { humaneval: 88.0 },
  'Qwen 2.5 Coder 7B': { humaneval: 88.4 },
  'Qwen 2.5 Coder 3B': {},
  'Qwen 2.5 Coder 1.5B': {},
  'Qwen 2.5 72B': {},
  'Qwen 2.5 7B': {},
  'Qwen Max': {},
  'Qwen Plus': {},
  'Qwen Turbo': {},
  'Qwen Flash': {},
  'QWQ 32B': {},

  // Zhipu AI
  'GLM-5': { humaneval: 94.2, swe_bench_verified: 77.8, livecode_bench: 52.0, gpqa_diamond: 68.2, hle: 32.0, mmlu: 88.5 },
  'GLM-4.7': { humaneval: 85.2, hle: 42.8 },
  'GLM-4.7 Code': {},
  'GLM-4.6': { livecode_bench: 82.8 },
  'GLM-4': {},
  'Pony Alpha': {},

  // MiniMax
  'MiniMax M2.5': { humaneval: 89.6, swe_bench_verified: 80.2, livecode_bench: 65.0 },
  'MiniMax M2.1': { swe_bench_verified: 74.0 },
  'MiniMax Text-01': {},
  'MiniMax VL-01': {},
  'MiniMax M2-her': {},

  // Moonshot AI
  'Kimi K2.5': { swe_bench_verified: 76.8 },

  // 01.AI
  'Yi-Large': {},
  'Yi-Medium': {},
  'Yi-Coder-9B': {},

  // Meta
  'Llama 4 Maverick': { gpqa_diamond: 69.8, mmlu_pro: 80.5 },
};

export function getBenchmarkScore(modelName: string, category: keyof BenchmarkScores = 'humaneval'): number | undefined {
  return BENCHMARKS[modelName]?.[category];
}

export function getBestBenchmark(modelName: string): number | undefined {
  const scores = BENCHMARKS[modelName];
  if (!scores) return undefined;
  
  const validScores = [
    scores.swe_bench_verified,
    scores.swe_bench,
    scores.livecode_bench,
    scores.humaneval,
  ].filter(s => s !== undefined) as number[];
  
  return validScores.length > 0 ? Math.max(...validScores) : undefined;
}
