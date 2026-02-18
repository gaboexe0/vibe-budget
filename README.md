# 💸 vibe-budget

> **Know the cost before you code.**  
> Translate any project description into token estimates and real LLM costs — before you burn your budget.

```bash
vibe-budget plan "saas with supabase, oauth, docker, stripe and kubernetes"
```

---

## The Problem

You open Cursor, describe your project, and start vibing.  
Three hours later — $47 gone. On a landing page.

Most developers have no idea how many tokens a project actually costs until after the fact. Different models have wildly different prices. A task that costs $0.01 with Gemini Flash costs $5.80 with Claude Opus.

**vibe-budget fixes this.**

---

## What It Does

Paste any project description — in plain English or Spanish — and vibe-budget will:

- **Detect** all the technical tasks involved (auth, database, deployment, UI, infra...)
- **Estimate** the token count for each task (input + output separately)
- **Fetch real-time prices** from OpenRouter across 85+ models
- **Recommend** the best model per task based on quality/price ratio
- **Show** the cheapest, best value, and premium options side by side

No opinions. No "you should use X". Just the numbers — you decide.

---

## Demo

```
Project: saas with supabase, oauth, docker, stripe and kubernetes

Detected Tasks (8):
------------------------------------------------------------
  1. PostgreSQL/Prisma    high        75k tokens
  2. Supabase Integration medium      67k tokens
  3. Docker Container     medium      53k tokens
  4. OAuth/OpenID         high        60k tokens
  5. Stripe Payment       high        90k tokens
  6. Kubernetes           high        115k tokens
  7. Authentication       medium      70k tokens
  8. Next.js App          high        120k tokens

Combined Token Estimate:
------------------------------------------------------------
   Input:  265,000 tokens
   Output:  520,000 tokens
   Total:  785,000 tokens

Token Cost Breakdown (OpenRouter Pricing):
------------------------------------------------------------
   PostgreSQL/Prisma      25,000 in +   50,000 out = $0.53
   Supabase Integration   22,000 in +   45,000 out = $0.48
   Docker Container       18,000 in +   35,000 out = $0.37
   OAuth/OpenID           20,000 in +   40,000 out = $0.43
   Stripe Payment         30,000 in +   60,000 out = $0.69
   Kubernetes             40,000 in +   75,000 out = $0.80
   Authentication         25,000 in +   45,000 out = $0.48
   Next.js App            40,000 in +   80,000 out = $0.92

Model Recommendations by Task:
-----------------------------------------------------------------------------------------------
Task                Tokens    Recommendation                               Cost
-----------------------------------------------------------------------------------------------
   PostgreSQL/Prisma    75,000     DeepSeek R1              [BEST] $0.15 (Q: 96%)
   Supabase Integration 67,000     Gemini 2.5 Flash-Lite    [BEST] $0.01 (Q: 68%)
   Docker Container     53,000     Gemini 2.5 Flash-Lite    [BEST] $0.01 (Q: 68%)
   OAuth/OpenID         60,000     DeepSeek R1              [BEST] $0.12 (Q: 96%)
   Stripe Payment       90,000     DeepSeek R1              [BEST] $0.18 (Q: 96%)
   Kubernetes           115,000    DeepSeek R1              [BEST] $0.23 (Q: 96%)
   Authentication       70,000     Gemini 2.5 Flash-Lite    [BEST] $0.01 (Q: 68%)
   Next.js App          120,000    DeepSeek R1              [BEST] $0.24 (Q: 96%)
-----------------------------------------------------------------------------------------------
   TOTAL                785,000                             $0.95

Overall Best Models:
-----------------------------------------------------------------------------------------------
   [BEST]:   DeepSeek R1               Quality: 96.1%   Cost: $1.57
   [REC]:    Claude Sonnet 4.5         Quality: 77.0%   Cost: $9.42
   [CHEAP]:  Gemini 2.5 Flash-Lite     Quality: 68.0%   Cost: $0.12

Top 10 Cheapest Models:
-------------------------------------------------------------------------------------
   Gemini 2.5 Flash-Lite      Google      68.0%     $0.12
   GPT-5 Nano                 OpenAI      85.0%     $0.24
   Gemini 2.5 Flash           Google      71.0%     $0.24
   Qwen 2.5 Coder 1.5B        Qwen        N/A       $0.24
   Gemini 2.0 Flash           Google      70.0%     $0.29
   GPT-4o-mini                OpenAI      87.0%     $0.36
   Gemini 3 Flash Preview     Google      90.8%     $0.57
   Qwen 2.5 Coder 7B          Qwen        88.4%     $0.57
   DeepSeek V3                DeepSeek    82.6%     $0.15
   DeepSeek R1                DeepSeek    96.1%     $1.57

Showing top 10 of 85 models

⚠️  ESTIMATED PRICES & TOKENS
------------------------------------------------------------
Prices shown are estimates based on OpenRouter costs.
Token estimates are based on standard prompting patterns.
Actual usage may vary based on prompt style and complexity.
View updated prices: https://openrouter.ai/models
------------------------------------------------------------
```

