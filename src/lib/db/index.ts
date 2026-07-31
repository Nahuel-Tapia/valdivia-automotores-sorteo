import { createClient } from "@libsql/client"
import bcrypt from "bcryptjs"
import fs from "node:fs"
import path from "node:path"

function getEnv(key: string): string | undefined {
  try {
    const metaVal = (import.meta as any).env?.[key]
    if (metaVal) return String(metaVal)
  } catch { /* ignorar */ }

  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key]
  }
  return undefined
}

const tursoUrl = getEnv("TURSO_DATABASE_URL")
const authToken = getEnv("TURSO_AUTH_TOKEN")

// Solo intentar crear carpeta data local en desarrollo (ignorar en Vercel read-only filesystem)
if (!tursoUrl) {
  try {
    const dbDir = path.resolve(process.cwd(), "data")
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }
  } catch {
    // Ignorar en entornos de producción con sistema de archivos de solo lectura
  }
}

const url = tursoUrl || `file:${path.resolve(process.cwd(), "data", "sorteo.db")}`

export const db = createClient({
  url,
  authToken,
})

let isInitialized = false

export async function initDB() {
  if (isInitialized) return
  try {
    // 1. Crear tabla de administradores
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `)

    // 2. Crear tabla de órdenes
    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        buyer_name TEXT NOT NULL,
        buyer_email TEXT NOT NULL,
        buyer_dni TEXT NOT NULL,
        buyer_phone TEXT NOT NULL,
        ticket_count INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT NOT NULL, -- 'pending', 'approved', 'rejected'
        payment_method TEXT NOT NULL, -- 'mercadopago', 'transferencia'
        created_at INTEGER NOT NULL
      );
    `)

    // Migración de columna mp_payment_id si no existe
    try {
      await db.execute("ALTER TABLE orders ADD COLUMN mp_payment_id TEXT;")
    } catch {
      // Ignorar si la columna ya existe
    }

    // 3. Crear tabla de tickets
    await db.execute(`
      CREATE TABLE IF NOT EXISTS tickets (
        number TEXT PRIMARY KEY,
        status TEXT NOT NULL, -- 'available', 'reserved', 'paid'
        order_id TEXT,
        session_id TEXT,
        reserved_until INTEGER,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      );
    `)

    // 4. Crear tabla de configuraciones
    await db.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `)

    // 4. Seed de Admin por defecto si no existe ninguno
    const adminCheck = await db.execute("SELECT COUNT(*) as count FROM admins")
    if (Number(adminCheck.rows[0].count) === 0) {
      const hash = await bcrypt.hash("admin123", 10)
      await db.execute({
        sql: "INSERT INTO admins (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
        args: ["admin-1", "admin@valdivia.com", hash, Date.now()],
      })
      console.log("✅ Admin por defecto creado: admin@valdivia.com / admin123")
    }

    // 5. Seed de 200 Tickets si la tabla está vacía
    const ticketCheck = await db.execute("SELECT COUNT(*) as count FROM tickets")
    if (Number(ticketCheck.rows[0].count) === 0) {
      console.log("⏳ Inicializando 200 números de sorteo en la base de datos...")
      const now = Date.now()
      const statements = []

      for (let j = 1; j <= 200; j++) {
        const numStr = String(j).padStart(3, "0")
        statements.push({
          sql: "INSERT INTO tickets (number, status, order_id, reserved_until, updated_at) VALUES (?, 'available', NULL, NULL, ?)",
          args: [numStr, now],
        })
      }
      await db.batch(statements, "write")
      console.log("✅ 200 números generados exitosamente.")
    }

    isInitialized = true
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
  }
}
