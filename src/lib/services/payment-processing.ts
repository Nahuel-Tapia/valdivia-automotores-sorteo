import type { MercadoPagoPaymentStatus } from "@/lib/services/mercadopago"
import { approveOrderAndTickets, rejectOrderAndReleaseTickets } from "@/lib/services/tickets"

const rejectedStatuses = new Set(["rejected", "cancelled", "refunded", "charged_back"])

export type PaymentProcessingResult = "approved" | "rejected" | "ignored"

export async function processMercadoPagoPaymentStatus(
  payment: MercadoPagoPaymentStatus
): Promise<PaymentProcessingResult> {
  if (!payment.orderId || !payment.status) return "ignored"

  if (payment.status === "approved") {
    const approved = await approveOrderAndTickets(payment.orderId, payment.id)
    return approved ? "approved" : "ignored"
  }

  if (rejectedStatuses.has(payment.status)) {
    const rejected = await rejectOrderAndReleaseTickets(payment.orderId, payment.id)
    return rejected ? "rejected" : "ignored"
  }

  return "ignored"
}
