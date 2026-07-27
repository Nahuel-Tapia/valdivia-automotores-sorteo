import type { APIRoute } from "astro"
import { db, initDB } from "@/lib/db"
import bcrypt from "bcryptjs"

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    await initDB()
    const { email, password } = await request.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email y contraseña requeridos." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const res = await db.execute({
      sql: "SELECT id, email, password_hash FROM admins WHERE email = ?",
      args: [String(email).trim().toLowerCase()],
    })

    if (res.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Credenciales inválidas." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    const admin = res.rows[0]
    const valid = await bcrypt.compare(String(password), String(admin.password_hash))

    if (!valid) {
      return new Response(
        JSON.stringify({ error: "Credenciales inválidas." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    // Token simple de sesión de demostración
    const token = `adm_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return new Response(
      JSON.stringify({
        success: true,
        token,
        admin: { id: admin.id, email: admin.email },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error en admin login:", error)
    return new Response(
      JSON.stringify({ error: "Error interno del servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
