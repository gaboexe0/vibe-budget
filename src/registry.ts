/**
 * Encoding Registry
 * 
 * This module provides a central registry for accessing different
 * text encodings. It follows a similar pattern to tiktoken's
 * encoding factory.
 * 
 * How it works:
 * 1. ENCODINGS map stores factory functions for each encoding
 * 2. getEncoding(name) returns a cached or new Encoding instance
 * 3. encodingForModel(model) looks up the appropriate encoding for a model
 * 
 * Adding new encodings:
 * 1. Create a factory function that returns an Encoding
 * 2. Add it to the ENCODINGS map
 * 3. Add the model->encoding mapping to MODEL_TO_ENCODING
 * 
 * Where pricing logic can be added:
 * - In src/core/calculator.ts when calculating costs
 * - Use encodingForModel to get the right encoding
 * - Multiply token count by model's price per 1k tokens
 */

import { Encoding, PATTERNS, COMMON_SPECIAL_TOKENS } from './core/Encoding.js';

type EncodingFactory = () => Encoding;

/**
 * Registry of available encodings
 * 
 * Each encoding is a factory function that creates an Encoding instance.
 * This allows for lazy loading and caching of encodings.
 */
const ENCODINGS: Record<string, EncodingFactory> = {
  /**
   * o200k_base - OpenAI's newest encoding (GPT-4)
   * Largest vocabulary, optimized for GPT-4
   */
  o200k_base: () => createO200kBaseEncoding(),
  
  /**
   * cl100k_base - Common encoding for GPT-4 and Claude
   * Used by: gpt-4, gpt-4-turbo, claude-3, etc.
   */
  cl100k_base: () => createCl100kBaseEncoding(),
  
  /**
   * p50k_base - Used by Codex and older models
   */
  p50k_base: () => createP50kBaseEncoding(),
  
  /**
   * r50k_base - GPT-2 / original encoding
   */
  r50k_base: () => createR50kBaseEncoding(),
};

/**
 * Mapping of model names to their default encodings
 * 
 * This is used by encodingForModel() to determine which
 * encoding to use for a given model.
 * 
 * Model naming conventions:
 * - openai/gpt-4* -> cl100k_base
 * - anthropic/claude-* -> cl100k_base  
 * - openai/gpt-3.5-turbo -> cl100k_base
 * - openai/text-davinci-* -> p50k_base
 * - openai/codex-* -> p50k_base
 * - gpt-2 -> r50k_base
 */
const MODEL_TO_ENCODING: Record<string, string> = {
  // GPT-4 family
  'gpt-4': 'cl100k_base',
  'gpt-4-turbo': 'cl100k_base',
  'gpt-4o': 'o200k_base',
  'gpt-4o-mini': 'o200k_base',
  'gpt-4-32k': 'cl100k_base',
  
  // GPT-3.5 family
  'gpt-3.5-turbo': 'cl100k_base',
  'gpt-3.5-turbo-16k': 'cl100k_base',
  
  // Claude family (uses cl100k_base equivalent)
  'claude-3-opus': 'cl100k_base',
  'claude-3-sonnet': 'cl100k_base',
  'claude-3-5-sonnet': 'cl100k_base',
  'claude-3-haiku': 'cl100k_base',
  'claude-2': 'cl100k_base',
  'claude-2.1': 'cl100k_base',
  
  // Gemini
  'gemini-1.5-pro': 'cl100k_base',
  'gemini-1.5-flash': 'cl100k_base',
  'gemini-pro': 'cl100k_base',
  
  // Codex (older)
  'code-davinci-002': 'p50k_base',
  'code-davinci-001': 'p50k_base',
  'code-cushman-001': 'p50k_base',
  
  // Davinci (older)
  'text-davinci-003': 'p50k_base',
  'text-davinci-002': 'p50k_base',
  'text-davinci-001': 'r50k_base',
  'text-davinci': 'p50k_base',
  
  // Curie, Babbage, Ada
  'text-curie-001': 'r50k_base',
  'text-babbage-001': 'r50k_base',
  'text-ada-001': 'r50k_base',
  
  // GPT-2
  'gpt-2': 'r50k_base',
  
  // Llama (uses tiktoken's cl100k_base equivalent)
  'llama-2': 'cl100k_base',
  'llama-3': 'cl100k_base',
  'llama-3.1': 'cl100k_base',
  'llama-3.2': 'cl100k_base',
  
  // Mistral
  'mistral': 'cl100k_base',
  'mistral-large': 'cl100k_base',
  
  // Grok
  'grok-2': 'cl100k_base',
  'grok-1': 'cl100k_base',
};

/**
 * Cache for loaded encodings
 */
const encodingCache: Map<string, Encoding> = new Map();

/**
 * Gets an encoding by name
 * 
 * @param name - Encoding name (e.g., "cl100k_base")
 * @returns Encoding instance
 * @throws Error if encoding not found
 */
export function getEncoding(name: string): Encoding {
  // Check cache first
  if (encodingCache.has(name)) {
    return encodingCache.get(name)!;
  }
  
  // Look up the encoding factory
  const factory = ENCODINGS[name];
  if (!factory) {
    throw new Error(
      `Encoding "${name}" not found. Available encodings: ${Object.keys(ENCODINGS).join(', ')}`
    );
  }
  
  // Create and cache the encoding
  const encoding = factory();
  encodingCache.set(name, encoding);
  
  return encoding;
}

