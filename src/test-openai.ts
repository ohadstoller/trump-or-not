/**
 * Test script for OpenAI Service
 * Run with: npm run test:openai
 */

import { logger } from './utils/logger';
import { openaiService } from './services/openaiService';
import './config'; // Load config for validation

const SAMPLE_HEADLINES = `1. Biden announces new climate initiative worth $50 billion
2. Stock market reaches record high as tech stocks surge
3. Supreme Court to hear major case on social media regulation
4. Unemployment rate drops to lowest level in 50 years
5. NASA announces plans for Mars mission in 2026`;

async function testOpenAIService(): Promise<void> {
  logger.info('=== Testing OpenAI Service ===');

  try {
    // Test tweet generation
    logger.info('Generating Trump-style tweet from sample headlines...');
    const tweet = await openaiService.generateTweet(SAMPLE_HEADLINES);
    
    logger.info('Successfully generated tweet:', {
      length: tweet.length,
      content: tweet,
    });

    console.log('\n--- Generated Tweet ---');
    console.log(tweet);
    console.log(`--- Length: ${tweet.length}/280 ---\n`);

    // Test topic extraction
    logger.info('Extracting topics from tweet...');
    const topics = await openaiService.extractTopics(tweet);
    
    logger.info('Successfully extracted topics:', { topics });
    console.log('\n--- Extracted Topics ---');
    topics.forEach((topic, index) => {
      console.log(`  ${index + 1}. ${topic}`);
    });

    logger.info('\n=== OpenAI Service Test Passed ===');
    process.exit(0);
  } catch (error) {
    logger.error('=== OpenAI Service Test Failed ===', error);
    process.exit(1);
  }
}

testOpenAIService();


