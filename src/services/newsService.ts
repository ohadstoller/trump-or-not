/**
 * News Service - Fetch current headlines for tweet generation
 * Supports both NewsAPI and RSS fallback
 */

import axios from 'axios';
import { logger } from '../utils/logger';
import { config } from '../config';

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: Array<{
    title: string;
    description: string;
    source: {
      name: string;
    };
  }>;
}

class NewsService {
  private readonly NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';
  private readonly RSS_FEED_URL = 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en';
  private cache: { headlines: string[]; timestamp: number } | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch headlines from NewsAPI
   */
  private async fetchFromNewsAPI(): Promise<string[]> {
    const apiKey = config.news.apiKey;
    
    if (!apiKey) {
      throw new Error('NewsAPI key not configured');
    }

    try {
      logger.info('Fetching headlines from NewsAPI');
      
      const response = await axios.get<NewsAPIResponse>(this.NEWS_API_URL, {
        params: {
          country: 'us',
          category: 'general',
          pageSize: 10,
          apiKey,
        },
        timeout: 10000,
      });

      if (response.data.status !== 'ok') {
        throw new Error('NewsAPI returned non-ok status');
      }

      const headlines = response.data.articles
        .slice(0, 5)
        .map(article => article.title)
        .filter(title => title && !title.includes('[Removed]'));

      logger.info(`Fetched ${headlines.length} headlines from NewsAPI`);
      return headlines;
    } catch (error) {
      logger.error('Failed to fetch from NewsAPI', error);
      throw error;
    }
  }

  /**
   * Fetch headlines from Google News RSS (fallback)
   */
  private async fetchFromRSS(): Promise<string[]> {
    try {
      logger.info('Fetching headlines from Google News RSS');
      
      const response = await axios.get(this.RSS_FEED_URL, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TrumpBot/1.0)',
        },
      });

      // Simple XML parsing for titles - handle both CDATA and plain text
      const xml = response.data;
      
      // Try CDATA format first
      let titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>/g;
      let matches = [...xml.matchAll(titleRegex)];
      
      // If no CDATA matches, try plain title tags
      if (matches.length === 0) {
        titleRegex = /<title>(.*?)<\/title>/g;
        matches = [...xml.matchAll(titleRegex)];
      }
      
      const headlines = matches
        .slice(1, 6) // Skip first match (feed title)
        .map((match: RegExpMatchArray) => match[1])
        .filter((title: string) => title && title.length > 0 && !title.includes('Google News'));

      logger.info(`Fetched ${headlines.length} headlines from RSS`);
      
      if (headlines.length === 0) {
        throw new Error('No headlines extracted from RSS feed');
      }
      
      return headlines;
    } catch (error) {
      logger.error('Failed to fetch from RSS', error);
      throw error;
    }
  }

  /**
   * Get headlines with caching
   */
  async getHeadlines(): Promise<string[]> {
    // Check cache first
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      logger.info('Using cached headlines');
      return this.cache.headlines;
    }

    let headlines: string[];

    // Try NewsAPI first if key is configured
    if (config.news.apiKey) {
      try {
        headlines = await this.fetchFromNewsAPI();
      } catch (error) {
        logger.warn('NewsAPI failed, falling back to RSS');
        headlines = await this.fetchFromRSS();
      }
    } else {
      // Use RSS directly if no API key
      headlines = await this.fetchFromRSS();
    }

    if (headlines.length === 0) {
      throw new Error('No headlines fetched from any source');
    }

    // Update cache
    this.cache = {
      headlines,
      timestamp: Date.now(),
    };

    return headlines;
  }

  /**
   * Get formatted headlines string for OpenAI
   */
  async getFormattedHeadlines(): Promise<string> {
    const headlines = await this.getHeadlines();
    return headlines
      .map((headline, index) => `${index + 1}. ${headline}`)
      .join('\n');
  }
}

// Export singleton instance
export const newsService = new NewsService();