---

## Install

```bash
# Clone the repo
git clone https://github.com/gaboexe0/vibe-budget.git
cd vibe-budget

# Install dependencies
npm install

# Run
npm run dev -- plan "your project description"
```

> npm package coming soon — `npx vibe-budget` will work once published.

---

## Usage

### `plan` — Full project breakdown

```bash
vibe-budget plan "e-commerce with react, supabase and stripe"
vibe-budget plan "landing page with nextjs and vercel deployment"
vibe-budget plan "mobile app with firebase, react native and oauth"
```

Works in **English and Spanish**:

```bash
vibe-budget plan "necesito un saas con oauth, docker y postgresql en supabase"
```

### `estimate` — Quick single task estimate

```bash
vibe-budget estimate "kubernetes cluster"
vibe-budget estimate "stripe payment integration"
vibe-budget estimate "supabase with rls policies"
```

### `tokenize` — Count tokens in any text

```bash
vibe-budget tokenize "your prompt text here"
```

---

## How It Works

### 1. Task Detection

vibe-budget parses your description and maps it to known technical task categories using keyword matching across 13 domains:

| Category | Examples |
|----------|---------|
| **Cloud Integrations** | Supabase, Firebase, Vercel, Netlify |
| **Databases** | PostgreSQL, MongoDB, MySQL, Redis, Prisma, DynamoDB |
| **Deployment** | Vercel Edge, Netlify Functions, Railway, Render, Fly.io, AWS Lambda, Cloudflare Workers |
| **Infrastructure** | Docker, Kubernetes, Terraform, CI/CD, GitHub Actions |
| **Auth & Security** | OAuth, NextAuth, JWT, SSL/TLS, Secrets |
| **Frontend** | React, Next.js, React Native, Flutter, UI Components |
| **Backend** | REST APIs, GraphQL, gRPC, Microservices |
| **Payments** | Stripe, PayPal, Webhooks |
| **AI/ML** | LLM Integration, RAG, AI Agents, Vector DBs |
| **Mobile** | iOS/Android, Push Notifications |
| **Testing** | Unit, E2E, Integration |
| **DevOps** | Monitoring, Logging, Alerts |
| **SaaS** | Multi-tenancy, Billing, User Management |

### 2. Token Estimation

Each task has calibrated base estimates for `input` and `output` tokens, derived from real-world prompting patterns across 84 LLM models. Models with different efficiency profiles (reasoning models, smaller models, etc.) get adjusted estimates automatically.

```
Base estimates per task type:
  Supabase Integration:    22K in + 45K out = 67K total
  Firebase Integration:    25K in + 50K out = 75K total
  PostgreSQL Setup:        18K in + 35K out = 53K total
  Kubernetes Cluster:      40K in + 75K out = 115K total
  Stripe Payment:          30K in + 60K out = 90K total
  Vercel Deployment:        8K in + 15K out = 23K total
  SSL/TLS Setup:            7K in + 14K out = 21K total
  Environment Variables:    5K in + 10K out = 15K total
  ... and 15 more
```

**Reasoning models** (DeepSeek R1, o3, QWQ) use ~2.3x more output tokens due to chain-of-thought. vibe-budget accounts for this automatically.

### 3. Real-Time Pricing

