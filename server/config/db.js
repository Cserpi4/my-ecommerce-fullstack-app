// server/config/db.js
import pkg from 'pg';
import env from './env.js';

const { Pool } = pkg;

// PostgreSQL kapcsolat pool létrehozása
const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', err => {
  console.error('❌ Database connection error', err);
  process.exit(-1);
});

export default pool;
