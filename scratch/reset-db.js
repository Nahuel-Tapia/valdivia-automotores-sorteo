import { createClient } from "@libsql/client"
import path from "node:path"

const dbDir = path.resolve(process.cwd(), "data")
const url = `file:${path.join(dbDir, "sorteo.db")}`

const db = createClient({ url })

async function resetDB() {
  console.log("⏳ Re-generando base de datos a 200 boletos ($200.000 ARS)...")
  
  const now = Date.now()

  // 1. Eliminar boletos anteriores y órdenes
  await db.execute("DELETE FROM tickets;")
  await db.execute("DELETE FROM orders;")

  // 2. Insertar exactamente 200 boletos (001 a 200)
  const statements = []
  for (let j = 1; j <= 200; j++) {
    const numStr = String(j).padStart(3, "0")
    statements.push({
      sql: "INSERT INTO tickets (number, status, order_id, reserved_until, updated_at) VALUES (?, 'available', NULL, NULL, ?)",
      args: [numStr, now],
    })
  }

  await db.batch(statements, "write")

  console.log("✅ Base de datos re-configurada con éxito: 200 boletos disponibles (del #001 al #200).")
  process.exit(0)
}

resetDB().catch((err) => {
  console.error("❌ Error reseteando la DB:", err)
  process.exit(1)
})
