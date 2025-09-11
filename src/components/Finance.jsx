"use client";
import React, { useState } from "react";

export default function Finance() {
  const initialItems = [
    { id: 1, name: "Water", amount: 50 },
    { id: 2, name: "Cleaning", amount: 30 },
    { id: 3, name: "Security", amount: 80 },
    { id: 4, name: "Maintenance", amount: 100 },
    { id: 5, name: "Software Fee", amount: 20 },
    { id: 6, name: "Lighting", amount: 40 },
    { id: 7, name: "Elevator", amount: 40 },
    { id: 8, name: "Trash loading", amount: 40 },
    { id: 9, name: "Printing", amount: 40 },
    { id: 10, name: "Other", amount: 40 },
    
  ];

  const [items, setItems] = useState(initialItems);
  const [editedItems, setEditedItems] = useState(initialItems);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (id, key, value) => {
    setEditedItems(editedItems.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  };

  const handleSave = () => {
    setItems(editedItems);
    setIsEditing(false);
  };

  const totalAmount = editedItems.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Monthly Breakdown</h2>
        {!isEditing ? (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        ) : (
          <button
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
            onClick={handleSave}
          >
            Save
          </button>
        )}
      </div>

      <table className="w-full border-collapse bg-white rounded shadow text-sm">
        <thead>
          <tr className="bg-gray-200 text-xs">
            <th className="border p-1">Item</th>
            <th className="border p-1">Amount (MNT)</th>
          </tr>
        </thead>
        <tbody>
          {editedItems.map((item) => (
            <tr key={item.id}>
              <td className="border p-1">
                {isEditing ? (
                  <input
                    value={item.name}
                    onChange={(e) => handleEdit(item.id, "name", e.target.value)}
                    className="border px-1 py-0 w-full text-xs"
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="border p-1">
                {isEditing ? (
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleEdit(item.id, "amount", parseFloat(e.target.value))}
                    className="border px-1 py-0 w-full text-xs"
                  />
                ) : (
                  item.amount
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-2 font-bold text-sm">Total: ${totalAmount}</p>
    </div>
  );
}
