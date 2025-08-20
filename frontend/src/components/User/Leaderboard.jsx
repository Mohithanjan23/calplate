// D:\calplate\frontend\src\components\User\Leaderboard.jsx
import React from "react";

const Leaderboard = ({ users = [] }) => {
  const sortedUsers = [...users].sort(
    (a, b) => b.streak - a.streak
  );

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4">🏆 Leaderboard</h2>
        <div className="space-y-3">
          {sortedUsers.length > 0 ? (
            sortedUsers.map((u, idx) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-green-600">
                    #{idx + 1}
                  </span>
                  <span className="font-medium">{u.name}</span>
                </div>
                <span className="text-gray-600">{u.streak} days streak</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center">
              No leaderboard data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
