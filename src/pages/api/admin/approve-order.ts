import type { APIRoute } from "astro"
import { approveOrderAndTickets } from "@/lib/services/tickets"

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "ID de orden requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const success = await approveOrderAndTickets(orderId, "ADMIN_MANUAL_APPROVAL")

    if (!success) {
      return new Response(
        JSON.stringify({ error: "No se pudo encontrar o aprobar la orden." }),
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
