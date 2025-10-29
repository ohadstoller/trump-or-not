/**
 * Debug script to check environment variables (without exposing secrets)
 * Run with: npm run debug:env
 */

import * as dotenv from 'dotenv';
import { logger } from './utils/logger';

// Load .env file if in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

function maskSecret(value: string | undefined): string {
  if (!value) return '❌ NOT SET';
  if (value.length < 10) return '❌ TOO SHORT (invalid)';
  return `✅ SET (${value.length} chars, starts with: ${value.substring(0, 8)}...)`;
}

function checkEnv(): void {
  logger.info('=== Environment Variables Check ===\n');

  const checks = [
    { name: 'NODE_ENV', value: process.env.NODE_ENV || 'development', secret: false },
    { name: 'DRY_RUN', value: process.env.DRY_RUN || 'not set', secret: false },
    { name: 'OPENAI_API_KEY', value: process.env.OPENAI_API_KEY, secret: true },
    { name: 'TWITTER_API_KEY', value: process.env.TWITTER_API_KEY, secret: true },
    { name: 'TWITTER_API_SECRET', value: process.env.TWITTER_API_SECRET, secret: true },
    { name: 'TWITTER_ACCESS_TOKEN', value: process.env.TWITTER_ACCESS_TOKEN, secret: true },
    { name: 'TWITTER_ACCESS_SECRET', value: process.env.TWITTER_ACCESS_SECRET, secret: true },
    { name: 'NEWS_API_KEY', value: process.env.NEWS_API_KEY, secret: true },
  ];

  let hasErrors = false;

  checks.forEach(check => {
    const displayValue = check.secret ? maskSecret(check.value) : check.value;
    const status = check.value && (!check.secret || check.value.length >= 10) ? '✅' : '❌';
    
    console.log(`${status} ${check.name}: ${displayValue}`);
    
    if (status === '❌' && check.name !== 'NEWS_API_KEY') {
      hasErrors = true;
    }
  });

  logger.info('\n=== Summary ===');
  if (hasErrors) {
    logger.error('❌ Some required environment variables are missing or invalid!');
    process.exit(1);
  } else {
    logger.info('✅ All required environment variables are set!');
    process.exit(0);
  }
}

checkEnv();

