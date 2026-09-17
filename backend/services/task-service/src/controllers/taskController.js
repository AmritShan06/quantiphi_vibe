const TaskModel = require('../models/taskModel');
const WorkloadService = require('../services/workloadService');

class TaskController {
  static async getTasks(req, res) {
    try {
      const { projectId, priority } = req.query;
      const tasks = await TaskModel.findByProjectId(projectId, priority);
      res.json({ success: true, data: tasks });
    } catch (error) {
      console.error('[TaskController Error]', error);
      res.status(500).json({ success: false, message: 'Failed to fetch tasks', error: error.message });
    }
  }

  static async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const task = await TaskModel.findById(id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      res.json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch task', error: error.message });
    }
  }

  static async createTask(req, res) {
    try {
      const { projectId, assigneeId, title, description, priority, status, dueDate } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Task title is required' });
      }

      const newTask = await TaskModel.create({
        projectId,
        assigneeId,
        title,
        description,
        priority,
        status,
        dueDate
      });

      res.status(201).json({ success: true, data: newTask, message: 'Task created successfully' });
    } catch (error) {
      console.error('[TaskController Error]', error);
      res.status(500).json({ success: false, message: 'Failed to create task', error: error.message });
    }
  }

  static async updateTask(req, res) {
    try {
      const { id } = req.params;
      const updated = await TaskModel.update(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      res.json({ success: true, data: updated, message: 'Task updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update task', error: error.message });
    }
  }

  static async updateTaskStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status || !['To-Do', 'In Progress', 'Done'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status column' });
      }

      const updated = await TaskModel.updateStatus(id, status);
      res.json({ success: true, data: updated, message: `Task moved to ${status}` });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to move task', error: error.message });
    }
  }

  static async deleteTask(req, res) {
    try {
      const { id } = req.params;
      await TaskModel.delete(id);
      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete task', error: error.message });
    }
  }

  static async getWorkloadSummary(req, res) {
    try {
      const { projectId } = req.query;
      const summary = await WorkloadService.computeWorkloadSummary(projectId);
      res.json({ success: true, data: summary });
    } catch (error) {
      console.error('[TaskController Workload Error]', error);
      res.status(500).json({ success: false, message: 'Failed to calculate workload', error: error.message });
    }
  }
}

module.exports = TaskController;
