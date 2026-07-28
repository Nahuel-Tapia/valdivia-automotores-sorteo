import { c as createComponent, m as maybeRenderHead, s as spreadAttributes, e as addAttribute, f as renderSlot, a as renderTemplate, b as createAstro, r as renderComponent, g as renderHead } from './astro/server_DaRN7h1c.mjs';
import 'piccolore';
/* empty css                         */
import { $ as $$Image } from './_astro_assets_4TwwqjQN.mjs';
import 'clsx';
import { r as raffle } from './raffle_BobqFDMx.mjs';

const $$Astro$5 = createAstro();
const $$ = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$;
  const size = Astro2.props.size;
  const cls = Astro2.props.class;
  const name = Astro2.props.iconName;
  delete Astro2.props.size;
  delete Astro2.props.class;
  delete Astro2.props.iconName;
  const props = Object.assign({
    "xmlns": "http://www.w3.org/2000/svg",
    "stroke-width": 2,
    "width": size ?? 24,
    "height": size ?? 24,
    "stroke": "currentColor",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "fill": "none",
    "viewBox": "0 0 24 24"
  }, Astro2.props);
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(props)}${addAttribute(["lucide", { [`lucide-${name}`]: name }, cls], "class:list")}> ${renderSlot($$result, $$slots["default"])} </svg>`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/.Layout.astro", void 0);

const $$Astro$4 = createAstro();
const $$Lock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Lock;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "lock", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect> <path d="M7 11V7a5 5 0 0 1 10 0v4"></path> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/Lock.astro", void 0);

const $$Astro$3 = createAstro();
const $$MessageCircle = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$MessageCircle;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "message-circle", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/MessageCircle.astro", void 0);

const $$Astro$2 = createAstro();
const $$ShieldCheck = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ShieldCheck;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "shield-check", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path> <path d="m9 12 2 2 4-4"></path> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/ShieldCheck.astro", void 0);

const $$Astro$1 = createAstro();
const $$Ticket = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Ticket;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "ticket", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path> <path d="M13 5v2"></path> <path d="M13 17v2"></path> <path d="M13 11v2"></path> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/Ticket.astro", void 0);

const logoValdivia = new Proxy({"src":"/_astro/logo-valdivia.DgiURDTx.png","width":447,"height":447,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/assets/logo-valdivia.png";
							}
							
							return target[name];
						}
					});

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-50 border-b border-navy/10 bg-white/90 backdrop-blur"> <div class="container-app flex h-16 items-center justify-between gap-4"> <a href="/" class="flex items-center gap-3"> ${renderComponent($$result, "Image", $$Image, { "src": logoValdivia, "alt": "Valdivia Automotores", "width": 40, "height": 40, "class": "h-10 w-10 rounded-lg object-contain" })} <span class="flex flex-col leading-tight"> <span class="font-display text-base font-800 tracking-tight text-navy">Valdivia</span> <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Automotores</span> </span> </a> <nav class="hidden items-center gap-8 md:flex" aria-label="Principal"> <a href="/#premio" class="text-sm font-semibold text-navy/70 transition hover:text-navy">El premio</a> <a href="/#como-participar" class="text-sm font-semibold text-navy/70 transition hover:text-navy">Cómo participar</a> <a href="/mis-boletos" class="text-sm font-semibold text-navy/70 transition hover:text-navy">Mis boletos</a> <a href="/#faq" class="text-sm font-semibold text-navy/70 transition hover:text-navy">Preguntas Frecuentes</a> <a href="/#bases" class="text-sm font-semibold text-navy/70 transition hover:text-navy">Bases</a> </nav> <a href="/participar" class="btn-primary px-4 py-2 text-sm"> ${renderComponent($$result, "Ticket", $$Ticket, { "class": "h-4 w-4" })}
Participar
</a> </div> </header>`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="mt-20 border-t border-navy/10 bg-navy text-white"> <div class="container-app grid gap-10 py-12 md:grid-cols-3"> <div> <div class="flex items-center gap-3"> ${renderComponent($$result, "Image", $$Image, { "src": logoValdivia, "alt": "Valdivia Automotores", "width": 44, "height": 44, "class": "h-11 w-11 rounded-lg bg-white/95 object-contain p-1" })} <span class="font-display text-lg font-700">Valdivia Automotores</span> </div> <p class="mt-4 max-w-xs text-sm leading-relaxed text-white/70"> ${raffle.brand} organiza sorteos oficiales con total transparencia y respaldo. Jugá seguro, jugá con nosotros.
</p> </div> <div class="text-sm"> <h3 class="font-display text-sm font-700 uppercase tracking-wider text-brand-light">Sorteo</h3> <ul class="mt-4 space-y-2 text-white/70"> <li><a href="/#premio" class="transition hover:text-white">El premio</a></li> <li><a href="/#como-participar" class="transition hover:text-white">Cómo participar</a></li> <li><a href="/participar" class="transition hover:text-white">Comprar números</a></li> <li><a href="/#bases" class="transition hover:text-white">Bases y condiciones</a></li> </ul> </div> <div class="text-sm"> <h3 class="font-display text-sm font-700 uppercase tracking-wider text-brand-light">Pago seguro</h3> <ul class="mt-4 space-y-3 text-white/70"> <li class="flex items-center gap-2">${renderComponent($$result, "ShieldCheck", $$ShieldCheck, { "class": "h-4 w-4 text-brand-light" })} Compra protegida</li> <li class="flex items-center gap-2">${renderComponent($$result, "Lock", $$Lock, { "class": "h-4 w-4 text-brand-light" })} Datos encriptados</li> </ul> <p class="mt-4 text-xs text-white/50">Aceptamos Mercado Pago, tarjetas y transferencias.</p> </div> </div> <div class="border-t border-white/10 py-5"> <div class="container-app flex flex-col items-center justify-between gap-2 text-xs text-white/50 sm:flex-row"> <p>© ${year} Valdivia Automotores. Todos los derechos reservados.</p> <p>Sorteo con fines de demostración. Sitio de ejemplo.</p> </div> </div> </footer>`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/components/Footer.astro", void 0);

const $$FloatingSupport = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<aside class="fixed bottom-6 right-6 z-50"> <a href="https://wa.me/5491155555555?text=Hola,%20tengo%20una%20consulta%20sobre%20el%20sorteo%20de%20Valdivia%20Automotores" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#20ba5a] hover:shadow-xl active:scale-95" aria-label="Asistencia por WhatsApp"> ${renderComponent($$result, "MessageCircle", $$MessageCircle, { "class": "h-6 w-6 fill-current" })} <span class="max-w-0 overflow-hidden whitespace-nowrap font-display text-sm font-700 transition-all duration-300 group-hover:max-w-xs sm:max-w-xs">
¿Necesitás ayuda?
</span> </a> </aside>`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/components/FloatingSupport.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Valdivia Automotores | Gran Sorteo Sed\xE1n 0km",
    description = "Particip\xE1 del gran sorteo de un sed\xE1n 0km de Valdivia Automotores. Compr\xE1 tus n\xFAmeros online con Mercado Pago de forma r\xE1pida y segura."
  } = Astro2.props;
  return renderTemplate`<html lang="es" class="bg-cloud"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#1f2a52"><meta name="description"${addAttribute(description, "content")}><link rel="icon" type="image/png" href="/logo-valdivia.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet"><title>${title}</title>${renderHead()}</head> <body class="min-h-screen flex flex-col"> ${renderComponent($$result, "Header", $$Header, {})} <main class="flex-1"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} ${renderComponent($$result, "FloatingSupport", $$FloatingSupport, {})} </body></html>`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/layouts/Layout.astro", void 0);

export { $$ as $, $$Layout as a, $$Lock as b, $$Ticket as c, $$ShieldCheck as d, logoValdivia as l };
