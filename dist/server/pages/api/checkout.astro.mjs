import { r as raffle } from '../../chunks/raffle_BobqFDMx.mjs';
import { i as initDB, d as db } from '../../chunks/index_D0UOeU_i.mjs';
import { r as reserveTicketsAtomic } from '../../chunks/tickets_B79piL2P.mjs';
import { c as createMPPreference } from '../../chunks/mercadopago_D1ajzrxu.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    await initDB();
    const body = await request.json();
    const { tickets, selectedNumbers, sessionId, buyer, paymentMethod } = body;
    const count = Number(tickets);
    if (!count || count < 1) {
      return new Response(
        JSON.stringify({ error: "Cantidad de números inválida" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const nameStr = String(buyer?.name ?? "").trim();
    const dniStr = String(buyer?.dni ?? "").replace(/\D/g, "");
    const emailStr = String(buyer?.email ?? "").trim();
    const phoneStr = String(buyer?.phone ?? "").replace(/\D/g, "");
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,80}$/;
    if (!nameRegex.test(nameStr)) {
      return new Response(
        JSON.stringify({ error: "El nombre solo debe contener letras y un máximo de 80 caracteres." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (dniStr.length !== 8) {
      return new Response(
        JSON.stringify({ error: "El DNI debe estar conformado por exactamente 8 números." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailStr)) {
      return new Response(
        JSON.stringify({ error: "El formato de correo debe ser válido (debe contener @ y .com)." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (phoneStr.length < 9 || phoneStr.length > 11) {
      return new Response(
        JSON.stringify({ error: "El teléfono debe contener entre 9 y 11 números." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const expectedAmount = count * raffle.ticketBasePrice;
    const orderId = `ORD-${Math.floor(1e5 + Math.random() * 9e5)}`;
    const now = Date.now();
    await db.execute({
      sql: `INSERT INTO orders (id, buyer_name, buyer_email, buyer_dni, buyer_phone, ticket_count, total_amount, status, payment_method, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      args: [
        orderId,
        String(buyer.name),
        String(buyer.email),
        String(buyer.dni),
        String(buyer.phone),
        count,
        expectedAmount,
        paymentMethod || "mercadopago",
        now
      ]
    });
    const requestTarget = Array.isArray(selectedNumbers) && selectedNumbers.length === count ? selectedNumbers : count;
    const reservation = await reserveTicketsAtomic(requestTarget, orderId, sessionId);
    if (!reservation.success) {
      await db.execute({ sql: "DELETE FROM orders WHERE id = ?", args: [orderId] });
      return new Response(
        JSON.stringify({ error: reservation.error || "No se pudieron reservar los números." }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    if (paymentMethod === "mercadopago" || !paymentMethod) {
      const mpRes = await createMPPreference({
        orderId,
        ticketCount: count,
        unitPrice: raffle.ticketBasePrice,
        totalAmount: expectedAmount,
        buyerName: String(buyer.name),
        buyerEmail: String(buyer.email),
        buyerDni: String(buyer.dni),
        buyerPhone: String(buyer.phone),
        baseUrl
      });
      return new Response(
        JSON.stringify({
          success: true,
          orderId,
          tickets: reservation.numbers,
          amount: expectedAmount,
          initPoint: mpRes.initPoint,
          isDemo: mpRes.isDemo,
          reservedUntil: now + 15 * 60 * 1e3
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        tickets: reservation.numbers,
        amount: expectedAmount,
        paymentMethod: "transferencia",
        bankInfo: {
          bank: "Banco Galicia",
          cbu: "0070123420000012345678",
          alias: "VALDIVIA.SORTEO.MP",
          cuit: "30-71234567-8",
          holder: "Valdivia Automotores S.A."
        },
        reservedUntil: now + 15 * 60 * 1e3
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en POST /api/checkout:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor al procesar checkout." }),
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
