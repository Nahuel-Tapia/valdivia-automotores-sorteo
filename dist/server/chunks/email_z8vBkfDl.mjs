import { Resend } from 'resend';
import { r as raffle } from './raffle_DbkFDE3I.mjs';

const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;
function buildTicketEmailHTML(details) {
  const formattedDate = new Date(raffle.drawDate).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  const ticketsBadges = details.tickets.map(
    (num) => `<span style="display:inline-block; background-color:#f1f5f9; color:#1f2a52; border:1px solid #cbd5e1; font-weight:800; font-family:sans-serif; padding:6px 12px; margin:4px; border-radius:6px; font-size:14px; letter-spacing:1px;">${num}</span>`
  ).join(" ");
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>Comprobante de Participación - Valdivia Automotores</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color: #1f2a52; color: #ffffff; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 800;">Valdivia Automotores</h1>
          <p style="margin: 4px 0 0 0; color: #e2e8f0; font-size: 14px;">Comprobante Oficial de Participación</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          <h2 style="color: #1f2a52; font-size: 20px; margin-top: 0;">¡Hola, ${details.buyerName}! 👋</h2>
          <p style="font-size: 15px; line-height: 1.5; color: #475569;">
            Tu pago ha sido procesado exitosamente. Ya estás participando oficialmente del <strong>${raffle.title}</strong> por el <strong>${raffle.prizeName} 0km</strong>.
          </p>

          <!-- Resumen de Orden -->
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Nº de Orden:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #1f2a52;">#${details.orderId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Cantidad de boletos:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #1f2a52;">${details.tickets.length}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Total abonado:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 800; color: #2563eb;">$${details.totalAmount.toLocaleString("es-AR")} ARS</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Fecha del Sorteo:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #1f2a52;">${formattedDate}</td>
              </tr>
            </table>
          </div>

          <!-- Números Asignados -->
          <div style="text-align: center; margin: 32px 0;">
            <h3 style="color: #1f2a52; font-size: 16px; margin-bottom: 12px;">Tus Números de la Suerte:</h3>
            <div style="text-align: center;">
              ${ticketsBadges}
            </div>
          </div>

          <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 32px; border-t: 1px solid #f1f5f9; padding-top: 16px;">
            Guardá este correo como tu comprobante oficial. ¡Muchos éxitos en el sorteo!
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}
async function sendOrderConfirmationEmail(details) {
  const html = buildTicketEmailHTML(details);
  if (resend) {
    try {
      await resend.emails.send({
        from: "Valdivia Automotores <sorteos@valdiviaautomotores.com>",
        to: details.buyerEmail,
        subject: `¡Tus números para el ${raffle.title}! (Orden #${details.orderId})`,
        html
      });
      console.log(`📧 Correo de confirmación enviado exitosamente a ${details.buyerEmail}`);
      return true;
    } catch (error) {
      console.error("❌ Error enviando email con Resend:", error);
      return false;
    }
  } else {
    console.log(`✉️ [DEMO MODE] Correo generado para ${details.buyerEmail} con ${details.tickets.length} números:`, details.tickets);
    return true;
  }
}

export { sendOrderConfirmationEmail as s };
