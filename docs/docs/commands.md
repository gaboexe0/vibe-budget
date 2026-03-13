# Commands

## plan

Estimate costs from a natural language project description.
```bash
vibe-budget plan <description>
```

**Arguments**

| Argument | Description |
|---|---|
| `description` | Project description in plain English or Spanish |

**Output includes**
- Detected tasks with complexity and token count
- Combined token estimate (input + output)
- Cost breakdown per task across average model pricing
- Best quality-price model recommendation
- Top 10 cheapest models
- Overall best, recommended, and cheapest models

**Example**
```bash
vibe-budget plan nextjs app with stripe and postgresql
```

---

## scan

Scan an existing codebase and estimate token costs.
```bash
vibe-budget scan <path>
```

**Arguments**

| Argument | Description |
|---|---|
| `path` | Path to the project directory (default: current directory) |

**Automatically excludes**
- `node_modules`, `dist`, `build`, `.next`, `.git`
- `.env`, `.key`, `.pem`, `credentials.json` and other sensitive files
- Lock files (`package-lock.json`, `yarn.lock`)

**Supported languages**
JavaScript, TypeScript, Python, Go, Rust, Ruby, Java, PHP, Swift, 
Kotlin, C, C++, HTML, CSS, SCSS, Vue, Svelte and more.

**Example**
```bash
vibe-budget scan ./my-project
```

---

## prices

List all available models with live pricing from OpenRouter.
```bash
vibe-budget prices
```

**Output includes**
- Model name and provider
- Input price per 1K tokens
- Output price per 1K tokens
- Sorted from cheapest to most expensive

---

## estimate

Estimate costs using a predefined project type.
```bash
vibe-budget estimate <project>
```

**Arguments**

| Argument | Description |
|---|---|
| `project` | Predefined project type (default: saas) |

**Supported project types**

| Type | Description |
|---|---|
| `saas` | Full SaaS application |
| `ecommerce` | E-commerce platform |
| `crm` | CRM system |
| `dashboard` | Analytics dashboard |
| `ai_agent` | AI agent |
| `auth` | Authentication system |
| `landing` | Landing page |

**Example**
```bash
vibe-budget estimate ecommerce
```

---

## Global options

| Option | Description |
|---|---|
| `--version` | Show current version |
| `--help` | Show help for any command |
```bash
vibe-budget --help
vibe-budget plan --help
```