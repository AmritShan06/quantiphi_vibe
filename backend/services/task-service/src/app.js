const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const TaskModel = require('./models/taskModel');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);

async function seedDefaultTasks() {
  try {
    const existing = await TaskModel.findByProjectId();
    if (existing.length === 0) {
      const users = await db.query('SELECT id FROM users');
      const projects = await db.query('SELECT id FROM projects');

      const user1 = users[0]?.id || null;
      const user2 = users[1]?.id || null;
      const proj1 = projects[0]?.id || null;

      if (proj1) {
        await TaskModel.create({
          projectId: proj1,
          assigneeId: user1,
          title: 'Design Microservice System Diagram',
          description: 'Define clear boundaries and API endpoints for services',
          priority: 'High',
          status: 'Done',
          dueDate: '2026-09-20'
        });

        await TaskModel.create({
          projectId: proj1,
          assigneeId: user1,
          title: 'Implement API Gateway Proxy',
          description: 'Route requests seamlessly to individual microservice backends',
          priority: 'High',
          status: 'In Progress',
          dueDate: '2026-09-22'
        });

        await TaskModel.create({
          projectId: proj1,
          assigneeId: user2,
          title: 'Setup PostgreSQL Database Schema',
          description: 'Create normalized tables for Users, Projects, and Tasks',
          priority: 'Medium',
          status: 'In Progress',
          dueDate: '2026-09-25'
        });

        await TaskModel.create({
          projectId: proj1,
          assigneeId: user2,
          title: 'Build Workload Balancing Engine',
          description: 'Server-side workload calculation to flag user burnout when > 5 tasks in progress',
          priority: 'High',
          status: 'To-Do',
          dueDate: '2026-09-28'
        });

        console.log('[Task Service] Seeded default task items.');
      }
    }
  } catch (err) {
    console.error('[Task Service Seed Error]', err.message);
  }
}

app.listen(PORT, async () => {
  console.log(`[Task Service] Running on port ${PORT}`);
  await seedDefaultTasks();
});
