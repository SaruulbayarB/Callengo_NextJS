"use client";
import React, { useState } from "react";
import SystemsGSM from "./SystemsGSM"; // Reusable component

export default function SystemsClients() {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);

  // Forms
  const [clientForm, setClientForm] = useState({ name: "", area: "" });
  const [deviceForm, setDeviceForm] = useState({ name: "", uid: "", model: "SM1-WLTE", sim: "", channels: 1 });

  // Add Client
  const addClient = () => {
    if (!clientForm.name || !clientForm.area) return;
    setClients([
      ...clients,
      { id: crypto.randomUUID(), ...clientForm, devices: [] }
    ]);
    setClientForm({ name: "", area: "" });
  };

  // Add Device to selected client
  const addDeviceToClient = () => {
    if (!selectedClientId || !deviceForm.uid || !deviceForm.name) return;
    setClients(clients.map(c => 
      c.id === selectedClientId 
        ? { ...c, devices: [...c.devices, { ...deviceForm, status: "offline", plates: [] }]}
        : c
    ));
    setDeviceForm({ name: "", uid: "", model: "SM1-WLTE", sim: "", channels: 1 });
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="flex gap-4">
      {/* LEFT: Clients List */}
      <div className="w-64 p-2 border-r border-gray-300 flex flex-col gap-2">
        <h2 className="font-bold mb-2">Clients</h2>
        {clients.map(client => (
          <button
            key={client.id}
            onClick={() => setSelectedClientId(client.id)}
            className={`text-left px-2 py-1 rounded ${selectedClientId === client.id ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
          >
            {client.name} ({client.area})
          </button>
        ))}

        {/* Add Client Form */}
        <div className="mt-4 flex flex-col gap-1">
          <input
            type="text"
            placeholder="Client Name"
            value={clientForm.name}
            onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
            className="border p-1 rounded"
          />
          <input
            type="text"
            placeholder="Area"
            value={clientForm.area}
            onChange={(e) => setClientForm({ ...clientForm, area: e.target.value })}
            className="border p-1 rounded"
          />
          <button onClick={addClient} className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500 mt-1">Add Client</button>
        </div>
      </div>

      {/* RIGHT: Selected Client Devices */}
      <div className="flex-1 p-2 flex flex-col gap-2">
        {selectedClient ? (
          <>
            <h2 className="font-bold">{selectedClient.name} Devices</h2>

            {/* Add Device Form */}
            <div className="flex gap-2 flex-wrap items-center mb-2">
              <input
                type="text"
                placeholder="Device Name"
                value={deviceForm.name}
                onChange={(e) => setDeviceForm({ ...deviceForm, name: e.target.value })}
                className="border p-1 rounded text-sm"
              />
              <input
                type="text"
                placeholder="UID"
                value={deviceForm.uid}
                onChange={(e) => setDeviceForm({ ...deviceForm, uid: e.target.value })}
                className="border p-1 rounded text-sm"
              />
              <select
                value={deviceForm.model}
                onChange={(e) => setDeviceForm({ ...deviceForm, model: e.target.value })}
                className="border p-1 rounded text-sm"
              >
                <option value="SM1-WLTE">SM1-WLTE</option>
                <option value="GL1-WLTE">GL1-WLTE</option>
              </select>
              <input
                type="text"
                placeholder="SIM"
                value={deviceForm.sim}
                onChange={(e) => setDeviceForm({ ...deviceForm, sim: e.target.value })}
                className="border p-1 rounded text-sm"
              />
              <input
                type="number"
                min={1}
                max={4}
                value={deviceForm.channels}
                onChange={(e) => setDeviceForm({ ...deviceForm, channels: Number(e.target.value) })}
                className="border p-1 rounded text-sm w-16"
              />
              <button onClick={addDeviceToClient} className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-500">Add Device</button>
            </div>

            {/* Devices List using SystemsGSM */}
            <SystemsGSM devices={selectedClient.devices} />
          </>
        ) : (
          <div>Select a client to view devices</div>
        )}
      </div>
    </div>
  );
}
