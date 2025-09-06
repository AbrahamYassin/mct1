import { connectDB } from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { signJWT } from '@/lib/jwt'
import { cookies } from 'next/headers'

export async function POST(req) {
  await connectDB()
  const { name, email, password } = await req.json()
  if (!name || !email || !password) return Response.json({ error: 'Missing fields' }, { status: 400 })
  const exist = await User.findOne({ email })
  if (exist) return Response.json({ error: 'Email exists' }, { status: 409 })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash })
  const token = signJWT({ id: user._id })
  cookies().set('token', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
  return Response.json({ user: { id: user._id, name: user.name, email: user.email } })
}
