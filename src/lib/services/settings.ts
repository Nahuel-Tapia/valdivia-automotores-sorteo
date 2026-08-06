import { db, initDB } from "@/lib/db"
import { raffle } from "@/data/raffle"

export async function getSetting(key: string, defaultValue: string): Promise<string> {
  await initDB()
  try {
    const res = await db.execute({
      sql: "SELECT value FROM settings WHERE key = ?",
      args: [key],
    })
    if (res.rows.length > 0 && res.rows[0].value !== undefined && res.rows[0].value !== null) {
      return String(res.rows[0].value)
    }
  } catch (error) {
    console.error(`Error reading setting '${key}':`, error)
  }
  return defaultValue
}

export async function setSetting(key: string, value: string): Promise<boolean> {
  await initDB()
  try {
    const now = Date.now()
    await db.execute({
      sql: `
        INSERT INTO settings (key, value, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          updated_at = excluded.updated_at
      `,
      args: [key, value, now],
    })
    return true
  } catch (error) {
    console.error(`Error saving setting '${key}':`, error)
    return false
  }
}

export async function getTicketPrice(): Promise<number> {
  const defaultPrice = String(raffle.ticketBasePrice || 20)
  const priceStr = await getSetting("ticket_price", defaultPrice)
  const parsed = Number(priceStr)
  return isNaN(parsed) || parsed <= 0 ? raffle.ticketBasePrice || 20 : parsed
}

export async function setTicketPrice(price: number): Promise<boolean> {
  if (price <= 0) return false
  return await setSetting("ticket_price", String(price))
}

export async function getDrawDate(): Promise<string> {
  return await getSetting("draw_date", raffle.drawDate)
}

export async function setDrawDate(dateStr: string): Promise<boolean> {
  if (!dateStr || isNaN(Date.parse(dateStr))) return false
  return await setSetting("draw_date", dateStr)
}

export async function getTicketCount(): Promise<number> {
  const defaultCount = String(raffle.totalNumbers || 200)
  const countStr = await getSetting("total_tickets", defaultCount)
  const parsed = Number(countStr)
  return isNaN(parsed) || parsed <= 0 ? raffle.totalNumbers || 200 : parsed
}

export async function setTicketCount(newCount: number): Promise<{ success: boolean; error?: string }> {
  if (newCount <= 0 || newCount > 9999) {
    return { success: false, error: "La cantidad de números debe ser entre 1 y 9999." }
  }

  await initDB()
  const now = Date.now()

  // Consultar la cantidad actual en la tabla tickets
  const res = await db.execute("SELECT COUNT(*) as total FROM tickets")
  const currentTotal = Number(res.rows[0]?.total || 0)

  if (newCount > currentTotal) {
    // Generar los nuevos tickets faltantes
    const statements = []
    const padLen = newCount > 999 ? 4 : 3
    for (let i = currentTotal + 1; i <= newCount; i++) {
      const numStr = String(i).padStart(padLen, "0")
      statements.push({
        sql: "INSERT OR IGNORE INTO tickets (number, status, order_id, reserved_until, updated_at) VALUES (?, 'available', NULL, NULL, ?)",
        args: [numStr, now],
      })
    }
    if (statements.length > 0) {
      await db.batch(statements, "write")
    }
  } else if (newCount < currentTotal) {
    // Verificar si hay boletos ocupados o pagados superiores al nuevo límite
    const checkOccupied = await db.execute({
      sql: "SELECT number FROM tickets WHERE CAST(number AS INTEGER) > ? AND status != 'available'",
      args: [newCount],
    })

    if (checkOccupied.rows.length > 0) {
      const numbers = checkOccupied.rows.map((r) => String(r.number)).join(", ")
      return {
        success: false,
        error: `No se puede reducir el total a ${newCount} porque ya existen boletos vendidos o reservados superiores (Números: ${numbers}).`,
      }
    }

    // Eliminar tickets disponibles sobrantes
    await db.execute({
      sql: "DELETE FROM tickets WHERE CAST(number AS INTEGER) > ? AND status = 'available'",
      args: [newCount],
    })
  }

  await setSetting("total_tickets", String(newCount))
  return { success: true }
}
