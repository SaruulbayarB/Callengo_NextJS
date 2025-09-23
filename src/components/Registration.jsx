'use client'
import React, { useState } from 'react'
import { PlusCircle, Edit, Trash2 } from 'lucide-react'
import MonthlyPayment from './MonthlyPayment'
import DeviceControl from "./DeviceControl";

export default function Registration() {
  const [clientName, setClientName] = useState('')
  const [activeTab, setActiveTab] = useState('family') // family, device, camera, payment

  /** BLOCK & FAMILY STATE **/
  const [blocks, setBlocks] = useState(['Block A', 'Block B', 'Block C'])
  const [selectedBlock, setSelectedBlock] = useState(blocks[0])
  const [blockSearch, setBlockSearch] = useState('')
  const [families, setFamilies] = useState([
    { 
      name: 'John Doe',
      floor: 1,
      door: '1',
      cellphone: '123456789',
      car: 'ABC123',
      mobile1: '111111',
      mobile2: '222222',
      storage: 'S1',
      parking: 'P1',
      realEstate: 'RE-001',
      block: 'Block A',
      username: '',
      usercode: '',
      comment: '',
      monthlyFee: '',
      unpaidMonths: 0
    },
  ])
  const [addFamilyOpen, setAddFamilyOpen] = useState(false)
  const [newFamily, setNewFamily] = useState({ 
    block: selectedBlock, name: '', floor: '', door: '', cellphone: '', 
    car: '', mobile1: '', mobile2: '', storage: '', parking: '', realEstate: '',
    username: '', usercode: '', comment: '', monthlyFee: '', unpaidMonths: 0
  })
  const [newBlockName, setNewBlockName] = useState('')
  const [editIndex, setEditIndex] = useState(null)

  /** PAGINATION & SEARCH **/
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [columnSearch, setColumnSearch] = useState({ block: '', door: '', name: '', floor: '', cellphone: '', car: '', mobile1: '', mobile2: '', storage: '', parking: '', realEstate: '' })

  /** MENU/TABS **/
  const tabs = [
    { id: 'family', label: 'Family' },
    { id: 'device', label: 'Device Control' },
    { id: 'camera', label: 'Camera Control' },
    { id: 'payment', label: 'Payment' },
  ]

  /** FAMILY HANDLERS **/
  const handleAddFamily = () => {
    if (!newFamily.door) { alert('Door number is required'); return }
    if (editIndex !== null) {
      const updated = [...families]
      updated[editIndex] = newFamily
      setFamilies(updated)
      setEditIndex(null)
    } else setFamilies([...families, newFamily])
    setNewFamily({ block: selectedBlock, name: '', floor: '', door: '', cellphone: '', car: '', mobile1: '', mobile2: '', storage: '', parking: '', realEstate: '', username: '', usercode: '', comment: '', monthlyFee: '', unpaidMonths: 0 })
    setAddFamilyOpen(false)
  }
  const handleDeleteFamily = (index) => setFamilies(families.filter((_, i) => i !== index))
  const handleEditFamily = (index) => { setNewFamily(families[index]); setEditIndex(index); setAddFamilyOpen(true) }

  /** BLOCK HANDLERS **/
  const handleAddBlock = () => {
    if (newBlockName.trim() && !blocks.includes(newBlockName)) {
      setBlocks([...blocks, newBlockName])
      setSelectedBlock(newBlockName)
      setNewBlockName('')
    }
  }
  const handleDeleteBlock = () => {
    if (!selectedBlock) return
    if (confirm(`Are you sure you want to delete block "${selectedBlock}" and all its families?`)) {
      setBlocks(blocks.filter(b => b !== selectedBlock))
      setFamilies(families.filter(f => f.block !== selectedBlock))
      setSelectedBlock(blocks.length > 1 ? blocks[0] : '')
    }
  }

  /** FILTER & SYSTEMATIC DOORS **/
  const filteredBlocks = blocks.filter(block => block.toLowerCase().includes(blockSearch.toLowerCase()))
  const maxDoors = 20
  const doorNumbers = Array.from({ length: maxDoors }, (_, i) => (i + 1).toString())
  const blockFamilies = {}
  families.filter(fam => fam.block === selectedBlock).forEach(fam => { blockFamilies[fam.door] = fam })
  const systematicFamilies = doorNumbers.map(door => blockFamilies[door] ? { ...blockFamilies[door] } : { door, block: selectedBlock })
  const searchedFamilies = systematicFamilies.filter(fam =>
    Object.keys(columnSearch).every(col =>
      fam[col]?.toString().toLowerCase().includes(columnSearch[col].toLowerCase())
    )
  )
  const totalPages = Math.ceil(searchedFamilies.length / rowsPerPage)
  const paginatedFamilies = searchedFamilies.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  return (
    <div className="w-full px-4 py-3">
      {/* Client Name */}
      <div className="mb-4">
        <label className="block text-4xl font-medium text-gray-700 mb-1">NEW GARDEN</label>
    
      </div>

      {/* Block Search/Add */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input type="text" value={blockSearch} onChange={e => setBlockSearch(e.target.value)} placeholder="Search Blocks" className="border border-gray-300 rounded-md px-3 py-1 text-sm" />
        {filteredBlocks.map(block => (
          <button key={block} onClick={() => setSelectedBlock(block)} className={`px-4 py-1 rounded-md font-medium ${selectedBlock === block ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>{block}</button>
        ))}
        <input type="text" value={newBlockName} onChange={e => setNewBlockName(e.target.value)} placeholder="Add Block" className="border border-gray-300 rounded-md px-2 py-1 text-sm" />
        <button onClick={handleAddBlock} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">Add</button>
        <button onClick={handleDeleteBlock} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Delete</button>
      </div>

      {/* MENU/TABS ABOVE TABLE */}
      <div className="flex gap-4 mb-3 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 -mb-px font-medium text-sm border-b-2 transition ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Family Tab */}
      {activeTab === 'family' && (
        <div>
          {/* Add Family Button */}
          <div className="flex justify-end mb-3">
            <button onClick={() => { setNewFamily({ ...newFamily, block: selectedBlock }); setEditIndex(null); setAddFamilyOpen(true) }} className="flex items-center gap-2 bg-indigo-500 text-white px-5 py-2 rounded-md">
              <PlusCircle className="h-5 w-5" /> Add Family
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-3 border border-gray-200 overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Block','Door#','Name','Floor','Cellphone','Car Plate','Mobile1','Mobile2','Storage','Parking','Real Estate','Actions'].map(col => (
                    <th key={col} className="px-3 py-2 text-left text-sm font-medium text-gray-700">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedFamilies.map((fam, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-700">{fam.block}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{fam.door}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{fam.name || '-'}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{fam.floor || '-'}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{fam.cellphone || '-'}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{fam.car || '-'}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{fam.mobile1 || '-'}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{fam.mobile2 || '-'}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{fam.storage || '-'}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{fam.parking || '-'}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{fam.realEstate || '-'}</td>
                    <td className="px-3 py-2 text-sm text-gray-700 flex gap-2">
                      {fam.name && <>
                        <button onClick={() => handleEditFamily(idx)} className="text-indigo-500 hover:text-indigo-700"><Edit className="h-5 w-5" /></button>
                        <button onClick={() => handleDeleteFamily(idx)} className="text-red-500 hover:text-red-700"><Trash2 className="h-5 w-5" /></button>
                      </>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-3">
            <div>
              Rows per page:{' '}
              <select
                value={rowsPerPage}
                onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1) }}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                {[10, 30, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1 border rounded-md hover:bg-gray-100">Prev</button>
              <span className="px-2 py-1 text-sm">Page {currentPage}/{totalPages || 1}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded-md hover:bg-gray-100">Next</button>
            </div>
          </div>

          {/* Add/Edit Family Modal */}
          {addFamilyOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-3">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">{editIndex !== null ? 'Edit Family' : 'Add Family'}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {['block','name','floor','door','cellphone','car','mobile1','mobile2','storage','parking','realEstate'].map(field => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={newFamily[field]}
                      onChange={e => setNewFamily({ ...newFamily, [field]: e.target.value })}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      disabled={field === 'block'} // block is fixed
                    />
                  ))}
                </div>
                <div className="mt-5 flex justify-end gap-3">
                  <button onClick={() => { setAddFamilyOpen(false); setEditIndex(null) }} className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
                  <button onClick={handleAddFamily} className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Save</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DEVICE CONTROL TAB */}
      {activeTab === 'device' && (
        <DeviceControl families={families} />
      )}

      {/* CAMERA CONTROL TAB */}
      {activeTab === 'camera' && (
        <div className="p-4 text-gray-700">
          <h3 className="text-lg font-semibold mb-3">Camera Control</h3>
          <p>Register and manage cameras for the client here.</p>
        </div>
      )}

      {/* PAYMENT TAB */}
      {activeTab === 'payment' && (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">Monthly Payment</h3>
          <MonthlyPayment families={families} selectedBlock={selectedBlock} />
        </div>
      )}
    </div>
  )
}
