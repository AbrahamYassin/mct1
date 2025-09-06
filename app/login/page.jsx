'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
    if (!res.ok) { const j = await res.json(); setError(j.error || 'Erreur'); return }
    router.push('/dashboard')
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-soft mt-10">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2 rounded-lg" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full border p-2 rounded-lg" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="w-full bg-brand-600 text-white p-2 rounded-lg">Se connecter</button>
      </form>
      <div className="text-sm mt-3">Pas de compte ? <Link href="/register" className="underline">Créer un compte</Link></div>
    </div>
  )
}
