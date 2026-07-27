/* empty css                                 */
import { c as createComponent, r as renderComponent, m as maybeRenderHead, a as renderTemplate, b as createAstro, d as renderScript } from '../chunks/astro/server_DaRN7h1c.mjs';
import 'piccolore';
import { $ as $$, a as $$Layout, b as $$Lock, c as $$Ticket } from '../chunks/Layout_BQx7d89A.mjs';
import { $ as $$Search } from '../chunks/Search_DRijNmjT.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$2 = createAstro();
const $$DollarSign = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$DollarSign;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "dollar-sign", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<line x1="12" x2="12" y1="2" y2="22"></line> <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/DollarSign.astro", void 0);

const $$Astro$1 = createAstro();
const $$Download = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Download;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "download", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path> <polyline points="7 10 12 15 17 10"></polyline> <line x1="12" x2="12" y1="15" y2="3"></line> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/Download.astro", void 0);

const $$Astro = createAstro();
const $$LogOut = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LogOut;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "log-out", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path> <polyline points="16 17 21 12 16 7"></polyline> <line x1="21" x2="9" y1="12" y2="12"></line> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/LogOut.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Panel de Administraci\xF3n | Valdivia Automotores" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="bg-navy py-8 text-white"> <div class="container-app flex items-center justify-between"> <div> <span class="text-xs font-semibold uppercase tracking-widest text-brand-light">Dashboard Privado</span> <h1 class="mt-1 font-display text-2xl font-800 sm:text-3xl">Administración de Sorteo</h1> </div> <div class="flex items-center gap-3"> <a id="btn-export-csv" href="/api/admin/export" class="hidden btn-primary text-xs py-2 px-3 bg-brand text-white"> ${renderComponent($$result2, "Download", $$Download, { "class": "h-4 w-4" })}
Exportar CSV
</a> <button id="btn-logout" class="hidden btn-secondary text-xs py-2 px-3 bg-white/10 border-white/20 text-white hover:bg-white/20"> ${renderComponent($$result2, "LogOut", $$LogOut, { "class": "h-4 w-4" })}
Cerrar Sesión
</button> </div> </div> </section>  <div id="login-section" class="container-app py-16"> <div class="mx-auto max-w-md card p-8"> <div class="flex items-center gap-3 border-b border-navy/10 pb-4"> <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand"> ${renderComponent($$result2, "Lock", $$Lock, { "class": "h-5 w-5" })} </span> <div> <h2 class="font-display text-lg font-700 text-navy">Acceso Administrador</h2> <p class="text-xs text-navy/60">Ingresá tus credenciales oficiales</p> </div> </div> <form id="admin-login-form" class="mt-6 space-y-4"> <label class="block"> <span class="text-xs font-700 text-navy/70 uppercase">Email</span> <input required type="email" id="admin-email" class="mt-1 h-11 w-full rounded-xl border border-navy/15 px-3 text-sm text-navy focus:border-brand focus:outline-none" placeholder="admin@valdivia.com"> </label> <label class="block"> <span class="text-xs font-700 text-navy/70 uppercase">Contraseña</span> <input required type="password" id="admin-password" class="mt-1 h-11 w-full rounded-xl border border-navy/15 px-3 text-sm text-navy focus:border-brand focus:outline-none" placeholder="••••••••"> </label> <button type="submit" id="btn-login" class="btn-primary mt-2 w-full">
Ingresar al Panel
</button> </form> </div> </div>  <div id="dashboard-section" class="container-app hidden py-12 space-y-8"> <!-- Tarjetas de Métricas --> <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"> <div class="card p-5"> <div class="flex items-center justify-between"> <span class="text-xs font-700 uppercase tracking-wider text-navy/50">Recaudación Total</span> <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand"> ${renderComponent($$result2, "DollarSign", $$DollarSign, { "class": "h-5 w-5" })} </span> </div> <p class="mt-3 font-display text-2xl font-800 text-navy" id="m-revenue">$0</p> <p class="mt-1 text-xs text-navy/60"><span id="m-approved-orders">0</span> órdenes aprobadas</p> </div> <div class="card p-5"> <div class="flex items-center justify-between"> <span class="text-xs font-700 uppercase tracking-wider text-navy/50">Boletos Vendidos</span> <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-600"> ${renderComponent($$result2, "Ticket", $$Ticket, { "class": "h-5 w-5" })} </span> </div> <p class="mt-3 font-display text-2xl font-800 text-navy" id="m-paid">0</p> <p class="mt-1 text-xs text-navy/60">Confirmados en DB</p> </div> <div class="card p-5"> <div class="flex items-center justify-between"> <span class="text-xs font-700 uppercase tracking-wider text-navy/50">Boletos Reservados</span> <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600"> ${renderComponent($$result2, "Ticket", $$Ticket, { "class": "h-5 w-5" })} </span> </div> <p class="mt-3 font-display text-2xl font-800 text-navy" id="m-reserved">0</p> <p class="mt-1 text-xs text-navy/60">Tiempo en ventana de 15m</p> </div> <div class="card p-5"> <div class="flex items-center justify-between"> <span class="text-xs font-700 uppercase tracking-wider text-navy/50">Boletos Disponibles</span> <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600"> ${renderComponent($$result2, "Ticket", $$Ticket, { "class": "h-5 w-5" })} </span> </div> <p class="mt-3 font-display text-2xl font-800 text-navy" id="m-available">10.000</p> <p class="mt-1 text-xs text-navy/60">De 10.000 totales</p> </div> </div> <!-- Tabla de Últimas Órdenes y Buscador --> <div class="card p-6"> <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4"> <div> <h2 class="font-display text-lg font-700 text-navy">Gestión de Órdenes y Participantes</h2> <p class="text-xs text-navy/60">Buscá y gestioná las compras registradas en tiempo real</p> </div> <div class="relative w-full sm:w-64"> ${renderComponent($$result2, "Search", $$Search, { "class": "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" })} <input type="text" id="search-orders" placeholder="Buscar por DNI, Nombre o ID..." class="h-9 w-full rounded-xl border border-navy/15 pl-9 pr-3 text-xs text-navy focus:border-brand focus:outline-none"> </div> </div> <div class="overflow-x-auto"> <table class="w-full text-left text-sm"> <thead class="border-b border-navy/10 text-xs font-700 uppercase text-navy/50"> <tr> <th class="pb-3">ID Orden</th> <th class="pb-3">Comprador</th> <th class="pb-3">Email</th> <th class="pb-3">Boletos</th> <th class="pb-3">Monto</th> <th class="pb-3">Estado</th> <th class="pb-3 text-right">Acción</th> </tr> </thead> <tbody id="orders-table-body" class="divide-y divide-navy/5 font-500"> <tr> <td colspan="7" class="py-4 text-center text-navy/50">Cargando órdenes...</td> </tr> </tbody> </table> </div> </div> </div> ` })} ${renderScript($$result, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/admin/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/admin/index.astro", void 0);

const $$file = "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
