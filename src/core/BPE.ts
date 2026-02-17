/**
 * Byte Pair Encoding (BPE) Core Engine
 * 
 * BPE works by:
 * 1. Starting with character-level vocabulary (bytes)
 * 2. Iteratively finding the most frequent adjacent pair
 * 3. Merging that pair into a new token
 * 4. Repeating until desired vocabulary size
 * 
 * This implementation uses a simplified approach for token counting.
 */

export class BytePairEncoding {
  private patStr: string;
  private mergeableRanks: Map<string, number>;
  private specialTokens: Map<string, number>;
  
  constructor(
    patStr: string = REGEX_PATTERN.source,
    mergeableRanks: Map<string, number> = new Map(),
    specialTokens: Map<string, number> = new Map()
  ) {
    this.patStr = patStr;
    this.mergeableRanks = mergeableRanks;
    this.specialTokens = specialTokens;
  }

  encode(text: string): number[] {
    const chunks = this.splitText(text);
    const tokenIds: number[] = [];
    
    for (const chunk of chunks) {
      if (this.specialTokens.has(chunk)) {
        tokenIds.push(this.specialTokens.get(chunk)!);
        continue;
      }
      
      const bytes = this.stringToBytes(chunk);
      const merged = this.applyBPESimple(bytes);
      
      for (const byte of merged) {
        tokenIds.push(byte + 256);
      }
    }
    
    return tokenIds;
  }

  decode(tokenIds: number[]): string {
    const bytes: number[] = [];
    
    for (const id of tokenIds) {
      for (const [token, tokenId] of this.specialTokens) {
        if (tokenId === id) {
          continue;
        }
      }
      
      const byte = id - 256;
      if (byte >= 0 && byte < 256) {
        bytes.push(byte);
      }
    }
    
    return this.bytesToString(bytes);
  }

  private splitText(text: string): string[] {
    try {
      const regex = new RegExp(this.patStr);
      const result: string[] = [];
      let lastIndex = 0;
      
      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          result.push(text.slice(lastIndex, match.index));
        }
        
        if (match[0]) {
          result.push(match[0]);
        }
        
        lastIndex = regex.lastIndex;
      }
      
      if (lastIndex < text.length) {
        result.push(text.slice(lastIndex));
      }
      
      return result;
    } catch {
      return [text];
    }
  }

  private applyBPESimple(bytes: number[]): number[] {
    if (bytes.length <= 1) return bytes;
    
    let result = bytes;
    let iterations = 0;
    const maxIterations = 1000;
    
    while (iterations < maxIterations) {
      let merged = false;
      
      for (const [pairKey, rank] of this.mergeableRanks) {
        if (pairKey.length !== 2) continue;
        
        const pairBytes = this.stringToBytes(pairKey);
        if (pairBytes.length !== 2) continue;
        
        const newResult: number[] = [];
        let i = 0;
        let changed = false;
        
        while (i < result.length) {
          if (i < result.length - 1 && 
              result[i] === pairBytes[0] && 
              result[i + 1] === pairBytes[1]) {
            newResult.push(256 + pairBytes[0] * 256 + pairBytes[1]);
            i += 2;
            changed = true;
          } else {
            newResult.push(result[i]);
            i++;
          }
        }
        
        if (changed) {
          result = newResult;
          merged = true;
          break;
        }
      }
      
      iterations++;
      if (!merged) break;
    }
    
    return result;
  }

  private stringToBytes(str: string): number[] {
    const bytes: number[] = [];
    
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      
      if (code < 0x80) {
        bytes.push(code);
      } else if (code < 0x800) {
        bytes.push(0xC0 | (code >> 6));
        bytes.push(0x80 | (code & 0x3F));
      } else if (code < 0x10000) {
        bytes.push(0xE0 | (code >> 12));
        bytes.push(0x80 | ((code >> 6) & 0x3F));
        bytes.push(0x80 | (code & 0x3F));
      } else {
        bytes.push(0xF0 | (code >> 18));
        bytes.push(0x80 | ((code >> 12) & 0x3F));
        bytes.push(0x80 | ((code >> 6) & 0x3F));
        bytes.push(0x80 | (code & 0x3F));
      }
    }
    
    return bytes;
  }

  private bytesToString(bytes: number[]): string {
    let result = '';
    let i = 0;
    
    while (i < bytes.length) {
      const byte = bytes[i];
      
      if (byte < 0x80) {
        result += String.fromCharCode(byte);
        i++;
      } else if ((byte & 0xE0) === 0xC0) {
        const char = ((byte & 0x1F) << 6) | (bytes[i + 1] & 0x3F);
        result += String.fromCharCode(char);
        i += 2;
      } else if ((byte & 0xF0) === 0xE0) {
        const char = ((byte & 0x0F) << 12) | 
                     ((bytes[i + 1] & 0x3F) << 6) | 
                     (bytes[i + 2] & 0x3F);
        result += String.fromCharCode(char);
        i += 3;
      } else if ((byte & 0xF8) === 0xF0) {
        const char = ((byte & 0x07) << 18) | 
                     ((bytes[i + 1] & 0x3F) << 12) |
                     ((bytes[i + 2] & 0x3F) << 6) | 
                     (bytes[i + 3] & 0x3F);
        result += String.fromCharCode(char);
        i += 4;
      } else {
        i++;
      }
    }
    
    return result;
  }
}

const REGEX_PATTERN = /[a-zA-Z]+|\d+|[^\s\w]+|\s+/;

export function createBPE(
  mergeableRanks?: Map<string, number>,
  specialTokens?: Map<string, number>
): BytePairEncoding {
  return new BytePairEncoding(REGEX_PATTERN.source, mergeableRanks, specialTokens);
}
