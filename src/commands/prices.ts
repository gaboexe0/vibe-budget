import { colors, formatCurrency, printDisclaimer } from '../utils/formatter.js';
import { getPrices } from '../core/calculator.js';

export async function pricesCommand(): Promise<void> {
  console.log(colors.bold('\nLoading model prices...\n'));

  const models = await getPrices();

  const sortedModels = [...models].sort((a, b) => 
    (a.price_per_1k_input + a.price_per_1k_output) - 
    (b.price_per_1k_input + b.price_per_1k_output)
  );

  console.log(colors.bold(`Total models: ${sortedModels.length}`));
  console.log(colors.bold('\nModel'.padEnd(35) + 'Provider'.padEnd(15) + 'Input/1K'.padEnd(12) + 'Output/1K'));
  console.log(colors.dim('-'.repeat(80)));

  sortedModels.slice(0, 30).forEach(model => {
    const name = model.name.length > 33 ? model.name.substring(0, 33) + '..' : model.name;
    console.log(
      name.padEnd(35) +
      model.provider.padEnd(15) +
      formatCurrency(model.price_per_1k_input).padEnd(12) +
      formatCurrency(model.price_per_1k_output)
    );
  });

  if (sortedModels.length > 30) {
    console.log(colors.dim(`\n... and ${sortedModels.length - 30} more models`));
  }
  
  printDisclaimer();
}
