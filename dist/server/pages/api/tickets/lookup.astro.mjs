import { i as initDB, d as db } from '../../../chunks/index_D0UOeU_i.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  try {
    await initDB();
    const url = new URL(request.url);
    const query = url.searchParams.get("query")?.trim();
    if (!query) {
      return new Response(
        JSON.stringify({ error: "Ingresá un DNI o Email válido." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const ordersRes = await db.execute({
      sql: `SELECT 
              id, 
              buyer_name as buyerName, 
              buyer_email as buyerEmail, 
              buyer_dni as buyerDni, 
              ticket_count as ticketCount, 
              total_amount as totalAmount, 
              status, 
              created_at as createdAt 
            FROM orders 
            WHERE (buyer_dni = ? OR buyer_email = ?) AND status != 'rejected'
            ORDER BY created_at DESC`,
      args: [query, query]
    });
    if (ordersRes.rows.length === 0) {
      return new Response(
        JSON.stringify({ success: true, orders: [] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    const orders = [];
    for (const row of ordersRes.rows) {
      const orderId = String(row.id);
      const ticketsRes = await db.execute({
        sql: "SELECT number FROM tickets WHERE order_id = ? ORDER BY number ASC",
        args: [orderId]
      });
      const tickets = ticketsRes.rows.map((t) => String(t.number));
      orders.push({
        id: orderId,
        buyerName: String(row.buyerName),
        buyerEmail: String(row.buyerEmail),
        buyerDni: String(row.buyerDni),
        ticketCount: Number(row.ticketCount),
        totalAmount: Number(row.totalAmount),
        status: String(row.status),
        createdAt: Number(row.createdAt),
        tickets
      });
    }
    return new Response(
      JSON.stringify({ success: true, orders }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en lookup API:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor al consultar boletos." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
