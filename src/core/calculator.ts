import axios from 'axios';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { MODEL_DATA, getAllModels, getProjects, getProjectTokens, ProjectType } from '../contracts.js';
import { colors } from '../utils/formatter.js';
import { BENCHMARKS, getBestBenchmark } from '../benchmarks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ModelPrice {
  id: string;
  name: string;
  provider: string;
  price_per_1k_input: number;
  price_per_1k_output: number;
  evalScore?: number;
  benchmarkScore?: number;
}

export interface CostEstimate {
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  qpScore?: number;
  benchmarkScore?: number;
}

export interface ModelRecommendation {
  model: ModelPrice;
  cost: CostEstimate;
  recommendation: 'best' | 'recommended' | 'cheap';
  reason: string;
}

const CACHE_FILE = join(__dirname, '../data/prices-cache.json');
const CACHE_DURATION = 1000 * 60 * 60;

interface PriceCache {
  timestamp: number;
  models: ModelPrice[];
}

const DEFAULT_PRICES: Record<string, { input: number; output: number }> = {
  // OpenAI (precios por MILLÓN de tokens - formato OpenRouter)
  'openai/gpt-5.2': { input: 2.5, output: 10.0 },
  'openai/gpt-5.2-thinking': { input: 10.0, output: 40.0 },
  'openai/gpt-5.1': { input: 1.5, output: 6.0 },
  'openai/gpt-5-nano': { input: 0.1, output: 0.4 },
  'openai/gpt-4o': { input: 2.5, output: 10.0 },
  'openai/gpt-4o-mini': { input: 0.15, output: 0.6 },
  'openai/o3': { input: 10.0, output: 40.0 },
  'openai/o4-mini': { input: 1.1, output: 4.4 },
  
  // Anthropic (todos los modelos premium incluidos)
  'anthropic/claude-opus-4.6': { input: 15.0, output: 75.0 },
  'anthropic/claude-opus-4.5': { input: 15.0, output: 75.0 },
  'anthropic/claude-opus-4.1': { input: 15.0, output: 75.0 },
  'anthropic/claude-sonnet-4.5': { input: 3.0, output: 15.0 },
  'anthropic/claude-sonnet-4': { input: 3.0, output: 15.0 },
  'anthropic/claude-3.7-sonnet': { input: 3.0, output: 15.0 },
  'anthropic/claude-3.5-sonnet': { input: 3.0, output: 15.0 },
  'anthropic/claude-3.5-haiku': { input: 0.8, output: 4.0 },
  'anthropic/claude-3-opus': { input: 15.0, output: 75.0 },
  'anthropic/claude-haiku-4.5': { input: 0.8, output: 4.0 },
  'anthropic/claude-haiku-3.5': { input: 0.8, output: 4.0 },
  'anthropic/claude-haiku-3': { input: 0.25, output: 1.25 },
  
  // Google
  'google/gemini-3-pro': { input: 1.5, output: 6.0 },
  'google/gemini-3-flash-preview': { input: 0.2, output: 1.0 },
  'google/gemini-3-deep-think': { input: 3.0, output: 15.0 },
  'google/gemini-2.5-pro': { input: 2.5, output: 10.0 },
  'google/gemini-2.5-ultra': { input: 3.0, output: 15.0 },
  'google/gemini-2.5-flash': { input: 0.1, output: 0.4 },
  'google/gemini-2.5-flash-lite': { input: 0.05, output: 0.2 },
  'google/gemini-2.0-flash': { input: 0.1, output: 0.5 },
  'google/gemini-1.5-pro': { input: 1.25, output: 5.0 },
  'google/gemini-1.5-flash': { input: 0.075, output: 0.3 },
  'google/gemini-diffusion': { input: 0.5, output: 2.5 },
  'google/gemini-1.0-ultra': { input: 1.5, output: 6.0 },
  
  // xAI
  'xai/grok-4.1-fast-reasoning': { input: 5.0, output: 25.0 },
  'xai/grok-4.1-fast-non-reasoning': { input: 2.0, output: 10.0 },
  'xai/grok-4.1-fast': { input: 2.0, output: 10.0 },
  'xai/grok-4': { input: 5.0, output: 25.0 },
  'xai/grok-4-code': { input: 3.0, output: 15.0 },
  'xai/grok-3-beta': { input: 5.0, output: 15.0 },
  'xai/grok-3-fast-beta': { input: 2.0, output: 6.0 },
  'xai/grok-3-mini-beta': { input: 0.5, output: 1.5 },
  'xai/grok-2': { input: 0.5, output: 1.0 },
  
  // DeepSeek
  'deepseek/deepseek-v4': { input: 0.3, output: 1.5 },
  'deepseek/deepseek-v3.2-exp': { input: 0.3, output: 1.5 },
  'deepseek/deepseek-v3.2-speciale': { input: 0.4, output: 2.0 },
  'deepseek/deepseek-v3.2': { input: 0.3, output: 1.5 },
  'deepseek/deepseek-v3.1': { input: 0.3, output: 1.5 },
  'deepseek/deepseek-v3': { input: 0.3, output: 1.5 },
  'deepseek/deepseek-r1': { input: 0.55, output: 2.75 },
  'deepseek/deepseek-r1-0528': { input: 0.55, output: 2.75 },
  'deepseek/deepseek-coder-v2': { input: 0.3, output: 1.5 },
  'deepseek/deepseek-coder-33b': { input: 0.3, output: 1.5 },
  'deepseek/deepseek-math': { input: 0.55, output: 2.75 },
  'deepseek/deepseek-prover': { input: 0.55, output: 2.75 },
  'deepseek/deepseek-reasoner': { input: 0.55, output: 2.75 },
  
  // Qwen
  'qwen/qwen3-coder-480b': { input: 4.0, output: 16.0 },
  'qwen/qwen3-coder-next': { input: 2.0, output: 8.0 },
  'qwen/qwen3-235b-thinking': { input: 3.0, output: 15.0 },
  'qwen/qwen3-80b-thinking': { input: 1.0, output: 5.0 },
  'qwen/qwen3-max': { input: 4.0, output: 16.0 },
  'qwen/qwen-2.5-coder-32b': { input: 0.5, output: 2.0 },
  'qwen/qwen-2.5-coder-14b': { input: 0.3, output: 1.5 },
  'qwen/qwen-2.5-coder-7b': { input: 0.2, output: 1.0 },
  'qwen/qwen-2.5-coder-3b': { input: 0.1, output: 0.5 },
  'qwen/qwen-2.5-coder-1.5b': { input: 0.1, output: 0.4 },
  'qwen/qwen-2.5-72b': { input: 0.8, output: 3.0 },
  'qwen/qwen-2.5-7b': { input: 0.2, output: 1.0 },
  'qwen/qwen-max': { input: 4.0, output: 16.0 },
  'qwen/qwen-plus': { input: 1.0, output: 5.0 },
  'qwen/qwen-turbo': { input: 0.3, output: 1.5 },
  'qwen/qwen-flash': { input: 0.1, output: 0.5 },
  'qwen/qwq-32b': { input: 0.6, output: 3.0 },
  
  // Zhipu AI
  'zhipu/glm-5': { input: 0.3, output: 1.5 },
  'zhipu/glm-4.7': { input: 0.2, output: 1.0 },
  'zhipu/glm-4.7-code': { input: 0.2, output: 1.0 },
  'zhipu/glm-4.6': { input: 0.15, output: 0.8 },
  'zhipu/glm-4': { input: 0.1, output: 0.5 },
  'zhipu/pony-alpha': { input: 0.5, output: 2.5 },
  
  // MiniMax
  'minimax/minimax-m2.5': { input: 0.2, output: 1.0 },
  'minimax/minimax-m2.1': { input: 0.2, output: 1.0 },
  'minimax/minimax-text-01': { input: 0.2, output: 1.0 },
  'minimax/minimax-vl-01': { input: 0.2, output: 1.0 },
  'minimax/minimax-m2-her': { input: 0.2, output: 1.0 },
  
  // Moonshot
  'moonshot/kimi-k2.5': { input: 1.0, output: 5.0 },
  
  // Yi
  'yi/yi-large': { input: 3.0, output: 15.0 },
  'yi/yi-medium': { input: 1.0, output: 5.0 },
  'yi/yi-coder-9b': { input: 0.3, output: 1.5 },
};

