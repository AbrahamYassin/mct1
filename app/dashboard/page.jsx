'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Dashboard() {
  const [items, setItems] = useState([])

  const load = async () => {
    const res = await fetch('/api/cv')
    if (res.ok) setItems(await res.json())
  }
  useEffect(() => { load() }, [])

  const createCV = async () => {
    const res = await fetch('/api/cv', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ personal: { fullName: 'Mon Nom' }, template:'modern', themeColor:'#2563eb' }) })
    const j = await res.json()
    if (res.ok) window.location.href = `/editor/${j._id}`
  }
  const del = async (id) => { await fetch(`/api/cv/${id}`, { method:'DELETE' }); load() }

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-extrabold">Mes CV</h1><p className="text-gray-600">Créez, modifiez et exportez vos CV</p></div>
          <button onClick={createCV} className="px-4 py-2 rounded-lg bg-brand-600 text-white">+ Nouveau CV</button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {items.map(cv => (
            <div key={cv._id} className="bg-white p-4 rounded-xl shadow-soft flex flex-col gap-2">
              <div className="font-semibold">{cv.personal?.fullName || 'Sans titre'}</div>
              <div className="text-sm text-gray-600">{cv.personal?.title}</div>
              <div className="flex gap-2 pt-2">
                <Link href={`/editor/${cv._id}`} className="px-3 py-1.5 border rounded-lg hover:bg-gray-50">Éditer</Link>
                <Link href={`/preview/${cv._id}`} className="px-3 py-1.5 border rounded-lg hover:bg-gray-50">Prévisualiser</Link>
                <a href={`/api/cv/${cv._id}/export`} target="_blank" className="px-3 py-1.5 border rounded-lg hover:bg-gray-50">Exporter</a>
                <button onClick={() => del(cv._id)} className="px-3 py-1.5 border rounded-lg text-red-600 hover:bg-red-50">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
