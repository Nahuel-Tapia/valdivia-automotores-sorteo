import type { APIRoute } from "astro"
import type { MercadoPagoPaymentStatus } from "@/lib/services/mercadopago"
import { getMercadoPagoPaymentStatus } from "@/lib/services/mercadopago"
import { processMercadoPagoPaymentStatus } from "@/lib/services/payment-processing"

export const prerender = false

function getObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" || typeof value === "number" ? String(value) : undefined
}

async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) return {}

  try {
    return getObject(await request.json())
  } catch {
    return {}
  }
}

function getPaymentStatusFromBody(
  body: Record<string, unknown>,
  fallbackPaymentId?: string
): MercadoPagoPaymentStatus {
  const data = getObject(body.data)
  const payment = getObject(body.payment)

  return {
    id: getString(data.id) || getString(payment.id) || getString(body.id) || fallbackPaymentId,
    orderId:
      getString(body.orderId) ||
      getString(body.external_reference) ||
      getString(data.external_reference) ||
      getString(payment.external_reference),
    status: getString(body.status) || getString(data.status) || getString(payment.status),
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const urlParams = new URL(request.url).searchParams
    const type = urlParams.get("type") || urlParams.get("topic")
    const paymentId = urlParams.get("data.id") || urlParams.get("id") || undefined
    const body = await readJsonBody(request)

    if (type !== "payment" && !paymentId && Object.keys(body).length === 0) {
      return new Response(JSON.stringify({ received: true, processed: "ignored" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    const payment =
      paymentId && process.env.MERCADOPAGO_ACCESS_TOKEN
        ? await getMercadoPagoPaymentStatus(paymentId)
        : getPaymentStatusFromBody(body, paymentId)

    const processed = await processMercadoPagoPaymentStatus(payment)

    return new Response(JSON.stringify({ received: true, processed }), {
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
