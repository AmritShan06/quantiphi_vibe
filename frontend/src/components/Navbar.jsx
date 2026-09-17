import React from 'react';
import { Plus, UserPlus, Filter, FolderPlus } from 'lucide-react';

export default function Navbar({
  projects,
  selectedProject,
  onSelectProject,
  priorityFilter,
  onPriorityFilterChange,
  onOpenCreateTask,
  onOpenCreateProject,
  onOpenCreateUser
}) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow">
              Q
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg leading-tight">Quantiphi</h1>
              <p className="text-xs text-gray-500">Task Management & Workload Engine</p>
            </div>
          </div>

          <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>

          <div className="flex items-center space-x-2">
            <label className="text-xs font-medium text-gray-500 hidden sm:block">Project:</label>
            <select
              value={selectedProject?.id || ''}
              onChange={(e) => {
                const proj = projects.find(p => p.id === e.target.value);
                onSelectProject(proj);
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 px-3 py-1.5 font-medium"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              onClick={onOpenCreateProject}
              title="Create New Project"
              className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-md transition"
            >
              <FolderPlus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center space-x-1.5 bg-gray-50 border border-gray-300 rounded-md px-2.5 py-1 text-sm text-gray-700">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-500">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              className="bg-transparent text-sm font-semibold text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <button
            onClick={onOpenCreateUser}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition border border-gray-300"
          >
            <UserPlus className="w-4 h-4 text-gray-600" />
            <span>Add Member</span>
          </button>

          <button
            onClick={onOpenCreateTask}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>

      </div>
    </header>
  );
}
