import { a as approveOrderAndTickets, b as rejectOrderAndReleaseTickets } from './tickets_B79piL2P.mjs';

const rejectedStatuses = /* @__PURE__ */ new Set(["rejected", "cancelled", "refunded", "charged_back"]);
async function processMercadoPagoPaymentStatus(payment) {
  if (!payment.orderId || !payment.status) return "ignored";
  if (payment.status === "approved") {
    const approved = await approveOrderAndTickets(payment.orderId, payment.id);
    return approved ? "approved" : "ignored";
  }
  if (rejectedStatuses.has(payment.status)) {
    const rejected = await rejectOrderAndReleaseTickets(payment.orderId, payment.id);
    return rejected ? "rejected" : "ignored";
  }
  return "ignored";
}

export { processMercadoPagoPaymentStatus as p };
