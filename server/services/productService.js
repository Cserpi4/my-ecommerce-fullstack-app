import pool from '../config/db.js';
import uploadService from './uploadService.js';

const tableName = 'products';

const getAllProducts = async () => {
  const { rows } = await pool.query(`SELECT * FROM ${tableName} ORDER BY created_at DESC`);
  return rows;
};

const getProductById = async id => {
  const { rows } = await pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
  return rows[0];
};

const createProduct = async ({ name, description, price, imagePath }) => {
  const { rows } = await pool.query(
    `INSERT INTO ${tableName} (name, description, price, image) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, description, price, imagePath]
  );
  return rows[0];
};

const updateProduct = async (id, data) => {
  const fields = [];
  const values = [];
  let i = 1;

  for (const key in data) {
    fields.push(`${key} = $${i}`);
    values.push(data[key]);
    i++;
  }
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE ${tableName} SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );
  return rows[0];
};

const deleteProduct = async id => {
  const product = await getProductById(id);
  if (!product) throw new Error('Product not found');

  // Kép törlése
  if (product.image) await uploadService.deleteFile(product.image);

  await pool.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
  return true;
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
