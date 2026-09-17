const TaskModel = require('../models/taskModel');
const db = require('../config/db');

class WorkloadService {
  static async computeWorkloadSummary(projectId) {
    const tasks = await TaskModel.getWorkloadRaw(projectId);

    const columnCounts = {
      'To-Do': 0,
      'In Progress': 0,
      'Done': 0
    };

    const userInProgressCounts = {};

    tasks.forEach(task => {
      const status = task.status || 'To-Do';
      if (columnCounts[status] !== undefined) {
        columnCounts[status]++;
      } else {
        columnCounts[status] = 1;
      }

      if (status === 'In Progress' && task.assignee_id) {
        userInProgressCounts[task.assignee_id] = (userInProgressCounts[task.assignee_id] || 0) + 1;
      }
    });

    const usersList = await db.query('SELECT id, name, email, avatar_url FROM users');

    const userWorkloads = usersList.map(user => {
      const inProgressCount = userInProgressCounts[user.id] || 0;
      return {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        avatarUrl: user.avatar_url,
        inProgressCount: inProgressCount,
        isOverloaded: inProgressCount > 5  // Rule: > 5 tasks in progress flags warning
      };
    });

    return {
      columnCounts,
      totalTasks: tasks.length,
      userWorkloads,
      overloadedUsersCount: userWorkloads.filter(u => u.isOverloaded).length
    };
  }
}

module.exports = WorkloadService;
