import { Payment, MercadoPagoConfig, Preference } from 'mercadopago';
import { r as raffle } from './raffle_BobqFDMx.mjs';
import { a as approveOrderAndTickets } from './tickets_B79piL2P.mjs';

function getAccessToken() {
  try {
    const metaToken = "TEST-6060477727289545-072807-b3a8365e7e5d63313718d69c01d72404-270941125";
    if (metaToken) return String(metaToken);
  } catch {
  }
  if (typeof process !== "undefined" && process.env?.MERCADOPAGO_ACCESS_TOKEN) {
    return process.env.MERCADOPAGO_ACCESS_TOKEN;
  }
  return "";
}
function getMPClient() {
  const token = getAccessToken();
  console.log(`🔑 Mercado Pago Token: ${token ? `${token.substring(0, 10)}... (${token.length} chars)` : "❌ NO ENCONTRADO"}`);
  const client = token ? new MercadoPagoConfig({ accessToken: token }) : null;
  return { client, token };
}
async function createMPPreference(params) {
  const {
    orderId,
    ticketCount,
    unitPrice,
    buyerName,
    buyerEmail,
    buyerDni,
    buyerPhone,
    baseUrl
  } = params;
  const { client, token } = getMPClient();
  if (!client || !token) {
    console.log("ℹ️ MERCADOPAGO_ACCESS_TOKEN no configurado. Utilizando flujo de simulación demo.");
    return {
      initPoint: `${baseUrl}/api/simulate-payment?orderId=${orderId}`,
      isDemo: true
    };
  }
  try {
    console.log(`🛒 Creando preferencia para orden ${orderId}: ${ticketCount} boletos x $${unitPrice}`);
    const preference = new Preference(client);
    const isLocalhost = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");
    const preferenceBody = {
      external_reference: orderId,
      items: [
        {
          id: `boletos-${orderId}`,
          title: `${ticketCount} Boleto${ticketCount > 1 ? "s" : ""} - ${raffle.title}`,
          description: `Boletos para el sorteo del ${raffle.prizeName}`,
          quantity: ticketCount,
          unit_price: unitPrice,
          currency_id: "ARS"
        }
      ],
      payer: {
        name: buyerName,
        email: buyerEmail,
        phone: {
          number: buyerPhone
        },
        identification: {
          type: "DNI",
          number: buyerDni
        }
      }
    };
    if (!isLocalhost) {
      preferenceBody.back_urls = {
        success: `${baseUrl}/confirmacion?orderId=${orderId}`,
        failure: `${baseUrl}/pago-rechazado?orderId=${orderId}`,
        pending: `${baseUrl}/confirmacion?orderId=${orderId}`
      };
      preferenceBody.auto_return = "approved";
      preferenceBody.notification_url = `${baseUrl}/api/webhooks/mercadopago`;
    }
    console.log("📤 Enviando preferencia a la API de Mercado Pago...");
    const response = await preference.create({ body: preferenceBody });
    console.log(`📥 Respuesta de Mercado Pago:`);
    console.log(`   - id: ${response.id}`);
    console.log(`   - init_point: ${response.init_point}`);
    console.log(`   - sandbox_init_point: ${response.sandbox_init_point}`);
    const isTestToken = token.startsWith("TEST-");
    const initPoint = isTestToken ? response.sandbox_init_point || response.init_point : response.init_point || response.sandbox_init_point;
    if (!initPoint) {
      console.error("❌ Mercado Pago no devolvió ninguna URL de pago.");
      return {
        initPoint: `${baseUrl}/api/simulate-payment?orderId=${orderId}`,
        isDemo: true
      };
    }
    console.log(`✅ Preferencia creada (${isTestToken ? "Sandbox" : "Producción"}): ${initPoint}`);
    return {
      initPoint,
      preferenceId: response.id,
      isDemo: false
    };
  } catch (error) {
    console.error("❌ ERROR creando preferencia en Mercado Pago:");
    console.error("   Mensaje:", error?.message || error);
    if (error?.cause) console.error("   Causa:", JSON.stringify(error.cause, null, 2));
    if (error?.status) console.error("   HTTP Status:", error.status);
    return {
      initPoint: `${baseUrl}/api/simulate-payment?orderId=${orderId}`,
      isDemo: true
    };
  }
}
async function getMercadoPagoPaymentStatus(paymentId) {
  const { client } = getMPClient();
  if (!client) {
    return { id: paymentId };
  }
  try {
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });
    return {
      id: String(paymentData.id),
      orderId: paymentData.external_reference ? String(paymentData.external_reference) : void 0,
      status: paymentData.status ? String(paymentData.status) : void 0
    };
  } catch (error) {
    console.error(`Error consultando pago #${paymentId} en Mercado Pago:`, error);
    return { id: paymentId };
  }
}
async function processMercadoPagoPaymentStatus(payment) {
  if (!payment.orderId) {
    console.log("ℹ️ Webhook recibido sin external_reference (orderId).");
    return false;
  }
  if (payment.status === "approved") {
    console.log(`✅ Pago aprobado recibido para la Orden #${payment.orderId}`);
    return await approveOrderAndTickets(payment.orderId, payment.id);
  }
  console.log(`ℹ️ Estado de pago para la Orden #${payment.orderId}: ${payment.status || "desconocido"}`);
  return false;
}

export { createMPPreference as c, getMercadoPagoPaymentStatus as g, processMercadoPagoPaymentStatus as p };
