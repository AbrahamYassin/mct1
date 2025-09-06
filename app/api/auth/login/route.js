import { connectDB } from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { signJWT } from '@/lib/jwt'
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
