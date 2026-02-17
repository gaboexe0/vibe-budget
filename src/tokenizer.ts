/**
 * Tokenizer Wrapper
 * 
 * This module provides a high-level interface for token counting.
 * It uses a simplified estimation algorithm for performance.
 * 
 * For production use, you would integrate with a proper BPE library.
 */

import { listEncodings, listModels, getEncoding } from './registry.js';
import { Encoding } from './core/Encoding.js';

export interface TokenizeResult {
  text: string;
  tokenCount: number;
  tokenIds: number[];
  encoding: string;
}

export interface TokenizeVerboseResult extends TokenizeResult {
  tokens: string[];
}

/**
 * Token estimation ratios for different content types
 */
const TOKEN_RATIOS: Record<string, number> = {
  english: 0.25,
  code: 0.30,
  cjk: 0.75,
  conservative: 0.20,
  default: 0.25,
};

/**
 * Detects content type based on text characteristics
 */
function detectContentType(text: string): string {
  const cjkRegex = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/;
  const codeIndicators = ['function', 'const', 'let', 'var', 'class', 'import', 'export', 'return', '=>', '{', '}', '()'];
  
  if (cjkRegex.test(text)) return 'cjk';
  
  const lowerText = text.toLowerCase();
  const codeScore = codeIndicators.filter(w => lowerText.includes(w)).length;
  
  return codeScore > 2 ? 'code' : 'english';
}

/**
 * Estimates token count for text (fast approximation)
 */
function estimateTokenCount(text: string, model: string): number {
  const contentType = detectContentType(text);
  const ratio = TOKEN_RATIOS[contentType] || TOKEN_RATIOS.default;
  
  return Math.ceil(text.length * ratio);
}

/**
 * Encodes text to token IDs (simplified)
 */
function encodeToIds(text: string, model: string): number[] {
  const count = estimateTokenCount(text, model);
  const ids: number[] = [];
  
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const charsPerToken = 4;
  
  let currentWord = '';
  for (let i = 0; i < text.length; i += charsPerToken) {
    const chunk = text.slice(i, i + charsPerToken);
    const hash = simpleHash(chunk);
    ids.push((hash % 50000) + 256);
  }
  
  return ids.slice(0, count);
}

/**
 * Simple hash function for generating pseudo-token IDs
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Counts the number of tokens in a text string
 */
export function countTokens(text: string, model: string): number {
  return estimateTokenCount(text, model);
}

/**
 * Encodes text into token IDs
 */
export function encode(text: string, model: string): number[] {
  return encodeToIds(text, model);
}

/**
 * Decodes token IDs back to text (simplified)
 */
export function decode(tokenIds: number[], model: string): string {
  return `[Tokens: ${tokenIds.length}]`;
}

/**
 * Tokenizes text with detailed information
 */
export function tokenize(text: string, model: string): TokenizeResult {
  const tokenIds = encodeToIds(text, model);
  
  return {
    text,
    tokenCount: tokenIds.length,
    tokenIds,
    encoding: model.includes('gpt-4') ? 'cl100k_base' : 'cl100k_base',
  };
}

/**
 * Tokenizes text with verbose output
 */
export function tokenizeVerbose(text: string, model: string): TokenizeVerboseResult {
  const result = tokenize(text, model);
  
  return {
    ...result,
    tokens: result.tokenIds.map(id => `token_${id}`),
  };
}

/**
 * Gets information about an encoding
 */
export function getEncodingInfo(encodingName: string) {
  const encoding = getEncoding(encodingName);
  return encoding.getInfo();
}

/**
 * Batch tokenizes multiple texts
 */
export function countTokensBatch(texts: string[], model: string): number[] {
  return texts.map(text => countTokens(text, model));
}

/**
 * Estimates tokens based on word count (approximation)
 */
export function estimateTokens(text: string): number {
  return estimateTokenCount(text, 'gpt-4');
}

/**
 * Lists all supported models
 */
export { listModels };

/**
 * Lists all available encodings
 */
export { listEncodings };

export const DEFAULT_MODEL = 'gpt-4';

export { TOKEN_RATIOS };

export function estimateTokensSmart(text: string, contentType: keyof typeof TOKEN_RATIOS = 'english'): number {
  const ratio = TOKEN_RATIOS[contentType] || TOKEN_RATIOS.default;
  return Math.ceil(text.length * ratio);
}
