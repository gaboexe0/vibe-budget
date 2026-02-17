/**
 * Vibe Budget - Entry Point
 * 
 * Main entry point for the Vibe Budget CLI application.
 * 
 * This module orchestrates the different modules:
 * - CLI: Command-line interface handling
 * - Registry: Encoding/model lookup
 * - Tokenizer: Token counting
 * - Core: BPE encoding and cost calculation
 * 
 * Usage:
 *   npm run dev -- tokenize "hello world" --model gpt-4
 *   npx tsx src/index.ts tokenize "hello world" --model gpt-4
 */

import chalk from 'chalk';
import { program } from './cli.js';

/**
 * Banner displayed on startup
 */
function printBanner() {
  console.log(`
${chalk.cyan('╔═══════════════════════════════════════════╗')}
${chalk.cyan('║')}     ${chalk.bold('V I B E   B U D G E T')}                 ${chalk.cyan('║')}
${chalk.cyan('║')}     ${chalk.dim('AI Cost Estimation & Tokenizer')}      ${chalk.cyan('║')}
${chalk.cyan('╚═══════════════════════════════════════════╝')}
  `);
}

/**
 * Main entry point
 */
async function main() {
  printBanner();
  
  // Parse command line arguments
  program.parse(process.argv);
  
  // Show help if no arguments
  if (process.argv.length === 2) {
    program.help();
  }
}

// Run the application
main().catch((error) => {
  console.error(chalk.red(`Fatal error: ${error.message}`));
  process.exit(1);
});

// Export public API for programmatic use
export * from './tokenizer.js';
export { getEncoding, encodingForModel } from './registry.js';
export { BytePairEncoding } from './core/BPE.js';
export { Encoding } from './core/Encoding.js';
export { getPrices, calculateCost, compareModels } from './core/calculator.js';
