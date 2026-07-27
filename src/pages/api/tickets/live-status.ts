import type { APIRoute } from "astro"
import { getLiveTicketStatuses } from "@/lib/services/tickets"

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get("sessionId") || undefined

    const statuses = await getLiveTicketStatuses(sessionId)

    return new Response(
      JSON.stringify({ success: true, statuses }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error en live-status API:", error)
    return new Response(
      JSON.stringify({ error: "Error obteniendo estados en vivo." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
