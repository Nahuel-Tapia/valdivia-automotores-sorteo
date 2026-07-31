import { createClient } from "@libsql/client"
import bcrypt from "bcryptjs"
import fs from "node:fs"
import path from "node:path"

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

  // 1. Limpiar tablas
  console.log("🧹 Eliminando todas las órdenes y tickets existentes...")
  await db.execute("DELETE FROM tickets;")
  await db.execute("DELETE FROM orders;")

  // 2. Volver a crear estructura si no existe
  await db.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      buyer_name TEXT NOT NULL,
      buyer_email TEXT NOT NULL,
      buyer_dni TEXT NOT NULL,
      buyer_phone TEXT NOT NULL,
      ticket_count INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      mp_payment_id TEXT
    );
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS tickets (
      number TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      order_id TEXT,
      session_id TEXT,
      reserved_until INTEGER,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );
  `)

  // 3. Crear Admin por defecto si no existe
  const adminCheck = await db.execute("SELECT COUNT(*) as count FROM admins")
  if (Number(adminCheck.rows[0].count) === 0) {
    const hash = await bcrypt.hash("admin123", 10)
    await db.execute({
      sql: "INSERT INTO admins (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
      args: ["admin-1", "admin@valdivia.com", hash, Date.now()],
    })
    console.log("👤 Admin creado: admin@valdivia.com / admin123")
  }

  // 4. Insertar los 200 tickets libres (001 a 200)
  console.log("🎟️ Re-insertando 200 boletos (001 a 200) con estado 'available'...")
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

  console.log("✨ ¡Base de datos reseteada con éxito! 200 boletos disponibles (001 a 200) y 0 órdenes.")
}

resetDatabase().catch((err) => {
  console.error("❌ Error reseteando la DB:", err)
  process.exit(1)
})
