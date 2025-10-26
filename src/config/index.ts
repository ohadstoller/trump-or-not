/**
 * Configuration management with environment variable validation
 */

import * as dotenv from 'dotenv';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

export interface AppConfig {
  openai: {
    apiKey: string;
  };
  twitter: {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessSecret: string;
  };
  news: {
    apiKey: string | undefined;
  };
  app: {
    nodeEnv: string;
    timezone: string;
    dryRun: boolean;
  };
}

class ConfigManager {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): AppConfig {
    return {
      openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
      },
      twitter: {
        apiKey: process.env.TWITTER_API_KEY || '',
        apiSecret: process.env.TWITTER_API_SECRET || '',
        accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
        accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
      },
      news: {
        apiKey: process.env.NEWS_API_KEY,
      },
      app: {
        nodeEnv: process.env.NODE_ENV || 'development',
        timezone: process.env.TIMEZONE || 'America/New_York',
        dryRun: process.env.DRY_RUN === 'true',
      },
    };
  }

  private validateConfig(): void {
    const errors: string[] = [];

    // Required OpenAI configuration
    if (!this.config.openai.apiKey) {
      errors.push('OPENAI_API_KEY is required');
    }

    // Required Twitter configuration
    if (!this.config.twitter.apiKey) {
      errors.push('TWITTER_API_KEY is required');
    }
    if (!this.config.twitter.apiSecret) {
      errors.push('TWITTER_API_SECRET is required');
    }
    if (!this.config.twitter.accessToken) {
      errors.push('TWITTER_ACCESS_TOKEN is required');
    }
    if (!this.config.twitter.accessSecret) {
      errors.push('TWITTER_ACCESS_SECRET is required');
    }

    // News API key is optional (can use RSS instead)
    if (!this.config.news.apiKey) {
      logger.warn('NEWS_API_KEY not set, will use RSS feed instead');
    }

    if (errors.length > 0) {
      logger.error('Configuration validation failed', errors);
      throw new Error(`Missing required environment variables:\n${errors.join('\n')}`);
    }

    logger.info('Configuration loaded successfully', {
      nodeEnv: this.config.app.nodeEnv,
      dryRun: this.config.app.dryRun,
      hasNewsApiKey: !!this.config.news.apiKey,
    });
  }

  getConfig(): AppConfig {
    return this.config;
  }
}

// Export singleton instance
export const configManager = new ConfigManager();
export const config = configManager.getConfig();


