"use client";
import React, { useState } from "react";

const Camera = () => {
  const [slots, setSlots] = useState([]);
  const [search, setSearch] = useState("");

  const handleAdd = () => {
    setSlots([
      ...slots,
      {
        license: "",
        startDate: "",
        expiryDate: "",
        name: "",
        comment: "",
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  const handleDelete = (index) => {
    const newSlots = [...slots];
    newSlots.splice(index, 1);
    setSlots(newSlots);
  };

  const handleEnable = (index) => {
    const newSlots = [...slots];
    newSlots[index].expiryDate = "";
    setSlots(newSlots);
  };

  const handleDisable = (index) => {
    const newSlots = [...slots];
    newSlots[index].expiryDate = "2022-02-02";
    setSlots(newSlots);
  };

  const handleCheck = (index) => {
    const number = slots[index].license || "N/A";
    alert(`Checked license for slot ${index + 1}: ${number}`);
  };

  const filteredSlots = slots.filter((slot) =>
    slot.license.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Search and Add */}
      <div className="flex justify-left items-center gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded w-40"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-500 ml-140"
        >
          +Add
        </button>
      </div>

      {/* Slots Table - aligned left and narrower */}
      <div className="overflow-x-auto max-h-[500px] border rounded shadow w-[800px]">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="border px-1 py-1">#</th>
              <th className="border px-1 py-1">License Plate</th>
              <th className="border px-1 py-1">Start Date</th>
              <th className="border px-1 py-1">Expiry Date</th>
              <th className="border px-1 py-1">Name</th>
              <th className="border px-1 py-1">Comment</th>
              <th className="border px-1 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSlots.length === 0 ? (
              <tr>
                <td className="px-1 py-1 border text-center" colSpan={7}>
                  No plates added yet
                </td>
              </tr>
            ) : (
              filteredSlots.map((slot, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-1 py-1 border text-center">{index + 1}</td>
                  <td className="px-1 py-1 border">
                    <input
                      type="text"
                      value={slot.license}
                      onChange={(e) => handleChange(index, "license", e.target.value)}
                      className="w-20 border px-1 py-0.5 rounded"
                    />
                  </td>
                  <td className="px-1 py-1 border">
                    <input
                      type="date"
                      value={slot.startDate}
                      onChange={(e) => handleChange(index, "startDate", e.target.value)}
                      className="w-24 border px-1 py-0.5 rounded"
                    />
                  </td>
                  <td className="px-1 py-1 border">
                    <input
                      type="date"
                      value={slot.expiryDate}
                      onChange={(e) => handleChange(index, "expiryDate", e.target.value)}
                      className="w-24 border px-1 py-0.5 rounded"
                    />
                  </td>
                  <td className="px-1 py-1 border">
                    <input
                      type="text"
                      value={slot.name}
                      onChange={(e) => handleChange(index, "name", e.target.value)}
                      className="w-20 border px-1 py-0.5 rounded"
                    />
                  </td>
                  <td className="px-1 py-1 border">
                    <input
                      type="text"
                      value={slot.comment}
                      onChange={(e) => handleChange(index, "comment", e.target.value)}
                      className="w-28 border px-1 py-0.5 rounded"
                    />
                  </td>
                  <td className="px-1 py-1 border flex gap-1 justify-center flex-wrap">
                    <button
                      onClick={() => handleEnable(index)}
                      className="px-1 py-0.5 bg-green-300 rounded hover:bg-green-400"
                    >
                      Enable
                    </button>
                    <button
                      onClick={() => handleDisable(index)}
                      className="px-1 py-0.5 bg-yellow-300 rounded hover:bg-yellow-400"
                    >
                      Disable
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="px-1 py-0.5 bg-red-400 rounded hover:bg-red-500 text-white"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleCheck(index)}
                      className="px-1 py-0.5 bg-blue-400 rounded hover:bg-blue-500 text-white"
                    >
                      Check
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Camera;
