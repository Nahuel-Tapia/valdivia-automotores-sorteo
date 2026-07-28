/* empty css                                 */
import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DaRN7h1c.mjs';
import 'piccolore';
import { a as $$Layout } from '../chunks/Layout_LZPCddmC.mjs';
import { $ as $$Search } from '../chunks/Search_DJgzmcW-.mjs';
export { renderers } from '../renderers.mjs';

const $$MisBoletos = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Mis Boletos de la Suerte | Valdivia Automotores" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="bg-navy py-12 text-white"> <div class="container-app text-center"> <span class="text-xs font-semibold uppercase tracking-widest text-brand-light">Consulta Pública</span> <h1 class="mt-2 font-display text-3xl font-800 sm:text-4xl">Consultá tus números de la suerte</h1> <p class="mt-2 max-w-xl mx-auto text-white/75 text-sm">
Ingresá tu DNI o Correo electrónico registrado para verificar tus compras y consultar tus boletos asignados para el sorteo del Sedán 0km.
</p> </div> </section> <div class="container-app py-12"> <!-- Formulario de Búsqueda --> <div class="mx-auto max-w-xl card p-6 sm:p-8 shadow-xl"> <form id="lookup-form" class="space-y-4"> <label class="block"> <span class="text-xs font-700 text-navy/70 uppercase">Tu DNI o Correo Electrónico</span> <div class="relative mt-1"> ${renderComponent($$result2, "Search", $$Search, { "class": "absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-navy/40" })} <input required type="text" id="lookup-query" placeholder="Ej: 30123456 o tu@email.com" class="h-12 w-full rounded-xl border border-navy/15 pl-11 pr-4 text-base font-display text-navy focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"> </div> </label> <button type="submit" id="btn-lookup" class="btn-primary w-full py-3.5 font-display text-base">
Buscar Mis Boletos
</button> </form> </div> <!-- Resultados de Búsqueda --> <div id="results-section" class="mx-auto max-w-2xl mt-10 hidden space-y-6"> <div id="results-container"> <!-- Renderizado dinámico --> </div> </div> </div> ` })} ${renderScript($$result, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/mis-boletos.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/mis-boletos.astro", void 0);

const $$file = "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/mis-boletos.astro";
const $$url = "/mis-boletos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MisBoletos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
