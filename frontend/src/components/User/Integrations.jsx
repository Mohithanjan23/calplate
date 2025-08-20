// D:\calplate\frontend\src\components\User\Integrations.jsx
import React, { useState } from "react";

const Integrations = () => {
  const [connected, setConnected] = useState(false);

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4">🔗 Wearables & Integrations</h2>
        <p className="text-gray-600 mb-4">
          Connect your fitness tracker to sync calorie burn and activity data.
        </p>
        <button
          onClick={() => setConnected(!connected)}
          className={`px-4 py-3 rounded-lg font-medium ${
            connected
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {connected ? "Disconnect" : "Connect Wearable"}
        </button>
      </div>
    </div>
  );
};

export default Integrations;
