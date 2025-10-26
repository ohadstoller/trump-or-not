# Phase 4: Scheduling & Deployment

## Overview
Automate tweet posting using GitHub Actions to run the bot 6-8 times daily without manual intervention.

## GitHub Actions Setup

### Why GitHub Actions?

**Advantages:**
- Free for public repos (2000 minutes/month)
- No infrastructure to manage
- Built-in secret management
- Easy monitoring via GitHub UI
- Reliable cron scheduling

**Limitations:**
- Cron runs every 5 minutes minimum
- Not exact timing (can be delayed 1-10 minutes)
- Must commit code to GitHub

### Workflow File

**File:** `.github/workflows/post-tweet.yml`

### Schedule Strategy

**Target:** 6-8 tweets per day during active hours (9am-9pm EST)

**Cron Schedule Options:**

**Option A: Fixed times (Recommended)**
```yaml
# 9am, 12pm, 3pm, 6pm, 9pm EST = 2pm, 5pm, 8pm, 11pm, 2am UTC
- cron: '0 14,17,20,23 * * *'  # 4 times/day
- cron: '0 14,16,18,20,22 * * *'  # 5 times/day  
```

**Option B: More frequent**
```yaml
# Every 2-3 hours during day
- cron: '0 14,16,18,20,22,0 * * *'  # 6 times/day
```

### Workflow Components

1. **Trigger:** Cron schedule + manual dispatch
2. **Environment:** Node.js 20
3. **Steps:**
   - Checkout code
   - Setup Node.js
   - Install dependencies
   - Run bot (`npm start`)
4. **Secrets:** Load from GitHub Secrets

### Manual Dispatch

Include `workflow_dispatch` for manual testing:
```yaml
on:
  schedule:
    - cron: '0 14,17,20,23 * * *'
  workflow_dispatch:  # Allows manual runs
```

## GitHub Secrets Configuration

### Required Secrets

Navigate to: **Repository → Settings → Secrets → Actions**

Add the following secrets:

1. `OPENAI_API_KEY` - OpenAI API key
2. `TWITTER_API_KEY` - Twitter API key
3. `TWITTER_API_SECRET` - Twitter API secret
4. `TWITTER_ACCESS_TOKEN` - Twitter access token
5. `TWITTER_ACCESS_SECRET` - Twitter access token secret
6. `NEWS_API_KEY` - NewsAPI key (if using)

### Optional Secrets

- `NODE_ENV` - Set to "production"
- `TIMEZONE` - Set to "America/New_York"

### Security Notes

- Never log secrets in workflow
- Never commit secrets to code
- Rotate keys if exposed
- Use minimal permissions for tokens

## State Management in GitHub Actions

### Challenge
GitHub Actions are stateless - each run starts fresh.

### Solution Options

**Option A: Git-based state (Simple)**
- Store `state.json` in repo
- Commit after each run
- Bot pulls latest state each time

**Implementation:**
```yaml
- name: Commit state changes
  run: |
    git config user.name "Trump Bot"
    git config user.email "bot@trumpornot.com"
    git add data/state.json
    git diff --quiet && git diff --staged --quiet || \
      git commit -m "chore: update bot state" && git push
```

**Option B: GitHub Gist (Better)**
- Store state in private Gist
- Update via API
- No repo pollution

**Option C: External storage (Overkill)**
- Use S3, Firebase, or database
- Adds complexity and cost

**Recommendation:** Start with Option A (Git-based), upgrade to Gist if needed.

## Deployment Steps

### 1. Prepare Repository

```bash
# Initialize git if not done
git init
git add .
git commit -m "feat: initial Trump bot implementation"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/trump-or-not.git
git branch -M main
git push -u origin main
```

### 2. Configure Secrets

- Go to repository Settings → Secrets
- Add all 6 required secrets
- Test each secret is saved correctly

### 3. Enable Actions

- GitHub Actions should be enabled by default
- Verify in repository Settings → Actions

### 4. Test Workflow

**Manual Test:**
1. Go to Actions tab
2. Select "Post Trump Tweet" workflow
3. Click "Run workflow"
4. Select branch (main)
5. Run and monitor logs

**First Run Checklist:**
- [ ] Workflow triggers successfully
- [ ] Dependencies install without errors
- [ ] Secrets load correctly
- [ ] News headlines fetch
- [ ] Tweet generates
- [ ] Twitter post succeeds (or dry-run logs)
- [ ] State file updates
- [ ] Workflow completes (green check)

### 5. Monitor Initial Runs

- Check first 2-3 scheduled runs
- Verify timing is reasonable
- Monitor Twitter account for posts
- Review logs for any warnings
- Confirm state persists between runs

## Monitoring & Maintenance

### GitHub Actions Dashboard

Monitor via Actions tab:
- Green check = success
- Red X = failure
- Yellow dot = in progress

### Logs

Click on any workflow run to see:
- Full console output
- Error messages
- Execution time
- Resource usage

### Notifications

Configure notifications:
- Email on failure
- Slack webhook (optional)
- GitHub mobile app

### Regular Maintenance

**Weekly:**
- Check for failed runs
- Review generated tweets quality
- Verify API quotas

**Monthly:**
- Rotate API keys (security best practice)
- Review and clean tweet history
- Update dependencies

## Troubleshooting

### Workflow Not Running

**Check:**
- Cron syntax is correct
- Actions are enabled
- Repository is public (or has Actions minutes)
- No syntax errors in YAML

### Authentication Failures

**Check:**
- All secrets are set correctly
- No trailing spaces in secret values
- API keys haven't expired
- Twitter account has posting permissions

### State Not Persisting

**Check:**
- Git commit/push permissions
- State file path is correct
- Commit step has proper credentials
- No git conflicts

### Rate Limits

**Check:**
- Not running too frequently
- OpenAI usage within quota
- Twitter daily tweet limit
- NewsAPI request count

## Scaling & Optimization

### If You Want More Tweets

- Increase cron frequency
- Add randomization to timing
- Ensure API quotas support it

### If You Want Better Quality

- Experiment with prompts
- Try different GPT models
- Add more news sources
- Implement feedback loop

### If You Want Lower Costs

- Use GPT-3.5-turbo instead of GPT-4
- Cache news longer
- Use RSS instead of NewsAPI
- Reduce posting frequency

## Success Metrics

Track these to measure bot health:

- **Uptime:** % of scheduled runs that succeed
- **Quality:** Tweet engagement (likes, retweets)
- **Variety:** Topic diversity score
- **Cost:** Monthly API spend
- **Reliability:** Days without failures

## Final Checklist

- [ ] GitHub Actions workflow created
- [ ] All secrets configured
- [ ] State management implemented
- [ ] Manual test run successful
- [ ] Scheduled runs executing
- [ ] Tweets appearing on Twitter
- [ ] Logs are clean and informative
- [ ] Error notifications set up
- [ ] Documentation updated
- [ ] README includes setup instructions

## Next Steps

**You're done!** 🎉

The bot should now run automatically 6-8 times per day, posting Trump-style tweets based on current news.

### Optional Enhancements

- Add tweet analytics tracking
- Implement A/B testing for prompts
- Create web dashboard for monitoring
- Add reply functionality
- Experiment with images/GIFs
- Build audience engagement features

### Support & Community

- Monitor GitHub Issues for problems
- Share improvements via Pull Requests
- Document lessons learned
- Help others build similar bots


