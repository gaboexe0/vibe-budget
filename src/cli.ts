import { Command } from 'commander';
import chalk from 'chalk';
import { estimate, EstimateResult } from './estimator.js';
import { rankModels, RankingResult } from './ranking.js';
import {
  PROJECT_TOKENS,
  ProjectType,
  getProjects,
} from './contracts.js';
import { getModels } from './models.js';
import { syncPrices, startHourlyRefresh, getCachedPrices } from './openrouter.js';

export const program = new Command();

program
  .name('vibe-budget')
  .description('VibeCost - AI Project Budget Estimator')
  .version('1.0.0');

program
  .command('estimate')
  .description('Estimate project costs')
  .argument('[project]', 'Project type', 'saas')
  .option('-m, --model <model>', 'Filter by model name')
  .option('-v, --verbose', 'Show all models')
  .action(async (project: string, options: { model?: string; verbose?: boolean }) => {
    await syncPrices();
    
    const projectType = (project.toLowerCase() as ProjectType) || 'saas';
    
    if (!PROJECT_TOKENS[projectType]) {
      console.log('Available projects: ' + getProjects().join(', '));
      return;
    }

    const result = estimate(projectType);
    const ranking = rankModels(result);

    printEstimate(result, ranking, options.verbose || false);
  });

program
  .command('projects')
  .description('List all supported projects')
  .action(() => {
    console.log('\nSupported Projects:\n');
    getProjects().forEach((p) => {
      const tokens = PROJECT_TOKENS[p];
      console.log(`  ${p.padEnd(12)} ${(tokens.input + tokens.output).toLocaleString()} tokens`);
    });
    console.log('');
  });

program
  .command('models')
  .description('List all supported models')
  .action(() => {
    const models = getModels();
    console.log('\nSupported Models:\n');
    console.log(' Name                    Provider      Input     Output    Eval');
    console.log(' '.repeat(70));
    models.forEach((m) => {
      const name = m.name.padEnd(22);
      const provider = m.provider.padEnd(12);
      const input = m.inputPrice.toFixed(5).padStart(9);
      const output = m.outputPrice.toFixed(5).padStart(9);
      const evalScore = m.evalScore ? m.evalScore.toString().padStart(5) : 'N/A';
      console.log(` ${name} ${provider} $${input} $${output} ${evalScore}`);
    });
    console.log('');
  });

program
  .command('sync')
  .description('Sync prices from OpenRouter')
  .action(async () => {
    console.log('Syncing prices from OpenRouter...');
    const prices = await syncPrices();
    console.log(`Loaded ${prices.length} models from OpenRouter`);
  });

function printEstimate(
  result: EstimateResult,
  ranking: RankingResult,
  verbose: boolean
): void {
  const boxWidth = 50;
  const projectName = result.project.toUpperCase();

  console.log('\n' + '+'.repeat(boxWidth + 2));
  console.log(
    '| VibeCost Estimator - ' + projectName.padEnd(boxWidth - 23) + '|'
  );
  console.log('+'.repeat(boxWidth + 2));

  const budget = (result.tokens / 1000 * 0.0025).toFixed(2);
  console.log(
    `| Budget Estimate: $${budget.padEnd(boxWidth - 18)}|`
  );
  console.log(
    `| Estimated Tokens: ~${result.tokens.toLocaleString().padEnd(boxWidth - 19)}|`
  );
  console.log(
    `| Input: ${result.inputTokens.toLocaleString()} | Output: ${result.outputTokens.toLocaleString()}`.padEnd(boxWidth + 1) + '|'
  );
  console.log('+'.repeat(boxWidth + 2));

  console.log('| TOP RECOMMENDATIONS:'.padEnd(boxWidth + 2) + '|');
  console.log('|'.padEnd(boxWidth + 2) + '|');

  ranking.top3.forEach((m, i) => {
    const score = m.evalScore ? ` ${m.evalScore.toFixed(1)} HumanEval` : '';
    const line = `| ${i + 1}. ${m.modelName.padEnd(18)} $${m.usd.toFixed(2).padStart(6)}${score.padEnd(20)}|`;
    console.log(line.substring(0, boxWidth + 2) + '|');
  });

  console.log('|'.padEnd(boxWidth + 2) + '|');

  if (ranking.worst) {
    const avoidLine = `| AVOID: ${ranking.worst.modelName.padEnd(24)} ($${ranking.worst.usd.toFixed(2)})|`;
    console.log(avoidLine.substring(0, boxWidth + 2) + '|');
  }

  console.log('+'.repeat(boxWidth + 2));

  if (verbose) {
    console.log('\nAll Models (sorted by cost):\n');
    console.log(' Model                    Provider      Cost      Eval');
    console.log(' '.repeat(60));
    ranking.byCost.forEach((m) => {
      const evalStr = m.evalScore ? m.evalScore.toString().padStart(6) : '   N/A';
      console.log(
        ` ${m.modelName.padEnd(22)} ${m.provider.padEnd(12)} $${m.usd.toFixed(4).padStart(8)} ${evalStr}`
      );
    });
  }
}

program.parse();
