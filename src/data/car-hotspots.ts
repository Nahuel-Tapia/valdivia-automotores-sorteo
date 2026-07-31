export interface HotspotSpec {
  label: string
  value: string
}

export interface Hotspot {
  id: string
  label: string
  icon: string
  posX: string
  posY: string
  description: string
  specs: HotspotSpec[]
}

export const carHotspots: Hotspot[] = [
  {
    id: "faros",
    label: "Faros LED",
    icon: "💡",
    posX: "22%",
    posY: "52%",
    description: "Iluminación Full LED con firma lumínica exclusiva y función Follow me home.",
    specs: [
      { label: "Tipo", value: "Full LED" },
      { label: "DRL", value: "LED integrado" },
      { label: "Traseras", value: "Barra LED Ice Crystal" },
      { label: "Follow me home", value: "Sí" },
    ],
  },
  {
    id: "motor",
    label: "Motor Eléctrico",
    icon: "⚡",
    posX: "32%",
    posY: "55%",
    description: "Motor síncrono de imán permanente con plataforma e-Platform 3.0 de BYD.",
    specs: [
      { label: "Potencia", value: "65 kW (87 cv)" },
      { label: "Torque", value: "175 Nm" },
      { label: "Tracción", value: "Delantera (FWD)" },
      { label: "Vel. Máxima", value: "150 km/h" },
    ],
  },
  {
    id: "interior",
    label: "Interior & Tech",
    icon: "📱",
    posX: "52%",
    posY: "38%",
    description: "Cockpit digital con pantalla rotativa de 10.1 pulgadas y conectividad total.",
    specs: [
      { label: "Pantalla", value: "10.1\" táctil rotativa" },
      { label: "Conectividad", value: "Apple CarPlay & Android Auto" },
      { label: "Cluster", value: "Digital 7\"" },
      { label: "Asistente", value: "\"Hi, BYD\" por voz" },
    ],
  },
  {
    id: "bateria",
    label: "Batería Blade",
    icon: "🔋",
    posX: "55%",
    posY: "75%",
    description: "Tecnología exclusiva BYD Blade Battery (LFP) con máxima seguridad y durabilidad.",
    specs: [
      { label: "Capacidad", value: "38.08 / 43.2 kWh" },
      { label: "Autonomía", value: "Hasta 280 km (NEDC)" },
      { label: "Carga DC", value: "Hasta 85 kW" },
      { label: "30→80%", value: "~30 minutos" },
    ],
  },
  {
    id: "seguridad",
    label: "Seguridad",
    icon: "🛡️",
    posX: "78%",
    posY: "52%",
    description: "Estructura de alta rigidez con 6 airbags y sistemas ADAS de asistencia al conductor.",
    specs: [
      { label: "Airbags", value: "6 (front + lat + cortina)" },
      { label: "Estabilidad", value: "ABS + EBD + ESC + TCS" },
      { label: "ADAS", value: "AEB + ACC + LCC" },
      { label: "Cámara", value: "Trasera HD con guías" },
    ],
  },
]
