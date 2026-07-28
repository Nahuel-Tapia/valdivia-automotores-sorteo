import { c as createComponent, r as renderComponent, m as maybeRenderHead, a as renderTemplate, b as createAstro } from './astro/server_DaRN7h1c.mjs';
import 'piccolore';
import { $ as $$ } from './Layout_LZPCddmC.mjs';

const $$Astro = createAstro();
const $$Clock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Clock;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "clock", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<circle cx="12" cy="12" r="10"></circle> <polyline points="12 6 12 12 16 14"></polyline> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/Clock.astro", void 0);

export { $$Clock as $ };
