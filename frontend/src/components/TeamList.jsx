import React from 'react';
import { AlertTriangle, Users } from 'lucide-react';

export default function TeamList({ userWorkloads = [], overloadedUsersCount = 0 }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-800 text-sm">Team Workload ("Vibe Check")</h2>
        </div>
        {overloadedUsersCount > 0 ? (
          <div className="flex items-center space-x-1.5 text-xs font-semibold bg-red-50 text-red-700 px-2.5 py-1 rounded-full border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-bounce" />
            <span>{overloadedUsersCount} Team Member(s) Overloaded (&gt;5 In Progress)</span>
          </div>
        ) : (
          <span className="text-xs text-green-700 font-medium bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
            Workload Balanced
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {userWorkloads.length === 0 ? (
          <p className="text-xs text-gray-400">No team members assigned.</p>
        ) : (
          userWorkloads.map((user) => (
            <div
              key={user.userId}
              className={`flex items-center space-x-2.5 p-2 rounded-lg border transition ${
                user.isOverloaded
                  ? 'bg-red-50 border-red-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="relative">
                <img
                  src={user.avatarUrl}
                  alt={user.userName}
                  className={`w-9 h-9 rounded-full object-cover ${
                    user.isOverloaded ? 'avatar-pulse-red' : 'bg-gray-200'
                  }`}
                />
                {user.isOverloaded && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 border-2 border-white rounded-full"></span>
                )}
              </div>

              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-semibold text-gray-900">{user.userName}</span>
                  {user.isOverloaded && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 bg-red-100 px-1 rounded">
                      Burnout Risk
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-500">
                  <span className="font-semibold text-gray-700">{user.inProgressCount}</span> tasks in progress
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
