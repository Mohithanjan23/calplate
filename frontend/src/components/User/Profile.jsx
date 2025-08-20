// D:\calplate\frontend\src\components\User\Profile.jsx
import React from "react";

const Profile = ({ user }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4">👤 Profile</h2>
        {user ? (
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {user.name}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Age:</span> {user.age}</p>
            <p><span className="font-medium">Weight:</span> {user.weight} kg</p>
            <p><span className="font-medium">Height:</span> {user.height} cm</p>
            <p><span className="font-medium">Goal:</span> {user.goal}</p>
          </div>
        ) : (
          <p className="text-gray-500">No user data found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
