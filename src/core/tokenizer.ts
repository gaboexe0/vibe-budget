import { createEncoding, PATTERNS, COMMON_SPECIAL_TOKENS } from './Encoding.js';

const CHARS_PER_TOKEN = 4;

// Initialize tokenizer with fallback
let tokenizer: any = null;
try {
  tokenizer = createEncoding({
    name: 'cl100k_base',
    patStr: PATTERNS.cl100k_base.source,
    mergeableRanks: new Map(), // Empty ranks = byte-level fallback
    specialTokens: COMMON_SPECIAL_TOKENS
  });
} catch (e) {
  console.warn('Failed to initialize tokenizer, using fallback');
}

export interface TokenEstimate {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export function estimateTokens(
  projectType: string,
  description: string,
  complexity: 'low' | 'medium' | 'high' = 'medium'
): TokenEstimate {
  const baseTokens: Record<string, number> = {
    'landing': 8000,
    'app': 15000,
    'shopify-app': 20000,
    'ai-agent': 25000,
    'api': 12000,
    'fullstack': 30000,
  };

  const multiplier = {
    'low': 0.6,
    'medium': 1.0,
    'high': 1.5,
  };

  const base = baseTokens[projectType] || baseTokens['app'];
  const inputTokens = Math.floor(base * 0.3);
  const outputTokens = Math.floor(base * multiplier[complexity]);

  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
  };
}

export function charsToTokens(chars: number): number {
  return Math.ceil(chars / CHARS_PER_TOKEN);
}

export function tokensToChars(tokens: number): number {
  return tokens * CHARS_PER_TOKEN;
}

export function countStringTokens(text: string): number {
  // Fallback if tokenizer not ready or has empty ranks (which would overcount bytes)
  if (!tokenizer || tokenizer.mergeableRanks.size === 0) {
    return charsToTokens(text.length);
  }
  return tokenizer.countTokens(text);
}
