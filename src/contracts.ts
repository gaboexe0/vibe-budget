export const PROJECT_TOKENS = {
  // Proyectos originales
  ecommerce: { input: 45000, output: 85000 },
  landing: { input: 12000, output: 25000 },
  formulario: { input: 8000, output: 15000 },
  crm: { input: 55000, output: 95000 },
  ai_agent: { input: 35000, output: 70000 },
  dashboard: { input: 55000, output: 95000 },
  saas: { input: 48000, output: 90000 },
  auth: { input: 25000, output: 45000 },

  // 13 Frentes con tareas específicas
  // Frente 1: Infraestructura Backend y APIs
  rest_api: { input: 25000, output: 50000 },
  graphql_api: { input: 30000, output: 60000 },
  microservicios: { input: 50000, output: 90000 },
  docker_container: { input: 18000, output: 35000 },
  kubernetes_deploy: { input: 40000, output: 75000 },
  docker_compose: { input: 20000, output: 40000 },

  // Frente 2: Frontend y UI/UX
  nextjs_app: { input: 40000, output: 80000 },
  react_dashboard: { input: 35000, output: 70000 },
  vue_nuxt: { input: 35000, output: 70000 },
  landing_page: { input: 12000, output: 25000 },
  shadcn_ui: { input: 15000, output: 30000 },
  framer_motion: { input: 10000, output: 20000 },
  seo_optimization: { input: 8000, output: 15000 },
  ui_components: { input: 20000, output: 40000 },

  // Frente 3: IA Aplicada
  langchain_agent: { input: 35000, output: 70000 },
  multi_agent: { input: 45000, output: 85000 },
  tool_calling: { input: 25000, output: 50000 },
  rag_system: { input: 45000, output: 85000 },
  vector_database: { input: 30000, output: 60000 },
  document_pipeline: { input: 25000, output: 50000 },

  // Frente 4: Cloud y Microservicios
  serverless_lambda: { input: 28000, output: 55000 },
  terraform_iac: { input: 40000, output: 75000 },
  event_driven: { input: 35000, output: 68000 },
  sqs_kafka: { input: 25000, output: 50000 },

  // Frente 5: Bases de Datos
  postgresql_prisma: { input: 25000, output: 50000 },
  mongodb_aggregation: { input: 25000, output: 50000 },
  redis_cache: { input: 15000, output: 30000 },
  database_schema: { input: 20000, output: 40000 },

  // Frente 6: Seguridad y Auth
  nextauth: { input: 25000, output: 50000 },
  oauth_openid: { input: 20000, output: 40000 },
  rbac_permissions: { input: 18000, output: 35000 },
  jwt_sessions: { input: 15000, output: 30000 },

  // Frente 7: DevTools
  cli_tool: { input: 20000, output: 40000 },
  github_actions: { input: 15000, output: 30000 },
  project_generator: { input: 25000, output: 50000 },

  // Frente 8: E-commerce
  stripe_payment: { input: 30000, output: 60000 },
  product_catalog: { input: 25000, output: 50000 },
  shopping_cart: { input: 20000, output: 40000 },
  checkout_flow: { input: 25000, output: 50000 },

  // Frente 9: SaaS/CRM/ERP
  admin_panel: { input: 30000, output: 60000 },
  user_management: { input: 25000, output: 50000 },
  analytics_dashboard: { input: 35000, output: 70000 },
  reporting_engine: { input: 30000, output: 60000 },

  // Frente 10: Mobile
  react_native: { input: 40000, output: 80000 },
  flutter_app: { input: 40000, output: 80000 },
  native_bridge: { input: 30000, output: 60000 },

  // Frente 11: QA y Testing
  playwright_e2e: { input: 25000, output: 50000 },
  vitest_unit: { input: 20000, output: 40000 },
  integration_tests: { input: 20000, output: 40000 },

  // Frente 12: Documentación
  swagger_openapi: { input: 15000, output: 30000 },
  technical_wiki: { input: 18000, output: 35000 },
  readme_generator: { input: 10000, output: 20000 },

  // Frente 13: Mantenimiento
  refactoring: { input: 25000, output: 50000 },
  migration_script: { input: 20000, output: 40000 },
  type_safety: { input: 18000, output: 35000 },

  // Frente 14: Cloud Integrations (nuevo)
  supabase_integration: { input: 22000, output: 45000 },
  firebase_integration: { input: 25000, output: 50000 },
  vercel_deployment: { input: 8000, output: 15000 },
  netlify_deployment: { input: 7000, output: 14000 },
  
  // Frente 15: Database Operations
  postgresql_setup: { input: 18000, output: 35000 },
  mongodb_setup: { input: 16000, output: 32000 },
  mysql_setup: { input: 17000, output: 34000 },
  dynamodb_setup: { input: 22000, output: 44000 },
  supabase_database: { input: 20000, output: 42000 },
  firebase_firestore: { input: 18000, output: 38000 },
  
  // Frente 16: Serverless & Edge
  vercel_edge_functions: { input: 15000, output: 30000 },
  netlify_functions: { input: 14000, output: 28000 },
  railway_deployment: { input: 10000, output: 20000 },
  render_deployment: { input: 9000, output: 18000 },
  flyio_deployment: { input: 12000, output: 24000 },
  aws_lambda: { input: 18000, output: 36000 },
  cloudflare_workers: { input: 16000, output: 32000 },
  
  // Frente 17: Infrastructure & Security
  env_variables: { input: 5000, output: 10000 },
  secrets_management: { input: 8000, output: 16000 },
  domain_config: { input: 6000, output: 12000 },
  ssl_tls_setup: { input: 7000, output: 14000 },
} as const;

