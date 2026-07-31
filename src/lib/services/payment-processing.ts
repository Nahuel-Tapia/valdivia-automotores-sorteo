import type { MercadoPagoPaymentStatus } from "@/lib/services/mercadopago"
import { approveOrderAndTickets, rejectOrderAndReleaseTickets } from "@/lib/services/tickets"

const rejectedStatuses = new Set(["rejected", "cancelled", "refunded", "charged_back"])

export type PaymentProcessingResult = "approved" | "rejected" | "ignored"

export async function processMercadoPagoPaymentStatus(
  payment: MercadoPagoPaymentStatus
): Promise<PaymentProcessingResult> {
  if (!payment.orderId || !payment.status) {
    console.warn(`[PaymentProcessing] Ignorado: falta orderId o status en pago #${payment.id}`)
    return "ignored"
  }

  if (payment.status === "approved") {
    console.log(`[PaymentProcessing] Intentando aprobar orden ${payment.orderId}...`)
    const res = await approveOrderAndTickets(payment.orderId, payment.id, { ignoreExpiration: true })
    console.log(`[PaymentProcessing] Resultado de aprobación: ${res.success ? "EXITO" : `FALLO (${res.reason})`}`)
    return res.success ? "approved" : "rejected"
  }

  if (rejectedStatuses.has(payment.status)) {
    console.log(`[PaymentProcessing] Intentando rechazar orden ${payment.orderId}...`)
    const rejected = await rejectOrderAndReleaseTickets(payment.orderId, payment.id)
    console.log(`[PaymentProcessing] Resultado de rechazo: ${rejected ? "EXITO" : "IGNORADO (orden no encontrada/ya procesada)"}`)
    return rejected ? "rejected" : "ignored"
  }

  console.log(`[PaymentProcessing] Ignorado: status no manejado ('${payment.status}') para orden ${payment.orderId}`)
  return "ignored"
}
