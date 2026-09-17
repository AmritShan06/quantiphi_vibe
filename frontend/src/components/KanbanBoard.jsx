import React from 'react';
import TaskCard from './TaskCard';

const COLUMNS = [
  {
    id: 'To-Do',
    label: 'To-Do',
    dotBg: 'bg-slate-400',
    headerBg: 'bg-slate-100/80 text-slate-800 border-slate-200',
    countBadge: 'bg-slate-200 text-slate-900'
  },
  {
    id: 'In Progress',
    label: 'In Progress',
    dotBg: 'bg-amber-500',
    headerBg: 'bg-amber-50/80 text-amber-900 border-amber-200',
    countBadge: 'bg-amber-200 text-amber-950 font-black'
  },
  {
    id: 'Done',
    label: 'Done',
    dotBg: 'bg-emerald-500',
    headerBg: 'bg-emerald-50/80 text-emerald-900 border-emerald-200',
    countBadge: 'bg-emerald-200 text-emerald-950 font-black'
  }
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);
        const count = columnCounts[col.id] !== undefined ? columnCounts[col.id] : columnTasks.length;

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 flex flex-col min-h-[550px] shadow-2xs"
          >
            {/* Column Header with Task Counter Badge */}
            <div className={`flex items-center justify-between p-3 rounded-xl border mb-4 ${col.headerBg}`}>
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dotBg}`}></span>
                <h3 className="font-extrabold text-sm tracking-tight">{col.label}</h3>
              </div>
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full shadow-2xs ${col.countBadge}`}>
                {count} {count === 1 ? 'task' : 'tasks'}
              </span>
            </div>

            {/* Task List Container */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {columnTasks.length === 0 ? (
                <div className="h-36 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-xs text-slate-400 p-4 text-center">
                  <p className="font-semibold text-slate-500">No tasks in {col.label}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Drag and drop task cards here</p>
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
