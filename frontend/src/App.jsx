import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TeamList from './components/TeamList';
import KanbanBoard from './components/KanbanBoard';
import CreateTaskModal from './components/CreateTaskModal';
import CreateProjectModal from './components/CreateProjectModal';
import CreateUserModal from './components/CreateUserModal';
import { api } from './services/api';

const DEFAULT_PROJECT = {
  id: 'proj-1',
  name: 'Quantiphi Vibe Platform',
  description: 'Core Task Management and Workload Analytics'
};

const DEFAULT_USERS = [
  { id: 'usr-1', name: 'Alex Johnson', email: 'alex@quantiphi.com', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 'usr-2', name: 'Sarah Miller', email: 'sarah@quantiphi.com', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 'usr-3', name: 'David Chen', email: 'david@quantiphi.com', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
  { id: 'usr-4', name: 'Emma Watson', email: 'emma@quantiphi.com', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' }
];

const INITIAL_TASKS = [
  { id: 't-1', title: 'Implement Microservices Architecture', description: 'Decouple monolith into User, Project, and Task MVC services', priority: 'High', status: 'Done', assignee_id: 'usr-3', assignee_name: 'David Chen', assignee_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', due_date: '2026-09-20' },
  { id: 't-2', title: 'Build Workload Balancing Engine', description: 'Server-side workload calculation to flag user burnout when > 5 tasks in progress', priority: 'High', status: 'In Progress', assignee_id: 'usr-1', assignee_name: 'Alex Johnson', assignee_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', due_date: '2026-09-21' },
  { id: 't-3', title: 'Refactor Kanban UI Layout', description: 'Ensure clean Tailwind styling with stable neutral background', priority: 'Medium', status: 'In Progress', assignee_id: 'usr-1', assignee_name: 'Alex Johnson', assignee_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', due_date: '2026-09-22' },
  { id: 't-4', title: 'Optimize PostgreSQL Queries', description: 'Add database indexes on project_id and status columns', priority: 'Medium', status: 'In Progress', assignee_id: 'usr-1', assignee_name: 'Alex Johnson', assignee_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', due_date: '2026-09-23' },
  { id: 't-5', title: 'API Gateway Proxy Router', description: 'Route HTTP client traffic dynamically to microservices', priority: 'High', status: 'In Progress', assignee_id: 'usr-1', assignee_name: 'Alex Johnson', assignee_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', due_date: '2026-09-24' },
  { id: 't-6', title: 'User Authentication JWT', description: 'Add secure token generation and session management', priority: 'High', status: 'In Progress', assignee_id: 'usr-1', assignee_name: 'Alex Johnson', assignee_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', due_date: '2026-09-25' },
  { id: 't-7', title: 'Unit Tests for Workload Engine', description: 'Verify burnout warning triggers cleanly when count exceeds 5', priority: 'Low', status: 'In Progress', assignee_id: 'usr-1', assignee_name: 'Alex Johnson', assignee_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', due_date: '2026-09-26' },
  { id: 't-8', title: 'Setup CI/CD Pipeline', description: 'Automate build and deployment checks on GitHub push', priority: 'Medium', status: 'To-Do', assignee_id: 'usr-2', assignee_name: 'Sarah Miller', assignee_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', due_date: '2026-09-28' },
  { id: 't-9', title: 'Documentation & Architecture Diagrams', description: 'Update README with clear local setup and API specification', priority: 'Low', status: 'To-Do', assignee_id: 'usr-4', assignee_name: 'Emma Watson', assignee_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', due_date: '2026-09-30' }
];

export default function App() {
  const [projects, setProjects] = useState([DEFAULT_PROJECT]);
  const [selectedProject, setSelectedProject] = useState(DEFAULT_PROJECT);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [priorityFilter, setPriorityFilter] = useState('All');

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    loadBackendData();
  }, []);

  const loadBackendData = async () => {
    try {
      const [projRes, userRes] = await Promise.all([
        api.getProjects(),
        api.getUsers()
      ]);

      if (projRes?.success && projRes.data.length > 0) {
        setProjects(projRes.data);
        setSelectedProject(projRes.data[0]);
      }
      if (userRes?.success && userRes.data.length > 0) {
        setUsers(userRes.data);
      }
    } catch (err) {
      console.log('Backend offline or loading - using resilient local state mode');
    }
  };

  useEffect(() => {
    if (selectedProject?.id && selectedProject.id !== 'proj-1') {
      loadProjectTasks(selectedProject.id, priorityFilter);
    }
  }, [selectedProject, priorityFilter]);

  const loadProjectTasks = async (projectId, priority) => {
    try {
      const res = await api.getTasks(projectId, priority);
      if (res?.success) {
        setTasks(res.data);
      }
    } catch (err) {
      console.log('Using local state for tasks');
    }
  };

  // Calculate Column Task Counters
  const filteredTasks = tasks.filter(t => priorityFilter === 'All' || t.priority === priorityFilter);
  
  const columnCounts = {
    'To-Do': filteredTasks.filter(t => t.status === 'To-Do').length,
    'In Progress': filteredTasks.filter(t => t.status === 'In Progress').length,
    'Done': filteredTasks.filter(t => t.status === 'Done').length
  };

  // Workload Balancing Engine ("Vibe Check"): Count In Progress tasks per user
  const userInProgressCounts = {};
  tasks.forEach(t => {
    if (t.status === 'In Progress' && t.assignee_id) {
      userInProgressCounts[t.assignee_id] = (userInProgressCounts[t.assignee_id] || 0) + 1;
    }
  });

  const userWorkloads = users.map(user => {
    const inProgressCount = userInProgressCounts[user.id] || 0;
    return {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      avatarUrl: user.avatarUrl || user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
      inProgressCount: inProgressCount,
      isOverloaded: inProgressCount > 5  // Rule: > 5 tasks in "In Progress" triggers warning
    };
  });

  const overloadedUsersCount = userWorkloads.filter(u => u.isOverloaded).length;

  const handleCreateTask = async (taskData) => {
    const assignee = users.find(u => u.id === taskData.assigneeId);
    const newTask = {
      id: `t-${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: taskData.status,
      assignee_id: taskData.assigneeId,
      assignee_name: assignee ? assignee.name : 'Unassigned',
      assignee_avatar: assignee ? (assignee.avatarUrl || assignee.avatar_url) : null,
      due_date: taskData.dueDate
    };

    setTasks(prev => [newTask, ...prev]);

    try {
      await api.createTask(taskData);
    } catch (e) {
      console.log('Saved task locally');
    }
  };

  const handleCreateProject = async (projectData) => {
    const newProj = { id: `proj-${Date.now()}`, name: projectData.name, description: projectData.description };
    setProjects(prev => [...prev, newProj]);
    setSelectedProject(newProj);
    try {
      await api.createProject(projectData);
    } catch (e) {
      console.log('Saved project locally');
    }
  };

  const handleCreateUser = async (userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`
    };
    setUsers(prev => [...prev, newUser]);
    try {
      await api.createUser(userData);
    } catch (e) {
      console.log('Saved user locally');
    }
  };

  const handleMoveStatus = async (taskId, newStatus) => {
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t)));
    try {
      await api.updateTaskStatus(taskId, newStatus);
    } catch (e) {
      console.log('Updated task status locally');
    }
  };

  const handleDeleteTask = async (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await api.deleteTask(taskId);
    } catch (e) {
      console.log('Deleted task locally');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        onOpenCreateTask={() => setIsTaskModalOpen(true)}
        onOpenCreateProject={() => setIsProjectModalOpen(true)}
        onOpenCreateUser={() => setIsUserModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {selectedProject ? (
          <>
            {/* Team List & Workload Burnout Warning Banner */}
            <TeamList
              userWorkloads={userWorkloads}
              overloadedUsersCount={overloadedUsersCount}
            />

            {/* Kanban Board Columns with Counters & Drag-and-Drop */}
            <KanbanBoard
              tasks={filteredTasks}
              columnCounts={columnCounts}
              onMoveStatus={handleMoveStatus}
              onDeleteTask={handleDeleteTask}
            />
          </>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No projects available.</p>
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium"
            >
              Create First Project
            </button>
          </div>
        )}
      </main>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        users={users}
        currentProjectId={selectedProject?.id}
      />

      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      <CreateUserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </div>
  );
}
