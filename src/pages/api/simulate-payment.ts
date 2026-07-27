import type { APIRoute } from "astro"
import { approveOrderAndTickets } from "@/lib/services/tickets"

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "ID de orden requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const success = await approveOrderAndTickets(orderId, `SIM-${Date.now()}`)
    if (!success) {
      return new Response(
        JSON.stringify({ error: "No se encontró la orden especificada." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Pago auto-aprobado exitosamente en el servidor. Boletos pasaron a estado 'paid'.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error en POST /api/simulate-payment:", error)
    return new Response(
      JSON.stringify({ error: "Error interno al simular pago." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