const FALLBACK_PRICES: Record<string, { input: number; output: number }> = {
  'google/gemini-1.0-ultra': { input: 1.5, output: 6.0 },
  'google/gemini-diffusion': { input: 0.5, output: 2.5 },
  'zhipu/glm-5': { input: 0.3, output: 1.5 },
  'zhipu/glm-4.7': { input: 0.2, output: 1.0 },
  'zhipu/glm-4.7-code': { input: 0.2, output: 1.0 },
  'zhipu/glm-4.6': { input: 0.15, output: 0.8 },
  'zhipu/glm-4': { input: 0.1, output: 0.5 },
  'zhipu/pony-alpha': { input: 0.5, output: 2.5 },
};

function getPriceForModel(fullId: string): { input: number; output: number } | null {
  if (DEFAULT_PRICES[fullId]) {
    return DEFAULT_PRICES[fullId];
  }
  if (FALLBACK_PRICES[fullId]) {
    return FALLBACK_PRICES[fullId];
  }
  return null;
}

function buildModelMap(): ModelPrice[] {
  const models: ModelPrice[] = [];
  
  const providerMapping: Record<string, string> = {
    'openai': 'openai',
    'anthropic': 'anthropic',
    'google': 'google',
    'xai': 'xai',
    'deepseek': 'deepseek',
    'qwen': 'qwen',
    'zhipu': 'zhipu',
    'minimax': 'minimax',
    'moonshot': 'moonshot',
    'yi': 'yi',
  };

  for (const [providerKey, providerData] of Object.entries(MODEL_DATA)) {
    const providerPrefix = providerMapping[providerKey] || providerKey;
    
    for (const model of providerData.models) {
      const fullId = `${providerPrefix}/${model.id}`;
      const prices = getPriceForModel(fullId);
      
      if (prices) {
        models.push({
          id: fullId,
          name: model.name,
          provider: providerData.name,
          price_per_1k_input: prices.input,
          price_per_1k_output: prices.output,
        });
      } else {
        models.push({
          id: fullId,
          name: model.name,
          provider: providerData.name,
          price_per_1k_input: 0.5,
          price_per_1k_output: 2.5,
        });
      }
    }
  }
  
  return models;
}

