import { colors, formatCurrency, printDisclaimer, printPriceWarning } from '../utils/formatter.js';
import { getPrices, compareModels, getRecommendedModel, calculateCost, enrichModelsWithBenchmarks, getRecommendedModelsByTokens, getModelRecommendationsForTask, getBenchmarkForModel } from '../core/calculator.js';
import { getProjects, getProjectTokens, getProjectComplexity, ProjectType, detectTasks } from '../contracts.js';
import { getBenchmarkScore, getBestBenchmark } from '../benchmarks.js';
import { getComplexityForTask, getRecommendedModelsForComplexity } from '../category-recommendations.js';

interface DetectedTask {
  id: ProjectType;
  name: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  complexity: string;
  score: number;
}

interface CombinedEstimate {
  tasks: DetectedTask[];
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
}

const TASK_NAMES: Record<string, string> = {
  rest_api: 'REST API',
  graphql_api: 'GraphQL API',
  microservicios: 'Microservices',
  docker_container: 'Docker Container',
  kubernetes_deploy: 'Kubernetes',
  docker_compose: 'Docker Compose',
  nextjs_app: 'Next.js App',
  react_dashboard: 'React Dashboard',
  vue_nuxt: 'Vue/Nuxt',
  landing_page: 'Landing Page',
  shadcn_ui: 'Shadcn UI',
  framer_motion: 'Framer Motion',
  seo_optimization: 'SEO',
  ui_components: 'UI Components',
  langchain_agent: 'LangChain Agent',
  multi_agent: 'Multi Agent',
  tool_calling: 'Tool Calling',
  rag_system: 'RAG System',
  vector_database: 'Vector DB',
  document_pipeline: 'Doc Pipeline',
  serverless_lambda: 'Serverless Lambda',
  terraform_iac: 'Terraform IaC',
  event_driven: 'Event Driven',
  sqs_kafka: 'SQS/Kafka',
  postgresql_prisma: 'PostgreSQL/Prisma',
  mongodb_aggregation: 'MongoDB',
  redis_cache: 'Redis Cache',
  database_schema: 'Database Schema',
  nextauth: 'NextAuth',
  oauth_openid: 'OAuth/OpenID',
  rbac_permissions: 'RBAC',
  jwt_sessions: 'JWT/Sessions',
  cli_tool: 'CLI Tool',
  github_actions: 'GitHub Actions',
  project_generator: 'Project Generator',
  stripe_payment: 'Stripe Payment',
  product_catalog: 'Product Catalog',
  shopping_cart: 'Shopping Cart',
  checkout_flow: 'Checkout Flow',
  admin_panel: 'Admin Panel',
  user_management: 'User Management',
  analytics_dashboard: 'Analytics',
  reporting_engine: 'Reporting',
  react_native: 'React Native',
  flutter_app: 'Flutter App',
  native_bridge: 'Native Bridge',
  playwright_e2e: 'Playwright E2E',
  vitest_unit: 'Vitest Unit',
  integration_tests: 'Integration Tests',
  swagger_openapi: 'Swagger/OpenAPI',
  technical_wiki: 'Technical Wiki',
  readme_generator: 'README Generator',
  refactoring: 'Refactoring',
  migration_script: 'Migration',
  type_safety: 'Type Safety',
  saas: 'SaaS',
  ecommerce: 'E-commerce',
  crm: 'CRM',
  ai_agent: 'AI Agent',
  dashboard: 'Dashboard',
  auth: 'Authentication',
  landing: 'Landing Page',
  formulario: 'Form',
  
  // Cloud Integrations
  supabase_integration: 'Supabase Integration',
  firebase_integration: 'Firebase Integration',
  vercel_deployment: 'Vercel Deployment',
  netlify_deployment: 'Netlify Deployment',
  
  // Database Operations
  postgresql_setup: 'PostgreSQL Setup',
  mongodb_setup: 'MongoDB Setup',
  mysql_setup: 'MySQL Setup',
  dynamodb_setup: 'DynamoDB Setup',
  supabase_database: 'Supabase Database',
  firebase_firestore: 'Firebase Firestore',
  
  // Serverless & Edge
  vercel_edge_functions: 'Vercel Edge Functions',
  netlify_functions: 'Netlify Functions',
  railway_deployment: 'Railway Deployment',
  render_deployment: 'Render Deployment',
  flyio_deployment: 'Fly.io Deployment',
  aws_lambda: 'AWS Lambda',
  cloudflare_workers: 'Cloudflare Workers',
  
  // Infrastructure & Security
  env_variables: 'Environment Variables',
  secrets_management: 'Secrets Management',
  domain_config: 'Domain Configuration',
  ssl_tls_setup: 'SSL/TLS Setup',
};

