// Import a PostgreSQL pool (ez marad)
import pool from './db.js'; 

// Default export: minden konfiguráció egy objektumban
const config = {
  // MINDEN process.env-re hivatkozik közvetlenül
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  clientUrl: process.env.CLIENT_URL,
  cookieDomain: process.env.COOKIE_DOMAIN,
  sessionSecret: process.env.SESSION_SECRET,

  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,

  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY, // <- MOST MÁR A GLOBÁLIS ENV-T HASZNÁLJA

  // PostgreSQL pool
  pool,
};

export default config;
