'use client'
import React, { useState } from 'react'
import { Edit, Slash } from 'lucide-react'

export default function DeviceControl({ families, onUpdateFamily }) {
  const [editIndex, setEditIndex] = useState(null)
  const [editField, setEditField] = useState('')
  const [editValue, setEditValue] = useState('')

  const handleStartEdit = (index, field) => {
    setEditIndex(index)
    setEditField(field)
    setEditValue(families[index][field] || '')
  }

  const handleSaveEdit = () => {
    if (editIndex !== null && editField) {
      onUpdateFamily(editIndex, { [editField]: editValue })
      setEditIndex(null)
      setEditField('')
      setEditValue('')
    }
  }

  const handleDisable = (index, field) => {
    // Set the field to empty or indicate access termination
    onUpdateFamily(index, { [field]: '' })
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Device Control</h2>
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">BLOCK</th>
            <th className="p-2 border">DOOR</th>
            <th className="p-2 border">NAME</th>
            <th className="p-2 border">CELLPHONE 1</th>
            <th className="p-2 border">CELLPHONE 2</th>
            <th className="p-2 border">VISITOR CELLPHONE</th>
            <th className="p-2 border">USERNAME</th>
            <th className="p-2 border">USERCODE</th>
            <th className="p-2 border">COMMENT</th>
            <th className="p-2 border">TOTAL MONTHLY FEE</th>
            <th className="p-2 border">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {families.map((fam, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="p-2 border">{fam.block}</td>
              <td className="p-2 border">{fam.door}</td>
              <td className="p-2 border">{fam.name}</td>

              {['mobile1', 'mobile2', 'visitorMobile', 'username', 'usercode'].map((field) => (
                <td key={field} className="p-2 border flex items-center gap-1">
                  {editIndex === i && editField === field ? (
                    <>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border border-gray-300 px-1 py-0.5 rounded w-full text-sm"
                      />
                      <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-800">✓</button>
                    </>
                  ) : (
                    <>
                      <span>{fam[field] || '-'}</span>
                      <button onClick={() => handleStartEdit(i, field)} className="text-indigo-500 hover:text-indigo-700"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDisable(i, field)} className="text-red-500 hover:text-red-700"><Slash className="h-4 w-4" /></button>
                    </>
                  )}
                </td>
              ))}

              <td className="p-2 border">{fam.comment || '-'}</td>
              <td className={`p-2 border ${fam.unpaidMonths > 3 ? 'bg-red-200' : ''}`}>{fam.monthlyFee || '-'}</td>
              <td className="p-2 border">
                {/* Optional: general actions */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
