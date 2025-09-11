'use client';
import React, { useState } from 'react';
import { Edit, Trash2, MessageCircle, PlusCircle } from 'lucide-react';

export default function Clients({ userRole }) {
  const [clients, setClients] = useState([
    { id: 1, name: 'John Doe', cellphone: '999-123-456', manager: 'Jane Smith', contractStart: '2025-01-01', totalPayment: 1000, residualPayment: 200, devicesQty: 3, comment: 'VIP client with long details to show in popup', contractFile: null, active: true },
    { id: 2, name: 'Alice Brown', cellphone: '998-987-654', manager: 'Mark Lee', contractStart: '2025-02-15', totalPayment: 800, residualPayment: 100, devicesQty: 2, comment: '', contractFile: null, active: false },
  ]);

  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [tempComment, setTempComment] = useState('');
  const [hoverCommentIndex, setHoverCommentIndex] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const handleChange = (id, key, value) => {
    setClients(clients.map(c => (c.id === id ? { ...c, [key]: value } : c)));
  };

  const handleAdd = () => {
    const newClient = { id: Date.now(), name:'', cellphone:'', manager:'', contractStart:'', totalPayment:0, residualPayment:0, devicesQty:0, comment:'', contractFile:null, active:true };
    setClients([...clients, newClient]);
  };

  const handleDelete = (id) => { if(confirm('Delete this client?')) setClients(clients.filter(c=>c.id!==id)); };
  const toggleActive = (id) => { setClients(clients.map(c=>c.id===id?{...c,active:!c.active}:c)); };
  const handleFileUpload = (id,file) => { setClients(clients.map(c=>c.id===id?{...c,contractFile:file.name}:c)); };

  const openCommentEditor = (index) => { 
    setEditingCommentIndex(index); 
    setTempComment(clients[index].comment || ''); 
  };
  const saveComment = () => { 
    const updated = [...clients]; 
    updated[editingCommentIndex].comment = tempComment; 
    setClients(updated); 
    setEditingCommentIndex(null); 
    setTempComment(''); 
  };
  const cancelCommentEdit = () => { setEditingCommentIndex(null); setTempComment(''); };

  const handleMouseEnter = (index, e) => {
    setHoverCommentIndex(index);
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupPosition({ top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX });
  };
  const handleMouseLeave = () => { setHoverCommentIndex(null); };

  return (
    <div className="p-2 relative">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-bold">Clients</h2>
        {userRole==='admin' && (
          <button onClick={handleAdd} className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-md shadow hover:opacity-90">
            <PlusCircle className="h-5 w-5"/> Add Client
          </button>
        )}
      </div>

      {/* Table container no longer controls popup */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow text-sm relative">
          <thead className="bg-gray-200 text-xs">
            <tr>
              {['No','Name','Cellphone','Manager','Contract Start','Total Payment','Residual Payment','Devices','Comment','Contract File','Control'].map(col=>(
                <th key={col} className="border px-2 py-1 text-left">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((c, idx)=>(
              <tr key={c.id} className="hover:bg-gray-50 relative">
                <td className="border px-2 py-1">{idx+1}</td>
                <td className="border px-2 py-1"><input value={c.name} onChange={e=>handleChange(c.id,'name',e.target.value)} className="border px-1 py-0 w-full text-xs" disabled={userRole==='viewer'}/></td>
                <td className="border px-2 py-1"><input value={c.cellphone} onChange={e=>handleChange(c.id,'cellphone',e.target.value)} className="border px-1 py-0 w-full text-xs" disabled={userRole==='viewer'}/></td>
                <td className="border px-2 py-1"><input value={c.manager} onChange={e=>handleChange(c.id,'manager',e.target.value)} className="border px-1 py-0 w-full text-xs" disabled={userRole==='viewer'}/></td>
                <td className="border px-2 py-1"><input type="date" value={c.contractStart} onChange={e=>handleChange(c.id,'contractStart',e.target.value)} className="border px-1 py-0 w-full text-xs" disabled={userRole==='viewer'}/></td>
                <td className="border px-2 py-1"><input type="number" value={c.totalPayment} onChange={e=>handleChange(c.id,'totalPayment',parseFloat(e.target.value))} className="border px-1 py-0 w-full text-xs" disabled={userRole==='viewer'}/></td>
                <td className="border px-2 py-1">{c.residualPayment}</td>
                <td className="border px-2 py-1"><input type="number" value={c.devicesQty} onChange={e=>handleChange(c.id,'devicesQty',parseInt(e.target.value))} className="border px-1 py-0 w-full text-xs" disabled={userRole==='viewer'}/></td>

                {/* Comment */}
                <td className="border px-2 py-1 relative">
                  <div 
                    className="inline-block cursor-pointer"
                    onMouseEnter={(e)=>handleMouseEnter(idx,e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={()=>openCommentEditor(idx)}
                  >
                    <MessageCircle className="h-5 w-5 text-gray-500"/>
                  </div>
                </td>

                <td className="border px-2 py-1">
                  <input type="file" onChange={e=>handleFileUpload(c.id,e.target.files[0])} className="text-xs" disabled={userRole==='viewer'}/>
                  {c.contractFile && <p className="text-xs">{c.contractFile}</p>}
                </td>

                <td className="border px-2 py-1 flex gap-1">
                  <button onClick={()=>toggleActive(c.id)} className={`px-2 py-1 rounded text-xs ${c.active?'bg-green-500 text-white':'bg-red-500 text-white'}`}>{c.active?'Active':'Inactive'}</button>
                  {userRole==='admin' && <>
                    <button className="text-indigo-500 hover:text-indigo-700 px-1"><Edit className="h-5 w-5"/></button>
                    <button onClick={()=>handleDelete(c.id)} className="text-red-500 hover:text-red-700 px-1"><Trash2 className="h-5 w-5"/></button>
                  </>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hover popup */}
      {hoverCommentIndex!==null && clients[hoverCommentIndex].comment && (
        <div className="fixed z-50 bg-gray-100 border rounded p-2 max-w-2xl text-sm shadow-md" style={{ top: popupPosition.top, left: popupPosition.left, whiteSpace:'pre-wrap', wordWrap:'break-word' }}>
          {clients[hoverCommentIndex].comment}
        </div>
      )}

      {/* Comment editor */}
      {editingCommentIndex!==null && (
        <div className="fixed z-50 bg-white border rounded-md p-3 shadow-md top-1/3 left-1/2 -translate-x-1/2 w-96">
          <h3 className="font-semibold mb-2">Edit Comment</h3>
          <textarea value={tempComment} onChange={e=>setTempComment(e.target.value)} className="w-full border rounded-md p-1 text-sm" rows={6}/>
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={cancelCommentEdit} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm">Cancel</button>
            <button onClick={saveComment} className="px-3 py-1 rounded bg-indigo-500 text-white hover:bg-indigo-600 text-sm">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
