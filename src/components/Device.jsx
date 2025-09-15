"use client";
import React, { useState } from "react";
import { sendDeviceCommand } from "./deviceAPI";
import { Pencil, Trash, Plus } from "lucide-react";

const Device = () => {
  const mainDeviceUID = "reg070374605"; // Always present main device
  const [devices, setDevices] = useState([
    {
      name: "Main Device",
      model: "GL1-WLTE",
      uid: mainDeviceUID,
      sim: "",
      expiry: "",
      channels: 1,
      status: "offline",
      channelStatus: [0],
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({
    name: "",
    model: "SM1-WLTE",
    uid: "",
    sim: "",
    expiry: "",
    channels: 1,
  });

  // Handle device commands
  const handleCommand = async (deviceIndex, cmdtype, cmdparam, controlnum = 0) => {
    const device = devices[deviceIndex];
    try {
      const response = await sendDeviceCommand({
        deviceuid: device.uid,
        cmdtype,
        cmdparam,
        ChannelNum: device.channels,
        controlnum,
      });
      console.log("Device response:", response);

      const newDevices = [...devices];
      newDevices[deviceIndex].status = response && response.startsWith("success:") ? "online" : "offline";
      setDevices(newDevices);
    } catch (error) {
      console.error("Device API error:", error.message);
    }
  };

  // Add/Edit device modal
  const handleAddEditDevice = (index = null) => {
    if (index !== null) {
      setForm(devices[index]);
      setEditIndex(index);
    } else {
      setForm({ name: "", model: "SM1-WLTE", uid: "", sim: "", expiry: "", channels: 1 });
      setEditIndex(null);
    }
    setShowModal(true);
  };

  // Save device from modal
  const handleSaveDevice = () => {
    const newDevice = { ...form, status: "offline", channelStatus: Array(form.channels).fill(0) };
    if (editIndex !== null) {
      const newDevices = [...devices];
      newDevices[editIndex] = newDevice;
      setDevices(newDevices);
    } else {
      setDevices([...devices, newDevice]);
    }
    setShowModal(false);
  };

  // Delete device
  const handleDeleteDevice = (index) => {
    const newDevices = [...devices];
    newDevices.splice(index, 1);
    setDevices(newDevices);
  };

  return (
    <div className="p-4 flex justify-left">
      <div className="w-120">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Devices</h2>
          <button
            onClick={() => handleAddEditDevice()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            <Plus className="w-4 h-4" /> Add Device
          </button>
        </div>

        {/* Device list */}
        {devices.map((device, index) => (
          <div key={index} className="border p-4 mb-4 rounded shadow bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold mb-1">{device.name} ({device.model})</h3>
                <p>Device UID: {device.uid}</p>
                <p>Status: <span className={device.status === "online" ? "text-green-600" : "text-red-600"}>{device.status}</span></p>
                {/* Barrier indicator */}
                <div className={`w-20 h-4 mt-1 rounded ${device.channelStatus[0] === 1 ? "bg-green-500" : "bg-gray-300"}`}></div>
              </div>
              <div className="flex gap-2 mt-1">
                <button onClick={() => handleAddEditDevice(index)} className="p-1 bg-yellow-300 rounded hover:bg-yellow-400">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteDevice(index)} className="p-1 bg-red-400 rounded hover:bg-red-500">
                  <Trash className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex gap-2 my-2 flex-wrap">
              {device.model.startsWith("SM") && (
                <>
                  <button onClick={() => handleCommand(index, 1, 1)} className="px-3 py-1 bg-blue-400 text-white rounded hover:bg-blue-500">Refresh All</button>
                  <button onClick={() => handleCommand(index, 1, 2)} className="px-3 py-1 bg-green-400 text-white rounded hover:bg-green-500">All ON</button>
                  <button onClick={() => handleCommand(index, 1, 3)} className="px-3 py-1 bg-red-400 text-white rounded hover:bg-red-500">All OFF</button>
                </>
              )}
              <button onClick={() => handleCommand(index, 2, 0)} className="px-3 py-1 bg-yellow-300 text-black rounded hover:bg-yellow-400">Check Online</button>
              <button onClick={() => handleCommand(index, 1, 6)} className="px-3 py-1 bg-purple-400 text-white rounded hover:bg-purple-500">JOG</button>
            </div>

            {/* Channel controls */}
            <div className="flex gap-4 mt-2 flex-wrap">
              {Array(device.channels).fill(0).map((_, chIndex) => (
                <div key={chIndex} className="flex flex-col items-center">
                  <span>Channel {chIndex + 1}</span>
                  <div className="flex gap-1 mt-1">
                    {device.model.startsWith("SM") && (
                      <>
                        <button onClick={() => handleCommand(index, 1, 4, chIndex + 1)} className="px-2 py-1 bg-green-300 rounded hover:bg-green-400">ON</button>
                        <button onClick={() => handleCommand(index, 1, 5, chIndex + 1)} className="px-2 py-1 bg-red-300 rounded hover:bg-red-400">OFF</button>
                      </>
                    )}
                    <button onClick={() => handleCommand(index, 1, 6, chIndex + 1)} className="px-2 py-1 bg-yellow-300 rounded hover:bg-yellow-400">JOG</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Modal for Add/Edit Device */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-bold mb-4">{editIndex !== null ? "Edit Device" : "Add Device"}</h3>
              <div className="flex flex-col gap-2">
                <input type="text" placeholder="Device Name" className="border p-2 rounded" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                
                <select className="border p-2 rounded" value={form.model} onChange={(e) => setForm({
                  ...form,
                  model: e.target.value,
                  channels: e.target.value.startsWith("SM") ? 4 : 1
                })}>
                  <option value="SM1-WLTE">SM1-WLTE</option>
                  <option value="GL1-WLTE">GL1-WLTE</option>
                </select>

                <input type="text" placeholder="Device UID" className="border p-2 rounded" value={form.uid} onChange={(e) => setForm({ ...form, uid: e.target.value })} />
                <input type="text" placeholder="SIM Number" className="border p-2 rounded" value={form.sim} onChange={(e) => setForm({ ...form, sim: e.target.value })} />
                <input type="date" className="border p-2 rounded" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
                <button onClick={handleSaveDevice} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Device;
