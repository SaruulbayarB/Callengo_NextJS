'use client'
import React, { useState, useEffect } from 'react'
import { Ban, CheckCircle2 } from 'lucide-react'

export default function DeviceControl({ selectedBlock }) {
  const [devices, setDevices] = useState([]) // start empty
  const [blockDevices, setBlockDevices] = useState([])

  useEffect(() => {
    // Filter devices for the selected block, safely
    const filtered = (devices || []).filter(dev => dev.block === selectedBlock)
    setBlockDevices(filtered)
  }, [devices, selectedBlock])

  // Add a new device (for demo)
  const addDevice = () => {
    const newDevice = {
      id: devices.length + 1,
      block: selectedBlock,
      door: '001',
      name: 'New User',
      phone: '',
      status: 'enabled',
    }
    setDevices(prev => [...prev, newDevice])
  }

  const toggleStatus = (id, newStatus) => {
    setDevices(prev =>
      prev.map(dev => (dev.id === id ? { ...dev, status: newStatus } : dev))
    )
  }

  return (
    <div className="overflow-x-auto p-2">
      <h2 className="text-lg font-semibold mb-2">Device Control</h2>
      <p className="text-sm text-gray-600 mb-4">
        Register and manage devices for the client here.
      </p>

      <button
        onClick={addDevice}
        className="mb-4 px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
      >
        Add Device
      </button>

      <table className="w-full border border-gray-300 rounded-md text-sm">
        <thead className="bg-gray-50 uppercase font-medium tracking-wide">
          <tr>
            <th className="border px-2 py-1">Block</th>
            <th className="border px-2 py-1">Door#</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blockDevices.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No devices found for this block
              </td>
            </tr>
          ) : (
            blockDevices.map(dev => (
              <tr key={dev.id} className="text-center hover:bg-gray-50">
                <td className="border px-2 py-1">{dev.block}</td>
                <td className="border px-2 py-1">{dev.door}</td>
                <td className="border px-2 py-1">{dev.name}</td>
                <td className="border px-2 py-1">{dev.phone || '-'}</td>
                <td className="border px-2 py-1">
                  <span
                    className={
                      dev.status === 'enabled' ? 'text-green-600' : 'text-red-500'
                    }
                  >
                    {dev.status}
                  </span>
                </td>
                <td className="border px-2 py-1 flex justify-center gap-2">
                  <button
                    onClick={() => toggleStatus(dev.id, 'disabled')}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Ban size={16} /> Disable
                  </button>
                  <button
                    onClick={() => toggleStatus(dev.id, 'enabled')}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-600 hover:bg-green-100"
                  >
                    <CheckCircle2 size={16} /> Enable
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
