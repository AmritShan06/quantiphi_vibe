import axios from 'axios';

const API_BASE_URL = '/api';

export const api = {
  getUsers: async () => {
    const res = await axios.get(`${API_BASE_URL}/users`);
    return res.data;
  },
  createUser: async (userData) => {
    const res = await axios.post(`${API_BASE_URL}/users`, userData);
    return res.data;
  },

  getProjects: async () => {
    const res = await axios.get(`${API_BASE_URL}/projects`);
    return res.data;
  },
  createProject: async (projectData) => {
    const res = await axios.post(`${API_BASE_URL}/projects`, projectData);
    return res.data;
  },
  addProjectMember: async (projectId, userId) => {
    const res = await axios.post(`${API_BASE_URL}/projects/${projectId}/members`, { userId });
    return res.data;
  },
  getProjectMembers: async (projectId) => {
    const res = await axios.get(`${API_BASE_URL}/projects/${projectId}/members`);
    return res.data;
  },

  getTasks: async (projectId, priority = 'All') => {
    const params = {};
    if (projectId) params.projectId = projectId;
    if (priority && priority !== 'All') params.priority = priority;
    const res = await axios.get(`${API_BASE_URL}/tasks`, { params });
    return res.data;
  },
  createTask: async (taskData) => {
    const res = await axios.post(`${API_BASE_URL}/tasks`, taskData);
    return res.data;
  },
  updateTask: async (id, taskData) => {
    const res = await axios.put(`${API_BASE_URL}/tasks/${id}`, taskData);
    return res.data;
  },
  updateTaskStatus: async (id, status) => {
    const res = await axios.patch(`${API_BASE_URL}/tasks/${id}/status`, { status });
    return res.data;
  },
  deleteTask: async (id) => {
    const res = await axios.delete(`${API_BASE_URL}/tasks/${id}`);
    return res.data;
  },

  getWorkloadSummary: async (projectId) => {
    const params = projectId ? { projectId } : {};
    const res = await axios.get(`${API_BASE_URL}/tasks/workload`, { params });
    return res.data;
  }
};
