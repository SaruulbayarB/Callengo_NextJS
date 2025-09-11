'use client'
import React, { useState, useMemo } from 'react'
import { PlusCircle, Edit, Trash2 } from 'lucide-react'

export default function Registration() {
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
      block: 'Block A'
    },
  ])

  const [addFamilyOpen, setAddFamilyOpen] = useState(false)
  const [newFamily, setNewFamily] = useState({
    name: '',
    floor: '',
    door: '',
    cellphone: '',
    car: '',
    mobile1: '',
    mobile2: '',
    storage: '',
    parking: '',
    realEstate: '',
    block: selectedBlock
  })
  const [newBlockName, setNewBlockName] = useState('')
  const [editIndex, setEditIndex] = useState(null)

  // Pagination and search
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [columnSearch, setColumnSearch] = useState({
    door: '', name: '', floor: '', cellphone: '', car: '',
    mobile1: '', mobile2: '', storage: '', parking: '', realEstate: ''
  })

  const handleAddFamily = () => {
    if (editIndex !== null) {
      const updated = [...families]
      updated[editIndex] = newFamily
      setFamilies(updated)
      setEditIndex(null)
    } else {
      setFamilies([...families, newFamily])
    }
    setNewFamily({
      name: '',
      floor: '',
      door: '',
      cellphone: '',
      car: '',
      mobile1: '',
      mobile2: '',
      storage: '',
      parking: '',
      realEstate: '',
      block: selectedBlock
    })
    setAddFamilyOpen(false)
  }

  const handleDeleteFamily = (index) => {
    setFamilies(families.filter((_, i) => i !== index))
  }

  const handleEditFamily = (index) => {
    setNewFamily(families[index])
    setEditIndex(index)
    setAddFamilyOpen(true)
  }

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

  const filteredBlocks = blocks.filter(block =>
    block.toLowerCase().includes(blockSearch.toLowerCase())
  )

  // Systematic door list
  const maxDoors = 20
  const doorNumbers = Array.from({ length: maxDoors }, (_, i) => i + 1)
  const blockFamilies = families
    .filter(fam => fam.block === selectedBlock)
    .reduce((acc, fam) => {
      acc[fam.door] = fam
      return acc
    }, {})

  const systematicFamilies = doorNumbers.map(door => ({
    door: door.toString(),
    ...blockFamilies[door]
  }))

  // Apply column search
  const searchedFamilies = systematicFamilies.filter(fam =>
    Object.keys(columnSearch).every(col =>
      fam[col]?.toString().toLowerCase().includes(columnSearch[col].toLowerCase())
    )
  )

  // Pagination logic
  const totalPages = Math.ceil(searchedFamilies.length / rowsPerPage)
  const paginatedFamilies = searchedFamilies.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )
  return (
    <div className="w-full px-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-black">Registration</h1>
      </div>

      {/* Block Search/Add/Delete */}
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <input type="text" value={blockSearch} onChange={e=>setBlockSearch(e.target.value)}
          placeholder="Search Blocks" className="border rounded-md px-2 py-1 text-sm" />
        {filteredBlocks.map(block => (
          <button key={block} onClick={()=>setSelectedBlock(block)}
            className={`px-3 py-1 rounded-md font-medium ${selectedBlock===block ? 'bg-indigo-500 text-white':'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
            {block}
          </button>
        ))}
        <input type="text" value={newBlockName} onChange={e=>setNewBlockName(e.target.value)}
          placeholder="Add Block" className="border rounded-md px-2 py-1 text-sm" />
        <button onClick={handleAddBlock} className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 text-sm">Add</button>
        <button onClick={handleDeleteBlock} className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 text-sm">Delete</button>
      </div>

      {/* Apartment Header */}
      <div className="mb-2 font-semibold text-lg">Apartment: {selectedBlock || 'None Selected'}</div>

      {/* Add Family */}
      <div className="flex justify-end mb-2">
        <button onClick={()=>{
          setNewFamily({...newFamily, block:selectedBlock})
          setEditIndex(null)
          setAddFamilyOpen(true)
        }} className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-md shadow hover:opacity-90">
          <PlusCircle className="h-5 w-5"/> Add Family
        </button>
      </div>

      {/* Family Table */}
      <div className="bg-white rounded-md shadow-md p-2 border border-slate-200 overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Door#','Name','Floor','Cellphone','Car Plate','Mobile1','Mobile2','Storage','Parking','Real Estate','Actions'].map(col=>(
                <th key={col} className="px-2 py-2 text-left text-sm font-medium text-gray-700">{col}</th>
              ))}
            </tr>
            {/* Column Search Inputs */}
            <tr>
              {Object.keys(columnSearch).map(col=>(
                <th key={col} className="px-2 py-1">
                  <input type="text" placeholder={`Search ${col}`} value={columnSearch[col]}
                    onChange={e=>setColumnSearch({...columnSearch,[col]:e.target.value})}
                    className="border rounded-md px-1 py-0.5 w-full text-xs"/>
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedFamilies.map((fam, idx)=>(
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-2 py-2 text-sm text-gray-700">{fam.door}</td>
                <td className="px-2 py-2 text-sm text-gray-700">{fam?.name||'-'}</td>
                <td className="px-2 py-2 text-sm text-gray-700">{fam?.floor||'-'}</td>
                <td className="px-2 py-2 text-sm text-gray-700">{fam?.cellphone||'-'}</td>
                <td className="px-2 py-2 text-sm text-gray-700">{fam?.car||'-'}</td>
                <td className="px-2 py-2 text-sm text-gray-700">{fam?.mobile1||'-'}</td>
                <td className="px-2 py-2 text-sm text-gray-700">{fam?.mobile2||'-'}</td>
                <td className="px-2 py-2 text-sm text-gray-700">{fam?.storage||'-'}</td>
                <td className="px-2 py-2 text-sm text-gray-700">{fam?.parking||'-'}</td>
                <td className="px-2 py-2 text-sm text-gray-700">{fam?.realEstate||'-'}</td>
                <td className="px-2 py-2 text-sm text-gray-700 flex gap-1">
                  {fam?.name && <>
                    <button onClick={()=>handleEditFamily(idx)} className="text-indigo-500 hover:text-indigo-700">
                      <Edit className="h-5 w-5"/>
                    </button>
                    <button onClick={()=>handleDeleteFamily(idx)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-5 w-5"/>
                    </button>
                  </>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-2">
        <div>
          Rows per page:{' '}
          <select value={rowsPerPage} onChange={e=>{setRowsPerPage(Number(e.target.value)); setCurrentPage(1)}} className="border rounded-md px-1 py-0.5 text-sm">
            {[10,30,50,100].map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} className="px-2 py-1 border rounded-md">Prev</button>
          <span className="px-2 py-1">Page {currentPage}/{totalPages||1}</span>
          <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} className="px-2 py-1 border rounded-md">Next</button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {addFamilyOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h2 className="text-xl font-semibold mb-4">{editIndex!==null?'Edit Family':'Add Family'}</h2>
            <div className="grid grid-cols-2 gap-2">
              {['name','floor','door','cellphone','car','mobile1','mobile2','storage','parking','realEstate'].map(field=>(
                <input key={field} type="text" placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
                  value={newFamily[field]} onChange={e=>setNewFamily({...newFamily,[field]:e.target.value})}
                  className="border rounded-md p-2 w-full"/>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>{setAddFamilyOpen(false); setEditIndex(null)}}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button onClick={handleAddFamily}
                className="px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
