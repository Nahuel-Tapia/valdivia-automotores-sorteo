import { createClient } from "@libsql/client"
import bcrypt from "bcryptjs"
import fs from "node:fs"
import path from "node:path"

// Asegurar que la carpeta data/ exista para SQLite
const dbDir = path.resolve(process.cwd(), "data")
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const url = process.env.TURSO_DATABASE_URL || `file:${path.join(dbDir, "sorteo.db")}`
const authToken = process.env.TURSO_AUTH_TOKEN

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
        payment_method TEXT NOT NULL,
        mp_preference_id TEXT,
        mp_payment_id TEXT,
        created_at INTEGER NOT NULL
      );
    `)

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

    try {
      await db.execute("ALTER TABLE tickets ADD COLUMN session_id TEXT;")
    } catch {
      // Ignorar si la columna ya existe
    }

    // 4. Seed de Administrador por defecto si no existe
    const adminCheck = await db.execute("SELECT COUNT(*) as count FROM admins")
    if (Number(adminCheck.rows[0].count) === 0) {
      const hash = await bcrypt.hash("admin123", 10)
      await db.execute({
        sql: "INSERT INTO admins (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
        args: ["admin-1", "admin@valdivia.com", hash, Date.now()],
      })
      console.log("✅ Admin por defecto creado: admin@valdivia.com / admin123")
    }

    // 5. Seed de 10.000 Tickets si la tabla está vacía
    const ticketCheck = await db.execute("SELECT COUNT(*) as count FROM tickets")
    if (Number(ticketCheck.rows[0].count) === 0) {
      console.log("⏳ Inicializando 10.000 números de sorteo en la base de datos...")
      const BATCH_SIZE = 500
      const now = Date.now()

      for (let i = 1; i <= 10000; i += BATCH_SIZE) {
        const statements = []
        for (let j = i; j < i + BATCH_SIZE && j <= 10000; j++) {
          const numStr = String(j).padStart(5, "0")
          statements.push({
            sql: "INSERT INTO tickets (number, status, order_id, reserved_until, updated_at) VALUES (?, 'available', NULL, NULL, ?)",
            args: [numStr, now],
          })
        }
        await db.batch(statements, "write")
      }
      console.log("✅ 10.000 números generados exitosamente.")
    }

    isInitialized = true
  } catch (error) {
    console.error("❌ Error inicializando la Base de Datos:", error)
  }
}
