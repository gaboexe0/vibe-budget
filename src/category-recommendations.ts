export interface CategoryRecommendation {
  category: 'simple' | 'medium' | 'complex';
  taskIds: string[];
  recommendedModels: {
    best: string[];
    good: string[];
    cheap: string[];
  };
}

const CATEGORY_RECOMMENDATIONS: CategoryRecommendation[] = [
  {
    category: 'simple',
    taskIds: [
      'landing_page', 'formulario', 'landing', 'seo_optimization', 
      'cli_tool', 'readme_generator', 'swagger_openapi', 'technical_wiki',
      'framer_motion', 'vitest_unit', 'redis_cache', 'database_schema',
      'jwt_sessions', 'shopping_cart', 'github_actions',
      // Cloud deployments - simple
      'vercel_deployment', 'netlify_deployment', 'render_deployment',
      'env_variables', 'domain_config', 'ssl_tls_setup'
    ],
    recommendedModels: {
      best: [
        'openai/gpt-4o-mini',
        'google/gemini-2.5-flash',
        'anthropic/claude-3.5-haiku',
      ],
      good: [
        'qwen/qwen-turbo',
        'deepseek/deepseek-v3',
        'google/gemini-2.5-flash-lite',
      ],
      cheap: [
        'minimax/minimax-m2.5',
        'qwen/qwen-flash',
        'anthropic/claude-haiku-3',
      ],
    },
  },
  {
    category: 'medium',
    taskIds: [
      'docker_container', 'docker_compose', 'nextjs_app', 'react_dashboard',
      'shadcn_ui', 'ui_components', 'postgresql_prisma', 'mongodb_aggregation',
      'product_catalog', 'user_management', 'integration_tests',
      'serverless_lambda', 'docker_compose', 'nextauth', 'oauth_openid',
      'rbac_permissions', 'type_safety', 'refactoring',
      // Cloud integrations - medium
      'supabase_integration', 'supabase_database',
      'postgresql_setup', 'mongodb_setup', 'mysql_setup',
      'vercel_edge_functions', 'netlify_functions',
      'railway_deployment', 'flyio_deployment',
      'secrets_management'
    ],
    recommendedModels: {
      best: [
        'anthropic/claude-sonnet-4.5',
        'openai/gpt-4o',
        'google/gemini-2.5-pro',
      ],
      good: [
        'openai/gpt-4o-mini',
        'deepseek/deepseek-r1',
        'qwen/qwen-2.5-coder-32b',
      ],
      cheap: [
        'anthropic/claude-3.5-haiku',
        'google/gemini-2.5-flash',
        'deepseek/deepseek-v3',
      ],
    },
  },
  {
    category: 'complex',
    taskIds: [
      'rest_api', 'graphql_api', 'microservicios', 'kubernetes_deploy',
      'terraform_iac', 'event_driven', 'sqs_kafka',
      'langchain_agent', 'multi_agent', 'rag_system', 'vector_database',
      'tool_calling', 'document_pipeline', 'stripe_payment', 'checkout_flow',
      'admin_panel', 'analytics_dashboard', 'reporting_engine',
      'playwright_e2e', 'migration_script',
      'saas', 'ecommerce', 'crm', 'ai_agent', 'dashboard',
      'react_native', 'flutter_app', 'native_bridge',
      // Cloud - complex
      'firebase_integration', 'firebase_firestore',
      'dynamodb_setup', 'aws_lambda', 'cloudflare_workers'
    ],
    recommendedModels: {
      best: [
        'anthropic/claude-opus-4.6',
        'openai/gpt-5.2',
        'anthropic/claude-sonnet-4.5',
      ],
      good: [
        'google/gemini-3-pro',
        'deepseek/deepseek-r1',
        'openai/gpt-4o',
      ],
      cheap: [
        'anthropic/claude-3.5-sonnet',
        'qwen/qwen3-coder-next',
        'google/gemini-2.5-pro',
      ],
    },
  },
];

export function getComplexityForTask(taskId: string): 'simple' | 'medium' | 'complex' {
  for (const cat of CATEGORY_RECOMMENDATIONS) {
    if (cat.taskIds.includes(taskId)) {
      return cat.category;
    }
  }
  return 'medium';
}

export function getRecommendedModelsForComplexity(complexity: 'simple' | 'medium' | 'complex'): string[] {
  const cat = CATEGORY_RECOMMENDATIONS.find(c => c.category === complexity);
  if (!cat) return [];
  return [...cat.recommendedModels.best, ...cat.recommendedModels.good, ...cat.recommendedModels.cheap];
}

export function getRecommendedModelsForTask(taskId: string): string[] {
  return getRecommendedModelsForComplexity(getComplexityForTask(taskId));
}
