import type { APIRoute } from "astro"
import { approveOrderAndTickets } from "@/lib/services/tickets"
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

    const { orderId } = await request.json()

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "ID de orden requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const res = await approveOrderAndTickets(orderId, "ADMIN_MANUAL_APPROVAL", { ignoreExpiration: true })

    if (!res.success) {
      return new Response(
        JSON.stringify({ error: res.reason || "No se pudo encontrar o aprobar la orden." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Orden #${orderId} aprobada exitosamente y correo de comprobante enviado.`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error en aprobación manual admin:", error)
    return new Response(
      JSON.stringify({ error: "Error interno al aprobar orden." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
