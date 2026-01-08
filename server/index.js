import 'dotenv/config';
import config from './config/index.js';
import loaders from './loaders/index.js';
import { createServer } from 'http';
import logger from './utils/logger.js';

const startServer = async () => {
  try {
    const app = await loaders();
    const server = createServer(app);

    // ✅ Itt a kulcs: közvetlenül config.port
    const PORT = config.port || 3000;

    server.listen(PORT, () => {
      logger.log(`🚀 Server running on http://localhost:${PORT}`, 'info');
      logger.log(`🌍 Environment: ${config.nodeEnv}`, 'info');
    });

    process.on('unhandledRejection', (err) => {
      logger.log(`❌ Unhandled Rejection: ${err.message}`, 'error');
      server.close(() => process.exit(1));
    });
  } catch (error) {
    logger.log(`💥 Server startup failed: ${error.message}`, 'error');
    process.exit(1);
  }
};

startServer();
