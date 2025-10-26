/**
 * OpenAI Service - Generate Trump-style tweets using GPT-4
 */

import OpenAI from 'openai';
import { logger } from '../utils/logger';
import { config } from '../config';

const SYSTEM_PROMPT = `You are Donald Trump writing tweets. Use his distinctive style:
- Confident and assertive tone
- Short, punchy sentences
- Occasional use of caps for EMPHASIS
- Strong opinions and reactions
- His characteristic phrases and speaking patterns
- Sometimes uses "!" for excitement
- Occasionally mentions "tremendous", "bigly", "fake news", etc.

Keep tweets under 280 characters. Make them sound authentically Trump - bold, opinionated, and engaging.`;

const MAX_TWEET_LENGTH = 280;
const MAX_RETRIES = 3;

class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  /**
   * Generate a Trump-style tweet based on news headlines
   */
  async generateTweet(headlines: string): Promise<string> {
    const userPrompt = `Based on these current news headlines:

${headlines}

Write ONE tweet reacting to the most interesting or important story in Trump's voice. Make it engaging and authentic to his style.`;

    let attempts = 0;
    
    while (attempts < MAX_RETRIES) {
      attempts++;
      
      try {
        logger.info(`Generating tweet (attempt ${attempts}/${MAX_RETRIES})`);
        
        const response = await this.client.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.85,
          max_tokens: 100,
          top_p: 0.95,
        });

        const tweet = response.choices[0]?.message?.content?.trim();
        
        if (!tweet) {
          throw new Error('OpenAI returned empty response');
        }

        // Remove quotes if OpenAI wrapped the response
        const cleanedTweet = tweet.replace(/^["']|["']$/g, '');

        // Validate length
        if (cleanedTweet.length > MAX_TWEET_LENGTH) {
          logger.warn(`Generated tweet too long (${cleanedTweet.length} chars), retrying...`);
          continue;
        }

        // Validate content isn't generic
        if (this.isTooGeneric(cleanedTweet)) {
          logger.warn('Generated tweet too generic, retrying...');
          continue;
        }

        logger.info('Successfully generated tweet', {
          length: cleanedTweet.length,
          preview: cleanedTweet.substring(0, 50) + '...',
        });

        return cleanedTweet;
      } catch (error) {
        logger.error(`Failed to generate tweet (attempt ${attempts})`, error);
        
        if (attempts >= MAX_RETRIES) {
          throw new Error('Failed to generate tweet after maximum retries');
        }
        
        // Wait before retry (exponential backoff)
        await this.delay(1000 * attempts);
      }
    }

    throw new Error('Failed to generate valid tweet');
  }

  /**
   * Check if tweet is too generic
   */
  private isTooGeneric(tweet: string): boolean {
    const genericPhrases = [
      'i cannot',
      'i apologize',
      'as an ai',
      'i\'m sorry',
    ];

    const lowerTweet = tweet.toLowerCase();
    return genericPhrases.some(phrase => lowerTweet.includes(phrase));
  }

  /**
   * Extract key topics from a tweet for variety checking
   */
  async extractTopics(tweet: string): Promise<string[]> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Extract 2-3 key topics or subjects from the tweet. Return only the topics as a comma-separated list.',
          },
          {
            role: 'user',
            content: `Tweet: "${tweet}"\n\nTopics:`,
          },
        ],
        temperature: 0.3,
        max_tokens: 50,
      });

      const topicsText = response.choices[0]?.message?.content?.trim() || '';
      const topics = topicsText
        .split(',')
        .map(topic => topic.trim().toLowerCase())
        .filter(topic => topic.length > 0);

      logger.info('Extracted topics', { topics });
      return topics;
    } catch (error) {
      logger.warn('Failed to extract topics, using empty list', error);
      return [];
    }
  }

  /**
   * Helper to delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const openaiService = new OpenAIService();


