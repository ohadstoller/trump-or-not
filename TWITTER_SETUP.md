# Twitter/X Integration Setup Guide

## Overview

To post tweets, you need a Twitter Developer account with **Elevated access** and API credentials.

---

## Step 1: Apply for Twitter Developer Account

### 1.1 Create Developer Account

1. Go to https://developer.twitter.com/
2. Click **"Sign up"** or **"Apply"**
3. Sign in with your Twitter account (the one you want to post from)
4. Complete the application:
   - **Use case:** Automation/Bot
   - **Description:** "AI-powered bot that generates and posts automated tweets based on current news"
   - **Will you make Twitter content/data available to government?** No
   - Accept terms and conditions

### 1.2 Request Elevated Access (CRITICAL!)

⚠️ **Free tier doesn't allow posting tweets!** You MUST get Elevated access.

1. Go to your Developer Portal: https://developer.twitter.com/en/portal/dashboard
2. Look for **"Elevated"** access option
3. Click **"Apply for Elevated"**
4. Fill out the form:
   - **Use case:** Building a bot/automation
   - **Description:** "Creating an AI-powered bot that generates Trump-style satirical tweets based on current news headlines. The bot will post 5-6 times daily."
   - **Number of tweets:** ~5-10 per day
   - **Will you display tweets?** Yes, on Twitter
5. Submit and wait for approval (usually 1-2 days, sometimes instant)

---

## Step 2: Create Twitter App

Once you have Elevated access:

1. Go to **Developer Portal** → **Projects & Apps**
2. Click **"+ Create App"** or use existing app
3. **App name:** `trump-or-not-bot` (must be unique)
4. Note down your **API Key** and **API Secret Key** (save these!)

### 2.1 Set App Permissions

**CRITICAL:** Must have **Read and Write** permissions!

1. Click on your app
2. Go to **Settings** tab
3. Scroll to **User authentication settings**
4. Click **"Set up"**
5. **App permissions:** Select **"Read and Write"**
6. **Type of App:** **"Web App, Automated App or Bot"**
7. Fill in required fields:
   - **Callback URL:** `http://localhost:3000` (required but not used)
   - **Website URL:** Your GitHub repo or any URL
8. Save changes

### 2.2 Generate Access Tokens

1. Go to **Keys and tokens** tab
2. Under **"Access Token and Secret"**
3. Click **"Generate"**
4. Copy both:
   - **Access Token**
   - **Access Token Secret**
5. ⚠️ Save these immediately - you can't see them again!

---

## Step 3: Add Credentials to .env

You should now have 4 credentials. Add them to your `.env` file:

```env
# Twitter/X API v2 Configuration
TWITTER_API_KEY=your-api-key-here
TWITTER_API_SECRET=your-api-secret-here
TWITTER_ACCESS_TOKEN=your-access-token-here
TWITTER_ACCESS_SECRET=your-access-token-secret-here
```

### Example (with fake values):
```env
TWITTER_API_KEY=abcdefghijklmnopqrstuvwxy
TWITTER_API_SECRET=1234567890abcdefghijklmnopqrstuvwxyz1234567890abc
TWITTER_ACCESS_TOKEN=1234567890123456789-abcdefghijklmnopqrstuvwxy
TWITTER_ACCESS_SECRET=abcdefghijklmnopqrstuvwxyz1234567890abcdefgh
```

---

## Step 4: Test Twitter Integration Locally

### 4.1 Validate Credentials

```bash
cd /Users/ohadstoller/Development/trump-or-not
npm run validate
```

This will verify your Twitter credentials without posting anything.

Expected output:
```
✓ Twitter credentials verified
  Username: your-twitter-handle
  User ID: 1234567890
```

### 4.2 Test with Dry Run (Safe!)

Test the complete workflow without actually posting:

```bash
npm run dry-run
```

Expected output:
```
[INFO] DRY RUN - Would have posted tweet:
{
  "content": "Stock market SOARING to all-time highs! Economy is doing GREAT...",
  "length": 78
}
```

### 4.3 Post Your First Tweet! 🚀

When ready to post for real:

```bash
# First, turn off dry run in .env
# Change: DRY_RUN=true
# To:     DRY_RUN=false
```

Then run:

```bash
npm run dev
```

Or build and run:

```bash
npm run build
npm start
```

**Check your Twitter account!** You should see the tweet posted! 🎉

---

## Step 5: Add to GitHub Secrets (for Automation)

