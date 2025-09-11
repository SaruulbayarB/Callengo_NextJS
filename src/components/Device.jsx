'use client'
import React, { useState } from 'react'
import { PlusCircle, Trash2, Edit } from 'lucide-react'

export default function Device() {
  const [devices, setDevices] = useState([
    {
      id: crypto.randomUUID(),
      name: 'Device 1',
      uuid: 'UUID-001',
      sim: 'SIM123',
      status: 'online',
      payment: 'Paid',
      expiryDate: '2025-12-31',
      isOpened: false
    },
    {
      id: crypto.randomUUID(),
      name: 'Device 2',
      uuid: 'UUID-002',
      sim: 'SIM456',
      status: 'offline',
      payment: 'Unpaid',
      expiryDate: '2025-11-15',
      isOpened: false
    }
  ])

  // State for popup form
  const [showForm, setShowForm] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    uuid: '',
    sim: '',
    payment: 'Paid',
    expiryDate: ''
  })

  // Open Add Device form
  const handleAddDevice = () => {
    setFormData({ name: '', uuid: '', sim: '', payment: 'Paid', expiryDate: '' })
    setEditIndex(null)
    setShowForm(true)
  }

  // Open Edit Device form
  const handleEditDevice = (index) => {
    setFormData(devices[index])
    setEditIndex(index)
    setShowForm(true)
  }

  // Save new or edited device
  const handleSave = () => {
    if (!formData.name || !formData.uuid || !formData.sim || !formData.expiryDate) {
      alert('Please fill in all fields')
      return
    }

    if (editIndex !== null) {
      const updated = devices.map((d, i) => (i === editIndex ? { ...formData } : d))
      setDevices(updated)
    } else {
      setDevices([
        ...devices,
        { ...formData, id: crypto.randomUUID(), status: 'offline', isOpened: false }
      ])
    }
    setShowForm(false)
  }

  // Delete device
  const handleDeleteDevice = (id) => {
    if (confirm('Delete this device?')) {
      setDevices(devices.filter((d) => d.id !== id))
    }
  }

  // Toggle open/close gate
  const handleOpenDevice = (id) => {
    setDevices(devices.map(d => d.id === id ? { ...d, isOpened: !d.isOpened } : d))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Devices</h1>
      <button
        onClick={handleAddDevice}
        className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-md mb-4 hover:bg-green-600"
      >
        <PlusCircle className="h-5 w-5" /> Add Device
      </button>

      {/* Device cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device, index) => (
          <div key={device.id} className="border rounded-md p-4 shadow-md bg-white flex flex-col justify-between h-64 hover:shadow-lg transition">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg">{device.name}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditDevice(index)}
                    className="text-indigo-500 hover:text-indigo-700"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteDevice(device.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p>UUID: {device.uuid}</p>
              <p>SIM: {device.sim}</p>
              <p>
                Status:{' '}
                <span
                  className={`inline-block w-3 h-3 rounded-full mr-1 ${
                    device.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></span>
                {device.status}
              </p>
              <p>
                Payment:{' '}
                <span className={`px-2 py-0.5 rounded text-white text-sm ${
                  device.payment === 'Paid' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  {device.payment}
                </span>
              </p>
              <p>Expiry Date: {device.expiryDate}</p>
            </div>

            {/* Open Gate button */}
            <button
              onClick={() => handleOpenDevice(device.id)}
              className={`mt-4 w-full py-3 rounded-md font-bold text-white transition-all duration-300 ${
                device.isOpened ? 'bg-blue-600 scale-105' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {device.isOpened ? 'Gate Opened' : 'Open Gate'}
            </button>
          </div>
        ))}
      </div>

      {/* Form Modal (light, no dark background) */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-6 rounded-lg w-96 shadow-2xl border pointer-events-auto">
            <h2 className="text-xl font-bold mb-4">{editIndex !== null ? 'Edit Device' : 'Add Device'}</h2>
            <input
              type="text"
              placeholder="Device Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              type="text"
              placeholder="UUID"
              value={formData.uuid}
              onChange={(e) => setFormData({ ...formData, uuid: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              type="text"
              placeholder="SIM Number"
              value={formData.sim}
              onChange={(e) => setFormData({ ...formData, sim: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <select
              value={formData.payment}
              onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            >
              <option>Paid</option>
              <option>Unpaid</option>
            </select>
            {/* Expiry Date */}
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="border p-2 w-full mb-4 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
