# GitHub Actions Automation Setup

Your bot is already pushed to: **https://github.com/ohadstoller/trump-or-not**

The GitHub Actions workflows are already in your repo. Now you just need to configure secrets and test!

---

## Step 1: Add GitHub Secrets (REQUIRED)

GitHub Actions needs your API keys to run the bot. Add them as secrets:

### 1.1 Navigate to Secrets

1. Go to https://github.com/ohadstoller/trump-or-not/settings/secrets/actions
2. Or manually:
   - Go to your repo: https://github.com/ohadstoller/trump-or-not
   - Click **Settings** (top menu)
   - Click **Secrets and variables** → **Actions** (left sidebar)

### 1.2 Add Each Secret

Click **"New repository secret"** and add these **5 required secrets**:

| Secret Name | Where to Find the Value | Required? |
|------------|------------------------|-----------|
| `OPENAI_API_KEY` | Your `.env` file locally | ✅ Required |
| `TWITTER_API_KEY` | Your `.env` file locally | ✅ Required |
| `TWITTER_API_SECRET` | Your `.env` file locally | ✅ Required |
| `TWITTER_ACCESS_TOKEN` | Your `.env` file locally | ✅ Required |
| `TWITTER_ACCESS_SECRET` | Your `.env` file locally | ✅ Required |
| `NEWS_API_KEY` | Your `.env` file (optional) | ⚠️ Optional |

### 1.3 How to Add Each Secret

For each secret:

1. Click **"New repository secret"**
2. **Name**: Enter exact name (e.g., `OPENAI_API_KEY`)
3. **Secret**: Paste the value from your local `.env` file
4. Click **"Add secret"**
5. Repeat for all secrets

**Pro Tip:** Open your `.env` file and copy/paste each value directly.

---

## Step 2: Verify GitHub Actions is Enabled

1. Go to https://github.com/ohadstoller/trump-or-not/actions
2. If you see a message **"Workflows have been disabled"**, click **"I understand my workflows, go ahead and enable them"**
3. You should now see two workflows:
   - ✅ **Post Trump Tweet** (the main bot)
   - ✅ **Test Build** (CI/CD tests)

---

## Step 3: Test the Bot Manually (First Run)

Let's do a manual test run before the automation kicks in:

### 3.1 Trigger Manual Run

1. Go to https://github.com/ohadstoller/trump-or-not/actions
2. Click **"Post Trump Tweet"** in the left sidebar
3. You'll see a blue button **"Run workflow"** (top right)
4. Click it, select branch **"main"**, and click **"Run workflow"**

### 3.2 Watch it Run

- The workflow will start immediately
- Takes about 30-60 seconds
- Click on the workflow run to see live logs

### 3.3 Check Results

**If Successful (Green ✅):**
- Expand each step to see logs
- Look for: "Posted tweet successfully: https://twitter.com/..."
- **Go check your Twitter account @probablynot403!**
- You should see a new Trump-style tweet! 🎉

**If Failed (Red ❌):**
- Click on the failed run
- Click on the **"post-tweet"** job
- Expand **"Post tweet"** step
- Check the error message

Common errors and fixes:

| Error | Fix |
|-------|-----|
| "Configuration validation failed" | Double-check all 5 secrets are added correctly |
| "OPENAI_API_KEY is required" | Add the `OPENAI_API_KEY` secret |
| "Twitter authentication failed" | Verify Twitter secrets are correct |
| Rate limit errors | Wait a few minutes and try again |

---

## Step 4: Verify Automated Schedule

Once the manual test works, your bot will automatically run on schedule!

### Schedule (EST Times):
- **9:00 AM** - Morning tweet
- **12:00 PM** - Lunch tweet  
- **3:00 PM** - Afternoon tweet
- **6:00 PM** - Evening tweet
- **9:00 PM** - Night tweet

**That's 5 tweets per day!**

### How to Verify Schedule:

1. Go to https://github.com/ohadstoller/trump-or-not/actions
2. Look for workflow runs with ⏱️ clock icon (scheduled)
3. Check they run at the expected times

**Note:** GitHub Actions cron can be delayed by 5-15 minutes during busy times. This is normal.

---

## Step 5: Monitor Your Bot

### Check Workflow History

View all runs: https://github.com/ohadstoller/trump-or-not/actions

- ✅ Green checkmark = Success
- ❌ Red X = Failed  
- 🟡 Yellow dot = Running

### Check Your Twitter

Your bot posts to: **https://twitter.com/probablynot403**

### Enable Notifications (Optional)

Get notified when workflows fail:

