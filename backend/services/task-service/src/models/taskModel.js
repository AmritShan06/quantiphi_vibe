const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class TaskModel {
  static async findByProjectId(projectId, priorityFilter = null) {
    let sql = `
      SELECT t.*, u.name as assignee_name, u.avatar_url as assignee_avatar
      FROM tasks t
      LEFT JOIN users u ON t.assignee_id = u.id
    `;
    const params = [];
    const conditions = [];

    if (projectId) {
      params.push(projectId);
      conditions.push(`t.project_id = $${params.length}`);
    }

    if (priorityFilter && priorityFilter !== 'All') {
      params.push(priorityFilter);
      conditions.push(`t.priority = $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY t.created_at DESC';
    return await db.query(sql, params);
  }

  static async findById(id) {
    const sql = 'SELECT * FROM tasks WHERE id = $1';
    const rows = await db.query(sql, [id]);
    return rows[0] || null;
  }

  static async create({ projectId, assigneeId, title, description, priority, status, dueDate }) {
    const id = uuidv4();
    const taskPriority = priority || 'Medium';
    const taskStatus = status || 'To-Do';
    const sql = `
      INSERT INTO tasks (id, project_id, assignee_id, title, description, priority, status, due_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    await db.query(sql, [
      id,
      projectId || null,
      assigneeId || null,
      title,
      description || '',
      taskPriority,
      taskStatus,
      dueDate || null
    ]);
    return { id, project_id: projectId, assignee_id: assigneeId, title, description, priority: taskPriority, status: taskStatus, due_date: dueDate };
  }

  static async update(id, { title, description, priority, status, assigneeId, dueDate }) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const newTitle = title !== undefined ? title : existing.title;
    const newDesc = description !== undefined ? description : existing.description;
    const newPriority = priority !== undefined ? priority : existing.priority;
    const newStatus = status !== undefined ? status : existing.status;
    const newAssignee = assigneeId !== undefined ? assigneeId : existing.assignee_id;
    const newDueDate = dueDate !== undefined ? dueDate : existing.due_date;

    const sql = `
      UPDATE tasks
      SET title = $1, description = $2, priority = $3, status = $4, assignee_id = $5, due_date = $6
      WHERE id = $7
    `;
    await db.query(sql, [newTitle, newDesc, newPriority, newStatus, newAssignee, newDueDate, id]);
    return { id, title: newTitle, description: newDesc, priority: newPriority, status: newStatus, assignee_id: newAssignee, due_date: newDueDate };
  }

  static async updateStatus(id, status) {
    const sql = 'UPDATE tasks SET status = $1 WHERE id = $2';
    await db.query(sql, [status, id]);
    return await this.findById(id);
  }

  static async delete(id) {
    const sql = 'DELETE FROM tasks WHERE id = $1';
    await db.query(sql, [id]);
    return { id, deleted: true };
  }

  static async getWorkloadRaw(projectId) {
    let sql = 'SELECT * FROM tasks';
    const params = [];
    if (projectId) {
      sql += ' WHERE project_id = $1';
      params.push(projectId);
    }
    return await db.query(sql, params);
  }
}

module.exports = TaskModel;
