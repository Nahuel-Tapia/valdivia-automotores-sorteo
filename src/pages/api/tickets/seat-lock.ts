import type { APIRoute } from "astro"
import { toggleSeatLock } from "@/lib/services/tickets"

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    const { number, sessionId } = await request.json()

    const numStr = String(number ?? "").padStart(3, "0")
    const sessStr = String(sessionId ?? "").trim()

    if (!/^\d{3}$/.test(numStr) || !sessStr || sessStr.length > 100) {
      return new Response(
        JSON.stringify({ error: "Formato de número o ID de sesión inválido." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const numVal = parseInt(numStr, 10)
    if (numVal < 1 || numVal > 200) {
      return new Response(
        JSON.stringify({ error: "El número debe estar entre 001 y 200." }),
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
