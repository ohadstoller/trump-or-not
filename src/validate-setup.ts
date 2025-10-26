/**
 * Environment validation script
 * Run with: npx ts-node src/validate-setup.ts
 */

import { logger } from './utils/logger';
import { config } from './config';
import { twitterService } from './services/twitterService';
import { newsService } from './services/newsService';

async function validateSetup(): Promise<void> {
  logger.info('=== Validating Trump Bot Setup ===\n');

  let hasErrors = false;

  // Step 1: Check configuration
  logger.info('Step 1: Checking configuration...');
  try {
    const cfg = config;
    logger.info('✓ Configuration loaded successfully', {
      nodeEnv: cfg.app.nodeEnv,
      dryRun: cfg.app.dryRun,
      hasNewsApiKey: !!cfg.news.apiKey,
    });
  } catch (error) {
    logger.error('✗ Configuration failed', error);
    hasErrors = true;
  }

  // Step 2: Validate Twitter credentials
  logger.info('\nStep 2: Validating Twitter credentials...');
  try {
    const isValid = await twitterService.verifyCredentials();
    if (isValid) {
      logger.info('✓ Twitter credentials verified');
    } else {
      logger.error('✗ Twitter credentials invalid');
      hasErrors = true;
    }
  } catch (error) {
    logger.error('✗ Twitter verification failed', error);
    hasErrors = true;
  }

  // Step 3: Test news service
  logger.info('\nStep 3: Testing news service...');
  try {
    const headlines = await newsService.getHeadlines();
    logger.info(`✓ News service working (fetched ${headlines.length} headlines)`);
  } catch (error) {
    logger.error('✗ News service failed', error);
    hasErrors = true;
  }

  // Step 4: Check OpenAI (we'll just check the key is set, not make a call)
  logger.info('\nStep 4: Checking OpenAI configuration...');
  if (config.openai.apiKey && config.openai.apiKey.startsWith('sk-')) {
    logger.info('✓ OpenAI API key configured (format looks correct)');
  } else {
    logger.error('✗ OpenAI API key missing or invalid format');
    hasErrors = true;
  }

  // Final summary
  logger.info('\n=== Validation Complete ===');
  if (hasErrors) {
    logger.error('❌ Setup validation failed - please fix the errors above');
    process.exit(1);
  } else {
    logger.info('✅ All checks passed - your bot is ready to run!');
    logger.info('\nNext steps:');
    logger.info('1. Test locally: npm run dry-run');
    logger.info('2. Deploy to GitHub and configure secrets');
    logger.info('3. Run workflow manually to test');
    process.exit(0);
  }
}

validateSetup();


