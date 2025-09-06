import { connectDB } from '@/lib/db'
import Cv from '@/models/Cv'
import { getUserIdFromCookie } from '@/lib/auth'

export async function GET(_, { params }) {
  await connectDB()
  const userId = getUserIdFromCookie()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const cv = await Cv.findOne({ _id: params.id, userId })
  if (!cv) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(cv)
}

export async function PUT(req, { params }) {
  await connectDB()
  const userId = getUserIdFromCookie()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const cv = await Cv.findOneAndUpdate({ _id: params.id, userId }, data, { new: true })
  if (!cv) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(cv)
}

export async function DELETE(_, { params }) {
  await connectDB()
  const userId = getUserIdFromCookie()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const del = await Cv.findOneAndDelete({ _id: params.id, userId })
  if (!del) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ ok: true })
}
