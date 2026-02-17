# Vibe Budget - Project Plan

## Phase 1: Core MVP (COMPLETED)

### Goals
- [x] CLI skeleton with commander
- [x] Token estimation logic
- [x] Cost calculation with OpenRouter API integration
- [x] Basic commands: plan, prices, scan
- [x] Model price fetching and caching
- [x] 85+ models from 10 providers

### Files Created
- bin/index.ts
- src/core/tokenizer.ts
- src/core/calculator.ts
- src/commands/plan.ts
- src/commands/prices.ts
- src/commands/scan.ts
- src/utils/formatter.ts
- src/contracts.ts

---

## Phase 2: Enhancements (COMPLETED)

### Features Added

1. **Extended Task Coverage**
   - Expanded from 8 to 62 development tasks
   - Organized in 13 development fronts
   - Each task has custom token estimates based on complexity
   - Natural language detection for task identification

2. **Model Recommendations**
   - Expanded recommendation database with 62+ task-specific recommendations
   - Per-project-type suggestions
   - Context-specific advice

3. **Output Improvements**
   - Better display of tokens (input/output/total)
   - Cost breakdown with tokens and USD
   - Top 10 cheapest models comparison
   - Provider information for each model

4. **Contract System**
   - Comprehensive task definitions in contracts.ts
   - Token estimates per task
   - Complexity levels: low, medium, high, very_high
   - Task keywords for detection

---

## Phase 3: Advanced Features (PENDING)

### Planned Features
1. **Interactive Mode**
   - Prompt user for project details
   - Ask for complexity level
   - Step-by-step wizard

2. **Output Formats**
   - JSON output for automation
   - Markdown export
   - CSV export

3. **Prompt Templates**
   - Pre-built prompts for common projects
   - Optimize for specific AI tools (Lovable, Claude Code, etc.)

4. **History & Tracking**
   - Save previous estimates
   - Compare actual vs estimated costs

5. **Plugin System**
   - Support for custom pricing sources
   - Custom project type definitions

---

## Technical Requirements

- Node.js 18+
- TypeScript 5.3+
- OpenRouter API key (optional, has fallbacks)

## Testing

Run tests with:
```bash
npm test
```

## Building

Build for production:
```bash
npm run build
```

## Usage Examples

```bash
# Estimate docker container
vibe-budget plan "docker container"

# Estimate REST API with GraphQL
vibe-budget plan "rest api graphql"

# Estimate LangChain agent with RAG
vibe-budget plan "langchain agent with rag"

# Estimate Terraform IaC
vibe-budget plan "terraform iac"

# Estimate React Native app
vibe-budget plan "react native app"

# List all available tasks
vibe-budget plan --list

# View model prices
vibe-budget prices

# Scan a project directory
vibe-budget scan ./my-project
```
