// server/setupDatabase.js
import db from './db/index.js'; // default import

const createTables = async () => {
  try {
    console.log('🚀 Setting up PostgreSQL tables...');

    // USERS
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        google_id VARCHAR(255),
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // PRODUCTS
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL UNIQUE,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        image TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // CARTS
    await db.query(`
      CREATE TABLE IF NOT EXISTS carts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // CART ITEMS
    await db.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL DEFAULT 1
      );
    `);

    // ORDERS
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total_amount NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // ORDER ITEMS
    await db.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        product_name TEXT,
        product_image TEXT
      );
    `);

    // PAYMENTS (Stripe-kompatibilis verzió)
    await db.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        provider VARCHAR(100) DEFAULT 'stripe',
        payment_intent_id VARCHAR(255), -- új Stripe mező
        amount NUMERIC(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'usd',
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ All tables created or verified successfully!');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  } finally {
    process.exit();
  }
};

createTables();