export type ProjectType = keyof typeof PROJECT_TOKENS;

export const PROJECT_COMPLEXITY = {
  // Proyectos originales
  ecommerce: 'high',
  landing: 'medium',
  formulario: 'low',
  crm: 'high',
  ai_agent: 'high',
  dashboard: 'high',
  saas: 'high',
  auth: 'medium',

  // Frente 1: Infraestructura Backend y APIs
  rest_api: 'high',
  graphql_api: 'high',
  microservicios: 'high',
  docker_container: 'medium',
  kubernetes_deploy: 'high',
  docker_compose: 'medium',

  // Frente 2: Frontend y UI/UX
  nextjs_app: 'high',
  react_dashboard: 'high',
  vue_nuxt: 'high',
  landing_page: 'medium',
  shadcn_ui: 'medium',
  framer_motion: 'medium',
  seo_optimization: 'low',
  ui_components: 'medium',

  // Frente 3: IA Aplicada
  langchain_agent: 'high',
  multi_agent: 'very_high',
  tool_calling: 'high',
  rag_system: 'very_high',
  vector_database: 'high',
  document_pipeline: 'high',

  // Frente 4: Cloud y Microservicios
  serverless_lambda: 'high',
  terraform_iac: 'high',
  event_driven: 'high',
  sqs_kafka: 'high',

  // Frente 5: Bases de Datos
  postgresql_prisma: 'high',
  mongodb_aggregation: 'high',
  redis_cache: 'medium',
  database_schema: 'medium',

  // Frente 6: Seguridad y Auth
  nextauth: 'high',
  oauth_openid: 'high',
  rbac_permissions: 'high',
  jwt_sessions: 'medium',

  // Frente 7: DevTools
  cli_tool: 'medium',
  github_actions: 'medium',
  project_generator: 'high',

  // Frente 8: E-commerce
  stripe_payment: 'high',
  product_catalog: 'high',
  shopping_cart: 'medium',
  checkout_flow: 'high',

  // Frente 9: SaaS/CRM/ERP
  admin_panel: 'high',
  user_management: 'high',
  analytics_dashboard: 'very_high',
  reporting_engine: 'high',

  // Frente 10: Mobile
  react_native: 'very_high',
  flutter_app: 'very_high',
  native_bridge: 'very_high',

  // Frente 11: QA y Testing
  playwright_e2e: 'high',
  vitest_unit: 'medium',
  integration_tests: 'high',

  // Frente 12: Documentación
  swagger_openapi: 'medium',
  technical_wiki: 'low',
  readme_generator: 'low',

  // Frente 13: Mantenimiento
  refactoring: 'high',
  migration_script: 'high',
  type_safety: 'medium',

  // Frente 14: Cloud Integrations
  supabase_integration: 'medium',
  firebase_integration: 'high',
  vercel_deployment: 'low',
  netlify_deployment: 'low',
  
  // Frente 15: Database Operations
  postgresql_setup: 'medium',
  mongodb_setup: 'medium',
  mysql_setup: 'medium',
  dynamodb_setup: 'high',
  supabase_database: 'medium',
  firebase_firestore: 'medium',
  
  // Frente 16: Serverless & Edge
  vercel_edge_functions: 'medium',
  netlify_functions: 'medium',
  railway_deployment: 'medium',
  render_deployment: 'low',
  flyio_deployment: 'medium',
  aws_lambda: 'high',
  cloudflare_workers: 'medium',
  
  // Frente 17: Infrastructure & Security
  env_variables: 'low',
  secrets_management: 'medium',
  domain_config: 'low',
  ssl_tls_setup: 'low',
} as const;

export type ComplexityLevel = 'low' | 'medium' | 'high' | 'very_high';

