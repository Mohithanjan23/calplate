// D:\calplate\frontend\src\components\User\Reminders.jsx
import React, { useState } from "react";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [time, setTime] = useState("");

  const addReminder = () => {
    if (!time) return;
    setReminders([...reminders, { id: Date.now(), time }]);
    setTime("");
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4">⏰ Meal Reminders</h2>

        <div className="flex space-x-3 mb-4">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={addReminder}
            className="bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
            >
              <span className="font-medium">{reminder.time}</span>
              <button
                onClick={() =>
                  setReminders(reminders.filter((r) => r.id !== reminder.id))
                }
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          {reminders.length === 0 && (
            <p className="text-gray-500 text-sm">No reminders set.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminders;
