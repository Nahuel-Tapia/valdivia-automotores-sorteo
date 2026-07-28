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
  ticketBasePrice: 200000,
  currency: "ARS",
  soldPercentage: 68,
  totalNumbers: 200,
  heroImage: "/premio-sedan.png",
  interiorImage: "/premio-interior.png",
  prizeSpecs: [
    { label: "Motor", value: "1.6 16v 115cv" },
    { label: "Transmisión", value: "Automática CVT" },
    { label: "Equipamiento", value: "Full - Pack Tech" },
    { label: "Patentamiento", value: "Incluido" },
  ] as PrizeSpec[],
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: raffle.currency,
    maximumFractionDigits: 0,
  }).format(value)
}