Prices are fetched live from the [OpenRouter API](https://openrouter.ai/api/v1/models) and cached for 1 hour. This covers 85+ models across all major providers.

### 4. Quality-Price Optimization

Each recommendation uses a quality/price ratio based on HumanEval, SWE-bench, and LiveCodeBench benchmark scores. The goal is not always the cheapest model — it's the best model **for the money**, given the task complexity:

- **Simple tasks** (config files, env vars, deployments) → cheap fast models
- **Complex tasks** (auth logic, payment flows, infra) → higher quality models

---

## Models Covered

85+ models across all major providers, including:

| Provider | Models |
|----------|--------|
| **OpenAI** | GPT-5.2, GPT-5.1, GPT-5 Nano, GPT-4o, GPT-4o-mini, o3, o4-mini |
| **Anthropic** | Claude Opus 4.5/4.6, Sonnet 4.5, Haiku 4.5, Claude 3.5 Sonnet |
| **Google** | Gemini 3 Pro, Gemini 2.5 Pro/Flash/Flash-Lite, Gemini 3 Flash |
| **DeepSeek** | R1, R1-0528, V3, V3.2, V4, Coder V2 |
| **xAI** | Grok 4, Grok 4 Code, Grok 3 variants |
| **Qwen** | Qwen3 Coder 480B, Qwen 2.5 Coder (32B/14B/7B/3B/1.5B), QWQ 32B |
| **Zhipu AI** | GLM-5, GLM-4.7, GLM-4.6 |
| **MiniMax** | M2.5, M2.1, Text-01 |
| **Moonshot AI** | Kimi K2.5 |
| **01.AI** | Yi-Large, Yi-Medium, Yi-Coder-9B |

---

## Benchmark Data

Quality scores used for recommendations come from three coding benchmarks:

| Benchmark | What It Measures |
|-----------|-----------------|
| **HumanEval** | Code generation from docstrings |
| **SWE-bench Verified** | Real GitHub issue resolution |
| **LiveCodeBench** | Competitive programming problems |

Top performers:

```
DeepSeek R1         HumanEval: 96.1%   SWE-bench: —
GLM-5               HumanEval: 94.2%   SWE-bench: 77.8%
Claude Opus 4.5     HumanEval: 93.8%   SWE-bench: 80.9%
Qwen 2.5 Coder 32B  HumanEval: 92.7%   SWE-bench: 69.6%
Gemini 3 Pro        HumanEval: 92.5%   LiveCode:  91.7%
```

---

## Philosophy

vibe-budget is a **calculator, not an advisor**.

It shows you the numbers. It doesn't tell you which model to use. Like Google Flights showing all airlines — you see the prices, you make the call.

What it won't do:
- Connect to your Cursor/Windsurf/Codeium accounts
- Access your API keys or usage data
- Tell you "use this model because it's better"

What it will do:
- Give you the most accurate estimates it can
- Be honest about uncertainty (hence the ⚠️ disclaimer)
- Let you make an informed decision before spending

---

## Disclaimer

```
⚠️ All token counts and costs are ESTIMATES.
   Actual usage depends on your prompting style,
   project complexity, and model behavior.
   Prices update from OpenRouter hourly.
   Use as a planning tool, not a guarantee.
```

---

## Roadmap

- [ ] `npx vibe-budget` (npm publish)
- [ ] `--budget $5` flag — filter models by max cost
- [ ] `--export csv/json` — export plan for client quotes
- [ ] Multi-project planning — optimize across phases
- [ ] Free tier tracker — manually track Cursor/Windsurf trials
- [ ] `vibe-budget actual <tokens>` — compare estimate vs real usage

---

## Contributing

Found a task category missing? Wrong token estimate? Open an issue or PR.

The core data lives in `data/tasks.json` and `data/integrations.json` — adding new tasks is straightforward.

---

## License

MIT — use it, fork it, build on it.

---

<div align="center">
  <p>Built because someone had to.</p>
  <p>
    <a href="https://github.com/gaboexe0/vibe-budget">GitHub</a> ·
    <a href="https://openrouter.ai/models">OpenRouter Pricing</a>
  </p>
<<<<<<< HEAD
</div>
=======
</div>
>>>>>>> d17f793 (fix: add npmignore and update for CLI)
