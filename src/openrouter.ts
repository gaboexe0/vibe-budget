import axios from 'axios';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CACHE_FILE = join(__dirname, '../data/prices-cache.json');
const CACHE_DURATION = 60 * 60 * 1000;

interface PriceCache {
  timestamp: number;
  models: {
    id: string;
    name: string;
    provider: string;
    inputPrice: number;
    outputPrice: number;
  }[];
}

let refreshInterval: NodeJS.Timeout | null = null;

export async function syncPrices(): Promise<PriceCache['models']> {
  if (existsSync(CACHE_FILE)) {
    const cache: PriceCache = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
    if (Date.now() - cache.timestamp < CACHE_DURATION) {
      return cache.models;
    }
  }

  try {
    const response = await axios.get(
      'https://openrouter.ai/api/v1/models?limit=100',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const models: PriceCache['models'] = response.data.data
      .filter(
        (m: any) => m.pricing?.input && m.pricing?.output
      )
      .map((m: any) => ({
        id: m.id,
        name: m.name || m.id,
        provider: m.id.split('/')[0],
        inputPrice: parseFloat(m.pricing.input),
        outputPrice: parseFloat(m.pricing.output),
      }));

    const cacheData: PriceCache = {
      timestamp: Date.now(),
      models,
    };

    writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
    return models;
  } catch (error) {
    return getCachedPrices() || [];
  }
}

export function getCachedPrices(): PriceCache['models'] | null {
  if (!existsSync(CACHE_FILE)) return null;

  try {
    const cache: PriceCache = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
    return cache.models;
  } catch {
    return null;
  }
}

export function startHourlyRefresh(): void {
  if (refreshInterval) return;

  syncPrices();
  refreshInterval = setInterval(() => {
    syncPrices().catch(console.error);
  }, CACHE_DURATION);
}

export function stopHourlyRefresh(): void {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

export async function getLivePrices(): Promise<PriceCache['models']> {
  return syncPrices();
}
