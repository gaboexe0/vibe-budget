import chalk from 'chalk';

export const colors = {
  primary: chalk.cyan,
  secondary: chalk.gray,
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  bold: chalk.bold,
  dim: chalk.dim,
  cyan: chalk.cyan,
  yellow: chalk.yellow,
  orange: chalk.hex('#FFA500'),
  red: chalk.red,
  green: chalk.green,
};

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(4)}`;
}

export function formatTable(headers: string[], rows: string[][]): string {
  const colWidths = headers.map((h, i) => 
    Math.max(h.length, ...rows.map(r => (r[i] || '').length))
  );

  const headerRow = headers.map((h, i) => h.padEnd(colWidths[i])).join(' | ');
  const separator = colWidths.map(w => '-'.repeat(w)).join('-+-');
  const dataRows = rows.map(row => 
    row.map((cell, i) => (cell || '').padEnd(colWidths[i])).join(' | ')
  );

  return [headerRow, separator, ...dataRows].join('\n');
}

export function printBanner() {
  console.log(`
  ${colors.primary('==================================================')}
  ${colors.primary('|')}     ${colors.bold('V I B E   B U D G E T')}                 ${colors.primary('|')}
  ${colors.primary('|')}     ${colors.dim('AI Cost Estimation & Comparison')}    ${colors.primary('|')}
  ${colors.primary('==================================================')}
  `);
}

export function printPriceWarning() {
  console.log(`
  ${colors.warning('ESTIMATED PRICES & TOKENS')}
  ${colors.dim('-'.repeat(60))}
  Prices shown are estimates based on OpenRouter costs.
  Token estimates are based on standard prompting patterns.
  Actual usage may vary based on prompt style and complexity.
  
  ${colors.cyan('View updated prices: https://openrouter.ai/models')}
  ${colors.dim('   (Use OpenRouter to access models with discount)')}
  ${colors.dim('-'.repeat(60))}
  `);
}

export function printCostComparison(comparisons: any[], recommended?: string) {
  console.log(colors.bold('\nCost Comparison:\n'));
  
  comparisons.forEach((c, i) => {
    const isRecommended = c.model === recommended;
    const prefix = isRecommended ? '>> ' : '   ';
    const modelName = isRecommended ? colors.success(c.model) : c.model;
    
    console.log(`${prefix}${modelName}`);
    console.log(`   Input:  ${formatCurrency(c.inputCost)}`);
    console.log(`   Output: ${formatCurrency(c.outputCost)}`);
    console.log(`   Total:  ${colors.bold(formatCurrency(c.totalCost))}`);
    console.log('');
  });
}

export function printDisclaimer() {
  console.log(colors.dim('\nPrices from OpenRouter - https://openrouter.ai'));
  console.log(colors.dim('   Prices are estimates and may vary. Use the link for updated pricing.\n'));
}
