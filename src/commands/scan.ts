import { readdir, stat, readFile } from 'fs/promises';
import { join, extname } from 'path';
import { charsToTokens, countStringTokens } from '../core/tokenizer.js';
import { getPrices } from '../core/calculator.js';
import { colors, formatCurrency, printDisclaimer, printPriceWarning } from '../utils/formatter.js';
import { enrichModelsWithBenchmarks, calculateCost } from '../core/calculator.js';
import { getBestBenchmark } from '../benchmarks.js';

const EXCLUDED_PATTERNS = [
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',
  '.env.*',
  '.gitignore',
  '.DS_Store',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'credentials.json',
  'secrets.json',
  '.npmrc',
  '.dockerconfig',
  '*.pem',
  '*.key',
  '*.crt',
  '*.cer',
  '*.p12',
  '*.pfx',
  '.log',
  '.sql',
  '.db',
  '.sqlite',
  '.mdb',
  '.accdb',
];

const SECRET_KEYWORDS = [
  'private',
  'secret',
  'token',
  'apikey',
  'api_key',
  'password',
  'credential',
  'auth',
  '.github_token',
];

const EXCLUDED_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.nuxt',
  'coverage',
  '.cache',
  'vendor',
  '.venv',
  'venv',
  '__pycache__',
  '.svn',
  'CVS',
  '.hg',
];

const CODE_EXTENSIONS = [
  '.js', '.ts', '.jsx', '.tsx', '.vue', '.svelte',
  '.py', '.rb', '.go', '.rs', '.java', '.cpp', '.c',
  '.php', '.swift', '.kt', '.scala',
  '.html', '.css', '.scss', '.sass', '.less',
  '.json', '.yaml', '.yml', '.toml', '.md',
];

const CODE_EXTENSIONS_WITH_CONTENT = [
  '.js', '.ts', '.jsx', '.tsx', '.vue', '.svelte',
  '.py', '.rb', '.go', '.rs', '.java', '.cpp', '.c',
  '.php', '.swift', '.kt', '.scala',
  '.html', '.css', '.scss', '.sass', '.less',
];

export interface FileTokenCount {
  file: string;
  tokens: number;
  chars: number;
  language: string;
}

export interface ScanResult {
  totalFiles: number;
  codeFiles: number;
  totalChars: number;
  codeChars: number;
  totalTokens: number;
  languages: Record<string, number>;
  excludedFiles: number;
  files: FileTokenCount[];
}

export interface AnalysisType {
  type: 'debug' | 'bug_fix' | 'refactor' | 'new_feature' | 'review' | 'unknown';
  description: string;
  inputMultiplier: number;
  outputMultiplier: number;
  suggestedComplexity: 'simple' | 'medium' | 'complex';
}

const ANALYSIS_TYPES: Record<string, AnalysisType> = {
  'debug': {
    type: 'debug',
    description: 'Debugging existing code',
    inputMultiplier: 1.5,
    outputMultiplier: 0.5,
    suggestedComplexity: 'complex'
  },
  'bug': {
    type: 'bug_fix',
    description: 'Fixing bugs',
    inputMultiplier: 1.3,
    outputMultiplier: 0.4,
    suggestedComplexity: 'medium'
  },
  'fix': {
    type: 'bug_fix',
    description: 'Fixing bugs',
    inputMultiplier: 1.3,
    outputMultiplier: 0.4,
    suggestedComplexity: 'medium'
  },
  'refactor': {
    type: 'refactor',
    description: 'Refactoring code',
    inputMultiplier: 1.2,
    outputMultiplier: 0.8,
    suggestedComplexity: 'medium'
  },
  'review': {
    type: 'review',
    description: 'Code review',
    inputMultiplier: 1.0,
    outputMultiplier: 0.3,
    suggestedComplexity: 'simple'
  },
  'new': {
    type: 'new_feature',
    description: 'New feature development',
    inputMultiplier: 1.0,
    outputMultiplier: 1.0,
    suggestedComplexity: 'medium'
  },
  'add': {
    type: 'new_feature',
    description: 'Adding new feature',
    inputMultiplier: 1.0,
    outputMultiplier: 1.0,
    suggestedComplexity: 'medium'
  },
};

