const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class ProjectModel {
  static async findAll() {
    const sql = 'SELECT * FROM projects ORDER BY created_at DESC';
    return await db.query(sql);
  }

  static async findById(id) {
    const sql = 'SELECT * FROM projects WHERE id = $1';
    const rows = await db.query(sql, [id]);
    return rows[0] || null;
  }

  static async create({ name, description }) {
    const id = uuidv4();
    const sql = 'INSERT INTO projects (id, name, description) VALUES ($1, $2, $3)';
    await db.query(sql, [id, name, description || '']);
    return { id, name, description, created_at: new Date() };
  }

  static async addMember(projectId, userId) {
    const checkSql = 'SELECT * FROM project_users WHERE project_id = $1 AND user_id = $2';
    const existing = await db.query(checkSql, [projectId, userId]);
    if (existing && existing.length > 0) {
      return { projectId, userId, status: 'already_member' };
    }
    const sql = 'INSERT INTO project_users (project_id, user_id) VALUES ($1, $2)';
    await db.query(sql, [projectId, userId]);
    return { projectId, userId, status: 'added' };
  }

  static async getMembers(projectId) {
    const sql = `
      SELECT u.id, u.name, u.email, u.avatar_url
      FROM users u
      INNER JOIN project_users pu ON u.id = pu.user_id
      WHERE pu.project_id = $1
    `;
    return await db.query(sql, [projectId]);
  }
}

module.exports = ProjectModel;
