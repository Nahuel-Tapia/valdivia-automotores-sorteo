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
  prizeName: "BYD Dolphin Mini GL",
  prizeYear: 2026,
  drawDate: "2026-12-20T21:00:00-03:00",
  drawChannel: "Canales Oficiales Valdivia Automotores",
  ticketBasePrice: 20,
  currency: "ARS",
  soldPercentage: 68,
  totalNumbers: 200,
  heroImage: "/portada.png",
  interiorImage: "/premio-interior.png",
  prizeSpecs: [
    { label: "Motor", value: "Eléctrico 87cv" },
    { label: "Autonomía", value: "Hasta 280km" },
    { label: "Carga Rápida", value: "30 min (30-80%)" },
    { label: "Versión", value: "GL 0 km" },
  ] as PrizeSpec[],
  secondPrize: {
    name: "BIKER MOTO",
    tagline: "Moto 100% Eléctrica",
    badge: "2º PREMIO",
    image: "/prizes/moto.jpg",
    riderImage: "/prizes/moto.jpg",
    specsImage: "/prizes/moto.jpg",
    specs: [
      { label: "Potencia", value: "499 W" },
      { label: "Batería", value: "48V 20Ah Plomo-Ácido" },
      { label: "Velocidad Máx", value: "29 km/h (3 vel.)" },
      { label: "Tablero", value: "Instrumento LCD Digital" },
      { label: "Conectividad", value: "Altavoz Bluetooth" },
      { label: "Controlador", value: "6 + Tubos" },
    ] as PrizeSpec[],
  },
  carColors: [
    { id: "green", name: "Verde Lima", hex: "#C8D626", image: "/cars/portada-clean.png", video: "/videos/360_verde.mp4" },
    { id: "white", name: "Blanco Perla", hex: "#F5F0E8", image: "/cars/dolphin-white.png", video: "/videos/360_blanco.mp4" },
    { id: "black", name: "Negro Azabache", hex: "#1A1A1A", image: "/cars/dolphin-black.png", video: "/videos/360_negro.mp4" },
    { id: "blue", name: "Celeste Cielo", hex: "#A3C4E0", image: "/cars/dolphin-blue.png", video: "/videos/360_celeste.mp4" },
  ] as CarColor[],
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: raffle.currency,
    maximumFractionDigits: 0,
  }).format(value)
}
