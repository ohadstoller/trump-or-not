# Phase 1: Project Setup & Configuration

## Overview
Set up the Node.js/TypeScript project foundation with all necessary dependencies and utilities.

## Steps

### 1. Initialize Node.js Project

Create `package.json` with:
- Project metadata
- TypeScript and dependencies
- Scripts for development and production

**Dependencies:**
- `typescript` - TypeScript compiler
- `ts-node` - TypeScript execution for development
- `@types/node` - Node.js type definitions
- `twitter-api-v2` - Twitter API client
- `openai` - OpenAI SDK
- `dotenv` - Environment variable management
- `axios` - HTTP client for news API

### 2. Configure TypeScript

Create `tsconfig.json` with:
- Target ES2020 or higher
- Strict mode enabled
- Output to `dist/` folder
- Source maps for debugging
- Module resolution set to Node

### 3. Create Project Structure

```
src/
├── services/          # External API integrations
├── utils/             # Helper utilities
├── config/            # Configuration management
└── index.ts           # Main entry point

data/                  # State storage
docs/                  # Documentation
.github/workflows/     # CI/CD automation
```

### 4. Environment Configuration

Create `.env.example` with all required variables:
- OpenAI API key
- Twitter/X API credentials (4 values)
- News API key
- Environment and timezone settings

**Security Note:** Never commit `.env` file - add to `.gitignore`

### 5. Implement Logger Utility

**File:** `src/utils/logger.ts`

**Features:**
- Timestamp for each log
- Log levels: INFO, WARN, ERROR
- Clean, readable output
- JSON formatting for production

**Purpose:** Track application flow and debug issues

### 6. Implement Storage Utility

**File:** `src/utils/storage.ts`

**Features:**
- Read/write JSON state file
- Store tweet history (last 10 tweets)
- Track last run timestamp
- Atomic file operations (prevent corruption)

**State Schema:**
```typescript
{
  lastRun: string (ISO timestamp),
  tweetHistory: Array<{
    content: string,
    topics: string[],
    timestamp: string
  }>
}
```

### 7. Configuration Manager

**File:** `src/config/index.ts`

**Features:**
- Load and validate environment variables
- Provide typed configuration object
- Fail fast if required variables missing
- Default values for optional settings

## Testing Checklist

- [ ] TypeScript compiles without errors
- [ ] All dependencies installed successfully
- [ ] Logger writes formatted output
- [ ] Storage can read/write JSON files
- [ ] Config validates required environment variables
- [ ] `.env.example` includes all needed variables

## Troubleshooting

**Issue:** TypeScript compilation errors
- Ensure Node.js version is 20+
- Verify tsconfig.json is valid JSON
- Check all imports use correct paths

**Issue:** Storage file errors
- Ensure `data/` directory exists
- Check file permissions
- Verify JSON is valid format

## Next Steps

Once Phase 1 is complete, proceed to **02-services.md** to implement the core API integrations.