function isExcludedByPattern(filename: string): boolean {
  const lower = filename.toLowerCase();
  
  for (const pattern of EXCLUDED_PATTERNS) {
    if (pattern.includes('*')) {
      const base = pattern.replace('*', '');
      if (lower.includes(base)) return true;
    } else if (lower === pattern.toLowerCase()) {
      return true;
    }
  }
  
  for (const keyword of SECRET_KEYWORDS) {
    if (lower.includes(keyword.toLowerCase())) return true;
  }
  
  return false;
}

function canReadContent(filename: string): boolean {
  const ext = extname(filename).toLowerCase();
  return CODE_EXTENSIONS_WITH_CONTENT.includes(ext);
}

function getLanguage(ext: string): string {
  const map: Record<string, string> = {
    '.js': 'JavaScript',
    '.ts': 'TypeScript',
    '.jsx': 'React',
    '.tsx': 'React',
    '.vue': 'Vue',
    '.svelte': 'Svelte',
    '.py': 'Python',
    '.rb': 'Ruby',
    '.go': 'Go',
    '.rs': 'Rust',
    '.java': 'Java',
    '.cpp': 'C++',
    '.c': 'C',
    '.php': 'PHP',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.scala': 'Scala',
    '.sql': 'SQL',
    '.html': 'HTML',
    '.css': 'CSS',
    '.scss': 'SCSS',
    '.sass': 'Sass',
    '.less': 'Less',
    '.json': 'JSON',
    '.yaml': 'YAML',
    '.yml': 'YAML',
    '.toml': 'TOML',
    '.md': 'Markdown',
  };
  return map[ext] || 'Other';
}

function detectAnalysisType(args: string[]): AnalysisType {
  const combined = args.join(' ').toLowerCase();
  
  for (const [key, analysis] of Object.entries(ANALYSIS_TYPES)) {
    if (combined.includes(key)) {
      return analysis;
    }
  }
  
  return {
    type: 'unknown',
    description: 'General analysis',
    inputMultiplier: 1.0,
    outputMultiplier: 1.0,
    suggestedComplexity: 'medium'
  };
}

function getComplexityFromTokens(tokens: number): 'simple' | 'medium' | 'complex' {
  if (tokens < 30000) return 'simple';
  if (tokens < 100000) return 'medium';
  return 'complex';
}

export async function scanDirectory(path: string): Promise<ScanResult> {
  const result: ScanResult = {
    totalFiles: 0,
    codeFiles: 0,
    totalChars: 0,
    codeChars: 0,
    totalTokens: 0,
    languages: {},
    excludedFiles: 0,
    files: [],
  };

  await walkDirectory(path, result);

  result.files.sort((a, b) => b.tokens - a.tokens);

  return result;
}

async function walkDirectory(dir: string, result: ScanResult): Promise<void> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (EXCLUDED_DIRS.includes(entry.name)) {
        result.excludedFiles++;
        continue;
      }
      
      if (entry.name.startsWith('.') && !canReadContent(entry.name)) {
        result.excludedFiles++;
        continue;
      }

      if (isExcludedByPattern(entry.name)) {
        result.excludedFiles++;
        continue;
      }

      if (entry.isDirectory()) {
        await walkDirectory(fullPath, result);
      } else if (entry.isFile()) {
        result.totalFiles++;

        const ext = extname(entry.name).toLowerCase();

        if (CODE_EXTENSIONS.includes(ext)) {
          result.codeFiles++;
          const lang = getLanguage(ext);
          result.languages[lang] = (result.languages[lang] || 0) + 1;

          try {
            let fileChars = 0;
            let fileTokens = 0;
            
            if (canReadContent(entry.name)) {
              const content = await readFile(fullPath, 'utf-8');
              fileChars = content.length;
              fileTokens = countStringTokens(content);
            } else {
              const fileStat = await stat(fullPath);
              fileChars = Math.floor(fileStat.size * 0.75);
              fileTokens = charsToTokens(fileChars);
            }

            result.codeChars += fileChars;
            result.totalTokens += fileTokens;
            
            const relativePath = fullPath.replace(/\\/g, '/');
            result.files.push({
              file: relativePath,
              tokens: fileTokens,
              chars: fileChars,
              language: lang,
            });
          } catch (e) {
            result.excludedFiles++;
          }
        }
      }
    }
  } catch (e) {
    // Skip directories that can't be read
  }
}

