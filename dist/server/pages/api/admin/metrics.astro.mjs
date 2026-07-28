import { i as initDB, d as db } from '../../../chunks/index_D0UOeU_i.mjs';
import { c as cleanupExpiredReservations } from '../../../chunks/tickets_B79piL2P.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async () => {
  try {
    await initDB();
    await cleanupExpiredReservations();
    const ticketsCountRes = await db.execute(`
      SELECT 
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
        SUM(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) as reserved,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid,
        COUNT(*) as total
      FROM tickets
    `);
    const ticketStats = ticketsCountRes.rows[0];
    const revenueRes = await db.execute(`
      SELECT SUM(total_amount) as totalRevenue, COUNT(*) as approvedOrders
      FROM orders
      WHERE status = 'approved'
    `);
    const revenueStats = revenueRes.rows[0];
    const recentOrdersRes = await db.execute(`
      SELECT id, buyer_name as buyerName, buyer_email as buyerEmail, ticket_count as ticketCount, total_amount as totalAmount, status, payment_method as paymentMethod, created_at as createdAt
      FROM orders
      ORDER BY created_at DESC
      LIMIT 10
    `);
    return new Response(
      JSON.stringify({
        success: true,
        metrics: {
          availableTickets: Number(ticketStats.available || 0),
          reservedTickets: Number(ticketStats.reserved || 0),
          paidTickets: Number(ticketStats.paid || 0),
          totalTickets: Number(ticketStats.total || 0),
          totalRevenue: Number(revenueStats.totalRevenue || 0),
          approvedOrders: Number(revenueStats.approvedOrders || 0)
        },
        recentOrders: recentOrdersRes.rows
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en admin metrics:", error);
    return new Response(
      JSON.stringify({ error: "Error interno al consultar métricas." }),
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
