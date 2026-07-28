import { a as approveOrderAndTickets } from '../../../chunks/tickets_B79piL2P.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "ID de orden requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const success = await approveOrderAndTickets(orderId, "ADMIN_MANUAL_APPROVAL");
    if (!success) {
      return new Response(
        JSON.stringify({ error: "No se pudo encontrar o aprobar la orden." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: `Orden #${orderId} aprobada exitosamente y correo de comprobante enviado.`
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en aprobación manual admin:", error);
    return new Response(
      JSON.stringify({ error: "Error interno al aprobar orden." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
