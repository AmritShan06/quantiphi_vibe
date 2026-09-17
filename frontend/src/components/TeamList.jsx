import React from 'react';
import { AlertTriangle, Users, Flame, CheckCircle2 } from 'lucide-react';

export default function TeamList({ userWorkloads = [], overloadedUsersCount = 0 }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-2">
              Workload Balancing <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">The Vibe Check</span>
            </h2>
            <p className="text-xs text-slate-500">Monitors active 'In Progress' tasks to prevent team burnout</p>
          </div>
        </div>

        {overloadedUsersCount > 0 ? (
          <div className="flex items-center space-x-2 text-xs font-bold bg-red-50 text-red-700 px-3 py-1.5 rounded-lg border border-red-200">
            <AlertTriangle className="w-4 h-4 text-red-600 animate-bounce" />
            <span>Warning: {overloadedUsersCount} User(s) Overloaded (&gt; 5 In Progress)</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Optimal Team Workload Distribution</span>
          </div>
        )}
      </div>

      {/* Team Member Avatars & Workload Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {userWorkloads.length === 0 ? (
          <p className="text-xs text-slate-400 italic col-span-full">No team members assigned to this project.</p>
        ) : (
          userWorkloads.map((user) => (
            <div
              key={user.userId}
              className={`flex items-center space-x-3 p-3 rounded-xl border transition-all ${
                user.isOverloaded
                  ? 'bg-red-50/80 border-red-300 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {/* User Avatar with Pulse Red Animation if overloaded > 5 tasks */}
              <div className="relative flex-shrink-0">
                <img
                  src={user.avatarUrl}
                  alt={user.userName}
                  className={`w-11 h-11 rounded-full object-cover shadow-xs ${
                    user.isOverloaded ? 'avatar-pulse-red' : 'bg-slate-200 border-2 border-white'
                  }`}
                />
                {user.isOverloaded && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 border-2 border-white rounded-full flex items-center justify-center">
                    <Flame className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{user.userName}</h4>
                  {user.isOverloaded && (
                    <span className="text-[9px] font-black uppercase text-red-600 bg-red-100 border border-red-200 px-1.5 py-0.5 rounded">
                      Burnout
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
                  <span>In Progress:</span>
                  <span className={`font-extrabold text-xs ${user.isOverloaded ? 'text-red-700' : 'text-slate-700'}`}>
                    {user.inProgressCount} tasks
                  </span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
