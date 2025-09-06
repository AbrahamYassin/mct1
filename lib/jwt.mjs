import jwt from 'jsonwebtoken'
const secret = process.env.JWT_SECRET
export function signJWT(payload) {
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}
export function verifyJWT(token) {
  return jwt.verify(token, secret)
}
