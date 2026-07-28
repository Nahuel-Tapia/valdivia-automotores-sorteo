import { i as initDB, d as db } from '../../../chunks/index_D0UOeU_i.mjs';
import { s as sendOrderConfirmationEmail } from '../../../chunks/email_DRvbpv_u.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    await initDB();
    const { orderId } = await request.json();
    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "ID de orden requerido." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const orderRes = await db.execute({
      sql: "SELECT buyer_name, buyer_email, total_amount FROM orders WHERE id = ?",
      args: [orderId]
    });
    if (orderRes.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Orden no encontrada." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    const orderData = orderRes.rows[0];
    const ticketsRes = await db.execute({
      sql: "SELECT number FROM tickets WHERE order_id = ? ORDER BY number ASC",
      args: [orderId]
    });
    const tickets = ticketsRes.rows.map((r) => String(r.number));
    const sent = await sendOrderConfirmationEmail({
      orderId,
      buyerName: String(orderData.buyer_name),
      buyerEmail: String(orderData.buyer_email),
      tickets,
      totalAmount: Number(orderData.total_amount)
    });
    if (!sent) {
      return new Response(
        JSON.stringify({ error: "No se pudo enviar el correo electrónico." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: `Comprobante re-enviado exitosamente a ${orderData.buyer_email}`
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al re-enviar correo:", error);
    return new Response(
      JSON.stringify({ error: "Error interno procesando el re-envío de correo." }),
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
