import '../../../chunks/index_CcSqpnRC.mjs';
import '../../../chunks/email_z8vBkfDl.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const urlParams = new URL(request.url).searchParams;
    const type = urlParams.get("type") || urlParams.get("topic");
    const id = urlParams.get("data.id") || urlParams.get("id");
    if (type === "payment" && id) {
      console.log(`🔔 Webhook MercadoPago recibido para pago ID: ${id}`);
    }
    return new Response(JSON.stringify({ received: true }), {
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
