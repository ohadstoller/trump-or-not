# Phase 3: Main Orchestrator & Integration

## Overview
Combine all services into a cohesive workflow with error handling, testing, and variety logic.

## Main Orchestrator

**File:** `src/index.ts`

### Workflow Steps

1. **Initialize**
   - Load configuration
   - Initialize logger
   - Load previous state from storage

2. **Fetch News**
   - Call news service to get 3-5 headlines
   - Log headlines for debugging
   - Handle API failures gracefully

3. **Generate Tweet**
   - Pass headlines to OpenAI service
   - Get Trump-style tweet
   - Validate length and content
   - Log generated tweet

4. **Check Variety**
   - Compare with recent tweet topics
   - If too similar, regenerate or skip
   - Log variety check results

5. **Post to Twitter**
   - Send tweet via Twitter service
   - Handle dry-run mode
   - Log success with tweet URL

6. **Update State**
   - Add new tweet to history
   - Update last run timestamp
   - Trim history to last 10 tweets
   - Save state to file

7. **Cleanup**
   - Log completion status
   - Exit with appropriate code

### Error Handling Strategy

**Service Failures:**
- News API down → Retry once, then exit gracefully
- OpenAI API issue → Retry with exponential backoff
- Twitter API error → Log and exit (don't retry posts)

**Graceful Degradation:**
- If variety check fails, post anyway (better than nothing)
- If state file corrupt, initialize fresh
- Log all errors with full context

### Dry Run Mode

Support environment variable `DRY_RUN=true`:
- Fetch real news
- Generate real tweets
- DON'T post to Twitter
- Log what would have been posted
- Don't update state

Perfect for testing without spamming Twitter account.

## Variety Logic Implementation

### Purpose
Avoid posting about the same topics repeatedly (boring for followers).

### Approach

**Extract Topics:**
```typescript
// From each tweet, extract key topics
// Can use simple keyword matching or ask OpenAI
```

**Compare:**
```typescript
// Check if new tweet topics overlap >50% with recent tweets
// If yes, it's too similar
```

**Action:**
```typescript
// Option 1: Fetch different news category
// Option 2: Ask OpenAI to try different angle
// Option 3: Skip this run (only if recent similar tweet)
```

### Implementation Details

Store topics with each tweet:
```typescript
{
  content: string,
  topics: string[],  // e.g., ["economy", "stock market", "biden"]
  timestamp: string
}
```

### Similarity Threshold
- < 30% overlap: Different enough, proceed
- 30-50% overlap: Similar but acceptable
- > 50% overlap: Too similar, take action

## Command Line Interface

Support basic CLI arguments:
```bash
# Normal run
npm start

# Dry run mode
npm run dry-run

# Force post (skip variety check)
npm run force
```

## Testing Strategy

### Unit Testing (Optional but Recommended)

Test each service independently:
- Mock external APIs
- Verify error handling
- Check edge cases

### Integration Testing

**Manual Test Plan:**

1. **News Service Test**
   ```bash
   # Create test script: src/test-news.ts
   npm run test:news
   ```
   - Verify headlines are fetched
   - Check format and quantity

2. **OpenAI Service Test**
   ```bash
   npm run test:openai
   ```
   - Use sample headlines
   - Verify tweet generation
   - Check length and style

3. **Twitter Service Test (Dry Run)**
   ```bash
   DRY_RUN=true npm start
   ```
   - Full workflow without posting
   - Verify all steps execute
   - Check logs

4. **Full Integration Test**
   ```bash
   # Post to actual Twitter (use carefully!)
   npm start
   ```
   - Monitor Twitter account
   - Verify tweet appears
   - Check state file updates

### Test Checklist

- [ ] Each service works independently
- [ ] Main orchestrator executes all steps
- [ ] Error handling catches API failures
- [ ] Dry run mode works correctly
- [ ] State file updates properly
- [ ] Variety logic prevents repetition
- [ ] Logs provide useful debugging info
- [ ] Exit codes are correct (0 = success)

## Monitoring & Logging

### Log Levels

**INFO:** Normal operation
```
[INFO] Fetched 5 headlines from NewsAPI
[INFO] Generated tweet: "Economy is BOOMING..."
[INFO] Posted tweet successfully: https://twitter.com/...
```

**WARN:** Recoverable issues
```
[WARN] News API slow to respond, retrying...
[WARN] Tweet similar to recent post, regenerating...
```

**ERROR:** Failures
```
[ERROR] OpenAI API failed: Rate limit exceeded
[ERROR] Twitter authentication failed: Invalid token
```

### State File Monitoring

Track in `data/state.json`:
- Last successful run
- Recent tweet topics
- Error count (if implementing retry logic)

## Troubleshooting

**Issue:** Tweet too similar every time
- Increase variety threshold
- Use more news categories
- Add randomness to headline selection

**Issue:** OpenAI generates inappropriate content
- Refine system prompt
- Add content filters
- Regenerate on detection

**Issue:** Inconsistent execution
- Check for network issues
- Verify API quotas not exceeded
- Review logs for patterns

## Next Steps

Once Phase 3 is complete and tested, proceed to **04-deployment.md** to set up automated scheduling.


