import { PROJECT_TOKENS, ProjectType, getProjectTokens } from './contracts.js';
import { MODELS, Model, getModelById, getModelByName } from './models.js';

export interface CostEstimate {
  modelId: string;
  modelName: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  evalScore?: number;
}

export interface EstimateResult {
  project: ProjectType;
  tokens: number;
  inputTokens: number;
  outputTokens: number;
  costs: CostEstimate[];
}

export function estimate(project: ProjectType): EstimateResult {
  const tokenBase = getProjectTokens(project);
  const inputTokens = tokenBase.input;
  const outputTokens = tokenBase.output;
  const totalTokens = inputTokens + outputTokens;

  const costs: CostEstimate[] = MODELS.map((model) => {
    const inputCost = (inputTokens / 1000) * model.inputPrice;
    const outputCost = (outputTokens / 1000) * model.outputPrice;
    const totalCost = inputCost + outputCost;

    return {
      modelId: model.id,
      modelName: model.name,
      provider: model.provider,
      inputTokens,
      outputTokens,
      totalTokens,
      inputCost: Math.round(inputCost * 10000) / 10000,
      outputCost: Math.round(outputCost * 10000) / 10000,
      totalCost: Math.round(totalCost * 10000) / 10000,
      evalScore: model.evalScore,
    };
  });

  return {
    project,
    tokens: totalTokens,
    inputTokens,
    outputTokens,
    costs,
  };
}

export function estimateForModel(
  project: ProjectType,
  modelIdOrName: string
): CostEstimate | null {
  const result = estimate(project);
  const model =
    getModelById(modelIdOrName) || getModelByName(modelIdOrName);

  if (!model) return null;

  return result.costs.find((c) => c.modelId === model.id) || null;
}
