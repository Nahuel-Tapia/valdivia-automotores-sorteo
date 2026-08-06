import type { APIRoute } from "astro"
import { verifyAdminRequest } from "@/lib/services/auth"
import { getTicketPrice, setTicketPrice, getDrawDate, setDrawDate, getTicketCount, setTicketCount } from "@/lib/services/settings"

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  try {
    if (!verifyAdminRequest(request)) {
      return new Response(
        JSON.stringify({ error: "No autorizado. Sesión de administrador requerida." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    const price = await getTicketPrice()
    const drawDate = await getDrawDate()
    const totalTickets = await getTicketCount()
    return new Response(
      JSON.stringify({ success: true, ticketPrice: price, drawDate, totalTickets }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error al obtener configuraciones:", error)
    return new Response(
      JSON.stringify({ error: "Error interno obteniendo configuraciones." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!verifyAdminRequest(request)) {
      return new Response(
        JSON.stringify({ error: "No autorizado. Sesión de administrador requerida." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    const body = await request.json()
    const { ticketPrice, drawDate, totalTickets } = body

    if (ticketPrice !== undefined) {
      const priceNum = Number(ticketPrice)
      if (isNaN(priceNum) || priceNum <= 0) {
        return new Response(
          JSON.stringify({ error: "El precio debe ser un número válido mayor a 0." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        )
      }
      await setTicketPrice(priceNum)
    }

    if (drawDate !== undefined) {
      if (!drawDate || isNaN(Date.parse(drawDate))) {
        return new Response(
          JSON.stringify({ error: "La fecha del sorteo ingresada no es válida." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        )
      }
      await setDrawDate(drawDate)
    }

    if (totalTickets !== undefined) {
      const countNum = Number(totalTickets)
      if (isNaN(countNum) || countNum <= 0) {
        return new Response(
          JSON.stringify({ error: "La cantidad de boletos debe ser un número válido mayor a 0." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        )
      }
      const countRes = await setTicketCount(countNum)
      if (!countRes.success) {
        return new Response(
          JSON.stringify({ error: countRes.error || "No se pudo actualizar la cantidad de boletos." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        )
      }
    }

    const updatedPrice = await getTicketPrice()
    const updatedDate = await getDrawDate()
    const updatedCount = await getTicketCount()

    return new Response(
      JSON.stringify({
        success: true,
        message: "Configuraciones actualizadas exitosamente.",
        ticketPrice: updatedPrice,
        drawDate: updatedDate,
        totalTickets: updatedCount,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error al guardar configuraciones:", error)
    return new Response(
      JSON.stringify({ error: "Error interno guardando configuraciones." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
