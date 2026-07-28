import type { APIRoute } from "astro"
import { db, initDB } from "@/lib/db"
import { sendOrderConfirmationEmail } from "@/lib/services/email"

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    await initDB()
    const { orderId } = await request.json()

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "ID de orden requerido." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // 1. Obtener la orden de la base de datos
    const orderRes = await db.execute({
      sql: "SELECT buyer_name, buyer_email, total_amount FROM orders WHERE id = ?",
      args: [orderId],
    })

    if (orderRes.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Orden no encontrada." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    }

    const orderData = orderRes.rows[0]

    // 2. Obtener la lista de números de la orden
    const ticketsRes = await db.execute({
      sql: "SELECT number FROM tickets WHERE order_id = ? ORDER BY number ASC",
      args: [orderId],
    })

    const tickets = ticketsRes.rows.map((r) => String(r.number))

    // 3. Re-enviar el correo
    const sent = await sendOrderConfirmationEmail({
      orderId,
      buyerName: String(orderData.buyer_name),
      buyerEmail: String(orderData.buyer_email),
      tickets,
      totalAmount: Number(orderData.total_amount),
    })

    if (!sent) {
      return new Response(
        JSON.stringify({ error: "No se pudo enviar el correo electrónico." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Comprobante re-enviado exitosamente a ${orderData.buyer_email}`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error al re-enviar correo:", error)
    return new Response(
      JSON.stringify({ error: "Error interno procesando el re-envío de correo." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
