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

    // 1. Limpiar órdenes y restaurar los 200 boletos a estado disponible
    await db.execute("DELETE FROM orders;")
    await db.execute("UPDATE tickets SET status = 'available', order_id = NULL, session_id = NULL, reserved_until = NULL;")

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
