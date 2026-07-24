export interface TicketPackage {
  id: string
  tickets: number
  price: number
  popular?: boolean
  bonus?: string
}

export interface PrizeSpec {
  label: string
  value: string
}

export const raffle = {
  brand: "Valdivia Automotores",
  title: "Gran Sorteo Sedán 0km",
  prizeName: "Sedán 0km Full",
  prizeYear: 2025,
  // Fecha del sorteo (usada para el countdown)
  drawDate: "2025-12-20T21:00:00-03:00",
  drawChannel: "Lotería Nacional",
  ticketBasePrice: 1500,
  currency: "ARS",
  soldPercentage: 68,
  totalNumbers: 10000,
  heroImage: "/premio-sedan.png",
  interiorImage: "/premio-interior.png",
  prizeSpecs: [
    { label: "Motor", value: "1.6 16v 115cv" },
    { label: "Transmisión", value: "Automática CVT" },
    { label: "Equipamiento", value: "Full - Pack Tech" },
    { label: "Patentamiento", value: "Incluido" },
  ] as PrizeSpec[],
  packages: [
    { id: "pack-5", tickets: 5, price: 6750, bonus: "10% OFF" },
    { id: "pack-10", tickets: 10, price: 12000, popular: true, bonus: "20% OFF" },
    { id: "pack-25", tickets: 25, price: 26250, bonus: "30% OFF" },
    { id: "pack-50", tickets: 50, price: 45000, bonus: "40% OFF" },
  ] as TicketPackage[],
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: raffle.currency,
    maximumFractionDigits: 0,
  }).format(value)
}
