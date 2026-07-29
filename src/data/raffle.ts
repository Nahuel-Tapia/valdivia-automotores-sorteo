export interface PrizeSpec {
  label: string
  value: string
}

export interface CarColor {
  id: string
  name: string
  hex: string
  image: string
  video?: string | null
}

export const raffle = {
  brand: "Valdivia Automotores",
  title: "Gran Sorteo BYD Dolphin Mini 0km",
  prizeName: "BYD Dolphin Mini",
  prizeYear: 2025,
  drawDate: "2025-12-20T21:00:00-03:00",
  drawChannel: "Lotería Nacional",
  ticketBasePrice: 30,
  currency: "ARS",
  soldPercentage: 68,
  totalNumbers: 200,
  heroImage: "/cars/dolphin-green.png",
  interiorImage: "/premio-interior.png",
  prizeSpecs: [
    { label: "Motor", value: "Eléctrico 87cv" },
    { label: "Autonomía", value: "Hasta 380km" },
    { label: "Carga Rápida", value: "30 min (30-80%)" },
    { label: "Patentamiento", value: "Incluido" },
  ] as PrizeSpec[],
  carColors: [
    { id: "green", name: "Verde Lima", hex: "#C8D626", image: "/cars/dolphin-green.png", video: "/videos/360_verde.mp4" },
    { id: "white", name: "Blanco Perla", hex: "#F5F0E8", image: "/cars/dolphin-white.png", video: "/videos/360_perla.mp4" },
    { id: "black", name: "Negro Azabache", hex: "#1A1A1A", image: "/cars/dolphin-black.png", video: null },
    { id: "blue", name: "Celeste Cielo", hex: "#A3C4E0", image: "/cars/dolphin-blue.png", video: null },
  ] as CarColor[],
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: raffle.currency,
    maximumFractionDigits: 0,
  }).format(value)
}
