// server/utils/logger.js
const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  switch (type) {
    case 'info':
      console.log(`[INFO - ${timestamp}] ${message}`);
      break;
    case 'warn':
      console.warn(`[WARN - ${timestamp}] ${message}`);
      break;
    case 'error':
      console.error(`[ERROR - ${timestamp}] ${message}`);
      break;
    default:
      console.log(`[LOG - ${timestamp}] ${message}`);
  }
};

export default {
  log,
  info: (msg) => log(msg, 'info'),
  warn: (msg) => log(msg, 'warn'),
  error: (msg) => log(msg, 'error'),
};
