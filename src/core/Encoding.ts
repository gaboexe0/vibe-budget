/**
 * Encoding Class
 * 
 * This is the main abstraction layer that mirrors tiktoken.Encoding.
 * It combines:
 * - A regex pattern for text splitting
 * - A vocabulary of mergeable ranks (BPE)
 * - Special tokens handling
 * 
 * The Encoding provides the core tokenization interface used throughout
 * the system. All encoding/decoding goes through this class.
 */

import { BytePairEncoding } from './BPE.js';

export interface EncodingOptions {
  /** Name of the encoding (e.g., "o200k_base", "cl100k_base") */
  name: string;
  /** Regex pattern for splitting text into chunks */
  patStr: string;
  /** Map of mergeable token pairs to their ranks */
  mergeableRanks: Map<string, number>;
  /** Map of special tokens to their token IDs */
  specialTokens: Record<string, number>;
  /** Starting ID for the base vocabulary (usually 256 or 0) */
  baseVocabularyStart?: number;
}

export class Encoding {
  /** Name of the encoding */
  name: string;
  
  /** Regex pattern string for splitting text */
  patStr: string;
  
  /** Map of mergeable token pairs to their merge order (lower = merge first) */
  mergeableRanks: Map<string, number>;
  
  /** Map of special tokens to their token IDs */
  specialTokens: Record<string, number>;
  
  /** Base vocabulary start (byte 0-255 mapped to this + index) */
  private baseVocabularyStart: number;
  
  /** Internal BPE encoder */
  private bpe: BytePairEncoding;

  /**
   * Creates a new Encoding instance
   */
  constructor(options: EncodingOptions) {
    this.name = options.name;
    this.patStr = options.patStr;
    this.mergeableRanks = options.mergeableRanks;
    this.specialTokens = options.specialTokens;
    this.baseVocabularyStart = options.baseVocabularyStart ?? 256;
    
    // Convert special tokens Map to the format BPE expects
    const specialTokensMap = new Map<string, number>();
    for (const [token, id] of Object.entries(this.specialTokens)) {
      specialTokensMap.set(token, id);
    }
    
    // Create the underlying BPE encoder
    this.bpe = new BytePairEncoding(
      this.patStr,
      this.mergeableRanks,
      specialTokensMap
    );
  }

  /**
   * Encodes a string into an array of token IDs
   * 
   * @param text - The input text to encode
   * @param allowSpecial - Whether to allow special tokens in the output
   * @returns Array of token IDs
   */
  encode(text: string, allowSpecial: boolean = true): number[] {
    // For now, delegate to BPE
    // In a full implementation, this would handle special tokens specially
    const tokens = this.bpe.encode(text);
    
    // Convert from byte IDs to vocabulary IDs
    return tokens.map(byteId => {
      if (byteId < 0) {
        // This is a merged token - look it up in the vocabulary
        // For simplicity, we use byte + base as the token ID
        return this.baseVocabularyStart + 256 + Math.abs(byteId);
      }
      return byteId + this.baseVocabularyStart;
    });
  }

  /**
   * Decodes an array of token IDs back to a string
   * 
   * @param tokens - Array of token IDs
   * @returns Decoded string
   */
  decode(tokens: number[]): string {
    // Convert vocabulary IDs back to byte IDs
    const byteIds = tokens.map(tokenId => {
      const adjusted = tokenId - this.baseVocabularyStart;
      if (adjusted >= 0 && adjusted < 256) {
        return adjusted;
      }
      // For merged tokens, we need reverse lookup (not implemented in this stub)
      return adjusted - 256;
    }).filter(id => id >= 0);
    
    return this.bpe.decode(byteIds);
  }

  /**
   * Encodes a string and returns both token IDs and token text
   * 
   * @param text - Input text
   * @returns Object with token IDs and token strings
   */
  encodeWithTokens(text: string): { ids: number[]; tokens: string[] } {
    const ids = this.encode(text);
    
    // For display purposes, we'd need to track the actual tokens
    // This is a simplified version
    const tokens = ids.map(id => this.decode([id]));
    
    return { ids, tokens };
  }

  /**
   * Gets the token count for a text without full encoding
   * 
   * @param text - Input text
   * @returns Number of tokens
   */
  countTokens(text: string): number {
    return this.encode(text).length;
  }

  /**
   * Returns information about the encoding
   */
  getInfo(): {
    name: string;
    patStr: string;
    vocabSize: number;
    specialTokensCount: number;
  } {
    return {
      name: this.name,
      patStr: this.patStr,
      vocabSize: this.mergeableRanks.size + 256 + this.baseVocabularyStart,
      specialTokensCount: Object.keys(this.specialTokens).length
    };
  }
}

/**
 * Creates an Encoding instance with the given parameters
 * 
 * @param options - Encoding configuration options
 * @returns Encoding instance
 */
export function createEncoding(options: EncodingOptions): Encoding {
  return new Encoding(options);
}

/**
 * Common special tokens used across encodings
 */
export const COMMON_SPECIAL_TOKENS: Record<string, number> = {
  '<|endoftext|>': 200049,
  '<|startoftext|>': 200050,
  '<|endofprompt|>': 200048,
  '<|fim_prefix|>': 200019,
  '<|fim_middle|>': 200020,
  '<|fim_suffix|>': 200021,
  '<|repo_name|>': 200017,
  '<|file_sep|>': 200018,
  '<|step|>': 200016,
  '<|time|>': 200015,
};

/**
 * Default regex patterns for different encoding types
 * Simplified to work in JavaScript without Unicode property escapes
 */
export const PATTERNS = {
  /**
   * GPT-4 / Claude pattern - simplified
   */
  cl100k_base: /[a-zA-Z]+|[\u00C0-\u024F]+|\d+|[^\s\w]+|\s+/,
  
  /**
   * GPT-3.5 / Codex pattern - simplified
   */
  p50k_base: /[a-zA-Z]+|\d+|[^\s\w]+|\s+/,
  
  /**
   * GPT-2 / Raptor pattern - simplified
   */
  r50k_base: /[a-zA-Z]+|\d+|[^\s\w]+|\s+/,
};
