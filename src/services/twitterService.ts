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
      logger.error('Failed to post tweet to Twitter', error);
      
      // Try to extract detailed error information
      if (error && typeof error === 'object') {
        const apiError = error as any;
        
        // Log all available error details
        if (apiError.code) {
          logger.error(`Twitter API error code: ${apiError.code}`);
        }
        if (apiError.data) {
          logger.error('Twitter API error data:', apiError.data);
        }
        if (apiError.errors) {
          logger.error('Twitter API errors:', apiError.errors);
        }
        if (apiError.message) {
          logger.error(`Twitter API error message: ${apiError.message}`);
        }
        
        // Specific error handling
        if (apiError.code === 403) {
          logger.error('❌ Twitter 403 Forbidden - Check app permissions (must be Read+Write) and Elevated access');
        } else if (apiError.code === 401) {
          logger.error('❌ Twitter 401 Unauthorized - Check API credentials are correct');
        } else if (apiError.code === 429) {
          logger.error('❌ Twitter 429 Rate Limit - Too many requests, wait before retrying');
        }
      }

      throw new Error(`Failed to post tweet to Twitter: ${error}`);
    }
  }

  /**
   * Verify Twitter API credentials are valid
   */
  async verifyCredentials(): Promise<boolean> {
    try {
      logger.info('Verifying Twitter API credentials');
      
      const user = await this.client.v2.me();
      
      logger.info('✅ Twitter credentials verified successfully!', {
        username: user.data.username,
        userId: user.data.id,
        name: user.data.name,
      });

      return true;
    } catch (error) {
      logger.error('❌ Twitter credentials verification failed', error);
      
      // Log detailed error information
      if (error && typeof error === 'object') {
        const apiError = error as any;
        if (apiError.code === 403) {
          logger.error('403 Forbidden: Your app may not have Elevated access or Read+Write permissions');
        } else if (apiError.code === 401) {
          logger.error('401 Unauthorized: Invalid API credentials - check all 4 credentials are correct');
        }
        if (apiError.data) {
          logger.error('Error details:', apiError.data);
        }
      }
      
      return false;
    }
  }

}

// Export singleton instance
export const twitterService = new TwitterService();


