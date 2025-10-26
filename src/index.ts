/**
 * Main orchestrator - Coordinates the entire tweet generation and posting workflow
 */

import { logger } from './utils/logger';
import { storage } from './utils/storage';
import { config } from './config';
import { newsService } from './services/newsService';
import { openaiService } from './services/openaiService';
import { twitterService } from './services/twitterService';

/**
 * Check if new tweet topics are too similar to recent tweets
 */
function checkVariety(newTopics: string[], recentTopics: string[][]): boolean {
  if (recentTopics.length === 0) {
    return true; // No history, always good
  }

  // Compare with last 3 tweets
  const recentToCheck = recentTopics.slice(-3);
  
  for (const oldTopics of recentToCheck) {
    const overlap = newTopics.filter(topic => 
      oldTopics.some(oldTopic => 
        oldTopic.includes(topic) || topic.includes(oldTopic)
      )
    );

    const overlapPercentage = overlap.length / Math.max(newTopics.length, 1);
    
    if (overlapPercentage > 0.5) {
      logger.warn('Tweet too similar to recent post', {
        newTopics,
        oldTopics,
        overlapPercentage,
      });
      return false;
    }
  }

  return true;
}

/**
 * Main workflow execution
 */
async function main(): Promise<void> {
  logger.info('=== Trump Bot Starting ===', {
    nodeEnv: config.app.nodeEnv,
    dryRun: config.app.dryRun,
    timestamp: new Date().toISOString(),
  });

  try {
    // Step 1: Load previous state
    logger.info('Loading bot state');
    const state = storage.readState();
    
    logger.info('Current state loaded', {
      lastRun: state.lastRun,
      tweetHistorySize: state.tweetHistory.length,
    });

    // Step 2: Fetch news headlines
    logger.info('Fetching current news headlines');
    const headlines = await newsService.getFormattedHeadlines();
    
    logger.info('Headlines fetched', {
      count: headlines.split('\n').length,
    });

    // Step 3: Generate Trump-style tweet
    logger.info('Generating Trump-style tweet');
    const tweet = await openaiService.generateTweet(headlines);
    
    logger.info('Tweet generated successfully', {
      length: tweet.length,
      content: tweet,
    });

    // Step 4: Extract topics for variety checking
    logger.info('Extracting topics from tweet');
    const topics = await openaiService.extractTopics(tweet);
    
    logger.info('Topics extracted', { topics });

    // Step 5: Check variety against recent tweets
    const recentTopics = state.tweetHistory.map(record => record.topics);
    const isUnique = checkVariety(topics, recentTopics);

    if (!isUnique && state.tweetHistory.length > 0) {
      logger.warn('Tweet is too similar to recent posts, but posting anyway');
      // In a more sophisticated version, we could regenerate or fetch different news
      // For now, we'll post anyway to ensure consistent posting
    }

    // Step 6: Post to Twitter
    logger.info('Posting tweet to Twitter');
    const tweetUrl = await twitterService.postTweet(tweet);

    if (tweetUrl) {
      logger.info('Tweet posted successfully!', {
        url: tweetUrl,
      });
    } else {
      logger.info('Dry run completed - no tweet posted');
    }

    // Step 7: Update state
    const updatedState = storage.addTweet(state, {
      content: tweet,
      topics,
      timestamp: new Date().toISOString(),
    });

    storage.writeState(updatedState);
    logger.info('State updated successfully');

    logger.info('=== Trump Bot Completed Successfully ===');
    process.exit(0);
  } catch (error) {
    logger.error('=== Trump Bot Failed ===', error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled rejection', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  process.exit(1);
});

// Run main function
main();


