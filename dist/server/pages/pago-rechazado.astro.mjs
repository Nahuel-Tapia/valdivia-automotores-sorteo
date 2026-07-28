/* empty css                                 */
import { c as createComponent, r as renderComponent, m as maybeRenderHead, a as renderTemplate, b as createAstro, d as renderScript } from '../chunks/astro/server_DaRN7h1c.mjs';
import 'piccolore';
import { $ as $$, a as $$Layout } from '../chunks/Layout_LZPCddmC.mjs';
import { g as getMercadoPagoPaymentStatus } from '../chunks/mercadopago_D1ajzrxu.mjs';
import { p as processMercadoPagoPaymentStatus } from '../chunks/payment-processing_B9M3uCJD.mjs';
import { $ as $$Home } from '../chunks/Home_CIVcHLpC.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$2 = createAstro();
const $$RefreshCw = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$RefreshCw;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "refresh-cw", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path> <path d="M21 3v5h-5"></path> <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path> <path d="M8 16H3v5"></path> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/RefreshCw.astro", void 0);

const $$Astro$1 = createAstro();
const $$XCircle = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$XCircle;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "circle-x", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<circle cx="12" cy="12" r="10"></circle> <path d="m15 9-6 6"></path> <path d="m9 9 6 6"></path> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/XCircle.astro", void 0);

const $$Astro = createAstro();
const prerender = false;
const $$PagoRechazado = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PagoRechazado;
  const paymentId = Astro2.url.searchParams.get("payment_id");
  let processed = false;
  if (paymentId && process.env.MERCADOPAGO_ACCESS_TOKEN) {
    try {
      const payment = await getMercadoPagoPaymentStatus(paymentId);
      processed = await processMercadoPagoPaymentStatus(payment) === "rejected";
    } catch (error) {
      console.error("Error sincronizando retorno rechazado de Mercado Pago:", error);
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Pago rechazado | Valdivia Automotores" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container-app py-16"> <div class="mx-auto max-w-2xl text-center"> <span class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600"> ${renderComponent($$result2, "XCircle", $$XCircle, { "class": "h-11 w-11" })} </span> <span class="mt-6 block text-sm font-semibold uppercase tracking-[0.16em] text-red-600">Pago rechazado</span> <h1 class="mt-2 font-display text-3xl font-800 text-navy sm:text-4xl">No se pudo completar el pago</h1> <p class="mt-3 text-navy/70">
La operacion no fue aprobada. Si Mercado Pago confirmo el rechazo, tus boletos ya volvieron a estar disponibles.
</p> ${processed && renderTemplate`<p class="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-700 text-emerald-700">
Reserva liberada correctamente.
</p>`} <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row"> <a href="/participar" class="btn-primary"> ${renderComponent($$result2, "RefreshCw", $$RefreshCw, { "class": "h-5 w-5" })}
Elegir otros boletos
</a> <a href="/" class="btn-secondary"> ${renderComponent($$result2, "Home", $$Home, { "class": "h-5 w-5" })}
Volver al inicio
</a> </div> </div> </section> ` })} ${renderScript($$result, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/pago-rechazado.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/pago-rechazado.astro", void 0);

const $$file = "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/pago-rechazado.astro";
const $$url = "/pago-rechazado";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$PagoRechazado,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
