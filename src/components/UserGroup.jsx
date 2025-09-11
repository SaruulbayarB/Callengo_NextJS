"use client";
import React, { useState } from "react";

const allMenuItems = [
  "Clients",
  "Systems",
  "Devices",
  "Registration",
  "User Management",
  "User Group",
  "Help",
  "Report",
];

export default function UserGroup() {
  const [userGroups, setUserGroups] = useState({
    admin: {
      name: "Administrator",
      users: ["Alice", "Bob"],
      permissions: allMenuItems, // full access
    },
    operator: {
      name: "Operator",
      users: ["Charlie", "David"],
      permissions: ["Devices", "Registration", "Help", "Report"],
    },
  });

  const [activeGroup, setActiveGroup] = useState("admin");
  const [newUser, setNewUser] = useState("");

  // Toggle access for menus
  const togglePermission = (groupKey, permission) => {
    setUserGroups((prev) => {
      const group = prev[groupKey];
      const hasPermission = group.permissions.includes(permission);
      const updatedPerms = hasPermission
        ? group.permissions.filter((p) => p !== permission)
        : [...group.permissions, permission];
      return {
        ...prev,
        [groupKey]: { ...group, permissions: updatedPerms },
      };
    });
  };

  // Add user under current group
  const handleAddUser = () => {
    if (!newUser.trim()) return;
    setUserGroups((prev) => {
      const group = prev[activeGroup];
      return {
        ...prev,
        [activeGroup]: {
          ...group,
          users: [...group.users, newUser.trim()],
        },
      };
    });
    setNewUser("");
  };

  // Delete user
  const handleDeleteUser = (index) => {
    setUserGroups((prev) => {
      const group = prev[activeGroup];
      return {
        ...prev,
        [activeGroup]: {
          ...group,
          users: group.users.filter((_, i) => i !== index),
        },
      };
    });
  };

  return (
    <div className="w-full px-1">
      <h1 className="text-3xl font-bold mb-4">User Group Management</h1>

      {/* Group Selector */}
      <div className="flex gap-2 mb-6">
        {Object.keys(userGroups).map((key) => (
          <button
            key={key}
            onClick={() => setActiveGroup(key)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              activeGroup === key
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {userGroups[key].name}
          </button>
        ))}
      </div>

      {/* Users Section */}
      <div className="mb-6 bg-white rounded-lg p-4 shadow border">
        <h2 className="font-semibold mb-3">
          Users in {userGroups[activeGroup].name}
        </h2>

        {/* Add new user */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            placeholder="Enter username"
            className="border rounded-md px-2 py-1 text-sm flex-1"
          />
          <button
            onClick={handleAddUser}
            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm"
          >
            Add
          </button>
        </div>

        {/* User List */}
        <ul className="space-y-1">
          {userGroups[activeGroup].users.map((user, i) => (
            <li
              key={i}
              className="flex justify-between items-center px-2 py-1 border rounded-md bg-gray-50"
            >
              <span className="text-gray-700 text-sm">{user}</span>
              <button
                onClick={() => handleDeleteUser(i)}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Permissions Section */}
      <div className="bg-white rounded-lg p-4 shadow border">
        <h2 className="font-semibold mb-3">Permissions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {allMenuItems.map((item) => (
            <label key={item} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={userGroups[activeGroup].permissions.includes(item)}
                onChange={() => togglePermission(activeGroup, item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
