// server/models/userModel.js
import pool from '../config/db.js';

const UserModel = {
  // Új felhasználó létrehozása
  async create({ username, email, password, googleId = null }) {
    const query = `
      INSERT INTO users (username, email, password, google_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *;
    `;
    const values = [username, email, password, googleId];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  },

  // Felhasználó keresése ID alapján
  async findById(id) {
    const query = `SELECT * FROM users WHERE id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  // Felhasználó keresése username alapján
  async findByUsername(username) {
    const query = `SELECT * FROM users WHERE username = $1;`;
    const { rows } = await pool.query(query, [username]);
    return rows[0] || null;
  },

  // Felhasználó keresése email alapján
  async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const { rows } = await pool.query(query, [email]);
    return rows[0] || null;
  },

  // Felhasználó keresése Google ID alapján
  async findByGoogleId(googleId) {
    const query = `SELECT * FROM users WHERE google_id = $1;`;
    const { rows } = await pool.query(query, [googleId]);
    return rows[0] || null;
  },

  // Jelszó frissítése
  async updatePassword(id, newPassword) {
    const query = `
      UPDATE users
      SET password = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [newPassword, id]);
    return rows[0] || null;
  },

  // Felhasználó törlése
  async delete(id) {
    const query = `DELETE FROM users WHERE id = $1 RETURNING *;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },
};

export default UserModel;
