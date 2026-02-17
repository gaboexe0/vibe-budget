import { CostEstimate, EstimateResult } from './estimator.js';

export interface RankedModel {
  rank: number;
  modelId: string;
  modelName: string;
  provider: string;
  usd: number;
  evalScore?: number;
  qualityPriceScore?: number;
}

export interface RankingResult {
  byCost: RankedModel[];
  byEval: RankedModel[];
  byQualityPrice: RankedModel[];
  top3: RankedModel[];
  top3QualityPrice: RankedModel[];
  worst: RankedModel | null;
}

function calculateQualityPriceScore(evalScore: number, totalCost: number, maxEvalScore: number): number {
  const normalizedEval = evalScore / maxEvalScore;
  const normalizedCost = Math.log10(totalCost + 0.01) / Math.log10(100);
  const score = (normalizedEval * 0.7) + ((1 - normalizedCost) * 0.3);
  return Math.round(score * 100) / 100;
}

export function rankModels(estimateResult: EstimateResult): RankingResult {
  const maxEval = Math.max(...estimateResult.costs.map(c => c.evalScore || 0), 100);
  
  const byCost = [...estimateResult.costs]
    .sort((a, b) => a.totalCost - b.totalCost)
    .map((c, i) => ({
      rank: i + 1,
      modelId: c.modelId,
      modelName: c.modelName,
      provider: c.provider,
      usd: c.totalCost,
      evalScore: c.evalScore,
      qualityPriceScore: c.evalScore ? calculateQualityPriceScore(c.evalScore, c.totalCost, maxEval) : undefined,
    }));

  const withEval = estimateResult.costs.filter((c) => c.evalScore);

  const byEval = [...withEval]
    .sort((a, b) => (b.evalScore || 0) - (a.evalScore || 0))
    .map((c, i) => ({
      rank: i + 1,
      modelId: c.modelId,
      modelName: c.modelName,
      provider: c.provider,
      usd: c.totalCost,
      evalScore: c.evalScore,
      qualityPriceScore: c.evalScore ? calculateQualityPriceScore(c.evalScore, c.totalCost, maxEval) : undefined,
    }));

  const byQualityPrice = [...withEval]
    .filter(c => c.evalScore)
    .map(c => ({
      rank: 0,
      modelId: c.modelId,
      modelName: c.modelName,
      provider: c.provider,
      usd: c.totalCost,
      evalScore: c.evalScore,
      qualityPriceScore: calculateQualityPriceScore(c.evalScore!, c.totalCost, maxEval),
    }))
    .sort((a, b) => (b.qualityPriceScore || 0) - (a.qualityPriceScore || 0))
    .map((c, i) => ({ ...c, rank: i + 1 }));

  const top3 = byCost.slice(0, 3);
  const top3QualityPrice = byQualityPrice.slice(0, 3);

  const expensive = [...estimateResult.costs].sort(
    (a, b) => b.totalCost - a.totalCost
  )[0];

  const worst: RankedModel | null = expensive
    ? {
        rank: byCost.length,
        modelId: expensive.modelId,
        modelName: expensive.modelName,
        provider: expensive.provider,
        usd: expensive.totalCost,
        evalScore: expensive.evalScore,
      }
    : null;

  return {
    byCost,
    byEval,
    byQualityPrice,
    top3,
    top3QualityPrice,
    worst,
  };
}

export function getTopByCost(estimateResult: EstimateResult, limit = 3): RankedModel[] {
  return rankModels(estimateResult).top3.slice(0, limit);
}

export function getWorstByCost(estimateResult: EstimateResult): RankedModel | null {
  return rankModels(estimateResult).worst;
}

export function getTopByQualityPrice(estimateResult: EstimateResult, limit = 3): RankedModel[] {
  return rankModels(estimateResult).top3QualityPrice.slice(0, limit);
}
