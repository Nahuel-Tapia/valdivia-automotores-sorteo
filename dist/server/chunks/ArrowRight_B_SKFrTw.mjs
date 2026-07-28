import { c as createComponent, r as renderComponent, m as maybeRenderHead, a as renderTemplate, b as createAstro } from './astro/server_DaRN7h1c.mjs';
import 'piccolore';
import { $ as $$ } from './Layout_LZPCddmC.mjs';

const $$Astro = createAstro();
const $$ArrowRight = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ArrowRight;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "arrow-right", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M5 12h14"></path> <path d="m12 5 7 7-7 7"></path> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/ArrowRight.astro", void 0);

export { $$ArrowRight as $ };
