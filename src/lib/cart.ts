import { persistentAtom } from "@nanostores/persistent"

export interface BuyerInfo {
  name: string
  email: string
  method: string
  dni?: string
  phone?: string
}

export interface CartState {
  tickets: number
  amount: number
  packageId?: string | null
  selectedNumbers?: string[]
  buyer?: BuyerInfo
}

const initialCart: CartState = {
  tickets: 0,
  amount: 0,
  packageId: null,
  selectedNumbers: [],
}

export const cartStore = persistentAtom<CartState>("valdivia_cart", initialCart, {
  encode: JSON.stringify,
  decode: JSON.parse,
  listen: false,
})

export function readCart(): CartState | null {
  const current = cartStore.get()
  return current.tickets > 0 ? current : null
}

export function writeCart(state: CartState): void {
  cartStore.set(state)
}

export function clearCart(): void {
  cartStore.set(initialCart)
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