export async function planCommand(description?: string): Promise<void> {
  const allTasks = getProjects();
  
  if (!description) {
    console.log(colors.error('Please provide a project or task description'));
    console.log('\nUsage: vibe-budget plan "<description>"');
    console.log('\nExamples:');
    console.log('  vibe-budget plan "docker container"');
    console.log('  vibe-budget plan "rest api with graphql"');
    console.log('  vibe-budget plan "langchain agent with rag"');
    console.log('  vibe-budget plan "nextjs app with shadcn"');
    console.log(`\nTotal tasks available: ${allTasks.length}`);
    return;
  }

  console.log(colors.primary(`\nProject: ${description}\n`));

  const detectedTasks = detectTasksInDescription(description);
  
  if (detectedTasks.length === 0) {
    console.log(colors.warning('No specific tasks detected. Using default: saas'));
    detectedTasks.push({
      id: 'saas',
      name: 'SaaS',
      inputTokens: 48000,
      outputTokens: 90000,
      totalTokens: 138000,
      complexity: 'high',
      score: 0.5,
    });
  }

  console.log(colors.bold(`Detected Tasks (${detectedTasks.length}):`));
  console.log(colors.dim('-'.repeat(60)));
  
  detectedTasks.forEach((task, index) => {
    const complexityColor = getComplexityColor(task.complexity);
    console.log(`  ${index + 1}. ${colors.bold(task.name.padEnd(20))} ${complexityColor(task.complexity.padEnd(11))} ${colors.dim(`${(task.totalTokens / 1000).toFixed(0)}k tokens`)}`);
  });
  console.log('');

  console.log(colors.bold('Combined Token Estimate:'));
  console.log(colors.dim('-'.repeat(60)));
  const totalInput = detectedTasks.reduce((sum, t) => sum + t.inputTokens, 0);
  const totalOutput = detectedTasks.reduce((sum, t) => sum + t.outputTokens, 0);
  const totalTokens = totalInput + totalOutput;
  console.log(`   Input:  ${colors.cyan(totalInput.toLocaleString())} tokens`);
  console.log(`   Output:  ${colors.cyan(totalOutput.toLocaleString())} tokens`);
  console.log(`   Total:  ${colors.green(totalTokens.toLocaleString())} tokens`);
  console.log('');

  console.log(colors.bold('Fetching model prices...'));
  const models = await getPrices();
  
  const modelsWithQuality = models.map(m => ({
    ...m,
    evalScore: m.evalScore || getBestBenchmark(m.name),
  }));
  
  console.log(colors.secondary(`Loaded ${models.length} models\n`));

  console.log(colors.bold('Token Cost Breakdown (OpenRouter Pricing):'));
  console.log(colors.dim('-'.repeat(60)));
  
  const avgInputPrice = modelsWithQuality.reduce((sum, m) => sum + m.price_per_1k_input, 0) / modelsWithQuality.length;
  const avgOutputPrice = modelsWithQuality.reduce((sum, m) => sum + m.price_per_1k_output, 0) / modelsWithQuality.length;
  
  for (const task of detectedTasks) {
    const taskInputCost = (task.inputTokens / 1000000) * avgInputPrice;
    const taskOutputCost = (task.outputTokens / 1000000) * avgOutputPrice;
    const taskTotal = taskInputCost + taskOutputCost;
    console.log(`   ${task.name.padEnd(20)} ${task.inputTokens.toLocaleString().padStart(8)} in + ${task.outputTokens.toLocaleString().padStart(8)} out = ${formatCurrency(taskTotal)}`);
  }
  console.log(colors.dim(`   (avg: $${avgInputPrice.toFixed(2)}/M in, $${avgOutputPrice.toFixed(2)}/M out)`));
  console.log('');

  const comparisons = compareModels(modelsWithQuality, totalInput, totalOutput);
  const bestQP = getBestQPModel(comparisons);

  console.log(colors.bold('Best Quality-Price Recommendation:'));
  console.log(colors.dim('-'.repeat(60)));
  if (bestQP) {
    const cost = calculateCost(bestQP, totalInput, totalOutput);
    const evalScore = bestQP.evalScore || 0;
    const qpScore = calculateQPscore(evalScore, cost.totalCost);
    console.log(`   Model:   ${colors.green(bestQP.name)}`);
    console.log(`   Provider: ${bestQP.provider}`);
    console.log(`   Quality: ${colors.cyan(evalScore.toFixed(1) + '%')}`);
    console.log(`   Cost:    ${formatCurrency(cost.totalCost)}`);
    console.log(`   QP Score: ${colors.yellow((qpScore * 100).toFixed(0) + '/100')}`);
  }
  console.log('');

  console.log(colors.bold('Model Recommendations by Task (Quality-Price based on Tokens):'));
  console.log(colors.dim('-'.repeat(95)));
  
  const taskRecommendations: { task: DetectedTask; recommendations: any[] }[] = [];
  
  for (const task of detectedTasks) {
    const recommendations = getModelRecommendationsForTask(
      modelsWithQuality,
      task.id,
      task.inputTokens,
      task.outputTokens,
      task.complexity
    );
    taskRecommendations.push({ task, recommendations });
  }
  
  if (taskRecommendations.length > 0) {
    console.log(colors.bold('Task'.padEnd(20) + 'Tokens'.padEnd(10) + 'Recommendation'.padEnd(45) + 'Cost'));
    console.log(colors.dim('-'.repeat(95)));
    
    let totalEstimated = 0;
    
    for (const { task, recommendations } of taskRecommendations) {
      const bestRec = recommendations[0];
      if (bestRec) {
        totalEstimated += bestRec.cost.totalCost;
        const recLabel = `[${bestRec.recommendation.toUpperCase()}]`;
        const labelColor = bestRec.recommendation === 'best' ? colors.green : 
                          bestRec.recommendation === 'recommended' ? colors.yellow : colors.dim;
        console.log(
          `   ${task.name.padEnd(20)} ${task.totalTokens.toLocaleString().padEnd(10)} ` +
          `${bestRec.model.name.substring(0, 28).padEnd(30)} ` +
          `${labelColor(recLabel)} ` +
          `${colors.green(formatCurrency(bestRec.cost.totalCost)).padEnd(10)} ` +
          `(Q: ${bestRec.cost.benchmarkScore?.toFixed(0)}%)`
        );
      }
    }
    
    console.log(colors.dim('-'.repeat(95)));
    console.log(
      `   ${colors.bold('TOTAL'.padEnd(20))} ${totalTokens.toLocaleString().padEnd(10)} ` +
      `${colors.bold('Best QP').padEnd(30)} ${colors.green(colors.bold(formatCurrency(totalEstimated)))}`
    );
  }
  console.log('');

  const overallRecommendations = getRecommendedModelsByTokens(modelsWithQuality, totalInput, totalOutput);
  
  console.log(colors.bold('Overall Best Models by Complexity:'));
  console.log(colors.dim('-'.repeat(95)));
  
  const bestByCategory = {
    best: overallRecommendations.find(r => r.recommendation === 'best'),
    recommended: overallRecommendations.find(r => r.recommendation === 'recommended'),
    cheap: overallRecommendations.find(r => r.recommendation === 'cheap'),
  };
  
  if (bestByCategory.best) {
    console.log(
      `   ${colors.green('[BEST]')}:   ${bestByCategory.best.model.name.padEnd(25)} ` +
      `Quality: ${colors.cyan(bestByCategory.best.cost.benchmarkScore?.toFixed(1) + '%').padEnd(10)} ` +
      `Cost: ${colors.green(formatCurrency(bestByCategory.best.cost.totalCost))}`
    );
  }
  if (bestByCategory.recommended) {
    console.log(
      `   ${colors.yellow('[REC]')}:    ${bestByCategory.recommended.model.name.padEnd(25)} ` +
      `Quality: ${colors.cyan(bestByCategory.recommended.cost.benchmarkScore?.toFixed(1) + '%').padEnd(10)} ` +
      `Cost: ${colors.green(formatCurrency(bestByCategory.recommended.cost.totalCost))}`
    );
  }
  if (bestByCategory.cheap) {
    console.log(
      `   ${colors.dim('[CHEAP]')}:   ${bestByCategory.cheap.model.name.padEnd(25)} ` +
      `Quality: ${colors.cyan(bestByCategory.cheap.cost.benchmarkScore?.toFixed(1) + '%').padEnd(10)} ` +
      `Cost: ${colors.green(formatCurrency(bestByCategory.cheap.cost.totalCost))}`
    );
  }
  console.log('');

  console.log(colors.bold('Top 10 Cheapest Models:'));
  console.log(colors.dim('-'.repeat(85)));
  console.log(colors.bold('Model'.padEnd(28) + 'Provider'.padEnd(12) + 'Quality'.padEnd(10) + 'Cost'));
  console.log(colors.dim('-'.repeat(85)));

  comparisons.slice(0, 10).forEach((c) => {
    const modelInfo = modelsWithQuality.find(m => m.id === c.model || m.name === c.model);
    const isBestQP = bestQP && (bestQP.id === c.model || bestQP.name === c.model);
    const prefix = isBestQP ? '* ' : '  ';
    const modelName = (prefix + c.model).padEnd(30);
    const provider = c.provider.padEnd(12);
    const quality = modelInfo?.evalScore ? modelInfo.evalScore.toFixed(1).padEnd(10) : 'N/A'.padEnd(10);
    const totalCost = isBestQP ? colors.yellow(formatCurrency(c.totalCost)) : formatCurrency(c.totalCost);
    
    console.log(`${modelName}${provider}${quality}${totalCost}`);
  });

  console.log(colors.dim(`\nShowing top 10 of ${comparisons.length} models`));
  
  printPriceWarning();
  printDisclaimer();
}

