import { raffle } from "@/data/raffle"

interface BuyerData {
  name: string
  email: string
  dni: string
  phone: string
}

interface CreatePaymentPreferenceInput {
  orderId: string
  buyer: BuyerData
  tickets: string[]
  ticketCount: number
  totalAmount: number
  reservedUntil: number
  origin: string
}

interface MercadoPagoPreferenceResponse {
  id: string
  initPoint: string
}

export interface MercadoPagoPaymentStatus {
  id?: string
  orderId?: string
  status?: string
}

function getObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" || typeof value === "number" ? String(value) : undefined
}

function getAccessToken(): string | null {
  return process.env.MERCADOPAGO_ACCESS_TOKEN || null
}

function getSiteUrl(origin: string): string {
  return (process.env.PUBLIC_SITE_URL || process.env.SITE_URL || origin).replace(/\/$/, "")
}

function isLocalUrl(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i.test(url)
}

function getPreferenceUrl(response: Record<string, unknown>, accessToken: string): string | null {
  const initPoint = typeof response.init_point === "string" ? response.init_point : null
  const sandboxInitPoint = typeof response.sandbox_init_point === "string" ? response.sandbox_init_point : null

  if (accessToken.startsWith("TEST-") || accessToken.startsWith("TEST_")) {
    return sandboxInitPoint || initPoint
  }

  return initPoint || sandboxInitPoint
}

export function canCreateMercadoPagoPreference(): boolean {
  return Boolean(getAccessToken())
}

export async function getMercadoPagoPaymentStatus(paymentId: string): Promise<MercadoPagoPaymentStatus> {
  const accessToken = getAccessToken()
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN is not configured.")
  }

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Mercado Pago payment lookup failed: ${response.status}`)
  }

  const payment = getObject(await response.json())
  return {
    id: getString(payment.id) || paymentId,
    orderId: getString(payment.external_reference),
    status: getString(payment.status),
  }
}

export async function createMercadoPagoPreference(
  input: CreatePaymentPreferenceInput
): Promise<MercadoPagoPreferenceResponse> {
  const accessToken = getAccessToken()
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN is not configured.")
  }

  const siteUrl = getSiteUrl(input.origin)
  if (isLocalUrl(siteUrl)) {
    throw new Error("PUBLIC_SITE_URL or SITE_URL must be a public URL for Mercado Pago redirects.")
  }

  const preferenceBody = {
    items: [
      {
        id: input.orderId,
        title: `${raffle.title} - ${input.ticketCount} boleto${input.ticketCount === 1 ? "" : "s"}`,
        quantity: input.ticketCount,
        currency_id: raffle.currency,
        unit_price: raffle.ticketBasePrice,
      },
    ],
    payer: {
      name: input.buyer.name,
      email: input.buyer.email,
      phone: {
        number: input.buyer.phone,
      },
      identification: {
        type: "DNI",
        number: input.buyer.dni,
      },
    },
    back_urls: {
      success: `${siteUrl}/confirmacion`,
      failure: `${siteUrl}/pago-rechazado`,
      pending: `${siteUrl}/pago-pendiente`,
    },
    auto_return: "approved",
    notification_url: `${siteUrl}/api/webhooks/mercadopago`,
    external_reference: input.orderId,
    binary_mode: true,
    expires: true,
    expiration_date_from: new Date().toISOString(),
    expiration_date_to: new Date(input.reservedUntil).toISOString(),
    statement_descriptor: "VALDIVIA",
    metadata: {
      order_id: input.orderId,
      ticket_numbers: input.tickets.join(","),
    },
  }

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferenceBody),
  })

  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>

  if (!response.ok) {
    console.error("[Mercado Pago] Error creando preferencia:", body)
    throw new Error(`Mercado Pago preference creation failed: ${response.status}`)
  }

  const preferenceId = typeof body.id === "string" ? body.id : null
  const initPoint = getPreferenceUrl(body, accessToken)

  if (!preferenceId || !initPoint) {
    throw new Error("Mercado Pago preference response is missing id or init_point.")
  }

  return {
    id: preferenceId,
    initPoint,
  }
}
