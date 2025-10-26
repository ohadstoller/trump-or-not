# Quick Setup Guide

Get your Trump Bot up and running in minutes!

## Prerequisites

- Node.js 20+ installed
- Git installed
- OpenAI API account with credits
- Twitter Developer account with Elevated API access
- (Optional) NewsAPI account

## Step 1: API Keys Setup

### OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. Add credits to your account (need ~$5 minimum)

### Twitter API Keys

1. Go to https://developer.twitter.com/
2. Apply for Elevated access (required for posting tweets)
3. Create a new app
4. Generate API Key, API Secret, Access Token, and Access Token Secret
5. Ensure your app has "Read and Write" permissions

### NewsAPI Key (Optional)

1. Go to https://newsapi.org/
2. Sign up for free account (100 requests/day)
3. Get your API key from dashboard

**Note:** If you skip NewsAPI, the bot will use Google News RSS instead (free, no key needed).

## Step 2: Local Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd trump-or-not

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your API keys
nano .env  # or use your preferred editor
```

### Configure .env

```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN=your-access-token
TWITTER_ACCESS_SECRET=your-access-secret
NEWS_API_KEY=your-newsapi-key-or-leave-blank
NODE_ENV=development
DRY_RUN=true
```

**Important:** Set `DRY_RUN=true` for testing!

## Step 3: Test Locally

### Test News Service

```bash
npm run test:news
```

Expected output: 5 current headlines from news sources.

### Test OpenAI Service

```bash
npm run test:openai
```

Expected output: A Trump-style tweet generated from sample headlines.

### Test Full Workflow (Dry Run)

```bash
npm run dry-run
```

This will:
- Fetch real news
- Generate real tweet
- NOT post to Twitter (safe!)
- Show what would be posted

### Test Actual Posting (Optional)

When ready to test real posting:

```bash
# Change DRY_RUN=false in .env first!
npm run build
npm start
```

**Warning:** This will post to Twitter! Only do this when ready.

## Step 4: GitHub Deployment

### Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial Trump bot setup"
git branch -M main
git remote add origin https://github.com/yourusername/trump-or-not.git
git push -u origin main
```

### Configure GitHub Secrets

1. Go to your repository on GitHub
2. Click Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret:

| Secret Name | Value |
|-------------|-------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `TWITTER_API_KEY` | Your Twitter API key |
| `TWITTER_API_SECRET` | Your Twitter API secret |
| `TWITTER_ACCESS_TOKEN` | Your Twitter access token |
| `TWITTER_ACCESS_SECRET` | Your Twitter access secret |
| `NEWS_API_KEY` | Your NewsAPI key (or leave blank) |

### Test GitHub Action

1. Go to Actions tab in your repository
2. Click on "Post Trump Tweet" workflow
3. Click "Run workflow" → "Run workflow"
4. Wait for it to complete
5. Check the logs for any errors
6. Check your Twitter account for the posted tweet!

## Step 5: Monitor & Maintain

### Check Workflow Status

- GitHub Actions tab shows all runs (green = success, red = failure)
- Click on any run to see detailed logs

### View Posted Tweets

- Check your Twitter account
- Logs will include tweet URLs

### Update State

- `data/state.json` tracks tweet history
- Automatically committed after each run
- Pull latest before testing locally: `git pull`

## Troubleshooting

### "Configuration validation failed"

- Check all required environment variables are set
- Ensure no extra spaces in `.env` values
- Verify API keys are correct and active

### "Twitter authentication failed"

- Ensure Elevated API access is approved
- Verify all 4 Twitter credentials are correct
- Check app has "Read and Write" permissions
- Try regenerating Access Token & Secret

### "OpenAI API failed"

- Check API key is valid
- Ensure you have credits in your account
- Verify you have access to GPT-4 (may need paid plan)

### "News API failed"

- If using NewsAPI, check key is valid and not over quota
- If no NewsAPI key, bot should fall back to RSS automatically
- Check internet connectivity

### Rate Limits

- OpenAI: Track usage at https://platform.openai.com/usage
- Twitter: 50 tweets per 24 hours (bot posts 5-6/day = safe)
- NewsAPI: 100 requests per day (bot caches for 5 min = safe)

## Cost Breakdown

- **OpenAI:** ~$0.01 per tweet × 5 tweets/day × 30 days = **~$1.50/month**
- **Twitter:** Free with Elevated access
- **NewsAPI:** Free tier sufficient
- **GitHub Actions:** Free for public repos

**Total:** ~$2-3/month

## Customization

### Change Posting Frequency

Edit `.github/workflows/post-tweet.yml`:

```yaml
schedule:
  - cron: '0 14,17,20,23,2 * * *'  # Modify these times
```

### Adjust Tweet Style

Edit `src/services/openaiService.ts`:
- Modify `SYSTEM_PROMPT` to change personality
- Adjust `temperature` for more/less creativity

### Change News Sources

Edit `src/services/newsService.ts`:
- Add more RSS feeds
- Change NewsAPI category/country
- Implement custom news sources

## Next Steps

- Monitor first few tweets for quality
- Adjust prompts if needed
- Engage with your audience!
- Have fun! 🎉

## Support

- Check documentation in `docs/` folder
- Review logs for detailed error messages
- Open GitHub issues for bugs or questions

---

**Enjoy your Trump Bot!** 🇺🇸


