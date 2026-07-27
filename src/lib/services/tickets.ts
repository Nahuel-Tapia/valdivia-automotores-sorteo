import { db, initDB } from "@/lib/db"
import { sendOrderConfirmationEmail, sendPaymentRejectedEmail } from "@/lib/services/email"

export interface TicketDBItem {
  number: string
  status: "available" | "reserved" | "paid"
  orderId?: string | null
  sessionId?: string | null
  reservedUntil?: number | null
}

const RESERVATION_MINUTES = 10

/** Limpia reservas expiradas que no fueron pagadas dentro del tiempo límite */
export async function cleanupExpiredReservations() {
  await initDB()
  const now = Date.now()
  await db.execute({
    sql: `UPDATE tickets 
          SET status = 'available', order_id = NULL, session_id = NULL, reserved_until = NULL 
          WHERE status = 'reserved' AND reserved_until < ?`,
    args: [now],
  })
}

/** Obtiene el mapa completo de estados de boletos para sincronización en tiempo real */
export async function getLiveTicketStatuses(sessionId?: string) {
  await initDB()
  await cleanupExpiredReservations()

  const res = await db.execute(
    "SELECT number, status, session_id as sessionId, reserved_until as reservedUntil FROM tickets WHERE status != 'available'"
  )

  const map: Record<string, { status: "mine" | "occupied" | "paid"; reservedUntil?: number }> = {}

  res.rows.forEach((r) => {
    const num = String(r.number)
    const st = String(r.status)
    const sId = r.sessionId ? String(r.sessionId) : null
    const until = r.reservedUntil ? Number(r.reservedUntil) : undefined

    if (st === "paid") {
      map[num] = { status: "paid" }
    } else if (st === "reserved") {
      if (sessionId && sId === sessionId) {
        map[num] = { status: "mine", reservedUntil: until }
      } else {
        map[num] = { status: "occupied", reservedUntil: until }
      }
    }
  })

  return map
}

/** Obtiene lista de boletos para la grilla pública */
export async function getDBTickets(search = "", filter: "all" | "available" = "all", limit = 100): Promise<TicketDBItem[]> {
  await initDB()
  await cleanupExpiredReservations()

  let sql = "SELECT number, status, order_id as orderId, session_id as sessionId, reserved_until as reservedUntil FROM tickets"
  const conditions: string[] = []
  const args: (string | number)[] = []

  if (search) {
    conditions.push("number LIKE ?")
    args.push(`%${search}%`)
  }

  if (filter === "available") {
    conditions.push("status = 'available'")
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ")
  }

  sql += " ORDER BY number ASC LIMIT ?"
  args.push(limit)

  const res = await db.execute({ sql, args })
  return res.rows.map((row) => ({
    number: String(row.number),
    status: row.status as "available" | "reserved" | "paid",
    orderId: row.orderId ? String(row.orderId) : null,
    sessionId: row.sessionId ? String(row.sessionId) : null,
    reservedUntil: row.reservedUntil ? Number(row.reservedUntil) : null,
  }))
}

/**
 * Bloquea o desbloquea una butaca/número en tiempo real para una sesión específica.
 */
export async function toggleSeatLock(
  number: string,
  sessionId: string
): Promise<{ success: boolean; action?: "locked" | "unlocked"; reservedUntil?: number; error?: string }> {
  await initDB()
  await cleanupExpiredReservations()

  const now = Date.now()
  const reservedUntil = now + RESERVATION_MINUTES * 60 * 1000

  // 1. Consultar estado del boleto
  const check = await db.execute({
    sql: "SELECT status, session_id, reserved_until FROM tickets WHERE number = ?",
    args: [number],
  })

  if (check.rows.length === 0) {
    return { success: false, error: "El número especificado no existe." }
  }

  const row = check.rows[0]
  const currentStatus = String(row.status)
  const currentSession = row.session_id ? String(row.session_id) : null

  // 2. Si ya está comprado, no se puede modificar
  if (currentStatus === "paid") {
    return { success: false, error: "Este boleto ya fue comprado." }
  }

  // 3. Si la sesión actual ya lo tiene reservado -> Desbloquear (toggle off)
  if (currentStatus === "reserved" && currentSession === sessionId) {
    await db.execute({
      sql: "UPDATE tickets SET status = 'available', session_id = NULL, order_id = NULL, reserved_until = NULL, updated_at = ? WHERE number = ?",
      args: [now, number],
    })
    return { success: true, action: "unlocked" }
  }

  // 4. Si está reservado por otra sesión activa -> Error de colisión en tiempo real
  if (currentStatus === "reserved" && currentSession !== sessionId) {
    return { success: false, error: "Este boleto acaba de ser reservado por otro comprador." }
  }

  // 5. Si está disponible -> Bloquear exclusivamente para esta sesión
  const lockRes = await db.execute({
    sql: "UPDATE tickets SET status = 'reserved', session_id = ?, reserved_until = ?, updated_at = ? WHERE number = ? AND status = 'available'",
    args: [sessionId, reservedUntil, now, number],
  })

  if (lockRes.rowsAffected === 0) {
    return { success: false, error: "No se pudo reservar el número. Intenta con otro." }
  }

  return { success: true, action: "locked", reservedUntil }
}

