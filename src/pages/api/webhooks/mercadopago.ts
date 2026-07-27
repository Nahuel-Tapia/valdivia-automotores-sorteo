import type { APIRoute } from "astro"
import { approveOrderAndTickets } from "@/lib/services/tickets"

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    const urlParams = new URL(request.url).searchParams
    const type = urlParams.get("type") || urlParams.get("topic")
    const id = urlParams.get("data.id") || urlParams.get("id")

    // Validación básica de webhook de Mercado Pago
    if (type === "payment" && id) {
      // TODO: En producción, consultar la API de Mercado Pago para verificar la transacción:
      // const payment = await mercadopago.payment.get(id)
      // if (payment.body.status === 'approved') {
      //   const externalReference = payment.body.external_reference; // orderId
      //   await approveOrderAndTickets(externalReference, id)
      // }

      console.log(`🔔 Webhook MercadoPago recibido para pago ID: ${id}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error en Webhook MercadoPago:", error)
    return new Response(JSON.stringify({ error: "Error procesando webhook" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
