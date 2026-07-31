import type { APIRoute } from "astro"
import { db, initDB } from "@/lib/db"
import { verifyAdminRequest } from "@/lib/services/auth"

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!verifyAdminRequest(request)) {
      return new Response(
        JSON.stringify({ error: "No autorizado. Sesión de administrador requerida." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    await initDB()

    console.log("🧹 Reseteando base de datos por solicitud admin...")

    // 1. Limpiar tickets y órdenes
    await db.execute("DELETE FROM tickets;")
    await db.execute("DELETE FROM orders;")

    // 2. Re-insertar 200 tickets (001 a 200) libres
    const now = Date.now()
    const statements = []

    for (let i = 1; i <= 200; i++) {
      const numStr = String(i).padStart(3, "0")
      statements.push({
        sql: "INSERT INTO tickets (number, status, order_id, session_id, reserved_until, updated_at) VALUES (?, 'available', NULL, NULL, NULL, ?)",
        args: [numStr, now],
      })
    }

    await db.batch(statements, "write")

    console.log("✨ Base de datos reseteada con éxito (200 boletos disponibles).")

    return new Response(
      JSON.stringify({
        success: true,
        message: "Base de datos reseteada exitosamente. Los 200 boletos están nuevamente disponibles.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error: any) {
    console.error("Error reseteando DB desde API admin:", error)
    return new Response(
      JSON.stringify({ error: error?.message || "Error interno al resetear la base de datos." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
