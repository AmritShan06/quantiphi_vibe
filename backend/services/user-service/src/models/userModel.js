const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class UserModel {
  static async findAll() {
    const sql = 'SELECT * FROM users ORDER BY created_at DESC';
    return await db.query(sql);
  }

  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = $1';
    const rows = await db.query(sql, [id]);
    return rows[0] || null;
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = $1';
    const rows = await db.query(sql, [email]);
    return rows[0] || null;
  }

  static async create({ name, email, avatarUrl }) {
    const id = uuidv4();
    const avatar = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
    const sql = 'INSERT INTO users (id, name, email, avatar_url) VALUES ($1, $2, $3, $4)';
    await db.query(sql, [id, name, email, avatar]);
    return { id, name, email, avatar_url: avatar };
  }
}

module.exports = UserModel;
