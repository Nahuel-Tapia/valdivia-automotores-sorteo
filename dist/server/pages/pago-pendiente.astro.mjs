/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, b as createAstro, m as maybeRenderHead } from '../chunks/astro/server_DaRN7h1c.mjs';
import 'piccolore';
import { a as $$Layout, c as $$Ticket } from '../chunks/Layout_LZPCddmC.mjs';
import { g as getMercadoPagoPaymentStatus } from '../chunks/mercadopago_D1ajzrxu.mjs';
import { p as processMercadoPagoPaymentStatus } from '../chunks/payment-processing_B9M3uCJD.mjs';
import { $ as $$Clock } from '../chunks/Clock_CqhvcQdD.mjs';
import { $ as $$Home } from '../chunks/Home_CIVcHLpC.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$PagoPendiente = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PagoPendiente;
  const paymentId = Astro2.url.searchParams.get("payment_id");
  let processed = "ignored";
  if (paymentId && process.env.MERCADOPAGO_ACCESS_TOKEN) {
    try {
      const payment = await getMercadoPagoPaymentStatus(paymentId);
      processed = await processMercadoPagoPaymentStatus(payment);
    } catch (error) {
      console.error("Error sincronizando retorno pendiente de Mercado Pago:", error);
    }
  }
  if (processed === "approved") {
    return Astro2.redirect("/confirmacion");
  }
  if (processed === "rejected") {
    return Astro2.redirect("/pago-rechazado");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Pago pendiente | Valdivia Automotores" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container-app py-16"> <div class="mx-auto max-w-2xl text-center"> <span class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600"> ${renderComponent($$result2, "Clock", $$Clock, { "class": "h-11 w-11" })} </span> <span class="mt-6 block text-sm font-semibold uppercase tracking-[0.16em] text-amber-600">Pago pendiente</span> <h1 class="mt-2 font-display text-3xl font-800 text-navy sm:text-4xl">Estamos esperando la confirmacion</h1> <p class="mt-3 text-navy/70">
Mercado Pago todavia no informo un resultado final. Te vamos a avisar por email cuando se confirme.
</p> <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row"> <a href="/participar" class="btn-primary"> ${renderComponent($$result2, "Ticket", $$Ticket, { "class": "h-5 w-5" })}
Ver boletos
</a> <a href="/" class="btn-secondary"> ${renderComponent($$result2, "Home", $$Home, { "class": "h-5 w-5" })}
Volver al inicio
</a> </div> </div> </section> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/pago-pendiente.astro", void 0);

const $$file = "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/pago-pendiente.astro";
const $$url = "/pago-pendiente";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PagoPendiente,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
