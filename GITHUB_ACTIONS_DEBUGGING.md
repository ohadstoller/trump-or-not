# GitHub Actions Debugging Guide

## 🔍 How to View Detailed Logs in GitHub Actions

When a workflow fails with "exit code 1", you need to dig into the logs to see what went wrong.

### Step-by-Step: View Detailed Logs

1. **Go to Actions Tab**
   - Navigate to: https://github.com/ohadstoller/trump-or-not/actions

2. **Click on the Failed Workflow Run**
   - You'll see a list of workflow runs with status icons:
     - ❌ Red X = Failed
     - ✅ Green check = Success
     - 🟡 Yellow dot = Running
   - Click on the failed run (usually at the top)

3. **Click on the Job Name**
   - You'll see a job called **"post-tweet"** with a red X
   - Click on it to expand

4. **View Individual Steps**
   - You'll see all the steps:
     - ✅ Checkout code
     - ✅ Setup Node.js
     - ✅ Install dependencies
     - ✅ Build project
     - ❓ Debug environment variables (NEW!)
     - ❌ Post tweet (where it likely fails)
   
5. **Expand the Failed Step**
   - Click on the red X step to see full logs
   - This shows you the exact error message

6. **Look for Error Messages**
   - Search for:
     - `[ERROR]` - Application errors
     - `Error:` - JavaScript errors
     - `exit code 1` - Generic failure
     - Missing credentials messages

---

## 🛠️ New Debug Features

I've added a **Debug Environment Variables** step that runs BEFORE posting tweets.

### What It Shows:

```
✅ NODE_ENV: production
✅ DRY_RUN: false
✅ OPENAI_API_KEY: ✅ SET (164 chars, starts with: sk-proj-...)
✅ TWITTER_API_KEY: ✅ SET (25 chars, starts with: GVeYSRnF...)
✅ TWITTER_API_SECRET: ✅ SET (50 chars, starts with: 2TwGTgOO...)
✅ TWITTER_ACCESS_TOKEN: ✅ SET (50 chars, starts with: 19825465...)
✅ TWITTER_ACCESS_SECRET: ✅ SET (45 chars, starts with: J3RBU44s...)
✅ NEWS_API_KEY: ✅ SET (36 chars, starts with: pub_a845...)
```

### What to Look For:

**❌ If you see any "NOT SET":**
- That secret is missing in GitHub
- Go to: https://github.com/ohadstoller/trump-or-not/settings/secrets/actions
- Add the missing secret

**❌ If you see "TOO SHORT (invalid)":**
- The secret value is incorrect or incomplete
- Delete and re-add the secret with the correct value

**✅ If all show "SET":**
- All credentials are configured correctly
- The error is in the application code, not secrets

---

## 🐛 Common Errors & Solutions

### Error: "OPENAI_API_KEY is required"

**Cause:** Secret not configured in GitHub

**Solution:**
1. Go to https://github.com/ohadstoller/trump-or-not/settings/secrets/actions
2. Click "New repository secret"
3. Name: `OPENAI_API_KEY`
4. Value: Your OpenAI key from local `.env`
5. Click "Add secret"

### Error: "Twitter authentication failed"

**Cause:** Twitter credentials are missing or invalid

**Solution:**
1. Check all 4 Twitter secrets are added:
   - `TWITTER_API_KEY`
   - `TWITTER_API_SECRET`
   - `TWITTER_ACCESS_TOKEN`
   - `TWITTER_ACCESS_SECRET`
2. Verify they match your local `.env` file
3. Make sure there are no extra spaces or line breaks

### Error: "Request failed with status code 401"

**Cause:** API key is invalid or expired

**Solution:**
- **For OpenAI:** Check your key at https://platform.openai.com/api-keys
- **For Twitter:** Regenerate tokens in Twitter Developer Portal
- **For NewsAPI:** This is expected and harmless (bot uses RSS fallback)

### Error: "OpenAI API failed: Rate limit exceeded"

**Cause:** You've hit OpenAI usage limits

**Solution:**
- Check usage at https://platform.openai.com/usage
- Add more credits to your account
- Wait for rate limit to reset (usually 1 minute)

