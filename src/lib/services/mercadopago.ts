import { MercadoPagoConfig, Preference, Payment } from "mercadopago"
import { raffle } from "@/data/raffle"
import { approveOrderAndTickets } from "@/lib/services/tickets"
import fs from "node:fs"
import path from "node:path"

function getAccessToken(): string {
  try {
    const metaToken = (import.meta as any).env?.MERCADOPAGO_ACCESS_TOKEN
    if (metaToken) return String(metaToken)
  } catch { /* ignorar */ }

  if (typeof process !== "undefined" && process.env?.MERCADOPAGO_ACCESS_TOKEN) {
    return process.env.MERCADOPAGO_ACCESS_TOKEN
  }

  return ""
}

function getMPClient(): { client: MercadoPagoConfig | null; token: string } {
  const token = getAccessToken()
  console.log(`🔑 Mercado Pago Token: ${token ? `${token.substring(0, 10)}... (${token.length} chars)` : "❌ NO ENCONTRADO"}`)
  const client = token ? new MercadoPagoConfig({ accessToken: token }) : null
  return { client, token }
}

export interface CreatePreferenceParams {
  orderId: string
  ticketCount: number
  unitPrice: number
  totalAmount: number
  buyerName: string
  buyerEmail: string
  buyerDni: string
  buyerPhone: string
  baseUrl: string
}

export interface MercadoPagoPaymentStatus {
  id?: string
  orderId?: string
  status?: string
}

/**
 * Crea una Preferencia de Mercado Pago Checkout Pro optimizada para 100/100 Calidad de Integración.
 */
export async function createMPPreference(params: CreatePreferenceParams): Promise<{
  initPoint: string
  preferenceId?: string
  isDemo: boolean
}> {
  const {
    orderId,
    ticketCount,
    unitPrice,
    buyerName,
    buyerEmail,
    buyerDni,
    buyerPhone,
    baseUrl,
  } = params

  const { client, token } = getMPClient()

  if (!client || !token) {
    console.log("ℹ️ MERCADOPAGO_ACCESS_TOKEN no configurado. Utilizando flujo de simulación demo.")
    return {
      initPoint: `${baseUrl}/api/simulate-payment?orderId=${orderId}`,
      isDemo: true,
    }
  }

  try {
    console.log(`🛒 Creando preferencia optimizada para orden ${orderId}: ${ticketCount} boletos x $${unitPrice}`)
    const preference = new Preference(client)

    const isLocalhost = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1")

    // Nombre limpio del comprador (separar nombre y apellido si es posible para MP)
    const nameParts = buyerName.trim().split(" ")
    const firstName = nameParts[0] || buyerName
    const lastName = nameParts.slice(1).join(" ") || buyerName

    // Cuerpo completo con mejores prácticas para Calidad de Integración 100/100
    const preferenceBody: any = {
      external_reference: orderId,
      statement_descriptor: "VALDIVIA SORTEO",
      binary_mode: true, // Aprobado o Rechazado inmediato
      items: [
        {
          id: `boletos-${orderId}`,
          title: `${ticketCount} Boleto${ticketCount > 1 ? "s" : ""} - ${raffle.title}`,
          description: `Boletos para el sorteo del ${raffle.prizeName}`,
          quantity: ticketCount,
          unit_price: unitPrice,
          currency_id: "ARS",
        },
      ],
      payer: {
        name: firstName,
        surname: lastName,
        email: buyerEmail,
        phone: {
          area_code: "11",
          number: buyerPhone,
        },
        identification: {
          type: "DNI",
          number: buyerDni,
        },
      },
    }

    // Configurar notificación Webhook y URLs de retorno (Requisito obligatorio para 100 puntos en MP)
    if (!isLocalhost) {
      preferenceBody.notification_url = `${baseUrl}/api/webhooks/mercadopago`
      preferenceBody.back_urls = {
        success: `${baseUrl}/confirmacion?orderId=${orderId}`,
        failure: `${baseUrl}/pago-rechazado?orderId=${orderId}`,
        pending: `${baseUrl}/confirmacion?orderId=${orderId}`,
      }
      preferenceBody.auto_return = "approved"
    }

    console.log("📤 Enviando preferencia a la API de Mercado Pago con notification_url...")
    const response = await preference.create({ body: preferenceBody })

    const isTestToken = token.startsWith("TEST-")
    const initPoint = isTestToken
      ? (response.sandbox_init_point || response.init_point)
      : (response.init_point || response.sandbox_init_point)

    if (!initPoint) {
      console.error("❌ Mercado Pago no devolvió ninguna URL de pago.")
      return {
        initPoint: `${baseUrl}/api/simulate-payment?orderId=${orderId}`,
        isDemo: true,
      }
    }

    console.log(`✅ Preferencia 100% Calidad creada (${isTestToken ? "Sandbox" : "Producción"}): ${initPoint}`)

    return {
      initPoint,
      preferenceId: response.id,
      isDemo: false,
    }
  } catch (error: any) {
    console.error("❌ ERROR creando preferencia en Mercado Pago:")
    console.error("   Mensaje:", error?.message || error)
    if (error?.cause) console.error("   Causa:", JSON.stringify(error.cause, null, 2))

    return {
      initPoint: `${baseUrl}/api/simulate-payment?orderId=${orderId}`,
      isDemo: true,
    }
  }
}

/**
 * Consulta el estado real de un pago a la API de Mercado Pago mediante su Payment ID
 */
export async function getMercadoPagoPaymentStatus(paymentId: string): Promise<MercadoPagoPaymentStatus> {
  const { client } = getMPClient()

  if (!client) {
    return { id: paymentId }
  }

  try {
    const payment = new Payment(client)
    const paymentData = await payment.get({ id: paymentId })

    return {
      id: String(paymentData.id),
      orderId: paymentData.external_reference ? String(paymentData.external_reference) : undefined,
      status: paymentData.status ? String(paymentData.status) : undefined,
    }
  } catch (error) {
    console.error(`Error consultando pago #${paymentId} en Mercado Pago:`, error)
    return { id: paymentId }
  }
}

/**
 * Procesa el estado devuelto por Mercado Pago y aprueba la orden atómicamente si fue aprobado.
 */
export async function processMercadoPagoPaymentStatus(payment: MercadoPagoPaymentStatus): Promise<boolean> {
  if (!payment.orderId) {
    console.log("ℹ️ Webhook recibido sin external_reference (orderId).")
    return false
  }

  if (payment.status === "approved") {
    console.log(`✅ Pago aprobado recibido para la Orden #${payment.orderId}`)
    return await approveOrderAndTickets(payment.orderId, payment.id)
  }

  console.log(`ℹ️ Estado de pago para la Orden #${payment.orderId}: ${payment.status || "desconocido"}`)
  return false
}
