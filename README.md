# Trump or Not 🇺🇸

An AI-powered Twitter bot that generates Trump-style tweets based on current news headlines.

## Overview

This bot uses OpenAI's GPT-4 to generate authentic-sounding Donald Trump tweets based on real-time news. It posts automatically 6-8 times daily via GitHub Actions.

## Features

- 🤖 AI-generated Trump-style tweets using GPT-4
- 📰 Real-time news integration (NewsAPI or RSS)
- 🐦 Automated Twitter posting
- 📅 Scheduled via GitHub Actions (6-8 tweets/day)
- 🎯 Variety logic to avoid repetitive topics
- 💾 State management to track tweet history
- 🧪 Dry-run mode for testing

## Tech Stack

- **Runtime:** Node.js 20+ with TypeScript
- **APIs:** OpenAI, Twitter API v2, NewsAPI
- **Scheduler:** GitHub Actions
- **Storage:** JSON file state management

## Setup

### Prerequisites

- Node.js 20 or higher
- OpenAI API key
- Twitter Developer account with Elevated API access
- NewsAPI key (optional - can use RSS instead)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trump-or-not.git
cd trump-or-not
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Build the project:
```bash
npm run build
```

### Configuration

Edit `.env` with your API credentials:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
TWITTER_API_KEY=xxxxxxxxxxxxxxxxxxxx
TWITTER_API_SECRET=xxxxxxxxxxxxxxxxxxxx
TWITTER_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxx
TWITTER_ACCESS_SECRET=xxxxxxxxxxxxxxxxxxxx
NEWS_API_KEY=xxxxxxxxxxxxxxxxxxxx
```

## Usage

### Development

Run locally with TypeScript:
```bash
npm run dev
```

### Dry Run Mode

Test without posting to Twitter:
```bash
npm run dry-run
```

### Production

Build and run:
```bash
npm run build
npm start
```

## Deployment

See [docs/04-deployment.md](docs/04-deployment.md) for detailed deployment instructions.

### Quick Deploy to GitHub Actions

1. Push code to GitHub
2. Add secrets in repository Settings → Secrets → Actions
3. Enable GitHub Actions
4. The bot will run automatically on schedule

## Documentation

Detailed implementation guides:

- [Phase 1: Setup & Configuration](docs/01-setup.md)
- [Phase 2: Core Services](docs/02-services.md)
- [Phase 3: Integration & Testing](docs/03-integration.md)
- [Phase 4: Deployment](docs/04-deployment.md)

## Project Structure

```
trump-or-not/
├── src/
│   ├── services/        # API integrations
│   ├── utils/           # Utilities (logger, storage)
│   ├── config/          # Configuration management
│   └── index.ts         # Main orchestrator
├── data/
│   └── state.json       # Bot state & history
├── docs/                # Implementation guides
├── .github/workflows/   # GitHub Actions
└── package.json
```

## Cost Estimate

- **OpenAI:** ~$2-3/month (GPT-4-turbo)
- **Twitter API:** Free (Elevated access)
- **NewsAPI:** Free tier
- **GitHub Actions:** Free

**Total:** ~$3/month

## Security

- Never commit `.env` file
- Use GitHub Secrets for production
- Rotate API keys regularly
- Enable 2FA on all accounts

## License

MIT

## Contributing

Pull requests welcome! Please follow conventional commit messages.

## Disclaimer

This is a parody/satire bot. Generated tweets are fictional and for entertainment purposes only.


