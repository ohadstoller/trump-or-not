/**
 * Twitter Service - Post tweets to X (Twitter) using API v2
 */

import { TwitterApi } from 'twitter-api-v2';
import { logger } from '../utils/logger';
import { config } from '../config';

class TwitterService {
  private client: TwitterApi;

  constructor() {
    this.client = new TwitterApi({
      appKey: config.twitter.apiKey,
      appSecret: config.twitter.apiSecret,
      accessToken: config.twitter.accessToken,
      accessSecret: config.twitter.accessSecret,
    });
  }

  /**
   * Post a tweet to Twitter
   * @param content - The tweet content
   * @param dryRun - If true, log the tweet without posting
   * @returns Tweet URL if successful, null if dry run
   */
  async postTweet(content: string, dryRun: boolean = false): Promise<string | null> {
    // Validate tweet length
    if (content.length > 280) {
      throw new Error(`Tweet too long: ${content.length} characters (max 280)`);
    }

    if (content.length === 0) {
      throw new Error('Tweet content cannot be empty');
    }

    // Dry run mode - don't actually post
    if (dryRun || config.app.dryRun) {
      logger.info('DRY RUN - Would have posted tweet:', {
        content,
        length: content.length,
      });
      return null;
    }

    try {
      logger.info('Posting tweet to Twitter', {
        length: content.length,
        preview: content.substring(0, 50) + '...',
      });

      // Post the tweet using API v2
      const tweet = await this.client.v2.tweet(content);

      const tweetUrl = `https://twitter.com/i/web/status/${tweet.data.id}`;
      
      logger.info('Successfully posted tweet', {
        tweetId: tweet.data.id,
        url: tweetUrl,
      });

      return tweetUrl;
    } catch (error: unknown) {
      // Handle specific Twitter API errors
      if (this.isTwitterError(error)) {
        const errorData = error as { code?: number; data?: { detail?: string } };
        
        if (errorData.code === 403) {
          logger.error('Twitter authentication failed - check API credentials');
        } else if (errorData.code === 429) {
          logger.error('Twitter rate limit exceeded - wait before posting again');
        } else if (errorData.data?.detail?.includes('duplicate')) {
          logger.error('Duplicate tweet detected - content already posted');
        }
      }

      logger.error('Failed to post tweet to Twitter', error);
      throw new Error('Failed to post tweet to Twitter');
    }
  }

  /**
   * Verify Twitter API credentials are valid
   */
  async verifyCredentials(): Promise<boolean> {
    try {
      logger.info('Verifying Twitter API credentials');
      
      const user = await this.client.v2.me();
      
      logger.info('Twitter credentials verified', {
        username: user.data.username,
        userId: user.data.id,
      });

      return true;
    } catch (error) {
      logger.error('Twitter credentials verification failed', error);
      return false;
    }
  }

  /**
   * Type guard for Twitter API errors
   */
  private isTwitterError(error: unknown): error is { code?: number; data?: { detail?: string } } {
    return typeof error === 'object' && error !== null;
  }
}

// Export singleton instance
export const twitterService = new TwitterService();


