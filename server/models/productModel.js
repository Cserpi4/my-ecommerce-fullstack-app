import pool from '../config/db.js';

const ProductModel = {
  async create({ name, description, price, imageUrl, stock }) {
    const query = `
      INSERT INTO products (name, description, price, image_url, stock)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [name, description, price, imageUrl, stock];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  },

  async findAll() {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY id ASC');
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async update(id, { name, description, price, imageUrl, stock }) {
    const query = `
      UPDATE products
      SET name = $1,
          description = $2,
          price = $3,
          image_url = $4,
          stock = $5
      WHERE id = $6
      RETURNING *;
    `;
    const values = [name, description, price, imageUrl, stock, id];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *;', [id]);
    return rows[0] || null;
  },
};

export default ProductModel;
