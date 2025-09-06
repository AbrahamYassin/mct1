'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

const COLORS = ['#2563eb','#16a34a','#dc2626','#7c3aed','#ea580c','#0ea5e9','#111827']

export default function Editor() {
  const params = useParams()
  const router = useRouter()
  const [cv, setCv] = useState(null)

  useEffect(()=>{
    fetch(`/api/cv/${params.id}`).then(r=>r.json()).then(setCv)
  }, [params.id])

  const save = async () => {
    const res = await fetch(`/api/cv/${params.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(cv) })
    if (res.ok) setCv(await res.json())
  }
  const handleFile = async (e) => {
    const f = e.target.files[0]; if (!f) return
    const form = new FormData(); form.append('avatar', f)
    const res = await fetch(`/api/cv/${params.id}/avatar`, { method:'POST', body: form })
    const j = await res.json()
    if (!res.ok) alert(j.error || 'Upload error'); else setCv(j)
  }

  if (!cv) return 'Chargement...'
  return (
    <div className="max-w-6xl mx-auto p-4 grid lg:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-2xl shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">Informations personnelles</h2>
          <div className="flex items-center gap-2">
            <select className="border p-2 rounded-lg" value={cv.template} onChange={e=>setCv({...cv, template:e.target.value})}>
              <option value="modern">Modern</option><option value="clean">Clean</option><option value="basic">Basic</option>
            </select>
            <div className="flex items-center gap-1">{COLORS.map(c=>(<button key={c} onClick={()=>setCv({...cv, themeColor:c})} className="w-6 h-6 rounded-full border" style={{background:c}} title={c}></button>))}</div>
            <button onClick={save} className="px-3 py-1.5 border rounded-lg">💾 Sauvegarder</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <input className="border p-2 rounded-lg" placeholder="Nom complet" value={cv.personal?.fullName||''} onChange={e=>setCv({...cv, personal:{...cv.personal, fullName:e.target.value}})} />
          <input className="border p-2 rounded-lg" placeholder="Titre" value={cv.personal?.title||''} onChange={e=>setCv({...cv, personal:{...cv.personal, title:e.target.value}})} />
          <input className="border p-2 rounded-lg" placeholder="Email" value={cv.personal?.email||''} onChange={e=>setCv({...cv, personal:{...cv.personal, email:e.target.value}})} />
          <input className="border p-2 rounded-lg" placeholder="Téléphone" value={cv.personal?.phone||''} onChange={e=>setCv({...cv, personal:{...cv.personal, phone:e.target.value}})} />
          <input className="border p-2 rounded-lg" placeholder="Localisation" value={cv.personal?.location||''} onChange={e=>setCv({...cv, personal:{...cv.personal, location:e.target.value}})} />
          <textarea className="border p-2 rounded-lg md:col-span-2" placeholder="Résumé" value={cv.personal?.summary||''} onChange={e=>setCv({...cv, personal:{...cv.personal, summary:e.target.value}})} />
        </div>

        <div className="flex items-center gap-3">
          <input type="file" onChange={handleFile} />
          {cv.personal?.avatarUrl && <img src={cv.personal.avatarUrl} className="w-12 h-12 rounded-full object-cover" />}
        </div>

        <Section title="Compétences"><TagEditor items={cv.skills||[]} onChange={v=>setCv({...cv, skills:v})} placeholder="Ajouter une compétence"/></Section>
        <Section title="Langues"><TagEditor items={cv.languages||[]} onChange={v=>setCv({...cv, languages:v})} placeholder="Ajouter une langue"/></Section>
        <Section title="Expériences"><ListEditor items={cv.experiences||[]} onChange={v=>setCv({...cv, experiences:v})} fields={[['title','Intitulé'],['company','Organisation'],['startDate','Début'],['endDate','Fin'],['description','Description']]} /></Section>
        <Section title="Formations"><ListEditor items={cv.education||[]} onChange={v=>setCv({...cv, education:v})} fields={[['degree','Diplôme'],['school','Établissement'],['startDate','Début'],['endDate','Fin'],['description','Description']]} /></Section>
        <Section title="Projets"><ListEditor items={cv.projects||[]} onChange={v=>setCv({...cv, projects:v})} fields={[['name','Nom'],['link','Lien'],['description','Description']]} /></Section>

        <div className="flex gap-2 pt-2">
          <button onClick={save} className="px-3 py-1.5 border rounded-lg">Sauvegarder</button>
          <a href={`/preview/${cv._id}`} className="px-3 py-1.5 border rounded-lg">Prévisualiser</a>
        </div>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-soft">
        <iframe src={`/api/cv/${cv._id}/export`} className="w-full h-[80vh] border rounded-xl"></iframe>
      </div>
    </div>
  )
}

function Section({ title, children }) { return (<div><h3 className="font-semibold text-lg mb-2">{title}</h3>{children}</div>) }
function TagEditor({ items, onChange, placeholder }) {
  const [value, setValue] = useState(''); const add = ()=>{ if(!value.trim()) return; onChange([...(items||[]), value.trim()]); setValue('') }
  const remove = (i)=> onChange(items.filter((_,idx)=>idx!==i))
  return (<div><div className="flex gap-2 mb-2"><input className="flex-1 border p-2 rounded-lg" placeholder={placeholder} value={value} onChange={e=>setValue(e.target.value)} /><button onClick={add} className="px-3 py-1.5 border rounded-lg">Ajouter</button></div><div className="flex flex-wrap gap-2">{items.map((x,i)=>(<span key={i} className="px-2 py-1 bg-gray-100 rounded-full">{x} <button className="ml-1" onClick={()=>remove(i)}>×</button></span>))}</div></div>)
}
function ListEditor({ items, onChange, fields }){
  const add = ()=> onChange([...(items||[]), Object.fromEntries(fields.map(([k])=>[k,'']))])
  const update = (i,k,v)=> onChange(items.map((it,idx)=> idx===i?{...it,[k]:v}:it))
  const remove = (i)=> onChange(items.filter((_,idx)=>idx!==i))
  return (<div className="space-y-3">{(items||[]).map((it,i)=>(<div key={i} className="p-3 border rounded-xl"><div className="grid md:grid-cols-2 gap-2">{fields.map(([k,label])=>k==='description'?<textarea key={k} className="border p-2 rounded-lg md:col-span-2" placeholder={label} value={it[k]||''} onChange={e=>update(i,k,e.target.value)} />:<input key={k} className="border p-2 rounded-lg" placeholder={label} value={it[k]||''} onChange={e=>update(i,k,e.target.value)} />)}</div><div className="text-right pt-2"><button onClick={()=>remove(i)} className="px-2 py-1.5 border rounded-lg text-red-600">Supprimer</button></div></div>))}<button onClick={add} className="px-3 py-1.5 border rounded-lg">Ajouter une entrée</button></div>)
}
