type LogLevel = "info" | "warn" | "error";

const log = (level: LogLevel, message: string, data?: unknown) => {
  const prefix = `[${level.toUpperCase()}]`;
  if (data) {
    console[level](`${prefix} ${message}`, data);
  } else {
    console[level](`${prefix} ${message}`);
  }
};

export const logger = {
  info: (message: string, data?: unknown) => log("info", message, data),
  warn: (message: string, data?: unknown) => log("warn", message, data),
  error: (message: string, error?: unknown) => log("error", message, error),
};
