import { connectDB } from '@/lib/db'
import Cv from '@/models/Cv'
import { getUserIdFromCookie } from '@/lib/auth'
import { cloudEnabled, configCloudinary } from '@/lib/cloud'

export async function POST(req, { params }) {
  await connectDB()
  const userId = getUserIdFromCookie()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (!cloudEnabled()) return Response.json({ error: 'Upload désactivé (ACTIVEZ USE_CLOUDINARY=true)' }, { status: 501 })

  const form = await req.formData()
  const file = form.get('avatar')
  if (!file) return Response.json({ error: 'No file' }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  const b64 = `data:${file.type};base64,${base64}`
  const cloud = configCloudinary()
  const up = await cloud.uploader.upload(b64, { folder: 'mycvtop/avatars' })

  const cv = await Cv.findOne({ _id: params.id, userId })
  if (!cv) return Response.json({ error: 'CV not found' }, { status: 404 })
  cv.personal = cv.personal || {}
  cv.personal.avatarUrl = up.secure_url
  await cv.save()
  return Response.json(cv)
}
