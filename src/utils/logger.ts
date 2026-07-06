type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  data?: Record<string, unknown>;
}

function emit(level: LogLevel, service: string, message: string, data?: Record<string, unknown>): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    service,
    message,
    ...(data ? { data } : {}),
  };
  // In production, pipe to structured logging backend
  const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  fn(JSON.stringify(entry));
}

export const logger = {
  info: (service: string, message: string, data?: Record<string, unknown>) => emit('info', service, message, data),
  warn: (service: string, message: string, data?: Record<string, unknown>) => emit('warn', service, message, data),
  error: (service: string, message: string, data?: Record<string, unknown>) => emit('error', service, message, data),
  debug: (service: string, message: string, data?: Record<string, unknown>) => emit('debug', service, message, data),
};
