# Troubleshooting Guide

## Issue: News Service Test Failed

### Problem 1: Wrong Command
**Error:** `pm: command not found`

**Solution:** Use `npm` not `pm`:
```bash
npm run test:news  # Correct
```

### Problem 2: Wrong NewsAPI Key Format

**Symptoms:**
- 401 Unauthorized error from NewsAPI
- API key starts with "pub_" 

**Cause:** The API key format `pub_a845169ee2a74d95b448869b21382882` is from a different service (MediaStack or similar), not NewsAPI.org.

**Solution:**

#### Option A: Get a Real NewsAPI.org Key (Free)

1. Go to https://newsapi.org/
2. Click "Get API Key" 
3. Sign up for a free account
4. Verify your email
5. Copy your API key (format: alphanumeric, no "pub_" prefix)
6. Add to `.env`:
   ```env
   NEWS_API_KEY=your-actual-newsapi-key-here
   ```

#### Option B: Use RSS Feed (No API Key Needed)

The bot works perfectly without NewsAPI using Google News RSS:

1. Remove or leave blank the `NEWS_API_KEY` in `.env`:
   ```env
   NEWS_API_KEY=
   ```
   Or remove the line entirely.

2. The bot will automatically use RSS fallback

3. Test it works:
   ```bash
   npm run test:news
   ```

### Current Status

✅ **RSS fallback is now working!** 

Your bot can fetch 4 headlines from Google News RSS without any API key.

## Recommended Approach

**For now: Use RSS (no API key needed)**

The RSS feed provides:
- Real-time news from Google News
- No signup required
- No quota limits
- Free forever

Later, you can add NewsAPI if you want:
- More control over news sources
- Category filtering
- Better formatting

## Testing Commands

All test commands (with proper spelling):

```bash
# Test news fetching
npm run test:news

# Test OpenAI tweet generation
npm run test:openai

# Validate full setup
npm run validate

# Test complete workflow (dry run - won't post)
npm run dry-run
```

## Next Steps

1. ✅ News service is working (using RSS)
2. Next: Test OpenAI service
3. Next: Test Twitter credentials
4. Then: Run full dry-run test

Run these commands in order:
```bash
# Make sure you have OpenAI API key in .env
npm run test:openai

# Validate all credentials
npm run validate

# Test full workflow
npm run dry-run
```

