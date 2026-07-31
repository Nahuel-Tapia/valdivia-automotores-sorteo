import type { APIRoute } from "astro"
import { verifyAdminRequest } from "@/lib/services/auth"
import { getTicketPrice, setTicketPrice } from "@/lib/services/settings"

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
    return new Response(
      JSON.stringify({ success: true, ticketPrice: price }),
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
    const { ticketPrice } = body
    const priceNum = Number(ticketPrice)

    if (isNaN(priceNum) || priceNum <= 0) {
      return new Response(
        JSON.stringify({ error: "El precio debe ser un número válido mayor a 0." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const saved = await setTicketPrice(priceNum)
    if (!saved) {
      return new Response(
        JSON.stringify({ error: "No se pudo guardar el precio en la base de datos." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Precio de boleto actualizado exitosamente.",
        ticketPrice: priceNum,
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
