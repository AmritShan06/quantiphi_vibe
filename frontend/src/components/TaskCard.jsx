import React from 'react';
import { Calendar, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function TaskCard({ task, onMoveStatus, onDeleteTask }) {
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing group mb-3"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-semibold text-gray-800 text-sm leading-snug group-hover:text-indigo-600 transition">
          {task.title}
        </h4>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadgeClass(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center space-x-1.5">
          {task.assignee_avatar ? (
            <img
              src={task.assignee_avatar}
              alt={task.assignee_name}
              className="w-5 h-5 rounded-full border border-gray-300"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-200 text-[10px] font-bold text-gray-600 flex items-center justify-center">
              ?
            </div>
          )}
          <span className="text-[11px] font-medium text-gray-700 truncate max-w-[100px]">
            {task.assignee_name || 'Unassigned'}
          </span>
        </div>

        {task.due_date && (
          <div className="flex items-center space-x-1 text-[11px] text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{task.due_date}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        <button
          onClick={() => onDeleteTask(task.id)}
          title="Delete Task"
          className="text-gray-400 hover:text-red-600 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center space-x-1">
          {task.status !== 'To-Do' && (
            <button
              onClick={() =>
                onMoveStatus(
                  task.id,
                  task.status === 'Done' ? 'In Progress' : 'To-Do'
                )
              }
              className="px-2 py-0.5 text-[11px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition flex items-center space-x-1"
            >
              <ArrowLeft className="w-3 h-3" />
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
              className="px-2 py-0.5 text-[11px] font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition flex items-center space-x-1"
            >
              <span>Next</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
