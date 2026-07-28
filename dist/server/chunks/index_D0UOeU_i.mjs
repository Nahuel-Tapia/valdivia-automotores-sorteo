import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": undefined, "SSR": true};
function getEnv(key) {
  try {
    const metaVal = Object.assign(__vite_import_meta_env__, { TURSO_DATABASE_URL: "", TURSO_AUTH_TOKEN: "" })?.[key];
    if (metaVal) return String(metaVal);
  } catch {
  }
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key];
  }
  return void 0;
}
const dbDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const tursoUrl = getEnv("TURSO_DATABASE_URL");
const authToken = getEnv("TURSO_AUTH_TOKEN");
const url = tursoUrl || `file:${path.join(dbDir, "sorteo.db")}`;
const db = createClient({
  url,
  authToken
});
let isInitialized = false;
async function initDB() {
  if (isInitialized) return;
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);
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
    `);
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
    `);
    const adminCheck = await db.execute("SELECT COUNT(*) as count FROM admins");
    if (Number(adminCheck.rows[0].count) === 0) {
      const hash = await bcrypt.hash("admin123", 10);
      await db.execute({
        sql: "INSERT INTO admins (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
        args: ["admin-1", "admin@valdivia.com", hash, Date.now()]
      });
      console.log("✅ Admin por defecto creado: admin@valdivia.com / admin123");
    }
    const ticketCheck = await db.execute("SELECT COUNT(*) as count FROM tickets");
    if (Number(ticketCheck.rows[0].count) === 0) {
      console.log("⏳ Inicializando 200 números de sorteo en la base de datos...");
      const now = Date.now();
      const statements = [];
      for (let j = 1; j <= 200; j++) {
        const numStr = String(j).padStart(3, "0");
        statements.push({
          sql: "INSERT INTO tickets (number, status, order_id, reserved_until, updated_at) VALUES (?, 'available', NULL, NULL, ?)",
          args: [numStr, now]
        });
      }
      await db.batch(statements, "write");
      console.log("✅ 200 números generados exitosamente.");
    }
    isInitialized = true;
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  }
}

export { db as d, initDB as i };