function detectTasksInDescription(description: string): DetectedTask[] {
  const detected = detectTasks(description);
  
  if (detected.length === 0) {
    return [];
  }

  return detected.map(d => {
    const tokens = getProjectTokens(d.task);
    return {
      id: d.task,
      name: TASK_NAMES[d.task] || d.task,
      inputTokens: tokens.input,
      outputTokens: tokens.output,
      totalTokens: tokens.input + tokens.output,
      complexity: getProjectComplexity(d.task),
      score: d.score,
    };
  });
}

function calculateQPscore(evalScore: number, totalCost: number): number {
  const maxEval = 100;
  const normalizedEval = evalScore / maxEval;
  const normalizedCost = Math.log10(totalCost + 0.01) / Math.log10(100);
  return (normalizedEval * 0.7) + ((1 - normalizedCost) * 0.3);
}

function getBestQPModel(models: any[]) {
  const modelsWithQP = models
    .filter(m => m.evalScore)
    .map(m => ({
      ...m,
      qpScore: calculateQPscore(m.evalScore, m.totalCost),
    }))
    .sort((a, b) => (b.qpScore || 0) - (a.qpScore || 0));
  
  return modelsWithQP[0] || null;
}

function getComplexityColor(complexity: string): (text: string) => string {
  switch (complexity) {
    case 'very_high': return colors.red;
    case 'high': return colors.orange;
    case 'medium': return colors.yellow;
    case 'low': return colors.green;
    default: return colors.dim;
  }
}
