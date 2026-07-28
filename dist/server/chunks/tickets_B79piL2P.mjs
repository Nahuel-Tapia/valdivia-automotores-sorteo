import { i as initDB, d as db } from './index_D0UOeU_i.mjs';
import { s as sendOrderConfirmationEmail, a as sendPaymentRejectedEmail } from './email_DRvbpv_u.mjs';

const RESERVATION_MINUTES = 10;
async function cleanupExpiredReservations() {
  await initDB();
  const now = Date.now();
  await db.execute({
    sql: `UPDATE tickets 
          SET status = 'available', order_id = NULL, session_id = NULL, reserved_until = NULL 
          WHERE status = 'reserved' AND reserved_until < ?`,
    args: [now]
  });
}
async function getLiveTicketStatuses(sessionId) {
  await initDB();
  await cleanupExpiredReservations();
  const res = await db.execute(
    "SELECT number, status, session_id as sessionId, reserved_until as reservedUntil FROM tickets WHERE status != 'available'"
  );
  const map = {};
  res.rows.forEach((r) => {
    const num = String(r.number);
    const st = String(r.status);
    const sId = r.sessionId ? String(r.sessionId) : null;
    const until = r.reservedUntil ? Number(r.reservedUntil) : void 0;
    if (st === "paid") {
      map[num] = { status: "paid" };
    } else if (st === "reserved") {
      if (sessionId && sId === sessionId) {
        map[num] = { status: "mine", reservedUntil: until };
      } else {
        map[num] = { status: "occupied", reservedUntil: until };
      }
    }
  });
  return map;
}
async function getDBTickets(search = "", filter = "all", limit = 100) {
  await initDB();
  await cleanupExpiredReservations();
  let sql = "SELECT number, status, order_id as orderId, session_id as sessionId, reserved_until as reservedUntil FROM tickets";
  const conditions = [];
  const args = [];
  if (search) {
    conditions.push("number LIKE ?");
    args.push(`%${search}%`);
  }
  if (filter === "available") {
    conditions.push("status = 'available'");
  }
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  sql += " ORDER BY number ASC LIMIT ?";
  args.push(limit);
  const res = await db.execute({ sql, args });
  return res.rows.map((row) => ({
    number: String(row.number),
    status: row.status,
    orderId: row.orderId ? String(row.orderId) : null,
    sessionId: row.sessionId ? String(row.sessionId) : null,
    reservedUntil: row.reservedUntil ? Number(row.reservedUntil) : null
  }));
}
async function toggleSeatLock(number, sessionId) {
  await initDB();
  await cleanupExpiredReservations();
  const now = Date.now();
  const reservedUntil = now + RESERVATION_MINUTES * 60 * 1e3;
  const check = await db.execute({
    sql: "SELECT status, session_id, reserved_until FROM tickets WHERE number = ?",
    args: [number]
  });
  if (check.rows.length === 0) {
    return { success: false, error: "El número especificado no existe." };
  }
  const row = check.rows[0];
  const currentStatus = String(row.status);
  const currentSession = row.session_id ? String(row.session_id) : null;
  if (currentStatus === "paid") {
    return { success: false, error: "Este boleto ya fue comprado." };
  }
  if (currentStatus === "reserved" && currentSession === sessionId) {
    await db.execute({
      sql: "UPDATE tickets SET status = 'available', session_id = NULL, order_id = NULL, reserved_until = NULL, updated_at = ? WHERE number = ?",
      args: [now, number]
    });
    return { success: true, action: "unlocked" };
  }
  if (currentStatus === "reserved" && currentSession !== sessionId) {
    return { success: false, error: "Este boleto acaba de ser reservado por otro comprador." };
  }
  const lockRes = await db.execute({
    sql: "UPDATE tickets SET status = 'reserved', session_id = ?, reserved_until = ?, updated_at = ? WHERE number = ? AND status = 'available'",
    args: [sessionId, reservedUntil, now, number]
  });
  if (lockRes.rowsAffected === 0) {
    return { success: false, error: "No se pudo reservar el número. Intenta con otro." };
  }
  return { success: true, action: "locked", reservedUntil };
}
async function reserveTicketsAtomic(request, orderId, sessionId) {
  await initDB();
  await cleanupExpiredReservations();
  const now = Date.now();
  const reservedUntil = now + RESERVATION_MINUTES * 60 * 1e3;
  let targetNumbers = [];
  if (Array.isArray(request)) {
    targetNumbers = request;
  } else {
    const res = await db.execute({
      sql: "SELECT number FROM tickets WHERE status = 'available' ORDER BY RANDOM() LIMIT ?",
      args: [request]
    });
    if (res.rows.length < request) {
      return { success: false, numbers: [], error: "No hay suficientes números disponibles." };
    }
    targetNumbers = res.rows.map((r) => String(r.number));
  }
  const placeholders = targetNumbers.map(() => "?").join(",");
  const sqlCheck = sessionId ? `SELECT number FROM tickets WHERE number IN (${placeholders}) AND (status = 'available' OR session_id = ? OR reserved_until < ?)` : `SELECT number FROM tickets WHERE number IN (${placeholders}) AND (status = 'available' OR reserved_until < ?)`;
  const argsCheck = sessionId ? [...targetNumbers, sessionId, now] : [...targetNumbers, now];
  const checkRes = await db.execute({
    sql: sqlCheck,
    args: argsCheck
  });
  if (checkRes.rows.length !== targetNumbers.length) {
    return {
      success: false,
      numbers: [],
      error: "Uno o más de los números seleccionados ya fueron reservados por otro comprador."
    };
  }
  const statements = targetNumbers.map((num) => ({
    sql: "UPDATE tickets SET status = 'reserved', order_id = ?, reserved_until = ?, updated_at = ? WHERE number = ?",
    args: [orderId, reservedUntil, now, num]
  }));
  await db.batch(statements, "write");
  return { success: true, numbers: targetNumbers, reservedUntil };
}
async function approveOrderAndTickets(orderId, mpPaymentId) {
  await initDB();
  const now = Date.now();
  const orderCheck = await db.execute({
    sql: "SELECT buyer_name, buyer_email, total_amount, status FROM orders WHERE id = ?",
    args: [orderId]
  });
  if (orderCheck.rows.length === 0) return false;
  const orderData = orderCheck.rows[0];
  const orderStatus = String(orderData.status);
  if (orderStatus === "approved") return true;
  if (orderStatus !== "pending") return false;
  const orderRes = await db.execute({
    sql: "UPDATE orders SET status = 'approved', mp_payment_id = ? WHERE id = ? AND status = 'pending'",
    args: [mpPaymentId ?? "SIMULATED_PAYMENT", orderId]
  });
  if (orderRes.rowsAffected === 0) return false;
  await db.execute({
    sql: "UPDATE tickets SET status = 'paid', reserved_until = NULL, session_id = NULL, updated_at = ? WHERE order_id = ? AND status = 'reserved'",
    args: [now, orderId]
  });
  const ticketsRes = await db.execute({
    sql: "SELECT number FROM tickets WHERE order_id = ? ORDER BY number ASC",
    args: [orderId]
  });
  const tickets = ticketsRes.rows.map((r) => String(r.number));
  sendOrderConfirmationEmail({
    orderId,
    buyerName: String(orderData.buyer_name),
    buyerEmail: String(orderData.buyer_email),
    tickets,
    totalAmount: Number(orderData.total_amount)
  }).catch((err) => console.error("Error asíncrono enviando email:", err));
  return true;
}
async function rejectOrderAndReleaseTickets(orderId, mpPaymentId, options = {}) {
  await initDB();
  const now = Date.now();
  const orderCheck = await db.execute({
    sql: "SELECT buyer_name, buyer_email, total_amount, status FROM orders WHERE id = ?",
    args: [orderId]
  });
  if (orderCheck.rows.length === 0) return false;
  const orderData = orderCheck.rows[0];
  if (String(orderData.status) === "approved") {
    return false;
  }
  const ticketsRes = await db.execute({
    sql: "SELECT number FROM tickets WHERE order_id = ? AND status = 'reserved' ORDER BY number ASC",
    args: [orderId]
  });
  const tickets = ticketsRes.rows.map((r) => String(r.number));
  const orderRes = await db.execute({
    sql: "UPDATE orders SET status = 'rejected', mp_payment_id = ? WHERE id = ? AND status != 'approved'",
    args: [mpPaymentId ?? "PAYMENT_REJECTED", orderId]
  });
  if (orderRes.rowsAffected === 0) return false;
  await db.execute({
    sql: `UPDATE tickets
          SET status = 'available', order_id = NULL, session_id = NULL, reserved_until = NULL, updated_at = ?
          WHERE order_id = ? AND status = 'reserved'`,
    args: [now, orderId]
  });
  if (tickets.length > 0 && options.notifyBuyer !== false) {
    sendPaymentRejectedEmail({
      orderId,
      buyerName: String(orderData.buyer_name),
      buyerEmail: String(orderData.buyer_email),
      tickets,
      totalAmount: Number(orderData.total_amount)
    }).catch((err) => console.error("Error asincrono enviando email de rechazo:", err));
  }
  return true;
}

export { approveOrderAndTickets as a, rejectOrderAndReleaseTickets as b, cleanupExpiredReservations as c, getDBTickets as d, getLiveTicketStatuses as g, reserveTicketsAtomic as r, toggleSeatLock as t };
