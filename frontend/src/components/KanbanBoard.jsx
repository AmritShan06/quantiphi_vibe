import React from 'react';
import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'To-Do', label: 'To-Do', headerBg: 'bg-slate-100 border-slate-300 text-slate-700', badgeBg: 'bg-slate-200 text-slate-800' },
  { id: 'In Progress', label: 'In Progress', headerBg: 'bg-amber-50 border-amber-300 text-amber-800', badgeBg: 'bg-amber-200 text-amber-900' },
  { id: 'Done', label: 'Done', headerBg: 'bg-emerald-50 border-emerald-300 text-emerald-800', badgeBg: 'bg-emerald-200 text-emerald-900' }
];

export default function KanbanBoard({
  tasks = [],
  columnCounts = {},
  onMoveStatus,
  onDeleteTask
}) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onMoveStatus(taskId, columnStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);
        const count = columnCounts[col.id] !== undefined ? columnCounts[col.id] : columnTasks.length;

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col min-h-[500px] shadow-sm"
          >
            <div className={`flex items-center justify-between p-2.5 rounded-lg border mb-4 ${col.headerBg}`}>
              <h3 className="font-bold text-sm tracking-wide">{col.label}</h3>
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${col.badgeBg}`}>
                {count}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {columnTasks.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                  Drop tasks here
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onMoveStatus={onMoveStatus}
                    onDeleteTask={onDeleteTask}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
