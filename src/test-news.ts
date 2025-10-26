/**
 * Test script for News Service
 * Run with: npm run test:news
 */

import { logger } from './utils/logger';
import { newsService } from './services/newsService';
import './config'; // Load config for validation

async function testNewsService(): Promise<void> {
  logger.info('=== Testing News Service ===');

  try {
    // Test fetching headlines
    logger.info('Fetching headlines...');
    const headlines = await newsService.getHeadlines();
    
    logger.info(`Successfully fetched ${headlines.length} headlines:`);
    headlines.forEach((headline, index) => {
      console.log(`  ${index + 1}. ${headline}`);
    });

    // Test formatted output
    logger.info('\nFormatted output for OpenAI:');
    const formatted = await newsService.getFormattedHeadlines();
    console.log(formatted);

    logger.info('\n=== News Service Test Passed ===');
    process.exit(0);
  } catch (error) {
    logger.error('=== News Service Test Failed ===', error);
    process.exit(1);
  }
}

testNewsService();


