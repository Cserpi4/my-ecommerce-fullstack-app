import fs from 'fs';
import path from 'path';
import db from '../db/index.js';

const seedProducts = async () => {
  try {
    const filePath = path.resolve('server/data/initial_products.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(data);

    for (const product of products) {
      const { name, description, price, file_name } = product;

      await db.query(
        `INSERT INTO products (name, description, price, image)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (name) DO NOTHING`,
        [name, description, price, file_name]
      );
    }

    console.log('✅ Initial products seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding products:', err);
    process.exit(1);
  }
};

seedProducts();