export const MODEL_DATA = {
  openai: {
    name: 'OpenAI',
    models: [
      { id: 'gpt-5.2', name: 'GPT-5.2', type: 'reasoning' },
      { id: 'gpt-5.2-thinking', name: 'GPT-5.2 Thinking', type: 'reasoning' },
      { id: 'gpt-5.1', name: 'GPT-5.1', type: 'standard' },
      { id: 'gpt-5-nano', name: 'GPT-5 Nano', type: 'standard' },
      { id: 'gpt-4o', name: 'GPT-4o', type: 'standard' },
      { id: 'gpt-4o-mini', name: 'GPT-4o-mini', type: 'standard' },
      { id: 'o3', name: 'o3', type: 'reasoning' },
      { id: 'o4-mini', name: 'o4-mini', type: 'reasoning' },
    ],
  },
  anthropic: {
    name: 'Anthropic',
    models: [
      { id: 'claude-opus-4.6', name: 'Claude Opus 4.6', type: 'standard' },
      { id: 'claude-opus-4.5', name: 'Claude Opus 4.5', type: 'standard' },
      { id: 'claude-opus-4.1', name: 'Claude Opus 4.1', type: 'standard' },
      { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5', type: 'standard' },
      { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', type: 'standard' },
      { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', type: 'standard' },
      { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', type: 'standard' },
      { id: 'claude-3.5-haiku', name: 'Claude 3.5 Haiku', type: 'standard' },
      { id: 'claude-3-opus', name: 'Claude 3 Opus', type: 'standard' },
      { id: 'claude-haiku-4.5', name: 'Claude Haiku 4.5', type: 'standard' },
      { id: 'claude-haiku-3.5', name: 'Claude Haiku 3.5', type: 'standard' },
      { id: 'claude-haiku-3', name: 'Claude Haiku 3', type: 'standard' },
    ],
  },
  google: {
    name: 'Google',
    models: [
      { id: 'gemini-3-pro', name: 'Gemini 3 Pro', type: 'standard' },
      { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview', type: 'reasoning' },
      { id: 'gemini-3-deep-think', name: 'Gemini 3 Deep Think', type: 'reasoning' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', type: 'standard' },
      { id: 'gemini-2.5-ultra', name: 'Gemini 2.5 Ultra', type: 'reasoning' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', type: 'standard' },
      { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite', type: 'standard' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', type: 'standard' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', type: 'standard' },
      { id: 'gemini-1.0-ultra', name: 'Gemini 1.0 Ultra', type: 'standard' },
      { id: 'gemini-diffusion', name: 'Gemini Diffusion', type: 'standard' },
    ],
  },
  xai: {
    name: 'xAI',
    models: [
      { id: 'grok-4.1-fast-reasoning', name: 'Grok 4.1 Fast Reasoning', type: 'reasoning' },
      { id: 'grok-4.1-fast-non-reasoning', name: 'Grok 4.1 Fast Non-Reasoning', type: 'standard' },
      { id: 'grok-4.1-fast', name: 'Grok 4.1 Fast', type: 'standard' },
      { id: 'grok-4', name: 'Grok 4', type: 'standard' },
      { id: 'grok-4-code', name: 'Grok 4 Code', type: 'standard' },
      { id: 'grok-3-beta', name: 'Grok 3 Beta', type: 'standard' },
      { id: 'grok-3-fast-beta', name: 'Grok 3 Fast Beta', type: 'standard' },
      { id: 'grok-3-mini-beta', name: 'Grok 3 Mini Beta', type: 'standard' },
      { id: 'grok-2', name: 'Grok 2', type: 'standard' },
    ],
  },
  deepseek: {
    name: 'DeepSeek',
    models: [
      { id: 'deepseek-v4', name: 'DeepSeek V4', type: 'standard' },
      { id: 'deepseek-v3.2-exp', name: 'DeepSeek V3.2 Exp', type: 'standard' },
      { id: 'deepseek-v3.2-speciale', name: 'DeepSeek V3.2 Speciale', type: 'reasoning' },
      { id: 'deepseek-v3.2', name: 'DeepSeek V3.2', type: 'standard' },
      { id: 'deepseek-v3.1', name: 'DeepSeek V3.1', type: 'standard' },
      { id: 'deepseek-v3', name: 'DeepSeek V3', type: 'standard' },
      { id: 'deepseek-r1', name: 'DeepSeek R1', type: 'reasoning' },
      { id: 'deepseek-r1-0528', name: 'DeepSeek R1-0528', type: 'reasoning' },
      { id: 'deepseek-coder-v2', name: 'DeepSeek Coder V2', type: 'standard' },
      { id: 'deepseek-coder-33b', name: 'DeepSeek Coder 33B', type: 'standard' },
      { id: 'deepseek-math', name: 'DeepSeek Math', type: 'reasoning' },
      { id: 'deepseek-prover', name: 'DeepSeek Prover', type: 'reasoning' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', type: 'reasoning' },
    ],
  },
  qwen: {
    name: 'Qwen',
    models: [
      { id: 'qwen3-coder-480b', name: 'Qwen3 Coder 480B', type: 'standard' },
      { id: 'qwen3-coder-next', name: 'Qwen3 Coder Next', type: 'standard' },
      { id: 'qwen3-235b-thinking', name: 'Qwen3 235B Thinking', type: 'reasoning' },
      { id: 'qwen3-80b-thinking', name: 'Qwen3 80B Thinking', type: 'reasoning' },
      { id: 'qwen3-max', name: 'Qwen3 Max', type: 'standard' },
      { id: 'qwen-2.5-coder-32b', name: 'Qwen 2.5 Coder 32B', type: 'standard' },
      { id: 'qwen-2.5-coder-14b', name: 'Qwen 2.5 Coder 14B', type: 'standard' },
      { id: 'qwen-2.5-coder-7b', name: 'Qwen 2.5 Coder 7B', type: 'standard' },
      { id: 'qwen-2.5-coder-3b', name: 'Qwen 2.5 Coder 3B', type: 'standard' },
      { id: 'qwen-2.5-coder-1.5b', name: 'Qwen 2.5 Coder 1.5B', type: 'standard' },
      { id: 'qwen-2.5-72b', name: 'Qwen 2.5 72B', type: 'standard' },
      { id: 'qwen-2.5-7b', name: 'Qwen 2.5 7B', type: 'standard' },
      { id: 'qwen-max', name: 'Qwen Max', type: 'standard' },
      { id: 'qwen-plus', name: 'Qwen Plus', type: 'standard' },
      { id: 'qwen-turbo', name: 'Qwen Turbo', type: 'standard' },
      { id: 'qwen-flash', name: 'Qwen Flash', type: 'standard' },
      { id: 'qwq-32b', name: 'QWQ 32B', type: 'reasoning' },
    ],
  },
  zhipu: {
    name: 'Zhipu AI',
    models: [
      { id: 'glm-5', name: 'GLM-5', type: 'standard' },
      { id: 'glm-4.7', name: 'GLM-4.7', type: 'standard' },
      { id: 'glm-4.7-code', name: 'GLM-4.7 Code', type: 'standard' },
      { id: 'glm-4.6', name: 'GLM-4.6', type: 'standard' },
      { id: 'glm-4', name: 'GLM-4', type: 'standard' },
      { id: 'pony-alpha', name: 'Pony Alpha', type: 'standard' },
    ],
  },
  minimax: {
    name: 'MiniMax',
    models: [
      { id: 'minimax-m2.5', name: 'MiniMax M2.5', type: 'standard' },
      { id: 'minimax-m2.1', name: 'MiniMax M2.1', type: 'standard' },
      { id: 'minimax-text-01', name: 'MiniMax Text-01', type: 'standard' },
      { id: 'minimax-vl-01', name: 'MiniMax VL-01', type: 'standard' },
      { id: 'minimax-m2-her', name: 'MiniMax M2-her', type: 'standard' },
    ],
  },
  moonshot: {
    name: 'Moonshot AI',
    models: [
      { id: 'kimi-k2.5', name: 'Kimi K2.5', type: 'standard' },
    ],
  },
  yi: {
    name: '01.AI',
    models: [
      { id: 'yi-large', name: 'Yi-Large', type: 'standard' },
      { id: 'yi-medium', name: 'Yi-Medium', type: 'standard' },
      { id: 'yi-coder-9b', name: 'Yi-Coder-9B', type: 'standard' },
    ],
  },
} as const;

export type ProviderId = keyof typeof MODEL_DATA;

export interface ModelInfo {
  id: string;
  name: string;
  type: 'reasoning' | 'standard';
}

export function getProjectTokens(project: ProjectType): { input: number; output: number } {
  return PROJECT_TOKENS[project];
}

export function getProjects(): ProjectType[] {
  return Object.keys(PROJECT_TOKENS) as ProjectType[];
}

export function getProjectComplexity(project: ProjectType): ComplexityLevel {
  return PROJECT_COMPLEXITY[project];
}

export function getAllModels(): { provider: string; models: readonly ModelInfo[] }[] {
  return Object.entries(MODEL_DATA).map(([key, value]) => ({
    provider: value.name,
    models: value.models,
  }));
}

export function getModelInfo(modelId: string): ModelInfo | undefined {
  for (const provider of Object.values(MODEL_DATA)) {
    const model = provider.models.find(m => m.id === modelId);
    if (model) return model;
  }
  return undefined;
}

export function getTotalModelsCount(): number {
  return Object.values(MODEL_DATA).reduce((acc, provider) => acc + provider.models.length, 0);
}

export function getProviders(): { id: ProviderId; name: string; modelCount: number }[] {
  return Object.entries(MODEL_DATA).map(([key, value]) => ({
    id: key as ProviderId,
    name: value.name,
    modelCount: value.models.length,
  }));
}

function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

function fuzzyMatch(word: string, keyword: string, threshold: number = 0.85): boolean {
  const lowerWord = word.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  
  if (lowerWord === lowerKeyword) return true;
  
  const maxLen = Math.max(lowerWord.length, lowerKeyword.length);
  
  if (lowerKeyword.length <= 3) {
    if (lowerWord.includes(lowerKeyword) || lowerKeyword.includes(lowerWord)) return true;
    return false;
  }
  
  if (maxLen <= 5) return false;
  if (Math.abs(lowerWord.length - lowerKeyword.length) > 2) return false;
  
  const distance = levenshteinDistance(lowerWord, lowerKeyword);
  const similarity = 1 - distance / maxLen;
  
  return similarity >= threshold;
}

function checkKeywordMatch(description: string, keyword: string): boolean {
  const descLower = description.toLowerCase();
  const keywordLower = keyword.toLowerCase();
  
  if (descLower.includes(keywordLower)) return true;
  
  const words = descLower.split(/[\s,\-_\/]+/);
  
  for (const word of words) {
    if (word === keywordLower) return true;
    if (keywordLower.length >= 3 && word.length >= 3 && fuzzyMatch(word, keywordLower, 0.8)) return true;
  }
  
  if (keywordLower.length >= 3) {
    for (const word of words) {
      if (word.length >= 3 && fuzzyMatch(word, keywordLower, 0.7)) return true;
    }
  }
  
  return false;
}

export interface TaskKeyword {
  id: ProjectType;
  keywords: string[];
  weight: number;
  context?: string[];
}

export const TASK_KEYWORDS: TaskKeyword[] = [
  { id: 'rest_api', keywords: ['rest api', 'restful', 'express', 'fastapi', 'api rest', 'restfull', 'endpoint', 'http api', 'backend api', 'web api'], weight: 1.0 },
  { id: 'graphql_api', keywords: ['graphql', 'apollo', 'gql', 'graph ql', 'hasura'], weight: 1.0 },
  { id: 'microservicios', keywords: ['microservices', 'microservicios', 'nestjs', 'micro services', 'service mesh', 'grpc'], weight: 1.0 },
  { id: 'docker_container', keywords: ['docker', 'doker', 'container', 'dockerfile', 'docker container', 'dockerize', 'containerized', 'dockerized'], weight: 1.0 },
  { id: 'kubernetes_deploy', keywords: ['kubernetes', 'k8s', 'kubernet', 'kuternetes', 'kube', 'kubectl', 'helm', 'deploy kubernetes', 'kuber', 'eks', 'gke', 'aks', 'cluster kubernetes', 'k8s cluster', 'kubernetes cluster', 'container orchestration'], weight: 1.5, context: ['deploy', 'container', 'orchestration', 'cluster', 'pod', 'service', 'ingress', 'cluster'] },
  { id: 'docker_compose', keywords: ['docker compose', 'compose', 'docker-compose', 'multi container', 'docker compose yaml'], weight: 1.0 },

  { id: 'nextjs_app', keywords: ['nextjs', 'next.js', 'next js', 'app router', 'next app', 'nextjs app', 'ssr', 'isr', 'server side rendering', 'vercel', 'nextjs project'], weight: 1.0, context: ['react', 'framework', 'frontend', 'app', 'project', 'web', 'site'] },
  { id: 'react_dashboard', keywords: ['react dashboard', 'dashboard react', 'admin dashboard react', 'react admin', 'react admin panel'], weight: 1.0 },
  { id: 'vue_nuxt', keywords: ['vue', 'nuxt', 'vuejs', 'vue 3', 'nuxt.js', 'nuxt3', 'nuxtjs'], weight: 1.0 },
  { id: 'landing_page', keywords: ['landing page', 'landingpage', 'landing page website', 'one page website', 'sitio web landing'], weight: 1.0 },
  { id: 'shadcn_ui', keywords: ['shadcn', 'shadcn/ui', 'shadcn ui', 'shadcnui', 'radix ui', 'shadcn components', 'shadcn design'], weight: 1.0, context: ['react', 'components', 'ui', 'design system'] },
  { id: 'framer_motion', keywords: ['framer motion', 'framer-motion', 'framer library'], weight: 1.0, context: ['react', 'animation', 'frontend'] },
  { id: 'seo_optimization', keywords: ['seo', 'search engine optimization', 'meta tags', 'sitemap', 'robots.txt', 'optimizacion seo', 'seo optimize'], weight: 1.0 },
  { id: 'ui_components', keywords: [
    'user interface', 'ui design', 'ui components', 'component library', 'design system',
    'border radius', 'rounded corners', 'rounded',
    'padding', 'margins', 'spacing', 'grid layout', 'flexbox',
    'typography', 'font', 'text styles', 'heading', 'body text',
    'color palette', 'colors', 'theme', 'dark mode', 'light mode',
    'responsive', 'responsive design', 'mobile first', 'breakpoints',
    'button', 'input', 'form inputs', 'modal', 'dialog', 'dropdown',
    'card', 'cards', 'table', 'navbar', 'sidebar', 'footer',
    'tailwind', 'css', 'styled-components', 'css modules', 'sass', 'scss',
    'responsive layout', 'grid system', 'flex layout', 'interface design'
  ], weight: 0.6, context: ['design', 'frontend', 'visual', 'style'] },

  { id: 'langchain_agent', keywords: ['langchain', 'lang chain', 'lc', 'llamaindex', 'langgraph', 'lang chain agent'], weight: 1.0, context: ['ai', 'llm', 'agent', 'chain'] },
  { id: 'multi_agent', keywords: ['multi agent', 'multi-agent', 'multiagent', 'agentes multiples', 'crewai', 'autogen', 'multiple agents', 'agent team'], weight: 1.2, context: ['ai', 'agent', 'llm'] },
  { id: 'tool_calling', keywords: ['tool calling', 'function calling', 'tools', 'function calling api', 'openai tools', 'mcp tools'], weight: 1.0, context: ['ai', 'llm', 'agent'] },
  { id: 'rag_system', keywords: ['rag', 'retrieval augmented', 'rag system', 'rag pipeline', 'embeddings', 'chunking', 'vector search', 'rag retrieval'], weight: 1.0, context: ['ai', 'llm', 'database', 'embedding'] },
  { id: 'vector_database', keywords: ['vector database', 'pinecone', 'chroma', 'weaviate', 'qdrant', 'milvus', 'vector store', 'vector db', 'faiss'], weight: 1.0, context: ['ai', 'embedding', 'similarity'] },
  { id: 'document_pipeline', keywords: ['document pipeline', 'document processing', 'ingestion', 'pdf parsing', 'ocr', 'text extraction', 'document ai'], weight: 1.0, context: ['ai', 'pdf', 'document'] },

  { id: 'serverless_lambda', keywords: ['serverless', 'aws lambda', 'lambda function', 'azure functions', 'google cloud functions', 'serverless function', 'lambda'], weight: 1.0, context: ['cloud', 'function', 'aws', 'azure', 'gcp'] },
  { id: 'terraform_iac', keywords: ['terraform', 'iac', 'infrastructure as code', 'infraestructura', 'tf', 'terragrunt', 'provisioning', 'infra as code'], weight: 1.0, context: ['cloud', 'aws', 'azure', 'gcp', 'infrastructure'] },
  { id: 'event_driven', keywords: ['event driven', 'event-driven', 'eventos', 'event sourcing', 'cqrs', 'kafka events', 'event architecture'], weight: 1.0 },
  { id: 'sqs_kafka', keywords: ['sqs', 'kafka', 'message queue', 'cola de mensajes', 'rabbitmq', 'pubsub', 'event bus', 'messaging'], weight: 1.0 },

  { id: 'postgresql_prisma', keywords: ['postgresql', 'postgres', 'prisma', 'orm', 'database postgresql', 'pg', 'relational db', 'postgres database'], weight: 1.0, context: ['database', 'backend', 'orm'] },
  { id: 'mongodb_aggregation', keywords: ['mongodb', 'mongo', 'aggregation', 'agregacion', 'nosql', 'document db', 'mongod', 'mongo db'], weight: 1.0 },
  { id: 'redis_cache', keywords: ['redis', 'cache', 'caching', 'caché', 'session store', 'redis cache', 'in memory', 'memory cache'], weight: 1.0 },
  { id: 'database_schema', keywords: ['database schema', 'schema design', 'er diagram', 'entity relationship', 'data modeling', 'database design'], weight: 1.0 },

  { id: 'nextauth', keywords: ['nextauth', 'next auth', 'next-auth', 'authjs', 'nextjs auth'], weight: 1.0, context: ['nextjs', 'auth', 'login'] },
  { id: 'oauth_openid', keywords: ['oauth', 'openid', 'sso', 'single sign on', 'oauth2', 'oidc', 'auth0', 'clerk', 'social login'], weight: 1.0, context: ['auth', 'login', 'sso'] },
  { id: 'rbac_permissions', keywords: ['rbac', 'permissions', 'roles', 'authorization', 'access control', 'role based', 'permisos', 'role based access'], weight: 1.0 },
  { id: 'jwt_sessions', keywords: ['jwt', 'jws', 'json web token', 'access token', 'refresh token', 'jwt auth', 'bearer token'], weight: 0.8, context: ['auth', 'login', 'session', 'token', 'user'] },

  { id: 'cli_tool', keywords: ['cli tool', 'command line', 'herramienta cli', 'terminal', 'console app', 'bin', 'command line tool'], weight: 1.0 },
  { id: 'github_actions', keywords: ['github actions', 'ci cd', 'cicd', 'pipeline', 'github workflow', 'actions', 'automation', 'github ci', 'ci/cd', 'ci cd pipeline', 'pipelines', 'ci pipeline', 'cd pipeline'], weight: 1.0, context: ['github', 'ci', 'cd', 'automation'] },
  { id: 'project_generator', keywords: ['generator', 'scaffold', 'boilerplate', 'generador', 'yeoman', 'template', 'project scaffold'], weight: 1.0 },

  { id: 'stripe_payment', keywords: ['stripe', 'payment gateway', 'pasarela', 'pagos', 'stripe checkout', 'payment processing', 'stripe integration', 'stripe payments', 'process payments', 'payment', 'payments'], weight: 1.0, context: ['payment', 'ecommerce', 'checkout'] },
  { id: 'product_catalog', keywords: ['product catalog', 'catalogo productos', 'inventario', 'productos', 'inventory', 'product management'], weight: 1.0 },
  { id: 'shopping_cart', keywords: ['shopping cart', 'carrito compra', 'cart', 'add to cart', 'shopping'], weight: 1.0 },
  { id: 'checkout_flow', keywords: ['checkout', 'flujo pago', 'pago', 'checkout flow', 'payment flow', 'compra', 'payment process'], weight: 1.0 },

  { id: 'admin_panel', keywords: ['admin panel', 'panel admin', 'admin dashboard', 'backoffice', 'admin area'], weight: 1.0 },
  { id: 'user_management', keywords: ['user management', 'gestion usuarios', 'user registration', 'user profile', 'usuarios', 'user account'], weight: 1.0 },
  { id: 'analytics_dashboard', keywords: ['analytics dashboard', 'dashboard analytics', 'metrics', 'charts', 'charts.js', 'recharts', 'data visualization'], weight: 1.0, context: ['dashboard', 'analytics', 'charts'] },
  { id: 'reporting_engine', keywords: ['reporting', 'informes', 'reportes', 'reports', 'pdf reports', 'export', 'report generator'], weight: 1.0 },

  { id: 'react_native', keywords: ['react native', 'reactnative', 'expo react native', 'mobile app react native', 'rn mobile', 'ios android app react', 'react native mobile'], weight: 1.2, context: ['mobile', 'app', 'ios', 'android'] },
  { id: 'flutter_app', keywords: ['flutter', 'dart', 'flutter app', 'flutter mobile', 'flutter project'], weight: 1.0, context: ['mobile', 'app', 'dart'] },
  { id: 'native_bridge', keywords: ['native bridge', 'native module', 'native code', 'platform channel', 'ios native', 'android native', 'native integration'], weight: 1.0 },

  { id: 'playwright_e2e', keywords: ['playwright', 'e2e test', 'end to end', 'e2e testing', 'browser testing', 'e2e'], weight: 1.0, context: ['test', 'testing', 'e2e'] },
  { id: 'vitest_unit', keywords: ['vitest', 'jest', 'unit test', 'prueba unitaria', 'testing', 'unit testing', 'test'], weight: 0.7, context: ['test', 'unit'] },
  { id: 'integration_tests', keywords: ['integration test', 'prueba integracion', 'integration testing', 'api test'], weight: 1.0 },

  { id: 'swagger_openapi', keywords: ['swagger', 'openapi', 'rest documentation', 'api docs', 'swagger ui', 'redoc', 'api documentation'], weight: 1.0 },
  { id: 'technical_wiki', keywords: ['technical wiki', 'wiki', 'documentacion tecnica', 'docs', 'technical documentation'], weight: 0.8 },
  { id: 'readme_generator', keywords: ['readme', 'readme generator', 'documentacion proyecto', 'project docs', 'documentation'], weight: 0.7 },

  { id: 'refactoring', keywords: ['refactoring', 'refactor', 'refactorizacion', 'code cleanup', 'clean code', 'refactor code'], weight: 1.0 },
  { id: 'migration_script', keywords: ['migration script', 'migration', 'migracion', 'data migration', 'db migration', 'database migration'], weight: 1.0 },
  { id: 'type_safety', keywords: ['type safety', 'typescript', 'types', 'typing', 'type checking', 'typed'], weight: 0.8, context: ['typescript', 'type'] },

  { id: 'saas', keywords: ['saas', 'software as a service', 'subscription', 'subscription based', 'multi tenant', 'saas application', 'e-learning', 'elearning', 'e learning', 'learning platform', 'online course', 'lms', 'learning management'], weight: 0.7, context: ['business', 'subscription', 'service', 'learning', 'course'] },
  { id: 'ecommerce', keywords: ['ecommerce', 'tienda online', 'e-commerce', 'online store', 'tienda virtual', 'ecommerce website'], weight: 0.8, context: ['store', 'shop', 'payment'] },
  { id: 'crm', keywords: ['crm', 'customer relationship management', 'gestor clientes', 'crm system'], weight: 0.8, context: ['customer', 'sales', 'business'] },
  { id: 'ai_agent', keywords: ['ai agent', 'ia agent', 'artificial intelligence', 'autonomous agent', 'ai chatbot', 'ai assistant', 'ia', 'ai bot', 'inteligencia artificial'], weight: 0.9, context: ['ai', 'llm', 'chatbot', 'agent', 'machine learning'] },
  { id: 'dashboard', keywords: ['dashboard', 'panel de control', 'metrics', 'admin dashboard', 'data dashboard'], weight: 0.7, context: ['data', 'metrics', 'analytics'] },
  { id: 'auth', keywords: ['auth', 'autenticacion', 'login', 'register', 'signup', 'authentication', 'user auth'], weight: 0.7, context: ['login', 'user', 'session'] },
  { id: 'landing', keywords: ['landing', 'sitio web', 'web site', 'website'], weight: 0.6 },
  { id: 'formulario', keywords: ['formulario', 'encuesta', 'survey form', 'registration form', 'form builder'], weight: 0.7 },

  // Frente 14: Cloud Integrations
  { id: 'supabase_integration', keywords: ['supabase', 'supabase auth', 'supabase database', 'supabase storage', 'supabase realtime', 'supabase setup', 'supabase integration', 'supabase postgres', 'supabase auth', 'supabase functions'], weight: 1.0, context: ['backend', 'database', 'auth', 'saas'] },
  { id: 'firebase_integration', keywords: ['firebase', 'firebase auth', 'firebase firestore', 'firebase storage', 'firebase hosting', 'firebase setup', 'firebase integration', 'firebase realtime', 'firebase cloud messaging', 'gcp firebase'], weight: 1.0, context: ['backend', 'database', 'auth', 'mobile'] },
  { id: 'vercel_deployment', keywords: ['vercel', 'vercel deploy', 'vercel deployment', 'vercel hosting', 'vercel project', 'vercel config', 'vercel edge', 'vercel serverless', 'vercel project setup', 'deploy vercel'], weight: 1.0, context: ['deploy', 'hosting', 'frontend', 'serverless'] },
  { id: 'netlify_deployment', keywords: ['netlify', 'netlify deploy', 'netlify deployment', 'netlify hosting', 'netlify functions', 'netlify forms', 'netlify identity', 'netlify cms', 'deploy netlify'], weight: 1.0, context: ['deploy', 'hosting', 'frontend', 'serverless'] },
  
  // Frente 15: Database Operations
  { id: 'postgresql_setup', keywords: ['postgresql setup', 'postgres setup', 'postgresql database', 'pg database', 'postgres schema', 'postgresql config', 'pg setup'], weight: 1.0, context: ['database', 'backend', 'sql'] },
  { id: 'mongodb_setup', keywords: ['mongodb setup', 'mongo setup', 'mongodb database', 'mongo db', 'mongodb cluster', 'mongodb atlas', 'mongo setup'], weight: 1.0, context: ['database', 'backend', 'nosql'] },
  { id: 'mysql_setup', keywords: ['mysql setup', 'mysql database', 'mysql server', 'mariadb setup', 'mysql schema', 'mysql config'], weight: 1.0, context: ['database', 'backend', 'sql'] },
  { id: 'dynamodb_setup', keywords: ['dynamodb', 'aws dynamodb', 'dynamodb setup', 'dynamodb table', 'dynamodb partition key', 'dynamodb gsi', 'aws nosql'], weight: 1.0, context: ['database', 'aws', 'nosql'] },
  { id: 'supabase_database', keywords: ['supabase database', 'supabase postgres', 'supabase table', 'supabase rls', 'supabase policy', 'supabase schema', 'supabase postgresql'], weight: 1.0, context: ['database', 'backend', 'postgres'] },
  { id: 'firebase_firestore', keywords: ['firebase firestore', 'firestore', 'firestore database', 'firestore collection', 'firestore rules', 'firestore security rules', 'firebase nosql'], weight: 1.0, context: ['database', 'firebase', 'nosql'] },
  
  // Frente 16: Serverless & Edge
  { id: 'vercel_edge_functions', keywords: ['vercel edge function', 'vercel edge', 'edge function', 'vercel middleware', 'vercel edge runtime', 'edge computing vercel'], weight: 1.0, context: ['serverless', 'edge', 'vercel'] },
  { id: 'netlify_functions', keywords: ['netlify function', 'netlify functions', 'netlify serverless', 'netlify lambda', 'netlify background function', 'serverless netlify'], weight: 1.0, context: ['serverless', 'lambda', 'netlify'] },
  { id: 'railway_deployment', keywords: ['railway', 'railway deploy', 'railway deployment', 'railway railway', 'railway hosting', 'railway service', 'deploy railway'], weight: 1.0, context: ['deploy', 'hosting', 'paas'] },
  { id: 'render_deployment', keywords: ['render', 'render deploy', 'render deployment', 'render hosting', 'render service', 'render web service', 'deploy render'], weight: 1.0, context: ['deploy', 'hosting', 'paas'] },
  { id: 'flyio_deployment', keywords: ['flyio', 'fly.io', 'fly deploy', 'fly deployment', 'fly hosting', 'fly region', 'fly volume', 'deploy fly'], weight: 1.0, context: ['deploy', 'hosting', 'containers'] },
  { id: 'aws_lambda', keywords: ['aws lambda', 'lambda function', 'lambda deployment', 'aws serverless', 'lambda api gateway', 'serverless lambda', 'aws function'], weight: 1.0, context: ['serverless', 'aws', 'cloud'] },
  { id: 'cloudflare_workers', keywords: ['cloudflare workers', 'cf workers', 'cloudflare worker', 'workers kv', 'durable objects', 'cloudflare serverless', 'cf functions'], weight: 1.0, context: ['serverless', 'edge', 'cloudflare'] },
  
  // Frente 17: Infrastructure & Security
  { id: 'env_variables', keywords: ['environment variables', 'env variables', 'env file', '.env', 'environment config', 'env setup', 'config variables'], weight: 1.0, context: ['config', 'environment'] },
  { id: 'secrets_management', keywords: ['secrets manager', 'secret management', 'aws secrets manager', 'vault', 'secret rotation', 'credentials', 'api keys', 'secret store'], weight: 1.0, context: ['security', 'config'] },
  { id: 'domain_config', keywords: ['domain setup', 'domain configuration', 'custom domain', 'dns setup', 'dns configuration', 'domain mapping', 'cname', 'a record'], weight: 1.0, context: ['dns', 'domain'] },
  { id: 'ssl_tls_setup', keywords: ['ssl setup', 'tls setup', 'https setup', 'ssl certificate', 'https certificate', 'ssl tls', 'letsencrypt', 'certificate ssl'], weight: 1.0, context: ['security', 'https'] },
];

function hasContextMatch(description: string, context: string[]): boolean {
  const lowerDesc = description.toLowerCase();
  for (const ctx of context) {
    if (lowerDesc.includes(ctx.toLowerCase())) return true;
  }
  return false;
}

function calculateContextBoost(task: TaskKeyword, description: string): number {
  return 1.0;
}

function resolveConflicts(matches: { task: ProjectType; score: number }[], description: string): { task: ProjectType; score: number }[] {
  const d = description.toLowerCase();
  
  const hasReactNative = matches.some(m => m.task === 'react_native');
  const hasFlutter = matches.some(m => m.task === 'flutter_app');
  
  if (hasReactNative && hasFlutter) {
    const hasBothMentions = d.includes('react native') && d.includes('flutter');
    
    if (hasBothMentions) {
      // Keep both when both are explicitly mentioned
    } else {
      const userWantsReactNative = d.includes('react native') && !d.includes('flutter');
      const userWantsFlutter = d.includes('flutter') && !d.includes('react native');
      
      if (userWantsReactNative) {
        matches = matches.filter(m => m.task !== 'flutter_app');
      } else if (userWantsFlutter) {
        matches = matches.filter(m => m.task !== 'react_native');
      } else {
        const reactScore = matches.find(m => m.task === 'react_native')?.score || 0;
        const flutterScore = matches.find(m => m.task === 'flutter_app')?.score || 0;
        if (reactScore >= flutterScore) {
          matches = matches.filter(m => m.task !== 'flutter_app');
        } else {
          matches = matches.filter(m => m.task !== 'react_native');
        }
      }
    }
  }
  
  const hasOAuth = matches.some(m => m.task === 'oauth_openid');
  const hasAuth = matches.some(m => m.task === 'auth' || m.task === 'nextauth');
  
  if (hasOAuth && hasAuth) {
    const oauthKeywords = ['oauth', 'openid', 'sso', 'oidc', 'oauth2', 'auth0', 'clerk'];
    const hasOAuthExplicit = oauthKeywords.some(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      return regex.test(d);
    });
    
    const hasBothMentions = hasOAuthExplicit && (d.includes('authentication') || d.includes('user auth'));
    
    if (hasBothMentions) {
      // Keep both when both are explicitly mentioned
    } else if (hasOAuthExplicit) {
      // If OAuth is explicitly mentioned, filter out generic auth
      matches = matches.filter(m => m.task !== 'auth' && m.task !== 'nextauth');
    } else if ((d.includes('authentication') || d.includes('user auth')) && !d.includes('oauth')) {
      matches = matches.filter(m => m.task !== 'oauth_openid');
    } else {
      const oauthScore = matches.find(m => m.task === 'oauth_openid')?.score || 0;
      const authScore = matches.find(m => m.task === 'auth' || m.task === 'nextauth')?.score || 0;
      if (oauthScore >= authScore) {
        matches = matches.filter(m => m.task !== 'auth' && m.task !== 'nextauth');
      } else {
        matches = matches.filter(m => m.task !== 'oauth_openid');
      }
    }
  }
  
  if (matches.length <= 6) return matches;
  
  const topScore = matches[0].score;
  const threshold = topScore * 0.15;
  
  return matches.filter(m => m.score >= threshold).slice(0, 15);
}

export function detectTasks(description: string): { task: ProjectType; score: number }[] {
  const d = description.toLowerCase();
  const matches: { task: ProjectType; score: number }[] = [];

  for (const task of TASK_KEYWORDS) {
    let matchCount = 0;
    
    for (const keyword of task.keywords) {
      if (checkKeywordMatch(d, keyword)) {
        matchCount++;
      }
    }
    
    if (matchCount > 0) {
      let score = (matchCount / task.keywords.length) * task.weight;
      const contextBoost = calculateContextBoost(task, d);
      score *= contextBoost;
      matches.push({ task: task.id, score });
    }
  }

  const sorted = matches.sort((a, b) => b.score - a.score);
  return resolveConflicts(sorted, description);
}