Once local testing works, add credentials to GitHub:

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** for each:

| Secret Name | Value |
|------------|-------|
| `TWITTER_API_KEY` | Your API Key |
| `TWITTER_API_SECRET` | Your API Secret |
| `TWITTER_ACCESS_TOKEN` | Your Access Token |
| `TWITTER_ACCESS_SECRET` | Your Access Token Secret |

---

## Step 6: Test on GitHub Actions

### Manual Test:

1. Push your code to GitHub
2. Go to **Actions** tab
3. Select **"Post Trump Tweet"** workflow
4. Click **"Run workflow"**
5. Wait 30-60 seconds
6. **Check your Twitter account for the tweet!**

### Check Logs:

Click on the workflow run to see:
- ✅ News fetched
- ✅ Tweet generated
- ✅ Posted to Twitter with URL
- ✅ State updated

---

## Troubleshooting

### Error: "403 Forbidden"

**Cause:** App doesn't have Read and Write permissions

**Fix:**
1. Go to Developer Portal → Your App → Settings
2. Set permissions to **"Read and Write"**
3. **Important:** Regenerate Access Token after changing permissions!
4. Update your `.env` with new tokens

### Error: "401 Unauthorized"

**Cause:** Invalid credentials or Elevated access not approved

**Fix:**
1. Verify all 4 credentials are correct (no extra spaces)
2. Check Elevated access is approved
3. Regenerate tokens if needed

### Error: "429 Rate Limit"

**Cause:** Too many tweets in 24 hours (limit: 50)

**Fix:** Wait and try again later. The bot posts 5x daily = well under limit.

### Error: "Duplicate content detected"

**Cause:** Twitter blocks identical tweets

**Fix:** The bot automatically varies content. If testing, wait 5 minutes or edit the prompt.

### Tweet Not Appearing on Twitter

**Possible causes:**
1. Using wrong Twitter account (check which account owns the API keys)
2. Dry run mode still enabled (`DRY_RUN=true`)
3. Tweet flagged by Twitter (check for sensitive content)

---

## Testing Checklist

- [ ] Twitter Developer account created
- [ ] Elevated access approved
- [ ] App created with Read and Write permissions
- [ ] All 4 API credentials generated
- [ ] Credentials added to `.env`
- [ ] `npm run validate` passes
- [ ] `npm run dry-run` works
- [ ] First tweet posted successfully locally
- [ ] Credentials added to GitHub Secrets
- [ ] GitHub Actions workflow posts tweet
- [ ] Tweet visible on Twitter account

---

## What the Bot Posts

The bot will:
- ✅ Fetch current news headlines
- ✅ Generate authentic Trump-style tweet using GPT-4
- ✅ Post to your Twitter account
- ✅ Track history to avoid repetition
- ✅ Run automatically 5x daily

### Example Generated Tweets:

```
Stock market reaching ALL TIME HIGHS! Despite what the Fake News says, 
the economy is doing TREMENDOUS! #Winning 🇺🇸

NASA going to Mars in 2026? FANTASTIC! American innovation at its best. 
Nobody does space like we do. MAKE AMERICA GREAT AGAIN!

Biden's climate plan costing taxpayers BILLIONS! We need SMART policy, 
not wasteful spending. America First! 💪
```

---

## API Rate Limits

Your bot is well within all limits:

| Service | Limit | Bot Usage | Status |
|---------|-------|-----------|--------|
| Twitter Posts | 50/day | 5/day | ✅ Safe (10%) |
| Twitter API Calls | 100k/day | ~50/day | ✅ Safe (0.05%) |
| OpenAI | Based on tier | 5-10 calls/day | ✅ Safe |
| NewsAPI | 100/day | ~12/day (cached) | ✅ Safe (12%) |

---

## Security Best Practices

✅ **Do:**
- Keep API keys secret
- Use `.env` for local development
- Use GitHub Secrets for production
- Enable 2FA on Twitter account
- Regenerate tokens if exposed

❌ **Don't:**
- Commit `.env` to git (already in `.gitignore`)
- Share API keys in screenshots
- Use same keys across projects
- Post sensitive/harmful content

---

## Next Steps

1. Complete Twitter Developer setup
2. Test locally with `npm run validate` and `npm run dry-run`
3. Post first test tweet
4. Deploy to GitHub with secrets
5. Let automation take over!

**Questions?** Check the logs in GitHub Actions or review `TROUBLESHOOTING.md`

---

**Ready to tweet? Let's go! 🚀**

