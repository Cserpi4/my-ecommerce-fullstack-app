// server/utils/logger.js

const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${level.toUpperCase()} - ${timestamp}] ${message}`;
};

const logger = {
  info(message) {
    console.log(formatMessage('info', message));
  },

  warn(message) {
    console.warn(formatMessage('warn', message));
  },

  error(message) {
    console.error(formatMessage('error', message));
  },

  log(message) {
    console.log(formatMessage('log', message));
  },
};

export default logger;