export async function getContractModels(): Promise<ModelPrice[]> {
  return buildModelMap();
}

export async function getApiPrices(): Promise<Map<string, { input: number; output: number }>> {
  const priceMap = new Map<string, { input: number; output: number }>();
  
  if (existsSync(CACHE_FILE)) {
    const cache: PriceCache = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
    if (Date.now() - cache.timestamp < CACHE_DURATION && cache.models.length > 0) {
      for (const model of cache.models) {
        priceMap.set(model.id, { 
          input: model.price_per_1k_input, 
          output: model.price_per_1k_output 
        });
      }
      return priceMap;
    }
  }

  try {
    const response = await axios.get('https://openrouter.ai/api/v1/models?limit=200', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || ''}`,
        'Content-Type': 'application/json'
      }
    });

    for (const model of response.data.data) {
      if (model.pricing?.prompt || model.pricing?.completion) {
        priceMap.set(model.id, {
          input: parseFloat(model.pricing?.prompt || '0'),
          output: parseFloat(model.pricing?.completion || '0'),
        });
      }
    }

    const cacheData: PriceCache = {
      timestamp: Date.now(),
      models: Array.from(priceMap.entries()).map(([id, prices]) => ({
        id,
        name: id,
        provider: id.split('/')[0] || 'unknown',
        price_per_1k_input: prices.input,
        price_per_1k_output: prices.output,
      })),
    };
    writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));

  } catch (error) {
    console.log('Warning: OpenRouter API unavailable - using fallback prices');
  }

  return priceMap;
}

export async function getPrices(): Promise<ModelPrice[]> {
  const contractModels = buildModelMap();
  return contractModels;
}

export function calculateCost(
  model: ModelPrice,
  inputTokens: number,
  outputTokens: number
): CostEstimate {
  const inputCost = (inputTokens / 1000000) * model.price_per_1k_input;
  const outputCost = (outputTokens / 1000000) * model.price_per_1k_output;

  return {
    model: model.name,
    provider: model.provider,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    inputCost: Number(inputCost.toFixed(4)),
    outputCost: Number(outputCost.toFixed(4)),
    totalCost: Number((inputCost + outputCost).toFixed(4)),
  };
}

export function compareModels(
  models: ModelPrice[],
  inputTokens: number,
  outputTokens: number
): CostEstimate[] {
  return models
    .map(model => calculateCost(model, inputTokens, outputTokens))
    .sort((a, b) => a.totalCost - b.totalCost);
}

export function getRecommendedModel(
  models: ModelPrice[],
  projectType: string
): ModelPrice | null {
  const recommendations: Record<string, string[]> = {
    // Proyectos originales
    'landing': ['google/gemini-2.5-flash', 'openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'formulario': ['google/gemini-2.5-flash', 'openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'app': ['openai/gpt-4o-mini', 'google/gemini-2.5-flash', 'anthropic/claude-3.5-haiku'],
    'ecommerce': ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'google/gemini-2.5-pro'],
    'crm': ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'google/gemini-2.5-pro'],
    'dashboard': ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'google/gemini-2.5-pro'],
    'saas': ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'google/gemini-2.5-pro'],
    'ai_agent': ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'google/gemini-2.5-pro'],
    'auth': ['google/gemini-2.5-flash', 'openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'api': ['google/gemini-2.5-flash', 'openai/gpt-4o-mini'],
    'fullstack': ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'google/gemini-2.5-pro'],

    // Frente 1: Backend e Infraestructura
    'rest_api': ['openai/gpt-4o-mini', 'google/gemini-2.5-flash'],
    'graphql_api': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'microservicios': ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o'],
    'docker_container': ['google/gemini-2.5-flash', 'openai/gpt-4o-mini'],
    'kubernetes_deploy': ['google/gemini-2.5-flash', 'openai/gpt-4o-mini'],
    'docker_compose': ['google/gemini-2.5-flash', 'openai/gpt-4o-mini'],

    // Frente 2: Frontend
    'nextjs_app': ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet'],
    'react_dashboard': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'vue_nuxt': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'landing_page': ['google/gemini-2.5-flash', 'openai/gpt-4o-mini'],
    'shadcn_ui': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'framer_motion': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'seo_optimization': ['google/gemini-2.5-flash', 'openai/gpt-4o-mini'],

    // Frente 3: IA Aplicada
    'langchain_agent': ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o'],
    'multi_agent': ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o'],
    'tool_calling': ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o'],
    'rag_system': ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o'],
    'vector_database': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'document_pipeline': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],

    // Frente 4: Cloud
    'serverless_lambda': ['google/gemini-2.5-flash', 'openai/gpt-4o-mini'],
    'terraform_iac': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'event_driven': ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet'],
    'sqs_kafka': ['google/gemini-2.5-flash', 'openai/gpt-4o-mini'],

    // Frente 5: Bases de Datos
    'postgresql_prisma': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'mongodb_aggregation': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'redis_cache': ['google/gemini-2.5-flash', 'openai/gpt-4o-mini'],
    'database_schema': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],

    // Frente 6: Seguridad
    'nextauth': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'oauth_openid': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'rbac_permissions': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'jwt_sessions': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],

    // Frente 7: DevTools
    'cli_tool': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'github_actions': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'project_generator': ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o'],

    // Frente 8: E-commerce
    'stripe_payment': ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o'],
    'product_catalog': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'shopping_cart': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'checkout_flow': ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o'],

    // Frente 9: SaaS/CRM
    'admin_panel': ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet'],
    'user_management': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'analytics_dashboard': ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o'],
    'reporting_engine': ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o'],

    // Frente 10: Mobile
    'react_native': ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet'],
    'flutter_app': ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet'],
    'native_bridge': ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet'],

    // Frente 11: Testing
    'playwright_e2e': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'vitest_unit': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'integration_tests': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],

    // Frente 12: Documentación
    'swagger_openapi': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'technical_wiki': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'readme_generator': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],

    // Frente 13: Mantenimiento
    'refactoring': ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o'],
    'migration_script': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    'type_safety': ['openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
  };

  const recommendedIds = recommendations[projectType] || recommendations['saas'];

  for (const id of recommendedIds) {
    const model = models.find(m => m.id === id);
    if (model) return model;
  }

  return models[0] || null;
}

export function getBenchmarkForModel(modelName: string): number {
  const score = getBestBenchmark(modelName);
  if (score !== undefined) return score;
  
  const knownScores: Record<string, number> = {
    'GPT-5.2': 89.0,
    'GPT-5.1': 88.5,
    'GPT-5 Nano': 85.0,
    'GPT-4o': 90.2,
    'GPT-4o-mini': 87.0,
    'Claude Opus 4.6': 80.8,
    'Claude Opus 4.5': 93.8,
    'Claude Sonnet 4.5': 77.2,
    'Claude Sonnet 4': 47.1,
    'Claude 3.5 Sonnet': 92.0,
    'Claude 3.5 Haiku': 88.1,
    'Claude 3 Opus': 84.9,
    'Gemini 3 Pro': 92.5,
    'Gemini 3 Flash Preview': 90.8,
    'Gemini 3 Deep Think': 93.8,
    'Gemini 2.5 Pro': 73.0,
    'Gemini 2.5 Flash': 71.0,
    'Gemini 2.5 Flash-Lite': 68.0,
    'Gemini 2.0 Flash': 70.0,
    'Grok 4': 58.6,
    'Grok 4 Code': 70.8,
    'Grok 2': 88.4,
    'DeepSeek V4': 85.0,
    'DeepSeek V3': 82.6,
    'DeepSeek V3.2 Speciale': 89.6,
    'DeepSeek R1': 96.1,
    'DeepSeek R1-0528': 95.0,
    'Qwen3 Coder Next': 70.6,
    'Qwen3 Max': 74.8,
    'Qwen 2.5 Coder 32B': 92.7,
    'Qwen 2.5 Coder 14B': 88.0,
    'Qwen 2.5 Coder 7B': 88.4,
    'GLM-5': 94.2,
    'GLM-4.7': 85.2,
    'GLM-4.6': 82.8,
    'MiniMax M2.5': 89.6,
    'MiniMax M2.1': 74.0,
    'Kimi K2.5': 76.8,
  };
  
  return knownScores[modelName] || 50;
}

const ECONOMIC_MODELS: Record<string, number> = {
  'GPT-4o-mini': 40,
  'Gemini 2.5 Flash': 40,
  'Gemini 2.5 Flash-Lite': 50,
  'Gemini 2.0 Flash': 40,
  'Claude Haiku 3.5': 35,
  'Claude Haiku 3': 38,
  'Qwen Turbo': 35,
  'Qwen Flash': 40,
  'MiniMax M2.5': 35,
  'DeepSeek V3': 30,
  'GPT-5 Nano': 35,
};

const PREMIUM_MODELS: Record<string, number> = {
  'Claude Opus 4.6': 30,
  'Claude Opus 4.5': 28,
  'Claude Sonnet 4.5': 22,
  'Claude Sonnet 4': 18,
  'Claude 3.5 Sonnet': 15,
  'GPT-5.2': 30,
  'GPT-5.1': 28,
  'GPT-4o': 18,
  'Gemini 3 Pro': 22,
};

const REASONING_MODELS: Record<string, number> = {
  'DeepSeek R1': 25,
  'DeepSeek R1-0528': 23,
  'DeepSeek V3.2 Speciale': 20,
};

export function calculateQPscore(
  benchmarkScore: number, 
  totalCost: number, 
  totalTokens: number, 
  complexity: 'simple' | 'medium' | 'complex' = 'medium',
  modelName?: string
): number {
  const maxBenchmark = 100;
  let adjustedBenchmark = benchmarkScore;
  let isPremiumOrReasoning = false;
  
  if (modelName) {
    if (complexity === 'simple') {
      if (ECONOMIC_MODELS[modelName]) {
        adjustedBenchmark = Math.min(benchmarkScore + ECONOMIC_MODELS[modelName], 100);
      } else {
        adjustedBenchmark = benchmarkScore * 0.4;
      }
    } else if (complexity === 'medium') {
      if (ECONOMIC_MODELS[modelName]) {
        adjustedBenchmark = Math.min(benchmarkScore + ECONOMIC_MODELS[modelName] * 0.7, 100);
      } else if (PREMIUM_MODELS[modelName]) {
        adjustedBenchmark = Math.min(benchmarkScore + PREMIUM_MODELS[modelName] * 0.6, 100);
      }
    } else if (complexity === 'complex') {
      if (PREMIUM_MODELS[modelName] || REASONING_MODELS[modelName]) {
        adjustedBenchmark = Math.min(benchmarkScore + (PREMIUM_MODELS[modelName] || REASONING_MODELS[modelName] || 0), 100);
        isPremiumOrReasoning = true;
      } else if (ECONOMIC_MODELS[modelName]) {
        adjustedBenchmark = benchmarkScore * 0.5;
      }
    }
  }
  
  const normalizedQuality = adjustedBenchmark / maxBenchmark;
  
  const costPerToken = totalTokens > 0 ? totalCost / totalTokens : 1;
  let normalizedCost = Math.min(costPerToken * 1000, 1);
  
  if (complexity === 'complex' && isPremiumOrReasoning) {
    normalizedCost = normalizedCost * 0.7;
  }
  
  let qualityWeight: number;
  let costWeight: number;
  
  switch (complexity) {
    case 'simple':
      qualityWeight = 0.1;
      costWeight = 0.9;
      break;
    case 'medium':
      qualityWeight = 0.25;
      costWeight = 0.75;
      break;
    case 'complex':
      qualityWeight = 0.65;
      costWeight = 0.35;
      break;
    default:
      qualityWeight = 0.5;
      costWeight = 0.5;
  }
  
  return (normalizedQuality * qualityWeight) + ((1 - normalizedCost) * costWeight);
}

export function enrichModelsWithBenchmarks(models: ModelPrice[]): ModelPrice[] {
  return models.map(model => ({
    ...model,
    benchmarkScore: getBenchmarkForModel(model.name),
    evalScore: getBenchmarkForModel(model.name)
  }));
}

const COMPLEXITY_THRESHOLDS = {
  simple: { min: 0, max: 30000, tokens: 'low' },
  medium: { min: 30000, max: 80000, tokens: 'medium' },
  complex: { min: 80000, max: Infinity, tokens: 'high' },
};

function getComplexityFromTokens(totalTokens: number): 'simple' | 'medium' | 'complex' {
  if (totalTokens < 30000) return 'simple';
  if (totalTokens < 80000) return 'medium';
  return 'complex';
}

export function getRecommendedModelsByTokens(
  models: ModelPrice[],
  inputTokens: number,
  outputTokens: number
): ModelRecommendation[] {
  const totalTokens = inputTokens + outputTokens;
  const complexity = getComplexityFromTokens(totalTokens);
  
  const enrichedModels = enrichModelsWithBenchmarks(models);
  
  const modelsWithCosts = enrichedModels.map(model => {
    const inputCost = (inputTokens / 1000000) * model.price_per_1k_input;
    const outputCost = (outputTokens / 1000000) * model.price_per_1k_output;
    const totalCost = inputCost + outputCost;
    
    const benchmarkScore = model.benchmarkScore || 50;
    const qpScore = calculateQPscore(benchmarkScore, totalCost, totalTokens, complexity, model.name);
    
    return {
      model,
      cost: {
        model: model.name,
        provider: model.provider,
        inputTokens,
        outputTokens,
        totalTokens,
        inputCost,
        outputCost,
        totalCost,
        qpScore,
        benchmarkScore,
      } as CostEstimate,
      qpScore,
    };
  });
  
  const sortedByQP = [...modelsWithCosts].sort((a, b) => (b.qpScore || 0) - (a.qpScore || 0));
  const sortedByCost = [...modelsWithCosts].sort((a, b) => a.cost.totalCost - b.cost.totalCost);
  const sortedByBenchmark = [...modelsWithCosts].sort((a, b) => (b.cost.benchmarkScore || 0) - (a.cost.benchmarkScore || 0));
  
  const recommendations: ModelRecommendation[] = [];
  
  const topBenchmark = sortedByBenchmark.slice(0, 3);
  for (const rec of topBenchmark) {
    recommendations.push({
      model: rec.model,
      cost: rec.cost,
      recommendation: 'best',
      reason: `Highest benchmark score (${rec.cost.benchmarkScore?.toFixed(1)}%) for ${complexity} complexity task`,
    });
  }
  
  const topQP = sortedByQP.slice(0, 5);
  for (const rec of topQP) {
    if (!recommendations.find(r => r.model.id === rec.model.id)) {
      recommendations.push({
        model: rec.model,
        cost: rec.cost,
        recommendation: 'recommended',
        reason: `Best quality-price ratio (QP: ${(rec.qpScore * 100).toFixed(0)}/100)`,
      });
    }
  }
  
  const cheapest = sortedByCost.slice(0, 3);
  for (const rec of cheapest) {
    if (!recommendations.find(r => r.model.id === rec.model.id)) {
      recommendations.push({
        model: rec.model,
        cost: rec.cost,
        recommendation: 'cheap',
        reason: `Lowest cost option for ${complexity} complexity task`,
      });
    }
  }
  
  return recommendations;
}

function getComplexityFromTaskComplexity(taskComplexity: string): 'simple' | 'medium' | 'complex' {
  switch (taskComplexity) {
    case 'low':
      return 'simple';
    case 'medium':
      return 'medium';
    case 'high':
    case 'very_high':
      return 'complex';
    default:
      return 'medium';
  }
}

const PREMIUM_PROVIDER_MODELS = [
  'Claude Opus 4.6',
  'Claude Opus 4.5',
  'Claude Sonnet 4.5',
  'Claude Sonnet 4',
  'Claude 3.5 Sonnet',
  'GPT-5.2',
  'GPT-5.1',
  'GPT-4o',
  'Gemini 3 Pro',
];

export function getModelRecommendationsForTask(
  models: ModelPrice[],
  taskId: string,
  inputTokens: number,
  outputTokens: number,
  taskComplexity?: string
): ModelRecommendation[] {
  const totalTokens = inputTokens + outputTokens;
  const complexity = taskComplexity 
    ? getComplexityFromTaskComplexity(taskComplexity)
    : getComplexityFromTokens(totalTokens);
  
  const enrichedModels = enrichModelsWithBenchmarks(models);
  
  const modelsWithCosts = enrichedModels.map(model => {
    const inputCost = (inputTokens / 1000000) * model.price_per_1k_input;
    const outputCost = (outputTokens / 1000000) * model.price_per_1k_output;
    const totalCost = inputCost + outputCost;
    
    const benchmarkScore = model.benchmarkScore || 50;
    let adjustedBenchmark = benchmarkScore;
    
    if (complexity === 'complex' && benchmarkScore < 70) {
      adjustedBenchmark = benchmarkScore * 0.8;
    } else if (complexity === 'simple' && benchmarkScore > 80) {
      adjustedBenchmark = benchmarkScore * 0.7;
    } else if (complexity === 'medium' && benchmarkScore > 90) {
      adjustedBenchmark = benchmarkScore * 0.85;
    }
    
    const qpScore = calculateQPscore(adjustedBenchmark, totalCost, totalTokens, complexity, model.name);
    
    const isTopProvider = PREMIUM_PROVIDER_MODELS.includes(model.name);
    
    return {
      model,
      cost: {
        model: model.name,
        provider: model.provider,
        inputTokens,
        outputTokens,
        totalTokens,
        inputCost,
        outputCost,
        totalCost,
        qpScore,
        benchmarkScore: adjustedBenchmark,
      } as CostEstimate,
      qpScore,
      isTopProvider,
    };
  });
  
  let sortedByQP: typeof modelsWithCosts;
  
  if (complexity === 'complex') {
    const topModels = modelsWithCosts.filter(m => m.isTopProvider);
    const otherModels = modelsWithCosts.filter(m => !m.isTopProvider);
    
    const sortedTop = [...topModels].sort((a, b) => (b.qpScore || 0) - (a.qpScore || 0));
    const sortedOther = [...otherModels].sort((a, b) => (b.qpScore || 0) - (a.qpScore || 0));
    
    sortedByQP = [...sortedTop, ...sortedOther];
  } else {
    sortedByQP = [...modelsWithCosts].sort((a, b) => (b.qpScore || 0) - (a.qpScore || 0));
  }
  
  const topModels = sortedByQP.slice(0, 10);
  const seenProviders = new Set<string>();
  const uniqueByProvider: typeof topModels = [];
  
  for (const rec of topModels) {
    if (!seenProviders.has(rec.model.provider)) {
      seenProviders.add(rec.model.provider);
      uniqueByProvider.push(rec);
    }
    if (uniqueByProvider.length >= 5) break;
  }
  
  return uniqueByProvider.map((rec, index) => ({
    model: rec.model,
    cost: rec.cost,
    recommendation: index === 0 ? 'best' : index < 3 ? 'recommended' : 'cheap',
    reason: `QP Score: ${(rec.qpScore * 100).toFixed(0)}/100 for ${complexity} task`,
  }));
}
