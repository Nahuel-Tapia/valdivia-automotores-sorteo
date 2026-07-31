import { createClient } from "@libsql/client"
import bcrypt from "bcryptjs"
import fs from "node:fs"
import path from "node:path"

const DEFAULT_ADMIN_EMAIL = "valdiviasorteo@admin.com"
const DEFAULT_ADMIN_PASSWORD = "lucasvaldivia"

async function syncDefaultAdmin(db) {
  const hash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10)
  const existingAdmin = await db.execute({
    sql: "SELECT id FROM admins WHERE id = ? OR email = ? LIMIT 1",
    args: ["admin-1", DEFAULT_ADMIN_EMAIL],
  })

  if (existingAdmin.rows.length > 0) {
    await db.execute({
      sql: "UPDATE admins SET id = ?, email = ?, password_hash = ?, created_at = ? WHERE id = ? OR email = ?",
      args: ["admin-1", DEFAULT_ADMIN_EMAIL, hash, Date.now(), "admin-1", DEFAULT_ADMIN_EMAIL],
    })
    return
  }

  await db.execute({
    sql: "INSERT INTO admins (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
    args: ["admin-1", DEFAULT_ADMIN_EMAIL, hash, Date.now()],
  })
}

async function resetDatabase() {
  console.log("🔄 Iniciando reseteo completo de la base de datos...")

  // Leer env si existe
  let tursoUrl = process.env.TURSO_DATABASE_URL
  let authToken = process.env.TURSO_AUTH_TOKEN

  if (fs.existsSync(".env")) {
    const envContent = fs.readFileSync(".env", "utf-8")
    for (const line of envContent.split("\n")) {
      const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/)
      if (match) {
        const key = match[1]
        const val = match[2].trim()
        if (key === "TURSO_DATABASE_URL" && val) tursoUrl = val
        if (key === "TURSO_AUTH_TOKEN" && val) authToken = val
      }
    }
  }

  const dbPath = path.resolve(process.cwd(), "data", "sorteo.db")
  const url = tursoUrl || `file:${dbPath}`

  console.log(`📍 Conectando a DB: ${url}`)
  const db = createClient({ url, authToken })

  // 1. Limpiar órdenes y restaurar tickets a available
  console.log("🧹 Reseteando órdenes y liberando los 200 boletos...")
  await db.execute("UPDATE tickets SET status = 'available', order_id = NULL, session_id = NULL, reserved_until = NULL;")
  await db.execute("DELETE FROM orders;")

  // 3. Crear Admin por defecto si no existe
  await syncDefaultAdmin(db)
  console.log(`👤 Admin sincronizado: ${DEFAULT_ADMIN_EMAIL} / ${DEFAULT_ADMIN_PASSWORD}`)

  // 4. Verificar si faltan boletos para insertar (001 a 200)
  const ticketCheck = await db.execute("SELECT COUNT(*) as count FROM tickets")
  if (Number(ticketCheck.rows[0].count) === 0) {
    console.log("🎟️ Insertando 200 boletos (001 a 200) con estado 'available'...")
    const now = Date.now()
    const statements = []

    for (let i = 1; i <= 200; i++) {
      const numStr = String(i).padStart(3, "0")
      statements.push({
        sql: "INSERT INTO tickets (number, status, order_id, session_id, reserved_until, updated_at) VALUES (?, 'available', NULL, NULL, NULL, ?)",
        args: [numStr, now],
      })
    }

    await db.batch(statements, "write")
  }

  console.log("✨ ¡Base de datos reseteada con éxito! 200 boletos disponibles (001 a 200) y 0 órdenes.")
}

resetDatabase().catch((err) => {
  console.error("❌ Error reseteando la DB:", err)
  process.exit(1)
})
