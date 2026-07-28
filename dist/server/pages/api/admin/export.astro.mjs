import { i as initDB, d as db } from '../../../chunks/index_D0UOeU_i.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async () => {
  try {
    await initDB();
    const res = await db.execute(`
      SELECT 
        t.number as ticketNumber,
        o.id as orderId,
        o.buyer_name as buyerName,
        o.buyer_dni as buyerDni,
        o.buyer_email as buyerEmail,
        o.buyer_phone as buyerPhone,
        o.payment_method as paymentMethod,
        o.created_at as createdAt
      FROM tickets t
      INNER JOIN orders o ON t.order_id = o.id
      WHERE t.status = 'paid' AND o.status = 'approved'
      ORDER BY t.number ASC
    `);
    let csvContent = "Numero_Boleto,Orden_ID,Nombre_Comprador,DNI,Email,Telefono,Metodo_Pago,Fecha_Compra\n";
    res.rows.forEach((r) => {
      const date = new Date(Number(r.createdAt)).toISOString().split("T")[0];
      const line = `"${r.ticketNumber}","${r.orderId}","${r.buyerName}","${r.buyerDni}","${r.buyerEmail}","${r.buyerPhone}","${r.paymentMethod}","${date}"
`;
      csvContent += line;
    });
    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="lista_oficial_participantes_${Date.now()}.csv"`
      }
    });
  } catch (error) {
    console.error("Error exportando CSV:", error);
    return new Response(JSON.stringify({ error: "Error generando archivo CSV." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
