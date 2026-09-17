import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TeamList from './components/TeamList';
import KanbanBoard from './components/KanbanBoard';
import CreateTaskModal from './components/CreateTaskModal';
import CreateProjectModal from './components/CreateProjectModal';
import CreateUserModal from './components/CreateUserModal';
import { api } from './services/api';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [workloadSummary, setWorkloadSummary] = useState({ columnCounts: {}, userWorkloads: [], overloadedUsersCount: 0 });
  const [priorityFilter, setPriorityFilter] = useState('All');

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    loadProjects();
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadProjectData(selectedProject.id, priorityFilter);
    }
  }, [selectedProject, priorityFilter]);

  const loadUsers = async () => {
    try {
      const res = await api.getUsers();
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await api.getProjects();
      if (res.success && res.data.length > 0) {
        setProjects(res.data);
        if (!selectedProject) {
          setSelectedProject(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const loadProjectData = async (projectId, priority) => {
    try {
      const [tasksRes, workloadRes] = await Promise.all([
        api.getTasks(projectId, priority),
        api.getWorkloadSummary(projectId)
      ]);

      if (tasksRes.success) setTasks(tasksRes.data);
      if (workloadRes.success) setWorkloadSummary(workloadRes.data);
    } catch (err) {
      console.error('Failed to load project tasks/workload:', err);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await api.createTask(taskData);
      if (selectedProject) {
        loadProjectData(selectedProject.id, priorityFilter);
      }
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const res = await api.createProject(projectData);
      if (res.success) {
        await loadProjects();
        setSelectedProject(res.data);
      }
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const res = await api.createUser(userData);
      if (res.success) {
        await loadUsers();
        if (selectedProject) {
          await api.addProjectMember(selectedProject.id, res.data.id);
          loadProjectData(selectedProject.id, priorityFilter);
        }
      }
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  const handleMoveStatus = async (taskId, newStatus) => {
    try {
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      await api.updateTaskStatus(taskId, newStatus);
      if (selectedProject) {
        loadProjectData(selectedProject.id, priorityFilter);
      }
    } catch (err) {
      console.error('Failed to move task status:', err);
      if (selectedProject) {
        loadProjectData(selectedProject.id, priorityFilter);
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      await api.deleteTask(taskId);
      if (selectedProject) {
        loadProjectData(selectedProject.id, priorityFilter);
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
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
            <TeamList
              userWorkloads={workloadSummary.userWorkloads}
              overloadedUsersCount={workloadSummary.overloadedUsersCount}
            />

            <KanbanBoard
              tasks={tasks}
              columnCounts={workloadSummary.columnCounts}
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
