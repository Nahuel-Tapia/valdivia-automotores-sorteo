import crypto from "node:crypto"

const SECRET_KEY = process.env.ADMIN_JWT_SECRET || process.env.RESEND_API_KEY || "valdivia-sorteo-sec-key-2026-v1"

export function generateAdminSessionToken(adminId: string, email: string): string {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 Horas de validez
  const payloadStr = `${adminId}:${email}:${expiresAt}`
  const signature = crypto.createHmac("sha256", SECRET_KEY).update(payloadStr).digest("hex")
  const token = Buffer.from(`${payloadStr}:${signature}`).toString("base64url")
  return token
}

export function isValidAdminToken(token: string | null | undefined): boolean {
  if (!token) return false
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8")
    const parts = decoded.split(":")
    if (parts.length !== 4) return false

    const [adminId, email, expiresAtStr, signature] = parts
    const expiresAt = Number(expiresAtStr)

    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return false
    }

    const payloadStr = `${adminId}:${email}:${expiresAtStr}`
    const expectedSignature = crypto.createHmac("sha256", SECRET_KEY).update(payloadStr).digest("hex")

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  } catch {
    return false
  }
}

export function verifyAdminRequest(request: Request): boolean {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim()
    if (isValidAdminToken(token)) return true
  }

  const cookieHeader = request.headers.get("cookie") || ""
  const match = cookieHeader.match(/admin_session=([^;]+)/)
  if (match && match[1]) {
    const token = match[1].trim()
    if (isValidAdminToken(token)) return true
  }

  return false
}
