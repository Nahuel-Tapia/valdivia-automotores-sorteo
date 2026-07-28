import type { APIRoute } from "astro"
import { approveOrderAndTickets, rejectOrderAndReleaseTickets } from "@/lib/services/tickets"

export const prerender = false

export const GET: APIRoute = async ({ request, redirect }) => {
  try {
    const url = new URL(request.url)
    const orderId = url.searchParams.get("orderId")

    if (orderId) {
      const paymentId = `SIM-APPROVED-${Date.now()}`
      await approveOrderAndTickets(orderId, paymentId)
      return redirect(`/confirmacion?orderId=${orderId}&status=approved`, 302)
    }

    return redirect("/participar", 302)
  } catch (error) {
    console.error("Error en GET /api/simulate-payment:", error)
    return redirect("/participar", 302)
  }
}

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
