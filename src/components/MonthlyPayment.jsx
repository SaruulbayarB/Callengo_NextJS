'use client'
import React, { useState, useEffect } from 'react'

export default function MonthlyPayment({ families, selectedBlock, monthlyAmount = 35000 }) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const [paymentsByBlock, setPaymentsByBlock] = useState({})
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!selectedBlock) return
    const blockFamilies = families.filter(fam => fam.block === selectedBlock)
    const initialPayments = blockFamilies.map(fam => ({
      id: fam.block + '-' + fam.door,
      name: fam.name,
      block: fam.block,
      door: fam.door,
      months: months.reduce((acc, month) => { acc[month] = monthlyAmount; return acc }, {})
    }))
    setPaymentsByBlock(prev => ({
      ...prev,
      [selectedBlock]: prev[selectedBlock] || initialPayments
    }))
    setCurrentPage(1)
  }, [families, selectedBlock, monthlyAmount])

  if (!selectedBlock || !paymentsByBlock[selectedBlock]) return <p>No families in this block.</p>

  const payments = paymentsByBlock[selectedBlock]

  const markPaid = (id, month) => {
    setPaymentsByBlock(prev => ({
      ...prev,
      [selectedBlock]: prev[selectedBlock].map(fam =>
        fam.id === id ? { ...fam, months: { ...fam.months, [month]: 0 } } : fam
      )
    }))
  }

  const totalPages = Math.ceil(payments.length / rowsPerPage)
  const paginatedPayments = payments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  // Total per month (footer)
  const totalPerMonth = months.reduce((acc, month) => {
    acc[month] = paginatedPayments.reduce((sum, fam) => sum + (fam.months[month] || 0), 0)
    return acc
  }, {})

  // Total per row
  const rowTotals = paginatedPayments.map(fam =>
    Object.values(fam.months).reduce((sum, val) => sum + (val || 0), 0)
  )

  // Footer total for the total column
  const totalAllRows = rowTotals.reduce((sum, val) => sum + val, 0)

  return (
    <div className="overflow-x-auto p-2 font-sans text-sm">
      <table className="w-full border border-gray-300 rounded-md text-center">
        <thead className="bg-gray-50 uppercase text-xs">
          <tr>
            <th className="border px-1 py-1">BLOCK</th>
            <th className="border px-1 py-1">DOOR#</th>
            <th className="border px-1 py-1">NAME</th>
            {months.map(month => <th key={month} className="border px-1 py-1">{month.toUpperCase()}</th>)}
            <th className="border px-1 py-1">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPayments.map((fam, idx) => (
            <tr key={fam.id} className="hover:bg-gray-50">
              <td className="border px-1 py-1">{fam.block}</td>
              <td className="border px-1 py-1">{fam.door}</td>
              <td className="border px-1 py-1">{fam.name}</td>
              {months.map(month => (
                <td key={month} className="border px-1 py-1 cursor-pointer" onClick={() => markPaid(fam.id, month)}>
                  {fam.months[month] === 0 ? '-' : fam.months[month].toLocaleString()}
                </td>
              ))}
              <td className="border px-1 py-1 font-semibold">{rowTotals[idx].toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-100 font-semibold text-xs">
          <tr>
            <td className="border px-1 py-1" colSpan={3}>TOTAL</td>
            {months.map(month => (
              <td key={month} className="border px-1 py-1">{totalPerMonth[month].toLocaleString()}</td>
            ))}
            <td className="border px-1 py-1">{totalAllRows.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-2 text-xs">
        <div>
          Rows per page:{' '}
          <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1) }}
            className="border rounded-md px-1 py-0.5 text-xs">
            {[5,10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} className="px-2 py-1 border rounded-md">Prev</button>
          <span>Page {currentPage}/{totalPages || 1}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} className="px-2 py-1 border rounded-md">Next</button>
        </div>
      </div>
    </div>
  )
}
