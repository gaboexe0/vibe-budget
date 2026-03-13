# What is vibe-budget?

vibe-budget is a CLI tool that estimates the real cost of building 
AI coding projects before you start spending tokens.

Describe your project in plain English or Spanish — vibe-budget detects 
the tasks involved, estimates token usage per task, fetches live prices 
from 85+ models via OpenRouter, and recommends the best model for your budget.

> Know the cost before you code.

## The problem

You open Cursor, describe your project, and start vibing.  
Three hours later — $47 gone. On a landing page.

Most developers have no idea how many tokens a project actually costs 
until after the fact. A task that costs $0.01 with Gemini Flash costs 
$5.80 with Claude Opus. vibe-budget fixes this.

## What it does

- **Detects** technical tasks from natural language descriptions
- **Estimates** token count per task — input and output separately
- **Fetches real-time prices** from OpenRouter across 85+ models
- **Recommends** the best model per task based on quality/price ratio
- **Scans** existing codebases to estimate refactoring or extension costs
- **Compares** cheapest, best value, and premium options side by side

No opinions. No "you should use X". Just the numbers — you decide.

## Commands

| Command | Description |
|---|---|
| `vibe-budget plan` | Estimate costs from a natural language description |
| `vibe-budget scan` | Scan an existing codebase and estimate token costs |
| `vibe-budget prices` | List all 85+ models with live pricing |
| `vibe-budget estimate` | Estimate by predefined project type |

## Quick example
```bash
vibe-budget plan ecommerce with stripe oauth and supabase
```
```
Detected Tasks (4):
  1. E-commerce           high    130k tokens
  2. Stripe Payment       high     90k tokens
  3. OAuth/OpenID         high     60k tokens
  4. Supabase Integration medium   67k tokens

Total: 497,000 tokens

[BEST]   DeepSeek R1            Quality: 96.1%  Cost: $0.99
[REC]    DeepSeek V3.2          Quality: 89.6%  Cost: $0.72
[CHEAP]  Gemini 2.5 Flash-Lite  Quality: 68.0%  Cost: $0.07
```

## Supported languages

vibe-budget detects tasks described in **English and Spanish** — 
no need to translate your prompts.
```bash
# Both work
vibe-budget plan ecommerce with stripe and supabase
vibe-budget plan ecommerce con stripe y supabase
```

## Models covered

85+ models from 10+ providers including OpenAI, Anthropic, Google, 
DeepSeek, Mistral, Meta, Qwen, xAI, Zhipu AI, and NVIDIA — 
all with real-time pricing via OpenRouter.
---
*Powered by OpenRouter*