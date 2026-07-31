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