1. Go to https://github.com/ohadstoller/trump-or-not/settings
2. Look for **"Notifications"** or configure via your GitHub profile settings
3. Or use GitHub mobile app for real-time notifications

---

## Understanding the Workflow

### What Happens Each Run:

```
1. GitHub Actions starts (triggered by schedule or manual)
2. Checks out your code
3. Installs Node.js and dependencies
4. Runs the bot:
   - Fetches current news headlines
   - Generates Trump-style tweet via GPT-4
   - Posts to Twitter @probablynot403
   - Updates state.json with tweet history
5. Commits state.json back to repo (tracks history)
6. Completes successfully
```

### View Detailed Logs:

1. Click any workflow run
2. Click **"post-tweet"** job
3. Expand each step to see:
   - News headlines fetched
   - Generated tweet content
   - Twitter post confirmation
   - Tweet URL

---

## Customization Options

### Change Posting Frequency

Edit `.github/workflows/post-tweet.yml`:

```yaml
schedule:
  # Currently: 9am, 12pm, 3pm, 6pm, 9pm EST (5x daily)
  - cron: '0 14,17,20,23,2 * * *'
  
  # Want more? Add times (in UTC, EST+5):
  # For 8x daily every 3 hours:
  - cron: '0 12,15,18,21,0,3 * * *'
```

After editing, commit and push:
```bash
git add .github/workflows/post-tweet.yml
git commit -m "chore: adjust posting schedule"
git push
```

### Adjust Tweet Style

Edit `src/services/openaiService.ts` to modify the Trump personality prompt.

### Change News Sources

Edit `src/services/newsService.ts` to add more RSS feeds or change categories.

---

## State Management

The bot tracks tweet history in `data/state.json`:

- **Prevents repetitive topics**: Compares new tweets with recent ones
- **Tracks last run time**: For debugging
- **Auto-committed**: After each successful run

You can view history at: https://github.com/ohadstoller/trump-or-not/blob/main/data/state.json

---

## Troubleshooting

### Secrets Not Working

If secrets aren't working:

1. Go to https://github.com/ohadstoller/trump-or-not/settings/secrets/actions
2. Verify all 5 secrets are listed
3. Delete and re-add any suspect secrets (no trailing spaces!)
4. Try manual run again

### Workflow Not Scheduling

- Check workflow file has correct cron syntax
- Ensure Actions are enabled (not disabled)
- Remember: GitHub may delay scheduled runs by 5-15 min

### "Permission denied" Errors

The workflow needs to commit state.json:

1. Go to https://github.com/ohadstoller/trump-or-not/settings/actions
2. Scroll to **"Workflow permissions"**
3. Ensure **"Read and write permissions"** is selected
4. Save if you made changes

### Rate Limits

- **OpenAI**: Check usage at https://platform.openai.com/usage
- **Twitter**: Max 50 tweets/day (bot does 5 = safe!)
- **NewsAPI**: 100 requests/day (bot uses ~12 = safe)

---

## Testing Checklist

- [ ] All 5 GitHub Secrets added
- [ ] GitHub Actions enabled
- [ ] Manual workflow run successful
- [ ] Tweet appeared on Twitter @probablynot403
- [ ] State.json updated in repo
- [ ] Scheduled runs working
- [ ] Notifications configured (optional)

---

## Quick Links

- **Your Repository**: https://github.com/ohadstoller/trump-or-not
- **GitHub Actions**: https://github.com/ohadstoller/trump-or-not/actions
- **Secrets Settings**: https://github.com/ohadstoller/trump-or-not/settings/secrets/actions
- **Your Twitter**: https://twitter.com/probablynot403
- **Workflow File**: https://github.com/ohadstoller/trump-or-not/blob/main/.github/workflows/post-tweet.yml

---

## Success Criteria

✅ Your bot is working when:

1. Manual workflow run completes successfully
2. Tweet appears on @probablynot403
3. Workflow runs automatically on schedule
4. Tweet history updates in state.json
5. No error notifications

---

## What to Expect

Once set up, your bot will:

- 🤖 Post 5 Trump-style tweets daily
- 📰 Based on real current news
- 🎯 Avoid repetitive topics automatically
- 💾 Track history for variety
- ✅ Run completely hands-free
- 💰 Cost ~$2-3/month

**Enjoy your automated Trump bot!** 🇺🇸

---

## Need Help?

- Check workflow logs in Actions tab
- Review `TROUBLESHOOTING.md` 
- Check `TWITTER_SETUP.md` for Twitter issues
- Look at detailed docs in `docs/` folder

