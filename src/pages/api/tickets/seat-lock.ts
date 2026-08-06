import type { APIRoute } from "astro"
import { toggleSeatLock } from "@/lib/services/tickets"
import { getTicketCount } from "@/lib/services/settings"

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    const { number, sessionId } = await request.json()

    const totalTickets = await getTicketCount()
    const padLen = totalTickets > 999 ? 4 : 3
    const numStr = String(number ?? "").padStart(padLen, "0")
    const sessStr = String(sessionId ?? "").trim()

    if (!/^\d+$/.test(numStr) || !sessStr || sessStr.length > 100) {
      return new Response(
        JSON.stringify({ error: "Formato de número o ID de sesión inválido." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const numVal = parseInt(numStr, 10)
    if (numVal < 1 || numVal > totalTickets) {
      return new Response(
        JSON.stringify({ error: `El número debe estar entre ${String(1).padStart(padLen, "0")} y ${totalTickets}.` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const res = await toggleSeatLock(numStr, sessStr)

    if (!res.success) {
      return new Response(
        JSON.stringify({ error: res.error }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify(res),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error en seat-lock API:", error)
    return new Response(
      JSON.stringify({ error: "Error procesando reserva de boleto." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
