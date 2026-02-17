# Vibe Budget - AI Cost Estimation CLI

## Project Overview

Vibe Budget is a CLI tool that estimates AI coding costs and compares models for different project types. It helps developers and teams understand the potential costs of building software projects using AI assistance, supporting over 60 specific development tasks across 13 major areas.

## Commands

### `vibe-budget plan <description>`
Estimates costs for a project based on description. The description can be any text that matches available tasks (e.g., "docker container", "rest api graphql", "langchain agent", "terraform iac", "react native app").

**Examples:**
```bash
vibe-budget plan "docker container"
vibe-budget plan "rest api graphql"
vibe-budget plan "langchain agent with rag"
vibe-budget plan "terraform iac"
vibe-budget plan "react native app"
vibe-budget plan "nextjs app with shadcn"
```

**Supported tasks (62 total):**
- Organized in 13 development fronts covering all aspects of modern software development
- Each task has predefined token estimates (input/output) based on complexity
- Detection is intelligent and supports natural language descriptions

**Complexity levels:**
- Defined in `src/contracts.ts` (PROJECT_COMPLEXITY)
- Levels: low, medium, high, very_high

### `vibe-budget prices`
Shows current model prices from OpenRouter for 85+ models.

### `vibe-budget scan <path>`
Scans a project directory and returns file statistics.

## Architecture

```
vibe-budget/
├── bin/
│   └── index.ts          # CLI entry point
├── src/
│   ├── commands/         # Command handlers
│   │   ├── scan.ts       # Directory scanning
│   │   ├── plan.ts       # Cost estimation with task detection
│   │   └── prices.ts     # Model pricing display
│   ├── core/             # Business logic
│   │   ├── tokenizer.ts  # Token estimation (fallback chars/4)
│   │   └── calculator.ts # Cost calculation with API integration
│   ├── data/             # Cache files (prices-cache.json)
│   └── utils/            # Formatters
└── package.json
```

## Supported Development Tasks (62 tasks in 13 fronts)

### 1. Infraestructura Backend y APIs (6 tasks)
rest_api, graphql_api, microservicios, docker_container, kubernetes_deploy, docker_compose

### 2. Frontend y UI/UX Moderno (7 tasks)
nextjs_app, react_dashboard, vue_nuxt, landing_page, shadcn_ui, framer_motion, seo_optimization

### 3. Sistemas de Inteligencia Artificial Aplicada (6 tasks)
langchain_agent, multi_agent, tool_calling, rag_system, vector_database, document_pipeline

### 4. Arquitectura de Microservicios y Cloud (4 tasks)
serverless_lambda, terraform_iac, event_driven, sqs_kafka

### 5. Bases de Datos y Persistencia (4 tasks)
postgresql_prisma, mongodb_aggregation, redis_cache, database_schema

### 6. Seguridad Avanzada y Autenticación (4 tasks)
nextauth, oauth_openid, rbac_permissions, jwt_sessions

### 7. Herramientas para Desarrolladores (3 tasks)
cli_tool, github_actions, project_generator

### 8. E-commerce y Marketplaces (4 tasks)
stripe_payment, product_catalog, shopping_cart, checkout_flow

### 9. Sistemas Empresariales SaaS/CRM/ERP (4 tasks)
admin_panel, user_management, analytics_dashboard, reporting_engine

### 10. Mobile Development (3 tasks)
react_native, flutter_app, native_bridge

### 11. QA, Testing y Calidad (3 tasks)
playwright_e2e, vitest_unit, integration_tests

### 12. Documentación y Soporte Técnico (3 tasks)
swagger_openapi, technical_wiki, readme_generator

### 13. Mantenimiento y Refactorización (3 tasks)
refactoring, migration_script, type_safety

Plus 8 original project types: ecommerce, landing, formulario, crm, ai_agent, dashboard, saas, auth

## Model Providers

All model data is defined in `src/contracts.ts` (MODEL_DATA) with 85+ models.

**Supported providers:**
- OpenAI (GPT-5, GPT-4, o-series)
- Anthropic (Claude Opus, Sonnet, Haiku)
- Google (Gemini series)
- xAI (Grok series)
- DeepSeek (V-series, R1, Coder)
- Qwen (3.x, 2.5, QWQ)
- Zhipu AI (GLM series)
- MiniMax (M-series)
- Moonshot AI (Kimi)
- 01.AI (Yi series)

## Cost Calculation

- Each task has predefined input/output token estimates based on complexity analysis
- Prices are fetched from OpenRouter API in real-time
- Fallback to default prices if API unavailable
- Cache duration: 1 hour
- Shows breakdown: input tokens + cost, output tokens + cost, total tokens + cost
- Provides top 10 cheapest models comparison
- Smart recommendations based on task type

## Important Notes

- Excludes .env, .gitignore, and sensitive files in all operations
- Prices obtained from OpenRouter API with fallback defaults
- Model recommendations based on project type
- Task detection uses keyword matching from natural language descriptions
- Designed for solo developers and small teams to estimate AI coding budgets
