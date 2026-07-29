import { Resend } from "resend"
import { raffle } from "@/data/raffle"

function getResendConfig(): { resend: Resend | null; from: string } {
  let key = ""
  try {
    const metaKey = (import.meta as any).env?.RESEND_API_KEY
    if (metaKey) key = String(metaKey)
  } catch { /* ignorar */ }

  if (!key && typeof process !== "undefined" && process.env?.RESEND_API_KEY) {
    key = process.env.RESEND_API_KEY
  }

  let from = "Valdivia Automotores <onboarding@resend.dev>"
  try {
    const metaFrom = (import.meta as any).env?.RESEND_FROM_EMAIL || (import.meta as any).env?.MAIL_FROM
    if (metaFrom) from = String(metaFrom)
  } catch { /* ignorar */ }

  if (typeof process !== "undefined" && (process.env?.RESEND_FROM_EMAIL || process.env?.MAIL_FROM)) {
    from = process.env.RESEND_FROM_EMAIL || process.env.MAIL_FROM || from
  }

  const resend = key ? new Resend(key) : null
  return { resend, from }
}

export interface EmailOrderDetails {
  orderId: string
  buyerName: string
  buyerEmail: string
  tickets: string[]
  totalAmount: number
}

interface SendEmailInput {
  to: string
  subject: string
  html: string
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function formatDrawDate(): string {
  return new Date(raffle.drawDate).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function formatAmount(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: raffle.currency,
    maximumFractionDigits: 0,
  }).format(value)
}

async function sendEmail({ to, subject, html }: SendEmailInput): Promise<boolean> {
  const { resend, from } = getResendConfig()

  if (!resend) {
    console.log(`[MAIL DEMO] ${subject} -> ${to}`)
    return true
  }

  try {
    const res = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (res.error) {
      console.error("[MAIL ERROR] Error devuelto por Resend API:", res.error)
      return false
    }

    console.log(`[MAIL SUCCESS] Enviado exitosamente a ${to} (ID: ${res.data?.id})`)
    return true
  } catch (error) {
    console.error("[MAIL EXCEPTION] Excepción enviando correo:", error)
    return false
  }
}

function buildOrderSummary(details: EmailOrderDetails): string {
  const ticketsBadges = details.tickets
    .map(
      (number) =>
        `<span style="display:inline-block;background-color:#f1f5f9;color:#1f2a52;border:1px solid #cbd5e1;font-weight:800;font-family:Arial,sans-serif;padding:6px 12px;margin:4px;border-radius:6px;font-size:14px;letter-spacing:1px;">${escapeHtml(number)}</span>`
    )
    .join(" ")

  return `
    <div style="background-color:#f8fafc;border-radius:12px;padding:20px;margin:24px 0;border:1px solid #e2e8f0;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:6px 0;color:#64748b;">Nro. de orden:</td>
          <td style="padding:6px 0;text-align:right;font-weight:700;color:#1f2a52;">#${escapeHtml(details.orderId)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#64748b;">Cantidad de boletos:</td>
          <td style="padding:6px 0;text-align:right;font-weight:700;color:#1f2a52;">${details.tickets.length}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#64748b;">Total abonado:</td>
          <td style="padding:6px 0;text-align:right;font-weight:800;color:#2563eb;">${formatAmount(details.totalAmount)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#64748b;">Fecha del sorteo:</td>
          <td style="padding:6px 0;text-align:right;font-weight:700;color:#1f2a52;">${formatDrawDate()}</td>
        </tr>
      </table>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <h3 style="color:#1f2a52;font-size:16px;margin-bottom:12px;">Números asignados de la suerte</h3>
      <div>${ticketsBadges}</div>
    </div>
  `
}

function buildBaseEmail(title: string, body: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${escapeHtml(title)}</title>
    </head>
    <body style="font-family:Arial,sans-serif;background-color:#f8fafc;margin:0;padding:20px;color:#1e293b;">
      <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color:#1f2a52;color:#ffffff;padding:24px;text-align:center;">
          <h1 style="margin:0;font-size:22px;font-weight:800;">Valdivia Automotores</h1>
          <p style="margin:4px 0 0;color:#e2e8f0;font-size:14px;">${escapeHtml(title)}</p>
        </div>
        <div style="padding:32px;">
          ${body}
        </div>
      </div>
    </body>
    </html>
  `
}

function buildTicketEmailHTML(details: EmailOrderDetails): string {
  return buildBaseEmail(
    "Comprobante oficial de participación",
    `
      <h2 style="color:#1f2a52;font-size:20px;margin-top:0;">¡Hola, ${escapeHtml(details.buyerName)}!</h2>
      <p style="font-size:15px;line-height:1.5;color:#475569;">
        Tu pago fue procesado exitosamente. Ya estás participando oficialmente del
        <strong>${escapeHtml(raffle.title)}</strong> por el <strong>${escapeHtml(raffle.prizeName)} ${raffle.prizeYear}</strong>.
      </p>
      ${buildOrderSummary(details)}
      <p style="font-size:13px;color:#94a3b8;text-align:center;margin-top:32px;border-top:1px solid #f1f5f9;padding-top:16px;">
        Guardá este correo electrónico como comprobante oficial de participación.
      </p>
    `
  )
}

function buildPaymentRejectedEmailHTML(details: EmailOrderDetails): string {
  return buildBaseEmail(
    "Pago rechazado",
    `
      <h2 style="color:#1f2a52;font-size:20px;margin-top:0;">Hola, ${escapeHtml(details.buyerName)}</h2>
      <p style="font-size:15px;line-height:1.5;color:#475569;">
        No pudimos confirmar el pago de la orden <strong>#${escapeHtml(details.orderId)}</strong>.
        Los boletos reservados volvieron a estar disponibles para otros participantes.
      </p>
      ${buildOrderSummary(details)}
      <p style="font-size:13px;color:#94a3b8;text-align:center;margin-top:32px;border-top:1px solid #f1f5f9;padding-top:16px;">
        Si querés participar, podés volver a elegir boletos e intentar el pago nuevamente.
      </p>
    `
  )
}

export async function sendOrderConfirmationEmail(details: EmailOrderDetails): Promise<boolean> {
  return sendEmail({
    to: details.buyerEmail,
    subject: `Tus números para ${raffle.title} - Orden #${details.orderId}`,
    html: buildTicketEmailHTML(details),
  })
}

export async function sendPaymentRejectedEmail(details: EmailOrderDetails): Promise<boolean> {
  return sendEmail({
    to: details.buyerEmail,
    subject: `Pago rechazado - Orden #${details.orderId}`,
    html: buildPaymentRejectedEmailHTML(details),
  })
}
