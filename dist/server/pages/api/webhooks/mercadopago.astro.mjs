import { g as getMercadoPagoPaymentStatus } from '../../../chunks/mercadopago_D1ajzrxu.mjs';
import { p as processMercadoPagoPaymentStatus } from '../../../chunks/payment-processing_B9M3uCJD.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
function getObject(value) {
  return value && typeof value === "object" ? value : {};
}
function getString(value) {
  return typeof value === "string" || typeof value === "number" ? String(value) : void 0;
}
async function readJsonBody(request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return {};
  try {
    return getObject(await request.json());
  } catch {
    return {};
  }
}
function getPaymentStatusFromBody(body, fallbackPaymentId) {
  const data = getObject(body.data);
  const payment = getObject(body.payment);
  return {
    id: getString(data.id) || getString(payment.id) || getString(body.id) || fallbackPaymentId,
    orderId: getString(body.orderId) || getString(body.external_reference) || getString(data.external_reference) || getString(payment.external_reference),
    status: getString(body.status) || getString(data.status) || getString(payment.status)
  };
}
const POST = async ({ request }) => {
  try {
    const urlParams = new URL(request.url).searchParams;
    const type = urlParams.get("type") || urlParams.get("topic");
    const paymentId = urlParams.get("data.id") || urlParams.get("id") || void 0;
    const body = await readJsonBody(request);
    if (type !== "payment" && !paymentId && Object.keys(body).length === 0) {
      return new Response(JSON.stringify({ received: true, processed: "ignored" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const payment = paymentId && process.env.MERCADOPAGO_ACCESS_TOKEN ? await getMercadoPagoPaymentStatus(paymentId) : getPaymentStatusFromBody(body, paymentId);
    const processed = await processMercadoPagoPaymentStatus(payment);
    return new Response(JSON.stringify({ received: true, processed }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error en Webhook MercadoPago:", error);
    return new Response(JSON.stringify({ error: "Error procesando webhook" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