### Error: "npm ERR! code ENOENT"

**Cause:** Missing file or build issue

**Solution:**
- Usually fixed by our workflow (we use `npm install` now)
- If persists, check the build step succeeded

---

## 📊 Monitoring Workflow Status

### Email Notifications

GitHub automatically emails you when workflows fail. To configure:

1. Go to https://github.com/settings/notifications
2. Ensure "Actions" is enabled
3. Choose email or web notifications

### GitHub Mobile App

Install the GitHub mobile app to get push notifications for:
- ✅ Successful workflow runs
- ❌ Failed workflow runs
- Real-time progress updates

### Manual Checks

Visit https://github.com/ohadstoller/trump-or-not/actions daily to:
- Verify scheduled runs are working
- Check success rate
- Review generated tweets

---

## 🧪 Testing Locally vs. GitHub Actions

### Test Locally First

Before debugging GitHub Actions, always test locally:

```bash
cd /Users/ohadstoller/Development/trump-or-not

# Check environment variables
npm run debug:env

# Test with dry run
DRY_RUN=true npm start

# Test actual posting (careful!)
DRY_RUN=false npm start
```

**If local works but GitHub fails:**
- Issue is with GitHub Secrets configuration
- Use the debug step in workflow to identify missing secrets

**If local fails too:**
- Issue is with your code or API keys
- Fix locally first, then commit and push

---

## 🔧 Advanced Debugging

### Add More Logging

If you need more detailed logs, edit `src/index.ts` or service files to add:

```typescript
logger.info('Debug checkpoint', { someVariable });
```

Then commit, push, and run the workflow again.

### Enable Step Debugging

To add more debug steps to the workflow, edit `.github/workflows/post-tweet.yml`:

```yaml
- name: Check Node version
  run: node --version

- name: List files
  run: ls -la

- name: Show environment (safe)
  run: env | grep -E "NODE_ENV|DRY_RUN" || true
```

### Download Logs

You can download complete logs:
1. Go to the failed workflow run
2. Click the ⚙️ gear icon (top right)
3. Select "Download log archive"
4. Extract and search the `.txt` file

---

## 📝 Debug Checklist

When a workflow fails:

- [ ] Go to Actions tab
- [ ] Click on failed run
- [ ] Click on "post-tweet" job
- [ ] Check "Debug environment variables" step
  - [ ] All secrets show ✅ SET?
  - [ ] Any ❌ NOT SET or TOO SHORT?
- [ ] Check "Post tweet" step
  - [ ] What's the exact error message?
  - [ ] Is it a credential issue?
  - [ ] Is it an API issue?
- [ ] Test locally with same settings
- [ ] Compare local .env with GitHub Secrets
- [ ] Fix the issue and re-run workflow

---

## 🚀 Quick Fix Commands

### Rebuild and Push

```bash
cd /Users/ohadstoller/Development/trump-or-not
npm run build
git add .
git commit -m "fix: debugging improvements"
git push
```

### Test Debug Script

```bash
npm run debug:env
```

Should show all ✅ if configured correctly.

### Manual Workflow Trigger

1. Go to https://github.com/ohadstoller/trump-or-not/actions
2. Click "Post Trump Tweet"
3. Click "Run workflow"
4. Select "main"
5. Click "Run workflow"
6. Watch the logs in real-time

---

## 📞 Getting Help

If you're still stuck:

1. **Check the workflow logs** - 90% of issues are visible there
2. **Compare with local** - Does it work locally?
3. **Verify secrets** - Are all 5 secrets added correctly?
4. **Check API status** - Are OpenAI/Twitter APIs working?
5. **Review recent changes** - Did you change code recently?

---

## ✅ Success Indicators

Your workflow is working correctly when you see:

```
✅ Checkout code (completed)
✅ Setup Node.js (completed)
✅ Install dependencies (completed)
✅ Build project (completed)
✅ Debug environment variables (completed)
  All required environment variables are set!
✅ Post tweet (completed)
  Posted tweet successfully: https://twitter.com/...
✅ Commit state changes (completed)
```

And a new tweet appears on: https://twitter.com/probablynot403

---

**Happy debugging!** 🐛🔧

