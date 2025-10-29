# 🚀 GitHub Deployment Instructions

✅ **Git repository initialized and committed!**

Your code is ready to push to GitHub. Follow these steps to complete the deployment:

---

## Step 1: Create GitHub Repository

### Option A: Via GitHub Website (Easiest)

1. Go to https://github.com/new
2. **Repository name:** `trump-or-not`
3. **Description:** "AI-powered bot that generates Trump-style tweets based on current news"
4. **Visibility:** Choose Public or Private
5. ⚠️ **IMPORTANT:** Do NOT initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

### Option B: Via GitHub CLI (If Installed)

```bash
gh repo create trump-or-not --public --description "AI-powered Trump tweet bot" --source=. --remote=origin --push
```

---

## Step 2: Add GitHub Remote and Push

After creating the repository on GitHub, copy the repository URL and run:

```bash
cd /Users/ohadstoller/Development/trump-or-not

# Add GitHub as remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/trump-or-not.git

# Verify remote was added
git remote -v

# Push code to GitHub
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/ohadstoller/trump-or-not.git
git push -u origin main
```

---

## Step 3: Configure GitHub Secrets

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add each of these secrets:

### Required Secrets:

| Secret Name | Where to Get It | Example Format |
|------------|-----------------|----------------|
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys | `sk-proj-abc123...` |
| `TWITTER_API_KEY` | Twitter Developer Portal | Alphanumeric string |
| `TWITTER_API_SECRET` | Twitter Developer Portal | Alphanumeric string |
| `TWITTER_ACCESS_TOKEN` | Twitter Developer Portal | Alphanumeric string |
| `TWITTER_ACCESS_SECRET` | Twitter Developer Portal | Alphanumeric string |

### Optional Secret:

| Secret Name | Where to Get It | Notes |
|------------|-----------------|-------|
| `NEWS_API_KEY` | https://newsapi.org/ | Optional - bot uses RSS if not provided |

### How to Add Each Secret:

1. Click **"New repository secret"**
2. **Name:** Enter the secret name exactly as shown above (e.g., `OPENAI_API_KEY`)
3. **Secret:** Paste the actual API key value
4. Click **"Add secret"**
5. Repeat for all secrets

---

## Step 4: Enable GitHub Actions

1. Go to your repository's **Actions** tab
2. If prompted, click **"I understand my workflows, go ahead and enable them"**
3. You should see two workflows:
   - **Post Trump Tweet** (the main bot)
   - **Test Build** (CI/CD tests)

---

## Step 5: Test the Workflow

### Manual Test Run:

1. Go to **Actions** tab
2. Click **"Post Trump Tweet"** workflow on the left
3. Click **"Run workflow"** dropdown button (top right)
4. Select branch: **main**
5. Click **"Run workflow"** button
6. Wait for the workflow to complete (30-60 seconds)

### Check the Results:

- ✅ **Green checkmark** = Success! Check your Twitter account for the tweet
- ❌ **Red X** = Failed - click on the run to see error logs

### Common First-Run Issues:

| Issue | Solution |
|-------|----------|
| "Configuration validation failed" | Double-check all secrets are added correctly |
| "Twitter authentication failed" | Verify Twitter API has Elevated access approved |
| "OpenAI API failed" | Check API key is valid and has credits |

---

## Step 6: Monitor Automated Runs

Your bot is now scheduled to run automatically:

### Schedule (EST):
- 9:00 AM
- 12:00 PM
- 3:00 PM
- 6:00 PM
- 9:00 PM

### Monitoring:

- **GitHub Actions Dashboard:** See all runs at https://github.com/USERNAME/trump-or-not/actions
- **Twitter Account:** Check for posted tweets
- **Logs:** Click any workflow run to see detailed logs

---

## Quick Reference Commands

```bash
# Check git status
git status

# See commit history
git log --oneline

# Pull latest changes (after bot commits state.json)
git pull

# Check remote
git remote -v

# Push new changes
git add .
git commit -m "feat: description of changes"
git push
```

---

## Troubleshooting

### "Permission denied" when pushing

You may need to authenticate with GitHub:

```bash
# Option 1: Use HTTPS with Personal Access Token
# Generate token at: https://github.com/settings/tokens
# Use token as password when prompted

# Option 2: Use SSH
# Set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### "Remote already exists"

If you accidentally added the wrong remote:

```bash
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/USERNAME/trump-or-not.git
```

### Workflow Not Running

- Check workflow file syntax in `.github/workflows/post-tweet.yml`
- Ensure Actions are enabled in repository settings
- Verify repository is not archived

---

## Next Steps After Deployment

1. ✅ Monitor first few automated runs
2. ✅ Check tweet quality and engagement
3. ✅ Adjust prompts if needed (edit `src/services/openaiService.ts`)
4. ✅ Customize schedule if desired (edit `.github/workflows/post-tweet.yml`)
5. ✅ Have fun! 🎉

---

## Resources

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Twitter Developer Portal:** https://developer.twitter.com/
- **OpenAI Platform:** https://platform.openai.com/
- **Project Documentation:** See `docs/` folder

---

## Support

If you encounter issues:
- Check logs in GitHub Actions
- Review `TROUBLESHOOTING.md`
- Check detailed docs in `docs/` folder

**Happy tweeting!** 🇺🇸

