"use client";
import React, { useState, useEffect } from "react";

const GSMControl = ({ deviceName, deviceUID }) => {
  const totalSlots = 1000; // total slots
  const [numbers, setNumbers] = useState(Array(totalSlots).fill("")); // store number per slot
  const [search, setSearch] = useState("");
  const [filteredSlots, setFilteredSlots] = useState([]);

  useEffect(() => {
    // Initialize filteredSlots
    const slots = Array.from({ length: totalSlots }, (_, i) => ({
      slot: i + 1,
      number: "",
    }));
    setFilteredSlots(slots);
    setNumbers(Array(totalSlots).fill(""));
  }, [deviceUID]);

  const handleNumberChange = (slotIndex, value) => {
    const newNumbers = [...numbers];
    newNumbers[slotIndex] = value;
    setNumbers(newNumbers);
  };

  const handleRegister = (slotIndex) => {
    console.log(`Register ${numbers[slotIndex]} at slot ${slotIndex + 1} on device ${deviceUID}`);
    // call API if needed
  };

  const handleDelete = (slotIndex) => {
    const newNumbers = [...numbers];
    newNumbers[slotIndex] = "";
    setNumbers(newNumbers);
    console.log(`Deleted slot ${slotIndex + 1} on device ${deviceUID}`);
  };

  const handleCheck = (slotIndex) => {
    console.log(`Check slot ${slotIndex + 1} on device ${deviceUID}`);
    alert(`Slot ${slotIndex + 1}: ${numbers[slotIndex] || "empty"}`);
  };

  // Search filter
  const displayedSlots = filteredSlots.filter((slotObj, idx) =>
    numbers[idx].includes(search)
  );

  return (
    <div className="border p-2 rounded shadow bg-white h-[80vh] overflow-auto">
      <h3 className="text-lg font-bold mb-2">Device: {deviceName} ({deviceUID})</h3>

      {/* Search */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-1 rounded w-40"
        />
      </div>

      <table className="w-full text-sm table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Slot</th>
            <th className="border px-2 py-1">Cellphone Number</th>
            <th className="border px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedSlots.map((slotObj, idx) => (
            <tr key={slotObj.slot} className="border-b">
              <td className="border px-2 py-1">{slotObj.slot}</td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={numbers[slotObj.slot - 1]}
                  onChange={(e) => handleNumberChange(slotObj.slot - 1, e.target.value)}
                  className="border p-1 rounded w-full"
                />
              </td>
              <td className="border px-2 py-1 flex gap-1">
                <button
                  onClick={() => handleRegister(slotObj.slot - 1)}
                  className="px-2 py-1 bg-green-400 text-white rounded hover:bg-green-500"
                >
                  Register
                </button>
                <button
                  onClick={() => handleDelete(slotObj.slot - 1)}
                  className="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleCheck(slotObj.slot - 1)}
                  className="px-2 py-1 bg-blue-400 text-white rounded hover:bg-blue-500"
                >
                  Check
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GSMControl;
