/**
 * Logger utility for structured logging across the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(level: LogLevel, message: string, meta?: LogContext): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}${metaStr}`;
  }

  debug(message: string, meta?: LogContext): void {
    if (__DEV__) {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }

  info(message: string, meta?: LogContext): void {
    console.info(this.formatMessage('info', message, meta));
  }

  warn(message: string, meta?: LogContext): void {
    console.warn(this.formatMessage('warn', message, meta));
  }

  error(message: string, error?: Error | unknown, meta?: LogContext): void {
    const errorMeta = error instanceof Error
      ? { ...meta, error: error.message, stack: error.stack }
      : { ...meta, error };
    console.error(this.formatMessage('error', message, errorMeta));
  }
}

/**
 * Create a logger instance for a specific context
 * @param context - The context or module name (e.g., 'Auth:Login', 'Map:Markers')
 */
export const createLogger = (context: string): Logger => {
  return new Logger(context);
};