/**
 * Gets the appropriate encoding for a given model
 * 
 * @param model - Model name (e.g., "gpt-4", "claude-3-sonnet")
 * @returns Encoding instance
 * @throws Error if model not found
 */
export function encodingForModel(model: string): Encoding {
  // Extract the base model name (handle variations like gpt-4-turbo, gpt-4-32k)
  const baseModel = model.toLowerCase();
  
  // Try exact match first
  let encodingName = MODEL_TO_ENCODING[baseModel];
  
  // Try prefix matching
  if (!encodingName) {
    for (const [modelPattern, encoding] of Object.entries(MODEL_TO_ENCODING)) {
      if (baseModel.startsWith(modelPattern) || modelPattern.startsWith(baseModel)) {
        encodingName = encoding;
        break;
      }
    }
  }
  
  // Default to cl100k_base if no match
  if (!encodingName) {
    console.warn(`Warning: Unknown model "${model}", defaulting to cl100k_base`);
    encodingName = 'cl100k_base';
  }
  
  return getEncoding(encodingName);
}

/**
 * Lists all available encodings
 */
export function listEncodings(): string[] {
  return Object.keys(ENCODINGS);
}

/**
 * Lists all supported models
 */
export function listModels(): string[] {
  return Object.keys(MODEL_TO_ENCODING);
}

/**
 * Clears the encoding cache (useful for testing)
 */
export function clearCache(): void {
  encodingCache.clear();
}

// ============================================
// Encoding Factory Functions
// 
// These create the actual encoding instances
// with their specific merge tables and patterns
// ============================================

function createO200kBaseEncoding(): Encoding {
  /**
   * o200k_base is OpenAI's latest encoding with ~200k vocabulary
   * 
   * Note: This is a stub implementation. In production, you would
   * load the actual merge ranks from a JSON file or external source.
   */
  
  // Stub merge ranks - these would come from actual training data
  const mergeableRanks = new Map<string, number>();
  
  // Add common merges (stub data)
  const commonMerges = [
    'er', 'es', 'ed', 'ly', 'ing', 'ion', 'ity', 'ous', 'ive', 'able',
    'the', 'and', 'of', 'to', 'in', 'is', 'it', 'he', 'as', 'at',
    're', 've', 'll', 'nt', 'st', 'nd', 'ng', 'tt', 'ss', 'oo',
  ];
  
  commonMerges.forEach((merge, index) => {
    mergeableRanks.set(merge, index + 1);
  });
  
  return new Encoding({
    name: 'o200k_base',
    patStr: PATTERNS.cl100k_base.source,
    mergeableRanks,
    specialTokens: COMMON_SPECIAL_TOKENS,
    baseVocabularyStart: 0,
  });
}

function createCl100kBaseEncoding(): Encoding {
  /**
   * cl100k_base is the encoding used by GPT-4 and Claude 3
   * ~100k vocabulary size
   */
  
  const mergeableRanks = new Map<string, number>();
  
  const commonMerges = [
    'er', 'es', 'ed', 'ly', 'ing', 'ion', 'ity', 'ous', 'ive', 'able',
    'the', 'and', 'of', 'to', 'in', 'is', 'it', 'he', 'as', 'at',
    're', 've', 'll', 'nt', 'st', 'nd', 'ng', 'tt', 'ss', 'oo',
    'be', 'or', 'an', 'en', 'al', 'te', 'ce', 'de', 'se', 'le',
  ];
  
  commonMerges.forEach((merge, index) => {
    mergeableRanks.set(merge, index + 1);
  });
  
  return new Encoding({
    name: 'cl100k_base',
    patStr: PATTERNS.cl100k_base.source,
    mergeableRanks,
    specialTokens: COMMON_SPECIAL_TOKENS,
    baseVocabularyStart: 256,
  });
}

function createP50kBaseEncoding(): Encoding {
  /**
   * p50k_base used by Codex and text-davinci-002/003
   * ~50k vocabulary
   */
  
  const mergeableRanks = new Map<string, number>();
  
  const commonMerges = [
    'er', 'es', 'ed', 'ly', 'ing', 'the', 'and', 'of', 'to', 'in',
    'is', 'it', 'he', 'as', 'at', 're', 've', 'll', 'nt', 'st',
  ];
  
  commonMerges.forEach((merge, index) => {
    mergeableRanks.set(merge, index + 1);
  });
  
  return new Encoding({
    name: 'p50k_base',
    patStr: PATTERNS.p50k_base.source,
    mergeableRanks,
    specialTokens: COMMON_SPECIAL_TOKENS,
    baseVocabularyStart: 256,
  });
}

function createR50kBaseEncoding(): Encoding {
  /**
   * r50k_base - original GPT-2 encoding
   * ~50k vocabulary
   */
  
  const mergeableRanks = new Map<string, number>();
  
  const commonMerges = [
    'er', 'es', 'ed', 'ly', 'ing', 'the', 'and', 'of', 'to', 'in',
    'is', 'it', 'he', 'as', 'at', 're', 've', 'll', 'nt', 'st',
    'Ġthe', 'Ġand', 'Ġof', 'Ġto', 'Ġin', 'Ġis', 'Ġit', 'Ġhe', 'Ġas',
  ];
  
  commonMerges.forEach((merge, index) => {
    mergeableRanks.set(merge, index + 1);
  });
  
  return new Encoding({
    name: 'r50k_base',
    patStr: PATTERNS.r50k_base.source,
    mergeableRanks,
    specialTokens: {
      '<|endoftext|>': 50256,
    },
    baseVocabularyStart: 0,
  });
}
