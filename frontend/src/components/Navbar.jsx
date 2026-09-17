import React from 'react';
import { Plus, UserPlus, Filter, FolderPlus, Layers } from 'lucide-react';

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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand & Project Selector */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-md">
              Q
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-slate-900 text-lg tracking-tight">quantiphi</h1>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                  Vibe Task Board
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Task Management & Workload Balancing</p>
            </div>
          </div>

          <div className="h-7 w-px bg-slate-200 hidden sm:block"></div>

          {/* Project Selector */}
          <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
            <Layers className="w-4 h-4 text-slate-500 ml-1" />
            <select
              value={selectedProject?.id || ''}
              onChange={(e) => {
                const proj = projects.find(p => p.id === e.target.value);
                onSelectProject(proj);
              }}
              className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer pr-2"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              onClick={onOpenCreateProject}
              title="Add New Project"
              className="p-1 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 shadow-xs transition"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Controls: Priority Filter, Add User, Create Task */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* Priority Filter */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Add User to Project Button */}
          <button
            onClick={onOpenCreateUser}
            className="flex items-center space-x-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 shadow-xs transition"
          >
            <UserPlus className="w-4 h-4 text-slate-500" />
            <span>Add User</span>
          </button>

          {/* Create Task Button */}
          <button
            onClick={onOpenCreateTask}
            className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>

      </div>
    </header>
  );
}
