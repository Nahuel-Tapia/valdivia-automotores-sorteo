/* empty css                                 */
import { c as createComponent, r as renderComponent, m as maybeRenderHead, a as renderTemplate, b as createAstro, d as renderScript } from '../chunks/astro/server_DaRN7h1c.mjs';
import 'piccolore';
import { $ as $$, a as $$Layout, l as logoValdivia, c as $$Ticket } from '../chunks/Layout_LZPCddmC.mjs';
import { r as raffle } from '../chunks/raffle_BobqFDMx.mjs';
import { $ as $$Image } from '../chunks/_astro_assets_4TwwqjQN.mjs';
import { g as getMercadoPagoPaymentStatus, p as processMercadoPagoPaymentStatus } from '../chunks/mercadopago_D1ajzrxu.mjs';
import { a as approveOrderAndTickets } from '../chunks/tickets_B79piL2P.mjs';
import { $ as $$Home } from '../chunks/Home_CIVcHLpC.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$2 = createAstro();
const $$CheckCircle2 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$CheckCircle2;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "circle-check", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<circle cx="12" cy="12" r="10"></circle> <path d="m9 12 2 2 4-4"></path> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/CheckCircle2.astro", void 0);

const $$Astro$1 = createAstro();
const $$Mail = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Mail;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "mail", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<rect width="20" height="16" x="2" y="4" rx="2"></rect> <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/Mail.astro", void 0);

const $$Astro = createAstro();
const prerender = false;
const $$Confirmacion = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Confirmacion;
  const drawDate = new Date(raffle.drawDate).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  const paymentId = Astro2.url.searchParams.get("payment_id") || Astro2.url.searchParams.get("collection_id");
  const status = Astro2.url.searchParams.get("status") || Astro2.url.searchParams.get("collection_status");
  const orderId = Astro2.url.searchParams.get("external_reference") || Astro2.url.searchParams.get("orderId");
  if (paymentId && process.env.MERCADOPAGO_ACCESS_TOKEN) {
    try {
      const payment = await getMercadoPagoPaymentStatus(paymentId);
      await processMercadoPagoPaymentStatus(payment);
    } catch (error) {
      console.error("Error consultando API de Mercado Pago:", error);
    }
  } else if (orderId && status === "approved") {
    try {
      await approveOrderAndTickets(orderId, paymentId || void 0);
    } catch (error) {
      console.error("Error aprobando orden al retornar de MP:", error);
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Compra confirmada | Valdivia Automotores" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div id="no-order" class="container-app hidden py-20 text-center"> <p class="font-display text-xl font-700 text-navy">No encontramos una compra reciente.</p> <a href="/participar" class="btn-primary mt-6">Participar del sorteo</a> </div> <div id="order" class="container-app hidden py-14"> <div class="mx-auto max-w-2xl text-center"> <span class="mx-auto flex h-20 w-20 animate-pulse-ring items-center justify-center rounded-full bg-brand/10 text-brand"> ${renderComponent($$result2, "CheckCircle2", $$CheckCircle2, { "class": "h-11 w-11" })} </span> <span class="mt-6 block text-sm font-semibold uppercase tracking-[0.16em] text-brand">Paso 3 de 3</span> <h1 class="mt-2 font-display text-3xl font-800 text-navy sm:text-4xl">¡Compra confirmada!</h1> <p class="mt-3 text-navy/70">
Ya estás participando por el <strong>${raffle.prizeName} ${raffle.prizeYear}</strong>. El sorteo se realiza el ${drawDate}.
</p> </div> <div class="mx-auto mt-10 max-w-2xl space-y-6"> <!-- Ticket resumen --> <div class="card overflow-hidden"> <div class="flex items-center justify-between bg-navy px-6 py-4 text-white"> <div class="flex items-center gap-3"> ${renderComponent($$result2, "Image", $$Image, { "src": logoValdivia, "alt": "Valdivia Automotores", "width": 36, "height": 36, "class": "h-9 w-9 rounded-lg bg-white/95 object-contain p-1" })} <span class="font-display font-700">Comprobante de participación</span> </div> <span class="rounded-lg bg-brand px-3 py-1 text-xs font-800" id="order-id">#000000</span> </div> <div class="grid gap-4 p-6 sm:grid-cols-2"> <div> <p class="text-xs font-semibold uppercase tracking-wide text-navy/50">Comprador</p> <p class="mt-1 font-700 text-navy" id="buyer-name">-</p> </div> <div> <p class="text-xs font-semibold uppercase tracking-wide text-navy/50">Email</p> <p class="mt-1 font-700 text-navy" id="buyer-email">-</p> </div> <div> <p class="text-xs font-semibold uppercase tracking-wide text-navy/50">Cantidad</p> <p class="mt-1 font-700 text-navy" id="buyer-qty">-</p> </div> <div> <p class="text-xs font-semibold uppercase tracking-wide text-navy/50">Total abonado</p> <p class="mt-1 font-800 text-brand" id="buyer-total">-</p> </div> </div> </div> <!-- Números asignados --> <div class="card p-6"> <h2 class="flex items-center gap-2 font-display text-lg font-700 text-navy"> ${renderComponent($$result2, "Ticket", $$Ticket, { "class": "h-5 w-5 text-brand" })}
Tus números de la suerte
</h2> <div id="numbers" class="mt-4 flex flex-wrap gap-2"></div> </div> <div class="flex items-center justify-center gap-2 rounded-xl bg-brand/5 p-4 text-sm text-navy/70"> ${renderComponent($$result2, "Mail", $$Mail, { "class": "h-4 w-4 text-brand" })}
Te enviamos una copia del comprobante a tu email.
</div> <div class="flex justify-center"> <a href="/" class="btn-secondary"> ${renderComponent($$result2, "Home", $$Home, { "class": "h-5 w-5" })}
Volver al inicio
</a> </div> </div> </div> ` })} ${renderScript($$result, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/confirmacion.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/confirmacion.astro", void 0);

const $$file = "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/confirmacion.astro";
const $$url = "/confirmacion";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Confirmacion,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
