import type { APIRoute } from "astro"
import { raffle } from "@/data/raffle"
import { db, initDB } from "@/lib/db"
import { createOrderWithTicketsAtomic } from "@/lib/services/tickets"
import { createMPPreference } from "@/lib/services/mercadopago"

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    await initDB()
    const body = await request.json()
    const { tickets, selectedNumbers, sessionId, buyer } = body

    const count = Number(tickets)
    if (!count || count < 1) {
      return new Response(
        JSON.stringify({ error: "Cantidad de números inválida" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const nameStr = String(buyer?.name ?? "").trim()
    const dniStr = String(buyer?.dni ?? "").replace(/\D/g, "")
    const emailStr = String(buyer?.email ?? "").trim()
    const phoneStr = String(buyer?.phone ?? "").replace(/\D/g, "")

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,80}$/
    if (!nameRegex.test(nameStr)) {
      return new Response(
        JSON.stringify({ error: "El nombre solo debe contener letras y un máximo de 80 caracteres." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    if (dniStr.length !== 8) {
      return new Response(
        JSON.stringify({ error: "El DNI debe estar conformado por exactamente 8 números." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(emailStr)) {
      return new Response(
        JSON.stringify({ error: "El email ingresado no respeta el formato válido (debe incluir @ y dominio como .com)." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    if (phoneStr.length < 9 || phoneStr.length > 11) {
      return new Response(
        JSON.stringify({ error: "El teléfono debe contener entre 9 y 11 números." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const expectedAmount = count * raffle.ticketBasePrice
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
    const requestTarget = Array.isArray(selectedNumbers) && selectedNumbers.length > 0 ? selectedNumbers : count

    // Creación atómica de orden + reserva de tickets en la misma transacción en DB
    const reservation = await createOrderWithTicketsAtomic({
      orderId,
      buyerName: nameStr,
      buyerEmail: emailStr,
      buyerDni: dniStr,
      buyerPhone: phoneStr,
      ticketCount: count,
      totalAmount: expectedAmount,
      requestTarget,
      sessionId,
    })

    if (!reservation.success) {
      return new Response(
        JSON.stringify({ error: reservation.error || "No se pudieron reservar los números." }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      )
    }

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || new URL(request.url).host
    const proto = request.headers.get("x-forwarded-proto") || "https"
    let baseUrl = `${proto}://${host}`

    if (baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1") || !baseUrl.startsWith("http")) {
      baseUrl = "https://valdivia-automotores-sorteo.vercel.app"
    }

    // Crear Preferencia oficial de Mercado Pago
    const mpRes = await createMPPreference({
      orderId,
      ticketCount: count,
      unitPrice: raffle.ticketBasePrice,
      totalAmount: expectedAmount,
      buyerName: nameStr,
      buyerEmail: emailStr,
      buyerDni: dniStr,
      buyerPhone: phoneStr,
      baseUrl,
    })

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        tickets: reservation.numbers,
        amount: expectedAmount,
        initPoint: mpRes.initPoint,
        isDemo: mpRes.isDemo,
        reservedUntil: reservation.reservedUntil,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error: any) {
    console.error("Error en POST /api/checkout:", error)
    const errorMsg = String(error?.message || error || "Error interno al procesar la compra.")
    return new Response(
      JSON.stringify({ error: errorMsg }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
