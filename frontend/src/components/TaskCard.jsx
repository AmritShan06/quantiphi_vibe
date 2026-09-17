import React from 'react';
import { Calendar, Trash2, ChevronRight, ChevronLeft, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export default function TaskCard({ task, onMoveStatus, onDeleteTask }) {
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-100';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-100';
      case 'Low':
        return 'bg-sky-50 text-sky-700 border-sky-200 ring-1 ring-sky-100';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-grab active:cursor-grabbing group mb-3"
    >
      {/* Top Header: Priority Badge & Delete Button */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md border flex items-center space-x-1 ${getPriorityBadgeClass(
            task.priority
          )}`}
        >
          {task.priority === 'High' && <AlertCircle className="w-3 h-3 text-red-600" />}
          <span>{task.priority} Priority</span>
        </span>

        <button
          onClick={() => onDeleteTask(task.id)}
          title="Delete Task"
          className="text-slate-300 hover:text-red-600 hover:bg-red-50 transition p-1 rounded-md opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Task Title & Description */}
      <h4 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-indigo-600 transition mb-1">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-slate-500 mb-3.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Assignee & Due Date */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center space-x-2">
          {task.assignee_avatar ? (
            <img
              src={task.assignee_avatar}
              alt={task.assignee_name}
              className="w-6 h-6 rounded-full border border-slate-200 shadow-xs object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 flex items-center justify-center">
              ?
            </div>
          )}
          <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[110px]">
            {task.assignee_name || 'Unassigned'}
          </span>
        </div>

        {task.due_date && (
          <div className="flex items-center space-x-1 text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{task.due_date}</span>
          </div>
        )}
      </div>

      {/* Column Move Controls */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          {task.status}
        </div>

        <div className="flex items-center space-x-1.5">
          {task.status !== 'To-Do' && (
            <button
              onClick={() =>
                onMoveStatus(
                  task.id,
                  task.status === 'Done' ? 'In Progress' : 'To-Do'
                )
              }
              className="px-2 py-1 text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition flex items-center space-x-0.5"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Back</span>
            </button>
          )}

          {task.status !== 'Done' && (
            <button
              onClick={() =>
                onMoveStatus(
                  task.id,
                  task.status === 'To-Do' ? 'In Progress' : 'Done'
                )
              }
              className="px-2.5 py-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition flex items-center space-x-0.5 shadow-2xs"
            >
              <span>Move</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
