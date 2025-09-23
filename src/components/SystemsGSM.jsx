"use client";
import React, { useState } from "react";
import { sendDeviceCommand } from "./deviceAPI";

export default function SystemsGSM({ devices: initialDevices = [] }) {
  const [devices, setDevices] = useState(initialDevices);
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0);

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
      const newDevices = [...devices];
      newDevices[deviceIndex].status =
        response && response.startsWith("success:") ? "online" : "offline";
      setDevices(newDevices);
    } catch (error) {
      console.error("Device API error:", error.message);
    }
  };

  return (
    <div className="flex flex-col gap-2 overflow-y-auto max-h-[70vh]">
      {devices.map((device, index) => (
        <div
          key={device.uid}
          className={`border p-2 rounded shadow bg-white cursor-pointer ${
            index === selectedDeviceIndex ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => setSelectedDeviceIndex(index)}
        >
          <div className="flex justify-between items-center mb-1 text-sm">
            <div>
              <h3 className="font-semibold">{device.name} ({device.model})</h3>
              <p>UID: {device.uid}</p>
              <p>Status: <span className={device.status === "online" ? "text-green-600" : "text-red-600"}>{device.status}</span></p>
            </div>
          </div>

          {/* Admin Controls */}
          <div className="flex flex-wrap gap-1 mt-1 text-xs">
            <button onClick={() => handleCommand(index, 3, 0)} className="px-2 py-0.5 bg-gray-200 rounded hover:bg-gray-300">Change PW</button>
            <button onClick={() => handleCommand(index, 4, 0)} className="px-2 py-0.5 bg-blue-200 rounded hover:bg-blue-300">SMS Signal</button>
            <button onClick={() => handleCommand(index, 5, 0)} className="px-2 py-0.5 bg-green-200 rounded hover:bg-green-300">Relay Mode</button>
            <button onClick={() => handleCommand(index, 6, 0)} className="px-2 py-0.5 bg-purple-200 rounded hover:bg-purple-300">Relay Time</button>
            <button onClick={() => handleCommand(index, 1, 6)} className="px-2 py-0.5 bg-yellow-200 rounded hover:bg-yellow-300">JOG</button>
          </div>
        </div>
      ))}
    </div>
  );
}