export async function scanCommand(path?: string, args: string[] = []): Promise<void> {
  const targetPath = path || '.';
  const analysisType = detectAnalysisType(args);
  
  console.log(colors.primary(`\nScanning ${targetPath}...\n`));

  const result = await scanDirectory(targetPath);

  console.log(colors.bold('File Token Breakdown:'));
  console.log(colors.dim('-'.repeat(70)));
  console.log(colors.bold('File'.padEnd(45) + 'Language'.padEnd(12) + 'Tokens'));
  console.log(colors.dim('-'.repeat(70)));
  
  const topFiles = result.files.slice(0, 15);
  for (const file of topFiles) {
    const fileName = file.file.length > 42 ? '...' + file.file.slice(-42) : file.file;
    console.log(`${fileName.padEnd(45)} ${file.language.padEnd(12)} ${colors.cyan(file.tokens.toLocaleString())}`);
  }
  
  if (result.files.length > 15) {
    console.log(colors.dim(`  ... and ${result.files.length - 15} more files`));
  }
  console.log('');

  console.log(colors.bold('Summary Statistics:'));
  console.log(colors.dim('-'.repeat(50)));
  console.log(`   Total files:       ${colors.cyan(result.totalFiles.toString())}`);
  console.log(`   Code files:        ${colors.cyan(result.codeFiles.toString())}`);
  console.log(`   Excluded files:    ${colors.dim(result.excludedFiles.toString())}`);
  console.log(`   Total characters:  ${colors.cyan(result.codeChars.toLocaleString())}`);
  console.log(`   Total tokens:      ${colors.green(result.totalTokens.toLocaleString())}`);

  console.log('\n' + colors.bold('Languages:'));
  console.log(colors.dim('-'.repeat(30)));
  Object.entries(result.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .forEach(([lang, count]) => {
      const bar = '#'.repeat(Math.min(count, 20));
      console.log(`   ${lang.padEnd(12)} ${count.toString().padStart(4)} ${colors.dim(bar)}`);
    });
  console.log('');

  const baseInputTokens = result.totalTokens;
  const baseOutputTokens = Math.floor(result.totalTokens * 0.6);
  
  const inputTokens = Math.floor(baseInputTokens * analysisType.inputMultiplier);
  const outputTokens = Math.floor(baseOutputTokens * analysisType.outputMultiplier);

  console.log(colors.bold(`Analysis Type: ${colors.yellow(analysisType.type.toUpperCase())}`));
  console.log(`   ${analysisType.description}`);
  console.log('');

  console.log(colors.bold('Token Estimates:'));
  console.log(colors.dim('-'.repeat(50)));
  console.log(`   Base input tokens:    ${colors.cyan(baseInputTokens.toLocaleString())}`);
  console.log(`   Base output tokens:  ${colors.cyan(baseOutputTokens.toLocaleString())}`);
  console.log(`   Adjusted input:      ${colors.yellow(`x${analysisType.inputMultiplier}`)} = ${colors.cyan(inputTokens.toLocaleString())}`);
  console.log(`   Adjusted output:     ${colors.yellow(`x${analysisType.outputMultiplier}`)} = ${colors.cyan(outputTokens.toLocaleString())}`);
  console.log(`   ${colors.bold('Total tokens:').padEnd(22)} ${colors.green((inputTokens + outputTokens).toLocaleString())}`);
  console.log('');

  const complexity = getComplexityFromTokens(inputTokens + outputTokens);
  
  console.log(colors.bold('Complexity Level:'));
  console.log(colors.dim('-'.repeat(30)));
  const complexityColor = complexity === 'complex' ? colors.red : 
                         complexity === 'medium' ? colors.yellow : colors.green;
  console.log(`   ${complexityColor(complexity.toUpperCase())}`);
  console.log('');

  console.log(colors.bold('Model Recommendations:'));
  console.log(colors.dim('-'.repeat(70)));
  
  const models = await getPrices();
  const modelsWithQuality = models.map(m => ({
    ...m,
    evalScore: m.evalScore || getBestBenchmark(m.name),
  }));

  const modelsWithCosts = modelsWithQuality.map(model => {
    const inputCost = (inputTokens / 1000000) * model.price_per_1k_input;
    const outputCost = (outputTokens / 1000000) * model.price_per_1k_output;
    const totalCost = inputCost + outputCost;
    const benchmarkScore = model.benchmarkScore || model.evalScore || 50;
    
    let adjustedBenchmark = benchmarkScore;
    if (complexity === 'complex' && benchmarkScore < 70) {
      adjustedBenchmark = benchmarkScore * 0.85;
    } else if (complexity === 'simple' && benchmarkScore > 80) {
      adjustedBenchmark = benchmarkScore * 0.8;
    }
    
    const qpScore = (adjustedBenchmark / 100) * 0.7 + (Math.max(0, 1 - totalCost) * 0.3);
    
    return {
      model,
      inputCost,
      outputCost,
      totalCost,
      benchmarkScore: adjustedBenchmark,
      qpScore,
    };
  });

  modelsWithCosts.sort((a, b) => b.qpScore - a.qpScore);

  const topByQuality = modelsWithCosts.slice(0, 3);
  const cheapModels = [...modelsWithCosts].sort((a, b) => a.totalCost - b.totalCost).slice(0, 3);

  console.log(colors.bold('   Best Quality-Price:'));
  for (const rec of topByQuality) {
    const label = rec === topByQuality[0] ? '  [BEST]  ' : '  [TOP 3] ';
    console.log(
      `   ${colors.green(label)} ${rec.model.name.substring(0, 28).padEnd(30)} ` +
      `${colors.cyan(rec.benchmarkScore.toFixed(1) + '%').padEnd(8)} ` +
      `${formatCurrency(rec.totalCost)}`
    );
  }
  console.log('');

  console.log(colors.bold('   Cheapest Options:'));
  for (const rec of cheapModels) {
    console.log(
      `   ${colors.dim('  [CHEAP]')} ${rec.model.name.substring(0, 28).padEnd(30)} ` +
      `${colors.dim(rec.benchmarkScore.toFixed(1) + '%').padEnd(8)} ` +
      `${colors.green(formatCurrency(rec.totalCost))}`
    );
  }
  console.log('');

  console.log(colors.bold('Suggestions by Complexity:'));
  console.log(colors.dim('-'.repeat(50)));
  
  if (complexity === 'complex') {
    console.log(colors.yellow('   For complex debugging/refactoring:'));
    console.log('   * Use models with high benchmark scores (DeepSeek R1, Claude Opus)');
    console.log('   * Consider reasoning models for better analysis');
    console.log('   * Budget extra tokens for iterative fixes');
  } else if (complexity === 'medium') {
    console.log(colors.cyan('   For medium complexity tasks:'));
    console.log('   * Balance between quality and cost (GPT-4.5, Claude Sonnet)');
    console.log('   * Good for feature additions and moderate refactoring');
  } else {
    console.log(colors.green('   For simple tasks:'));
    console.log('   * Use fast/cheap models (Gemini Flash, GPT-4o-mini)');
    console.log('   * Great for code reviews and quick fixes');
  }
  console.log('');

  printPriceWarning();
  printDisclaimer();
}
