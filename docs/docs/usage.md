# Usage

## Basic syntax
```bash
vibe-budget plan <description>
```

Describe your project in natural language — no quotes required.

## Examples

### Single task
```bash
vibe-budget plan docker container
```

### Multiple tasks
```bash
vibe-budget plan ecommerce with stripe oauth and supabase
```

### Complex project
```bash
vibe-budget plan saas with nextjs supabase stripe oauth docker and kubernetes
```

### In Spanish
```bash
vibe-budget plan ecommerce con stripe y base de datos en supabase
```

### Data engineering
```bash
vibe-budget plan pipeline de datos en python con postgresql
```

## Scan an existing codebase

Point vibe-budget at any local project directory to estimate 
how many tokens it contains and what it would cost to process 
with an LLM.
```bash
vibe-budget scan ./my-project
```

vibe-budget will:
- Count tokens per file and per language
- Exclude sensitive files automatically (.env, .key, credentials)
- Skip node_modules, dist, build and other non-essential directories
- Show cost estimates across all available models

## View live model prices
```bash
vibe-budget prices
```

Lists all 85+ models sorted by price with input and output costs per 1K tokens.

## Estimate by project type
```bash
vibe-budget estimate saas
vibe-budget estimate ecommerce
vibe-budget estimate crm
```

For a full list of supported project types:
```bash
vibe-budget estimate --list
```

## Tips

- You can mix English and Spanish in the same description
- The more specific your description, the more accurate the task detection
- Use `scan` on an existing project before extending it with AI to know your baseline cost