/** Reserva en lote atómica para el checkout final */
export async function reserveTicketsAtomic(
  request: string[] | number,
  orderId: string,
  sessionId?: string
): Promise<{ success: boolean; numbers: string[]; reservedUntil?: number; error?: string }> {
  await initDB()
  await cleanupExpiredReservations()

  const now = Date.now()
  const reservedUntil = now + RESERVATION_MINUTES * 60 * 1000
  let targetNumbers: string[] = []

  if (Array.isArray(request)) {
    targetNumbers = request
  } else {
    const res = await db.execute({
      sql: "SELECT number FROM tickets WHERE status = 'available' ORDER BY RANDOM() LIMIT ?",
      args: [request],
    })

    if (res.rows.length < request) {
      return { success: false, numbers: [], error: "No hay suficientes números disponibles." }
    }

    targetNumbers = res.rows.map((r) => String(r.number))
  }

  // Si son números reservados previamente por la misma sesión, disponibles o expirados
  const placeholders = targetNumbers.map(() => "?").join(",")
  const sqlCheck = sessionId
    ? `SELECT number FROM tickets WHERE number IN (${placeholders}) AND (status = 'available' OR session_id = ? OR reserved_until < ?)`
    : `SELECT number FROM tickets WHERE number IN (${placeholders}) AND (status = 'available' OR reserved_until < ?)`
  const argsCheck = sessionId ? [...targetNumbers, sessionId, now] : [...targetNumbers, now]

  const checkRes = await db.execute({
    sql: sqlCheck,
    args: argsCheck,
  })

  if (checkRes.rows.length !== targetNumbers.length) {
    return {
      success: false,
      numbers: [],
      error: "Uno o más de los números seleccionados ya fueron reservados por otro comprador.",
    }
  }

  const statements = targetNumbers.map((num) => ({
    sql: "UPDATE tickets SET status = 'reserved', order_id = ?, reserved_until = ?, updated_at = ? WHERE number = ?",
    args: [orderId, reservedUntil, now, num],
  }))

  await db.batch(statements, "write")

  return { success: true, numbers: targetNumbers, reservedUntil }
}

/** Aprobar el pago de una orden y marcar sus tickets como 'paid' definitivamente */
export async function approveOrderAndTickets(orderId: string, mpPaymentId?: string): Promise<boolean> {
  await initDB()
  const now = Date.now()

  const orderCheck = await db.execute({
    sql: "SELECT buyer_name, buyer_email, total_amount, status FROM orders WHERE id = ?",
    args: [orderId],
  })

  if (orderCheck.rows.length === 0) return false
  const orderData = orderCheck.rows[0]
  const orderStatus = String(orderData.status)

  if (orderStatus === "approved") return true
  if (orderStatus !== "pending") return false

  const orderRes = await db.execute({
    sql: "UPDATE orders SET status = 'approved', mp_payment_id = ? WHERE id = ? AND status = 'pending'",
    args: [mpPaymentId ?? "SIMULATED_PAYMENT", orderId],
  })

  if (orderRes.rowsAffected === 0) return false

  await db.execute({
    sql: "UPDATE tickets SET status = 'paid', reserved_until = NULL, session_id = NULL, updated_at = ? WHERE order_id = ? AND status = 'reserved'",
    args: [now, orderId],
  })

  const ticketsRes = await db.execute({
    sql: "SELECT number FROM tickets WHERE order_id = ? ORDER BY number ASC",
    args: [orderId],
  })

  const tickets = ticketsRes.rows.map((r) => String(r.number))

  sendOrderConfirmationEmail({
    orderId,
    buyerName: String(orderData.buyer_name),
    buyerEmail: String(orderData.buyer_email),
    tickets,
    totalAmount: Number(orderData.total_amount),
  }).catch((err) => console.error("Error asíncrono enviando email:", err))

  return true
}

/** Rechazar el pago de una orden y liberar inmediatamente sus tickets reservados */
export async function rejectOrderAndReleaseTickets(
  orderId: string,
  mpPaymentId?: string,
  options: { notifyBuyer?: boolean } = {}
): Promise<boolean> {
  await initDB()
  const now = Date.now()

  const orderCheck = await db.execute({
    sql: "SELECT buyer_name, buyer_email, total_amount, status FROM orders WHERE id = ?",
    args: [orderId],
  })

  if (orderCheck.rows.length === 0) return false

  const orderData = orderCheck.rows[0]
  if (String(orderData.status) === "approved") {
    return false
  }

  const ticketsRes = await db.execute({
    sql: "SELECT number FROM tickets WHERE order_id = ? AND status = 'reserved' ORDER BY number ASC",
    args: [orderId],
  })
  const tickets = ticketsRes.rows.map((r) => String(r.number))

  const orderRes = await db.execute({
    sql: "UPDATE orders SET status = 'rejected', mp_payment_id = ? WHERE id = ? AND status != 'approved'",
    args: [mpPaymentId ?? "PAYMENT_REJECTED", orderId],
  })

  if (orderRes.rowsAffected === 0) return false

  await db.execute({
    sql: `UPDATE tickets
          SET status = 'available', order_id = NULL, session_id = NULL, reserved_until = NULL, updated_at = ?
          WHERE order_id = ? AND status = 'reserved'`,
    args: [now, orderId],
  })

  if (tickets.length > 0 && options.notifyBuyer !== false) {
    sendPaymentRejectedEmail({
      orderId,
      buyerName: String(orderData.buyer_name),
      buyerEmail: String(orderData.buyer_email),
      tickets,
      totalAmount: Number(orderData.total_amount),
    }).catch((err) => console.error("Error asincrono enviando email de rechazo:", err))
  }

  return true
}
