import { connectDB } from '@/lib/db.mjs'
import User from '@/models/User.mjs'
import bcrypt from 'bcryptjs'
import { signJWT } from '@/lib/jwt.mjs'
import { cookies } from 'next/headers'

export async function POST(req) {
  await connectDB()
  const { email, password } = await req.json()
  const user = await User.findOne({ email })
  if (!user) return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  const token = signJWT({ id: user._id })
  cookies().set('token', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
  return Response.json({ user: { id: user._id, name: user.name, email: user.email } })
}
