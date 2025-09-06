'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }
  return (
    <div className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
        <Link href="/dashboard" className="font-extrabold text-brand-600 text-xl">MyCVTop</Link>
        <div className="flex items-center gap-3">
          <button onClick={logout} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Déconnexion</button>
        </div>
      </div>
    </div>
  )
}
