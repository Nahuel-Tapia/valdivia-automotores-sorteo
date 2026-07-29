import type { APIRoute } from "astro"
import { db, initDB } from "@/lib/db"
import { verifyAdminRequest } from "@/lib/services/auth"

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  try {
    if (!verifyAdminRequest(request)) {
      return new Response(
        JSON.stringify({ error: "No autorizado. Sesión de administrador requerida." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    await initDB()
    const url = new URL(request.url)
    const orderId = url.searchParams.get("orderId")

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "ID de orden requerido." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // 1. Obtener datos de la orden
    const orderRes = await db.execute({
      sql: `SELECT 
              id, 
              buyer_name as buyerName, 
              buyer_email as buyerEmail, 
              buyer_dni as buyerDni, 
              buyer_phone as buyerPhone, 
              ticket_count as ticketCount, 
              total_amount as totalAmount, 
              status, 
              payment_method as paymentMethod, 
              mp_payment_id as mpPaymentId,
              created_at as createdAt 
            FROM orders 
            WHERE id = ?`,
      args: [orderId],
    })

    if (orderRes.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Orden no encontrada." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    }

    const order = orderRes.rows[0]

    // 2. Obtener lista de tickets asignados
    const ticketsRes = await db.execute({
      sql: "SELECT number, status FROM tickets WHERE order_id = ? ORDER BY number ASC",
      args: [orderId],
    })

    const tickets = ticketsRes.rows.map((r) => ({
      number: String(r.number),
      status: String(r.status),
    }))

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: String(order.id),
          buyerName: String(order.buyerName),
          buyerEmail: String(order.buyerEmail),
          buyerDni: String(order.buyerDni),
          buyerPhone: String(order.buyerPhone),
          ticketCount: Number(order.ticketCount),
          totalAmount: Number(order.totalAmount),
          status: String(order.status),
          paymentMethod: String(order.paymentMethod),
          mpPaymentId: order.mpPaymentId ? String(order.mpPaymentId) : null,
          createdAt: Number(order.createdAt),
        },
        tickets,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error obteniendo detalles de orden:", error)
    return new Response(
      JSON.stringify({ error: "Error interno del servidor al consultar la orden." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
