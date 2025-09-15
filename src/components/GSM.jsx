'use client'
import React, { useState } from 'react'
import { Power, RefreshCw } from 'lucide-react'

export default function GSM() {
  const [status, setStatus] = useState('online') // online/offline
  const [gateOpened, setGateOpened] = useState(false)
  const [loading, setLoading] = useState(false)

  const uid = 'reg070374605' // your device UID

  // Simulate sending a command to the device
  const sendCommand = async (command) => {
    setLoading(true)
    try {
      // Replace this with your real API call to control the device
      // Example:
      // await fetch(`/api/device/${uid}/command`, { method: 'POST', body: JSON.stringify({ command }) })

      await new Promise((resolve) => setTimeout(resolve, 1000)) // simulate network delay

      if (command === 'open') setGateOpened(true)
      if (command === 'close') setGateOpened(false)
      alert(`Command "${command}" sent successfully to device ${uid}`)
    } catch (err) {
      alert(`Failed to send command: ${err.message}`)
    }
    setLoading(false)
  }

  const refreshStatus = async () => {
    setLoading(true)
    try {
      // Simulate fetching status from API
      await new Promise((resolve) => setTimeout(resolve, 500))
      // Here we just keep the current values
      alert(`Device ${uid} is ${status}`)
    } catch (err) {
      alert('Failed to fetch status')
    }
    setLoading(false)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">GSM Device Control</h2>
      <p><strong>Device UID:</strong> {uid}</p>
      <p className="mb-2">
        <strong>Status:</strong>{' '}
        <span className={`inline-block w-3 h-3 rounded-full mr-1 ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
        {status}
      </p>
      <p className="mb-4"><strong>Gate:</strong> {gateOpened ? 'Opened' : 'Closed'}</p>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => sendCommand('open')}
          disabled={loading || gateOpened}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          <Power className="h-4 w-4" /> Open Gate
        </button>
        <button
          onClick={() => sendCommand('close')}
          disabled={loading || !gateOpened}
          className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
        >
          <Power className="h-4 w-4" /> Close Gate
        </button>
      </div>

      <button
        onClick={refreshStatus}
        disabled={loading}
        className="flex items-center gap-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50"
      >
        <RefreshCw className="h-4 w-4" /> Refresh Status
      </button>
    </div>
  )
}
