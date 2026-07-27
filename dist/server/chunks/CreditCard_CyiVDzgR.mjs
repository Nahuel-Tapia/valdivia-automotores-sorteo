import { c as createComponent, r as renderComponent, a as renderTemplate, b as createAstro, m as maybeRenderHead } from './astro/server_DaRN7h1c.mjs';
import 'piccolore';
import { $ as $$ } from './Layout_BQx7d89A.mjs';

const $$Astro = createAstro();
const $$CreditCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CreditCard;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "credit-card", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<rect width="20" height="14" x="2" y="5" rx="2"></rect> <line x1="2" x2="22" y1="10" y2="10"></line> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/CreditCard.astro", void 0);

export { $$CreditCard as $ };
