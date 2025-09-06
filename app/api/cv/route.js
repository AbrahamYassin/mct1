import { connectDB } from '@/lib/db'
import Cv from '@/models/Cv'
import { getUserIdFromCookie } from '@/lib/auth'

export async function GET() {
  await connectDB()
  const userId = getUserIdFromCookie()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const items = await Cv.find({ userId }).sort({ updatedAt: -1 })
  return Response.json(items)
}

export async function POST(req) {
  await connectDB()
  const userId = getUserIdFromCookie()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const cv = await Cv.create({ userId, ...body })
  return Response.json(cv)
}
