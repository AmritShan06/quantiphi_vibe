const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:5001';
const PROJECT_SERVICE_URL = process.env.PROJECT_SERVICE_URL || 'http://localhost:5002';
const TASK_SERVICE_URL = process.env.TASK_SERVICE_URL || 'http://localhost:5003';

app.get('/health', (req, res) => {
  res.json({ status: 'UP', gateway: 'API Gateway operational', timestamp: new Date() });
});

app.use('/api/users', createProxyMiddleware({
  target: USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/api/users' }
}));

app.use('/api/projects', createProxyMiddleware({
  target: PROJECT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/projects': '/api/projects' }
}));

app.use('/api/tasks', createProxyMiddleware({
  target: TASK_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/tasks': '/api/tasks' }
}));

app.listen(PORT, () => {
  console.log(`[API Gateway] Running on port ${PORT}`);
  console.log(` -> User Service: ${USER_SERVICE_URL}`);
  console.log(` -> Project Service: ${PROJECT_SERVICE_URL}`);
  console.log(` -> Task Service: ${TASK_SERVICE_URL}`);
});
