export interface CartState {
  tickets: number
  amount: number
  packageId: string | null
}

const KEY = "valdivia_cart"

export function readCart(): CartState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as CartState
  } catch {
    return null
  }
}

export function writeCart(state: CartState): void {
  if (typeof window === "undefined") return
  window.sessionStorage.setItem(KEY, JSON.stringify(state))
}

export function clearCart(): void {
  if (typeof window === "undefined") return
  window.sessionStorage.removeItem(KEY)
}

export function formatARS(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value)
}

/** Genera números de ticket pseudo-aleatorios para la demo */
export function generateTicketNumbers(count: number, max = 100000): string[] {
  const set = new Set<string>()
  while (set.size < count) {
    const n = Math.floor(Math.random() * max)
    set.add(String(n).padStart(5, "0"))
  }
  return Array.from(set)
}
