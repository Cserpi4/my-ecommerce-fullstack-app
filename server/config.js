// server/config.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL,
  sessionSecret: process.env.SESSION_SECRET || 'dev_secret_for_testing', // fallback
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  cookieDomain: process.env.COOKIE_DOMAIN,
  databaseUrl: process.env.DATABASE_URL,
};

// gyors ellenőrzés
console.log('SESSION_SECRET loaded:', config.sessionSecret);

export default config;
