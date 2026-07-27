export type TicketStatus = "available" | "reserved" | "sold"

export interface TicketItem {
  number: string
  status: TicketStatus
  reservedUntil?: number
}

// Simulación de generador de números y reservas
const TOTAL_TICKETS = 1000

// Genera una lista de demostración con algunos números reservados/vendidos
export function getMockTickets(search = "", filter: "all" | "available" = "all"): TicketItem[] {
  const list: TicketItem[] = []
  
  // Números fijos como "vendidos" o "reservados" para simulación realista
  const soldSet = new Set(["00012", "00045", "00120", "00350", "00500", "00789"])
  const reservedSet = new Set(["00088", "00234", "00611"])

  for (let i = 1; i <= TOTAL_TICKETS; i++) {
    const numStr = String(i).padStart(5, "0")

    if (search && !numStr.includes(search)) continue

    let status: TicketStatus = "available"
    if (soldSet.has(numStr)) status = "sold"
    else if (reservedSet.has(numStr)) status = "reserved"

    if (filter === "available" && status !== "available") continue

    list.push({ number: numStr, status })
  }

  return list
}

export function getRandomAvailableNumbers(count: number): string[] {
  const available = getMockTickets("", "available")
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((t) => t.number)
}
