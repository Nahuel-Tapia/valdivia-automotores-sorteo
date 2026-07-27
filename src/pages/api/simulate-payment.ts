import type { APIRoute } from "astro"
import { approveOrderAndTickets, rejectOrderAndReleaseTickets } from "@/lib/services/tickets"

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { orderId, status } = body

    if (!orderId) {
      return new Response(JSON.stringify({ error: "ID de orden requerido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const paymentStatus = status === "rejected" ? "rejected" : "approved"
    const paymentId = `SIM-${paymentStatus.toUpperCase()}-${Date.now()}`

    const success =
      paymentStatus === "rejected"
        ? await rejectOrderAndReleaseTickets(String(orderId), paymentId)
        : await approveOrderAndTickets(String(orderId), paymentId)

    if (!success) {
      return new Response(
        JSON.stringify({ error: "No se encontro la orden especificada o no puede cambiar de estado." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: paymentStatus,
        message:
          paymentStatus === "rejected"
            ? "Pago rechazado simulado. Los boletos volvieron a estar disponibles."
            : "Pago auto-aprobado exitosamente. Boletos pasaron a estado paid.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error en POST /api/simulate-payment:", error)
    return new Response(JSON.stringify({ error: "Error interno al simular pago." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
