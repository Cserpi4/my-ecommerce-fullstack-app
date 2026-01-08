import config from '../config/index.js';

const pool = config.pool;

/**
 * Lekérdezés futtatása a PostgreSQL adatbázison.
 * @param {string} text - SQL lekérdezés
 * @param {Array} params - Paraméterek
 * @returns {Promise<object>} Eredmény
 */
const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('❌ Database query error:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

export default { query };
