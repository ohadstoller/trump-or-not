# Phase 2: Core Services Implementation

## Overview
Build three core services that interact with external APIs: News, OpenAI, and Twitter.

## Service 1: News Service

**File:** `src/services/newsService.ts`

### Purpose
Fetch 3-5 current top headlines to provide context for tweet generation.

### Implementation Options

**Option A: NewsAPI.org (Recommended)**
- Free tier: 100 requests/day
- Structured JSON response
- Filtered by country/category
- Easy to parse

**Option B: Google News RSS**
- Completely free
- No API key needed
- Parse XML to get headlines
- Less structured

### Features
- Fetch top headlines from US news
- Filter for politics/business/general categories
- Return array of headline strings
- Error handling for API failures
- Cache results (5-10 minute TTL) to avoid rate limits

### Return Format
```typescript
string[] // Array of 3-5 headline strings
```

## Service 2: OpenAI Service

**File:** `src/services/openaiService.ts`

### Purpose
Generate Trump-style tweets based on current news headlines.

### Key Components

**System Prompt:**
```
You are Donald Trump writing tweets. Use his distinctive style:
- Confident and assertive tone
- Short, punchy sentences
- Occasional use of caps for EMPHASIS
- Strong opinions and reactions
- His characteristic phrases and speaking patterns

Keep tweets under 280 characters. Make them sound authentically Trump.
```

**User Prompt Template:**
```
Based on these current news headlines:
{headlines}

Write ONE tweet reacting to the most interesting story in Trump's voice.
```

### Features
- Use GPT-4 or GPT-4-turbo for best quality
- Temperature: 0.8-0.9 (creative but consistent)
- Max tokens: 100 (more than enough for 280 chars)
- Parse and validate response length
- Retry logic if response is too long or inappropriate

### Quality Checks
- Tweet must be under 280 characters
- Must not be empty or generic
- Should reference specific news topic
- Maintain Trump's voice

## Service 3: Twitter Service

**File:** `src/services/twitterService.ts`

### Purpose
Post generated tweets to X (Twitter) account.

### Authentication
Uses Twitter API v2 with OAuth 1.0a:
- API Key + Secret
- Access Token + Secret

### Features
- Initialize Twitter client with credentials
- Post tweet with error handling
- Respect rate limits (50 tweets/24h)
- Return tweet URL on success
- Detailed error messages for failures

### Error Handling
Common errors to catch:
- Authentication failures
- Rate limit exceeded
- Duplicate content detection
- Network timeouts

### Dry Run Mode
Add optional parameter to log tweet without posting:
```typescript
postTweet(content: string, dryRun: boolean = false)
```

## Integration Notes

### News → OpenAI Flow
1. Fetch headlines from News Service
2. Join headlines with numbering
3. Pass to OpenAI with Trump system prompt
4. Return generated tweet

### Variety Logic
Track recent topics in storage to avoid repetition:
- Extract key topics from headlines (AI can help)
- Compare with last 10 tweets
- If too similar, fetch different headlines or regenerate

## Testing Checklist

- [ ] News service returns 3-5 valid headlines
- [ ] OpenAI service generates Trump-style tweets
- [ ] Generated tweets are under 280 characters
- [ ] Twitter service successfully authenticates
- [ ] Twitter service can post tweets (dry run mode)
- [ ] Error handling works for all services
- [ ] Rate limits are respected

## Troubleshooting

**News Service Issues:**
- Verify API key is valid
- Check request quota (100/day limit)
- Ensure network connectivity
- Validate response JSON structure

**OpenAI Issues:**
- Confirm API key has credits
- Check model availability (gpt-4)
- Verify prompt isn't triggering content filters
- Ensure response parsing handles all formats

**Twitter Issues:**
- Verify all 4 credentials are correct
- Check account has posting permissions (Elevated access)
- Ensure tweet content isn't flagged as spam
- Check for duplicate content errors

## Example Output

**News Headlines:**
```
1. "Biden announces new climate initiative"
2. "Stock market reaches record high"
3. "Supreme Court hears major case"
```

**Generated Tweet:**
```
Stock market SOARING to all-time highs! Economy is doing GREAT despite 
what the fake news says. We need to keep America winning! 🇺🇸
```

## Next Steps

Once Phase 2 is complete, proceed to **03-integration.md** to build the main orchestrator.


