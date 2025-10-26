/**
 * JSON file storage utility for maintaining bot state
 */

import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger';

export interface TweetRecord {
  content: string;
  topics: string[];
  timestamp: string;
}

export interface BotState {
  lastRun: string;
  tweetHistory: TweetRecord[];
}

const STATE_FILE_PATH = path.join(process.cwd(), 'data', 'state.json');
const MAX_HISTORY_SIZE = 10;

class Storage {
  /**
   * Ensure data directory exists
   */
  private ensureDataDirectory(): void {
    const dataDir = path.dirname(STATE_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      logger.info(`Created data directory: ${dataDir}`);
    }
  }

  /**
   * Initialize empty state
   */
  private getEmptyState(): BotState {
    return {
      lastRun: new Date().toISOString(),
      tweetHistory: [],
    };
  }

  /**
   * Read state from file
   */
  readState(): BotState {
    this.ensureDataDirectory();

    if (!fs.existsSync(STATE_FILE_PATH)) {
      logger.info('No state file found, initializing empty state');
      return this.getEmptyState();
    }

    try {
      const data = fs.readFileSync(STATE_FILE_PATH, 'utf-8');
      const state = JSON.parse(data) as BotState;
      logger.info('Loaded state from file', {
        lastRun: state.lastRun,
        historySize: state.tweetHistory.length,
      });
      return state;
    } catch (error) {
      logger.error('Failed to read state file, initializing empty state', error);
      return this.getEmptyState();
    }
  }

  /**
   * Write state to file atomically
   */
  writeState(state: BotState): void {
    this.ensureDataDirectory();

    try {
      // Trim history to max size
      if (state.tweetHistory.length > MAX_HISTORY_SIZE) {
        state.tweetHistory = state.tweetHistory.slice(-MAX_HISTORY_SIZE);
      }

      // Write to temp file first (atomic operation)
      const tempPath = `${STATE_FILE_PATH}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(state, null, 2), 'utf-8');
      
      // Rename temp file to actual file (atomic on most systems)
      fs.renameSync(tempPath, STATE_FILE_PATH);
      
      logger.info('Saved state to file', {
        historySize: state.tweetHistory.length,
      });
    } catch (error) {
      logger.error('Failed to write state file', error);
      throw error;
    }
  }

  /**
   * Add tweet to history
   */
  addTweet(state: BotState, tweet: TweetRecord): BotState {
    return {
      ...state,
      lastRun: new Date().toISOString(),
      tweetHistory: [...state.tweetHistory, tweet],
    };
  }
}

// Export singleton instance
export const storage = new Storage();


