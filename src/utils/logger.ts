/**
 * Simple logger utility with timestamp and log levels
 */

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private format(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = this.getTimestamp();
    const baseMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (data) {
      return `${baseMessage}\n${JSON.stringify(data, null, 2)}`;
    }
    
    return baseMessage;
  }

  info(message: string, data?: unknown): void {
    console.log(this.format(LogLevel.INFO, message, data));
  }

  warn(message: string, data?: unknown): void {
    console.warn(this.format(LogLevel.WARN, message, data));
  }

  error(message: string, error?: unknown): void {
    console.error(this.format(LogLevel.ERROR, message, error));
  }
}

// Export singleton instance
export const logger = new Logger();


