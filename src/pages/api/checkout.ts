import type { APIRoute } from "astro"
import { raffle } from "@/data/raffle"
import { db, initDB } from "@/lib/db"
import { createMercadoPagoPreference, canCreateMercadoPagoPreference } from "@/lib/services/mercadopago"
import { rejectOrderAndReleaseTickets, reserveTicketsAtomic } from "@/lib/services/tickets"

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    await initDB()
    const body = await request.json()
    const { tickets, selectedNumbers, sessionId, buyer, paymentMethod } = body
    const selectedPaymentMethod = paymentMethod || "mercadopago"

    const count = Number(tickets)
    if (!count || count < 1) {
      return new Response(
        JSON.stringify({ error: "Cantidad de números inválida" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    if (!buyer || !buyer.name || !buyer.email || !buyer.dni || !buyer.phone) {
      return new Response(
        JSON.stringify({ error: "Todos los datos del comprador son obligatorios." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Cálculo seguro del precio en el servidor
    const expectedAmount = count * raffle.ticketBasePrice
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
    const now = Date.now()

    // 1. Crear Orden en DB con estado 'pending'
    await db.execute({
      sql: `INSERT INTO orders (id, buyer_name, buyer_email, buyer_dni, buyer_phone, ticket_count, total_amount, status, payment_method, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      args: [
        orderId,
        String(buyer.name),
        String(buyer.email),
        String(buyer.dni),
        String(buyer.phone),
        count,
        expectedAmount,
        selectedPaymentMethod,
        now,
      ],
    })

    // 2. Bloqueo atómico de tickets en DB
    const requestTarget = Array.isArray(selectedNumbers) && selectedNumbers.length === count ? selectedNumbers : count
    const reservation = await reserveTicketsAtomic(requestTarget, orderId, sessionId)

    if (!reservation.success) {
      // Revertir orden si no se pudieron reservar los tickets
      await db.execute({ sql: "DELETE FROM orders WHERE id = ?", args: [orderId] })
      return new Response(
        JSON.stringify({ error: reservation.error || "No se pudieron reservar los números." }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      )
    }

    let mpPreferenceId: string | null = null
    let paymentUrl: string | null = null
    let demoMode = false

    if (selectedPaymentMethod === "mercadopago") {
      if (canCreateMercadoPagoPreference()) {
        try {
          const preference = await createMercadoPagoPreference({
            orderId,
            buyer: {
              name: String(buyer.name),
              email: String(buyer.email),
              dni: String(buyer.dni),
              phone: String(buyer.phone),
            },
            tickets: reservation.numbers,
            ticketCount: count,
            totalAmount: expectedAmount,
            reservedUntil: reservation.reservedUntil ?? now + 10 * 60 * 1000,
            origin: new URL(request.url).origin,
          })

          mpPreferenceId = preference.id
          paymentUrl = preference.initPoint

          await db.execute({
            sql: "UPDATE orders SET mp_preference_id = ? WHERE id = ?",
            args: [mpPreferenceId, orderId],
          })
        } catch (error) {
          await rejectOrderAndReleaseTickets(orderId, "MP_PREFERENCE_ERROR", { notifyBuyer: false })
          console.error("Error creando preferencia de Mercado Pago:", error)
          return new Response(
            JSON.stringify({
              error:
                "No se pudo iniciar el pago con Mercado Pago. Verifica MERCADOPAGO_ACCESS_TOKEN y PUBLIC_SITE_URL.",
            }),
            { status: 502, headers: { "Content-Type": "application/json" } }
          )
        }
      } else {
        demoMode = true
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        tickets: reservation.numbers,
        amount: expectedAmount,
        reservedUntil: reservation.reservedUntil ?? now + 10 * 60 * 1000,
        paymentUrl,
        mpPreferenceId,
        demoMode,
        message: paymentUrl
          ? "Reserva realizada. Redirigiendo a Mercado Pago."
          : "Reserva realizada exitosamente.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error en POST /api/checkout:", error)
    return new Response(
      JSON.stringify({ error: "Error interno del servidor al procesar checkout." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
