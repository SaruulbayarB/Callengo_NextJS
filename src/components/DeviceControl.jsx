'use client'
import React from 'react';

export default function DeviceControl({ families, setFamilies }) {
  // Helper to pad slot numbers: 1 -> 0001
  const padSlot = (slot) => String(slot).padStart(4, '0');

  // Simulate sending command to GSM device
  const sendGSMCommand = (command) => {
    console.log('Sending command to GSM device:', command);
  };

  const handleRegisterToDevice = (index, field) => {
    const updated = [...families];
    const fam = updated[index];
    const slot = padSlot(fam.slot || index + 1);
    const number = fam[field];
    if (!number) return;
    const command = `SET${slot}#${number}`;
    sendGSMCommand(command);
    fam.deviceRegistered = true;
    setFamilies(updated);
  };

  const handleRemoveFromDevice = (index) => {
    const updated = [...families];
    const fam = updated[index];
    const slot = padSlot(fam.slot || index + 1);
    const command = `REMOVE${slot}`;
    sendGSMCommand(command);
    fam.deviceRegistered = false;
    setFamilies(updated);
  };

  const cellphoneFields = [
    { field: 'cellphone', label: 'Cellphone 1' },
    { field: 'mobile1', label: 'Cellphone 2' },
    { field: 'mobile2', label: 'Visitor Cellphone' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-4 py-2">Block</th>
            <th className="border px-4 py-2">Door</th>
            <th className="border px-4 py-2">Name</th>
            {cellphoneFields.map((c) => (
              <th key={c.field} className="border px-4 py-2">{c.label}</th>
            ))}
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">User Code</th>
            <th className="border px-4 py-2">Payment</th>
          </tr>
        </thead>
        <tbody>
          {families.map((fam, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{fam.block || '-'}</td>
              <td className="border px-4 py-2">{fam.door || '-'}</td>
              <td className="border px-4 py-2">{fam.name || '-'}</td>

              {cellphoneFields.map(({ field }) => (
                <td key={field} className="border px-2 py-1">
                  <div className="flex items-center gap-1">
                    <span className="truncate">{fam[field] || '-'}</span>
                    {fam[field] && (
                      <>
                        <button
                          onClick={() => handleRegisterToDevice(index, field)}
                          className="bg-green-500 text-white px-1 py-0.5 rounded text-xs"
                        >
                          Register
                        </button>
                        <button
                          onClick={() => handleRemoveFromDevice(index)}
                          className="bg-red-500 text-white px-1 py-0.5 rounded text-xs"
                        >
                          Disable
                        </button>
                      </>
                    )}
                  </div>
                </td>
              ))}

              <td className="border px-4 py-2">{fam.username || '-'}</td>
              <td className="border px-4 py-2">{fam.usercode || '-'}</td>
              <td className="border px-4 py-2">{fam.payment || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
