/* empty css                                 */
import { c as createComponent, r as renderComponent, m as maybeRenderHead, a as renderTemplate, b as createAstro, d as renderScript, e as addAttribute } from '../chunks/astro/server_DaRN7h1c.mjs';
import 'piccolore';
import { $ as $$, a as $$Layout } from '../chunks/Layout_BQx7d89A.mjs';
import { f as formatCurrency, r as raffle } from '../chunks/raffle_DbkFDE3I.mjs';
import { b as getDBTickets } from '../chunks/tickets_DnGCFJIk.mjs';
import { $ as $$Search } from '../chunks/Search_DRijNmjT.mjs';
import { $ as $$ArrowRight } from '../chunks/ArrowRight_DHpL23vW.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$Clock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Clock;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "clock", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<circle cx="12" cy="12" r="10"></circle> <polyline points="12 6 12 12 16 14"></polyline> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/Clock.astro", void 0);

const $$Astro = createAstro();
const $$Shuffle = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Shuffle;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "shuffle", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="m18 14 4 4-4 4"></path> <path d="m18 2 4 4-4 4"></path> <path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"></path> <path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"></path> <path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"></path> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/Shuffle.astro", void 0);

const $$Participar = createComponent(async ($$result, $$props, $$slots) => {
  const initialTickets = await getDBTickets("", "all", 60);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Reserva de N\xFAmeros Estilo Cine | Valdivia Automotores" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="bg-navy py-10 text-white"> <div class="container-app"> <span class="text-sm font-semibold uppercase tracking-[0.16em] text-brand-light">Paso 1 de 3</span> <h1 class="mt-2 font-display text-3xl font-800 sm:text-4xl">Reservá tus números en tiempo real</h1> <p class="mt-2 max-w-xl text-white/75">
Elegí tus boletos en la grilla estilo las butacas de un cine. Los números que selecciones quedarán **congelados exclusivamente para vos** durante 10 minutos.
</p> </div> </section>  <div id="reservation-timer-bar" class="hidden bg-brand py-3 text-white shadow-md sticky top-16 z-40"> <div class="container-app flex flex-wrap items-center justify-between gap-3 text-sm font-700"> <div class="flex items-center gap-2"> ${renderComponent($$result2, "Clock", $$Clock, { "class": "h-5 w-5 animate-pulse text-gold" })} <span>Reserva activa: <strong id="selected-count-badge">0</strong> boletos congelados</span> </div> <div class="flex items-center gap-2 rounded-lg bg-navy px-3 py-1 text-gold font-display text-base"> <span>Expira en:</span> <span id="countdown-timer">09:59</span> </div> </div> </div> <div class="container-app grid gap-8 py-10 lg:grid-cols-[1fr_360px]"> <!-- Contenido Izquierdo: Mapa de Boletos --> <div class="space-y-6"> <div class="card p-6"> <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> <div> <h2 class="font-display text-lg font-700 text-navy">Selección de Butacas / Boletos</h2> <p class="text-xs text-navy/60">Tocá cualquier casilla verde para congelarla inmediatamente</p> </div> <button type="button" id="btn-random" class="btn-secondary text-sm py-2 px-3"> ${renderComponent($$result2, "Shuffle", $$Shuffle, { "class": "h-4 w-4 text-brand" })}
Selección Aleatoria
</button> </div> <div class="mt-4 flex items-center gap-3"> <div class="relative flex-1"> ${renderComponent($$result2, "Search", $$Search, { "class": "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" })} <input type="text" id="search-ticket" placeholder="Buscar boleto específico (ej. 00042)..."${addAttribute(5, "maxLength")} class="h-11 w-full rounded-xl border border-navy/15 pl-10 pr-4 text-sm font-display text-navy focus:border-brand focus:outline-none"> </div> </div> <!-- Leyenda de Estados Cine --> <div class="mt-5 flex flex-wrap items-center gap-6 text-xs font-700 text-navy/70 border-t border-navy/10 pt-4"> <span class="flex items-center gap-2"><span class="h-4 w-4 rounded-md bg-emerald-100 border-2 border-emerald-500 shadow-sm"></span> 🟢 Disponible</span> <span class="flex items-center gap-2"><span class="h-4 w-4 rounded-md bg-amber-400 border-2 border-amber-600 shadow-sm"></span> 🟡 Tu Reserva (Congelado)</span> <span class="flex items-center gap-2"><span class="h-4 w-4 rounded-md bg-slate-200 border border-slate-400 opacity-60"></span> 🔴 Ocupado / Vendido</span> </div> </div> <!-- Grilla Interactiva estilo Cine --> <div class="card p-6"> <div class="flex items-center justify-between mb-4"> <h3 class="font-display text-base font-700 text-navy">Mapa de números disponibles</h3> <span class="text-xs font-600 text-brand flex items-center gap-1"> <span class="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span> Sincronizado en vivo
</span> </div> <div id="grid-container" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5"> ${initialTickets.map((t) => renderTemplate`<button type="button"${addAttribute(t.number, "data-number")} class="seat-btn group relative rounded-xl border-2 py-3 text-center font-display text-xs font-800 transition-all duration-200 shadow-sm border-emerald-500/40 bg-emerald-50 text-emerald-950 hover:bg-emerald-100 hover:scale-105"> <span class="seat-num">${t.number}</span> </button>`)} </div> </div> </div> <!-- Resumen sticky --> <aside class="lg:sticky lg:top-24 lg:self-start"> <div class="card p-6"> <h3 class="font-display text-lg font-700 text-navy">Tu compra</h3> <dl class="mt-4 space-y-3 text-sm"> <div class="flex items-center justify-between"> <dt class="text-navy/60">Cantidad de números</dt> <dd class="font-700 text-navy" id="sum-qty">0</dd> </div> <div class="flex items-center justify-between"> <dt class="text-navy/60">Precio unitario</dt> <dd class="font-700 text-navy" id="sum-unit">${formatCurrency(raffle.ticketBasePrice)}</dd> </div> <div class="h-px bg-navy/10"></div> <div class="flex items-center justify-between"> <dt class="font-display text-base font-700 text-navy">Total</dt> <dd class="font-display text-2xl font-800 text-brand" id="sum-total">${formatCurrency(0)}</dd> </div> </dl> <button id="btn-submit-checkout" class="btn-primary mt-6 w-full">
Continuar al pago
${renderComponent($$result2, "ArrowRight", $$ArrowRight, { "class": "h-5 w-5" })} </button> <p class="mt-3 text-center text-xs text-navy/50">Pago seguro con Mercado Pago</p> </div> </aside> </div> ` })} ${renderScript($$result, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/participar.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/participar.astro", void 0);

const $$file = "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/participar.astro";
const $$url = "/participar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Participar,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
