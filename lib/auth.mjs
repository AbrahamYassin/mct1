import { cookies } from 'next/headers'
import { verifyJWT } from './jwt.mjs'

export function getUserIdFromCookie() {
  const c = cookies().get('token')?.value
  if (!c) return null
  try { const p = verifyJWT(c); return p.id } catch { return null }
}
